import { Etiqueta, Tarjeta } from '../ui/basicos.jsx';
import { describirFormula, formatMedidaPieza } from '../../utils/formato.js';
import { agruparPiezas } from '../../utils/agruparPiezas.js';
import TextoMedida from '../ui/TextoMedida.jsx';

/** Tabla de despiece (desktop/tablet) y tarjetas (móvil). */
export default function DespieceTabla({ resultado }) {
  const nombres = Object.fromEntries(resultado.piezas.map((p) => [p.codigo, p.nombre]));

  return (
    <div className="space-y-4">
      {agruparPiezas(resultado).map((g) => {
        const { piezas } = g;
        return (
          <Tarjeta key={g.titulo} className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5">
              <h3 className="text-sm font-semibold text-slate-700">{g.titulo}</h3>
              {g.detalle && <span className="text-xs text-slate-500">{g.detalle}</span>}
            </div>

            {/* Tablet / desktop */}
            <table className="hidden w-full text-sm md:table">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="px-4 py-2 font-medium">Pieza</th>
                  <th className="px-4 py-2 text-center font-medium">Cant.</th>
                  <th className="px-4 py-2 font-medium">Medida de corte</th>
                  <th className="px-4 py-2 font-medium">Calculado</th>
                  <th className="px-4 py-2 text-right font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {piezas.map((p) => (
                  <tr key={p.codigo} className={`border-t border-slate-100 ${p.ajustado ? 'bg-amber-50/60' : ''}`}>
                    <td className="min-w-[200px] px-4 py-3">
                      <div className="font-medium">{p.nombre}</div>
                      {p.formula && <div className="text-xs text-slate-400"><TextoMedida>{describirFormula(p.formula, nombres)}</TextoMedida></div>}
                      {p.nota && <NotaPieza texto={p.nota} />}
                    </td>
                    <td className="px-4 py-3 text-center text-base font-bold tabular-nums">{p.cantidad}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-base font-bold tabular-nums">
                      <TextoMedida>{formatMedidaPieza(p.medida)}</TextoMedida>
                      {p.tipo === 'vidrio' && <div className="text-xs font-normal text-slate-400">alto × ancho</div>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-500"><TextoMedida>{p.formula ? formatMedidaPieza(p.medidaCalculada) : '—'}</TextoMedida></td>
                    <td className="px-4 py-3 text-right"><EstadoPieza pieza={p} /></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Móvil */}
            <ul className="divide-y divide-slate-100 md:hidden">
              {piezas.map((p) => (
                <li key={p.codigo} className={`px-4 py-3 ${p.ajustado ? 'bg-amber-50/60' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium">{p.nombre}</div>
                    <EstadoPieza pieza={p} />
                  </div>
                  <div className="mt-1 flex items-baseline gap-2 tabular-nums">
                    <span className="text-lg font-bold">
                      <TextoMedida>{p.formula ? `${p.cantidad} × ${formatMedidaPieza(p.medida)}` : `${p.cantidad} unidades`}</TextoMedida>
                    </span>
                  </div>
                  {p.tipo === 'vidrio' && <div className="text-xs text-slate-500">alto × ancho</div>}
                  {p.nota && <NotaPieza texto={p.nota} />}
                  {p.ajustado && (
                    <div className="text-xs text-slate-500">Calculado: <TextoMedida>{formatMedidaPieza(p.medidaCalculada)}</TextoMedida></div>
                  )}
                </li>
              ))}
            </ul>
          </Tarjeta>
        );
      })}
    </div>
  );
}

function EstadoPieza({ pieza }) {
  if (!pieza.formula) return <Etiqueta>Cantidad</Etiqueta>;
  return pieza.ajustado ? <Etiqueta color="ambar">Ajustado</Etiqueta> : <Etiqueta color="verde">Calculado</Etiqueta>;
}

function NotaPieza({ texto }) {
  return <div className="mt-0.5 max-w-xs text-[11px] font-medium leading-snug text-amber-700">⚠ {texto}</div>;
}
