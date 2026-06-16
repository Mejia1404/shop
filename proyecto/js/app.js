/* ================================================================
   AUTOFIX — app.js  (utilidades compartidas en todas las páginas)
   ================================================================ */

// ── TEMA (claro / oscuro) ────────────────────────────────────────────
const ThemeManager = (() => {
  const KEY     = 'af_theme';
  const HTML    = document.documentElement;
  const mq      = window.matchMedia('(prefers-color-scheme: dark)');
  let toggle    = null;   // se asigna en init()

  const apply = (dark) => {
    HTML.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (toggle) toggle.checked = dark;
  };

  const get = () => {
    const saved = localStorage.getItem(KEY);
    return saved ? saved === 'dark' : mq.matches;
  };

  const set = (dark) => {
    localStorage.setItem(KEY, dark ? 'dark' : 'light');
    apply(dark);
  };

  const init = () => {
    toggle = document.getElementById('theme-toggle');
    apply(get());                         // aplica tema inicial inmediatamente

    if (toggle) {
      toggle.addEventListener('change', () => set(toggle.checked));
    }

    // Sincroniza si el sistema cambia y el usuario no fijó preferencia
    mq.addEventListener('change', (e) => {
      if (!localStorage.getItem(KEY)) apply(e.matches);
    });
  };

  return { init, get, set };
})();

// ── NAVBAR: ocultar al bajar, mostrar al subir ───────────────────────
const NavbarManager = (() => {
  let lastY = 0;
  let ticking = false;

  const update = (navbar) => {
    const y = window.scrollY;
    if (y > lastY && y > 80) {
      navbar.classList.add('navbar--hidden');
    } else {
      navbar.classList.remove('navbar--hidden');
    }
    lastY = y;
    ticking = false;
  };

  const init = () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => update(navbar));
        ticking = true;
      }
    }, { passive: true });

    // Enlace activo en la barra de navegación
    const page = document.body.dataset.page;
    document.querySelectorAll('.navbar__links a, .mobile-nav a').forEach((a) => {
      if (a.dataset.page === page) a.classList.add('active');
    });

    // Hamburger → menú móvil
    const hamburger  = document.getElementById('hamburger');
    const mobileNav  = document.getElementById('mobile-nav');
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
        hamburger.textContent = mobileNav.classList.contains('open') ? '✕' : '☰';
      });
    }
  };

  return { init };
})();

// ── CARRITO ──────────────────────────────────────────────────────────
const Cart = (() => {
  const KEY = 'af_cart';

  const get     = ()       => JSON.parse(localStorage.getItem(KEY) || '[]');
  const save    = (c)      => localStorage.setItem(KEY, JSON.stringify(c));
  const count   = ()       => get().reduce((s, i) => s + i.cantidad, 0);

  const add = (producto) => {
    const cart  = get();
    const idx   = cart.findIndex((i) => i.id === producto.id);
    if (idx >= 0) {
      cart[idx].cantidad += 1;
    } else {
      cart.push({ ...producto, cantidad: 1 });
    }
    save(cart);
    updateBadge();
    showToast(`🛒 <strong>${producto.nombre}</strong> agregado al carrito`, 'success');
  };

  const remove = (id) => {
    save(get().filter((i) => i.id !== id));
    updateBadge();
  };

  const updateQty = (id, delta) => {
    const cart = get();
    const idx  = cart.findIndex((i) => i.id === id);
    if (idx < 0) return;
    cart[idx].cantidad = Math.max(1, cart[idx].cantidad + delta);
    save(cart);
    updateBadge();
  };

  const clear = () => { save([]); updateBadge(); };

  const updateBadge = () => {
    const n     = count();
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    badge.textContent = n;
    badge.classList.toggle('hidden', n === 0);
  };

  return { get, add, remove, updateQty, clear, count, updateBadge };
})();

// ── AUTENTICACIÓN ────────────────────────────────────────────────────
const Auth = (() => {
  const USERS_KEY   = 'af_users';
  const SESSION_KEY = 'af_session';

  const getUsers   = ()  => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const getSession = ()  => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');

  const register = ({ nombre, email, password }) => {
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      return { ok: false, msg: 'Este correo ya está registrado.' };
    }
    const user = { id: Date.now(), nombre, email, password, createdAt: new Date().toISOString() };
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { ok: true };
  };

  const login = ({ email, password }) => {
    const user = getUsers().find((u) => u.email === email && u.password === password);
    if (!user) return { ok: false, msg: 'Correo o contraseña incorrectos.' };
    const session = { userId: user.id, nombre: user.nombre, email: user.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true, session };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
  };

  const isLoggedIn = () => !!getSession();

  return { register, login, logout, getSession, isLoggedIn };
})();

// ── AUTH AREA EN NAVBAR ──────────────────────────────────────────────
const renderAuthArea = () => {
  const area    = document.getElementById('auth-area');
  const session = Auth.getSession();
  if (!area) return;

  if (session) {
    const initials = session.nombre.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
    area.innerHTML = `
      <div class="user-chip">
        <div class="user-avatar">${initials}</div>
        <span>${session.nombre.split(' ')[0]}</span>
      </div>
      <button class="btn btn--ghost btn--sm" id="logout-btn">Salir</button>`;
    document.getElementById('logout-btn').addEventListener('click', Auth.logout);
  } else {
    area.innerHTML = `
      <a href="login.html" class="btn btn--outline btn--sm">Iniciar sesión</a>
      <a href="registro.html" class="btn btn--primary btn--sm">Registrarse</a>`;
  }

  // Mismo contenido en el menú móvil
  const mobileAuth = document.getElementById('mobile-auth');
  if (mobileAuth) mobileAuth.innerHTML = area.innerHTML;
};

// ── TOAST GLOBAL ─────────────────────────────────────────────────────
const showToast = (html, type = 'default') => {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.innerHTML = html;
  el.className = `show toast--${type}`;
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3000);
};

// ── INIT GLOBAL ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  NavbarManager.init();
  Cart.updateBadge();
  renderAuthArea();
});
