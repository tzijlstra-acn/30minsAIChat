// -- ROI MODEL -- pure business-case calculations for one completed periodic review --
// No DOM access. Scenes call these functions; tests call them directly in Node.
// Three measures are kept apart on purpose:
//   1. task preparation rate   -- share of a bounded task prepared automatically
//   2. direct effort reduction -- hours removed from one completed review after review and exceptions
//   3. net capacity release    -- usable capacity after adoption, exception leakage and conversion
// Professional judgement is never prepared automatically: its rate is always zero.
// Exposes: window.ROIModel (browser) and module.exports (Node).

(function(global) {
  'use strict';

  function num(value, fallback) {
    var n = typeof value === 'number' ? value : parseFloat(value);
    return isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  // A cost may be one number or an object of cost lines; both total to one number.
  function total(cost) {
    if (cost && typeof cost === 'object') {
      return Object.keys(cost).reduce(function(sum, key) { return sum + Math.max(0, num(cost[key], 0)); }, 0);
    }
    return Math.max(0, num(cost, 0));
  }

  function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // ── Assumption sets ──

  function scenarioFields(scenario) {
    return {
      adoption: scenario.adoption,
      exceptionLeakage: scenario.exceptionLeakage,
      capacityConversion: scenario.capacityConversion,
      includeRework: scenario.includeRework,
      countElapsed: scenario.countElapsed,
      reuseShare: scenario.reuseShare
    };
  }

  // Complete assumption set from the data module defaults plus one scenario.
  function createAssumptions(data, scenarioId) {
    var id = data.scenarios[scenarioId] ? scenarioId : data.defaults.scenario;
    var base = copy(data.defaults);
    base.scenario = id;
    base.categories = data.categories.map(function(c) {
      return { id: c.id, label: c.label, hours: c.hours, rate: c.eligible ? c.rate : 0, eligible: c.eligible };
    });
    var fields = scenarioFields(data.scenarios[id]);
    Object.keys(fields).forEach(function(key) { base[key] = fields[key]; });
    return base;
  }

  // Switch scenario but keep the hours, rates, volumes and costs already entered.
  function applyScenario(assumptions, data, scenarioId) {
    var next = copy(assumptions);
    if (!data.scenarios[scenarioId]) return next;
    next.scenario = scenarioId;
    var fields = scenarioFields(data.scenarios[scenarioId]);
    Object.keys(fields).forEach(function(key) { next[key] = fields[key]; });
    return next;
  }

  // ── Calculations ──

  // Gross hours removed per review. gross_saved_hours_i = current_hours_i * preparation_rate_i
  function calculateTaskSavings(categories, options) {
    var includeRework = !options || options.includeRework !== false;
    var rows = (categories || []).map(function(c) {
      var hours = Math.max(0, num(c.hours, 0));
      var rate = c.eligible === false ? 0 : clamp(num(c.rate, 0), 0, 1);
      var counted = c.id === 'rework' ? includeRework : true;
      var grossSaved = counted ? hours * rate : 0;
      return {
        id: c.id, label: c.label, eligible: c.eligible !== false,
        hours: hours, rate: rate, counted: counted,
        grossSaved: grossSaved, remaining: hours - grossSaved
      };
    });
    var currentHours = rows.reduce(function(s, r) { return s + r.hours; }, 0);
    var grossSavedHours = rows.reduce(function(s, r) { return s + r.grossSaved; }, 0);
    var judgementHours = rows.filter(function(r) { return r.eligible === false; })
      .reduce(function(s, r) { return s + r.hours; }, 0);
    return { rows: rows, currentHours: currentHours, grossSavedHours: grossSavedHours, judgementHours: judgementHours };
  }

  // net_saved = gross * adoption * (1 - exception_leakage) * capacity_conversion
  function calculateAnnualCapacity(assumptions, savings) {
    var adoption = clamp(num(assumptions.adoption, 0), 0, 1);
    var leakage = clamp(num(assumptions.exceptionLeakage, 0), 0, 1);
    var conversion = clamp(num(assumptions.capacityConversion, 0), 0, 1);
    var volume = Math.max(0, num(assumptions.annualReviewVolume, 0));
    var productive = Math.max(0, num(assumptions.productiveHoursPerFte, 0));

    var directEffortHours = savings.grossSavedHours * adoption * (1 - leakage);
    var netSavedHoursPerReview = directEffortHours * conversion;
    var annualCapacityHours = netSavedHoursPerReview * volume;

    return {
      realisation: adoption * (1 - leakage) * conversion,
      directEffortHours: directEffortHours,
      directEffortReduction: savings.currentHours > 0 ? directEffortHours / savings.currentHours : 0,
      netSavedHoursPerReview: netSavedHoursPerReview,
      netCapacityShare: savings.currentHours > 0 ? netSavedHoursPerReview / savings.currentHours : 0,
      annualCapacityHours: annualCapacityHours,
      fteEquivalentCapacity: productive > 0 ? annualCapacityHours / productive : 0
    };
  }

  // annual_net_value = annual_gross_capacity_value + measured_rework_value - annual_run_cost
  function calculateAnnualValue(assumptions, capacity) {
    var gross = capacity.annualCapacityHours * Math.max(0, num(assumptions.loadedHourlyCost, 0));
    var rework = Math.max(0, num(assumptions.measuredReworkValue, 0));
    var run = total(assumptions.runCost);
    return {
      annualGrossCapacityValue: gross,
      measuredReworkValue: rework,
      annualRunCost: run,
      annualNetValue: gross + rework - run
    };
  }

  // payback_months = one_time_build_cost / (annual_net_value / 12). Never divides by zero.
  function calculatePayback(oneTimeBuildCost, annualNetValue) {
    var build = total(oneTimeBuildCost);
    var net = num(annualNetValue, 0);
    if (net <= 0) return { months: null, positive: false, label: 'Not yet positive' };
    var months = build / (net / 12);
    return { months: months, positive: true, label: months.toFixed(1) + ' months' };
  }

  // three_year_roi = (three_year_net_benefit + avoided_build_cost_from_reuse - one_time_build_cost) / one_time_build_cost
  // three_year_net_benefit sums gross value and rework value on an adoption ramp, less run cost each year.
  function calculateThreeYearRoi(assumptions, value) {
    var build = total(assumptions.buildCost);
    var ramp = clamp(num(assumptions.rampYearOne, 1), 0, 1);
    var yearFactors = [ramp, 1, 1];
    var threeYearNetBenefit = yearFactors.reduce(function(sum, f) {
      return sum + (value.annualGrossCapacityValue + value.measuredReworkValue) * f - value.annualRunCost;
    }, 0);
    var avoided = build * clamp(num(assumptions.reuseShare, 0), 0, 1);
    if (build <= 0) {
      return { roi: null, threeYearNetBenefit: threeYearNetBenefit, avoidedBuildCostFromReuse: avoided, label: 'No build cost entered' };
    }
    var roi = (threeYearNetBenefit + avoided - build) / build;
    return { roi: roi, threeYearNetBenefit: threeYearNetBenefit, avoidedBuildCostFromReuse: avoided, label: Math.round(roi * 100) + '%' };
  }

  // Elapsed time: waiting removed from the review cycle. Not counted in the conservative case.
  function calculateElapsed(assumptions) {
    var days = Math.max(0, num(assumptions.elapsedDays, 0));
    if (assumptions.countElapsed === false) {
      return { counted: false, currentDays: days, futureDays: days, reduction: 0 };
    }
    var reduction = clamp(num(assumptions.waitingReduction, 0), 0, 1);
    return { counted: true, currentDays: days, futureDays: days * (1 - reduction), reduction: reduction };
  }

  // Rework hours per review before and after preparation, after adoption and exceptions.
  function calculateRework(assumptions, savings) {
    var row = savings.rows.filter(function(r) { return r.id === 'rework'; })[0];
    if (!row) return { before: 0, after: 0 };
    var adoption = clamp(num(assumptions.adoption, 0), 0, 1);
    var leakage = clamp(num(assumptions.exceptionLeakage, 0), 0, 1);
    return { before: row.hours, after: row.hours - row.grossSaved * adoption * (1 - leakage) };
  }

  // All-in cost of one completed controlled review: remaining labour plus platform cost per review.
  // Platform cost per review = (annual run cost + one-time build over three years) / annual volume.
  function calculateCostPerReview(assumptions, savings, capacity, value) {
    var rate = Math.max(0, num(assumptions.loadedHourlyCost, 0));
    var volume = Math.max(1, num(assumptions.annualReviewVolume, 1));
    var platformPerReview = (value.annualRunCost + total(assumptions.buildCost) / 3) / volume;
    var before = savings.currentHours * rate;
    var after = (savings.currentHours - capacity.directEffortHours) * rate + platformPerReview;
    return { before: before, after: after, platformPerReview: platformPerReview };
  }

  // ── Validation ──

  // Returns errors plus a corrected copy: values are clamped to bounds and
  // professional judgement is forced to zero preparation.
  function validateAssumptions(assumptions, bounds) {
    var errors = [];
    var value = copy(assumptions || {});
    var b = bounds || {};

    function check(field, raw, range, fallback) {
      var n = num(raw, NaN);
      if (isNaN(n)) {
        errors.push({ field: field, message: 'Not a number' });
        return fallback;
      }
      if (range && (n < range.min || n > range.max)) {
        errors.push({ field: field, message: 'Outside ' + range.min + ' to ' + range.max });
        return clamp(n, range.min, range.max);
      }
      return n;
    }

    value.categories = (value.categories || []).map(function(c) {
      var out = copy(c);
      out.hours = check(c.id + '.hours', c.hours, b.hours || { min: 0, max: 1000 }, 0);
      if (c.eligible === false) {
        if (num(c.rate, 0) > 0) errors.push({ field: c.id + '.rate', message: 'Professional judgement is not prepared automatically' });
        out.rate = 0;
      } else {
        out.rate = check(c.id + '.rate', c.rate, b.rate || { min: 0, max: 1 }, 0);
      }
      return out;
    });

    var factor = b.factor || { min: 0, max: 1 };
    ['adoption', 'exceptionLeakage', 'capacityConversion', 'waitingReduction', 'rampYearOne', 'reuseShare'].forEach(function(key) {
      if (value[key] !== undefined) value[key] = check(key, value[key], factor, 0);
    });

    value.annualReviewVolume = check('annualReviewVolume', value.annualReviewVolume, b.annualReviewVolume || { min: 1, max: 1e7 }, 1);
    value.loadedHourlyCost = check('loadedHourlyCost', value.loadedHourlyCost, b.loadedHourlyCost || { min: 0, max: 1e5 }, 0);
    value.productiveHoursPerFte = check('productiveHoursPerFte', value.productiveHoursPerFte, b.productiveHoursPerFte || { min: 1, max: 8760 }, 1600);
    value.elapsedDays = check('elapsedDays', value.elapsedDays, b.elapsedDays || { min: 0, max: 3650 }, 0);
    value.measuredReworkValue = check('measuredReworkValue', value.measuredReworkValue || 0, b.money || { min: 0, max: 1e12 }, 0);

    ['buildCost', 'runCost'].forEach(function(key) {
      var cost = value[key];
      if (cost && typeof cost === 'object') {
        Object.keys(cost).forEach(function(line) {
          cost[line] = check(key + '.' + line, cost[line], b.money || { min: 0, max: 1e12 }, 0);
        });
      } else {
        value[key] = check(key, cost, b.money || { min: 0, max: 1e12 }, 0);
      }
    });

    return { valid: errors.length === 0, errors: errors, value: value };
  }

  // ── Full case ──

  function calculateBusinessCase(assumptions, bounds) {
    var checked = validateAssumptions(assumptions, bounds);
    var a = checked.value;
    var savings = calculateTaskSavings(a.categories, { includeRework: a.includeRework });
    var capacity = calculateAnnualCapacity(a, savings);
    var value = calculateAnnualValue(a, capacity);
    return {
      assumptions: a,
      errors: checked.errors,
      savings: savings,
      capacity: capacity,
      value: value,
      buildCost: total(a.buildCost),
      payback: calculatePayback(a.buildCost, value.annualNetValue),
      roi: calculateThreeYearRoi(a, value),
      elapsed: calculateElapsed(a),
      rework: calculateRework(a, savings),
      costPerReview: calculateCostPerReview(a, savings, capacity, value)
    };
  }

  // ── Formatting (pure) ──

  function formatHours(h) {
    return (Math.round(h * 10) / 10).toFixed(1) + ' h';
  }

  function formatPercent(share) {
    return Math.round(share * 100) + '%';
  }

  function formatMoney(amount, currency) {
    var cur = currency || 'EUR';
    var sign = amount < 0 ? '-' : '';
    var a = Math.abs(amount);
    if (a >= 1e6) return sign + cur + ' ' + (a / 1e6).toFixed(2) + 'm';
    if (a >= 1e4) return sign + cur + ' ' + Math.round(a / 1e3) + 'k';
    return sign + cur + ' ' + Math.round(a).toLocaleString('en-GB');
  }

  function formatNumber(n) {
    return Math.round(n).toLocaleString('en-GB');
  }

  var ROIModel = {
    createAssumptions: createAssumptions,
    applyScenario: applyScenario,
    calculateTaskSavings: calculateTaskSavings,
    calculateAnnualCapacity: calculateAnnualCapacity,
    calculateAnnualValue: calculateAnnualValue,
    calculatePayback: calculatePayback,
    calculateThreeYearRoi: calculateThreeYearRoi,
    calculateElapsed: calculateElapsed,
    calculateRework: calculateRework,
    calculateCostPerReview: calculateCostPerReview,
    validateAssumptions: validateAssumptions,
    calculateBusinessCase: calculateBusinessCase,
    total: total,
    format: { hours: formatHours, percent: formatPercent, money: formatMoney, number: formatNumber }
  };

  global.ROIModel = ROIModel;
  if (typeof module !== 'undefined' && module.exports) module.exports = ROIModel;
}(typeof window !== 'undefined' ? window : globalThis));
