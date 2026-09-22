// Scene: proof-loop (Screen 07 - HOW TO PROVE)
// Circular evidence loop with 5 nodes entering sequentially
SceneDirector.register('proof-loop', function(container, manifest, reduced) {
  var nodes = [
    { label: 'Quality',    icon: 'ti-star',          color: 'var(--accent)'  },
    { label: 'Control',    icon: 'ti-shield-check',  color: 'var(--green)'   },
    { label: 'Adoption',   icon: 'ti-users',         color: 'var(--cyan)'    },
    { label: 'Speed',      icon: 'ti-clock',         color: 'var(--amber)'   },
    { label: 'Economics',  icon: 'ti-coin',          color: 'var(--pink)'    }
  ];

  function build() {
    container.innerHTML = '';
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = 'width:100%;height:100%;overflow:visible;';
    container.appendChild(svg);

    var w = container.offsetWidth || 400;
    var h = container.offsetHeight || 220;
    var cx = w / 2;
    var cy = h / 2;
    var r = Math.min(w, h) * 0.35;
    var nr = 28;

    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);

    // Draw ring
    var ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', cx);
    ring.setAttribute('cy', cy);
    ring.setAttribute('r', r);
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', 'var(--border-1)');
    ring.setAttribute('stroke-width', '1');
    ring.setAttribute('stroke-dasharray', '4 6');
    ring.style.opacity = '0';
    ring.style.transition = 'opacity 400ms ease';
    ring.id = 'plRing';
    svg.appendChild(ring);

    nodes.forEach(function(node, i) {
      var angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
      var x = cx + r * Math.cos(angle);
      var y = cy + r * Math.sin(angle);

      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.className.baseVal = 'proof-node';
      g.dataset = {};
      g.setAttribute('data-node-idx', i);
      g.style.cssText = 'opacity:0;transition:opacity 400ms ease';

      var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', nr);
      circle.setAttribute('fill', 'var(--surface-1)');
      circle.setAttribute('stroke', node.color);
      circle.setAttribute('stroke-width', '1.5');
      g.appendChild(circle);

      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y + 4);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-family', '"Space Grotesk", sans-serif');
      text.setAttribute('font-size', '14');
      text.setAttribute('font-weight', '600');
      text.setAttribute('fill', node.color);
      text.textContent = node.label;
      g.appendChild(text);

      svg.appendChild(g);
    });

    // Central label
    var cLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    cLabel.setAttribute('x', cx);
    cLabel.setAttribute('y', cy + 4);
    cLabel.setAttribute('text-anchor', 'middle');
    cLabel.setAttribute('font-family', '"JetBrains Mono", monospace');
    cLabel.setAttribute('font-size', '12');
    cLabel.setAttribute('letter-spacing', '0.06em');
    cLabel.setAttribute('fill', 'var(--text-3)');
    cLabel.style.cssText = 'opacity:0;transition:opacity 400ms ease';
    cLabel.id = 'plCenter';
    cLabel.textContent = 'PROOF';
    svg.appendChild(cLabel);
  }

  var steps = [
    { delay: 300, run: function() {
      var ring = container.querySelector('#plRing');
      if (ring) ring.style.opacity = '1';
    }}
  ].concat(nodes.map(function(_, i) {
    return { delay: 700 + i * 900, run: function() {
      var g = container.querySelector('[data-node-idx="' + i + '"]');
      if (g) g.style.opacity = '1';
    }};
  })).concat([
    { delay: 700 + nodes.length * 900, run: function() {
      var c = container.querySelector('#plCenter');
      if (c) c.style.opacity = '1';
    }}
  ]);

  var tl = createTimeline(steps);

  return {
    play: function() { build(); tl.play(); },
    pause: tl.pause,
    resume: tl.resume,
    reset: function() { build(); tl.reset(); },
    finish: function() {
      build();
      var ring = container.querySelector('#plRing');
      if (ring) ring.style.opacity = '1';
      var ctr = container.querySelector('#plCenter');
      if (ctr) ctr.style.opacity = '1';
      container.querySelectorAll('[data-node-idx]').forEach(function(g) { g.style.opacity = '1'; });
    },
    destroy: function() { container.innerHTML = ''; tl.destroy(); }
  };
});
