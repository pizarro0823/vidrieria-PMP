/**
 * REGLAS DE DESPIECE — PUERTAS DE GARAJE
 * Fuente: un ejemplo de garaje ciego (Base 2.68³ × Altura 2.29⁵).
 * Marco y piezas horizontales de paneles: Base/Altura menos un descuento.
 * Piezas cortas de paneles (0.38⁸, 0.39², 0.39) y las CANTIDADES se dejaron fijas como en el
 * ejemplo porque con un solo ejemplo no se puede saber cómo cambian → por confirmar.
 * Garaje con luceta: pendiente (sin reglas).
 */
import { PERFIL, base, altura, fija } from '../formulas.js';

const MARCO = 'Marco';
const PANELES = 'Paneles';
const NOTA_FIJA = 'Medida y cantidad fijas tomadas del ejemplo. Confirmar cómo cambian con la altura.';
const NOTA_CANTIDAD = 'Cantidad fija tomada del ejemplo. Confirmar cómo cambia con la medida.';

export const GARAJE_CIEGO = {
  id: 'garaje-ciego',
  nombre: 'Garaje ciego',
  categoria: 'garajes',
  habilitado: true,
  usaNaves: false,
  usaVidrio: false,
  usaAluminio: true,
  versionReglas: 1,
  configuraciones: {
    unica: {
      estado: 'por_confirmar',
      pendiente:
        'Reglas deducidas de un solo ejemplo. Las piezas cortas de los paneles y las cantidades de los paneles están fijas (ver notas en cada pieza).',
      ejemplos: [
        {
          base: 2.683,
          altura: 2.295,
          esperado: {
            marco_t244_alto: [2, 2.295], marco_t244_ancho: [2, 2.531],
            panel_t244_largo: [8, 2.583], panel_t244_corto: [8, 0.388],
            panel_u71_corto: [8, 0.392], panel_u71_largo: [8, 2.133],
            panel_u70: [20, 2.177],
            alamo_15: [16, 0.15], alamo_39: [16, 0.39],
          },
        },
      ],
      piezas: [
        { codigo: 'marco_t244_alto', nombre: 'T-244', grupo: MARCO, tipo: PERFIL, cantidad: 2, medida: altura() },
        { codigo: 'marco_t244_ancho', nombre: 'T-244', grupo: MARCO, tipo: PERFIL, cantidad: 2, medida: base(-0.152) },
        { codigo: 'panel_t244_largo', nombre: 'T-244', grupo: PANELES, tipo: PERFIL, cantidad: 8, medida: base(-0.1), nota: NOTA_CANTIDAD },
        { codigo: 'panel_t244_corto', nombre: 'T-244', grupo: PANELES, tipo: PERFIL, cantidad: 8, medida: fija(0.388), nota: NOTA_FIJA },
        { codigo: 'panel_u71_corto', nombre: 'U71', grupo: PANELES, tipo: PERFIL, cantidad: 8, medida: fija(0.392), nota: NOTA_FIJA },
        { codigo: 'panel_u71_largo', nombre: 'U71', grupo: PANELES, tipo: PERFIL, cantidad: 8, medida: base(-0.55), nota: NOTA_CANTIDAD },
        { codigo: 'panel_u70', nombre: 'U70', grupo: PANELES, tipo: PERFIL, cantidad: 20, medida: base(-0.506), nota: NOTA_CANTIDAD },
        { codigo: 'alamo_15', nombre: 'Álamo', grupo: PANELES, tipo: PERFIL, cantidad: 16, medida: fija(0.15), nota: NOTA_CANTIDAD },
        { codigo: 'alamo_39', nombre: 'Álamo', grupo: PANELES, tipo: PERFIL, cantidad: 16, medida: fija(0.39), nota: NOTA_FIJA },
      ],
    },
  },
};

export const GARAJE_LUCETA = {
  id: 'garaje-luceta',
  nombre: 'Garaje con luceta',
  categoria: 'garajes',
  habilitado: false,
  usaNaves: false,
  usaVidrio: true,
  usaAluminio: true,
  configuraciones: {},
};

export const GARAJES = [GARAJE_CIEGO, GARAJE_LUCETA];
