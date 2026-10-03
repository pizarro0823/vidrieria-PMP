const SUPERINDICES = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/**
 * Muestra un texto de medida ("1.25⁷ m") con el milímetro como superíndice real,
 * para que se lea igual de claro en cualquier tipo de letra.
 */
export default function TextoMedida({ children }) {
  if (typeof children !== 'string') return children ?? null;
  const partes = [];
  for (const ch of children) {
    const i = SUPERINDICES.indexOf(ch);
    const sup = i >= 0;
    const car = sup ? String(i) : ch;
    const ultima = partes[partes.length - 1];
    if (ultima && ultima.sup === sup) ultima.t += car;
    else partes.push({ t: car, sup });
  }
  return partes.map((p, k) =>
    p.sup ? (
      <sup key={k} className="ml-px text-[0.68em] font-bold">{p.t}</sup>
    ) : (
      <span key={k}>{p.t}</span>
    ),
  );
}
