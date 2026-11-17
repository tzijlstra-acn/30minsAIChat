// -- BUSINESS CASE DATA -- illustrative defaults for the TPRM periodic-review case --
// Data only. Formulas live in assets/js/story/roi-model.js, never in scene drawing code.
// Every default here is illustrative. Replace with the client baseline in the conversation.
// Exposes: window.NFR_BUSINESS_CASE (browser) and module.exports (Node, for tests).

(function(global) {
  'use strict';

  function deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).forEach(function(key) {
      var value = obj[key];
      if (value && typeof value === 'object') deepFreeze(value);
    });
    return Object.freeze(obj);
  }

  var BUSINESS_CASE = deepFreeze({
    version: 1,
    storageKey: 'nfr_roi_assumptions_v1',
    currency: 'EUR',
    defaultLabel: 'Illustrative only. Replace with client baseline.',

    // Evidence-quality labels. The interface never shows an unlabelled number.
    claimLabels: {
      baseline:     'Client baseline',
      measured:     'Measured in proof',
      illustrative: 'Illustrative assumption',
      expected:     'Expected scenario',
      stretch:      'Stretch hypothesis'
    },

    // Work categories for one completed periodic review.
    // eligible:false means the category is never prepared automatically.
    categories: [
      { id: 'find',       label: 'Find and retrieve',      hours: 2.5, rate: 0.85, eligible: true  },
      { id: 'reconcile',  label: 'Reconcile and compare',  hours: 2.0, rate: 0.80, eligible: true  },
      { id: 'coordinate', label: 'Coordinate and chase',   hours: 2.0, rate: 0.70, eligible: true  },
      { id: 'reenter',    label: 'Re-enter and record',    hours: 1.0, rate: 0.90, eligible: true  },
      { id: 'rework',     label: 'Rework',                 hours: 1.5, rate: 0.55, eligible: true  },
      { id: 'judgement',  label: 'Professional judgement', hours: 3.0, rate: 0,    eligible: false }
    ],

    // Volume, labour, elapsed time, cost and reuse defaults
    defaults: {
      scenario: 'expected',
      annualReviewVolume: 1000,
      loadedHourlyCost: 100,
      productiveHoursPerFte: 1600,
      elapsedDays: 18,
      waitingReduction: 0.35,
      buildCost: { design: 380000, data: 140000, change: 80000 },
      runCost: { platform: 60000, modelAndData: 40000, support: 50000 },
      rampYearOne: 0.5,
      measuredReworkValue: 0
    },

    // Scenario ladder. Avoided regulatory findings are never part of any scenario.
    scenarios: {
      conservative: {
        label: 'Conservative',
        claim: 'illustrative',
        description: 'Measured capacity only',
        adoption: 0.85, exceptionLeakage: 0.10, capacityConversion: 0.75,
        includeRework: false, countElapsed: false, reuseShare: 0
      },
      expected: {
        label: 'Expected',
        claim: 'expected',
        description: 'Capacity plus cycle time and reduced rework',
        adoption: 0.95, exceptionLeakage: 0.05, capacityConversion: 0.94,
        includeRework: true, countElapsed: true, reuseShare: 0
      },
      stretch: {
        label: 'Stretch',
        claim: 'stretch',
        description: 'Expected case plus reuse across the next journey',
        adoption: 0.95, exceptionLeakage: 0.05, capacityConversion: 0.94,
        includeRework: true, countElapsed: true, reuseShare: 0.6
      }
    },

    // Plain-language statements of the formulas in roi-model.js, shown in the
    // assumptions drawer and the Evidence Atlas. Keep in step with roi-model.js.
    formulas: [
      ['Gross saved hours, per category', 'current hours x preparation rate'],
      ['Direct effort removed per review', 'gross saved x adoption x (1 - exception leakage)'],
      ['Net capacity per review', 'direct effort removed x capacity conversion'],
      ['Annual capacity hours', 'annual review volume x net capacity per review'],
      ['FTE-equivalent capacity', 'annual capacity hours / productive hours per FTE (capacity, not headcount)'],
      ['Annual gross capacity value', 'annual capacity hours x loaded hourly cost'],
      ['Annual net value', 'gross capacity value + measured rework value - annual run cost'],
      ['Payback months', 'one-time build cost / (annual net value / 12); shown as Not yet positive when net value is zero or less'],
      ['Three-year ROI', '(three-year net benefit + avoided build cost from reuse - build cost) / build cost; year one on the adoption ramp'],
      ['Cost per completed review', 'remaining labour + (annual run cost + build cost / 3) / annual volume']
    ],

    // Input bounds and step sizes for the calculator fields
    bounds: {
      hours:                 { min: 0,   max: 40,      step: 0.5 },
      rate:                  { min: 0,   max: 0.95,    step: 0.05 },
      factor:                { min: 0,   max: 1,       step: 0.05 },
      annualReviewVolume:    { min: 1,   max: 100000,  step: 50 },
      loadedHourlyCost:      { min: 0,   max: 1000,    step: 5 },
      productiveHoursPerFte: { min: 800, max: 2200,    step: 10 },
      elapsedDays:           { min: 1,   max: 180,     step: 1 },
      money:                 { min: 0,   max: 50000000, step: 10000 }
    }
  });

  global.NFR_BUSINESS_CASE = BUSINESS_CASE;
  if (typeof module !== 'undefined' && module.exports) module.exports = BUSINESS_CASE;
}(typeof window !== 'undefined' ? window : globalThis));
