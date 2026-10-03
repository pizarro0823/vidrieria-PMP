/** Parámetros generales del motor de despiece y de los ajustes manuales. */
export const CONFIG_CALCULO = {
  /** Decimales en metros con que se redondea cada medida (4 = 0.1 mm). */
  decimalesMetros: 4,
  /** Rango del slider de ajuste alrededor del valor calculado (metros). */
  rangoAjusteMetros: 0.05,
  /** Paso del slider / botones +/- (metros). 0.001 = 1 mm. */
  pasoAjusteMetros: 0.001,
  /** Por encima de este valor (y por debajo de 10) se advierte que la medida parece muy grande. */
  medidaMaximaSugeridaMetros: 8,
  /** Un número desde 10 se toma como CENTÍMETROS (97 → 0.97 m). */
  desdeCentimetros: 10,
  /** Un número desde 1000 se toma como MILÍMETROS (2683 → 2.683 m). */
  desdeMilimetros: 1000,
};
