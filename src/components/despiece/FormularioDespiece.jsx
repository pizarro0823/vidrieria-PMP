import { Campo, Segmentado, Tarjeta, claseInput } from '../ui/basicos.jsx';
import { normalizarMedida } from '../../calculations/engine/unidades.js';
import { parseDecimal } from '../../utils/formato.js';

/**
 * Formulario de datos del producto (ventana, puerta o garaje). Solo UI: no calcula nada.
 */
export default function FormularioDespiece({ titulo, producto, form, errores, tocados, onCampo, onTocar, colores, vidrios, onCargarEjemplo }) {
  const opcionesNaves = [
    ...Object.keys(producto.configuraciones).map((n) => ({ valor: Number(n), etiqueta: `${n} naves` })),
    ...(producto.navesPendientes ?? []).map((n) => ({ valor: n, etiqueta: `${n} naves`, deshabilitado: true })),
  ].sort((a, b) => a.valor - b.valor);
  const err = (campo) => (tocados[campo] ? errores[campo] : null);

  const elegir = (campo, lista, id) => {
    const item = lista.find((x) => x.id === id);
    onCampo(campo, item ? { ...item, descripcion: '' } : null);
    onTocar(campo);
  };

  return (
    <Tarjeta className="p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-semibold">{titulo}</h2>
        {onCargarEjemplo && (
          <button type="button" onClick={onCargarEjemplo} className="text-xs font-semibold text-brand-600 hover:underline">
            Cargar ejemplo
          </button>
        )}
      </div>

      <div className="space-y-4">
        {producto.usaNaves && (
          <Campo
            etiqueta="Número de naves"
            error={err('naves')}
            ayuda={producto.navesPendientes?.length ? `${producto.navesPendientes.join(' y ')} naves: pendiente de reglas.` : null}
          >
            <Segmentado nombre="Número de naves" valor={Number(form.naves)} onChange={(v) => onCampo('naves', v)} opciones={opcionesNaves} />
          </Campo>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Campo etiqueta="Base (ancho)" error={err('base')} htmlFor="base">
            <MedidaInput id="base" valor={form.base} error={err('base')} onChange={(v) => onCampo('base', v)} onBlur={() => onTocar('base')} />
          </Campo>
          <Campo etiqueta="Altura" error={err('altura')} htmlFor="altura">
            <MedidaInput id="altura" valor={form.altura} error={err('altura')} onChange={(v) => onCampo('altura', v)} onBlur={() => onTocar('altura')} />
          </Campo>
          <p className="col-span-2 -mt-1 text-xs text-slate-500">Puedes escribir en metros (2.74), centímetros (274) o milímetros (2740).</p>
        </div>

        <Campo etiqueta="Color del aluminio" error={err('color')} htmlFor="color">
          <div className="flex gap-2">
            <select
              id="color"
              value={form.color?.id ?? ''}
              onChange={(e) => elegir('color', colores, e.target.value)}
              className={claseInput(err('color'))}
            >
              <option value="">Selecciona…</option>
              {colores.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            {form.color?.hex && (
              <span className="h-12 w-12 shrink-0 rounded-xl border border-slate-200" style={{ background: form.color.hex }} />
            )}
          </div>
          {form.color?.requiereDescripcion && (
            <input
              className={`${claseInput()} mt-2`}
              placeholder="Nombre del color"
              value={form.color.descripcion}
              onChange={(e) => onCampo('color', { ...form.color, descripcion: e.target.value })}
            />
          )}
        </Campo>

        {producto.usaVidrio && (
          <Campo etiqueta="Tipo de vidrio" error={err('vidrio')} htmlFor="vidrio">
            <select
              id="vidrio"
              value={form.vidrio?.id ?? ''}
              onChange={(e) => elegir('vidrio', vidrios, e.target.value)}
              className={claseInput(err('vidrio'))}
            >
              <option value="">Selecciona…</option>
              {vidrios.map((v) => (
                <option key={v.id} value={v.id}>{v.nombre}</option>
              ))}
            </select>
            {form.vidrio?.requiereDescripcion && (
              <input
                className={`${claseInput()} mt-2`}
                placeholder="Tipo de vidrio"
                value={form.vidrio.descripcion}
                onChange={(e) => onCampo('vidrio', { ...form.vidrio, descripcion: e.target.value })}
              />
            )}
          </Campo>
        )}
      </div>
    </Tarjeta>
  );
}

function MedidaInput({ id, valor, error, onChange, onBlur }) {
  const unidad = normalizarMedida(parseDecimal(valor)).unidad; // muestra m, cm o mm según lo escrito
  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder="0.000"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`${claseInput(error)} pr-9 text-lg font-semibold tabular-nums`}
      />
      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">{unidad}</span>
    </div>
  );
}
