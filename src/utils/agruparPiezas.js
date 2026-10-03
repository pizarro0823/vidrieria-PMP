/**
 * Agrupa las piezas para mostrarlas/exportarlas.
 * Si la regla define un grupo (ej. garaje: "Marco", "Paneles") se usa; si no, el tipo de pieza.
 */
import { nombreCatalogo } from './formato.js';

const TITULO_POR_TIPO = { perfil: 'Perfiles de aluminio', vidrio: 'Vidrio', herraje: 'Herrajes y accesorios' };
const ORDEN_TIPO = { perfil: 0, vidrio: 1, herraje: 2 };
const DETALLE_POR_TIPO = { perfil: 'color', vidrio: 'vidrio' };

export function agruparPiezas(resultado) {
  const grupos = [];
  for (const p of resultado.piezas) {
    const titulo = p.grupo ?? TITULO_POR_TIPO[p.tipo] ?? p.tipo;
    let grupo = grupos.find((g) => g.titulo === titulo);
    if (!grupo) {
      const campo = DETALLE_POR_TIPO[p.tipo];
      grupo = { titulo, detalle: campo ? nombreCatalogo(resultado[campo]) : null, orden: ORDEN_TIPO[p.tipo] ?? 9, piezas: [] };
      grupos.push(grupo);
    }
    grupo.piezas.push(p);
  }
  return grupos.sort((a, b) => a.orden - b.orden); // sort estable: respeta el orden de las reglas
}
