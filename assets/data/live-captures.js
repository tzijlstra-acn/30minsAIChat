// -- LIVE CAPTURES -- the captured fallback for the live demonstration --
// Screenshots of the real NFR Workspace product on its deterministic, synthetic demo day,
// taken by the product's own capture script (nfr-workos, exports/demo-fallback-v6) and
// copied here. Same records, labels and screens as the live product; nothing is redrawn.
// Exposes window.NFR_LIVE_CAPTURES.

(function(global) {
  'use strict';
  var DIR = 'assets/img/product/';
  global.NFR_LIVE_CAPTURES = Object.freeze({
    source: 'Captured from NFR Workspace on its synthetic demo day.',
    acts: [
      { title: 'The role and the work', takeaway: 'The Workspace starts with the role and the next decision, not a blank chat box.',
        shots: [{ file: DIR + 'today.png', caption: 'Today for the Third-Party Risk Manager: what needs attention, prepared overnight.' }] },
      { title: 'Ask the records', takeaway: 'Not prose: a visual, evidence-backed decision product.',
        shots: [{ file: DIR + 'answer.png', caption: 'Which critical third-party services are deteriorating, and why?' }] },
      { title: 'Role app and evidence', takeaway: 'Assistance explains the case; the role application carries the task, evidence, controls and actions.',
        shots: [{ file: DIR + 'review.png', caption: 'The periodic review: evidence, prior period, material changes and gaps.' }] },
      { title: 'Decide and write back', takeaway: 'The professional retains authority; the Workspace makes the approved action operational.',
        shots: [{ file: DIR + 'preview.png', caption: 'The proposed action, previewed and checked before anything is written.' }] },
      { title: 'Recorded and reusable', takeaway: 'The work is not trapped in chat: it becomes an attributable record and a reusable capability.',
        shots: [{ file: DIR + 'receipt.png', caption: 'The audit receipt and the changed record.' }] }
    ]
  });
}(typeof window !== 'undefined' ? window : globalThis));
