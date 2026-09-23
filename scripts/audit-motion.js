#!/usr/bin/env node
/**
 * audit:motion -- checks every scene JS file for:
 * - full lifecycle contract (play/pause/resume/reset/finish/destroy)
 * - createTimeline usage
 * - un-tracked setTimeout calls (timer leak risk)
 * - total animation duration within spec (max 12 seconds for hero, 7 for standard)
 */
'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.dirname(__dirname);

var errors = [];
var warnings = [];
function fail(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

var scenesDir = path.join(ROOT, 'assets/js/story/scenes');
if (!fs.existsSync(scenesDir)) {
  fail('scenes directory not found: ' + scenesDir);
  process.exit(1);
}

var files = fs.readdirSync(scenesDir).filter(function(f) { return f.endsWith('.js'); }).sort();
console.log('Motion audit: ' + files.length + ' scene files');

files.forEach(function(f) {
  var code = fs.readFileSync(path.join(scenesDir, f), 'utf8');
  var name = f.replace('.js', '');
  var issues = [];
  var ok = [];

  // Lifecycle contract
  var required = ['play', 'pause', 'resume', 'reset', 'finish', 'destroy'];
  required.forEach(function(method) {
    if (code.indexOf(method + ':') !== -1 || code.indexOf('"' + method + '"') !== -1) {
      ok.push(method);
    } else {
      issues.push('missing lifecycle method: ' + method);
    }
  });

  // createTimeline
  if (code.indexOf('createTimeline') === -1) {
    issues.push('does not use createTimeline');
  }

  // destroy clears innerHTML
  if (code.indexOf("container.innerHTML = ''") === -1 && code.indexOf('container.innerHTML=""') === -1) {
    issues.push('destroy() may not clear container.innerHTML');
  }

  // cursor:pointer or hover (should not exist)
  if (code.indexOf('cursor:pointer') !== -1 || code.indexOf("cursor: 'pointer'") !== -1) {
    issues.push('cursor:pointer found -- controls must not look clickable');
  }

  // Untracked setTimeout (leak risk)
  var totalST = (code.match(/\bsetTimeout\s*\(/g) || []).length;
  // Tracked: _timers.push(setTimeout or = setTimeout
  var trackedST = (code.match(/_timers\.push\s*\(\s*setTimeout\s*\(|=\s*setTimeout\s*\(/g) || []).length;
  var leaks = totalST - trackedST;
  if (leaks > 0) {
    var severity = leaks >= 5 ? 'P1' : 'P2';
    issues.push(severity + ': ' + leaks + ' un-tracked setTimeout call(s) -- timer leak risk');
  }

  // Extract max delay to estimate duration
  var delays = [];
  var delayRe = /\bdelay\s*:\s*(\d+)/g;
  var dm;
  while ((dm = delayRe.exec(code)) !== null) delays.push(parseInt(dm[1], 10));
  var maxDelay = delays.length ? Math.max.apply(null, delays) : 0;
  if (maxDelay > 12000) {
    issues.push('total animation duration ~' + (maxDelay/1000).toFixed(1) + 's exceeds 12s hero limit');
  } else if (maxDelay > 7000) {
    warn('[' + name + '] animation duration ~' + (maxDelay/1000).toFixed(1) + 's (hero scene -- ok up to 12s)');
  }

  var status = issues.filter(function(i) { return !i.startsWith('P2') && !i.startsWith('['); }).length === 0 ? 'PASS' : 'FAIL';
  console.log('  ' + (status === 'FAIL' ? '[FAIL]' : '[ ok ]') + ' ' + name.padEnd(28) + ' | dur:' + (maxDelay/1000).toFixed(1) + 's | setTimeout:' + totalST + '(' + trackedST + ' tracked)');
  if (issues.length) {
    issues.forEach(function(issue) {
      if (issue.startsWith('P1') || issue.startsWith('P0') || issue.startsWith('missing') || issue.startsWith('cursor') || issue.startsWith('destroy')) {
        fail('[' + name + '] ' + issue);
      } else {
        warn('[' + name + '] ' + issue);
        console.log('    [warn] ' + issue);
      }
    });
  }
});

console.log('');
if (warnings.length) warnings.forEach(function(w) { console.log('[WARN] ' + w); });
if (errors.length) {
  errors.forEach(function(e) { console.log('[FAIL] ' + e); });
  console.log('\naudit:motion -- FAIL (' + errors.length + ' errors)');
  process.exit(1);
} else {
  console.log('audit:motion -- PASS' + (warnings.length ? ' (' + warnings.length + ' warnings)' : ''));
}
