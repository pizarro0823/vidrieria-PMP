# DANIEL GIL — Cotizador de Aluminio y Vidrio

React + JavaScript + Vite + Tailwind CSS.

Etapa actual: estructura + módulos de **Ventanas, Puertas y Garajes** (despiece, ajustes, Excel/PDF).

| Producto | Configuraciones | Estado de reglas |
|---|---|---|
| Ventana 7-44 | 2 y 4 naves | Confirmada |
| Ventana 80-25 | 2 y 4 naves | 2 naves confirmada · 4 naves: confirmar cantidades |
| Ventana Monumental | 2, 3 y 4 naves | Por confirmar: faltan vidrio, rodamientos y guías; 2 y 4 naves deducidas de la de 3 |
| Puerta ciega | única | Por confirmar: cantidad de U70 fija |
| Puerta con luceta | única | Por confirmar: cantidad de U70 fija, sin vidrio (T-244 y U71 corregidos) |
| Garaje ciego | única | Por confirmar: piezas cortas y cantidades de paneles fijas |
| Garaje con luceta | — | Sin reglas |

Las reglas "por confirmar" muestran un aviso en pantalla y en los archivos exportados.
Cada regla trae sus `ejemplos`; `npm test` verifica que todos den exactamente las medidas entregadas.

## Ejecutar

```bash
npm install
npm run dev      # abre http://localhost:5173/#/ventanas
npm test         # valida el motor contra los ejemplos entregados (Node 20+)
npm run build
```

## Arquitectura

```
UI (pages, components/despiece — genérico para todos los productos)
  ↓
hooks/useDespiece.js         estado del formulario + ajustes
  ↓
services/despieceService.js  valida → calcula → aplica ajustes
  ↓
calculations/engine/         motor genérico (funciones puras, sin React)
  ↓
data/reglas/                 reglas de cada producto (datos, no código)
  ↑
database/repositorio.js      acceso a datos (hoy local; luego SQL Server / Supabase)
```

- **Cambiar una medida** = editar un número en `src/data/reglas/<categoria>/…`. No se toca ningún componente.
- Ayudantes de fórmulas en `src/data/reglas/formulas.js`: `base(-0.005, 2)`, `altura(-0.011)`, `pieza('translape', -0.069)`, `fija(0.15)`.
- Productos sin naves (puertas, garajes) usan la configuración `unica`; las piezas pueden tener `grupo` (ej. Marco/Paneles) y `nota` (aviso por pieza).
- `src/modules/<modulo>/index.js`: título y textos de cada pantalla.
- **Fórmula** de cada pieza: `(referencia + sumar) ÷ dividir`, donde la referencia es `BASE`, `ALTURA`, `FIJO` o `pieza:<codigo>`.
- **Ajustes manuales**: se guardan aparte (`{ jamba: 1.515 }`); cada pieza conserva `medidaCalculada` y `medidaAjustada`.
- Parámetros del slider (rango ±0.05 m, paso 1 mm) y redondeo: `src/data/config/calculo.js`.
- Colores y vidrios: `src/data/catalogos/`.
- Nuevo producto: agregar un archivo de reglas en `src/data/reglas/<categoria>/` y registrarlo en el repositorio.

## Unidades

Todas las medidas están en **metros**. Se muestran (pantalla, Excel y PDF) con **2 decimales y el
milímetro elevado**: `1.25⁷ m` = 1 metro, 25 centímetros, 7 milímetros. Sin milímetros: `0.58 m`.
Vidrio: `alto × ancho` (ej. `1.43⁸ × 0.65⁴ m`). Internamente se guardan como número (1.257).
Formato en `src/utils/formato.js` → `formatMetros()`.

Al escribir se acepta metros (`2.74`), centímetros (`274`) o milímetros (`2740`): menos de 10 = m,
de 10 a 999 = cm, 1000 o más = mm (`calculations/engine/unidades.js`). La pantalla avisa la conversión.

## Exportar a Excel y PDF

Botones **Excel** y **PDF** sobre el despiece. Ambos archivos salen del mismo reporte
(`services/exportacion/reporteDespiece.js`), así siempre muestran lo mismo que la pantalla,
incluidos los ajustes manuales. No usan librerías externas:

- `utils/xlsx.js` + `utils/zip.js`: generan un .xlsx real (medidas con el mismo formato 1.25⁷).
- `utils/pdf.js`: genera un PDF A4 con tabla, paginación, pie de página y milímetro elevado.
- `services/exportacionService.js`: `exportarDespiece(resultado, 'excel' | 'pdf')` → sirve para
  cualquier producto (puertas, garajes) sin cambios.

## Estructura del resultado

```js
{
  productoId: 'ventana-744', producto: 'Ventana 7-44', categoria: 'ventanas',
  base: 1.417, altura: 1.53, naves: 2, color: {...}, vidrio: {...},
  estadoReglas: 'confirmada', notaReglas: null, versionReglas: 1,
  piezas: [
    { codigo: 'jamba', nombre: 'Jamba', tipo: 'perfil', cantidad: 2, unidad: 'm',
      medida: 1.515, medidaCalculada: 1.519, medidaAjustada: 1.515, calculado: true, ajustado: true,
      formula: { ref: 'ALTURA', sumar: -0.011 } },  // Altura − 0.011 m
    { codigo: 'vidrio', tipo: 'vidrio', cantidad: 2, medida: { alto: 1.438, ancho: 0.654 }, ... },
    { codigo: 'rodamiento', tipo: 'herraje', cantidad: 2, unidad: 'unidad', medida: null, ... }
  ]
}
```

