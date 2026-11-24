// -- LIVE CAPTURES -- the captured fallback for the live demonstration --
// Screenshots of the real NFR Workspace product on its deterministic, synthetic demo day
// (Arcadia Bank AG, records as of 06.10.2026, 07:45), taken by the product's rehearsal
// script (nfr-workos: scripts/demo/rehearse.mjs, exports/demo-fallback-v6) at 1920x1080
// and copied here. Same records, labels and screens as the live product; nothing is
// redrawn. Acts follow the product's presenter guide.
// Exposes window.NFR_LIVE_CAPTURES.

(function(global) {
  'use strict';
  var DIR = 'assets/img/product/';
  global.NFR_LIVE_CAPTURES = Object.freeze({
    source: 'Captured from NFR Workspace on its synthetic demo day: Arcadia Bank AG, records as of 06.10.2026, 07:45.',
    acts: [
      { title: 'The Workspace feels real', takeaway: 'The user does not start with a blank chatbot. The Workspace starts with the work and the decisions relevant to the role.',
        shots: [
          { file: DIR + 'act1-sign-in.png', caption: 'The start-up ends on the sign-in. Synthetic institution and data.' },
          { file: DIR + 'act1-preparing.png', caption: 'Sign-in resolves the role, its authority and the decisions that need a person.' }
        ] },
      { title: 'The next decision arrives prepared', takeaway: 'The case, the evidence and the required action are brought together before the user starts searching.',
        shots: [
          { file: DIR + 'act2-today.png', caption: 'Today for the Third-Party Risk Manager: one item needs you now, at most three next.' },
          { file: DIR + 'act2-done-today.png', caption: 'Done today: what ran without the person.' }
        ] },
      { title: 'A live question, a visual answer', takeaway: 'Not prose: a governed analysis built from connected records, in the right visual form, with its evidence.',
        shots: [
          { file: DIR + 'act3-answer.png', caption: '3 critical third parties are deteriorating, led by Novalink (up 23 points); 2 of them share Basalt Cloud.' },
          { file: DIR + 'act3-findings.png', caption: 'What the records show: each finding with its sources.' },
          { file: DIR + 'act3-evidence.png', caption: 'Evidence with its freshness; a stale recovery test is marked.' },
          { file: DIR + 'act3-concentration.png', caption: 'Concentration: one underlying provider under several critical suppliers.' }
        ] },
      { title: 'From insight to action', takeaway: 'The professional approves; the system records. Nothing is written before the review.',
        shots: [
          { file: DIR + 'act4-review.png', caption: 'The review: system of record, every field before and after, the evidence, the authority, and the professional\'s confirmation.' },
          { file: DIR + 'act4-receipt.png', caption: 'The receipt: the transaction, the new record, the approval bound to this change, who and when.' },
          { file: DIR + 'act4-audit-log.png', caption: 'The audit log holds the transaction.' }
        ] },
      { title: 'The long tail, governed', takeaway: 'Standard processes cover repeatable work. Agents cover ad hoc questions without bypassing permissions or controls.',
        shots: [
          { file: DIR + 'act5-agent-builder.png', caption: 'Save as agent: outcome, scope and permissions, plan, run and save. It inherits your access.' },
          { file: DIR + 'act5-my-agents.png', caption: 'The agent under My agents, with its weekly schedule and run history.' }
        ] }
    ]
  });
  // Load every capture once the deck has loaded, so the fallback also works offline
  if (global.addEventListener) global.addEventListener('load', function() {
    global.NFR_LIVE_CAPTURES.acts.forEach(function(a) { a.shots.forEach(function(s) { var im = new Image(); im.src = s.file; }); });
  });
}(typeof window !== 'undefined' ? window : globalThis));
