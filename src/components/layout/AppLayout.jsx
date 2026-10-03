import Icono from '../ui/Icono.jsx';
import { MENU } from './navegacion.js';

/**
 * Layout responsive:
 *  - Desktop (≥1024px): sidebar completo.
 *  - Tablet (768–1023px): barra lateral compacta con íconos + etiqueta corta.
 *  - Móvil (<768px): cabecera superior + navegación inferior.
 */
export default function AppLayout({ ruta, children }) {
  const activo = (r) => (r === '/' ? ruta === '/' : ruta.startsWith(r));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar desktop / tablet */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-20 flex-col bg-sidebar text-white md:flex lg:w-64">
        <div className="px-3 py-6 lg:px-6">
          <div className="text-center text-sm font-extrabold tracking-wide lg:text-left lg:text-lg">
            <span className="lg:hidden">DG</span>
            <span className="hidden lg:inline">DANIEL GIL</span>
          </div>
          <div className="mt-1 hidden text-xs text-slate-400 lg:block">Cotizador de Aluminio y Vidrio</div>
        </div>

        <nav className="flex-1 space-y-1 px-2 lg:px-3">
          {MENU.map((item) => (
            <a
              key={item.ruta}
              href={`#${item.ruta}`}
              className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2.5 text-[11px] transition lg:flex-row lg:gap-3 lg:px-3 lg:text-sm ${
                activo(item.ruta)
                  ? 'bg-slate-800 text-white shadow-[inset_3px_0_0_#2563eb]'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icono nombre={item.icono} />
              <span className="leading-tight">{item.nombre}</span>
            </a>
          ))}
        </nav>

        <div className="hidden border-t border-slate-700 px-6 py-4 text-sm lg:block">
          <div className="font-medium">Cristian</div>
          <div className="text-xs text-slate-400">Administrador</div>
        </div>
      </aside>

      {/* Cabecera móvil */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:hidden">
        <div>
          <div className="text-sm font-extrabold tracking-wide">DANIEL GIL</div>
          <div className="text-[10px] text-slate-500">Cotizador de Aluminio y Vidrio</div>
        </div>
        <a href="#/configuracion" aria-label="Configuración" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Icono nombre="config" />
        </a>
      </header>

      <main className="px-4 pb-28 pt-5 md:ml-20 md:px-6 md:pb-10 md:pt-7 lg:ml-64 lg:px-9">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>

      {/* Navegación inferior móvil */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex h-16 items-stretch border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
        {MENU.filter((m) => m.movil).map((item) => (
          <a
            key={item.ruta}
            href={`#${item.ruta}`}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] ${
              activo(item.ruta) ? 'font-semibold text-brand-600' : 'text-slate-500'
            }`}
          >
            <Icono nombre={item.icono} className="h-5 w-5" />
            {item.nombre}
          </a>
        ))}
      </nav>
    </div>
  );
}
