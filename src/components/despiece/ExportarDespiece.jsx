import { useState } from 'react';
import Icono from '../ui/Icono.jsx';
import { exportarDespiece } from '../../services/exportacionService.js';
import { descargarArchivo } from '../../utils/descarga.js';

/** Botones para exportar cualquier resultado de despiece a Excel o PDF. */
export default function ExportarDespiece({ resultado }) {
  const [error, setError] = useState(null);

  const exportar = async (formato) => {
    try {
      setError(null);
      await descargarArchivo(exportarDespiece(resultado, formato));
    } catch (e) {
      if (e?.code !== 'declined') setError(`No se pudo exportar: ${e?.message ?? e}`);
    }
  };

  return (
    <div className="flex flex-col items-stretch gap-1 sm:items-end">
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <button
          type="button"
          onClick={() => exportar('excel')}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-700/20 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-800 hover:bg-green-100"
        >
          <Icono nombre="hoja" className="h-4 w-4" /> Excel
        </button>
        <button
          type="button"
          onClick={() => exportar('pdf')}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-700/20 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100"
        >
          <Icono nombre="documento" className="h-4 w-4" /> PDF
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
