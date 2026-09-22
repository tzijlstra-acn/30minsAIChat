// ── CENTRAL SESSION STORE ──
// Single source of truth for the V11 NFR AI Pitch session.
// All interactions dispatch actions here; subscribers react to state changes.

var INITIAL_STORE_STATE = {
  mode: 'present',
  theme: localStorage.getItem('nfr-pitch-theme') || 'light',
  audienceLens: 'joint',
  bankArchetype: 'universal-cantonal',
  selectedPressures: [],
  selectedCapabilities: [],
  selectedSolutionId: null,
  proofCandidateId: null,
  selectedProcessNodeId: null,
  selectedTransformationBlockId: null,
  maturity: {
    ambition: 'prove-one-use-case',
    answers: {},
    currentByBlock: {},
    targetByBlock: {},
    confidenceByBlock: {},
    illustrativeLoaded: false
  },
  roleScenario: {
    scope: 'selected-use-cases',
    adoption: 0.5,
    volumeGrowth: 0,
    humanReview: 0.3,
    captureRoute: 'absorb-demand',
    sensitivity: 'base'
  },
  candidateWeights: {
    joint: { riskRelevance: 20, valueMechanism: 20, evidenceSpeed: 15, controlFit: 15, dataReadiness: 15, reusePotential: 15 },
    cro:   { riskRelevance: 30, valueMechanism: 10, evidenceSpeed: 15, controlFit: 25, dataReadiness: 10, reusePotential: 10 },
    cfo:   { riskRelevance: 10, valueMechanism: 30, evidenceSpeed: 20, controlFit: 10, dataReadiness: 15, reusePotential: 15 }
  },
  proof: {
    baseline: {},
    evidence: {},
    gateStatus: 'not-configured',
    illustrativeLoaded: false
  },
  architecture: {
    scaleMode: 'proof',
    simulatedFailure: null,
    gapOverlayVisible: true
  },
  economics: {
    scenario: 'proof',
    volume: 5000,
    modelTier: 'balanced',
    inputTokens: 20,
    outputTokens: 4,
    modelCalls: 1,
    retrievalCalls: 2,
    toolCalls: 0,
    retryRate: 0.05,
    reviewRate: 0.30,
    reviewMinutes: 15,
    reviewerHourlyRate: 30,
    exceptionRate: 0.05,
    platformAllocation: 4000,
    monitoringAllocation: 500,
    evaluationAllocation: 200,
    storageAllocation: 300,
    successRate: 0.92,
    currency: 'CHF'
  }
};

// ── STORE INTERNALS ──
var _storeState = deepCopy(INITIAL_STORE_STATE);
var _subscribers = [];

function deepCopy(obj) {
  try { return JSON.parse(JSON.stringify(obj)); } catch(e) { return obj; }
}

// ── PUBLIC STORE API ──
var store = {
  getState: function() { return _storeState; },

  dispatch: function(action) {
    var prev = _storeState;
    _storeState = storeReducer(_storeState, action);
    if (_storeState !== prev) {
      syncLegacyState(_storeState);
      document.dispatchEvent(new CustomEvent('nfr:statechange', {
        detail: { action: action, state: _storeState, prev: prev }
      }));
      _subscribers.forEach(function(sub) {
        try {
          var sel = sub.selector(_storeState);
          var prevSel = sub.selector(prev);
          if (sel !== prevSel) sub.callback(sel, prevSel);
        } catch(e) { /* selector errors are non-fatal */ }
      });
    }
  },

  // Returns an unsubscribe function
  subscribe: function(selector, callback) {
    var sub = { selector: selector, callback: callback };
    _subscribers.push(sub);
    return function() {
      _subscribers = _subscribers.filter(function(s) { return s !== sub; });
    };
  },

  reset: function(scope) {
    if (!scope) {
      _storeState = deepCopy(INITIAL_STORE_STATE);
    } else if (INITIAL_STORE_STATE.hasOwnProperty(scope)) {
      _storeState = Object.assign({}, _storeState);
      _storeState[scope] = deepCopy(INITIAL_STORE_STATE[scope]);
    }
    syncLegacyState(_storeState);
    document.dispatchEvent(new CustomEvent('nfr:statechange', {
      detail: { action: { type: 'RESET', scope: scope }, state: _storeState }
    }));
  }
};

// ── REDUCER ──
function storeReducer(state, action) {
  switch (action.type) {

    case 'SET_MODE':
      return Object.assign({}, state, { mode: action.payload });

    case 'SET_THEME':
      return Object.assign({}, state, { theme: action.payload });

    case 'SET_LENS':
      return Object.assign({}, state, { audienceLens: action.payload });

    case 'SET_ARCHETYPE':
      return Object.assign({}, state, { bankArchetype: action.payload });

    case 'TOGGLE_PRESSURE': {
      var ps = state.selectedPressures.slice();
      var pi = ps.indexOf(action.payload);
      if (pi > -1) { ps.splice(pi, 1); }
      else if (ps.length < 3) { ps.push(action.payload); }
      return Object.assign({}, state, { selectedPressures: ps });
    }

    case 'TOGGLE_CAPABILITY': {
      var cs = state.selectedCapabilities.slice();
      var ci = cs.indexOf(action.payload);
      if (ci > -1) { cs.splice(ci, 1); }
      else if (cs.length < 5) { cs.push(action.payload); }
      return Object.assign({}, state, { selectedCapabilities: cs });
    }

    case 'SELECT_SOLUTION':
      return Object.assign({}, state, { selectedSolutionId: action.payload });

    case 'SET_PROOF_CANDIDATE': {
      var freshProof = deepCopy(INITIAL_STORE_STATE.proof);
      var freshArch  = deepCopy(INITIAL_STORE_STATE.architecture);
      return Object.assign({}, state, {
        proofCandidateId: action.payload,
        selectedProcessNodeId: null,
        proof: freshProof,
        architecture: freshArch
      });
    }

    case 'SET_MATURITY_AMBITION':
      return Object.assign({}, state, {
        maturity: Object.assign({}, state.maturity, { ambition: action.payload })
      });

    case 'SET_MATURITY_ANSWER': {
      var ma = Object.assign({}, state.maturity.answers);
      ma[action.payload.criterionId] = action.payload.answer;
      return Object.assign({}, state, {
        maturity: Object.assign({}, state.maturity, { answers: ma, illustrativeLoaded: false })
      });
    }

    case 'LOAD_ILLUSTRATIVE_MATURITY': {
      return Object.assign({}, state, {
        maturity: Object.assign({}, state.maturity, {
          answers: action.payload.answers || {},
          illustrativeLoaded: true
        })
      });
    }

    case 'SET_ROLE_SCENARIO':
      return Object.assign({}, state, {
        roleScenario: Object.assign({}, state.roleScenario, action.payload)
      });

    case 'UPDATE_CANDIDATE_WEIGHT': {
      var lens = action.payload.lens;
      var prevWeights = Object.assign({}, state.candidateWeights[lens]);
      prevWeights[action.payload.criterion] = action.payload.value;
      var newCW = Object.assign({}, state.candidateWeights);
      newCW[lens] = prevWeights;
      return Object.assign({}, state, { candidateWeights: newCW });
    }

    case 'SET_PROOF_EVIDENCE': {
      var ev = Object.assign({}, state.proof.evidence);
      ev[action.payload.dim] = action.payload.value;
      return Object.assign({}, state, {
        proof: Object.assign({}, state.proof, { evidence: ev })
      });
    }

    case 'SET_PROOF_GATE':
      return Object.assign({}, state, {
        proof: Object.assign({}, state.proof, { gateStatus: action.payload })
      });

    case 'LOAD_ILLUSTRATIVE_PROOF':
      return Object.assign({}, state, {
        proof: Object.assign({}, action.payload, { illustrativeLoaded: true })
      });

    case 'SET_ARCHITECTURE_SCALE':
      return Object.assign({}, state, {
        architecture: Object.assign({}, state.architecture, { scaleMode: action.payload })
      });

    case 'SET_SIMULATED_FAILURE':
      return Object.assign({}, state, {
        architecture: Object.assign({}, state.architecture, { simulatedFailure: action.payload })
      });

    case 'SET_ECONOMICS_PARAM': {
      var eco = Object.assign({}, state.economics);
      eco[action.payload.key] = action.payload.value;
      return Object.assign({}, state, { economics: eco });
    }

    case 'SELECT_PROCESS_NODE':
      return Object.assign({}, state, { selectedProcessNodeId: action.payload });

    case 'SELECT_TRANSFORMATION_BLOCK':
      return Object.assign({}, state, { selectedTransformationBlockId: action.payload });

    default:
      return state;
  }
}

// ── BACKWARDS COMPATIBILITY ──
// Keep the existing CLIENT_STATE in sync so legacy renderers continue to work.
function syncLegacyState(s) {
  if (typeof CLIENT_STATE === 'undefined') return;
  CLIENT_STATE.archetype = s.bankArchetype === 'universal-cantonal' ? 'A' : 'B';
  CLIENT_STATE.lens = s.audienceLens;
  CLIENT_STATE.pressures = s.selectedPressures.slice();
  CLIENT_STATE.selectedCapabilityIds = s.selectedCapabilities.slice();
  CLIENT_STATE.proofCapabilityId = s.proofCandidateId;
}

// ── CONVENIENCE DISPATCH HELPERS ──
function setMode(m)      { store.dispatch({ type: 'SET_MODE', payload: m }); }
function setStoreLens(l) { store.dispatch({ type: 'SET_LENS', payload: l }); }
function setStoreArch(a) { store.dispatch({ type: 'SET_ARCHETYPE', payload: a }); }
function toggleStorePressure(id)    { store.dispatch({ type: 'TOGGLE_PRESSURE', payload: id }); }
function toggleStoreCapability(id)  { store.dispatch({ type: 'TOGGLE_CAPABILITY', payload: id }); }
function setStoreProofCandidate(id) { store.dispatch({ type: 'SET_PROOF_CANDIDATE', payload: id }); }
function setArchitectureScale(m)    { store.dispatch({ type: 'SET_ARCHITECTURE_SCALE', payload: m }); }
