// -- BUSINESS CASE STATE -- session persistence for the ROI calculator --
// Holds the presenter's assumptions in sessionStorage (key nfr_roi_assumptions_v1) only.
// No data leaves the browser. Inputs survive navigation away and back; reset restores
// the illustrative defaults and their label.
// Depends on: window.NFR_BUSINESS_CASE, window.ROIModel. Exposes: window.BusinessCaseState.

(function(global) {
  'use strict';

  var DATA = global.NFR_BUSINESS_CASE;
  var M = global.ROIModel;
  if (!DATA || !M) return;

  var SCENARIO_FIELDS = ['adoption', 'exceptionLeakage', 'capacityConversion'];
  var _state = null;
  var _listeners = [];

  function defaults() {
    return { assumptions: M.createAssumptions(DATA, DATA.defaults.scenario), edited: {} };
  }

  function load() {
    try {
      var raw = global.sessionStorage.getItem(DATA.storageKey);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.v === DATA.version && parsed.assumptions) {
          return { assumptions: M.validateAssumptions(parsed.assumptions, DATA.bounds).value, edited: parsed.edited || {} };
        }
      }
    } catch (e) { /* storage unavailable: fall back to defaults */ }
    return defaults();
  }

  function save() {
    try {
      global.sessionStorage.setItem(DATA.storageKey, JSON.stringify({ v: DATA.version, assumptions: _state.assumptions, edited: _state.edited }));
    } catch (e) { /* storage unavailable: keep in memory only */ }
  }

  function emit() {
    _listeners.slice().forEach(function(fn) { try { fn(_state); } catch (e) { /* listener error must not break input */ } });
  }

  function get() {
    if (!_state) _state = load();
    return _state;
  }

  // Path forms: 'adoption', 'buildCost.design', 'categories.find.hours'
  function readField(path) {
    var a = get().assumptions;
    var parts = path.split('.');
    if (parts[0] === 'categories') {
      var cat = a.categories.filter(function(c) { return c.id === parts[1]; })[0];
      return cat ? cat[parts[2]] : undefined;
    }
    return parts.length === 2 ? (a[parts[0]] || {})[parts[1]] : a[parts[0]];
  }

  function setField(path, value) {
    var s = get();
    var a = JSON.parse(JSON.stringify(s.assumptions));
    var parts = path.split('.');
    if (parts[0] === 'categories') {
      a.categories.forEach(function(c) { if (c.id === parts[1]) c[parts[2]] = value; });
    } else if (parts.length === 2) {
      a[parts[0]] = a[parts[0]] && typeof a[parts[0]] === 'object' ? a[parts[0]] : {};
      a[parts[0]][parts[1]] = value;
    } else {
      a[parts[0]] = value;
    }
    s.assumptions = M.validateAssumptions(a, DATA.bounds).value;
    s.edited[path] = true;
    save();
    emit();
  }

  function setScenario(id) {
    var s = get();
    s.assumptions = M.applyScenario(s.assumptions, DATA, id);
    SCENARIO_FIELDS.forEach(function(f) { delete s.edited[f]; });
    save();
    emit();
  }

  function reset() {
    _state = defaults();
    try { global.sessionStorage.removeItem(DATA.storageKey); } catch (e) { /* ignore */ }
    emit();
  }

  function subscribe(fn) {
    _listeners.push(fn);
    return function() { _listeners = _listeners.filter(function(l) { return l !== fn; }); };
  }

  function isEdited(path) { return !!get().edited[path]; }
  function anyEdited() { return Object.keys(get().edited).length > 0; }

  // Evidence-quality label for one field: edited values are the client's baseline;
  // scenario factors carry the scenario label; everything else is illustrative.
  function labelFor(path) {
    if (isEdited(path)) return DATA.claimLabels.baseline;
    if (SCENARIO_FIELDS.indexOf(path) >= 0) {
      var sc = DATA.scenarios[get().assumptions.scenario];
      return DATA.claimLabels[sc ? sc.claim : 'illustrative'];
    }
    return DATA.claimLabels.illustrative;
  }

  function result() {
    return M.calculateBusinessCase(get().assumptions, DATA.bounds);
  }

  global.BusinessCaseState = {
    get: get, readField: readField, setField: setField, setScenario: setScenario,
    reset: reset, subscribe: subscribe, isEdited: isEdited, anyEdited: anyEdited,
    labelFor: labelFor, result: result
  };
}(window));
