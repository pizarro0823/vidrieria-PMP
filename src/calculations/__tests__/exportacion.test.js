/** Pruebas de exportación a Excel y PDF. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VENTANA_744 } from '../../data/reglas/ventanas/ventana744.js';
import { calcularDespieceProducto } from '../../services/despieceService.js';
import { exportarDespiece } from '../../services/exportacionService.js';
import { formatMedida, formatDimensiones, parseDecimal } from '../../utils/formato.js';

const entrada = {
  naves: 2, base: 1.417, altura: 1.53,
  color: { id: 'negro', nombre: 'Negro' }, vidrio: { id: 'transparente', nombre: 'Transparente' },
};
const FECHA = new Date(2026, 8, 30, 10, 5);

test('Medidas: 2 decimales y milímetro elevado', () => {
  assert.equal(formatMedida(1.257), '1.25⁷ m');
  assert.equal(formatMedida(1.417), '1.41⁷ m');
  assert.equal(formatMedida(0.706), '0.70⁶ m');
  assert.equal(formatMedida(0.58), '0.58 m');
  assert.equal(formatMedida(1.53), '1.53 m');
  assert.equal(formatMedida(2.0), '2.00 m');
  assert.equal(formatDimensiones({ alto: 1.438, ancho: 0.654 }), '1.43⁸ × 0.65⁴ m');
  assert.equal(parseDecimal('1.25⁷'), 1.257);
  assert.equal(parseDecimal('1,257'), 1.257);
});

test('Exporta Excel (.xlsx)', () => {
  const { resultado } = calcularDespieceProducto(VENTANA_744, entrada, { jamba: 1.515 });
  const r = exportarDespiece(resultado, 'excel', FECHA);
  assert.equal(r.nombre, 'despiece_ventana-7-44_2naves_1.417x1.530_2026-09-30.xlsx');
  assert.equal(String.fromCharCode(r.bytes[0], r.bytes[1]), 'PK');
});

test('Exporta PDF', () => {
  const { resultado } = calcularDespieceProducto(VENTANA_744, entrada);
  const r = exportarDespiece(resultado, 'pdf', FECHA);
  assert.equal(r.nombre, 'despiece_ventana-7-44_2naves_1.417x1.530_2026-09-30.pdf');
  assert.equal(String.fromCharCode(...r.bytes.slice(0, 5)), '%PDF-');
});
