/**
 * REGLAS DE DESPIECE — VENTANA 7-44
 * Fuente: ejemplos entregados por Daniel Gil.
 * - 2 naves: confirmada (30/09/2026).
 * - 4 naves: confirmada (30/09/2026). Translape y enganche = Altura − 0.02³ m (igual que 2 naves).
 * NO modificar sin confirmación del negocio.
 */
import { PERFIL, HERRAJE, VIDRIO, base, altura, pieza } from '../formulas.js';

export const VENTANA_744 = {
  id: 'ventana-744',
  nombre: 'Ventana 7-44',
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
          base: 1.417,
          altura: 1.53,
          esperado: {
            cabezal: [1, 1.417], sillar: [1, 1.417], jamba: [2, 1.519],
            translape: [2, 1.507], enganche: [2, 1.507],
            socalo_superior: [2, 0.706], socalo_inferior: [2, 0.706],
            rodamiento: [2, null], guia_superior: [4, null], guia_inferior: [4, null],
            vidrio: [2, { alto: 1.438, ancho: 0.654 }],
          },
        },
      ],
      piezas: [
        { codigo: 'cabezal', nombre: 'Cabezal', tipo: PERFIL, cantidad: 1, medida: base() },
        { codigo: 'sillar', nombre: 'Sillar', tipo: PERFIL, cantidad: 1, medida: base() },
        { codigo: 'jamba', nombre: 'Jamba', tipo: PERFIL, cantidad: 2, medida: altura(-0.011) },
        { codigo: 'translape', nombre: 'Translape', tipo: PERFIL, cantidad: 2, medida: altura(-0.023) },
        { codigo: 'enganche', nombre: 'Enganche', tipo: PERFIL, cantidad: 2, medida: altura(-0.023) },
        { codigo: 'socalo_superior', nombre: 'Socalo superior', tipo: PERFIL, cantidad: 2, medida: base(-0.005, 2) },
        { codigo: 'socalo_inferior', nombre: 'Socalo inferior', tipo: PERFIL, cantidad: 2, medida: base(-0.005, 2) },
        { codigo: 'rodamiento', nombre: 'Rodamientos', tipo: HERRAJE, cantidad: 2 },
        { codigo: 'guia_superior', nombre: 'Guías superiores', tipo: HERRAJE, cantidad: 4 },
        { codigo: 'guia_inferior', nombre: 'Guías inferiores', tipo: HERRAJE, cantidad: 4 },
        {
          codigo: 'vidrio', nombre: 'Vidrio', tipo: VIDRIO, cantidad: 2,
          dimensiones: { alto: pieza('translape', -0.069), ancho: pieza('socalo_superior', -0.052) },
        },
      ],
    },

    4: {
      naves: 4,
      estado: 'confirmada',
      ejemplos: [
        {
          base: 2.315,
          altura: 1.45,
          // Translape y enganche corregidos por Daniel Gil: 1.42⁷ m (el ejemplo original decía 1.43⁹).
          esperado: {
            cabezal: [1, 2.315], sillar: [1, 2.315], jamba: [2, 1.439],
            translape: [4, 1.427], enganche: [4, 1.427],
            socalo_superior: [4, 0.58], socalo_inferior: [4, 0.58],
            rodamiento: [4, null], guia_superior: [8, null], guia_inferior: [8, null],
            vidrio: [4, { alto: 1.358, ancho: 0.528 }],
          },
        },
      ],
      piezas: [
        { codigo: 'cabezal', nombre: 'Cabezal', tipo: PERFIL, cantidad: 1, medida: base() },
        { codigo: 'sillar', nombre: 'Sillar', tipo: PERFIL, cantidad: 1, medida: base() },
        { codigo: 'jamba', nombre: 'Jamba', tipo: PERFIL, cantidad: 2, medida: altura(-0.011) },
        { codigo: 'translape', nombre: 'Translape', tipo: PERFIL, cantidad: 4, medida: altura(-0.023) },
        { codigo: 'enganche', nombre: 'Enganche', tipo: PERFIL, cantidad: 4, medida: altura(-0.023) },
        { codigo: 'socalo_superior', nombre: 'Socalo superior', tipo: PERFIL, cantidad: 4, medida: base(0.005, 4) },
        { codigo: 'socalo_inferior', nombre: 'Socalo inferior', tipo: PERFIL, cantidad: 4, medida: base(0.005, 4) },
        { codigo: 'rodamiento', nombre: 'Rodamientos', tipo: HERRAJE, cantidad: 4 },
        { codigo: 'guia_superior', nombre: 'Guías superiores', tipo: HERRAJE, cantidad: 8 },
        { codigo: 'guia_inferior', nombre: 'Guías inferiores', tipo: HERRAJE, cantidad: 8 },
        {
          // Con translape 1.42⁷ el vidrio del ejemplo (1.35⁸) usa el mismo descuento que 2 naves.
          codigo: 'vidrio', nombre: 'Vidrio', tipo: VIDRIO, cantidad: 4,
          dimensiones: { alto: pieza('translape', -0.069), ancho: pieza('socalo_superior', -0.052) },
        },
      ],
    },
  },
};
