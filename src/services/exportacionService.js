/**
 * SERVICIO DE EXPORTACIÓN
 * Genera el archivo (Excel o PDF) de cualquier resultado de despiece.
 * No depende de React ni del navegador: devuelve bytes + nombre + tipo MIME.
 */
import { construirReporte } from './exportacion/reporteDespiece.js';
import { generarExcel } from './exportacion/excelDespiece.js';
import { generarPdf } from './exportacion/pdfDespiece.js';

const FORMATOS = {
  excel: {
    extension: 'xlsx',
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    generar: generarExcel,
  },
  pdf: { extension: 'pdf', mime: 'application/pdf', generar: generarPdf },
};

/**
 * @param {object} resultado  Resultado del despiece (con ajustes aplicados).
 * @param {'excel'|'pdf'} formato
 * @returns {{ bytes: Uint8Array, nombre: string, mime: string }}
 */
export function exportarDespiece(resultado, formato, fecha = new Date()) {
  const f = FORMATOS[formato];
  if (!f) throw new Error(`Formato de exportación no soportado: ${formato}`);
  const reporte = construirReporte(resultado, fecha);
  return { bytes: f.generar(reporte), nombre: `${reporte.nombreArchivo}.${f.extension}`, mime: f.mime };
}
