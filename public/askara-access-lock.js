/* Askara Indonesia access popup. Load synchronously in <head>. */
(() => {
  'use strict';
  if (window.__askaraAccessLockLoaded) return;
  window.__askaraAccessLockLoaded = true;

  const storageKey = 'askara-access:2026:v1';
  const accessCode = 'askaraindonesia2026';
  try {
    if (sessionStorage.getItem(storageKey) === 'verified') return;
  } catch { /* Keep verification available when browser storage is blocked. */ }

  document.documentElement.setAttribute('data-askara-locked', '');
  const style = document.createElement('style');
  style.textContent = `
    html[data-askara-locked], html[data-askara-locked] body { overflow: hidden !important; }
    html[data-askara-locked] body > :not([data-askara-lock-dialog]) {
      filter: blur(12px) !important; pointer-events: none !important; user-select: none !important;
    }
    dialog[data-askara-lock-dialog] {
      box-sizing: border-box; position: fixed; inset: 0; margin: auto;
      width: min(440px, calc(100% - 32px)); max-height: calc(100dvh - 32px);
      padding: 32px; overflow: auto; border: 1px solid #dce3ef; border-radius: 24px;
      background: #fff; color: #18243b; font: 16px/1.6 system-ui, sans-serif;
      box-shadow: 0 24px 90px #07152755; text-align: left;
    }
    dialog[data-askara-lock-dialog]::backdrop { background: #101c365e; backdrop-filter: blur(4px); }
    dialog[data-askara-lock-dialog] * { box-sizing: border-box; }
    dialog[data-askara-lock-dialog] .askara-symbol {
      display: grid; place-items: center; width: 56px; height: 56px;
      margin: 0 0 20px; border-radius: 16px; background: #eaf1ff; color: #2459c4;
    }
    dialog[data-askara-lock-dialog] h2 { margin: 0 0 12px; font: 700 24px/1.3 system-ui, sans-serif; color: #18243b; }
    dialog[data-askara-lock-dialog] p { margin: 0 0 24px; font: 400 16px/1.65 system-ui, sans-serif; color: #4a5972; }
    dialog[data-askara-lock-dialog] a { color: #2459c4; font-weight: 650; text-decoration: underline; text-underline-offset: 3px; }
    dialog[data-askara-lock-dialog] label { display: block; margin-bottom: 8px; font-weight: 650; }
    dialog[data-askara-lock-dialog] input {
      display: block; width: 100%; height: 50px; border: 1px solid #bcc9dc;
      border-radius: 10px; padding: 0 14px; background: #fff; color: #18243b; font: inherit;
    }
    dialog[data-askara-lock-dialog] input:focus { outline: 3px solid #cfddff; border-color: #2459c4; }
    dialog[data-askara-lock-dialog] input[aria-invalid="true"] { border-color: #b42318; }
    dialog[data-askara-lock-dialog] .askara-error { min-height: 26px; margin: 8px 0 12px; color: #b42318; font-size: 14px; }
    dialog[data-askara-lock-dialog] button {
      display: block; width: 100%; min-height: 50px; border: 0; border-radius: 10px;
      background: #2459c4; color: #fff; font: 650 16px/1.3 system-ui, sans-serif;
      padding: 12px; cursor: pointer;
    }
    dialog[data-askara-lock-dialog] button:hover { background: #1d49a1; }
    dialog[data-askara-lock-dialog] :focus-visible { outline: 3px solid #91b5ff; outline-offset: 3px; }
    @media (max-width: 480px) { dialog[data-askara-lock-dialog] { padding: 24px; } }
  `;
  (document.head || document.documentElement).appendChild(style);

  const mount = () => {
    const previousFocus = document.activeElement;
    const dialog = document.createElement('dialog');
    dialog.setAttribute('data-askara-lock-dialog', '');
    dialog.setAttribute('aria-labelledby', 'askara-lock-title');
    dialog.setAttribute('aria-describedby', 'askara-lock-message');
    dialog.innerHTML = `
      <div class="askara-symbol" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>
          <path d="M12 14v3"/>
        </svg>
      </div>
      <h2 id="askara-lock-title">Akses Website</h2>
      <p id="askara-lock-message">Hubungi Team Askara Indonesia Untuk Akses Ke Website Ini , whatsapp : <a href="https://wa.me/6285815999953" target="_blank" rel="noopener noreferrer">085815999953</a></p>
      <form>
        <label for="askara-lock-code">Kode verifikasi</label>
        <input id="askara-lock-code" name="verification_code" type="password" placeholder="Masukkan kode verifikasi" autocomplete="off" autocapitalize="none" spellcheck="false" aria-describedby="askara-lock-error" required autofocus>
        <div id="askara-lock-error" class="askara-error" role="status" aria-live="polite"></div>
        <button type="submit">Buka Website</button>
      </form>
    `;
    const input = dialog.querySelector('input');
    const error = dialog.querySelector('.askara-error');
    dialog.addEventListener('cancel', event => event.preventDefault());
    input.addEventListener('input', () => {
      input.removeAttribute('aria-invalid');
      error.textContent = '';
    });
    dialog.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      if (input.value.trim() !== accessCode) {
        input.setAttribute('aria-invalid', 'true');
        error.textContent = 'Kode verifikasi salah. Silakan coba kembali.';
        input.focus();
        return;
      }
      try { sessionStorage.setItem(storageKey, 'verified'); } catch { /* Unlock this page even without storage. */ }
      document.documentElement.removeAttribute('data-askara-locked');
      dialog.close();
      dialog.remove();
      style.remove();
      if (previousFocus && previousFocus.isConnected) previousFocus.focus();
      document.dispatchEvent(new Event('askara:unlocked'));
    });
    document.body.appendChild(dialog);
    dialog.showModal();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
