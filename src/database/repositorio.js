/**
 * CAPA DE ACCESO A DATOS
 *
 * Hoy lee los datos locales de /src/data.
 * Módulo 2: se reemplazará por llamadas a la API de SQL Server.
 * Módulo 10: por Supabase.
 *
 * Los métodos son async a propósito: al cambiar la fuente de datos
 * la interfaz no cambia y la UI/servicios no se tocan.
 */
import { VENTANAS } from '../data/reglas/ventanas/index.js';
import { PUERTAS } from '../data/reglas/puertas/index.js';
import { GARAJES } from '../data/reglas/garajes/index.js';
import { CATEGORIAS } from '../data/catalogos/categorias.js';
import { COLORES_ALUMINIO } from '../data/catalogos/colores.js';
import { TIPOS_VIDRIO } from '../data/catalogos/vidrios.js';

const PRODUCTOS = [...VENTANAS, ...PUERTAS, ...GARAJES];

export const repositorio = {
  async listarCategorias() {
    return CATEGORIAS;
  },
  async listarProductos(categoria) {
    return categoria ? PRODUCTOS.filter((p) => p.categoria === categoria) : PRODUCTOS;
  },
  async obtenerProducto(id) {
    return PRODUCTOS.find((p) => p.id === id) ?? null;
  },
  async listarColores() {
    return COLORES_ALUMINIO;
  },
  async listarVidrios() {
    return TIPOS_VIDRIO;
  },
};
