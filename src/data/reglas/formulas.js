/**
 * Ayudantes para escribir reglas de despiece de forma corta y legible.
 * Todas las medidas en METROS. Cada fórmula = (referencia + sumar) ÷ dividir.
 *
 *   base(-0.005, 2)        → (Base − 0.005) ÷ 2
 *   altura(-0.011)         → Altura − 0.011
 *   pieza('translape', -0.069) → Translape − 0.069
 *   fija(0.15)             → medida fija 0.15 m (no depende de base ni altura)
 *
 * Esta misma estructura (referencia, sumar, dividir) se guardará en SQL Server / Supabase.
 */

export const PERFIL = 'perfil';
export const HERRAJE = 'herraje';
export const VIDRIO = 'vidrio';

const formula = (ref, sumar, dividir) => (dividir && dividir !== 1 ? { ref, sumar, dividir } : { ref, sumar });

export const base = (sumar = 0, dividir) => formula('BASE', sumar, dividir);
export const altura = (sumar = 0, dividir) => formula('ALTURA', sumar, dividir);
export const pieza = (codigo, sumar = 0, dividir) => formula(`pieza:${codigo}`, sumar, dividir);
export const fija = (valor) => ({ ref: 'FIJO', sumar: valor });
