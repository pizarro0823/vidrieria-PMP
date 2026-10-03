/**
 * Validaciones de la entrada del despiece. Devuelve mensajes claros para el usuario.
 * errores     → impiden calcular.
 * advertencias → se calcula igual, pero se avisa.
 */
import { CONFIG_CALCULO } from '../../data/config/calculo.js';

export function validarEntrada(producto, entrada) {
  const errores = {};
  const advertencias = [];

  if (!producto) {
    errores.producto = 'Selecciona un producto.';
    return { valido: false, errores, advertencias };
  }

  validarMedida('base', 'La base', entrada.base, errores, advertencias);
  validarMedida('altura', 'La altura', entrada.altura, errores, advertencias);

  const configs = producto.configuraciones ?? {};
  if (producto.usaNaves) {
    const navesDisponibles = Object.keys(configs).map(Number);
    if (navesDisponibles.length === 0) {
      errores.producto = `${producto.nombre} todavía no tiene reglas de despiece configuradas.`;
    } else if (!entrada.naves) {
      errores.naves = 'Selecciona el número de naves.';
    } else if (!navesDisponibles.includes(Number(entrada.naves))) {
      errores.naves = `${producto.nombre} no tiene reglas para ${entrada.naves} naves (disponibles: ${navesDisponibles.join(', ')}).`;
    }
  } else if (!configs.unica) {
    errores.producto = `${producto.nombre} todavía no tiene reglas de despiece configuradas.`;
  }

  if (producto.usaAluminio) {
    if (!entrada.color?.id) errores.color = 'Selecciona el color del aluminio.';
    else if (entrada.color.requiereDescripcion && !entrada.color.descripcion?.trim()) {
      errores.color = 'Escribe el nombre del color.';
    }
  }

  if (producto.usaVidrio) {
    if (!entrada.vidrio?.id) errores.vidrio = 'Selecciona el tipo de vidrio.';
    else if (entrada.vidrio.requiereDescripcion && !entrada.vidrio.descripcion?.trim()) {
      errores.vidrio = 'Escribe el tipo de vidrio.';
    }
  }

  return { valido: Object.keys(errores).length === 0, errores, advertencias };
}

function validarMedida(campo, etiqueta, valor, errores, advertencias) {
  if (valor === null || valor === undefined || valor === '') {
    errores[campo] = `${etiqueta} es obligatoria.`;
  } else if (Number.isNaN(valor)) {
    errores[campo] = `${etiqueta} debe ser un número (ej: 1.417).`;
  } else if (valor <= 0) {
    errores[campo] = `${etiqueta} debe ser mayor que 0.`;
  } else if (valor > CONFIG_CALCULO.medidaMaximaSugeridaMetros) {
    advertencias.push(`${etiqueta} es ${valor} m. Revisa que la medida esté bien escrita.`);
  }
}
