/**
 * Pruebas del motor contra TODOS los ejemplos entregados por Daniel Gil.
 * Cada configuración de cada producto trae sus ejemplos en data/reglas (campo `ejemplos`).
 * Ejecutar:  npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VENTANAS } from '../../data/reglas/ventanas/index.js';
import { PUERTAS } from '../../data/reglas/puertas/index.js';
import { GARAJES } from '../../data/reglas/garajes/index.js';
import { VENTANA_744 } from '../../data/reglas/ventanas/ventana744.js';
import { PUERTA_CIEGA } from '../../data/reglas/puertas/index.js';
import { calcularDespieceProducto } from '../../services/despieceService.js';

const COLOR = { id: 'negro', nombre: 'Negro' };
const VIDRIO = { id: 'transparente', nombre: 'Transparente' };

const entradaDe = (producto, clave, ejemplo) => ({
  naves: producto.usaNaves ? Number(clave) : null,
  base: ejemplo.base,
  altura: ejemplo.altura,
  color: COLOR,
  vidrio: producto.usaVidrio ? VIDRIO : null,
});

for (const producto of [...VENTANAS, ...PUERTAS, ...GARAJES]) {
  for (const [clave, config] of Object.entries(producto.configuraciones)) {
    for (const ejemplo of config.ejemplos ?? []) {
      test(`${producto.nombre}${producto.usaNaves ? ` · ${clave} naves` : ''} · ${ejemplo.base} × ${ejemplo.altura}`, () => {
        const r = calcularDespieceProducto(producto, entradaDe(producto, clave, ejemplo));
        assert.ok(r.ok, JSON.stringify(r.errores));
        const piezas = Object.fromEntries(r.resultado.piezas.map((p) => [p.codigo, p]));
        assert.deepEqual(Object.keys(piezas).sort(), Object.keys(ejemplo.esperado).sort(), 'piezas');
        for (const [codigo, [cantidad, medida]] of Object.entries(ejemplo.esperado)) {
          assert.equal(piezas[codigo].cantidad, cantidad, `${codigo}: cantidad`);
          assert.deepEqual(piezas[codigo].medidaCalculada, medida, `${codigo}: medida`);
          assert.equal(piezas[codigo].ajustado, false);
        }
      });
    }
  }
}

test('Ajuste manual conserva el valor calculado', () => {
  const r = calcularDespieceProducto(
    VENTANA_744,
    { naves: 2, base: 1.417, altura: 1.53, color: COLOR, vidrio: VIDRIO },
    { jamba: 1.515, 'vidrio.ancho': 0.65 },
  );
  const p = Object.fromEntries(r.resultado.piezas.map((x) => [x.codigo, x]));
  assert.equal(p.jamba.medidaCalculada, 1.519);
  assert.equal(p.jamba.medidaAjustada, 1.515);
  assert.equal(p.jamba.medida, 1.515);
  assert.equal(p.jamba.ajustado, true);
  assert.deepEqual(p.vidrio.medida, { alto: 1.438, ancho: 0.65 });
  assert.equal(p.cabezal.ajustado, false);
});

test('Validaciones ventana', () => {
  const r = calcularDespieceProducto(VENTANA_744, { naves: 3, base: 0, altura: null, color: null, vidrio: null });
  assert.equal(r.ok, false);
  assert.equal(r.errores.base, 'La base debe ser mayor que 0.');
  assert.equal(r.errores.altura, 'La altura es obligatoria.');
  assert.match(r.errores.naves, /no tiene reglas para 3 naves/);
  assert.ok(r.errores.color);
  assert.ok(r.errores.vidrio);
});

test('Puerta: no pide naves ni vidrio', () => {
  const r = calcularDespieceProducto(PUERTA_CIEGA, { naves: null, base: 0.97, altura: 2.74, color: COLOR, vidrio: null });
  assert.ok(r.ok, JSON.stringify(r.errores));
  assert.equal(r.resultado.naves, null);
});

test('Medidas escritas en centímetros o milímetros', () => {
  const cm = calcularDespieceProducto(PUERTA_CIEGA, { base: 97, altura: 274, color: COLOR });
  assert.ok(cm.ok);
  assert.equal(cm.resultado.base, 0.97);
  assert.equal(cm.resultado.altura, 2.74);
  assert.equal(cm.avisos.length, 2);
  const u70 = cm.resultado.piezas.find((p) => p.codigo === 'u70');
  assert.equal(u70.medidaCalculada, 0.752);
  const mm = calcularDespieceProducto(PUERTA_CIEGA, { base: 970, altura: 2740, color: COLOR });
  assert.equal(mm.resultado.base, 9.7); // 970 se toma como cm (9.70 m): solo desde 1000 es mm
  assert.equal(mm.resultado.altura, 2.74);
});
