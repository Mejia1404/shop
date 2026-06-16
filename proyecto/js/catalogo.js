/* ================================================================
   AUTOFIX — catalogo.js
   Inventario, filtrado y renderizado de tarjetas de productos.
   Usado tanto en catalogo.html como en index.html (productos destacados).

   IMÁGENES DE PRODUCTO
   --------------------
   Cada producto puede mostrar una imagen representativa. Solo debes
   subir tu imagen a la carpeta:  public/images/productos/
   con el nombre  {id}.jpg   (por ejemplo: 1.jpg, 2.jpg, 14.jpg …)

   Si la imagen no existe todavía, la tarjeta muestra automáticamente
   el emoji de respaldo, así que el catálogo nunca se ve roto.
   ================================================================ */

// ── INVENTARIO ───────────────────────────────────────────────────────
const inventario = [
  // Toyota
  { id: 1,  nombre: "Filtro de aceite OEM",            categoria: "Filtros",          emoji: "🛢️", marca: "Toyota",    modelo: "Corolla",  año: "2022", precio: 18900,  desc: "Filtro original. Retención 99,9% de partículas. Cambio cada 5.000 km." },
  { id: 2,  nombre: "Amortiguador delantero",          categoria: "Suspensión",       emoji: "🔧", marca: "Toyota",    modelo: "Corolla",  año: "2021", precio: 74900,  desc: "Gas de doble tubo. Mejor estabilidad en curvas y terreno irregular." },
  { id: 3,  nombre: "Líquido de frenos DOT 4",         categoria: "Frenos",           emoji: "🟡", marca: "Toyota",    modelo: "Corolla",  año: "2020", precio: 8900,   desc: "500 ml. Punto de ebullición seco 265°C. Compatible ABS y ESP." },
  { id: 4,  nombre: "Caja de dirección",                categoria: "Dirección",        emoji: "🎯", marca: "Toyota",    modelo: "Hilux",    año: "2021", precio: 185000, desc: "Caja de dirección hidráulica remanufacturada. Incluye sellos nuevos." },
  { id: 5,  nombre: "Batería 12V 60Ah",                 categoria: "Eléctrico",        emoji: "🔋", marca: "Toyota",    modelo: "RAV4",     año: "2022", precio: 129000, desc: "Libre de mantenimiento. 18 meses de garantía. Arranque garantizado." },
  { id: 6,  nombre: "Compresor de aire acondicionado",  categoria: "Aire acondicionado", emoji: "❄️", marca: "Toyota",   modelo: "RAV4",     año: "2023", precio: 198000, desc: "Compresor remanufacturado. Incluye filtro secador nuevo." },
  { id: 7,  nombre: "Llanta 205/55R16",                 categoria: "Llantas",          emoji: "🛞", marca: "Toyota",    modelo: "Corolla",  año: "2022", precio: 58500,  desc: "Llanta radial todo terreno. Banda de rodadura de larga duración." },

  // Chevrolet
  { id: 8,  nombre: "Batería 12V 65Ah",                 categoria: "Eléctrico",        emoji: "🔋", marca: "Chevrolet", modelo: "Aveo",     año: "2020", precio: 89000,  desc: "Libre de mantenimiento. 18 meses de garantía. Arranque garantizado." },
  { id: 9,  nombre: "Sensor de oxígeno Lambda",         categoria: "Eléctrico",        emoji: "📡", marca: "Chevrolet", modelo: "Aveo",     año: "2023", precio: 38200,  desc: "Banda ancha 4 cables. Elimina código P0136/P0141 (check engine)." },
  { id: 10, nombre: "Filtro de combustible",            categoria: "Filtros",          emoji: "⛽", marca: "Chevrolet", modelo: "Aveo",     año: "2019", precio: 14500,  desc: "Alta presión. Protege inyectores y bomba de combustible." },
  { id: 11, nombre: "Correa de distribución Kit",       categoria: "Motor",            emoji: "⚙️", marca: "Chevrolet", modelo: "Spark",    año: "2021", precio: 35400,  desc: "Kit completo: correa, tensor y polea. Recambio recomendado 100.000 km." },
  { id: 12, nombre: "Kit de embrague",                   categoria: "Transmisión",      emoji: "⚙️", marca: "Chevrolet", modelo: "Sail",     año: "2020", precio: 145000, desc: "Kit completo: disco, collarín y plato de presión." },
  { id: 13, nombre: "Silenciador (mofle) trasero",       categoria: "Escape",           emoji: "💨", marca: "Chevrolet", modelo: "Sail",     año: "2019", precio: 58900,  desc: "Acero inoxidable. Reduce ruido y vibración del escape." },

  // Hyundai
  { id: 14, nombre: "Pastillas de freno traseras",      categoria: "Frenos",           emoji: "🔴", marca: "Hyundai",   modelo: "Tucson",   año: "2021", precio: 42500,  desc: "Pastillas cerámicas de bajo polvo con sensor de desgaste incluido." },
  { id: 15, nombre: "Bujías de iridio (x4)",            categoria: "Motor",            emoji: "⚡", marca: "Hyundai",   modelo: "Tucson",   año: "2022", precio: 28400,  desc: "Vida útil hasta 100.000 km. Mejora arranque, potencia y consumo." },
  { id: 16, nombre: "Alternador remanufacturado",       categoria: "Eléctrico",        emoji: "🔌", marca: "Hyundai",   modelo: "Tucson",   año: "2019", precio: 145000, desc: "120A. Garantía 12 meses. Probado en banco antes del despacho." },
  { id: 17, nombre: "Filtro de cabina (polen)",          categoria: "Aire acondicionado", emoji: "❄️", marca: "Hyundai",  modelo: "Accent",   año: "2021", precio: 9800,   desc: "Filtra polvo, polen y olores antes de entrar a la cabina." },
  { id: 18, nombre: "Disco de freno delantero",          categoria: "Frenos",           emoji: "🟤", marca: "Hyundai",   modelo: "Accent",   año: "2020", precio: 39700,  desc: "Disco ventilado de alta resistencia térmica. Vendido por par." },
  { id: 19, nombre: "Terminal de dirección",             categoria: "Dirección",        emoji: "🎯", marca: "Hyundai",   modelo: "Elantra",  año: "2022", precio: 15600,  desc: "Terminal de cremallera. Elimina holgura y ruido al girar." },

  // Ford
  { id: 20, nombre: "Disco de freno ventilado",         categoria: "Frenos",           emoji: "🟤", marca: "Ford",      modelo: "Ranger",   año: "2020", precio: 56000,  desc: "Alta resistencia térmica. Se recomienda sustituir en par por eje." },
  { id: 21, nombre: "Brazo de suspensión delantero",    categoria: "Suspensión",       emoji: "🦾", marca: "Ford",      modelo: "Ranger",   año: "2021", precio: 98000,  desc: "Acero forjado. Incluye rótula y buje. Mejora alineación direccional." },
  { id: 22, nombre: "Kit de embrague",                   categoria: "Transmisión",      emoji: "⚙️", marca: "Ford",      modelo: "Ranger",   año: "2022", precio: 215000, desc: "Kit completo de embrague reforzado para uso exigente." },
  { id: 23, nombre: "Catalizador",                       categoria: "Escape",           emoji: "💨", marca: "Ford",      modelo: "Ranger",   año: "2021", precio: 245000, desc: "Catalizador de tres vías homologado. Reduce emisiones contaminantes." },
  { id: 24, nombre: "Sensor de oxígeno Lambda",          categoria: "Eléctrico",        emoji: "📡", marca: "Ford",      modelo: "Fiesta",   año: "2018", precio: 54200,  desc: "Banda ancha. Elimina código de falla por mezcla incorrecta." },
  { id: 25, nombre: "Caucho de dirección",               categoria: "Dirección",        emoji: "🎯", marca: "Ford",      modelo: "Fiesta",   año: "2019", precio: 22300,  desc: "Fuelle protector de la cremallera de dirección. Vendido por par." },
  { id: 26, nombre: "Llanta 215/60R16",                  categoria: "Llantas",          emoji: "🛞", marca: "Ford",      modelo: "Escape",   año: "2021", precio: 71500,  desc: "Llanta para SUV compacta. Buen agarre en mojado." },

  // Nissan
  { id: 27, nombre: "Filtro de aire alto flujo",         categoria: "Filtros",          emoji: "💨", marca: "Nissan",    modelo: "Sentra",   año: "2021", precio: 22000,  desc: "Aumenta caudal de aire un 15%. Lavable y reutilizable." },
  { id: 28, nombre: "Termostato 82°C",                   categoria: "Motor",            emoji: "🌡️", marca: "Nissan",    modelo: "Sentra",   año: "2020", precio: 19800,  desc: "Apertura exacta a 82°C. Previene sobrecalentamiento y consumo excesivo." },
  { id: 29, nombre: "Radiador de aluminio",               categoria: "Motor",            emoji: "🌡️", marca: "Nissan",    modelo: "Sentra",   año: "2022", precio: 98500,  desc: "Núcleo de aluminio. Mejor disipación térmica que el original de plástico." },
  { id: 30, nombre: "Bomba de agua",                      categoria: "Motor",            emoji: "💧", marca: "Nissan",    modelo: "Frontier", año: "2022", precio: 67000,  desc: "Aluminio fundido. Incluye junta de instalación. OEM compatible." },
  { id: 31, nombre: "Cable selector de cambios",          categoria: "Transmisión",      emoji: "⚙️", marca: "Nissan",    modelo: "Frontier", año: "2020", precio: 33600,  desc: "Cable de transmisión manual. Elimina juego en la palanca." },
  { id: 32, nombre: "Llanta 265/65R17",                   categoria: "Llantas",          emoji: "🛞", marca: "Nissan",    modelo: "Frontier", año: "2021", precio: 89900,  desc: "Llanta para camioneta. Resistente a terreno irregular." },
  { id: 33, nombre: "Compresor de aire acondicionado",    categoria: "Aire acondicionado", emoji: "❄️", marca: "Nissan",   modelo: "Versa",    año: "2021", precio: 176500, desc: "Compresor nuevo. Incluye correa y kit de instalación." },

  // Kia
  { id: 34, nombre: "Bujes de barra estabilizadora",     categoria: "Suspensión",       emoji: "🔩", marca: "Kia",       modelo: "Sportage", año: "2023", precio: 12400,  desc: "Poliuretano reforzado. Kit x4 piezas. Elimina ruidos en curvas." },
  { id: 35, nombre: "Bomba de agua",                      categoria: "Motor",            emoji: "💧", marca: "Kia",       modelo: "Sportage", año: "2022", precio: 67000,  desc: "Aluminio fundido. Incluye junta de instalación. OEM compatible." },
  { id: 36, nombre: "Terminal de dirección",              categoria: "Dirección",        emoji: "🎯", marca: "Kia",       modelo: "Sportage", año: "2023", precio: 18900,  desc: "Terminal de cremallera. Elimina holgura y ruido al girar." },
  { id: 37, nombre: "Filtro de cabina (polen)",           categoria: "Aire acondicionado", emoji: "❄️", marca: "Kia",      modelo: "Rio",      año: "2022", precio: 7900,   desc: "Filtra polvo, polen y olores antes de entrar a la cabina." },
  { id: 38, nombre: "Disco de freno trasero",             categoria: "Frenos",           emoji: "🟤", marca: "Kia",       modelo: "Rio",      año: "2021", precio: 41600,  desc: "Disco macizo. Se recomienda sustituir en par por eje." },
  { id: 39, nombre: "Mofle/escape completo",              categoria: "Escape",           emoji: "💨", marca: "Kia",       modelo: "Cerato",   año: "2020", precio: 71400,  desc: "Sistema de escape completo. Acero inoxidable resistente a corrosión." },

  // Mazda
  { id: 40, nombre: "Bujías de iridio (x4)",              categoria: "Motor",            emoji: "⚡", marca: "Mazda",     modelo: "3",        año: "2022", precio: 27800,  desc: "Vida útil hasta 100.000 km. Mejora arranque, potencia y consumo." },
  { id: 41, nombre: "Pastillas de freno delanteras",      categoria: "Frenos",           emoji: "🔴", marca: "Mazda",     modelo: "3",        año: "2021", precio: 44500,  desc: "Pastillas cerámicas de bajo polvo con sensor de desgaste incluido." },
  { id: 42, nombre: "Amortiguador trasero",               categoria: "Suspensión",       emoji: "🔧", marca: "Mazda",     modelo: "CX-5",     año: "2022", precio: 79400,  desc: "Gas de doble tubo. Mejor estabilidad en curvas y terreno irregular." },
  { id: 43, nombre: "Llanta 225/65R17",                   categoria: "Llantas",          emoji: "🛞", marca: "Mazda",     modelo: "CX-5",     año: "2023", precio: 68500,  desc: "Llanta para SUV. Bajo nivel de ruido en carretera." },

  // Honda
  { id: 44, nombre: "Filtro de aceite OEM",               categoria: "Filtros",          emoji: "🛢️", marca: "Honda",     modelo: "Civic",    año: "2021", precio: 17500,  desc: "Filtro original. Retención 99,9% de partículas. Cambio cada 5.000 km." },
  { id: 45, nombre: "Batería 12V 50Ah",                   categoria: "Eléctrico",        emoji: "🔋", marca: "Honda",     modelo: "Civic",    año: "2020", precio: 98000,  desc: "Libre de mantenimiento. 18 meses de garantía. Arranque garantizado." },
  { id: 46, nombre: "Kit de embrague",                    categoria: "Transmisión",      emoji: "⚙️", marca: "Honda",     modelo: "Civic",    año: "2019", precio: 198500, desc: "Kit completo: disco, collarín y plato de presión." },
  { id: 47, nombre: "Compresor de aire acondicionado",    categoria: "Aire acondicionado", emoji: "❄️", marca: "Honda",    modelo: "CR-V",     año: "2022", precio: 187000, desc: "Compresor nuevo. Incluye correa y kit de instalación." },
  { id: 48, nombre: "Caja de dirección",                  categoria: "Dirección",        emoji: "🎯", marca: "Honda",     modelo: "CR-V",     año: "2021", precio: 192000, desc: "Caja de dirección eléctrica remanufacturada. Incluye sellos nuevos." },
];

// ── RUTA DE IMAGEN DE PRODUCTO ────────────────────────────────────────
// Cada producto busca su imagen en images/productos/{id}.jpg
// Si no existe, se muestra el emoji de respaldo automáticamente.
const imgProducto = (p) => `images/productos/${p.id}.jpg`;

// ── RENDERIZAR UNA TARJETA ────────────────────────────────────────────
const renderCard = (p) => `
  <article class="product-card fade-up">
    <div class="product-card__img">
      <img src="${imgProducto(p)}" alt="${p.nombre}" loading="lazy"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
      <span class="product-card__emoji" aria-hidden="true">${p.emoji}</span>
    </div>
    <div class="product-card__body">
      <span class="product-card__badge">${p.categoria}</span>
      <h3 class="product-card__name">${p.nombre}</h3>
      <p class="product-card__compat">✅ ${p.marca} ${p.modelo} · ${p.año}</p>
      <p class="product-card__desc">${p.desc}</p>
    </div>
    <div class="product-card__footer">
      <span class="product-card__price">${formatPrice(p.precio)}</span>
      <button class="btn btn--primary btn--sm" onclick="agregarProducto(${p.id})">
        🛒 Agregar
      </button>
    </div>
  </article>`;

// ── UTILIDAD DE PRECIO ────────────────────────────────────────────────
const formatPrice = (n) =>
  '$' + n.toLocaleString('es-CL');

// ── AGREGAR AL CARRITO ────────────────────────────────────────────────
const agregarProducto = (id) => {
  const producto = inventario.find((p) => p.id === id);
  if (producto) Cart.add(producto);
};

// ── LÓGICA DE FILTRADO ────────────────────────────────────────────────
const filtrar = () => {
  const marca    = (document.getElementById('sel-marca')?.value    || '').toLowerCase();
  const modelo   = (document.getElementById('sel-modelo')?.value   || '').toLowerCase();
  const año      = (document.getElementById('sel-año')?.value      || '');
  const cat      = (document.getElementById('sel-cat')?.value      || '').toLowerCase();
  const busqueda = (document.getElementById('sel-busqueda')?.value || '').toLowerCase().trim();

  return inventario.filter((p) => {
    const okMarca  = !marca    || p.marca.toLowerCase()     === marca;
    const okModelo = !modelo   || p.modelo.toLowerCase()    === modelo;
    const okAño    = !año      || p.año                     === año;
    const okCat    = !cat      || p.categoria.toLowerCase() === cat;
    const okBusq   = !busqueda ||
      p.nombre.toLowerCase().includes(busqueda) ||
      p.desc.toLowerCase().includes(busqueda)   ||
      p.categoria.toLowerCase().includes(busqueda);
    return okMarca && okModelo && okAño && okCat && okBusq;
  });
};

const renderResultados = () => {
  const container = document.getElementById('cards-container');
  const countEl   = document.getElementById('resultado-count');
  if (!container) return;

  const resultados = filtrar();

  if (countEl) {
    countEl.textContent = resultados.length > 0
      ? `${resultados.length} repuesto(s) encontrado(s)`
      : '';
  }

  if (resultados.length === 0) {
    container.innerHTML = `
      <div class="state-empty">
        <div class="state-empty__icon">😕</div>
        <p style="font-weight:700;margin-bottom:6px;">Sin resultados</p>
        <p>Intenta ampliar los filtros o cambiar el término de búsqueda.</p>
      </div>`;
    return;
  }

  container.innerHTML = resultados.map(renderCard).join('');
};

const limpiarFiltros = () => {
  ['sel-marca','sel-modelo','sel-año','sel-cat','sel-busqueda'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  poblarModelos('');
  renderResultados();
};

// ── MODELO DINÁMICO SEGÚN MARCA ────────────────────────────────────────
const poblarModelos = (marca) => {
  const selModelo = document.getElementById('sel-modelo');
  if (!selModelo) return;

  const valorActual = selModelo.value;
  selModelo.innerHTML = '<option value="">Todos los modelos</option>';

  const modelos = [...new Set(
    inventario
      .filter((p) => !marca || p.marca === marca)
      .map((p) => p.modelo)
  )].sort();

  modelos.forEach((m) => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    selModelo.appendChild(opt);
  });

  if (modelos.includes(valorActual)) selModelo.value = valorActual;
};

// ── INICIALIZACIÓN (solo en catalogo.html) ────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const selMarca   = document.getElementById('sel-marca');
  const btnBuscar  = document.getElementById('btn-buscar');
  const btnLimpiar = document.getElementById('btn-limpiar');
  const inputBusq  = document.getElementById('sel-busqueda');

  if (!document.getElementById('cards-container')) return; // esta página no tiene catálogo (ej. index.html)

  poblarModelos('');

  if (selMarca) {
    selMarca.addEventListener('change', () => poblarModelos(selMarca.value));
  }
  if (btnBuscar)  btnBuscar.addEventListener('click', renderResultados);
  if (btnLimpiar) btnLimpiar.addEventListener('click', limpiarFiltros);

  if (inputBusq) {
    inputBusq.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') renderResultados();
    });
  }

  const categoriaURL = new URLSearchParams(window.location.search).get('categoria');
  const selCat = document.getElementById('sel-cat');
  if (categoriaURL && selCat) {
    selCat.value = categoriaURL;
  }

  renderResultados();
});
