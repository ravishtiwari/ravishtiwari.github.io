(function () {
  'use strict';

  var scenarios = {
    bloated: { signal: 12, noise: 60, overhead: 28, insight: 'Most of the context window is wasted. The model attends to old file dumps, repeated instructions, and irrelevant history. The actual task — what you need answered — is a thin sliver drowning in everything else.' },
    medium: { signal: 32, noise: 35, overhead: 20, insight: 'Better, but overhead is still high. You’re re-typing the same preferences every session and the model is still wading through context it doesn’t need. Useful work is happening, just not efficiently.' },
    lean: { signal: 66, noise: 16, overhead: 18, insight: 'Exploration is targeted, output is summarised rather than dumped, and only relevant files are open. Signal ratio is high — the model attends mostly to what matters. But you’re still re-explaining your preferences every session.' },
    global: { signal: 68, noise: 18, overhead: 4, insight: 'Global config absorbs the overhead. Preferences, constraints, and defaults arrive pre-loaded — you never type them again. The context window is almost entirely task signal. This is the ceiling.' }
  };
  var blocks = [
    { cls: 'noise', label: 'Old conversation history', baseH: 28 },
    { cls: 'overhead', label: 'Re-explaining preferences', baseH: 20 },
    { cls: 'noise', label: 'Unneeded file dumps', baseH: 24 },
    { cls: 'overhead', label: 'Repeated constraints', baseH: 16 },
    { cls: 'signal', label: 'Actual task context', baseH: 14 },
    { cls: 'noise', label: 'Raw shell output / logs', baseH: 18 }
  ];

  function buildBlocks(signal, noise, overhead) {
    var total = signal + noise + overhead || 1;
    var fractions = { signal: signal / total, noise: noise / total, overhead: overhead / total };
    var raw = blocks.map(function (block) { return block.baseH * fractions[block.cls]; });
    var rawSum = raw.reduce(function (sum, value) { return sum + value; }, 0) || 1;
    var weightedHeight = 180 - 20 * blocks.length;
    var fragment = document.createDocumentFragment();
    blocks.forEach(function (block, index) {
      var element = document.createElement('div');
      element.className = 'ctx-block ' + block.cls;
      element.style.height = 20 + Math.round(raw[index] / rawSum * weightedHeight) + 'px';
      element.setAttribute('data-label', block.label);
      fragment.appendChild(element);
    });
    document.getElementById('ctx-blocks').replaceChildren(fragment);
  }

  function attentionMeta(signal) {
    if (signal < 15) return { text: 'Low', cls: 'bad' };
    if (signal < 35) return { text: 'Moderate', cls: 'med' };
    if (signal < 55) return { text: 'High', cls: 'good' };
    return { text: 'Very high', cls: 'good' };
  }

  function render(signal, noise, overhead) {
    var total = signal + noise + overhead || 1;
    var values = {
      signal: Math.round(signal / total * 100),
      noise: Math.round(noise / total * 100),
      overhead: Math.round(overhead / total * 100)
    };
    var tax = values.noise + values.overhead;
    document.getElementById('s-signal').textContent = values.signal + '%';
    var taxElement = document.getElementById('s-tax');
    taxElement.textContent = tax + '%';
    taxElement.className = 'stat-val ' + (tax > 70 ? 'bad' : tax > 40 ? 'med' : 'good');
    var attention = attentionMeta(values.signal);
    var attentionElement = document.getElementById('s-attn');
    attentionElement.textContent = attention.text;
    attentionElement.className = 'stat-val ' + attention.cls;
    var rows = [['Task signal', 'signal'], ['Noise / bloat', 'noise'], ['Re-explaining prefs', 'overhead']];
    document.getElementById('bars').innerHTML = rows.map(function (row) {
      return '<div class="bar-row"><span class="bar-label">' + row[0] + '</span><div class="bar-track"><div class="bar-fill ' + row[1] + '" style="width:' + values[row[1]] + '%"></div></div><span class="bar-pct">' + values[row[1]] + '%</span></div>';
    }).join('');
    buildBlocks(signal, noise, overhead);
  }

  function applyScenario(id) {
    var scenario = scenarios[id];
    ['signal', 'noise', 'overhead'].forEach(function (key) {
      document.getElementById('sl-' + key).value = scenario[key];
      document.getElementById('lbl-' + key).textContent = scenario[key] + '%';
    });
    document.getElementById('insight').textContent = scenario.insight;
    render(scenario.signal, scenario.noise, scenario.overhead);
  }

  document.getElementById('scenarios').addEventListener('click', function (event) {
    var button = event.target.closest('.sc-btn');
    if (!button) return;
    document.querySelectorAll('.sc-btn').forEach(function (candidate) {
      var active = candidate === button;
      candidate.classList.toggle('active', active);
      candidate.setAttribute('aria-pressed', String(active));
    });
    applyScenario(button.dataset.id);
  });

  ['signal', 'noise', 'overhead'].forEach(function (key) {
    document.getElementById('sl-' + key).addEventListener('input', function () {
      document.querySelectorAll('.sc-btn').forEach(function (button) { button.classList.remove('active'); button.setAttribute('aria-pressed', 'false'); });
      document.getElementById('lbl-' + key).textContent = this.value + '%';
      document.getElementById('insight').textContent = 'Custom mix. Watch how the signal ratio shifts as you trade noise and overhead for task-relevant context.';
      render(Number(document.getElementById('sl-signal').value), Number(document.getElementById('sl-noise').value), Number(document.getElementById('sl-overhead').value));
    });
  });

  applyScenario('bloated');
}());
