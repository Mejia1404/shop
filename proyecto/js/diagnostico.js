/* ================================================================
   AUTOFIX — diagnostico.js
   Base de conocimiento y lógica del tele-diagnóstico con IA simulada.
   ================================================================ */

// ── BASE DE CONOCIMIENTO ─────────────────────────────────────────────
const diagnosticos = {
  ruido_motor: {
    emoji: "🔩",
    titulo: "Posible desgaste en tren de válvulas",
    severidad: "media",
    labelSev: "Moderada",
    categoria: "Motor",
    desc: "Un ruido metálico persistente al arrancar en frío suele indicar desgaste en los balancines, cadena o correa de distribución con tensión incorrecta. También puede ser bajo nivel de aceite. Se recomienda revisión en los próximos 500 km para evitar daños mayores.",
    piezas: ["Correa de distribución + kit tensor", "Aceite de motor 5W-30", "Filtro de aceite OEM", "Balancines (revisión mecánica)"],
    confianza: 87,
  },
  humo_negro: {
    emoji: "💨",
    titulo: "Mezcla rica — exceso de combustible",
    severidad: "alta",
    labelSev: "Urgente",
    categoria: "Motor",
    desc: "El humo negro indica que el motor quema más combustible del necesario. Las causas más frecuentes son inyectores sucios o en falla, sensor MAF defectuoso o filtro de aire completamente obstruido. Si no se atiende puede dañar el catalizador.",
    piezas: ["Sensor MAF (flujo de masa de aire)", "Filtro de aire de alto flujo", "Kit de limpieza de inyectores", "Sensor de posición del acelerador"],
    confianza: 91,
  },
  vibra_volante: {
    emoji: "🎯",
    titulo: "Desgaste en sistema de frenos delantero",
    severidad: "alta",
    labelSev: "Urgente",
    categoria: "Frenos",
    desc: "La vibración al frenar es el síntoma clásico de discos deformados por calor excesivo o pastillas con desgaste irregular. Es una condición de seguridad crítica — no se debe postergar la revisión. Revisar también el estado del líquido de frenos.",
    piezas: ["Disco de freno ventilado (par)", "Pastillas de freno delanteras", "Líquido de frenos DOT 4", "Calibrador / pinza de freno (inspección)"],
    confianza: 94,
  },
  no_arranca: {
    emoji: "🔋",
    titulo: "Falla en sistema de arranque o batería",
    severidad: "alta",
    labelSev: "Urgente",
    categoria: "Eléctrico",
    desc: "Si el motor no responde o emite solo un 'clic' al girar la llave, la batería puede estar agotada (< 12.4 V) o el motor de arranque tiene falla mecánica. Verificar primero el voltaje de la batería y la continuidad de los cables antes de reemplazar piezas.",
    piezas: ["Batería 12V 65Ah", "Motor de arranque remanufacturado", "Cable de batería positivo (+)", "Relay / fusible de arranque"],
    confianza: 89,
  },
  luz_check: {
    emoji: "⚠️",
    titulo: "Código OBD detectado — sensor Lambda / emisiones",
    severidad: "baja",
    labelSev: "Leve",
    categoria: "Eléctrico",
    desc: "La luz 'check engine' sin síntomas adicionales frecuentemente corresponde a un fallo en el sensor de oxígeno aguas abajo (códigos P0136–P0141). El vehículo puede seguir circulando con precaución, pero el consumo puede aumentar. Se recomienda escaneo OBD en los próximos días.",
    piezas: ["Sensor de oxígeno Lambda (post-cat)", "Escáner OBD-II (diagnóstico)", "Catalizador (inspección visual)", "Tapa de combustible (verificar sello)"],
    confianza: 83,
  },
  sobrecalenta: {
    emoji: "🌡️",
    titulo: "Falla en sistema de refrigeración",
    severidad: "alta",
    labelSev: "Urgente",
    categoria: "Motor",
    desc: "El sobrecalentamiento puede deformar la culata en minutos. Las causas más comunes son fuga de refrigerante, termostato bloqueado cerrado o bomba de agua en falla. DETENER el vehículo de inmediato si el indicador llega a la zona roja.",
    piezas: ["Termostato 82°C", "Bomba de agua", "Refrigerante 50/50 (2 litros)", "Manguera superior/inferior de radiador"],
    confianza: 96,
  },
  consumo_alto: {
    emoji: "⛽",
    titulo: "Ineficiencia en la combustión",
    severidad: "media",
    labelSev: "Moderada",
    categoria: "Filtros",
    desc: "Un aumento repentino del consumo sin cambios en el manejo suele apuntar a bujías desgastadas, filtro de aire sucio o sensor de temperatura del refrigerante (ECT) con falla. También puede deberse a neumáticos con presión incorrecta.",
    piezas: ["Bujías de iridio (x4)", "Filtro de aire de alto flujo", "Filtro de combustible", "Sensor ECT (temperatura refrigerante)"],
    confianza: 80,
  },
  frenos_chillan: {
    emoji: "🔴",
    titulo: "Pastillas de freno desgastadas",
    severidad: "media",
    labelSev: "Moderada",
    categoria: "Frenos",
    desc: "El chillido al frenar suele venir del indicador metálico de desgaste de la pastilla, que avisa que está cerca del límite. Si no se cambia a tiempo, el desgaste pasa al disco y la reparación se vuelve más cara.",
    piezas: ["Pastillas de freno delanteras", "Disco de freno ventilado (par)", "Líquido de frenos DOT 4"],
    confianza: 88,
  },
  direccion_dura: {
    emoji: "🎯",
    titulo: "Falla en sistema de dirección asistida",
    severidad: "alta",
    labelSev: "Urgente",
    categoria: "Dirección",
    desc: "Un volante duro o pesado, especialmente al estacionar, suele indicar bajo nivel de líquido de dirección hidráulica, una bomba en falla o un terminal de dirección desgastado. Afecta directamente la maniobrabilidad del vehículo.",
    piezas: ["Terminal de dirección", "Caja de dirección", "Caucho de dirección"],
    confianza: 85,
  },
  transmision_patina: {
    emoji: "⚙️",
    titulo: "Desgaste en sistema de transmisión / embrague",
    severidad: "alta",
    labelSev: "Urgente",
    categoria: "Transmisión",
    desc: "Si la caja patina, tarda en entrar el cambio o el embrague se siente esponjoso, el disco de embrague o el aceite de la transmisión probablemente estén al final de su vida útil. Postergar la revisión puede dañar la caja completa.",
    piezas: ["Kit de embrague", "Cable selector de cambios", "Aceite de transmisión (revisión)"],
    confianza: 90,
  },
  escape_ruido: {
    emoji: "💨",
    titulo: "Fuga o desgaste en el sistema de escape",
    severidad: "baja",
    labelSev: "Leve",
    categoria: "Escape",
    desc: "Un escape más ruidoso de lo normal generalmente indica una fuga en una junta, un silenciador perforado por corrosión o un soporte suelto. No es una emergencia, pero conviene revisarlo pronto para evitar fallas en el catalizador.",
    piezas: ["Silenciador (mofle) trasero", "Mofle/escape completo", "Catalizador (inspección)"],
    confianza: 82,
  },
  aire_no_enfria: {
    emoji: "❄️",
    titulo: "Falla en el sistema de aire acondicionado",
    severidad: "media",
    labelSev: "Moderada",
    categoria: "Aire acondicionado",
    desc: "Si el aire sale tibio o con poco flujo, lo más común es una carga baja de refrigerante por una fuga, un filtro de cabina obstruido o un compresor que está fallando. Conviene revisarlo antes de que el compresor se dañe por completo.",
    piezas: ["Compresor de aire acondicionado", "Filtro de cabina (polen)", "Recarga de refrigerante"],
    confianza: 84,
  },
  vibra_carretera: {
    emoji: "🛞",
    titulo: "Desbalance o desgaste irregular de neumáticos",
    severidad: "media",
    labelSev: "Moderada",
    categoria: "Llantas",
    desc: "La vibración a alta velocidad casi siempre se debe a neumáticos desbalanceados, desgaste irregular por mala alineación, o una llanta deformada. Revisar también la presión de inflado antes de un viaje largo.",
    piezas: ["Llanta (reemplazo según desgaste)", "Balanceo y alineación (servicio)"],
    confianza: 86,
  },
  bateria_descarga: {
    emoji: "🔋",
    titulo: "Batería o sistema de carga en falla",
    severidad: "media",
    labelSev: "Moderada",
    categoria: "Eléctrico",
    desc: "Una batería que se descarga seguido puede estar al final de su vida útil, o el alternador no la está cargando correctamente mientras el auto está en marcha. También puede haber un consumo eléctrico parásito con el auto apagado.",
    piezas: ["Batería 12V 65Ah", "Alternador remanufacturado", "Revisión de fusibles y consumo parásito"],
    confianza: 81,
  },
  aceite_fuga: {
    emoji: "🛢️",
    titulo: "Fuga de aceite en motor o transmisión",
    severidad: "alta",
    labelSev: "Urgente",
    categoria: "Motor",
    desc: "Una mancha de aceite debajo del auto suele venir de un retén, la junta del cárter o el filtro de aceite mal sellado. Conducir con nivel de aceite bajo puede causar daño severo al motor en poco tiempo.",
    piezas: ["Filtro de aceite OEM", "Aceite de motor 5W-30", "Junta de cárter (revisión mecánica)"],
    confianza: 88,
  },
};

// ── HISTORIAL DE DIAGNÓSTICOS (sesión) ───────────────────────────────
const historial = [];

// ── EJECUTAR DIAGNÓSTICO ─────────────────────────────────────────────
const ejecutarDiagnostico = () => {
  const sintomaKey = document.getElementById('diag-sintoma')?.value;
  const marca      = document.getElementById('diag-marca')?.value || 'Vehículo';
  const cuando     = document.getElementById('diag-cuando')?.value || '';
  const panel      = document.getElementById('diag-result');
  if (!panel) return;

  if (!sintomaKey) {
    // Estado distinto al idle inicial (borde rojo + mensaje claro) para que
    // se note que SÍ se intentó analizar, en vez de parecer que no pasó nada.
    panel.innerHTML = `
      <div class="diag-idle" style="border:1.5px solid var(--danger);border-radius:10px;padding:16px;">
        <span class="diag-idle__icon">⚠️</span>
        <p style="color:var(--danger);font-weight:700;">Falta seleccionar un síntoma</p>
        <p>Elige una opción en "Síntoma principal" y vuelve a presionar "Analizar problema".</p>
      </div>`;
    document.getElementById('diag-sintoma')?.focus();
    return;
  }

  // Estado de carga animado
  panel.innerHTML = `
    <div class="diag-idle">
      <span class="diag-idle__icon spin">⚙️</span>
      <p style="color:var(--text-secondary);">Analizando con IA… por favor espera.</p>
    </div>`;

  // Simular latencia de procesamiento
  setTimeout(() => {
    const d = diagnosticos[sintomaKey];
    if (!d) return;

    const claseSev = `severity--${d.severidad}`;
    const piezasHtml = d.piezas.map((p) => `<li>${p}</li>`).join('');
    const cuandoHtml = cuando
      ? `<p style="font-size:.8rem;color:var(--text-muted);margin-top:4px;">📍 Ocurre: ${cuando}</p>`
      : '';

    panel.innerHTML = `
      <div class="diag-output">
        <div class="diag-output__head">
          <span class="diag-output__emoji">${d.emoji}</span>
          <div>
            <p class="diag-output__title">${d.titulo}</p>
            <span class="severity ${claseSev}">Prioridad ${d.labelSev}</span>
            <span style="font-size:.72rem;color:var(--text-muted);margin-left:8px;">
              Confianza IA: ${d.confianza}%
            </span>
            ${cuandoHtml}
          </div>
        </div>
        <p class="diag-output__desc">${d.desc}</p>
        <div class="diag-output__parts">
          <h4>Piezas recomendadas para revisar</h4>
          <ul>${piezasHtml}</ul>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:4px;">
          <a href="catalogo.html?categoria=${encodeURIComponent(d.categoria)}" class="btn btn--primary btn--sm">🔧 Ver piezas de ${d.categoria} en catálogo</a>
          <button type="button" class="btn btn--ghost btn--sm" onclick="ejecutarDiagnostico()">🔄 Reanálisis</button>
        </div>
      </div>`;

    // Guardar en historial de sesión
    agregarAlHistorial({ marca, sintoma: sintomaKey, d });

  }, 900);
};

// ── HISTORIAL VISUAL ─────────────────────────────────────────────────
const agregarAlHistorial = ({ marca, sintoma, d }) => {
  historial.unshift({ marca, sintoma, titulo: d.titulo, emoji: d.emoji, severidad: d.severidad, labelSev: d.labelSev, hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) });

  const wrap = document.getElementById('diag-historial-wrap');
  const cont = document.getElementById('diag-historial');
  if (!wrap || !cont) return;

  wrap.style.display = 'block';
  cont.innerHTML = historial.map((h) => `
    <div style="
      background:var(--bg-surface);border:1.5px solid var(--border);
      border-radius:10px;padding:14px 18px;
      display:flex;align-items:center;gap:14px;
      box-shadow:var(--shadow-xs);">
      <span style="font-size:1.6rem;">${h.emoji}</span>
      <div style="flex:1;">
        <p style="font-size:.9rem;font-weight:700;">${h.titulo}</p>
        <p style="font-size:.78rem;color:var(--text-muted);">${h.marca} · ${h.hora}</p>
      </div>
      <span class="severity severity--${h.severidad}">${h.labelSev}</span>
    </div>`).join('');
};

// ── EVENT LISTENERS ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-diagnostico')
    ?.addEventListener('click', ejecutarDiagnostico);
});
