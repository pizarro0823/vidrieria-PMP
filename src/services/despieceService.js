/**
 * SERVICIO DE DESPIECE
 * Punto único que usa la UI: valida → busca reglas → calcula → aplica ajustes.
 * Sirve para cualquier producto (ventanas, puertas, garajes).
 */
import { validarEntrada } from '../calculations/engine/validaciones.js';
import { calcularDespiece, obtenerConfiguracion } from '../calculations/engine/despieceEngine.js';
import { aplicarAjustes } from '../calculations/engine/ajustes.js';
import { normalizarMedida } from '../calculations/engine/unidades.js';
import { formatMedida } from '../utils/formato.js';

/**
 * @param {object} producto
 * @param {object} entrada  { base, altura, naves, color, vidrio }
 * @param {object} ajustes  mapa de ajustes manuales
 * @returns {{ ok: boolean, errores: object, advertencias: string[], avisos: string[], resultado: object|null }}
 *   avisos: conversiones de unidad hechas (ej. "Base: 97 cm = 0.97 m").
 */
export function calcularDespieceProducto(producto, entradaOriginal, ajustes = {}) {
  // Medidas escritas en cm o mm se pasan a metros (97 → 0.97 m)
  const avisos = [];
  const entrada = { ...entradaOriginal };
  for (const [campo, etiqueta] of [['base', 'Base'], ['altura', 'Altura']]) {
    const n = normalizarMedida(entradaOriginal[campo]);
    if (n.escrito !== undefined) avisos.push(`${etiqueta}: escribiste ${n.escrito} → se tomó como ${n.escrito} ${n.unidad} = ${formatMedida(n.valor)}`);
    entrada[campo] = n.valor;
  }

  const { valido, errores, advertencias } = validarEntrada(producto, entrada);
  if (!valido) return { ok: false, errores, advertencias, avisos, resultado: null };

  const config = obtenerConfiguracion(producto, entrada.naves);

  try {
    const calculado = calcularDespiece(producto, config, entrada);
    return { ok: true, errores: {}, advertencias, avisos, resultado: aplicarAjustes(calculado, ajustes) };
  } catch (e) {
    return { ok: false, errores: { reglas: e.message }, advertencias, avisos, resultado: null };
  }
}
