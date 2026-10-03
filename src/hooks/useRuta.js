import { useEffect, useState } from 'react';

/** Navegación mínima por hash (#/ventanas). Sin dependencias externas. */
export function useRuta() {
  const leer = () => window.location.hash.replace(/^#/, '') || '/';
  const [ruta, setRuta] = useState(leer);

  useEffect(() => {
    const onChange = () => {
      setRuta(leer());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return ruta;
}

export function navegar(ruta) {
  window.location.hash = ruta;
}
