// @ts-check
/**
 * Pure unit tests for assets/js/story/roi-model.js and the business-case data.
 * No browser: the model has no DOM dependency. Runs once, in the chromium project only.
 */
const { test, expect } = require('@playwright/test');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ROIModel = require(path.join(ROOT, 'assets/js/story/roi-model.js'));
const DATA = require(path.join(ROOT, 'assets/data/business-case.js'));

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'pure unit tests run once');
});

function expected() {
  return ROIModel.createAssumptions(DATA, 'expected');
}

test.describe('ROI model: task savings', () => {
  test('illustrative review totals 12.0 hours', () => {
    const s = ROIModel.calculateTaskSavings(expected().categories, { includeRework: true });
    expect(s.currentHours).toBeCloseTo(12.0, 6);
    expect(s.judgementHours).toBeCloseTo(3.0, 6);
  });

  test('gross saved hours per category are hours times preparation rate', () => {
    const s = ROIModel.calculateTaskSavings(expected().categories, { includeRework: true });
    const byId = Object.fromEntries(s.rows.map((r) => [r.id, r.grossSaved]));
    expect(byId.find).toBeCloseTo(2.125, 6);
    expect(byId.reconcile).toBeCloseTo(1.6, 6);
    expect(byId.coordinate).toBeCloseTo(1.4, 6);
    expect(byId.reenter).toBeCloseTo(0.9, 6);
    expect(byId.rework).toBeCloseTo(0.825, 6);
    expect(s.grossSavedHours).toBeCloseTo(6.85, 6);
  });

  test('professional judgement stays at zero automation, whatever rate is passed in', () => {
    const cats = expected().categories.map((c) => (c.id === 'judgement' ? { ...c, rate: 0.9 } : c));
    const s = ROIModel.calculateTaskSavings(cats, { includeRework: true });
    const judgement = s.rows.find((r) => r.id === 'judgement');
    expect(judgement.rate).toBe(0);
    expect(judgement.grossSaved).toBe(0);
  });

  test('conservative case excludes rework savings', () => {
    const s = ROIModel.calculateTaskSavings(expected().categories, { includeRework: false });
    expect(s.grossSavedHours).toBeCloseTo(6.025, 6);
  });
});

test.describe('ROI model: capacity and value', () => {
  test('expected illustration returns about 5.8 net hours, about 48% of direct effort', () => {
    const r = ROIModel.calculateBusinessCase(expected(), DATA.bounds);
    expect(r.capacity.netSavedHoursPerReview).toBeGreaterThan(5.75);
    expect(r.capacity.netSavedHoursPerReview).toBeLessThan(5.85);
    expect(Math.round(r.capacity.netCapacityShare * 100)).toBe(48);
  });

  test('expected illustration is about EUR 580k gross capacity value at 1,000 reviews', () => {
    const r = ROIModel.calculateBusinessCase(expected(), DATA.bounds);
    expect(r.value.annualGrossCapacityValue).toBeGreaterThan(575000);
    expect(r.value.annualGrossCapacityValue).toBeLessThan(585000);
  });

  test('direct effort reduction sits between gross preparation and net capacity', () => {
    const r = ROIModel.calculateBusinessCase(expected(), DATA.bounds);
    expect(r.capacity.directEffortHours).toBeLessThan(r.savings.grossSavedHours);
    expect(r.capacity.directEffortHours).toBeGreaterThan(r.capacity.netSavedHoursPerReview);
  });

  test('FTE-equivalent capacity divides annual hours by productive hours', () => {
    const r = ROIModel.calculateBusinessCase(expected(), DATA.bounds);
    expect(r.capacity.fteEquivalentCapacity).toBeCloseTo(r.capacity.annualCapacityHours / 1600, 6);
  });

  test('scenario ladder orders conservative below expected', () => {
    const c = ROIModel.calculateBusinessCase(ROIModel.createAssumptions(DATA, 'conservative'), DATA.bounds);
    const e = ROIModel.calculateBusinessCase(expected(), DATA.bounds);
    const s = ROIModel.calculateBusinessCase(ROIModel.createAssumptions(DATA, 'stretch'), DATA.bounds);
    expect(c.capacity.netSavedHoursPerReview).toBeLessThan(e.capacity.netSavedHoursPerReview);
    expect(s.roi.roi).toBeGreaterThan(e.roi.roi);
    expect(c.elapsed.counted).toBe(false);
    expect(e.elapsed.counted).toBe(true);
  });

  test('applyScenario keeps edited hours and costs', () => {
    const a = expected();
    a.categories[0].hours = 4;
    a.loadedHourlyCost = 120;
    const b = ROIModel.applyScenario(a, DATA, 'conservative');
    expect(b.categories[0].hours).toBe(4);
    expect(b.loadedHourlyCost).toBe(120);
    expect(b.adoption).toBe(DATA.scenarios.conservative.adoption);
  });

  test('no scenario includes avoided regulatory findings', () => {
    Object.values(DATA.scenarios).forEach((s) => {
      expect(Object.keys(s).join(' ').toLowerCase()).not.toContain('regulat');
    });
  });
});

test.describe('ROI model: payback and ROI edge cases', () => {
  test('payback is build cost over monthly net value', () => {
    const p = ROIModel.calculatePayback(600000, 431000);
    expect(p.months).toBeCloseTo(600000 / (431000 / 12), 6);
    expect(p.positive).toBe(true);
  });

  test('zero annual net value returns Not yet positive, not an invalid payback', () => {
    const p = ROIModel.calculatePayback(600000, 0);
    expect(p.months).toBeNull();
    expect(p.label).toBe('Not yet positive');
  });

  test('negative annual net value returns Not yet positive', () => {
    const a = expected();
    a.runCost = { platform: 5000000 };
    const r = ROIModel.calculateBusinessCase(a, DATA.bounds);
    expect(r.value.annualNetValue).toBeLessThan(0);
    expect(r.payback.label).toBe('Not yet positive');
    expect(Number.isFinite(r.payback.months)).toBe(false);
  });

  test('zero build cost does not divide by zero in ROI', () => {
    const a = expected();
    a.buildCost = 0;
    const r = ROIModel.calculateBusinessCase(a, DATA.bounds);
    expect(r.roi.roi).toBeNull();
    expect(r.payback.months).toBe(0);
  });

  test('three-year ROI adds avoided build cost from reuse only when reuse is assumed', () => {
    const e = ROIModel.calculateBusinessCase(expected(), DATA.bounds);
    const s = ROIModel.calculateBusinessCase(ROIModel.createAssumptions(DATA, 'stretch'), DATA.bounds);
    expect(e.roi.avoidedBuildCostFromReuse).toBe(0);
    expect(s.roi.avoidedBuildCostFromReuse).toBeCloseTo(600000 * 0.6, 6);
  });

  test('cost per completed controlled review includes platform cost', () => {
    const r = ROIModel.calculateBusinessCase(expected(), DATA.bounds);
    expect(r.costPerReview.before).toBeCloseTo(1200, 6);
    expect(r.costPerReview.platformPerReview).toBeCloseTo((150000 + 600000 / 3) / 1000, 6);
    expect(r.costPerReview.after).toBeLessThan(r.costPerReview.before);
  });
});

test.describe('ROI model: validation', () => {
  test('illustrative defaults are valid', () => {
    expect(ROIModel.validateAssumptions(expected(), DATA.bounds).errors).toEqual([]);
  });

  test('out-of-bounds values are reported and clamped', () => {
    const a = expected();
    a.categories[0].rate = 1.5;
    a.adoption = -0.2;
    const v = ROIModel.validateAssumptions(a, DATA.bounds);
    expect(v.valid).toBe(false);
    expect(v.value.categories[0].rate).toBe(DATA.bounds.rate.max);
    expect(v.value.adoption).toBe(0);
  });

  test('a judgement rate above zero is an error and is reset to zero', () => {
    const a = expected();
    a.categories.find((c) => c.id === 'judgement').rate = 0.4;
    const v = ROIModel.validateAssumptions(a, DATA.bounds);
    expect(v.errors.map((e) => e.field)).toContain('judgement.rate');
    expect(v.value.categories.find((c) => c.id === 'judgement').rate).toBe(0);
  });

  test('non-numeric input is reported, not propagated as NaN', () => {
    const a = expected();
    a.annualReviewVolume = 'lots';
    const r = ROIModel.calculateBusinessCase(a, DATA.bounds);
    expect(r.errors.map((e) => e.field)).toContain('annualReviewVolume');
    expect(Number.isFinite(r.capacity.annualCapacityHours)).toBe(true);
  });

  test('preparation rates are capped below 100 percent', () => {
    expect(DATA.bounds.rate.max).toBeLessThan(1);
  });
});

test.describe('Business-case data', () => {
  test('every default carries the illustrative label', () => {
    expect(DATA.defaultLabel).toBe('Illustrative only. Replace with client baseline.');
  });

  test('data module is frozen', () => {
    expect(Object.isFrozen(DATA)).toBe(true);
    expect(Object.isFrozen(DATA.categories[0])).toBe(true);
  });

  test('judgement category is not eligible for preparation', () => {
    const j = DATA.categories.find((c) => c.id === 'judgement');
    expect(j.eligible).toBe(false);
    expect(j.rate).toBe(0);
  });
});
