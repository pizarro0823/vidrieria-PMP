/**
 * Interpreta la unidad de una medida escrita por el usuario.
 * Ninguna ventana, puerta o garaje mide 10 m o más, así que:
 *   menos de 10   → metros        (2.74)
 *   10 a 999      → centímetros   (274  → 2.74 m)
 *   1000 o más    → milímetros    (2740 → 2.74 m)
 */
import { CONFIG_CALCULO } from '../../data/config/calculo.js';
import { redondear } from './despieceEngine.js';

export function normalizarMedida(valor) {
  if (typeof valor !== 'number' || !Number.isFinite(valor) || valor <= 0) return { valor, unidad: 'm' };
  if (valor >= CONFIG_CALCULO.desdeMilimetros) return { valor: redondear(valor / 1000), unidad: 'mm', escrito: valor };
  if (valor >= CONFIG_CALCULO.desdeCentimetros) return { valor: redondear(valor / 100), unidad: 'cm', escrito: valor };
  return { valor, unidad: 'm' };
}
