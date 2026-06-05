import { Link } from "react-router-dom";

export function HockeyPage() {
  return (
    <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center flex flex-col items-center gap-6">
        <span className="text-6xl">🏑</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Hockey
        </h1>
        <p className="text-xl text-brand-400 font-semibold">Próximamente</p>
        <p className="text-gray-400 text-base">
          Los resultados de Hockey estarán disponibles muy pronto. ¡Volvé en breve!
        </p>
        <Link
          to="/"
          className="mt-4 px-6 py-3 rounded-xl bg-surface-600 hover:bg-surface-500 transition-colors text-white font-medium border border-surface-400"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
