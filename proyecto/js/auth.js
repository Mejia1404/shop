/* ================================================================
   AUTOFIX — auth.js
   Lógica de login, registro y validaciones de formularios.
   ================================================================ */

// ── UTILIDADES ───────────────────────────────────────────────────────
const showAlert = (id, msg, type = 'error') => {
  const el = document.getElementById(id);
  if (!el) return;
  const msgEl = el.querySelector('span:last-child');
  if (msgEl) msgEl.textContent = msg;
  el.className = `auth-alert auth-alert--${type} show`;
};

const hideAlert = (id) => {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
};

const setLoading = (btnId, loading) => {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? 'Procesando…' : btn.dataset.label;
};

// ── TOGGLE VISIBILIDAD CONTRASEÑA ────────────────────────────────────
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('toggle-pw')) {
    const targetId = e.target.dataset.target;
    const input    = document.getElementById(targetId);
    if (!input) return;
    input.type    = input.type === 'password' ? 'text' : 'password';
    e.target.textContent = input.type === 'password' ? '👁' : '🙈';
  }
});

// ── INDICADOR DE FORTALEZA DE CONTRASEÑA ─────────────────────────────
const calcStrength = (pw) => {
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
};

const updateStrengthUI = (pw) => {
  const bars   = [1,2,3,4].map((n) => document.getElementById(`sb${n}`));
  const label  = document.getElementById('strength-label');
  if (!bars[0] || !label) return;

  const score  = calcStrength(pw);
  const colors = ['#ef4444','#f59e0b','#3b82f6','#22c55e'];
  const labels = ['Muy débil','Débil','Moderada','Fuerte'];

  bars.forEach((b, i) => {
    if (!b) return;
    b.style.background = i < score ? colors[score - 1] : 'var(--border)';
  });
  label.textContent  = pw.length > 0 ? `Contraseña ${labels[score - 1] || 'Muy débil'}` : '';
  label.style.color  = score > 0 ? colors[score - 1] : 'var(--text-muted)';
};

// ── VALIDACIÓN BASE ───────────────────────────────────────────────────
const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ════════════════════════════════════════════════════════════════════
//  FORMULARIO DE LOGIN
// ════════════════════════════════════════════════════════════════════
const initLogin = () => {
  const form = document.getElementById('login-form');
  const btn  = document.getElementById('btn-login');
  if (!form || !btn) return;

  btn.dataset.label = btn.textContent;

  // Redirigir si ya hay sesión activa
  if (Auth.isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert('login-alert');

    const email = document.getElementById('login-email').value.trim();
    const pw    = document.getElementById('login-pw').value;

    // Validaciones cliente
    if (!email || !validarEmail(email)) {
      showAlert('login-alert', 'Ingresa un correo electrónico válido.');
      return;
    }
    if (!pw) {
      showAlert('login-alert', 'La contraseña no puede estar vacía.');
      return;
    }

    setLoading('btn-login', true);

    // Simular latencia de red
    await new Promise((r) => setTimeout(r, 700));

    const result = Auth.login({ email, password: pw });
    setLoading('btn-login', false);

    if (!result.ok) {
      showAlert('login-alert', result.msg);
      return;
    }

    showToast(`✅ Bienvenido, ${result.session.nombre.split(' ')[0]}!`, 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 900);
  });
};

// ════════════════════════════════════════════════════════════════════
//  FORMULARIO DE REGISTRO
// ════════════════════════════════════════════════════════════════════
const initRegistro = () => {
  const form = document.getElementById('registro-form');
  const btn  = document.getElementById('btn-registro');
  if (!form || !btn) return;

  btn.dataset.label = btn.textContent;

  // Redirigir si ya hay sesión activa
  if (Auth.isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  // Indicador de fortaleza en tiempo real
  document.getElementById('reg-pw')?.addEventListener('input', (e) => {
    updateStrengthUI(e.target.value);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert('reg-alert');

    const nombre   = document.getElementById('reg-nombre').value.trim();
    const apellido = document.getElementById('reg-apellido').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const pw       = document.getElementById('reg-pw').value;
    const pw2      = document.getElementById('reg-pw2').value;
    const terms    = document.getElementById('reg-terms').checked;

    // Validaciones
    if (!nombre || !apellido) {
      showAlert('reg-alert', 'Ingresa tu nombre y apellido.');
      return;
    }
    if (!validarEmail(email)) {
      showAlert('reg-alert', 'Ingresa un correo electrónico válido.');
      return;
    }
    if (pw.length < 6) {
      showAlert('reg-alert', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (pw !== pw2) {
      showAlert('reg-alert', 'Las contraseñas no coinciden.');
      return;
    }
    if (!terms) {
      showAlert('reg-alert', 'Debes aceptar los términos y condiciones.');
      return;
    }

    setLoading('btn-registro', true);
    await new Promise((r) => setTimeout(r, 800));

    const result = Auth.register({ nombre: `${nombre} ${apellido}`, email, password: pw });
    setLoading('btn-registro', false);

    if (!result.ok) {
      showAlert('reg-alert', result.msg);
      return;
    }

    // Login automático tras registro
    Auth.login({ email, password: pw });

    document.getElementById('reg-success').classList.add('show');
    showToast('🎉 ¡Cuenta creada exitosamente!', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1400);
  });
};

// ── INIT ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initRegistro();
});
