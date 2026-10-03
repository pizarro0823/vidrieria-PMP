/**
 * Convierte un resultado de despiece en un reporte neutro (sin formato de archivo).
 * Excel y PDF se generan a partir de este mismo reporte, así siempre muestran lo mismo.
 */
import { agruparPiezas } from '../../utils/agruparPiezas.js';
import { describirFormula, formatMedida, formatMedidaPieza, formatMetros, formatNumero, nombreCatalogo } from '../../utils/formato.js';

export function construirReporte(resultado, fecha = new Date()) {
  const nombres = Object.fromEntries(resultado.piezas.map((p) => [p.codigo, p.nombre]));

  const grupos = agruparPiezas(resultado).map((g) => ({
    titulo: g.detalle ? `${g.titulo} · ${g.detalle}` : g.titulo,
    filas: g.piezas.map((p) => ({
      pieza: p.nota ? `${p.nombre} *` : p.nombre,
      cantidad: p.cantidad,
      // texto con milímetro elevado (1.25⁷); null para herrajes
      medida: valorExportable(p.medida),
      calculado: valorExportable(p.medidaCalculada),
      medidaTexto: formatMedidaPieza(p.medida),
      calculadoTexto: p.formula ? formatMedidaPieza(p.medidaCalculada) : '—',
      estado: !p.formula ? 'Cantidad' : p.ajustado ? 'Ajustado' : 'Calculado',
      ajustado: p.ajustado,
      formula: p.formula ? describirFormula(p.formula, nombres) : '',
      esVidrio: p.tipo === 'vidrio',
    })),
  }));

  const piezasAjustadas = resultado.piezas.filter((p) => p.ajustado).length;
  const notas = ['Medidas en metros: 1.25⁷ m = 1 metro, 25 centímetros, 7 milímetros (el número elevado son los milímetros). Vidrio: alto × ancho.'];
  if (piezasAjustadas) notas.push(`${piezasAjustadas} pieza(s) con ajuste manual: la medida de corte es la ajustada.`);
  if (resultado.estadoReglas === 'por_confirmar' && resultado.notaReglas) {
    notas.push(`Regla pendiente de confirmar: ${resultado.notaReglas}`);
  }
  // Notas por pieza (*), agrupadas por texto
  const porNota = new Map();
  for (const p of resultado.piezas.filter((x) => x.nota)) {
    const lista = porNota.get(p.nota) ?? [];
    lista.push(`${p.nombre} ${formatMedidaPieza(p.medidaCalculada)}`);
    porNota.set(p.nota, lista);
  }
  for (const [nota, piezas] of porNota) notas.push(`* ${piezas.join(', ')}: ${nota}`);

  return {
    empresa: 'DANIEL GIL',
    subtitulo: 'Cotizador de Aluminio y Vidrio',
    titulo: 'Despiece de producción',
    fecha: formatFecha(fecha),
    datos: [
      ['Producto', resultado.producto],
      ...(resultado.naves ? [['Naves', String(resultado.naves)]] : []),
      ['Base', formatMedida(resultado.base)],
      ['Altura', formatMedida(resultado.altura)],
      ['Color aluminio', nombreCatalogo(resultado.color)],
      ...(resultado.vidrio ? [['Tipo de vidrio', nombreCatalogo(resultado.vidrio)]] : []),
    ],
    grupos,
    notas,
    nombreArchivo: nombreArchivo(resultado, fecha),
  };
}

/** Medida para la celda de Excel, mismo formato que la pantalla (1.25⁷ · 1.43⁸ × 0.65⁴). */
function valorExportable(valor) {
  if (valor == null) return null;
  if (typeof valor === 'number') return formatMetros(valor);
  return `${formatMetros(valor.alto)} × ${formatMetros(valor.ancho)}`;
}

function formatFecha(f) {
  const d = (n) => String(n).padStart(2, '0');
  return `${d(f.getDate())}/${d(f.getMonth() + 1)}/${f.getFullYear()} ${d(f.getHours())}:${d(f.getMinutes())}`;
}

function nombreArchivo(r, f) {
  const d = (n) => String(n).padStart(2, '0');
  const producto = r.producto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-');
  const naves = r.naves ? `_${r.naves}naves` : '';
  return `despiece_${producto}${naves}_${formatNumero(r.base)}x${formatNumero(r.altura)}_${f.getFullYear()}-${d(f.getMonth() + 1)}-${d(f.getDate())}`;
}
