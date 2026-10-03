/**
 * AJUSTES MANUALES
 *
 * Los ajustes NO modifican las reglas ni el valor calculado.
 * Se guardan aparte como un mapa:
 *   { jamba: 1.515, 'vidrio.alto': 1.44, 'vidrio.ancho': 0.65 }
 * y se aplican sobre una copia del resultado.
 */

export function claveAjuste(codigo, dimension) {
  return dimension ? `${codigo}.${dimension}` : codigo;
}

export function aplicarAjustes(resultado, ajustes = {}) {
  const piezas = resultado.piezas.map((pieza) => {
    if (pieza.medidaCalculada == null) return pieza;

    if (typeof pieza.medidaCalculada === 'number') {
      const ajuste = ajustes[pieza.codigo];
      const ajustado = esAjusteValido(ajuste) && ajuste !== pieza.medidaCalculada;
      return {
        ...pieza,
        medidaAjustada: ajustado ? ajuste : null,
        medida: ajustado ? ajuste : pieza.medidaCalculada,
        ajustado,
      };
    }

    // Piezas con varias dimensiones (vidrio: alto × ancho)
    const medida = {};
    const medidaAjustada = {};
    let ajustado = false;
    for (const [dim, calculado] of Object.entries(pieza.medidaCalculada)) {
      const ajuste = ajustes[claveAjuste(pieza.codigo, dim)];
      if (esAjusteValido(ajuste) && ajuste !== calculado) {
        medida[dim] = ajuste;
        medidaAjustada[dim] = ajuste;
        ajustado = true;
      } else {
        medida[dim] = calculado;
      }
    }
    return { ...pieza, medida, medidaAjustada: ajustado ? medidaAjustada : null, ajustado };
  });

  return { ...resultado, piezas };
}

function esAjusteValido(valor) {
  return typeof valor === 'number' && Number.isFinite(valor) && valor > 0;
}
