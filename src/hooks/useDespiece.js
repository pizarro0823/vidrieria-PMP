import { useMemo, useState } from 'react';
import { calcularDespieceProducto } from '../services/despieceService.js';
import { parseDecimal } from '../utils/formato.js';

/**
 * Estado del formulario de despiece + cálculo inmediato.
 * Los valores del formulario se guardan como texto (permite "1,417" mientras se escribe).
 * Los ajustes se reinician si cambian naves, base o altura (el producto se
 * reinicia desde la página montando de nuevo el formulario).
 */
const CAMPOS_DIMENSIONALES = ['naves', 'base', 'altura'];

export function useDespiece(producto, valoresIniciales) {
  const [form, setForm] = useState(valoresIniciales);
  const [ajustes, setAjustes] = useState({});

  const cambiarCampo = (campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    if (CAMPOS_DIMENSIONALES.includes(campo)) setAjustes({});
  };

  const cargarValores = (valores) => {
    setForm((f) => ({ ...f, ...valores }));
    setAjustes({});
  };

  const entrada = useMemo(
    () => ({
      base: parseDecimal(form.base),
      altura: parseDecimal(form.altura),
      naves: Number(form.naves) || null,
      color: form.color,
      vidrio: form.vidrio,
    }),
    [form],
  );

  const calculo = useMemo(
    () => calcularDespieceProducto(producto, entrada, ajustes),
    [producto, entrada, ajustes],
  );

  const ajustar = (clave, valorM) =>
    setAjustes((a) => ({ ...a, [clave]: valorM }));

  const quitarAjuste = (clave) =>
    setAjustes((a) => {
      const { [clave]: _omit, ...resto } = a;
      return resto;
    });

  return {
    form,
    cambiarCampo,
    cargarValores,
    calculo,
    ajustes,
    ajustar,
    quitarAjuste,
    reiniciarAjustes: () => setAjustes({}),
  };
}
