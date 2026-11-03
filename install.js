// WODTRAIN — aviso de instalación (Android: botón nativo · iOS: instrucciones)
(function () {
  var standalone =
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (standalone || window.self !== window.top) return;

  var KEY = 'wodtrain-install-dismissed';
  try { if (Date.now() - Number(localStorage.getItem(KEY) || 0) < 3 * 864e5) return; } catch (e) {}

  var ua = navigator.userAgent;
  var isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isIOSSafari = isIOS && !/crios|fxios|edgios|opios/i.test(ua);
  var deferred = null;

  var css =
    '#wt-install{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:99999;' +
    'background:#151923;color:#f5f7fa;border:1px solid #2b3241;border-radius:20px;padding:14px;' +
    'box-shadow:0 18px 40px rgba(0,0,0,.45);font:15px/1.4 Inter,system-ui,sans-serif;max-width:480px;margin:0 auto;' +
    'display:flex;gap:12px;align-items:center}' +
    '#wt-install img{width:44px;height:44px;border-radius:12px;flex:none}' +
    '#wt-install .t{flex:1;min-width:0}#wt-install .h{display:block;font-weight:700;font-size:15px}#wt-install small b{display:inline;font-size:inherit;color:#f5f7fa}' +
    '#wt-install small{color:#a1a8b7;font-size:13px}' +
    '#wt-install button{border:0;border-radius:12px;font:600 14px Inter,system-ui,sans-serif;cursor:pointer;min-height:44px}' +
    '#wt-install .go{background:#d5ff45;color:#0f1405;padding:0 16px}' +
    '#wt-install .x{background:transparent;color:#737c8e;width:44px;font-size:22px;line-height:1}' +
    '#wt-install svg{display:inline-block;vertical-align:-3px}';

  function show(title, text, action) {
    if (document.getElementById('wt-install')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var el = document.createElement('div'); el.id = 'wt-install'; el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Instalar WODTRAIN');
    el.innerHTML =
      '<img src="./icon-192.png" alt="">' +
      '<div class="t"><span class="h">' + title + '</span><small>' + text + '</small></div>' +
      (action ? '<button class="go" type="button">Instalar</button>' : '') +
      '<button class="x" type="button" aria-label="Cerrar">×</button>';
    document.body.appendChild(el);
    el.querySelector('.x').onclick = function () {
      try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
      el.remove();
    };
    if (action) el.querySelector('.go').onclick = action;
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    show('Instala WODTRAIN', 'Úsala como app, a pantalla completa y sin conexión.', function () {
      deferred.prompt();
      deferred.userChoice.finally(function () {
        var el = document.getElementById('wt-install'); if (el) el.remove();
        deferred = null;
      });
    });
  });

  window.addEventListener('appinstalled', function () {
    var el = document.getElementById('wt-install'); if (el) el.remove();
  });

  if (isIOS) {
    var share =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8f9cff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
    var msg = isIOSSafari
      ? 'Pulsa ' + share + ' <b>Compartir</b> y luego <b>«Añadir a pantalla de inicio»</b>.'
      : 'Abre este enlace en <b>Safari</b>, pulsa ' + share + ' Compartir y «Añadir a pantalla de inicio».';
    window.addEventListener('load', function () {
      setTimeout(function () { show('Instala WODTRAIN en tu iPhone', msg, null); }, 1500);
    });
  }
})();
