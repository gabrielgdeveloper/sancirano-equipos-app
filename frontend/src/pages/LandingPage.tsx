import { Link } from "react-router-dom";
import { defaultTournament, defaultHockeyTournament } from "@/config/tournaments";

export function LandingPage() {
  const rugbySlug =
    localStorage.getItem("lastTournamentSlug") ?? defaultTournament.slug;
  const hockeySlug =
    localStorage.getItem("lastHockeyTournamentSlug") ?? defaultHockeyTournament.slug;

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center flex flex-col items-center gap-8">
        {/* Title */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            San Cirano{" "}
            <span className="text-brand-400">Sports Hub</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-md mx-auto">
            Resultados, fixtures y toda la info de los equipos de Rugby y Hockey.
          </p>
        </div>

        {/* Sport buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            to={`/torneo/${rugbySlug}`}
            className="flex-1 sm:flex-none flex flex-col items-center gap-2 px-10 py-6 rounded-2xl bg-brand-600 hover:bg-brand-500 transition-colors text-white font-bold text-xl shadow-lg shadow-brand-900/40"
          >
            <span className="text-3xl">🏉</span>
            Rugby
          </Link>

          <Link
            to={`/torneo/${hockeySlug}`}
            className="flex-1 sm:flex-none flex flex-col items-center gap-2 px-10 py-6 rounded-2xl bg-surface-600 hover:bg-surface-500 transition-colors text-gray-300 font-bold text-xl border border-surface-400 shadow-lg"
          >
            <span className="text-3xl">🏑</span>
            Hockey
          </Link>
        </div>
      </div>
    </div>
  );
}
