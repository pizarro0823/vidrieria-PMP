/**
 * Formato de medidas. Todas las medidas se manejan en METROS.
 *
 * Se MUESTRAN con 2 decimales (metros y centímetros) y el milímetro elevado:
 *   1.257 m → "1.25⁷ m"   (1 metro, 25 centímetros, 7 milímetros)
 *   0.580 m → "0.58 m"    (sin milímetros no se muestra el elevado)
 *
 * Los campos de edición usan el número plano (1.257) con formatNumero().
 */

const SUPERINDICES = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/** Acepta "1.417", "1,417" o números. Devuelve NaN si no es válido y null si está vacío. */
export function parseDecimal(valor) {
  if (valor === null || valor === undefined) return null;
  if (typeof valor === 'number') return valor;
  const limpio = String(valor)
    .trim()
    .replace(',', '.')
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => String(SUPERINDICES.indexOf(c)));
  if (limpio === '') return null;
  if (!/^-?\d*\.?\d+$|^-?\d+\.$/.test(limpio)) return NaN;
  return Number(limpio);
}

/** Número plano para campos de edición: 1.257 → "1.257" */
export function formatNumero(valorM) {
  if (valorM == null) return '';
  return valorM.toFixed(3);
}

/** Metros con 2 decimales y milímetro elevado: 1.257 → "1.25⁷" · 0.58 → "0.58" */
export function formatMetros(valorM) {
  if (valorM == null) return '';
  const mm = Math.round(Math.abs(valorM) * 1000);
  const signo = valorM < 0 && mm > 0 ? '-' : '';
  const metros = Math.floor(mm / 1000);
  const cm = String(Math.floor((mm % 1000) / 10)).padStart(2, '0');
  const milimetro = mm % 10;
  return `${signo}${metros}.${cm}${milimetro ? SUPERINDICES[milimetro] : ''}`;
}

/** 1.257 → "1.25⁷ m" */
export function formatMedida(valorM) {
  if (valorM == null) return '—';
  return `${formatMetros(valorM)} m`;
}

/** { alto, ancho } → "1.43⁸ × 0.65⁴ m" */
export function formatDimensiones(dims) {
  if (!dims) return '—';
  return `${formatMetros(dims.alto)} × ${formatMetros(dims.ancho)} m`;
}

/** Texto de la medida de una pieza (simple o alto × ancho). */
export function formatMedidaPieza(valor) {
  if (valor == null) return '—';
  return typeof valor === 'object' ? formatDimensiones(valor) : formatMedida(valor);
}

/** Diferencia firmada: +0.00⁴ m / −0.01² m */
export function formatDiferencia(difM) {
  if (!difM || Math.round(Math.abs(difM) * 1000) === 0) return '0.00 m';
  return `${difM > 0 ? '+' : '−'}${formatMetros(Math.abs(difM))} m`;
}

/** Texto legible de una fórmula: { ref:'BASE', sumar:-0.005, dividir:2 } → "(Base − 0.00⁵ m) ÷ 2" */
export function describirFormula(formula, nombresPiezas = {}) {
  if (!formula) return '';
  if (!('ref' in formula)) {
    return Object.entries(formula)
      .map(([dim, f]) => `${capitalizar(dim)}: ${describirFormula(f, nombresPiezas)}`)
      .join(' · ');
  }
  const { ref, sumar = 0, dividir = 1 } = formula;
  if (ref === 'FIJO') return `Medida fija ${formatMetros(sumar)} m`;
  let nombre = ref === 'BASE' ? 'Base' : ref === 'ALTURA' ? 'Altura' : ref;
  if (ref.startsWith('pieza:')) nombre = nombresPiezas[ref.slice(6)] ?? ref.slice(6);

  let texto = nombre;
  if (sumar) texto += ` ${sumar < 0 ? '−' : '+'} ${formatMetros(Math.abs(sumar))} m`;
  if (dividir !== 1) texto = `${sumar ? `(${texto})` : texto} ÷ ${dividir}`;
  return texto;
}

/** Nombre visible de un ítem de catálogo (color / vidrio), incluida la opción "Otro". */
export function nombreCatalogo(item) {
  if (!item) return '—';
  return item.requiereDescripcion ? item.descripcion?.trim() || item.nombre : item.nombre;
}

function capitalizar(t) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}
