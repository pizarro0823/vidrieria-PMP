/** Reporte de despiece → archivo Excel (.xlsx). */
import { crearXlsx } from '../../utils/xlsx.js';

const COLUMNAS = ['Pieza', 'Cantidad', 'Medida de corte (m)', 'Calculado (m)', 'Estado', 'Fórmula'];

export function generarExcel(reporte) {
  const filas = [];
  const combinadas = [];
  const combinar = () => combinadas.push(`A${filas.length}:F${filas.length}`);

  filas.push([{ v: `${reporte.empresa} — ${reporte.titulo}`, estilo: 'titulo' }]);
  combinar();
  filas.push([{ v: `${reporte.subtitulo} · Generado: ${reporte.fecha}`, estilo: 'gris' }]);
  combinar();
  filas.push([]);

  for (const [k, v] of reporte.datos) filas.push([{ v: k, estilo: 'negrita' }, v]);
  filas.push([]);

  for (const grupo of reporte.grupos) {
    filas.push(COLUMNAS.map((_, i) => ({ v: i === 0 ? grupo.titulo : '', estilo: 'grupo' })));
    filas.push(COLUMNAS.map((c) => ({ v: c, estilo: 'encabezado' })));
    for (const f of grupo.filas) {
      const texto = f.ajustado ? 'ajustado' : 'texto';
      const medidaEstilo = f.ajustado ? 'ajustadoMedida' : 'medidaNegrita';
      filas.push([
        { v: f.pieza, estilo: texto },
        { v: f.cantidad, estilo: 'cantidad' },
        { v: f.medida ?? '—', estilo: medidaEstilo },
        { v: f.calculado ?? '—', estilo: 'medida' },
        { v: f.estado, estilo: texto },
        { v: f.formula, estilo: 'texto' },
      ]);
    }
    filas.push([]);
  }

  for (const nota of reporte.notas) {
    filas.push([{ v: nota, estilo: 'gris' }]);
    combinar();
  }

  return crearXlsx({
    nombreHoja: 'Despiece',
    filas,
    anchos: [26, 11, 21, 17, 12, 48],
    combinadas,
  });
}
