// ── RISK CATEGORIES ──
var RISK_CATEGORIES=[
  {id:'enterprise-risk-resilience',name:'Enterprise Risk & Resilience',icon:'shield-check',color:'#A100FF',caps:['enterprise-risk','operational-risk','technology-risk','ai-risk','responsible-ai','enterprise-resilience','model-risk','third-party-risk','cyber-risk','integrated-risk-mgmt','emerging-risk','issue-management']},
  {id:'compliance',name:'Compliance',icon:'certificate',color:'#0891B2',caps:['regulatory-compliance','regulatory-change-mgmt','trade-surveillance','data-privacy','regulatory-remediation','risk-policy-controls']},
  {id:'financial-risk',name:'Financial Risk',icon:'chart-bar',color:'#F59E0B',caps:['consumer-credit','wholesale-credit','market-risk','liquidity-risk','balance-sheet-opt','frtb','stress-testing','capital-rwa','icaap-ccar','resolution-recovery']},
  {id:'financial-crime',name:'Financial Crime',icon:'search',color:'#EF4444',caps:['aml','kyc-clm','onboarding','fraud','sanctions-compliance']},
  {id:'data-reporting',name:'Data & Reporting',icon:'database',color:'#10B981',caps:['data-strategy','data-governance','data-quality','data-modernization','risk-metrics','regulatory-reporting','board-reporting']},
  {id:'controls-grc',name:'Controls & GRC',icon:'checks',color:'#FF50C8',caps:['control-design','control-monitoring','sox-compliance','risk-platforms','rcsa','process-risk-control','tech-cloud-ai-controls']}
];

// ── RISK CAPABILITIES (exact 47) ──
var RISK_CAPABILITIES=[
  // Enterprise Risk & Resilience (12)
  {id:'enterprise-risk',cat:'enterprise-risk-resilience',name:'Enterprise Risk',outcome:'Integrated view of material risks across the enterprise with clear appetite and escalation paths',process:'Risk appetite setting and monitoring, board reporting, strategic risk reviews',opps:['risk-signal-aggregation','risk-appetite-ai']},
  {id:'operational-risk',cat:'enterprise-risk-resilience',name:'Operational Risk',outcome:'Timely identification, assessment, and response to operational risk events and control failures',process:'RCSA, event capture and triage, issue management, KRI monitoring',opps:['rcsa-ai-workflow','kri-monitoring','oprisk-event-triage']},
  {id:'technology-risk',cat:'enterprise-risk-resilience',name:'Technology Risk',outcome:'Governed technology environment with clear risk ownership across systems and third parties',process:'Technology risk assessment, IT risk management, control attestation',opps:['tech-risk-ai']},
  {id:'ai-risk',cat:'enterprise-risk-resilience',name:'AI Risk',outcome:'AI deployments assessed, governed, and monitored before and during production',process:'AI inventory, use-case risk classification, monitoring, incident response',opps:['ai-inventory-governance']},
  {id:'responsible-ai',cat:'enterprise-risk-resilience',name:'Responsible AI',outcome:'AI outcomes fair, explainable, and auditable; controls proportionate to risk tier',process:'RAI assessment, bias testing, explainability, audit trail generation',opps:['rai-assurance']},
  {id:'enterprise-resilience',cat:'enterprise-risk-resilience',name:'Enterprise Resilience',outcome:'Critical services protected and recoverable within defined time and point objectives',process:'BCP testing, scenario planning, resilience reporting',opps:['resilience-scenario-ai']},
  {id:'model-risk',cat:'enterprise-risk-resilience',name:'Model Risk',outcome:'All models inventoried, validated, and monitored with documented accountability',process:'Model inventory, validation, documentation review, performance monitoring',opps:['model-doc-automation','model-validation-ai']},
  {id:'third-party-risk',cat:'enterprise-risk-resilience',name:'Third Party / Supply Chain Risk',outcome:'Third-party risk assessed and monitored continuously across critical and non-critical providers',process:'Third-party due diligence, ongoing monitoring, exit planning',opps:['third-party-risk-ai']},
  {id:'cyber-risk',cat:'enterprise-risk-resilience',name:'Cyber Risk',outcome:'Cyber posture measured, risks quantified, and incidents detected and contained quickly',process:'Cyber risk assessment, threat intelligence, incident management',opps:['cyber-signal-monitoring']},
  {id:'integrated-risk-mgmt',cat:'enterprise-risk-resilience',name:'Integrated Risk Management',outcome:'Unified risk taxonomy and governance connecting first, second, and third line views',process:'IRM governance, taxonomy management, integrated reporting',opps:['irm-data-integration']},
  {id:'emerging-risk',cat:'enterprise-risk-resilience',name:'Emerging Risk',outcome:'Early signals from external environment surfaced and assessed before they become material',process:'Horizon scanning, emerging risk assessment, board briefings',opps:['horizon-scanning-ai']},
  {id:'issue-management',cat:'enterprise-risk-resilience',name:'Issue Management',outcome:'Issues tracked, escalated, and resolved with clear accountability and evidence',process:'Issue logging, root cause analysis, remediation tracking, reporting',opps:['issue-tracking-ai']},
  // Compliance (6)
  {id:'regulatory-compliance',cat:'compliance',name:'Regulatory Compliance',outcome:'Obligations met, evidenced, and demonstrable to supervisors on demand',process:'Obligation mapping, compliance monitoring, evidence generation',opps:['regulatory-signal-extraction','compliance-monitoring-ai']},
  {id:'regulatory-change-mgmt',cat:'compliance',name:'Regulatory Change Management',outcome:'Regulatory changes assessed for impact and implemented before effective date without control gaps',process:'Regulatory horizon scanning, impact analysis, implementation tracking',opps:['regulatory-signal-extraction','reg-change-impact-ai']},
  {id:'trade-surveillance',cat:'compliance',name:'Trade Surveillance & Monitoring',outcome:'Market abuse signals detected and investigated with documented escalation',process:'Trade surveillance, alert management, investigation documentation',opps:['trade-surveillance-ai']},
  {id:'data-privacy',cat:'compliance',name:'Data Privacy',outcome:'Personal data processed lawfully with documented basis and rights managed',process:'Privacy impact assessments, consent management, subject access requests',opps:['privacy-assessment-ai']},
  {id:'regulatory-remediation',cat:'compliance',name:'Regulatory Remediation / Assurance',outcome:'Regulatory findings closed completely and on time with verifiable evidence',process:'Finding management, remediation planning, evidence assembly, attestation',opps:['remediation-tracking-ai']},
  {id:'risk-policy-controls',cat:'compliance',name:'Regulatory Risk Policy & Controls',outcome:'Policies current, implemented, and tested against applicable obligations',process:'Policy management, control mapping, testing, exception management',opps:['policy-control-ai']},
  // Financial Risk (10)
  {id:'consumer-credit',cat:'financial-risk',name:'Consumer Credit',outcome:'Credit decisions fast, fair, and profitable with documented rationale',process:'Application processing, credit scoring, portfolio monitoring, collections',opps:['credit-assessment-ai','credit-portfolio-ai']},
  {id:'wholesale-credit',cat:'financial-risk',name:'Wholesale / Commercial Credit',outcome:'Corporate credit exposure governed with timely review and early-warning monitoring',process:'Credit analysis, limit management, annual review, watch-list monitoring',opps:['credit-memo-ai','credit-portfolio-ai']},
  {id:'market-risk',cat:'financial-risk',name:'Market Risk',outcome:'Market risk positions measured accurately and limits monitored in near real time',process:'VaR computation, limit monitoring, sensitivity analysis, P&L attribution',opps:['market-risk-analytics-ai']},
  {id:'liquidity-risk',cat:'financial-risk',name:'Liquidity Risk',outcome:'Liquidity position measured daily with early warning of shortfall conditions',process:'LCR/NSFR monitoring, stress testing, contingency planning',opps:['liquidity-monitoring-ai']},
  {id:'balance-sheet-opt',cat:'financial-risk',name:'Balance Sheet Optimization',outcome:'Capital and funding deployed efficiently across business lines and risk constraints',process:'ALM, NII analysis, hedging strategy, FTP management',opps:['balance-sheet-ai']},
  {id:'frtb',cat:'financial-risk',name:'FRTB / Regulatory Readiness',outcome:'FRTB requirements implemented on time with validated models and controls',process:'Model development, SA/IMA application, backtesting, reporting',opps:['frtb-reporting-ai']},
  {id:'stress-testing',cat:'financial-risk',name:'Stress Testing / DFAST',outcome:'Stress scenarios credible, computed efficiently, and defensible to supervisors',process:'Scenario design, model execution, result aggregation, disclosure',opps:['stress-scenario-ai']},
  {id:'capital-rwa',cat:'financial-risk',name:'Capital & RWA Optimization',outcome:'Capital allocated to highest-return uses within regulatory limits',process:'RWA calculation, capital planning, optimization analysis',opps:['capital-ai']},
  {id:'icaap-ccar',cat:'financial-risk',name:'ICAAP / CCAR',outcome:'Internal capital adequacy assessed robustly and documented for supervisory review',process:'Internal model governance, ICAAP narrative, board approval',opps:['icaap-document-ai']},
  {id:'resolution-recovery',cat:'financial-risk',name:'Resolution & Recovery Planning',outcome:'Recovery and resolution plans current, credible, and executable',process:'RRP development, playbook testing, regulatory submission',opps:['rrp-document-ai']},
  // Financial Crime (5)
  {id:'aml',cat:'financial-crime',name:'Anti-Money Laundering (AML)',outcome:'Money laundering activity detected, investigated, and reported without excessive false positives',process:'Transaction monitoring, alert management, investigation, SAR filing',opps:['aml-detection-ai']},
  {id:'kyc-clm',cat:'financial-crime',name:'Client Lifecycle Management (KYC)',outcome:'Client risk understood from onboarding through relationship lifecycle',process:'Risk-based due diligence, periodic review, enhanced due diligence',opps:['kyc-automation-ai']},
  {id:'onboarding',cat:'financial-crime',name:'Onboarding',outcome:'Clients onboarded fast with complete, current, and proportionate risk assessment',process:'Document collection, verification, risk scoring, approval workflow',opps:['kyc-automation-ai','onboarding-doc-ai']},
  {id:'fraud',cat:'financial-crime',name:'Fraud',outcome:'Fraud detected in near real time with proportionate friction for legitimate customers',process:'Transaction scoring, rules management, investigation, recovery',opps:['fraud-detection-ai']},
  {id:'sanctions-compliance',cat:'financial-crime',name:'Sanctions Compliance',outcome:'Sanctions exposure screened accurately with false-positive rate managed',process:'Name screening, transaction screening, alert disposition, escalation',opps:['sanctions-screening-ai']},
  // Data & Reporting (7)
  {id:'data-strategy',cat:'data-reporting',name:'Data Strategy',outcome:'Data investments aligned to risk priorities with governed architecture and ownership',process:'Data landscape assessment, strategy development, roadmap governance',opps:['data-landscape-ai']},
  {id:'data-governance',cat:'data-reporting',name:'Data Governance',outcome:'Data owned, defined, and maintained with documented lineage',process:'Data dictionary, ownership model, quality standards, lineage mapping',opps:['data-governance-ai']},
  {id:'data-quality',cat:'data-reporting',name:'Data Quality',outcome:'Risk data fit for purpose with measured quality dimensions and remediation',process:'Profiling, quality scoring, issue management, BCBS 239 compliance',opps:['data-quality-ai']},
  {id:'data-modernization',cat:'data-reporting',name:'Data Modernization & Architecture',outcome:'Modern data architecture supporting real-time risk decisions and regulatory access',process:'Platform selection, migration, API design, data product development',opps:['data-arch-ai']},
  {id:'risk-metrics',cat:'data-reporting',name:'Risk Metrics & Measurements',outcome:'Risk metrics defined, calculated consistently, and delivered reliably across lines',process:'Metric governance, calculation logic, aggregation, validation',opps:['risk-metrics-ai']},
  {id:'regulatory-reporting',cat:'data-reporting',name:'Regulatory Reporting',outcome:'Regulatory returns accurate, on time, and defensible',process:'Data collection, calculation, validation, submission, attestation',opps:['regulatory-report-ai']},
  {id:'board-reporting',cat:'data-reporting',name:'Board Risk Reporting',outcome:'Board receives clear, concise, and accurate risk information at the right moment',process:'Report design, data assembly, narrative drafting, review, distribution',opps:['board-report-ai']},
  // Controls & GRC (7)
  {id:'control-design',cat:'controls-grc',name:'Control Design, Transformation & Remediation',outcome:'Controls proportionate, effective, and designed once across linked obligations and processes',process:'Control mapping, design workshops, effectiveness assessment, remediation',opps:['control-design-ai']},
  {id:'control-monitoring',cat:'controls-grc',name:'Control Monitoring & Testing',outcome:'Control performance evidenced continuously with automated sampling and exception tracking',process:'Control test planning, evidence collection, sampling, exception management',opps:['control-test-automation']},
  {id:'sox-compliance',cat:'controls-grc',name:'Internal Controls & SOX Compliance',outcome:'SOX controls tested, evidenced, and signed off within reporting cycle',process:'Control inventory, test execution, deficiency management, attestation',opps:['sox-ai']},
  {id:'risk-platforms',cat:'controls-grc',name:'Risk Platforms & GRC',outcome:'GRC platform used effectively with current data, automated workflows, and clean reporting',process:'Platform administration, data quality, workflow management, reporting',opps:['grc-platform-ai']},
  {id:'rcsa',cat:'controls-grc',name:'Risk & Control Self Assessment',outcome:'RCSA complete, current, and linked to the control library with action ownership',process:'RCSA scheduling, workshop facilitation, evidence review, rating, sign-off',opps:['rcsa-ai-workflow']},
  {id:'process-risk-control',cat:'controls-grc',name:'Process Risk & Control',outcome:'Process-level risks and controls documented, owned, and embedded in operations',process:'Process mapping, risk identification, control design, operating effectiveness',opps:['process-risk-ai']},
  {id:'tech-cloud-ai-controls',cat:'controls-grc',name:'Technology, Cloud & AI Controls',outcome:'Technology control environment current and proportionate to risk including AI systems',process:'Technology control assessment, cloud governance, AI control testing',opps:['tech-control-ai','ai-inventory-governance']}
];

// ── AI OPPORTUNITIES ──
var AI_OPPORTUNITIES=[
  {id:'rcsa-ai-workflow',name:'AI-assisted RCSA workflow',caps:['rcsa','operational-risk'],blocks:['work-decisions-controls','data-knowledge-evidence'],status:'team'},
  {id:'regulatory-signal-extraction',name:'Regulatory signal extraction and obligation mapping',caps:['regulatory-compliance','regulatory-change-mgmt'],blocks:['data-knowledge-evidence','work-decisions-controls'],status:'live'},
  {id:'reg-change-impact-ai',name:'Regulatory change impact analysis',caps:['regulatory-change-mgmt'],blocks:['work-decisions-controls','data-knowledge-evidence'],status:'team'},
  {id:'model-doc-automation',name:'Model documentation and gap analysis',caps:['model-risk'],blocks:['work-decisions-controls'],status:'team'},
  {id:'model-validation-ai',name:'Model validation support and backtesting review',caps:['model-risk'],blocks:['work-decisions-controls'],status:'illustrative'},
  {id:'control-test-automation',name:'Automated control testing and evidence',caps:['control-monitoring','sox-compliance'],blocks:['work-decisions-controls','data-knowledge-evidence'],status:'team'},
  {id:'data-quality-ai',name:'Data quality profiling and remediation',caps:['data-quality','data-governance'],blocks:['data-knowledge-evidence'],status:'live'},
  {id:'regulatory-report-ai',name:'Regulatory reporting automation and validation',caps:['regulatory-reporting'],blocks:['work-decisions-controls','data-knowledge-evidence'],status:'team'},
  {id:'board-report-ai',name:'Board and management report drafting',caps:['board-reporting','risk-metrics'],blocks:['work-decisions-controls'],status:'illustrative'},
  {id:'credit-assessment-ai',name:'Credit assessment copilot and memo drafting',caps:['consumer-credit','wholesale-credit'],blocks:['work-decisions-controls'],status:'illustrative'},
  {id:'credit-portfolio-ai',name:'Credit portfolio monitoring and early warning',caps:['consumer-credit','wholesale-credit'],blocks:['data-knowledge-evidence'],status:'illustrative'},
  {id:'aml-detection-ai',name:'AML transaction pattern detection',caps:['aml'],blocks:['work-decisions-controls','ai-automation-platforms'],status:'nda'},
  {id:'sanctions-screening-ai',name:'Sanctions screening false-positive reduction',caps:['sanctions-compliance'],blocks:['ai-automation-platforms'],status:'nda'},
  {id:'kyc-automation-ai',name:'KYC document extraction and risk scoring',caps:['kyc-clm','onboarding'],blocks:['work-decisions-controls','data-knowledge-evidence'],status:'nda'},
  {id:'fraud-detection-ai',name:'Real-time fraud scoring and case management',caps:['fraud'],blocks:['ai-automation-platforms','work-decisions-controls'],status:'illustrative'},
  {id:'third-party-risk-ai',name:'Third-party risk profile aggregation',caps:['third-party-risk'],blocks:['data-knowledge-evidence'],status:'nda'},
  {id:'stress-scenario-ai',name:'Stress scenario generation and narrative drafting',caps:['stress-testing','enterprise-risk'],blocks:['work-decisions-controls'],status:'illustrative'},
  {id:'horizon-scanning-ai',name:'Emerging risk horizon scanning',caps:['emerging-risk','regulatory-change-mgmt'],blocks:['data-knowledge-evidence'],status:'team'},
  {id:'kri-monitoring',name:'KRI monitoring and automated escalation',caps:['operational-risk','enterprise-risk'],blocks:['data-knowledge-evidence','work-decisions-controls'],status:'illustrative'},
  {id:'oprisk-event-triage',name:'Operational risk event triage and classification',caps:['operational-risk'],blocks:['work-decisions-controls'],status:'illustrative'},
  {id:'rcsa-ai-workflow':undefined} // guard – removed duplicate
];
// Remove malformed entry
AI_OPPORTUNITIES=AI_OPPORTUNITIES.filter(function(o){return o&&o.id&&o.name;});

// ── USE CASES ──
var USE_CASES=[
  {id:'regalytics',name:'Regulatory data validation (RegAIlytics)',status:'live',oppIds:['regulatory-signal-extraction'],capIds:['regulatory-compliance','data-quality'],blockIds:['data-knowledge-evidence'],tool:'Custom AI + Python',flow:['Ingest feeds','Extract obligations','Flag gaps','Dashboard output']},
  {id:'data-conqueror',name:'Data quality assurance (Data Conqueror)',status:'live',oppIds:['data-quality-ai'],capIds:['data-quality','data-governance'],blockIds:['data-knowledge-evidence'],tool:'AI + SQL',flow:['Profile data','Score dimensions','Flag issues','Remediation report']},
  {id:'rcsa-workflow',name:'AI-assisted RCSA workflow',status:'team',oppIds:['rcsa-ai-workflow'],capIds:['rcsa','operational-risk'],blockIds:['work-decisions-controls','data-knowledge-evidence'],tool:'LLM + GRC API',flow:['Trigger RCSA','AI draft assessment','Risk officer reviews','Sign-off and log']},
  {id:'reg-change',name:'Regulatory change impact analysis',status:'team',oppIds:['reg-change-impact-ai'],capIds:['regulatory-change-mgmt'],blockIds:['work-decisions-controls','data-knowledge-evidence'],tool:'LLM + RAG',flow:['Ingest rule','Map obligations','Gap analysis','Action plan']},
  {id:'model-doc',name:'Model documentation and validation support',status:'team',oppIds:['model-doc-automation'],capIds:['model-risk'],blockIds:['work-decisions-controls'],tool:'LLM + Model repo',flow:['Extract model info','Draft documentation','Validate gaps','Submit to MRM']},
  {id:'ctrl-test',name:'Automated control testing and evidence',status:'team',oppIds:['control-test-automation'],capIds:['control-monitoring','sox-compliance'],blockIds:['work-decisions-controls','data-knowledge-evidence'],tool:'AI + GRC platform',flow:['Sample population','Extract evidence','AI assessment','Exception report']},
  {id:'stress-ai',name:'Stress scenario generation and narrative',status:'illustrative',oppIds:['stress-scenario-ai'],capIds:['stress-testing'],blockIds:['work-decisions-controls'],tool:'LLM + Excel API',flow:['Input parameters','Generate scenarios','Review and stress','Board narrative']},
  {id:'credit-memo',name:'Credit memo drafting copilot',status:'illustrative',oppIds:['credit-assessment-ai'],capIds:['wholesale-credit'],blockIds:['work-decisions-controls'],tool:'GenAI copilot',flow:['Load credit file','AI draft memo','Analyst edit','Credit officer approves']},
  {id:'horizon-scan',name:'Emerging risk horizon scanning',status:'team',oppIds:['horizon-scanning-ai'],capIds:['emerging-risk','regulatory-change-mgmt'],blockIds:['data-knowledge-evidence'],tool:'LLM + news/reg feeds',flow:['Monitor feeds','Classify signals','Risk scoring','Briefing note']},
  {id:'kri-auto',name:'KRI monitoring and escalation',status:'illustrative',oppIds:['kri-monitoring'],capIds:['operational-risk'],blockIds:['data-knowledge-evidence','work-decisions-controls'],tool:'ML + alerting',flow:['Monitor KRIs','Threshold breach','Auto-escalate','Risk officer reviews']},
  {id:'board-report',name:'Board risk report drafting',status:'illustrative',oppIds:['board-report-ai'],capIds:['board-reporting'],blockIds:['work-decisions-controls'],tool:'LLM + data layer',flow:['Pull risk data','Draft narrative','CFO/CRO review','Board submission']},
  {id:'reg-report',name:'Regulatory reporting automation',status:'illustrative',oppIds:['regulatory-report-ai'],capIds:['regulatory-reporting'],blockIds:['work-decisions-controls','data-knowledge-evidence'],tool:'AI + report templates',flow:['Aggregate data','AI validation','Compliance review','File return']},
  {id:'tprisk',name:'Third-party risk profile aggregation',status:'nda',oppIds:['third-party-risk-ai'],capIds:['third-party-risk'],blockIds:['data-knowledge-evidence'],tool:'Ask team',flow:['Ingest profile','AI scoring','Risk officer reviews','Decision and log']},
  {id:'aml-monitor',name:'AML transaction pattern detection',status:'nda',oppIds:['aml-detection-ai'],capIds:['aml'],blockIds:['ai-automation-platforms','work-decisions-controls'],tool:'Ask team',flow:['Ingest transactions','ML scoring','Alert triage','Investigate and report']},
  {id:'sanctions-opt',name:'Sanctions screening false-positive reduction',status:'nda',oppIds:['sanctions-screening-ai'],capIds:['sanctions-compliance'],blockIds:['ai-automation-platforms'],tool:'Ask team',flow:['Screen names','Reduce FPs','Compliance review','Clear or escalate']},
  {id:'kyc-auto',name:'KYC document extraction and periodic review',status:'nda',oppIds:['kyc-automation-ai'],capIds:['kyc-clm','onboarding'],blockIds:['work-decisions-controls','data-knowledge-evidence'],tool:'Ask team',flow:['Collect docs','AI extraction','Risk scoring','Analyst approves']}
];

// ── TRANSFORMATION BLOCKS ──
var TRANSFORMATION_BLOCKS=[
  {
    id:'risk-portfolio',name:'Risk service & capability portfolio',icon:'briefcase',color:'#A100FF',position:'top',
    executiveQuestion:'Which risk services and decisions should exist, who owns them, and where is there duplication?',
    why:'Without clear ownership and scope, risk capabilities sprawl, duplicate, and create inconsistent outputs and evidence.',
    failureModes:['Duplicate risk assessments across first and second line','No single owner for material risk decisions','Tools and workflows built locally for every team'],
    diagnosticQuestions:['Do you have a single catalogue of risk services and accountable owners?','Where do first-line and second-line capabilities overlap or conflict?','Which risk services are differentiating versus common?'],
    targetPrinciples:['One accountable owner per risk service','Productized risk services with defined inputs, outputs, and SLAs','Invest, consolidate, reuse, retire, or source decisions made explicitly'],
    interventions:{noRegret:['Document current capability and ownership','Identify duplicates and gaps'],lighthouse:['Design service catalogue with ownership model'],industrialize:['Implement productized risk service model'],scale:['Continuous capability portfolio review']},
    kpis:['Service ownership coverage (%)','Duplicate capability reduction','Time to onboard new capability']
  },
  {
    id:'work-decisions-controls',name:'End-to-end work, decisions & controls',icon:'route',color:'#0891B2',position:'middle-left',
    executiveQuestion:'How does work move from signal to decision to evidence, and where must a human remain in the lead?',
    why:'Without clear process and decision design, AI is inserted into fragmented work that cannot scale safely.',
    failureModes:['Approval gates undefined or bypassed','Human accountability unclear in AI-assisted workflows','Controls embedded in spreadsheets rather than the workflow'],
    diagnosticQuestions:['Which decisions require human sign-off and why?','Where are the main handoffs and rework loops?','Which controls are embedded in the workflow versus manual checks?'],
    targetPrinciples:['Every consequential decision has a named human accountable','Controls embedded in the workflow, not layered on top','Exception and fallback paths designed and tested'],
    interventions:{noRegret:['Map current process for priority capabilities','Define decision rights and human gates'],lighthouse:['Redesign target process for lighthouse use case'],industrialize:['Deploy workflow orchestration with embedded controls'],scale:['Extend process model across full capability set']},
    kpis:['Process cycle time','Rework and exception rate','Control evidence completeness (%)','Human gate completion rate']
  },
  {
    id:'data-knowledge-evidence',name:'Data, knowledge & evidence',icon:'database',color:'#0F8A62',position:'foundation-left',
    executiveQuestion:'What context must be available for reliable decisions, and how is evidence generated and traced?',
    why:'AI without quality data and traceable evidence produces confident wrong outputs and fails regulatory scrutiny.',
    failureModes:['AI context assembled from stale or incomplete sources','No evidence of what data was used for a decision','Regulatory knowledge embedded in human memory rather than structured data'],
    diagnosticQuestions:['What data sources are required for the top three priority capabilities?','Can you trace the data lineage for a recent regulatory submission?','Where is institutional knowledge held that AI would need access to?'],
    targetPrinciples:['All AI context has documented provenance and freshness','Every decision has a traceable evidence log','Risk and regulatory knowledge managed as structured data products'],
    interventions:{noRegret:['Inventory key data sources for priority capabilities','Define evidence log requirements'],lighthouse:['Build retrieval and context service for lighthouse use case'],industrialize:['Deploy shared data products and evidence store'],scale:['Continuous data quality and lineage monitoring']},
    kpis:['Data freshness by source','Evidence completeness (%)','Lineage coverage','Knowledge base coverage for priority capabilities']
  },
  {
    id:'ai-automation-platforms',name:'AI, automation, integration & platforms',icon:'cpu',color:'#FF50C8',position:'foundation-right',
    executiveQuestion:'Which technology pattern is appropriate, and what shared platform capabilities prevent every team from building its own stack?',
    why:'Without shared platform services, every use case builds its own AI stack, creating cost, security, and governance debt.',
    failureModes:['Multiple disconnected AI tools deployed without governance','No model gateway or routing — every team calls models directly','Evaluation and observability absent until a failure occurs'],
    diagnosticQuestions:['What AI and automation tools are currently deployed and by whom?','Is there a model gateway or routing layer?','Who owns evaluation, observability, and model lifecycle?'],
    targetPrinciples:['Use the least complex technology that can own the work safely and economically','Shared platform services used by all use cases','Evaluation and observability built in from the start'],
    interventions:{noRegret:['Inventory current AI tools and APIs','Define model governance standards'],lighthouse:['Deploy shared model gateway and orchestration for lighthouse'],industrialize:['Build reusable AI services layer'],scale:['Full platform as a product — shared, governed, cost-tracked']},
    kpis:['Platform reuse rate (%)','Cost per task/decision','Model evaluation coverage','Incident and failure rate','Mean time to detect and recover']
  },
  {
    id:'org-roles-adoption',name:'Organisation, roles, workforce & adoption',icon:'users',color:'#B46A00',position:'middle-right',
    executiveQuestion:'Which roles change, what new skills are needed, and how is capacity actually redeployed or captured?',
    why:'Automation without adoption planning frees capacity that is not captured, and creates risk when humans disengage from oversight.',
    failureModes:['Capacity freed by AI not redeployed or captured','Analysts disengaged from AI outputs they do not understand','New roles such as context engineering and AgentOps not designed or hired'],
    diagnosticQuestions:['Do you have a task-level view of what changes in the priority roles?','What is the plan for redeploying capacity freed by automation?','Which skills must be built and which can be sourced?'],
    targetPrinciples:['Capacity capture is planned and governed before deployment','Every role with AI-assisted work has a clear human gate and accountability','New roles designed at the start, not after deployment'],
    interventions:{noRegret:['Task decomposition for priority roles','Capacity-capture hypothesis'],lighthouse:['Change plan for lighthouse pod'],industrialize:['Workforce transition programme and new-role design'],scale:['Continuous workforce optimization and skills monitoring']},
    kpis:['Capacity captured (%age of freed time redeployed)','Adoption rate','Human gate completion rate','Skills gap closure']
  },
  {
    id:'governance-security',name:'Governance, security, resilience & assurance',icon:'shield',color:'#EF4444',position:'rail-left',
    executiveQuestion:'What must be proven before autonomy increases?',
    why:'Without proportionate governance, AI in risk functions creates new model risk, accountability gaps, and regulatory exposure.',
    failureModes:['AI models deployed without validation or documented accountability','Agent access not controlled — can act beyond intended scope','No audit trail for AI-assisted decisions presented to regulators'],
    diagnosticQuestions:['What is the current AI model risk governance framework?','Are agent identities and permissions documented and controlled?','Can you produce an evidence pack for an AI-assisted decision within 24 hours?'],
    targetPrinciples:['Proportionate controls by use-case risk tier — not one size fits all','Audit trail is automatic, not assembled post-hoc','Autonomy increases only as evidence, controls, and adoption mature'],
    interventions:{noRegret:['RAI assessment for all proposed use cases','Agent identity and permission model'],lighthouse:['Governance framework for lighthouse use case'],industrialize:['Shared control layer for all AI deployments'],scale:['Continuous governance monitoring and regulatory horizon alignment']},
    kpis:['RAI assessment coverage (%)','Evidence pack readiness time','Model validation completion rate','Regulatory finding rate related to AI']
  },
  {
    id:'value-cost-performance',name:'Value, cost & performance management',icon:'chart-bar',color:'#0E7490',position:'rail-right',
    executiveQuestion:'How do we know value is real, and how do we keep AI unit cost proportional to the outcome?',
    why:'Without value governance, AI programmes produce effort and technology cost without demonstrated business return.',
    failureModes:['No baseline before deployment — value cannot be measured','Cost per task unknown until cloud bills arrive','Capacity freed but not captured in headcount or output plan'],
    diagnosticQuestions:['Do you have a baseline for the processes in scope?','Who owns the benefit case and the realization plan?','What is the current cost per task for the priority workflow?'],
    targetPrinciples:['Baseline before build — no exceptions','One benefit owner per use case and a value gate before scale','AI unit cost tracked per outcome, not per token'],
    interventions:{noRegret:['Baseline measurement for priority processes','Benefit ownership model'],lighthouse:['Value gate design and KPI instrumentation'],industrialize:['Value office and FinOps practice'],scale:['Continuous benefit harvesting and cost optimization']},
    kpis:['Capacity captured','Cycle-time improvement','Quality and risk improvement','Cost per task/decision','Value per euro invested','Realized vs. theoretical value (%)']
  },
  {
    id:'business-risk-tech',name:'Business–risk–technology interface',icon:'arrows-exchange',color:'#6366F1',position:'bridge',
    executiveQuestion:'Who owns the outcome, the risk decision, the platform, the data, and the investment?',
    why:'When business, risk, and technology work in separate programmes with separate backlogs and budgets, AI use cases fail at handoff points.',
    failureModes:['Risk function builds use cases on technology that cannot scale','Technology builds platforms that risk teams cannot use','Finance approves use-case funding but not the shared platform beneath it'],
    diagnosticQuestions:['Is there a single backlog and roadmap owned jointly by risk and technology?','Who decides the target architecture for risk AI?','How are shared platform costs and benefits allocated?'],
    targetPrinciples:['Joint product ownership for every AI-enabled risk service','One backlog, one target architecture, one value model','Funding decisions include the shared foundation, not only the use case'],
    interventions:{noRegret:['Establish joint governance model','Map current ownership and decision rights'],lighthouse:['Joint operating model for lighthouse pod'],industrialize:['Integrated programme governance'],scale:['Permanent joint risk-technology operating council']},
    kpis:['Joint backlog health','Decision cycle time','Architecture compliance rate','Shared platform adoption rate']
  }
];

// ── MATURITY LEVELS ──
var MATURITY_LEVELS=[
  {id:'assist',label:'Assist',number:1,desc:'AI finds and surfaces relevant information. Human does all analysis and decides.',humanRole:'All analysis and decision making',controlFocus:'Quality of information surfaced',example:'AI retrieves relevant regulation; analyst reads and interprets'},
  {id:'augment',label:'Augment',number:2,desc:'AI drafts, summarises, and recommends. Human reviews, edits, and decides.',humanRole:'Review, judgment, and sign-off',controlFocus:'Review quality and completeness',example:'AI drafts RCSA risk assessment; risk officer approves or modifies'},
  {id:'automate',label:'Automate',number:3,desc:'AI performs defined tasks end-to-end within controlled scope. Human handles exceptions.',humanRole:'Exception handling and oversight',controlFocus:'Scope boundaries and exception routing',example:'AI extracts and validates data; human reviews exceptions above threshold'},
  {id:'orchestrate',label:'Orchestrate',number:4,desc:'AI coordinates multiple systems and agents across a multi-step workflow.',humanRole:'Scope-setting, gate decisions, and audit',controlFocus:'Agent boundaries, permissions, and observability',example:'AI agent manages RCSA end-to-end; human approves at defined gates'},
  {id:'bounded-autonomy',label:'Bounded autonomy',number:5,desc:'AI acts within explicit boundaries; humans set scope, rules, and review material exceptions.',humanRole:'Rule design, exception review, and continuous governance',controlFocus:'Autonomy boundaries, monitoring, and rollback',example:'AI monitors controls and self-remediates defined exception types'}
];

// ── DELIVERY PHASES ──
var DELIVERY_PHASES=[
  {id:'align-mobilize',name:'Align & mobilise',duration:'Weeks 1–2',output:'Scope, team, and baseline agreed',aiAccelerate:'AI-assisted stakeholder map and dependency analysis',humanDecision:'Scope sign-off by CRO/CFO/CTO'},
  {id:'measure-current',name:'Measure current state',duration:'Weeks 2–6',output:'Fact base and minimum evidence pack',aiAccelerate:'AI ingestion and mapping of policies, processes, controls, and data landscape',humanDecision:'Evidence accepted as sufficient to proceed'},
  {id:'validate-design',name:'Validate & design target',duration:'Weeks 4–10',output:'Target-state design and maturity roadmap',aiAccelerate:'AI-assisted gap analysis, design option generation, and requirements drafting',humanDecision:'Target-state design accepted by all owners'},
  {id:'prove-real-work',name:'Prove on real work',duration:'Weeks 6–14',output:'Lighthouse MVP with evidence log live',aiAccelerate:'AI-assisted code, test generation, and evidence pack',humanDecision:'Gate: value, control, adoption, and economics evidenced'},
  {id:'industrialize',name:'Industrialise foundations',duration:'Weeks 12–24',output:'Shared platform, controls, and workforce transition underway',aiAccelerate:'AI-assisted architecture, documentation, and operational runbook generation',humanDecision:'Gate: shared platform accepted; scale decision made'},
  {id:'scale-run-optimize',name:'Scale, run & optimise',duration:'Month 6+',output:'Enterprise rollout, value capture, and continuous optimization',aiAccelerate:'Automated monitoring, evaluation, FinOps, and benefit tracking',humanDecision:'Continuous: value gates and governance reviews'}
];

// ── ACCENTURE EDGE ──
var ACCENTURE_EDGE=[
  {id:'ai-delivery',engine:'A',name:'AI-enabled transformation delivery',mechanism:'AI ingests and synthesises policies, processes, controls, org data, and inventories. First-pass capability mapping and task decomposition automated. Requirements, specifications, testing, and evidence packs AI-assisted. Human experts validate decisions and exceptions.',clientEffect:'Faster route to a validated fact base and agreed target-state design',evidenceMetrics:['Time to validated fact base','Time to agreed target-state design','Rework rate','Artefacts produced and accepted'],clientDependency:'Access to documents and data; named SME for material decision validation'},
  {id:'reusable-assets',engine:'A',name:'Reusable risk and regulatory assets',mechanism:'Risk capability taxonomy and 47-capability map. Regulatory and control patterns. Reference architecture. Proof KPI library. Responsible AI checklists. Existing NFR AI use-case implementations (RegAIlytics, Data Conqueror, RCSA workflow, and more).',clientEffect:'Lower build cost and faster time to evidence by reusing proven patterns rather than building from scratch',evidenceMetrics:['Reuse rate (%)','Time avoided versus greenfield build','Defects or design gaps prevented by reuse'],clientDependency:'Client data and context to adapt patterns; change authority to adopt standards'},
  {id:'full-stack-infra',engine:'B',name:'Full-stack infrastructure & platform depth',mechanism:'Fit-for-purpose workload placement. Model-agnostic gateway and routing. Shared context and retrieval. Agent identity, security, observability, and lifecycle. Cloud, sovereign, hybrid, and on-premises design. Integration with systems of record.',clientEffect:'Lower avoidable build and run cost through shared platform services and right-sized technology choices',evidenceMetrics:['Cost per task or workflow','Platform reuse (%)','Latency and availability','Failure and exception rate'],clientDependency:'Architecture and procurement authority; access to systems of record'},
  {id:'industrialized-build-run',engine:'B',name:'Industrialised build & run',mechanism:'Reusable engineering patterns. Automated testing and evaluation. Evidence generated while work happens. Production controls and AgentOps from the start. Managed optimization after launch.',clientEffect:'Faster route from proof to production; lower defect and incident rate',evidenceMetrics:['Time from proof to production','Evaluation coverage (%)','Incident rate','Mean time to detect and recover'],clientDependency:'Deployment authority; agreed controls and change process'},
  {id:'value-economics',engine:'A+B',name:'Value realization & economics',mechanism:'Baseline before build. Value gates at each phase. Adoption and capacity-capture plan. AI FinOps and tokenomics. Outcome-based roadmap and funding. Continuous value tracking.',clientEffect:'Higher realized value and lower unit run cost through disciplined value management',evidenceMetrics:['Capacity captured','Cycle-time improvement','Cost per task/decision','Value per euro invested'],clientDependency:'Benefit ownership; baseline data; budget and reallocation authority'}
];

// ── ECONOMICS DRIVERS ──
var ECONOMICS_DRIVERS=[
  {id:'workload-volume',name:'Workload volume & pattern',weight:'high',levers:['Batch where latency allows','Rate-limit low-priority queries','Cache repeated context'],children:[
    {id:'query-frequency',name:'Query frequency',desc:'Queries per hour/day drive base compute cost'},
    {id:'concurrent-users',name:'Concurrent users',desc:'Peak concurrency determines infrastructure tier'},
    {id:'data-volume',name:'Data volume ingested',desc:'Document and data volume drives storage and retrieval cost'}
  ]},
  {id:'model-routing',name:'Model & routing',weight:'high',levers:['Use rules or small models for simple tasks','Route by complexity tier','Avoid frontier models for deterministic work'],children:[
    {id:'model-tier',name:'Model tier selection',desc:'Frontier vs. mid-tier vs. small model — 10x–100x cost difference'},
    {id:'context-window',name:'Context window size',desc:'Larger context = higher token cost per call'},
    {id:'inference-latency',name:'Latency requirement',desc:'Real-time routing is more expensive than async batch'}
  ]},
  {id:'context-retrieval',name:'Context & retrieval',weight:'medium',levers:['Reduce unnecessary context','Cache retrieved chunks','Use embedding reuse across similar queries'],children:[
    {id:'retrieval-scope',name:'Retrieval scope',desc:'Broad retrieval sends more tokens per call'},
    {id:'doc-freshness',name:'Document freshness strategy',desc:'Re-indexing frequency drives embedding cost'},
    {id:'embedding-cost',name:'Embedding model cost',desc:'Frequency and dimension of embeddings'}
  ]},
  {id:'platform-infra',name:'Platform & infrastructure',weight:'medium',levers:['Share platform services across use cases','Right-size compute and scale to zero','Apply FinOps tagging from day one'],children:[
    {id:'compute-tier',name:'Compute tier',desc:'GPU vs CPU vs serverless for inference'},
    {id:'storage',name:'Storage and retrieval infrastructure',desc:'Vector store, object store, and warm data costs'},
    {id:'network-egress',name:'Network egress',desc:'Cross-region or cross-cloud data movement'}
  ]},
  {id:'human-oversight',name:'Human oversight cost',weight:'medium',levers:['Risk-tier the review requirement','Use AI pre-screening to reduce human review volume','Track override rates to calibrate automation scope'],children:[
    {id:'review-frequency',name:'Review frequency',desc:'How often human reviews AI output before action'},
    {id:'complexity-routing',name:'Complexity-based routing',desc:'Simple cases auto-approved; complex cases escalated'},
    {id:'exception-handling',name:'Exception handling effort',desc:'Time spent on edge cases and AI failures'}
  ]},
  {id:'evaluation-ops',name:'Evaluation, observability & ops',weight:'low',levers:['Automate evaluation with golden datasets','Share observability platform across use cases','Build evidence while work happens — avoid retro logging'],children:[
    {id:'monitoring-frequency',name:'Monitoring frequency',desc:'How often quality and performance metrics are computed'},
    {id:'logging-volume',name:'Logging and trace volume',desc:'Granularity of audit and observability traces'},
    {id:'incident-rate',name:'Incident and rework rate',desc:'Failure and exception volume drives remediation cost'}
  ]}
];

// ── ROLE DATA ──
var ROLE_DATA=[
  {name:'Reporting and risk data',shareA:15,shareB:13,splitA:[70,15,15],splitB:[70,15,15]},
  {name:'Governance and policy',shareA:9,shareB:10,splitA:[65,15,20],splitB:[65,15,20]},
  {name:'Market and treasury',shareA:8,shareB:6,splitA:[60,15,25],splitB:[60,15,25]},
  {name:'Credit and underwriting',shareA:32,shareB:20,splitA:[45,20,35],splitB:[55,20,25]},
  {name:'Model development',shareA:12,shareB:7,splitA:[55,20,25],splitB:[55,20,25]},
  {name:'Non-financial risk',shareA:12,shareB:35,splitA:[30,30,40],splitB:[30,30,40]},
  {name:'Appetite and scenarios',shareA:6,shareB:5,splitA:[35,15,50],splitB:[35,15,50]},
  {name:'Model validation',shareA:6,shareB:4,splitA:[25,20,55],splitB:[25,20,55]}
];

// ── EXPERTS ──
var EXPERTS=[
  {name:'Thomas Zijlstra',title:'NFR AI Lead',tags:['Strategy','GenAI','Risk'],mail:'thomas.zijlstra@accenture.com',photo:'thomas'},
  {name:'Nils Smedegaard',title:'Risk Technology',tags:['Architecture','Data','GRC'],mail:'',photo:'nils'},
  {name:'Elisa Martín',title:'Regulatory AI',tags:['Compliance','LLM','EU AI Act'],mail:'',photo:'elisa'},
  {name:'James Whitfield',title:'Model Risk',tags:['MRM','Validation','ML'],mail:'',photo:'james'},
  {name:'Sara Hoffmann',title:'Financial Crime',tags:['AML','Sanctions','FinCrime'],mail:'',photo:'sara'},
  {name:'Lukas De Vries',title:'Controls & GRC',tags:['Audit','Controls','SOX'],mail:'',photo:'lukas'},
  {name:'Amélie Fontaine',title:'Climate & ESG Risk',tags:['ESG','CSRD','Reporting'],mail:'',photo:'amelie'}
];
var PHOTO_BASE='https://tzijlstra-acn.github.io/NFRAIAssets/assets/';
