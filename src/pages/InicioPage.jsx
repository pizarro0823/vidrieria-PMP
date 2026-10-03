import Icono from '../components/ui/Icono.jsx';
import { Encabezado, Etiqueta, Tarjeta } from '../components/ui/basicos.jsx';

/** Estado real de los módulos (sin cifras inventadas). */
const MODULOS = [
  { ruta: '/ventanas', icono: 'ventana', nombre: 'Ventanas', detalle: '7-44 y 80-25 (2 y 4 naves) · Monumental (2, 3 y 4 naves)', estado: 'activo' },
  { ruta: '/puertas', icono: 'puerta', nombre: 'Puertas', detalle: 'Ciega · Con luceta', estado: 'activo' },
  { ruta: '/garajes', icono: 'garaje', nombre: 'Puertas de garaje', detalle: 'Ciego · Con luceta (pendiente)', estado: 'activo' },
  { ruta: '/cotizaciones', icono: 'cotizaciones', nombre: 'Cotizaciones', detalle: 'Precios e historial', estado: 'pendiente' },
];

export default function InicioPage() {
  return (
    <>
      <Encabezado titulo="Bienvenido" subtitulo="Cotizador de Aluminio y Vidrio — Daniel Gil">
        <a href="#/ventanas" className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          Calcular despiece
        </a>
      </Encabezado>

      <h2 className="mb-3 text-sm font-semibold text-slate-600">Módulos</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MODULOS.map((m) => (
          <a key={m.nombre} href={`#${m.ruta}`} className="block">
            <Tarjeta className="flex h-full items-start gap-3 p-4 transition hover:border-brand-500">
              <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
                <Icono nombre={m.icono} className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{m.nombre}</span>
                  {m.estado === 'activo' ? <Etiqueta color="verde">Activo</Etiqueta> : <Etiqueta>Próximamente</Etiqueta>}
                </div>
                <div className="mt-0.5 text-sm text-slate-500">{m.detalle}</div>
              </div>
            </Tarjeta>
          </a>
        ))}
      </div>
    </>
  );
}
