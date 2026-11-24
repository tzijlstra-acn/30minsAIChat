// -- UNIT ECONOMICS -- v6 appendix V3 --
// A deterministic model of cost per case and annual value for one NFR journey.
// Pure functions, no DOM: the appendix calculator draws from compute(); tests call it
// directly. Every default is synthetic and illustrative.
//
//   baseline human cost per case = sum over roles of hours x loaded rate
//   judgement (retained)         = judgement hours x the judgement role's rate
//   other work N                 = baseline hours - judgement hours, at its blended rate
//   addressable hours            = N x addressable share
//   hours removed per case       = addressable hours x realised efficiency
//   future human cost per case   = judgement + remaining work + exception handling
//   future total cost per case   = future human cost + runtime + support and control
//   annual capacity hours        = cases x adoption x hours removed per case
//   annual capacity value        = cases x adoption x (hours removed - exception hours) x blended rate
//   annual net benefit           = capacity value + operating benefit - recurring run cost
//   simple payback (years)       = one-off cost / annual net benefit
// Waiting time is deliberately absent: it is not converted into labour savings.
// Exposes window.UnitEconomics and module.exports.

(function(global) {
  'use strict';

  var DEFAULTS = {
    cases: 600,               // eligible cases per year
    adoption: 0.7,            // share of eligible cases run through the controlled flow
    roles: [
      { id: 'analyst', label: 'Third-party risk analyst', hours: 8, rate: 85 },
      { id: 'manager', label: 'NFR risk manager', hours: 4, rate: 120 },
      { id: 'reviewer', label: 'Second-line reviewer', hours: 1.5, rate: 140 }
    ],
    judgementRole: 'manager',
    judgementHours: 2.5,      // retained human judgement per case
    addressable: 0.6,         // share of the other work that preparation addresses
    efficiency: 0.6,          // share of the addressable work actually removed
    exceptionRate: 0.15,      // share of cases needing extra handling
    exceptionHours: 3,        // extra hours per exception case
    runtimeCost: 18,          // model and runtime cost per case (EUR)
    supportCost: 25,          // support and control allocation per case (EUR)
    operatingBenefit: 30000,  // quantified operating benefit per year, e.g. measured rework avoided (EUR)
    oneOff: 450000            // one-off delivery cost (EUR)
  };

  var BOUNDS = {
    cases: [50, 5000], adoption: [0, 1], judgementHours: [0, 40], addressable: [0, 1], efficiency: [0, 1],
    exceptionRate: [0, 1], exceptionHours: [0, 40], runtimeCost: [0, 1000], supportCost: [0, 1000],
    operatingBenefit: [0, 10000000], oneOff: [0, 50000000], hours: [0, 200], rate: [0, 1000]
  };

  function clamp(v, b) { v = Number(v); if (!isFinite(v)) v = b[0]; return Math.min(b[1], Math.max(b[0], v)); }

  function normalise(input) {
    var i = input || {};
    var out = {};
    Object.keys(DEFAULTS).forEach(function(k) {
      if (k === 'roles' || k === 'judgementRole') return;
      out[k] = clamp(i[k] !== undefined ? i[k] : DEFAULTS[k], BOUNDS[k]);
    });
    out.roles = (i.roles || DEFAULTS.roles).map(function(r) {
      return { id: r.id, label: r.label, hours: clamp(r.hours, BOUNDS.hours), rate: clamp(r.rate, BOUNDS.rate) };
    });
    out.judgementRole = i.judgementRole || DEFAULTS.judgementRole;
    var jr = out.roles.filter(function(r) { return r.id === out.judgementRole; })[0] || out.roles[0];
    // Judgement cannot exceed the hours of the role that holds it
    out.judgementHours = Math.min(out.judgementHours, jr.hours);
    return out;
  }

  function compute(input) {
    var p = normalise(input);
    var jr = p.roles.filter(function(r) { return r.id === p.judgementRole; })[0] || p.roles[0];
    var baselineHours = 0, baselineCost = 0;
    p.roles.forEach(function(r) { baselineHours += r.hours; baselineCost += r.hours * r.rate; });
    var judgementCost = p.judgementHours * jr.rate;
    var otherHours = baselineHours - p.judgementHours;
    var otherCost = baselineCost - judgementCost;
    var blendedRate = otherHours > 0 ? otherCost / otherHours : 0;
    var addressableHours = otherHours * p.addressable;
    var removedHours = addressableHours * p.efficiency;
    var exceptionHoursPerCase = p.exceptionRate * p.exceptionHours;
    var removedCost = removedHours * blendedRate;
    var exceptionCost = exceptionHoursPerCase * blendedRate;
    var futureHumanCost = baselineCost - removedCost + exceptionCost;
    var futureTotalCost = futureHumanCost + p.runtimeCost + p.supportCost;
    var adopted = p.cases * p.adoption;
    var capacityHours = adopted * removedHours;
    var capacityValue = adopted * (removedHours - exceptionHoursPerCase) * blendedRate;
    var runCost = adopted * (p.runtimeCost + p.supportCost);
    var annualNet = capacityValue + p.operatingBenefit - runCost;
    var payback = annualNet > 0 ? p.oneOff / annualNet : null;
    return {
      input: p,
      baselineHours: baselineHours,
      baselineCost: baselineCost,
      judgementCost: judgementCost,
      blendedRate: blendedRate,
      addressableHours: addressableHours,
      removedHours: removedHours,
      futureHours: baselineHours - removedHours + exceptionHoursPerCase,
      futureHumanCost: futureHumanCost,
      futureTotalCost: futureTotalCost,
      costPerCaseChange: futureTotalCost - baselineCost,
      // Per-case waterfall, baseline to future total
      waterfall: [
        { label: 'Baseline human cost', value: baselineCost, kind: 'total' },
        { label: 'Prepared work removed', value: -removedCost, kind: 'down' },
        { label: 'Exception handling', value: exceptionCost, kind: 'up' },
        { label: 'Model and runtime', value: p.runtimeCost, kind: 'up' },
        { label: 'Support and control', value: p.supportCost, kind: 'up' },
        { label: 'Future cost per case', value: futureTotalCost, kind: 'total' }
      ],
      adoptedCases: adopted,
      capacityHours: capacityHours,
      capacityValue: capacityValue,
      operatingBenefit: p.operatingBenefit,
      runCost: runCost,
      annualNet: annualNet,
      payback: payback,
      // Cumulative net position by month, three years
      cumulative: Array.apply(null, { length: 37 }).map(function(_, m) { return -p.oneOff + annualNet * m / 12; })
    };
  }

  // Annual net benefit across a grid of adoption and efficiency values
  function sensitivity(input, adoptions, efficiencies) {
    adoptions = adoptions || [0.5, 0.7, 0.9];
    efficiencies = efficiencies || [0.4, 0.6, 0.8];
    return efficiencies.map(function(e) {
      return adoptions.map(function(a) {
        var r = compute(Object.assign({}, input, { adoption: a, efficiency: e }));
        return { adoption: a, efficiency: e, annualNet: r.annualNet, payback: r.payback };
      });
    });
  }

  function money(v) {
    var neg = v < 0, a = Math.abs(v);
    var s = a >= 1e6 ? (a / 1e6).toFixed(2) + ' m' : a >= 1e4 ? Math.round(a / 1e3) + ' k' : String(Math.round(a));
    return (neg ? '-' : '') + 'EUR ' + s;
  }

  var API = { DEFAULTS: DEFAULTS, BOUNDS: BOUNDS, normalise: normalise, compute: compute, sensitivity: sensitivity, money: money };
  global.UnitEconomics = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
}(typeof window !== 'undefined' ? window : globalThis));
