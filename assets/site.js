(function () {
  'use strict';

  var config = window.PORTFOLIO_CONFIG || {};
  var nav = document.getElementById('nav');
  var pdfDoc = null;
  var pdfPage = 1;
  var pdfTotal = 0;

  var themes = {
    'dark-plus': {'--md-sys-surface':'#1E1E1E','--md-sys-surface-container-lowest':'#141414','--md-sys-surface-container':'#252526','--md-sys-surface-container-high':'#2D2D30','--md-sys-surface-container-highest':'#3C3C3C','--md-sys-primary':'#569CD6','--md-sys-on-primary':'#FFFFFF','--md-sys-primary-container':'#1A3A5C','--md-sys-on-primary-container':'#BCE3FF','--md-sys-secondary':'#4EC9B0','--md-sys-on-secondary':'#00352C','--md-sys-secondary-container':'#0D3A34','--md-sys-on-secondary-container':'#B0EDE3','--md-sys-tertiary':'#CE9178','--md-sys-on-tertiary':'#3E1A07','--md-sys-tertiary-container':'#4A2518','--md-sys-on-tertiary-container':'#FFDDD1','--md-sys-on-surface':'#D4D4D4','--md-sys-on-surface-variant':'#9B9B9B','--md-sys-outline':'#4E4E4E','--md-sys-outline-variant':'#2A2A2A','--nav-bg':'rgba(30,30,30,.92)'},
    'monokai': {'--md-sys-surface':'#272822','--md-sys-surface-container-lowest':'#1A1A15','--md-sys-surface-container':'#3E3D32','--md-sys-surface-container-high':'#49483E','--md-sys-surface-container-highest':'#565446','--md-sys-primary':'#F92672','--md-sys-on-primary':'#FFFFFF','--md-sys-primary-container':'#5C0A2C','--md-sys-on-primary-container':'#FFBBD6','--md-sys-secondary':'#A6E22E','--md-sys-on-secondary':'#1A3000','--md-sys-secondary-container':'#3A500E','--md-sys-on-secondary-container':'#D8F8A0','--md-sys-tertiary':'#FD971F','--md-sys-on-tertiary':'#3D1C00','--md-sys-tertiary-container':'#5C3400','--md-sys-on-tertiary-container':'#FFDDB8','--md-sys-on-surface':'#F8F8F2','--md-sys-on-surface-variant':'#CFCFC2','--md-sys-outline':'#75715E','--md-sys-outline-variant':'#3E3D32','--nav-bg':'rgba(39,40,34,.92)'},
    'solarized-dark': {'--md-sys-surface':'#002B36','--md-sys-surface-container-lowest':'#001A22','--md-sys-surface-container':'#073642','--md-sys-surface-container-high':'#0D4453','--md-sys-surface-container-highest':'#135260','--md-sys-primary':'#268BD2','--md-sys-on-primary':'#FFFFFF','--md-sys-primary-container':'#0A2D44','--md-sys-on-primary-container':'#A8D8FF','--md-sys-secondary':'#2AA198','--md-sys-on-secondary':'#003730','--md-sys-secondary-container':'#0A3330','--md-sys-on-secondary-container':'#9AEAE4','--md-sys-tertiary':'#B58900','--md-sys-on-tertiary':'#3D2C00','--md-sys-tertiary-container':'#3D2C00','--md-sys-on-tertiary-container':'#FFE09A','--md-sys-on-surface':'#EEE8D5','--md-sys-on-surface-variant':'#93A1A1','--md-sys-outline':'#586E75','--md-sys-outline-variant':'#073642','--nav-bg':'rgba(0,43,54,.92)'},
    'nord': {'--md-sys-surface':'#2E3440','--md-sys-surface-container-lowest':'#242831','--md-sys-surface-container':'#3B4252','--md-sys-surface-container-high':'#434C5E','--md-sys-surface-container-highest':'#4C566A','--md-sys-primary':'#88C0D0','--md-sys-on-primary':'#1C2838','--md-sys-primary-container':'#28404C','--md-sys-on-primary-container':'#C8E8F0','--md-sys-secondary':'#81A1C1','--md-sys-on-secondary':'#1C3048','--md-sys-secondary-container':'#243548','--md-sys-on-secondary-container':'#C5D8EF','--md-sys-tertiary':'#EBCB8B','--md-sys-on-tertiary':'#3D3014','--md-sys-tertiary-container':'#4C3C14','--md-sys-on-tertiary-container':'#FFF0C8','--md-sys-on-surface':'#ECEFF4','--md-sys-on-surface-variant':'#D8DEE9','--md-sys-outline':'#4C566A','--md-sys-outline-variant':'#3B4252','--nav-bg':'rgba(46,52,64,.92)'},
    'dark-ubuntu': {'--md-sys-surface':'#120A1E','--md-sys-surface-container-lowest':'#0C0614','--md-sys-surface-container':'#1E1030','--md-sys-surface-container-high':'#2A1640','--md-sys-surface-container-highest':'#341C50','--md-sys-primary':'#E95420','--md-sys-on-primary':'#FFFFFF','--md-sys-primary-container':'#5C1A00','--md-sys-on-primary-container':'#FFBBA0','--md-sys-secondary':'#7AACFF','--md-sys-on-secondary':'#002F6C','--md-sys-secondary-container':'#0D2145','--md-sys-on-secondary-container':'#D0E4FF','--md-sys-tertiary':'#F8C200','--md-sys-on-tertiary':'#3D2F00','--md-sys-tertiary-container':'#5C4700','--md-sys-on-tertiary-container':'#FFE17A','--md-sys-on-surface':'#EDE8F5','--md-sys-on-surface-variant':'#BDB5CC','--md-sys-outline':'#5A4870','--md-sys-outline-variant':'#2E1E45','--nav-bg':'rgba(18,10,30,.9)'}
  };
  var allVars = Object.keys(themes['dark-plus']);

  document.getElementById('yr').textContent = new Date().getFullYear();
  window.addEventListener('scroll', function () { nav.classList.toggle('scrolled', window.scrollY > 8); }, { passive: true });

  window.applyTheme = function (key) {
    var root = document.documentElement;
    allVars.forEach(function (name) { root.style.removeProperty(name); });
    var overrides = themes[key];
    if (overrides) Object.keys(overrides).forEach(function (name) { root.style.setProperty(name, overrides[name]); });
    try { localStorage.setItem('portfolio-theme', key); } catch (error) {}
    document.getElementById('theme-sel').value = key;
  };
  try { window.applyTheme(localStorage.getItem('portfolio-theme') || config.defaultTheme || 'github-light'); } catch (error) { window.applyTheme(config.defaultTheme || 'github-light'); }
  window.scrollToTop = function (event) { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); } }); }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    revealEls.forEach(function (element) { observer.observe(element); });
  } else revealEls.forEach(function (element) { element.classList.add('in'); });

  if (window.pdfjsLib) window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  function updatePdfUi() { document.getElementById('pdf-pages').textContent = pdfTotal ? pdfPage + ' / ' + pdfTotal : '— / —'; document.getElementById('pdf-prev').disabled = pdfPage <= 1; document.getElementById('pdf-next').disabled = pdfPage >= pdfTotal || !pdfTotal; }
  function renderPdfPage(pageNumber) { pdfDoc.getPage(pageNumber).then(function (page) { var canvas = document.getElementById('pdf-canvas'); var area = canvas.parentElement; var nativeViewport = page.getViewport({ scale: 1 }); var viewport = page.getViewport({ scale: Math.min((area.clientWidth - 48) / nativeViewport.width, 2.4) }); canvas.width = viewport.width; canvas.height = viewport.height; canvas.style.display = 'block'; page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport }); }); }
  window.openResume = function () { var modal = document.getElementById('pdf-modal'); modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; document.getElementById('pdf-loading').style.display = 'block'; document.getElementById('pdf-error').style.display = 'none'; document.getElementById('pdf-canvas').style.display = 'none'; if (!window.pdfjsLib) { document.getElementById('pdf-error').style.display = 'block'; return; } window.pdfjsLib.getDocument(config.resumePath).promise.then(function (pdf) { pdfDoc = pdf; pdfPage = 1; pdfTotal = pdf.numPages; updatePdfUi(); document.getElementById('pdf-loading').style.display = 'none'; renderPdfPage(1); }).catch(function () { document.getElementById('pdf-loading').style.display = 'none'; document.getElementById('pdf-error').style.display = 'block'; }); };
  window.closeResume = function () { document.getElementById('pdf-modal').style.display = 'none'; document.body.style.overflow = ''; pdfDoc = null; };
  window.prevPage = function () { if (pdfPage > 1) { pdfPage--; updatePdfUi(); renderPdfPage(pdfPage); } };
  window.nextPage = function () { if (pdfPage < pdfTotal) { pdfPage++; updatePdfUi(); renderPdfPage(pdfPage); } };
  window.handlePdfOverlayClick = function (event) { if (event.target.id === 'pdf-modal') window.closeResume(); };

  window.openContact = function () { document.getElementById('contact-modal').style.display = 'flex'; document.body.style.overflow = 'hidden'; document.getElementById('contact-success').style.display = 'none'; document.getElementById('contact-form').style.display = 'flex'; document.getElementById('contact-form').reset(); document.getElementById('cname').focus(); };
  window.closeContact = function () { document.getElementById('contact-modal').style.display = 'none'; document.body.style.overflow = ''; };
  window.handleContactOverlayClick = function (event) { if (event.target.id === 'contact-modal') window.closeContact(); };
  window.submitContact = function (event) { event.preventDefault(); var form = event.target; var button = document.getElementById('contact-submit'); var error = document.getElementById('contact-error'); var endpoint = config.contact && config.contact.endpoint; error.style.display = 'none'; if (!endpoint) { error.textContent = 'Contact delivery is not configured yet.'; error.style.display = 'block'; return; } button.disabled = true; button.textContent = 'Sending…'; var data = new FormData(form); fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.get('cname'), email: data.get('cemail'), message: data.get('cmessage'), metadata: { origin: location.origin, referrer: document.referrer, userAgent: navigator.userAgent, pageUrl: location.href, submittedAt: new Date().toISOString() } }) }).then(function (response) { if (!response.ok) throw new Error('Request failed'); document.getElementById('contact-form').style.display = 'none'; document.getElementById('contact-success').style.display = 'block'; }).catch(function () { error.textContent = 'Something went wrong — please try again.'; error.style.display = 'block'; }).finally(function () { button.disabled = false; button.textContent = 'Send message ↗'; }); };
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') { window.closeResume(); window.closeContact(); } });
}());
