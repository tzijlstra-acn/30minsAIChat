// ── CLIENT STATE ──
var CLIENT_STATE={
  route:'executive',
  archetype:'A',
  lens:'joint',
  pressures:[],
  selectedCapabilityIds:[],
  selectedOpportunityIds:[],
  selectedBlockIds:[],
  maturity:{},
  targetMaturity:{},
  criteriaWeights:{executiveImpact:1,feasibility:1,controlComplexity:1,reusePotential:1,timeToEvidence:1,runCostProfile:1},
  proofCapabilityId:null,
  proofUseCaseId:null,
  foundationMoveId:null,
  scaleWaveIds:[],
  openDecisions:[],
  evidenceNotes:{},
  sessionNotes:''
};

// ── STATE SELECTORS ──
function getCapabilityById(id){return RISK_CAPABILITIES.find(function(c){return c.id===id;});}
function getCategoryById(id){return RISK_CATEGORIES.find(function(c){return c.id===id;});}
function getBlockById(id){return TRANSFORMATION_BLOCKS.find(function(b){return b.id===id;});}
function getUseCaseById(id){return USE_CASES.find(function(u){return u.id===id;});}
function getOpportunityById(id){return AI_OPPORTUNITIES.find(function(o){return o.id===id;});}

function getOpportunitiesForCapability(capId){
  return AI_OPPORTUNITIES.filter(function(o){return o.capIds&&o.capIds.indexOf(capId)>-1;});
}
function getUseCasesForCapabilities(capIds){
  if(!capIds||!capIds.length)return USE_CASES;
  return USE_CASES.filter(function(u){return u.capIds&&u.capIds.some(function(c){return capIds.indexOf(c)>-1;});});
}
function getBlocksForCapabilities(capIds){
  var blockIds=[];
  AI_OPPORTUNITIES.filter(function(o){return o.capIds&&o.capIds.some(function(c){return capIds.indexOf(c)>-1;});}).forEach(function(o){if(o.blockIds)o.blockIds.forEach(function(b){if(blockIds.indexOf(b)<0)blockIds.push(b);});});
  return TRANSFORMATION_BLOCKS.filter(function(b){return blockIds.indexOf(b.id)>-1;});
}

// ── STATE MUTATIONS ──
function toggleCapability(id){
  var sel=CLIENT_STATE.selectedCapabilityIds;
  var idx=sel.indexOf(id);
  if(idx>-1){sel.splice(idx,1);}else if(sel.length<5){sel.push(id);}
}
function setProofCapability(id){CLIENT_STATE.proofCapabilityId=id;}
function setFoundationMove(id){CLIENT_STATE.foundationMoveId=id;}
function setArchetype(v){CLIENT_STATE.archetype=v;}
function setLens(v){CLIENT_STATE.lens=v;}
function setRoute(v){CLIENT_STATE.route=v;}
function setMaturity(blockId,level,isTarget){
  if(isTarget){CLIENT_STATE.targetMaturity[blockId]=level;}
  else{CLIENT_STATE.maturity[blockId]=level;}
}
function togglePressure(pid){
  var ps=CLIENT_STATE.pressures,idx=ps.indexOf(pid);
  if(idx>-1){ps.splice(idx,1);}else if(ps.length<3){ps.push(pid);}
}
function addOpenDecision(text){CLIENT_STATE.openDecisions.push({text:text,ts:Date.now()});}
function resetState(){
  Object.assign(CLIENT_STATE,{route:'executive',archetype:'A',lens:'joint',pressures:[],selectedCapabilityIds:[],selectedOpportunityIds:[],selectedBlockIds:[],maturity:{},targetMaturity:{},criteriaWeights:{executiveImpact:1,feasibility:1,controlComplexity:1,reusePotential:1,timeToEvidence:1,runCostProfile:1},proofCapabilityId:null,proofUseCaseId:null,foundationMoveId:null,scaleWaveIds:[],openDecisions:[],evidenceNotes:{},sessionNotes:''});
}

// ── EXPORT ──
function exportSessionJSON(){
  var data={timestamp:new Date().toISOString(),version:'V6',state:CLIENT_STATE,selectedCapabilities:CLIENT_STATE.selectedCapabilityIds.map(getCapabilityById).filter(Boolean).map(function(c){return{id:c.id,name:c.name};}),selectedBlocks:CLIENT_STATE.selectedBlockIds.map(getBlockById).filter(Boolean).map(function(b){return{id:b.id,name:b.name};}),proofCapability:CLIENT_STATE.proofCapabilityId?getCapabilityById(CLIENT_STATE.proofCapabilityId):null,proofUseCase:CLIENT_STATE.proofUseCaseId?getUseCaseById(CLIENT_STATE.proofUseCaseId):null};
  var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='nfr-ai-session-'+new Date().toISOString().slice(0,10)+'.json';a.click();
}
