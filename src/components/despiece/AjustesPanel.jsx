import { useEffect, useRef, useState } from 'react';
import Icono from '../ui/Icono.jsx';
import { Etiqueta, Tarjeta } from '../ui/basicos.jsx';
import TextoMedida from '../ui/TextoMedida.jsx';
import { CONFIG_CALCULO } from '../../data/config/calculo.js';
import { claveAjuste } from '../../calculations/engine/ajustes.js';
import { formatDiferencia, formatMedida, formatNumero, parseDecimal } from '../../utils/formato.js';
import { redondear } from '../../calculations/engine/despieceEngine.js';
import { normalizarMedida } from '../../calculations/engine/unidades.js';

/**
 * Ajustes manuales: slider + input por cada medida.
 * Nunca toca la fórmula: solo guarda el valor ajustado aparte.
 */
export default function AjustesPanel({ resultado, onAjustar, onQuitar, onReiniciar }) {
  const piezas = resultado.piezas.filter((p) => p.medidaCalculada != null);
  const cantidadAjustadas = resultado.piezas.filter((p) => p.ajustado).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500">
          Mueve la barra o escribe el valor. El valor calculado se conserva siempre.
        </p>
        {cantidadAjustadas > 0 && (
          <button
            type="button"
            onClick={onReiniciar}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Icono nombre="deshacer" className="h-3.5 w-3.5" /> Restablecer todo ({cantidadAjustadas})
          </button>
        )}
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {piezas.flatMap((p) => {
          if (typeof p.medidaCalculada === 'number') {
            return (
              <ControlAjuste
                key={p.codigo}
                titulo={p.nombre}
                subtitulo={`Cantidad: ${p.cantidad}`}
                calculado={p.medidaCalculada}
                valor={p.medida}
                onCambiar={(v) => cambiar(p.codigo, v, p.medidaCalculada)}
              />
            );
          }
          return Object.keys(p.medidaCalculada).map((dim) => (
            <ControlAjuste
              key={`${p.codigo}.${dim}`}
              titulo={`${p.nombre} — ${dim}`}
              subtitulo={`Cantidad: ${p.cantidad}`}
              calculado={p.medidaCalculada[dim]}
              valor={p.medida[dim]}
              onCambiar={(v) => cambiar(claveAjuste(p.codigo, dim), v, p.medidaCalculada[dim])}
            />
          ));
        })}
      </div>
    </div>
  );

  function cambiar(clave, valorM, calculado) {
    if (valorM == null || valorM === calculado) onQuitar(clave);
    else onAjustar(clave, valorM);
  }
}

function ControlAjuste({ titulo, subtitulo, calculado, valor, onCambiar }) {
  const { rangoAjusteMetros: rango, pasoAjusteMetros: paso } = CONFIG_CALCULO;
  const ajustado = valor !== calculado;
  const [texto, setTexto] = useState(formatNumero(valor));
  const enfocado = useRef(false);

  useEffect(() => {
    if (!enfocado.current) setTexto(formatNumero(valor));
  }, [valor]);

  const min = redondear(Math.max(paso, calculado - rango));
  const max = redondear(calculado + rango);

  const escribir = (t) => {
    setTexto(t);
    const n = parseDecimal(t);
    if (typeof n === 'number' && Number.isFinite(n) && n > 0) onCambiar(redondear(normalizarMedida(n).valor)); // 92 → 0.92 m
  };

  const pasoBoton = (signo) => onCambiar(redondear(valor + signo * paso));

  return (
    <Tarjeta className={`p-4 ${ajustado ? 'border-amber-300' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold">{titulo}</div>
          <div className="text-xs text-slate-500">{subtitulo}</div>
        </div>
        {ajustado ? <Etiqueta color="ambar">Ajustado</Etiqueta> : <Etiqueta color="verde">Calculado</Etiqueta>}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Dato etiqueta="Calculado" valor={formatMedida(calculado)} />
        <Dato etiqueta="Ajustado" valor={ajustado ? formatMedida(valor) : '—'} resaltar={ajustado} />
        <Dato etiqueta="Diferencia" valor={ajustado ? formatDiferencia(valor - calculado) : '0.00 m'} resaltar={ajustado} />
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={paso}
        value={Math.min(max, Math.max(min, valor))}
        onChange={(e) => onCambiar(redondear(Number(e.target.value)))}
        aria-label={`Ajuste de ${titulo}`}
        className="mt-4 w-full accent-brand-600"
      />
      <div className="flex justify-between text-[11px] text-slate-400 tabular-nums">
        <span><TextoMedida>{formatMedida(min)}</TextoMedida></span>
        <span><TextoMedida>{formatMedida(max)}</TextoMedida></span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <BotonPaso icono="menos" onClick={() => pasoBoton(-1)} etiqueta="Restar 0.001 m" />
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="decimal"
            value={texto}
            onFocus={() => (enfocado.current = true)}
            onBlur={() => {
              enfocado.current = false;
              setTexto(formatNumero(valor));
            }}
            onChange={(e) => escribir(e.target.value)}
            aria-label={`Valor de ${titulo} en metros`}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-10 text-center font-semibold tabular-nums outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">m</span>
        </div>
        <BotonPaso icono="mas" onClick={() => pasoBoton(1)} etiqueta="Sumar 0.001 m" />
        <button
          type="button"
          disabled={!ajustado}
          onClick={() => onCambiar(null)}
          title="Volver al valor calculado"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
        >
          <Icono nombre="deshacer" className="h-4 w-4" />
        </button>
      </div>
    </Tarjeta>
  );
}

function Dato({ etiqueta, valor, resaltar }) {
  return (
    <div className="rounded-lg bg-slate-50 px-2 py-1.5">
      <div className="text-slate-500">{etiqueta}</div>
      <div className={`font-semibold tabular-nums ${resaltar ? 'text-amber-700' : ''}`}><TextoMedida>{valor}</TextoMedida></div>
    </div>
  );
}

function BotonPaso({ icono, onClick, etiqueta }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiqueta}
      className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 active:bg-slate-100"
    >
      <Icono nombre={icono} className="h-4 w-4" />
    </button>
  );
}
