import { useEffect, useState } from 'react';
import { repositorio } from '../database/repositorio.js';

/** Carga productos de una categoría + colores + vidrios desde el repositorio. */
export function useCatalogos(categoria) {
  const [datos, setDatos] = useState({ cargando: true, productos: [], colores: [], vidrios: [] });

  useEffect(() => {
    let activo = true;
    Promise.all([
      repositorio.listarProductos(categoria),
      repositorio.listarColores(),
      repositorio.listarVidrios(),
    ]).then(([productos, colores, vidrios]) => {
      if (activo) setDatos({ cargando: false, productos, colores, vidrios });
    });
    return () => {
      activo = false;
    };
  }, [categoria]);

  return datos;
}
