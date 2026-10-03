import { Encabezado, Tarjeta } from '../components/ui/basicos.jsx';

/** Página temporal para módulos que aún no se desarrollan. */
export default function PendientePage({ titulo, descripcion }) {
  return (
    <>
      <Encabezado titulo={titulo} />
      <Tarjeta className="p-8 text-center">
        <div className="font-semibold">Módulo en espera</div>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{descripcion}</p>
      </Tarjeta>
    </>
  );
}
