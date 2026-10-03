import { useState } from 'react';
import { Aviso, Tarjeta } from '../ui/basicos.jsx';
import TextoMedida from '../ui/TextoMedida.jsx';
import { useDespiece } from '../../hooks/useDespiece.js';
import { obtenerConfiguracion } from '../../calculations/engine/despieceEngine.js';
import { formatMetros, nombreCatalogo } from '../../utils/formato.js';
import FormularioDespiece from './FormularioDespiece.jsx';
import DespieceTabla from './DespieceTabla.jsx';
import AjustesPanel from './AjustesPanel.jsx';
import ExportarDespiece from './ExportarDespiece.jsx';

/** Formulario + despiece + ajustes + exportación. Sirve para cualquier producto. */
export default function CalculadoraDespiece({ producto, colores, vidrios, tituloFormulario }) {
  const navesIniciales = producto.usaNaves ? Number(Object.keys(producto.configuraciones)[0]) : null;
  const { form, cambiarCampo, cargarValores, calculo, ajustar, quitarAjuste, reiniciarAjustes } = useDespiece(producto, {
    naves: navesIniciales,
    base: '',
    altura: '',
    color: null,
    vidrio: null,
  });
  const [tocados, setTocados] = useState({});
  const [pestana, setPestana] = useState('despiece');

  const tocar = (campo) => setTocados((t) => ({ ...t, [campo]: true }));
  const onCampo = (campo, valor) => {
    cambiarCampo(campo, valor);
    if (campo === 'naves') tocar('naves');
  };

  const ejemplo = obtenerConfiguracion(producto, form.naves)?.ejemplos?.[0];
  const cargarEjemplo = ejemplo
    ? () => cargarValores({ base: String(ejemplo.base), altura: String(ejemplo.altura) })
    : null;

  const { ok, errores, advertencias, avisos, resultado } = calculo;
  const ajustadas = resultado?.piezas.filter((p) => p.ajustado).length ?? 0;

  return (
    <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[370px_minmax(0,1fr)]">
      <div className="lg:sticky lg:top-6 lg:self-start">
        <FormularioDespiece
          titulo={tituloFormulario}
          producto={producto}
          form={form}
          errores={errores}
          tocados={tocados}
          onCampo={onCampo}
          onTocar={tocar}
          colores={colores}
          vidrios={vidrios}
          onCargarEjemplo={cargarEjemplo}
        />
      </div>

      <section className="min-w-0 space-y-4">
        {avisos.map((a) => (
          <Aviso key={a} tipo="info"><TextoMedida>{a}</TextoMedida></Aviso>
        ))}
        {advertencias.map((a) => (
          <Aviso key={a} tipo="alerta">{a}</Aviso>
        ))}

        {!ok ? (
          <Tarjeta className="p-6 text-center md:p-10">
            <div className="text-lg font-semibold">Despiece calculado</div>
            <p className="mt-1 text-sm text-slate-500">Completa los datos para ver las piezas:</p>
            <ul className="mx-auto mt-4 inline-block space-y-1.5 text-left text-sm text-amber-800">
              {Object.values(errores).map((e) => (
                <li key={e}>⚠ {e}</li>
              ))}
            </ul>
          </Tarjeta>
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">Despiece calculado</h2>
                <p className="text-xs text-slate-500">
                  Medidas en metros · el número pequeño son los milímetros (1.25<sup>7</sup> m = 1 m, 25 cm, 7 mm).
                </p>
              </div>
              <ExportarDespiece resultado={resultado} />
            </div>

            <Resumen resultado={resultado} ajustadas={ajustadas} />

            {resultado.estadoReglas === 'por_confirmar' && (
              <Aviso tipo="alerta">
                <strong>Regla pendiente de confirmar.</strong> <TextoMedida>{resultado.notaReglas}</TextoMedida>
              </Aviso>
            )}

            <div className="flex border-b border-slate-200">
              {[
                ['despiece', 'Despiece'],
                ['ajustes', `Ajustes${ajustadas ? ` (${ajustadas})` : ''}`],
              ].map(([id, texto]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPestana(id)}
                  className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold ${
                    pestana === id ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {texto}
                </button>
              ))}
            </div>

            {pestana === 'despiece' ? (
              <DespieceTabla resultado={resultado} />
            ) : (
              <AjustesPanel resultado={resultado} onAjustar={ajustar} onQuitar={quitarAjuste} onReiniciar={reiniciarAjustes} />
            )}
          </>
        )}
      </section>
    </div>
  );
}

function Resumen({ resultado, ajustadas }) {
  const datos = [
    ['Producto', resultado.producto],
    resultado.naves && ['Naves', resultado.naves],
    ['Medidas (base × altura)', `${formatMetros(resultado.base)} × ${formatMetros(resultado.altura)} m`],
    ['Color', nombreCatalogo(resultado.color)],
    resultado.vidrio && ['Vidrio', nombreCatalogo(resultado.vidrio)],
    ['Ajustes manuales', ajustadas ? `${ajustadas} pieza${ajustadas > 1 ? 's' : ''}` : 'Ninguno'],
  ].filter(Boolean);
  return (
    <Tarjeta className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 sm:grid-cols-3">
      {datos.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <div className="text-[11px] text-slate-500">{k}</div>
          <div className="break-words text-sm font-semibold">
            <TextoMedida>{String(v)}</TextoMedida>
          </div>
        </div>
      ))}
    </Tarjeta>
  );
}
