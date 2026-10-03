/**
 * REGLAS DE DESPIECE — PUERTAS
 * Fuente: un ejemplo de cada tipo entregado por Daniel Gil.
 * Las medidas de corte se dedujeron de ese ejemplo (Base/Altura menos un descuento).
 * La CANTIDAD de U70 se dejó fija como en el ejemplo: probablemente depende de la altura → por confirmar.
 */
import { PERFIL, base, altura, fija } from '../formulas.js';

const NOTA_U70 = 'Cantidad fija tomada del ejemplo. Confirmar cómo cambia con la medida.';

export const PUERTA_CIEGA = {
  id: 'puerta-ciega',
  nombre: 'Puerta ciega',
  categoria: 'puertas',
  habilitado: true,
  usaNaves: false,
  usaVidrio: false,
  usaAluminio: true,
  versionReglas: 1,
  configuraciones: {
    unica: {
      estado: 'por_confirmar',
      pendiente: 'Reglas deducidas de un solo ejemplo (Base 0.97 × Altura 2.74). La cantidad de U70 (31) está fija.',
      ejemplos: [
        {
          base: 0.97,
          altura: 2.74,
          esperado: {
            canal_alto: [2, 2.74], canal_ancho: [2, 0.92],
            t244_alto: [2, 2.473], t244_ancho: [2, 0.756],
            u71_ancho: [2, 0.76], u71_alto: [2, 2.355],
            u70: [31, 0.752],
          },
        },
      ],
      piezas: [
        { codigo: 'canal_alto', nombre: 'Canal 2×1', tipo: PERFIL, cantidad: 2, medida: altura() },
        { codigo: 'canal_ancho', nombre: 'Canal 2×1', tipo: PERFIL, cantidad: 2, medida: base(-0.05) },
        { codigo: 't244_alto', nombre: 'T-244', tipo: PERFIL, cantidad: 2, medida: altura(-0.267) },
        { codigo: 't244_ancho', nombre: 'T-244', tipo: PERFIL, cantidad: 2, medida: base(-0.214) },
        { codigo: 'u71_ancho', nombre: 'U71', tipo: PERFIL, cantidad: 2, medida: base(-0.21) },
        { codigo: 'u71_alto', nombre: 'U71', tipo: PERFIL, cantidad: 2, medida: altura(-0.385) },
        { codigo: 'u70', nombre: 'U70', tipo: PERFIL, cantidad: 31, medida: base(-0.218), nota: NOTA_U70 },
      ],
    },
  },
};

export const PUERTA_LUCETA = {
  id: 'puerta-luceta',
  nombre: 'Puerta con luceta',
  categoria: 'puertas',
  habilitado: true,
  usaNaves: false,
  usaVidrio: false,
  usaAluminio: true,
  versionReglas: 1,
  configuraciones: {
    unica: {
      estado: 'por_confirmar',
      pendiente:
        'La cantidad de U70 (28) está fija. El ejemplo no trae vidrio para la luceta.',
      ejemplos: [
        {
          base: 0.997,
          altura: 2.327,
          esperado: {
            u78_alto: [2, 2.327], u78_ancho: [1, 0.947],
            // T-244 ancho y U71 alto corregidos por Daniel Gil (01/10/2026): 0.78³ y 2.13⁸
            t244_alto: [2, 2.287], t244_ancho: [2, 0.783],
            u71_ancho: [2, 0.635], u71_alto: [2, 2.138],
            u70: [28, 0.629],
            alamo_corto: [2, 0.15], alamo_alto: [2, 2.138],
          },
        },
      ],
      piezas: [
        { codigo: 'u78_alto', nombre: 'U78', tipo: PERFIL, cantidad: 2, medida: altura() },
        { codigo: 'u78_ancho', nombre: 'U78', tipo: PERFIL, cantidad: 1, medida: base(-0.05) },
        { codigo: 't244_alto', nombre: 'T-244', tipo: PERFIL, cantidad: 2, medida: altura(-0.04) },
        { codigo: 't244_ancho', nombre: 'T-244', tipo: PERFIL, cantidad: 2, medida: base(-0.214) },
        { codigo: 'u71_ancho', nombre: 'U71', tipo: PERFIL, cantidad: 2, medida: base(-0.362) },
        { codigo: 'u71_alto', nombre: 'U71', tipo: PERFIL, cantidad: 2, medida: altura(-0.189) },
        { codigo: 'u70', nombre: 'U70', tipo: PERFIL, cantidad: 28, medida: base(-0.368), nota: NOTA_U70 },
        { codigo: 'alamo_corto', nombre: 'Álamo', tipo: PERFIL, cantidad: 2, medida: fija(0.15) },
        { codigo: 'alamo_alto', nombre: 'Álamo', tipo: PERFIL, cantidad: 2, medida: altura(-0.189) },
      ],
    },
  },
};

export const PUERTAS = [PUERTA_CIEGA, PUERTA_LUCETA];
