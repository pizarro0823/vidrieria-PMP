/**
 * Generador mínimo de PDF (A4) sin dependencias: texto Helvetica, líneas y rectángulos.
 * Coordenadas en puntos, con origen en la esquina SUPERIOR izquierda (más natural para maquetar).
 */

// Anchos Helvetica (AFM estándar) para ASCII 32–126, en milésimas de em.
const ANCHOS = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556,
  556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833,
  722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556,
  556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334,
  260, 334, 584,
];

// Caracteres fuera de Latin-1 que sí existen en WinAnsiEncoding (o se sustituyen).
const WIN_ANSI = { '—': 0x97, '–': 0x96, '•': 0x95, '“': 0x93, '”': 0x94, '‘': 0x91, '’': 0x92, '€': 0x80, '−': 0x2d };

function aWinAnsi(texto) {
  let s = '';
  for (const ch of String(texto)) {
    const c = ch.codePointAt(0);
    const code = c < 128 || (c >= 0xa0 && c <= 0xff) ? c : WIN_ANSI[ch] ?? 0x3f;
    const car = String.fromCharCode(code);
    s += car === '(' || car === ')' || car === '\\' ? `\\${car}` : car;
  }
  return s;
}

function anchoCaracter(ch) {
  const base = ch.normalize('NFD')[0];
  const c = base.charCodeAt(0);
  if (c >= 32 && c <= 126) return ANCHOS[c - 32];
  if (ch === '×' || ch === '÷') return 584;
  if (ch === '—') return 1000;
  return 556;
}

const SUPERINDICES = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const ESCALA_ELEVADO = 0.62;

/** Divide el texto en tramos normales y tramos de dígitos elevados (⁰–⁹ → 0–9). */
function tramos(texto) {
  const salida = [];
  for (const ch of String(texto)) {
    const i = SUPERINDICES.indexOf(ch);
    const elevado = i >= 0;
    const car = elevado ? String(i) : ch;
    const ultimo = salida[salida.length - 1];
    if (ultimo && ultimo.elevado === elevado) ultimo.texto += car;
    else salida.push({ texto: car, elevado });
  }
  return salida;
}

const num = (n) => (Math.round(n * 100) / 100).toString();
const color = (rgb) => rgb.map((v) => num(v / 255)).join(' ');

export class DocumentoPdf {
  constructor() {
    this.ancho = 595.28;
    this.alto = 841.89;
    this.paginas = [];
    this.nuevaPagina();
  }

  nuevaPagina() {
    this.ops = [];
    this.paginas.push(this.ops);
  }

  anchoTexto(texto, tam, negrita = false) {
    let w = 0;
    for (const { texto: t, elevado } of tramos(texto)) {
      for (const ch of t) w += anchoCaracter(ch) * (elevado ? ESCALA_ELEVADO : 1);
    }
    return (w * tam * (negrita ? 1.06 : 1)) / 1000;
  }

  /** alinear: 'izq' | 'der' | 'centro'. y = línea base medida desde arriba. */
  texto(x, y, texto, { tam = 10, negrita = false, rgb = [15, 23, 42], alinear = 'izq' } = {}) {
    if (texto === null || texto === undefined || texto === '') return;
    const w = this.anchoTexto(texto, tam, negrita);
    const px = alinear === 'der' ? x - w : alinear === 'centro' ? x - w / 2 : x;
    const fuente = negrita ? 'F2' : 'F1';
    // Los dígitos elevados (milímetros: 1.25⁷) se dibujan más pequeños y subidos.
    const partes = tramos(texto).map(({ texto: t, elevado }) =>
      elevado
        ? `/${fuente} ${num(tam * ESCALA_ELEVADO)} Tf ${num(tam * 0.38)} Ts (${aWinAnsi(t)}) Tj /${fuente} ${num(tam)} Tf 0 Ts`
        : `(${aWinAnsi(t)}) Tj`,
    );
    this.ops.push(
      `BT /${fuente} ${num(tam)} Tf ${color(rgb)} rg ${num(px)} ${num(this.alto - y)} Td ${partes.join(' ')} ET`,
    );
  }

  rect(x, y, w, h, rgb) {
    this.ops.push(`${color(rgb)} rg ${num(x)} ${num(this.alto - y - h)} ${num(w)} ${num(h)} re f`);
  }

  linea(x1, y1, x2, y2, { rgb = [203, 213, 225], grosor = 0.6 } = {}) {
    this.ops.push(`${color(rgb)} RG ${num(grosor)} w ${num(x1)} ${num(this.alto - y1)} m ${num(x2)} ${num(this.alto - y2)} l S`);
  }

  /** @returns {Uint8Array} */
  generar() {
    const objetos = [];
    const agregar = (contenido) => objetos.push(contenido); // devuelve el id (1..n)

    agregar('<< /Type /Catalog /Pages 2 0 R >>');
    agregar(''); // Pages: se completa al final
    agregar('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    agregar('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');

    const kids = this.paginas.map((ops) => {
      const flujo = ops.join('\n');
      const idContenido = agregar(`<< /Length ${flujo.length} >>\nstream\n${flujo}\nendstream`);
      return agregar(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${this.ancho} ${this.alto}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${idContenido} 0 R >>`,
      );
    });
    objetos[1] = `<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(' ')}] /Count ${kids.length} >>`;

    let salida = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
    const offsets = [];
    objetos.forEach((obj, i) => {
      offsets.push(salida.length);
      salida += `${i + 1} 0 obj\n${obj}\nendobj\n`;
    });
    const xref = salida.length;
    salida += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`;
    salida += offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('');
    salida += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

    const bytes = new Uint8Array(salida.length);
    for (let i = 0; i < salida.length; i++) bytes[i] = salida.charCodeAt(i) & 0xff;
    return bytes;
  }
}
