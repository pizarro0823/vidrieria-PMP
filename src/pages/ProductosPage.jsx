import { useEffect, useState } from 'react';
import { Encabezado, Etiqueta } from '../components/ui/basicos.jsx';
import { useCatalogos } from '../hooks/useCatalogos.js';
import CalculadoraDespiece from '../components/despiece/CalculadoraDespiece.jsx';

/** Página de un módulo (ventanas, puertas, garajes): elegir producto y calcular su despiece. */
export default function ProductosPage({ modulo }) {
  const { cargando, productos, colores, vidrios } = useCatalogos(modulo.categoria);
  const [productoId, setProductoId] = useState(null);

  // Al entrar (o cambiar de módulo) seleccionar el primer producto habilitado
  useEffect(() => {
    setProductoId(productos.find((p) => p.habilitado)?.id ?? null);
  }, [productos]);

  const producto = productos.find((p) => p.id === productoId);

  return (
    <>
      <Encabezado titulo={modulo.titulo} subtitulo="Ingresa las medidas y obtén el despiece para producción." />

      <SelectorProducto productos={productos} valor={productoId} onChange={setProductoId} />

      {cargando || !producto ? (
        <p className="text-sm text-slate-500">Cargando…</p>
      ) : (
        <CalculadoraDespiece
          key={producto.id}
          producto={producto}
          colores={colores}
          vidrios={vidrios}
          tituloFormulario={modulo.tituloFormulario}
        />
      )}
    </>
  );
}

function SelectorProducto({ productos, valor, onChange }) {
  return (
    <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-3 md:gap-3 md:overflow-visible md:px-0">
      {productos.map((p) => {
        const activo = p.id === valor;
        const naves = Object.keys(p.configuraciones);
        return (
          <button
            key={p.id}
            type="button"
            disabled={!p.habilitado}
            onClick={() => onChange(p.id)}
            className={`min-w-[150px] shrink-0 rounded-2xl border p-3 text-left transition md:min-w-0 md:p-4 ${
              activo ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100' : 'border-slate-200 bg-white hover:border-brand-500'
            } disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-slate-200`}
          >
            <div className="font-semibold">{p.nombre}</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {!p.habilitado ? (
                <Etiqueta>Pendiente de reglas</Etiqueta>
              ) : p.usaNaves ? (
                <Etiqueta color="azul">{naves.join(' · ')} naves</Etiqueta>
              ) : (
                <Etiqueta color="azul">Disponible</Etiqueta>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
