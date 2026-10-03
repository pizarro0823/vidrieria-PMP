/** Reporte de despiece → archivo PDF (A4 vertical). */
import { DocumentoPdf } from '../../utils/pdf.js';

const M = 40; // margen
const DER = 555; // borde derecho del contenido
const GRIS = [100, 116, 139];
const OSCURO = [15, 23, 42];
const COLOR_ESTADO = { Ajustado: [180, 83, 9], Calculado: [21, 128, 61], Cantidad: GRIS };

// Columnas: x de inicio (o de fin si alinea a la derecha)
const COL = { pieza: M + 8, cantidad: 262, medida: 290, calculado: 415, estado: DER - 8 };

export function generarPdf(reporte) {
  const doc = new DocumentoPdf();
  const limite = doc.alto - 60;
  let y = encabezado(doc, reporte);

  // Datos generales (3 columnas × 2 filas)
  reporte.datos.forEach(([k, v], i) => {
    const x = M + (i % 3) * 172;
    const fy = y + Math.floor(i / 3) * 34;
    doc.texto(x, fy, k.toUpperCase(), { tam: 7.5, rgb: GRIS });
    doc.texto(x, fy + 14, v, { tam: 11, negrita: true });
  });
  y += 78;

  const encabezadoTabla = () => {
    doc.texto(COL.pieza, y + 13, 'PIEZA', { tam: 7.5, rgb: GRIS });
    doc.texto(COL.cantidad, y + 13, 'CANT.', { tam: 7.5, rgb: GRIS, alinear: 'der' });
    doc.texto(COL.medida, y + 13, 'MEDIDA DE CORTE', { tam: 7.5, rgb: GRIS });
    doc.texto(COL.calculado, y + 13, 'CALCULADO', { tam: 7.5, rgb: GRIS });
    doc.texto(COL.estado, y + 13, 'ESTADO', { tam: 7.5, rgb: GRIS, alinear: 'der' });
    doc.linea(M, y + 19, DER, y + 19);
    y += 19;
  };

  const saltoSiNecesario = (alto, conEncabezado) => {
    if (y + alto <= limite) return;
    doc.nuevaPagina();
    y = 50;
    if (conEncabezado) encabezadoTabla();
  };

  for (const grupo of reporte.grupos) {
    saltoSiNecesario(20 + 19 + 24, false);
    doc.rect(M, y, DER - M, 20, [226, 232, 240]);
    doc.texto(M + 8, y + 13.5, grupo.titulo, { tam: 9.5, negrita: true });
    y += 20;
    encabezadoTabla();

    for (const f of grupo.filas) {
      const alto = f.esVidrio ? 32 : 24;
      saltoSiNecesario(alto, true);
      if (f.ajustado) doc.rect(M, y, DER - M, alto, [254, 243, 199]);
      doc.texto(COL.pieza, y + 16, f.pieza, { tam: 10 });
      doc.texto(COL.cantidad, y + 16, String(f.cantidad), { tam: 11, negrita: true, alinear: 'der' });
      doc.texto(COL.medida, y + 16, f.medidaTexto, { tam: 11, negrita: true });
      doc.texto(COL.calculado, y + 16, f.calculadoTexto, { tam: 10, rgb: GRIS });
      doc.texto(COL.estado, y + 16, f.estado, { tam: 8.5, negrita: true, rgb: COLOR_ESTADO[f.estado], alinear: 'der' });
      if (f.esVidrio) doc.texto(COL.medida, y + 27, 'alto × ancho', { tam: 7.5, rgb: GRIS });
      doc.linea(M, y + alto, DER, y + alto, { rgb: [226, 232, 240] });
      y += alto;
    }
    y += 16;
  }

  // Notas
  for (const nota of reporte.notas) {
    for (const linea of partirTexto(doc, nota, DER - M, 8)) {
      saltoSiNecesario(12, false);
      doc.texto(M, y, linea, { tam: 8, rgb: GRIS });
      y += 12;
    }
  }

  // Pie de página en todas las hojas
  const total = doc.paginas.length;
  doc.paginas.forEach((ops, i) => {
    doc.ops = ops;
    doc.linea(M, doc.alto - 40, DER, doc.alto - 40);
    doc.texto(M, doc.alto - 28, `${reporte.empresa} · ${reporte.titulo} · ${reporte.fecha}`, { tam: 7.5, rgb: GRIS });
    doc.texto(DER, doc.alto - 28, `Página ${i + 1} de ${total}`, { tam: 7.5, rgb: GRIS, alinear: 'der' });
  });

  return doc.generar();
}

function encabezado(doc, r) {
  doc.rect(M, 34, 4, 30, [37, 99, 235]);
  doc.texto(M + 12, 50, r.empresa, { tam: 17, negrita: true, rgb: OSCURO });
  doc.texto(M + 12, 63, r.subtitulo, { tam: 8.5, rgb: GRIS });
  doc.texto(DER, 50, r.titulo, { tam: 13, negrita: true, alinear: 'der' });
  doc.texto(DER, 63, r.fecha, { tam: 8.5, rgb: GRIS, alinear: 'der' });
  doc.linea(M, 78, DER, 78);
  return 100;
}

function partirTexto(doc, texto, ancho, tam) {
  const lineas = [];
  let actual = '';
  for (const palabra of texto.split(' ')) {
    const prueba = actual ? `${actual} ${palabra}` : palabra;
    if (doc.anchoTexto(prueba, tam) > ancho && actual) {
      lineas.push(actual);
      actual = palabra;
    } else actual = prueba;
  }
  if (actual) lineas.push(actual);
  return lineas;
}
