import Icono from './Icono.jsx';

export function Tarjeta({ className = '', children }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white ${className}`}>{children}</div>;
}

export function Encabezado({ titulo, subtitulo, children }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 md:mb-6">
      <div>
        <h1 className="text-xl font-bold md:text-2xl">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-sm text-slate-500">{subtitulo}</p>}
      </div>
      {children}
    </div>
  );
}

export function Etiqueta({ color = 'gris', children }) {
  const colores = {
    gris: 'bg-slate-100 text-slate-600',
    verde: 'bg-green-100 text-green-800',
    ambar: 'bg-amber-100 text-amber-800',
    azul: 'bg-brand-100 text-brand-700',
  };
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${colores[color]}`}>
      {children}
    </span>
  );
}

export function Campo({ etiqueta, error, ayuda, children, htmlFor }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-slate-700">
        {etiqueta}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
          <Icono nombre="alerta" className="h-3.5 w-3.5 shrink-0" /> {error}
        </p>
      ) : (
        ayuda && <p className="mt-1.5 text-xs text-slate-500">{ayuda}</p>
      )}
    </div>
  );
}

export const claseInput = (error) =>
  `w-full rounded-xl border bg-white px-3.5 py-3 text-base outline-none transition focus:ring-2 ${
    error ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100'
  }`;

export function Aviso({ tipo = 'info', children }) {
  const estilos = {
    info: 'border-brand-100 bg-brand-50 text-brand-700',
    alerta: 'border-amber-200 bg-amber-50 text-amber-800',
    error: 'border-red-200 bg-red-50 text-red-700',
  };
  return (
    <div className={`flex gap-2 rounded-xl border px-3.5 py-3 text-sm ${estilos[tipo]}`}>
      <Icono nombre={tipo === 'info' ? 'info' : 'alerta'} className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

/** Selector segmentado (botones tipo pestaña). */
export function Segmentado({ opciones, valor, onChange, nombre }) {
  return (
    <div role="radiogroup" aria-label={nombre} className="flex rounded-xl bg-slate-100 p-1">
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          role="radio"
          aria-checked={valor === o.valor}
          disabled={o.deshabilitado}
          onClick={() => onChange(o.valor)}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
            valor === o.valor ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {o.etiqueta}
        </button>
      ))}
    </div>
  );
}
