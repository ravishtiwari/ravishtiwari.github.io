(function () {
  'use strict';
  var scopes = ['global', 'project', 'task'];
  var bands = {
    global: { bounds: [0, 15, 25, 45], low: 'Too little global context means repeating standards and correcting inconsistent behaviour.', high: 'Too much global config over-enforces generic rules and crowds out local facts.' },
    project: { bounds: [5, 25, 35, 55], low: 'Too little project context makes the model rediscover architecture, domain terms, and local constraints.', high: 'Too much project context turns broad docs, history, and file inventories into noise.' },
    task: { bounds: [20, 45, 55, 80], low: 'Too little task context leaves intent, relevant evidence, and acceptance checks underspecified.', high: 'Too much task material lets raw logs, duplicate excerpts, and secondary detail bury the priority.' }
  };
  var currentMix = [22, 30, 48];
  var contexts = {
    developer: { name: 'Developer', mix: [22, 30, 48], global: ['model rules', 'safety defaults', 'edit discipline'], project: ['architecture', 'repo conventions', 'test commands'], task: ['requested change', 'relevant files', 'acceptance checks'], details: ['How the coding agent should behave everywhere', 'What is true only inside this codebase', 'The change to make right now'], insight: '<strong>One task, three scopes.</strong> Stable working rules arrive globally, repository facts stay with the project, and only the immediate change occupies task context.' },
    designer: { name: 'Designer', mix: [26, 28, 46], global: ['type scale', 'a11y defaults', 'component naming'], project: ['brand palette', 'design system', 'target platform'], task: ['screen goal', 'user journey', 'current feedback'], details: ['The design principles shared by every brief', 'The visual language unique to this product', 'The interface problem being solved now'], insight: '<strong>Consistency without repetition.</strong> Global design standards travel between briefs while brand and screen-specific decisions remain correctly scoped.' },
    writer: { name: 'Writer', mix: [24, 26, 50], global: ['tone of voice', 'citation style', 'language rules'], project: ['audience', 'editorial brief', 'source library'], task: ['piece objective', 'outline', 'draft material'], details: ['The voice and standards shared by every piece', 'The publication and audience constraints', 'The story that needs to be written now'], insight: '<strong>The voice stays; the story changes.</strong> Reusable editorial preferences no longer compete with sources and the actual writing task.' },
    analyst: { name: 'Analyst', mix: [18, 34, 48], global: ['evidence bar', 'output format', 'risk language'], project: ['domain model', 'dataset notes', 'decision history'], task: ['question', 'fresh evidence', 'required decision'], details: ['The reasoning standards applied to every analysis', 'The domain knowledge that makes evidence legible', 'The decision this analysis must support'], insight: '<strong>Evidence lands in the right frame.</strong> The model combines consistent reasoning rules with domain history before focusing on the decision at hand.' }
  };

  function chips(target, values) {
    target.replaceChildren.apply(target, values.map(function (value) { var chip = document.createElement('span'); chip.className = 'layer-chip'; chip.textContent = value; return chip; }));
  }
  function layerScore(scope, value) {
    var bound = bands[scope].bounds;
    if (value >= bound[1] && value <= bound[2]) return 100;
    if (value < bound[1]) return Math.max(0, 100 * (value - bound[0]) / (bound[1] - bound[0]));
    return Math.max(0, 100 * (bound[3] - value) / (bound[3] - bound[2]));
  }
  function metrics(mix) {
    var scores = scopes.map(function (scope, index) { return layerScore(scope, mix[index]); });
    var weighted = scores[0] * .25 + scores[1] * .30 + scores[2] * .45;
    return {
      scores: scores,
      attention: Math.min(96, Math.round(.5 * weighted + .5 * Math.min.apply(null, scores))),
      repetition: Math.min(99, Math.round(4 + (100 - scores[0]) * .55 + (100 - scores[1]) * .35)),
      noise: Math.min(99, Math.round(8 + Math.max(0, mix[0] - 25) * 1.2 + Math.max(0, mix[1] - 35) * 1.2 + Math.max(0, mix[2] - 55)))
    };
  }
  function attentionMeta(value) {
    if (value >= 85) return { label: 'Focused', cls: 'focused', caption: 'Every layer is inside, or close to, its useful bracket.' };
    if (value >= 70) return { label: 'Workable', cls: 'workable', caption: 'The model can work, but one context layer is costing attention.' };
    if (value >= 50) return { label: 'Fragile', cls: 'fragile', caption: 'Important context is missing or competing with avoidable material.' };
    return { label: 'Mis-scoped', cls: 'mis-scoped', caption: 'The context mix is likely to produce repetition, guessing, or noise.' };
  }
  function scopeState(scope, value) {
    var bound = bands[scope].bounds;
    if (value < bound[1]) return { key: 'low', label: 'Too low', message: bands[scope].low };
    if (value > bound[2]) return { key: 'high', label: 'Too high', message: bands[scope].high };
    return { key: 'sweet', label: 'In range', message: '' };
  }
  function renderBars(mix) {
    var rows = [['Global defaults', 'global', mix[0]], ['Project knowledge', 'project', mix[1]], ['Actual task', 'task', mix[2]]];
    document.getElementById('bars').innerHTML = rows.map(function (row) { return '<div class="bar-row"><span class="bar-label">' + row[0] + '</span><div class="bar-track"><div class="bar-fill meter-' + row[1] + '" style="width:' + row[2] + '%"></div></div><span class="bar-pct">' + row[2] + '%</span></div>'; }).join('');
  }
  function renderMix(mix) {
    currentMix = mix.slice();
    var result = metrics(mix);
    var meta = attentionMeta(result.attention);
    scopes.forEach(function (scope, index) {
      var value = mix[index];
      var state = scopeState(scope, value);
      document.getElementById(scope + '-pct').textContent = value + '%';
      document.getElementById('meter-' + scope).style.width = value + '%';
      document.getElementById('sl-' + scope).value = value;
      document.getElementById('lbl-' + scope).textContent = value + '%';
      var stateElement = document.getElementById('state-' + scope);
      stateElement.textContent = state.label;
      stateElement.className = 'ctrl-state ' + state.key;
    });
    [['attention', result.attention, meta.cls], ['repetition', result.repetition, result.repetition > 45 ? 'bad' : result.repetition > 20 ? 'med' : 'good'], ['noise', result.noise, result.noise > 45 ? 'bad' : result.noise > 20 ? 'med' : 'good']].forEach(function (item) { var element = document.getElementById('s-' + item[0]); element.textContent = item[1] + '%'; element.className = 'stat-val ' + item[2]; });
    var score = document.getElementById('score-number');
    score.textContent = result.attention + '%'; score.className = 'score-number ' + meta.cls;
    document.getElementById('score-label').textContent = meta.label;
    document.getElementById('score-caption').textContent = meta.caption;
    document.querySelector('.result-badge').textContent = result.attention + '% effective attention';
    var weakest = result.scores.indexOf(Math.min.apply(null, result.scores));
    var scope = scopes[weakest];
    var state = scopeState(scope, mix[weakest]);
    document.getElementById('tune-recommendation').innerHTML = state.key === 'sweet' ? '<strong>Sweet spot.</strong> Durable standards, relevant project knowledge, and immediate task evidence are balanced. Keep each item current and relevant.' : '<strong>' + scope.charAt(0).toUpperCase() + scope.slice(1) + ' context is the bottleneck.</strong> ' + state.message;
    renderBars(mix);
  }
  function rebalance(changed, value) {
    var next = currentMix.slice();
    var others = [0, 1, 2].filter(function (index) { return index !== changed; });
    var remaining = 100 - value;
    var previous = currentMix[others[0]] + currentMix[others[1]];
    var first = previous ? Math.round(remaining * currentMix[others[0]] / previous) : Math.round(remaining / 2);
    next[changed] = value; next[others[0]] = first; next[others[1]] = remaining - first;
    return next;
  }
  function applyContext(id) {
    var context = contexts[id];
    var canvas = document.getElementById('flow-canvas');
    canvas.classList.remove('playing');
    void canvas.offsetWidth;
    scopes.forEach(function (scope, index) { document.getElementById(scope + '-detail').textContent = context.details[index]; chips(document.getElementById(scope + '-chips'), context[scope]); });
    document.getElementById('result-title').textContent = context.name + ' context';
    document.getElementById('insight').innerHTML = context.insight;
    renderMix(context.mix);
    requestAnimationFrame(function () { canvas.classList.add('playing'); });
  }

  document.getElementById('scenarios').addEventListener('click', function (event) {
    var button = event.target.closest('.sc-btn');
    if (!button) return;
    document.querySelectorAll('.sc-btn').forEach(function (candidate) { var active = candidate === button; candidate.classList.toggle('active', active); candidate.setAttribute('aria-pressed', String(active)); });
    applyContext(button.dataset.id);
  });
  scopes.forEach(function (scope, index) {
    document.getElementById('sl-' + scope).addEventListener('input', function () { renderMix(rebalance(index, Number(this.value))); });
    document.getElementById('sl-' + scope).addEventListener('change', function () { var result = metrics(currentMix); document.getElementById('live-summary').textContent = attentionMeta(result.attention).label + ': ' + result.attention + '% effective attention. ' + document.getElementById('tune-recommendation').textContent; });
  });
  var referencesToggle = document.getElementById('references-toggle');
  var referencesPanel = document.getElementById('references-panel');
  function setReferencesOpen(open) {
    referencesToggle.setAttribute('aria-expanded', String(open));
    referencesPanel.setAttribute('aria-hidden', String(!open));
    referencesPanel.classList.toggle('open', open);
    if (open) referencesPanel.removeAttribute('inert');
    else referencesPanel.setAttribute('inert', '');
  }
  referencesToggle.addEventListener('click', function () { setReferencesOpen(referencesToggle.getAttribute('aria-expanded') !== 'true'); });
  referencesPanel.addEventListener('keydown', function (event) { if (event.key === 'Escape') { setReferencesOpen(false); referencesToggle.focus(); } });
  document.getElementById('sweet-btn').addEventListener('click', function () { renderMix([20, 30, 50]); });
  applyContext('developer');
}());
