import AppLayout from './components/layout/AppLayout.jsx';
import { useRuta } from './hooks/useRuta.js';
import InicioPage from './pages/InicioPage.jsx';
import ProductosPage from './pages/ProductosPage.jsx';
import PendientePage from './pages/PendientePage.jsx';
import { MODULO_VENTANAS } from './modules/ventanas/index.js';
import { MODULO_PUERTAS } from './modules/puertas/index.js';
import { MODULO_GARAJES } from './modules/garajes/index.js';

const PAGINAS = {
  '/': () => <InicioPage />,
  '/ventanas': () => <ProductosPage key="ventanas" modulo={MODULO_VENTANAS} />,
  '/puertas': () => <ProductosPage key="puertas" modulo={MODULO_PUERTAS} />,
  '/garajes': () => <ProductosPage key="garajes" modulo={MODULO_GARAJES} />,
  '/cotizaciones': () => <PendientePage titulo="Cotizaciones" descripcion="Cotizador e historial: Módulos 7 y 8." />,
  '/configuracion': () => <PendientePage titulo="Configuración" descripcion="Usuarios y parámetros: Módulo 9." />,
};

export default function App() {
  const ruta = useRuta();
  const Pagina = PAGINAS[ruta] ?? PAGINAS['/'];
  return (
    <AppLayout ruta={ruta}>
      <Pagina />
    </AppLayout>
  );
}
