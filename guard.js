// WODTRAIN — quita los elementos que el hosting (Netlify) inyecta sobre la app
// (barra/botón flotante de Netlify Drawer, badges, etc.) para que no tapen la interfaz.
(function () {
  var RX = /netlify/i;
  var KEEP = { root: 1, 'wt-install': 1 };

  // 1) CSS: oculta los selectores conocidos aunque aparezcan antes de que corra el observer.
  var css =
    '[id*="netlify" i],[class*="netlify" i],netlify-drawer,netlify-toolbar,' +
    'iframe[src*="netlify" i],iframe[title*="netlify" i],a[href*="netlify.com" i][style*="fixed"]' +
    '{display:none!important;visibility:hidden!important;pointer-events:none!important;' +
    'width:0!important;height:0!important;opacity:0!important}';
  var st = document.createElement('style');
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  function bad(el) {
    if (!el || el.nodeType !== 1 || KEEP[el.id]) return false;
    var tag = el.tagName.toLowerCase();
    if (RX.test(tag)) return true;
    var sig = (el.id || '') + ' ' + (typeof el.className === 'string' ? el.className : '') + ' ' +
      (el.getAttribute('src') || '') + ' ' + (el.getAttribute('title') || '') + ' ' +
      (el.getAttribute('data-netlify') !== null ? 'netlify' : '');
    if (RX.test(sig)) return true;
    // Contenedor flotante que solo envuelve contenido de Netlify (p. ej. un iframe del drawer).
    if (tag !== 'script' && tag !== 'style' && el.querySelector) {
      var inner = el.querySelector('iframe[src*="netlify" i],[id*="netlify" i],[class*="netlify" i]');
      if (inner && el.parentNode === document.body && el.id !== 'root') return true;
    }
    return false;
  }

  function sweep(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (bad(el)) { el.remove(); continue; }
      if (el.nodeType === 1 && el.shadowRoot && bad(el.shadowRoot.firstElementChild)) el.remove();
    }
  }

  var mo = new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) sweep(list[i].addedNodes);
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  function full() {
    if (document.body) sweep(document.body.children);
    sweep(document.head ? document.head.children : []);
  }
  document.addEventListener('DOMContentLoaded', full);
  window.addEventListener('load', function () { full(); setTimeout(full, 1500); setTimeout(full, 5000); });
})();
