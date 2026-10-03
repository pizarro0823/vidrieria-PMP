/**
 * REGLAS DE DESPIECE — VENTANA MONUMENTAL
 * Fuente: un ejemplo de 3 naves (Base 2.90⁵ × Altura 2.72²).
 * 2 y 4 naves (01/10/2026): mismas medidas de la de 3 naves; los socalos se dividen entre 2 o 4
 *   (Base + 0.06⁸) ÷ naves, 2 socalos por nave. Cantidades de translapes/enganches por confirmar.
 * 3 naves: el ejemplo no trae vidrio, rodamientos ni guías; no se agregan hasta confirmarlos.
 */
import { PERFIL, base, altura } from '../formulas.js';

const NOTA_CANTIDAD = 'Cantidad deducida a partir de la de 3 naves. Confirmar.';

export const VENTANA_MONUMENTAL = {
  id: 'ventana-monumental',
  nombre: 'Ventana Monumental',
  categoria: 'ventanas',
  habilitado: true,
  usaNaves: true,
  usaVidrio: true,
  usaAluminio: true,
  versionReglas: 1,

  configuraciones: {
    // 2 NAVES — pedido por Daniel Gil (01/10/2026), a partir de la de 3 naves.
    2: {
      naves: 2,
      estado: 'por_confirmar',
      pendiente:
        'Medidas tomadas de la Monumental de 3 naves con socalos = (Base + 0.06⁸ m) ÷ 2. Confirmar cantidades de translapes y enganches. Faltan vidrio, rodamientos y guías.',
      ejemplos: [
        {
          // Ejemplo de referencia calculado con la regla (no medido en taller).
          base: 1.906,
          altura: 2.2,
          esperado: {
            cabezal: [1, 1.906], sillar: [1, 1.906], jamba: [2, 2.185],
            translape_fijo: [1, 2.17], translape_movil: [1, 2.165],
            enganche_fijo: [1, 2.17], enganche_movil: [1, 2.165],
            socalo: [4, 0.987],
          },
        },
      ],
      piezas: [
        { codigo: 'cabezal', nombre: 'Cabezal', tipo: PERFIL, cantidad: 1, medida: base() },
        { codigo: 'sillar', nombre: 'Sillar', tipo: PERFIL, cantidad: 1, medida: base() },
        { codigo: 'jamba', nombre: 'Jamba', tipo: PERFIL, cantidad: 2, medida: altura(-0.015) },
        { codigo: 'translape_fijo', nombre: 'Translape fijo', tipo: PERFIL, cantidad: 1, medida: altura(-0.03), nota: NOTA_CANTIDAD },
        { codigo: 'translape_movil', nombre: 'Translape móvil', tipo: PERFIL, cantidad: 1, medida: altura(-0.035), nota: NOTA_CANTIDAD },
        { codigo: 'enganche_fijo', nombre: 'Enganche fijo', tipo: PERFIL, cantidad: 1, medida: altura(-0.03), nota: NOTA_CANTIDAD },
        { codigo: 'enganche_movil', nombre: 'Enganche móvil', tipo: PERFIL, cantidad: 1, medida: altura(-0.035), nota: NOTA_CANTIDAD },
        { codigo: 'socalo', nombre: 'Socalos', tipo: PERFIL, cantidad: 4, medida: base(0.068, 2) },
      ],
    },

    3: {
      naves: 3,
      estado: 'por_confirmar',
      pendiente:
        'Reglas deducidas de un solo ejemplo. Faltan vidrio, rodamientos y guías. Socalos = (Base + 0.06⁸ m) ÷ 3.',
      ejemplos: [
        {
          base: 2.905,
          altura: 2.722,
          esperado: {
            cabezal: [1, 2.905], sillar: [1, 2.905], jamba: [2, 2.707],
            translape_fijo: [1, 2.692], translape_movil: [1, 2.687],
            enganche_fijo: [1, 2.692], enganche_movil: [3, 2.687],
            socalo: [6, 0.991],
          },
        },
      ],
      piezas: [
        { codigo: 'cabezal', nombre: 'Cabezal', tipo: PERFIL, cantidad: 1, medida: base() },
        { codigo: 'sillar', nombre: 'Sillar', tipo: PERFIL, cantidad: 1, medida: base() },
        { codigo: 'jamba', nombre: 'Jamba', tipo: PERFIL, cantidad: 2, medida: altura(-0.015) },
        { codigo: 'translape_fijo', nombre: 'Translape fijo', tipo: PERFIL, cantidad: 1, medida: altura(-0.03) },
        { codigo: 'translape_movil', nombre: 'Translape móvil', tipo: PERFIL, cantidad: 1, medida: altura(-0.035) },
        { codigo: 'enganche_fijo', nombre: 'Enganche fijo', tipo: PERFIL, cantidad: 1, medida: altura(-0.03) },
        { codigo: 'enganche_movil', nombre: 'Enganche móvil', tipo: PERFIL, cantidad: 3, medida: altura(-0.035) },
        { codigo: 'socalo', nombre: 'Socalos', tipo: PERFIL, cantidad: 6, medida: base(0.068, 3) },
      ],
    },

    // 4 NAVES — pedido por Daniel Gil (01/10/2026), a partir de la de 3 naves.
    4: {
      naves: 4,
      estado: 'por_confirmar',
      pendiente:
        'Medidas tomadas de la Monumental de 3 naves con socalos = (Base + 0.06⁸ m) ÷ 4. Confirmar cantidades de translapes y enganches. Faltan vidrio, rodamientos y guías.',
      ejemplos: [
        {
          // Ejemplo de referencia calculado con la regla (no medido en taller).
          base: 3.912,
          altura: 2.5,
          esperado: {
            cabezal: [1, 3.912], sillar: [1, 3.912], jamba: [2, 2.485],
            translape_fijo: [2, 2.47], translape_movil: [2, 2.465],
            enganche_fijo: [2, 2.47], enganche_movil: [2, 2.465],
            socalo: [8, 0.995],
          },
        },
      ],
      piezas: [
        { codigo: 'cabezal', nombre: 'Cabezal', tipo: PERFIL, cantidad: 1, medida: base() },
        { codigo: 'sillar', nombre: 'Sillar', tipo: PERFIL, cantidad: 1, medida: base() },
        { codigo: 'jamba', nombre: 'Jamba', tipo: PERFIL, cantidad: 2, medida: altura(-0.015) },
        { codigo: 'translape_fijo', nombre: 'Translape fijo', tipo: PERFIL, cantidad: 2, medida: altura(-0.03), nota: NOTA_CANTIDAD },
        { codigo: 'translape_movil', nombre: 'Translape móvil', tipo: PERFIL, cantidad: 2, medida: altura(-0.035), nota: NOTA_CANTIDAD },
        { codigo: 'enganche_fijo', nombre: 'Enganche fijo', tipo: PERFIL, cantidad: 2, medida: altura(-0.03), nota: NOTA_CANTIDAD },
        { codigo: 'enganche_movil', nombre: 'Enganche móvil', tipo: PERFIL, cantidad: 2, medida: altura(-0.035), nota: NOTA_CANTIDAD },
        { codigo: 'socalo', nombre: 'Socalos', tipo: PERFIL, cantidad: 8, medida: base(0.068, 4) },
      ],
    },
  },
};
