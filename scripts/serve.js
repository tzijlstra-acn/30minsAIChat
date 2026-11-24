#!/usr/bin/env node
/**
 * serve -- minimal static file server for local preview and the Playwright suite.
 * Usage: node scripts/serve.js [port] [root]   (default 8080 and the repository root;
 *        root is a folder relative to the repository, such as dist or dist-internal)
 * Replaces python -m http.server for tests: under parallel workers on Windows the
 * Python server refuses connections, which made page-load tests flaky.
 */
'use strict';
var http = require('http');
var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(path.dirname(__dirname), process.argv[3] || '.');
var PORT = Number(process.argv[2] || process.env.PORT || 8080);
var TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2', '.md': 'text/plain; charset=utf-8'
};

http.createServer(function(req, res) {
  var urlPath;
  try { urlPath = decodeURIComponent(req.url.split('?')[0]); } catch (e) { urlPath = '/'; }
  var file = path.join(ROOT, urlPath);
  if (file.indexOf(ROOT) !== 0) { res.writeHead(403); res.end(); return; }
  fs.stat(file, function(err, st) {
    if (!err && st.isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, function(readErr, data) {
      if (readErr) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      res.end(data);
    });
  });
}).listen(PORT, '127.0.0.1', 511, function() {
  console.log('Serving ' + ROOT + ' on http://localhost:' + PORT);
});
