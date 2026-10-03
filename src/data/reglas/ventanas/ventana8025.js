/**
 * REGLAS DE DESPIECE — VENTANA 80-25
 * 2 naves: reglas corregidas por Daniel Gil (01/10/2026) con una ventana de 2.00⁵ × 1.73⁸:
 *   translape y enganche = Altura − 0.02⁶ · socalos = (Base − 0.00⁹) ÷ 2
 *   vidrio alto = translape − 0.08 · vidrio ancho = socalo − 0.05⁶
 * (El primer ejemplo del documento, 1.17⁵ × 1.57⁵, daba 1–2 mm distinto: se reemplazó por esta corrección.)
 * 4 naves: misma regla de 2 naves con socalos ÷ 4 y 4 vidrios (indicado por Daniel Gil, 01/10/2026).
 */
import { PERFIL, HERRAJE, VIDRIO, base, altura, pieza } from '../formulas.js';

export const VENTANA_8025 = {
  id: 'ventana-8025',
  nombre: 'Ventana 80-25',
  categoria: 'ventanas',
  habilitado: true,
  usaNaves: true,
  usaVidrio: true,
  usaAluminio: true,
  versionReglas: 2,

  configuraciones: {
    2: {
      naves: 2,
      estado: 'confirmada',
      ejemplos: [
        {
          base: 2.005,
          altura: 1.738,
          esperado: {
            cabezal: [1, 2.005], sillar: [1, 2.005], jamba: [2, 1.727],
            translape: [2, 1.712], enganche: [2, 1.712],
            socalo_superior: [2, 0.998], socalo_inferior: [2, 0.998],
            rodamiento: [2, null], guia_superior: [4, null], guia_inferior: [4, null],
            vidrio: [2, { alto: 1.632, ancho: 0.942 }],
          },
        },
      ],
      piezas: [
        { codigo: 'cabezal', nombre: 'Cabezal', tipo: PERFIL, cantidad: 1, medida: base() },
        { codigo: 'sillar', nombre: 'Sillar', tipo: PERFIL, cantidad: 1, medida: base() },
        { codigo: 'jamba', nombre: 'Jamba', tipo: PERFIL, cantidad: 2, medida: altura(-0.011) },
        { codigo: 'translape', nombre: 'Translape', tipo: PERFIL, cantidad: 2, medida: altura(-0.026) },
        { codigo: 'enganche', nombre: 'Enganche', tipo: PERFIL, cantidad: 2, medida: altura(-0.026) },
        { codigo: 'socalo_superior', nombre: 'Socalo superior', tipo: PERFIL, cantidad: 2, medida: base(-0.009, 2) },
        { codigo: 'socalo_inferior', nombre: 'Socalo inferior', tipo: PERFIL, cantidad: 2, medida: base(-0.009, 2) },
        { codigo: 'rodamiento', nombre: 'Rodamientos', tipo: HERRAJE, cantidad: 2 },
        { codigo: 'guia_superior', nombre: 'Guías superiores', tipo: HERRAJE, cantidad: 4 },
        { codigo: 'guia_inferior', nombre: 'Guías inferiores', tipo: HERRAJE, cantidad: 4 },
        {
          codigo: 'vidrio', nombre: 'Vidrio', tipo: VIDRIO, cantidad: 2,
          dimensiones: { alto: pieza('translape', -0.08), ancho: pieza('socalo_superior', -0.056) },
        },
      ],
    },

    // 4 NAVES — indicado por Daniel Gil (01/10/2026): mismas reglas de 2 naves, socalos ÷ 4 y 4 vidrios.
    // Cantidades de translape/enganche (4), rodamientos (4) y guías (8) tomadas de la 7-44 de 4 naves.
    4: {
      naves: 4,
      estado: 'por_confirmar',
      pendiente:
        'Medidas según la regla de 2 naves con socalos ÷ 4. Confirmar cantidades: translape 4, enganche 4, rodamientos 4, guías 8 + 8 (tomadas de la 7-44 de 4 naves).',
      ejemplos: [
        {
          // Ejemplo de referencia calculado con la regla (no medido en taller).
          base: 3.005,
          altura: 1.738,
          esperado: {
            cabezal: [1, 3.005], sillar: [1, 3.005], jamba: [2, 1.727],
            translape: [4, 1.712], enganche: [4, 1.712],
            socalo_superior: [4, 0.749], socalo_inferior: [4, 0.749],
            rodamiento: [4, null], guia_superior: [8, null], guia_inferior: [8, null],
            vidrio: [4, { alto: 1.632, ancho: 0.693 }],
          },
        },
      ],
      piezas: [
        { codigo: 'cabezal', nombre: 'Cabezal', tipo: PERFIL, cantidad: 1, medida: base() },
        { codigo: 'sillar', nombre: 'Sillar', tipo: PERFIL, cantidad: 1, medida: base() },
        { codigo: 'jamba', nombre: 'Jamba', tipo: PERFIL, cantidad: 2, medida: altura(-0.011) },
        { codigo: 'translape', nombre: 'Translape', tipo: PERFIL, cantidad: 4, medida: altura(-0.026) },
        { codigo: 'enganche', nombre: 'Enganche', tipo: PERFIL, cantidad: 4, medida: altura(-0.026) },
        { codigo: 'socalo_superior', nombre: 'Socalo superior', tipo: PERFIL, cantidad: 4, medida: base(-0.009, 4) },
        { codigo: 'socalo_inferior', nombre: 'Socalo inferior', tipo: PERFIL, cantidad: 4, medida: base(-0.009, 4) },
        { codigo: 'rodamiento', nombre: 'Rodamientos', tipo: HERRAJE, cantidad: 4 },
        { codigo: 'guia_superior', nombre: 'Guías superiores', tipo: HERRAJE, cantidad: 8 },
        { codigo: 'guia_inferior', nombre: 'Guías inferiores', tipo: HERRAJE, cantidad: 8 },
        {
          codigo: 'vidrio', nombre: 'Vidrio', tipo: VIDRIO, cantidad: 4,
          dimensiones: { alto: pieza('translape', -0.08), ancho: pieza('socalo_superior', -0.056) },
        },
      ],
    },
  },
};
