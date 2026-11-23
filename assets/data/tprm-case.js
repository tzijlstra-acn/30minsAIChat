// -- TPRM CASE -- shared synthetic case for the core route --
// One immutable object. Every core scene that shows the case reads it from here;
// no scene restates case facts in its own code. The case is synthetic, not client data.
// Exposes: window.TPRM_CASE (browser) and module.exports (Node, for tests).

(function(global) {
  'use strict';

  function deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).forEach(function(key) {
      var value = obj[key];
      if (value && typeof value === 'object') deepFreeze(value);
    });
    return Object.freeze(obj);
  }

  var TPRM_CASE = deepFreeze({
    id: 'TPRM-PR-042',
    label: 'Synthetic example',
    provider: 'Cloud hosting provider',
    providerShort: 'Cloud provider',
    criticality: 'Critical',
    reviewType: 'Periodic review',
    due: 'Today',
    question: 'Renew the cloud hosting provider with a 30-day condition?',

    // Material changes since the last review, each tied to its evidence object
    changes: [
      { id: 'sub-processor', type: 'Sub-processor', title: 'Sub-processor added', detail: 'Added in Ireland', tag: 'Ireland', evidence: 'Contract annex', evidenceState: 'Approved', previous: 'Two sub-processors', current: 'Third added in Ireland' },
      { id: 'assurance', type: 'Assurance', title: 'SOC 2 renewed', detail: 'SOC 2 renewed with two exceptions', tag: 'Two exceptions', evidence: 'SOC 2 Type II', evidenceState: 'Verified', previous: 'SOC 2, no exceptions', current: 'Renewed, two exceptions' },
      { id: 'incident', type: 'Incident', title: 'Priority 2 incident', detail: 'Priority 2 incident in September', tag: 'September', evidence: 'Incident log', evidenceState: 'Verified', previous: 'No priority incidents', current: 'Priority 2 in September' }
    ],

    // Evidence that is still missing. Uncertainty stays visible; it is never hidden.
    missing: [
      { id: 'pen-test', type: 'Penetration test', title: 'Penetration-test report', detail: 'Report pending', requirement: 'Required before close' }
    ],

    // Review history and open items (used by the Workspace case summary)
    previousConclusion: 'Renewed without conditions',
    lastReview: '12 months ago',
    openIssues: [
      { id: 'ISS-2207', title: 'Change-management finding', state: 'Open, due in 45 days' }
    ],

    proposedAction: 'Approve renewal with a 30-day condition',
    followUp: 'Create 30-day follow-up task',
    writeBoundary: 'Create follow-up task after approval',
    // What the professional tests before deciding: the proposal, not the paperwork
    challenge: 'Is 30 days enough to close the missing report?',

    // Control boundary for this case
    roles: { preparer: 'Operating layer', decider: 'TPRM officer', approver: 'Named approver', target: 'GRC system' },
    boundary: [
      'Evidence may be retrieved and compared automatically',
      'Uncertainty remains visible',
      'A professional makes the material decision',
      'A system write happens only after the exact action is approved',
      'Completion is shown only after the target system acknowledges the action'
    ],

    // The other work in the officer's queue: prepared in the background, not selected
    queue: [
      { id: 'TPRM-PR-042', title: 'Cloud provider review', meta: 'Critical, due today', state: 'Next' },
      { id: 'TPRM-KRI-017', title: 'KRI breach', meta: 'Explanation ready for review', state: 'Prepared' },
      { id: 'TPRM-CR-108', title: 'Contract renewal', meta: 'Watching for change', state: 'Watching' }
    ],

    // The visible case state progresses through the route in this order
    states: [
      { id: 'scattered',  label: 'Scattered evidence' },
      { id: 'incomplete', label: 'Incomplete review' },
      { id: 'prepared',   label: 'Prepared, gap named' },
      { id: 'decision',   label: 'Human decision' },
      { id: 'approved',   label: 'Approved action' },
      { id: 'receipt',    label: 'Acknowledged receipt' },
      { id: 'measured',   label: 'Measured outcome' }
    ],

    synthetic: true
  });

  global.TPRM_CASE = TPRM_CASE;
  if (typeof module !== 'undefined' && module.exports) module.exports = TPRM_CASE;
}(typeof window !== 'undefined' ? window : globalThis));
