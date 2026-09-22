#!/usr/bin/env node
/**
 * Data integrity validator for solutions.js and content.js.
 * Run: node scripts/validate-data.js
 * Exits 1 if any check fails.
 */
'use strict';
var fs=require('fs'),path=require('path'),vm=require('vm');
var root=path.dirname(__dirname);
var errors=[];
var warnings=[];
function fail(msg){errors.push(msg);}
function warn(msg){warnings.push(msg);}

function evalFile(filePath,varNames){
  var code=fs.readFileSync(filePath,'utf8');
  var ctx={};
  varNames.forEach(function(v){ctx[v]=undefined;});
  try{vm.runInNewContext(code,ctx);}catch(e){fail('Eval error in '+path.basename(filePath)+': '+e.message);return null;}
  var out={};
  varNames.forEach(function(v){out[v]=ctx[v];});
  return out;
}

var sol=evalFile(path.join(root,'assets/js/solutions.js'),['PORTFOLIO_CLUSTERS','SOLUTIONS']);
// content.js references CLIENT_STATE, getCapabilityById etc - mock them
var contentCtx={CLIENT_STATE:{selectedCapabilityIds:[],proofCapabilityId:null,maturity:{},targetMaturity:{},openDecisions:[],pressures:[],archetype:'A',lens:'joint'},
  getCapabilityById:function(){return null;},
  AI_OPPORTUNITIES:undefined,TRANSFORMATION_BLOCKS:undefined,
  RISK_CAPABILITIES:undefined,RISK_CATEGORIES:undefined,
  MATURITY_LEVELS:undefined,USE_CASES:undefined,ACCENTURE_EDGE:undefined,
  DELIVERY_PHASES:undefined,ECONOMICS_DRIVERS:undefined,ROLE_DATA:undefined,EXPERTS:undefined
};
evalFile(path.join(root,'assets/js/content.js'),Object.keys(contentCtx));
// Re-run with full context
try{
  vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/content.js'),'utf8'),contentCtx);
}catch(e){fail('content.js eval error: '+e.message);}

var PORTFOLIO_CLUSTERS=sol&&sol.PORTFOLIO_CLUSTERS;
var SOLUTIONS=sol&&sol.SOLUTIONS;
var TRANSFORMATION_BLOCKS=contentCtx.TRANSFORMATION_BLOCKS;
var RISK_CAPABILITIES=contentCtx.RISK_CAPABILITIES;
var AI_OPPORTUNITIES=contentCtx.AI_OPPORTUNITIES;
var USE_CASES=contentCtx.USE_CASES;

// ── SOLUTIONS ──
if(!Array.isArray(SOLUTIONS)){fail('SOLUTIONS is not an array');}
else{
  console.log('Solutions count: '+SOLUTIONS.length);
  if(SOLUTIONS.length!==28)fail('Expected 28 SOLUTIONS, found '+SOLUTIONS.length);
  var srcNums=SOLUTIONS.map(function(s){return s.sourceNumber;}).sort(function(a,b){return a-b;});
  var seen={};
  srcNums.forEach(function(n){if(seen[n])fail('Duplicate sourceNumber: '+n);seen[n]=true;});
  for(var i=1;i<=28;i++){if(!seen[i])fail('Missing sourceNumber: '+i);}
  var clusterIds=(PORTFOLIO_CLUSTERS||[]).map(function(c){return c.id;});
  SOLUTIONS.forEach(function(s){
    if(!s.portfolioClusterId)fail('Solution '+s.id+' has no portfolioClusterId');
    else if(clusterIds.indexOf(s.portfolioClusterId)===-1)fail('Solution '+s.id+' unknown portfolioClusterId: '+s.portfolioClusterId);
  });
  var validTech=['rules-workflow','rpa-orchestration','analytics-ml','genai-copilots','agents'];
  SOLUTIONS.forEach(function(s){
    if(!s.technologyPatternId)warn('Solution '+s.id+' ('+s.sourceNumber+'): technologyPatternId null');
    else if(validTech.indexOf(s.technologyPatternId)===-1)fail('Solution '+s.id+' unknown technologyPatternId: '+s.technologyPatternId);
  });
  var validSharing=['live','team','to-confirm','illustrative','nda'];
  SOLUTIONS.forEach(function(s){
    if(validSharing.indexOf(s.sharingStatus)===-1)fail('Solution '+s.id+' unknown sharingStatus: '+s.sharingStatus);
  });
  SOLUTIONS.forEach(function(s){
    var ef=s.evidenceFlags;
    if(!ef)fail('Solution '+s.id+': evidenceFlags missing');
    else['concept','prototype','asset','demo'].forEach(function(k){
      if(ef[k]!==null&&ef[k]!==true&&ef[k]!==false)fail('Solution '+s.id+': evidenceFlags.'+k+' invalid: '+ef[k]);
    });
  });
}
if(!Array.isArray(PORTFOLIO_CLUSTERS))fail('PORTFOLIO_CLUSTERS is not an array');
else{
  console.log('Portfolio clusters count: '+PORTFOLIO_CLUSTERS.length);
  if(PORTFOLIO_CLUSTERS.length!==7)warn('Expected 7 clusters, found '+PORTFOLIO_CLUSTERS.length);
}
if(Array.isArray(TRANSFORMATION_BLOCKS)){
  console.log('Transformation blocks count: '+TRANSFORMATION_BLOCKS.length);
  if(TRANSFORMATION_BLOCKS.length!==8)warn('Expected 8 blocks, found '+TRANSFORMATION_BLOCKS.length);
}
if(Array.isArray(RISK_CAPABILITIES)){
  console.log('Risk capabilities count: '+RISK_CAPABILITIES.length);
  if(RISK_CAPABILITIES.length!==47)warn('Expected 47 capabilities, found '+RISK_CAPABILITIES.length);
}
if(Array.isArray(AI_OPPORTUNITIES))console.log('AI opportunities count: '+AI_OPPORTUNITIES.length);
if(Array.isArray(USE_CASES))console.log('Use cases count: '+USE_CASES.length);

console.log('');
if(warnings.length){console.log('Warnings ('+warnings.length+'):');warnings.forEach(function(w){console.log('  [WARN] '+w);});}
if(errors.length){console.log('Errors ('+errors.length+'):');errors.forEach(function(e){console.log('  [FAIL] '+e);});process.exit(1);}
else console.log('All checks passed'+(warnings.length?' ('+warnings.length+' warnings)':'')+'.');
