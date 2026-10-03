/**
 * MOTOR GENERAL DE DESPIECE
 *
 * Función pura: recibe las reglas de una configuración y las medidas,
 * devuelve la lista de piezas. No sabe nada de React ni de la base de datos.
 * Sirve para ventanas, puertas y garajes: solo cambian las reglas.
 */
import { CONFIG_CALCULO } from '../../data/config/calculo.js';

export function redondear(valor, decimales = CONFIG_CALCULO.decimalesMetros) {
  const f = 10 ** decimales;
  return Math.round((valor + Number.EPSILON) * f) / f;
}

/** Evalúa (ref + sumar) ÷ dividir. */
export function evaluarFormula(formula, contexto) {
  const { ref, sumar = 0, dividir = 1 } = formula;
  let valorRef;

  if (ref === 'FIJO') valorRef = 0;
  else if (ref === 'BASE') valorRef = contexto.base;
  else if (ref === 'ALTURA') valorRef = contexto.altura;
  else if (ref.startsWith('pieza:')) {
    const codigo = ref.slice(6);
    if (!(codigo in contexto.piezas)) {
      throw new Error(`La regla hace referencia a la pieza "${codigo}", que no ha sido calculada antes.`);
    }
    valorRef = contexto.piezas[codigo];
  } else {
    throw new Error(`Referencia de fórmula desconocida: "${ref}"`);
  }

  if (!dividir) throw new Error('El divisor de una fórmula no puede ser 0.');
  return redondear((valorRef + sumar) / dividir);
}

/**
 * @param {object} producto  Producto con sus configuraciones (reglas).
 * @param {object} config    configuración elegida (ver obtenerConfiguracion)
 * @param {object} entrada   { base, altura, naves, color, vidrio }  (metros)
 * @returns {object} Resultado del despiece con estructura estándar.
 */
/** Ventanas: una configuración por número de naves. Puertas/garajes: configuración 'unica'. */
export function obtenerConfiguracion(producto, naves) {
  const configs = producto?.configuraciones ?? {};
  return (producto?.usaNaves ? configs[naves] : configs.unica) ?? null;
}

export function calcularDespiece(producto, config, entrada) {
  const contexto = { base: entrada.base, altura: entrada.altura, piezas: {} };

  const piezas = config.piezas.map((regla) => {
    const pieza = {
      codigo: regla.codigo,
      nombre: regla.nombre,
      tipo: regla.tipo,
      grupo: regla.grupo ?? null,
      nota: regla.nota ?? null,
      cantidad: regla.cantidad,
      unidad: regla.medida || regla.dimensiones ? 'm' : 'unidad',
      formula: regla.medida ?? regla.dimensiones ?? null,
      medida: null,
      medidaCalculada: null,
      medidaAjustada: null,
      calculado: true,
      ajustado: false,
    };

    if (regla.medida) {
      const valor = evaluarFormula(regla.medida, contexto);
      contexto.piezas[regla.codigo] = valor;
      pieza.medidaCalculada = valor;
      pieza.medida = valor;
    } else if (regla.dimensiones) {
      const dims = {};
      for (const [dim, formula] of Object.entries(regla.dimensiones)) {
        dims[dim] = evaluarFormula(formula, contexto);
      }
      pieza.medidaCalculada = dims;
      pieza.medida = { ...dims };
    }

    return pieza;
  });

  return {
    productoId: producto.id,
    producto: producto.nombre,
    categoria: producto.categoria,
    versionReglas: producto.versionReglas ?? 1,
    estadoReglas: config.estado ?? 'confirmada',
    notaReglas: config.pendiente ?? null,
    base: entrada.base,
    altura: entrada.altura,
    naves: config.naves ?? null,
    color: entrada.color ?? null,
    vidrio: entrada.vidrio ?? null,
    piezas,
  };
}
