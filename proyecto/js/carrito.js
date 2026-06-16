/* ================================================================
   AUTOFIX — carrito.js
   Renderizado del carrito, cálculo de totales y checkout simulado.
   ================================================================ */

// ── CUPONES VÁLIDOS (simulados) ───────────────────────────────────────
const CUPONES = {
  AUTOFIX10: { descuento: 0.10, label: '10% de descuento aplicado 🎉' },
  REPUESTO20: { descuento: 0.20, label: '20% de descuento aplicado 🎉' },
  ENVIOGRATIS: { descuento: 0, envioGratis: true, label: '¡Envío gratis aplicado! 🚚' },
};
let cuponActivo = null;

// ── FORMATEO DE PRECIO ────────────────────────────────────────────────
const fmt = (n) => '$' + Math.round(n).toLocaleString('es-CL');

// ── PARSEAR PRECIO GUARDADO ───────────────────────────────────────────
// El inventario guarda precios como número; localStorage también.
const parsePrice = (p) => (typeof p === 'number' ? p : parseInt(String(p).replace(/\D/g, ''), 10)) || 0;

// ── RENDERIZAR CARRITO ────────────────────────────────────────────────
const renderCarrito = () => {
  const items     = Cart.get();
  const container = document.getElementById('cart-items');
  const titleEl   = document.getElementById('cart-title');
  if (!container) return;

  const total = items.reduce((s, i) => s + i.cantidad, 0);
  if (titleEl) titleEl.textContent = total > 0
    ? `${total} producto(s) en tu carrito`
    : 'Tu carrito está vacío';

  if (items.length === 0) {
    container.innerHTML = `
      <div class="state-empty" style="grid-column:unset;">
        <div class="state-empty__icon">🛒</div>
        <p style="font-weight:700;margin-bottom:8px;">Tu carrito está vacío</p>
        <p>Agrega repuestos desde el <a href="catalogo.html" style="color:var(--primary);font-weight:600;">catálogo</a>.</p>
      </div>`;
    actualizarResumen([]);
    return;
  }

  container.innerHTML = items.map((item) => `
    <div class="cart-item" id="item-${item.id}">
      <span class="cart-item__emoji">${item.emoji || '🔧'}</span>
      <div class="cart-item__info">
        <p class="cart-item__name">${item.nombre}</p>
        <p class="cart-item__meta">${item.categoria || ''} · ${fmt(parsePrice(item.precio))} c/u</p>
      </div>
      <div class="cart-item__qty">
        <button class="qty-btn" onclick="cambiarCantidad(${item.id}, -1)">−</button>
        <span class="qty-num">${item.cantidad}</span>
        <button class="qty-btn" onclick="cambiarCantidad(${item.id}, +1)">+</button>
      </div>
      <span class="cart-item__price">${fmt(parsePrice(item.precio) * item.cantidad)}</span>
      <button class="cart-item__remove" onclick="eliminarItem(${item.id})" title="Eliminar">✕</button>
    </div>`).join('');

  actualizarResumen(items);
};

// ── ACTUALIZAR RESUMEN ────────────────────────────────────────────────
const actualizarResumen = (items) => {
  const subtotalRaw = items.reduce((s, i) => s + parsePrice(i.precio) * i.cantidad, 0);
  const descuento   = cuponActivo?.descuento   ? subtotalRaw * cuponActivo.descuento : 0;
  const subtotal    = subtotalRaw - descuento;
  const envio       = items.length === 0 || cuponActivo?.envioGratis ? 0 : (subtotal > 80000 ? 0 : 4990);
  const iva         = subtotal * 0.19;
  const total       = subtotal + envio + iva;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('sum-subtotal', fmt(subtotalRaw));
  set('sum-envio',    envio === 0 && items.length > 0 ? '¡Gratis!' : fmt(envio));
  set('sum-iva',      fmt(iva));
  set('sum-total',    fmt(total));

  // Fila de descuento dinámica
  let filaDesc = document.getElementById('sum-descuento-row');
  if (descuento > 0) {
    if (!filaDesc) {
      filaDesc = document.createElement('div');
      filaDesc.id = 'sum-descuento-row';
      filaDesc.className = 'summary-row';
      filaDesc.style.color = 'var(--success)';
      document.getElementById('sum-envio')?.closest('.summary-row')?.insertAdjacentElement('beforebegin', filaDesc);
    }
    filaDesc.innerHTML = `<span>Cupón aplicado</span><span>−${fmt(descuento)}</span>`;
  } else if (filaDesc) {
    filaDesc.remove();
  }
};

// ── ACCIONES DE ÍTEM ─────────────────────────────────────────────────
const cambiarCantidad = (id, delta) => {
  Cart.updateQty(id, delta);
  renderCarrito();
};

const eliminarItem = (id) => {
  Cart.remove(id);
  renderCarrito();
  showToast('🗑 Producto eliminado del carrito', 'default');
};

// ── CUPÓN ────────────────────────────────────────────────────────────
const aplicarCupon = () => {
  const input = document.getElementById('cupon-input');
  const msgEl = document.getElementById('cupon-msg');
  const codigo = input?.value.trim().toUpperCase();

  if (!codigo) return;

  const cupon = CUPONES[codigo];
  if (!cupon) {
    if (msgEl) { msgEl.textContent = '❌ Cupón inválido o expirado.'; msgEl.style.display = 'block'; msgEl.style.color = 'var(--danger)'; }
    return;
  }

  cuponActivo = cupon;
  if (msgEl) { msgEl.textContent = `✅ ${cupon.label}`; msgEl.style.display = 'block'; msgEl.style.color = 'var(--success)'; }
  if (input) input.disabled = true;
  document.getElementById('btn-cupon').textContent = '✓';
  actualizarResumen(Cart.get());
};

// ── VACIAR CARRITO ────────────────────────────────────────────────────
const vaciarCarrito = () => {
  if (Cart.get().length === 0) return;
  if (!confirm('¿Estás seguro de que deseas vaciar el carrito?')) return;
  Cart.clear();
  cuponActivo = null;
  renderCarrito();
  showToast('🗑 Carrito vaciado', 'default');
};

// ── CHECKOUT SIMULADO ─────────────────────────────────────────────────
const checkout = () => {
  const items = Cart.get();
  if (items.length === 0) {
    showToast('⚠️ Tu carrito está vacío', 'error');
    return;
  }

  // Verificar sesión
  if (!Auth.isLoggedIn()) {
    showToast('🔒 Inicia sesión para finalizar tu pedido', 'error');
    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    return;
  }

  // Generar número de orden
  const orderNum = 'AF-' + Date.now().toString(36).toUpperCase();
  document.getElementById('order-num').textContent = orderNum;

  // Mostrar modal
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.style.display = 'flex';

  // Vaciar carrito tras confirmar
  Cart.clear();
  renderCarrito();
};

// ── INIT ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderCarrito();

  document.getElementById('btn-vaciar')  ?.addEventListener('click', vaciarCarrito);
  document.getElementById('btn-cupon')   ?.addEventListener('click', aplicarCupon);
  document.getElementById('btn-checkout')?.addEventListener('click', checkout);

  // Enter en cupón
  document.getElementById('cupon-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') aplicarCupon();
  });

  // Modal cerrar
  document.getElementById('btn-modal-close')?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
  document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) e.currentTarget.style.display = 'none';
  });
});
