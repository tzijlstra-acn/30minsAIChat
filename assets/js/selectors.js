// ── DERIVED SELECTORS ──
// Pure functions that compute derived state from store state.
// Never mutate state. Called by renderers when state changes.

// ── CANDIDATE SCORING ──
function selectCandidateScores(state) {
  var lens = state.audienceLens;
  var weights = (state.candidateWeights && state.candidateWeights[lens]) || { riskRelevance: 20, valueMechanism: 20, evidenceSpeed: 15, controlFit: 15, dataReadiness: 15, reusePotential: 15 };
  var source = (typeof USE_CASES !== 'undefined' ? USE_CASES : []);
  return source.map(function(uc) {
    var criteria = uc.criteria || {};
    var totalWeight = 0;
    var weightedSum = 0;
    var missingCriteria = [];
    Object.keys(weights).forEach(function(k) {
      var w = weights[k];
      var crit = criteria[k];
      if (crit === null || crit === undefined || (crit && crit.value === null)) {
        missingCriteria.push(k);
      } else {
        var val   = typeof crit === 'object' ? crit.value : crit;
        var conf  = typeof crit === 'object' && crit.confidence !== undefined ? crit.confidence : 1;
        weightedSum += val * w * conf;
        totalWeight += w * conf;
      }
    });
    var score = totalWeight > 0 ? weightedSum / totalWeight : 0;
    var totalCriteria = Object.keys(weights).length;
    var confidence = totalCriteria > 0 ? (totalCriteria - missingCriteria.length) / totalCriteria : 0;
    return {
      id: uc.id,
      title: uc.name || uc.title || uc.id,
      score: score,
      confidence: confidence,
      missingCriteria: missingCriteria,
      lens: lens,
      isSelected: uc.id === state.proofCandidateId
    };
  }).sort(function(a, b) { return b.score - a.score; });
}

// ── TRANSFORMATION GAPS ──
function selectTransformationGaps(state) {
  var answers = (state.maturity && state.maturity.answers) || {};
  if (!Object.keys(answers).length) return [];
  var blocks = typeof TRANSFORMATION_BLOCKS !== 'undefined' ? TRANSFORMATION_BLOCKS : [];
  return blocks.map(function(block) {
    var blockAnswers = Object.keys(answers).filter(function(k) { return k.indexOf(block.id + ':') === 0; });
    var known = blockAnswers.filter(function(k) { return answers[k] !== null && answers[k] !== undefined; });
    var ratios = known.map(function(k) {
      var a = answers[k];
      if (a === 'consistently-evident') return 1.0;
      if (a === 'partly-evident')       return 0.5;
      if (a === 'not-evident')          return 0.0;
      return null;
    }).filter(function(v) { return v !== null; });
    var avg = ratios.length > 0 ? ratios.reduce(function(s, v) { return s + v; }, 0) / ratios.length : null;
    var confidence = known.length / Math.max(blockAnswers.length, 1);
    return { blockId: block.id, blockName: block.name, currentRatio: avg, confidence: confidence };
  }).filter(function(b) { return b.currentRatio !== null && b.currentRatio < 0.6; });
}

// ── SOLUTION READINESS ──
function selectSolutionReadiness(state) {
  var selectedCaps = state.selectedCapabilities || [];
  var solutions = typeof SOLUTIONS !== 'undefined' ? SOLUTIONS : [];
  if (!selectedCaps.length) return { available: solutions, recommended: solutions.filter(function(s) { return s.status === 'ASSET'; }) };
  var available = solutions.filter(function(s) {
    return s.capabilityIds && s.capabilityIds.some(function(c) { return selectedCaps.indexOf(c) > -1; });
  });
  var recommended = available.filter(function(s) { return ['ASSET', 'PROTO'].indexOf(s.status) > -1; });
  return { available: available, recommended: recommended };
}

// ── ROLE IMPACT SCENARIO ──
function selectRoleImpactScenario(state) {
  var scenario = state.roleScenario || {};
  var archKey = state.bankArchetype === 'universal-cantonal' ? 'A' : 'B';
  var roles = (typeof ROLE_DATA !== 'undefined' ? ROLE_DATA : []).map(function(role) {
    var share = archKey === 'A' ? (role.shareA || 0) : (role.shareB || 0);
    var split = archKey === 'A' ? (role.splitA || []) : (role.splitB || []);
    var scopeCoverage = scenario.scope === 'full' ? 1.0 : scenario.scope === 'selected-capabilities' ? 0.65 : 0.35;
    var adoptionRate   = typeof scenario.adoption === 'number' ? scenario.adoption : 0.5;
    var reviewRate     = typeof scenario.humanReview === 'number' ? scenario.humanReview : 0.3;
    var adoptedEffect  = share * scopeCoverage * adoptionRate;
    var reviewRetained = adoptedEffect * reviewRate;
    var netEffect      = adoptedEffect - reviewRetained;
    return { name: role.name, share: share, split: split, adoptedEffect: adoptedEffect, reviewRetained: reviewRetained, netEffect: netEffect };
  });
  return { roles: roles, scenario: scenario, archetype: archKey, isIllustrative: true };
}

// ── UNIT ECONOMICS ──
function selectUnitEconomics(state) {
  var eco = state.economics || {};
  // Prices are illustrative CHF per million tokens
  var inputPricePer1M   = 3.0;
  var outputPricePer1M  = 15.0;
  var retrievalUnitCost = 0.0004;
  var toolUnitCost      = 0.001;

  var inputTokensTotal  = (eco.inputTokens  || 20) * (eco.modelCalls || 1) * 1000;
  var outputTokensTotal = (eco.outputTokens || 4)  * (eco.modelCalls || 1) * 1000;
  var modelCost     = inputTokensTotal / 1e6 * inputPricePer1M + outputTokensTotal / 1e6 * outputPricePer1M;
  var retrievalCost = (eco.retrievalCalls || 2) * retrievalUnitCost;
  var toolCost      = (eco.toolCalls || 0) * toolUnitCost;
  var baseVariable  = modelCost + retrievalCost + toolCost;
  var retryCost     = baseVariable * (eco.retryRate || 0.05);
  var humanReviewCost = (eco.reviewRate || 0.3) * (eco.reviewMinutes || 15) / 60 * (eco.reviewerHourlyRate || 30);
  var exceptionCost   = (eco.exceptionRate || 0.05) * 30 / 60 * (eco.reviewerHourlyRate || 30);
  var vol = Math.max(eco.volume || 5000, 1);
  var allocatedFixed  = ((eco.platformAllocation || 4000) + (eco.monitoringAllocation || 500) + (eco.evaluationAllocation || 200) + (eco.storageAllocation || 300)) / vol;
  var costPerAttempt  = modelCost + retrievalCost + toolCost + retryCost + humanReviewCost + exceptionCost + allocatedFixed;
  var successRate     = Math.max(eco.successRate || 0.92, 0.01);
  var costPerSuccessful = costPerAttempt / successRate;

  return {
    modelCost: modelCost,
    retrievalCost: retrievalCost,
    toolCost: toolCost,
    retryCost: retryCost,
    humanReviewCost: humanReviewCost,
    exceptionCost: exceptionCost,
    allocatedFixed: allocatedFixed,
    costPerAttempt: costPerAttempt,
    costPerSuccessful: costPerSuccessful,
    monthlyTotal: costPerSuccessful * vol * successRate,
    currency: eco.currency || 'CHF',
    isIllustrative: true
  };
}

// ── ARCHITECTURE PATH ──
function selectArchitecturePath(state) {
  var mode = (state.architecture && state.architecture.scaleMode) || 'proof';
  var gaps = selectTransformationGaps(state);
  var candidate = state.proofCandidateId;
  return { scaleMode: mode, maturityGaps: gaps, candidateId: candidate };
}

// ── WORKING SYNTHESIS ──
function selectSynthesis(state) {
  var pressures   = state.selectedPressures || [];
  var capabilities = state.selectedCapabilities || [];
  var candidate   = state.proofCandidateId;
  var gateStatus  = (state.proof && state.proof.gateStatus) || 'not-configured';
  var archMode    = (state.architecture && state.architecture.scaleMode) || 'proof';
  var lens        = state.audienceLens;
  var gaps        = selectTransformationGaps(state);
  var eco         = selectUnitEconomics(state);
  return {
    pressures: pressures,
    capabilities: capabilities,
    proofCandidateId: candidate,
    audienceLens: lens,
    gateStatus: gateStatus,
    architectureMode: archMode,
    maturityGaps: gaps,
    unitEconomics: eco,
    hasWorkingSet: capabilities.length > 0 || candidate !== null,
    nextAction: candidate ? 'run-proof' : capabilities.length > 0 ? 'select-candidate' : 'select-capabilities',
    isIllustrative: !candidate || eco.isIllustrative
  };
}

// ── ARCHITECTURE GAP OVERLAY ──
function selectArchitectureGaps(state) {
  var gaps = selectTransformationGaps(state);
  var candidate = state.proofCandidateId;
  return { gaps: gaps, candidate: candidate, mode: (state.architecture && state.architecture.scaleMode) || 'proof' };
}
