import { Outlet, useParams, useSearchParams } from "react-router-dom";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { getTournamentBySlug, defaultTournament, defaultHockeyTournament } from "@/config/tournaments";
import { useFavicon } from "@/hooks/useFavicon";

export function Layout() {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const currentTournament = slug ? getTournamentBySlug(slug) : undefined;

  // Si no hay slug (ej: página de resultados), usar el sport del query param
  const sportParam = searchParams.get("sport");
  const fallbackTournament = (() => {
    if (currentTournament) return currentTournament;
    if (sportParam === "hockey") {
      const savedHockey = localStorage.getItem("lastHockeyTournamentSlug");
      return (savedHockey ? getTournamentBySlug(savedHockey) : undefined) ?? defaultHockeyTournament;
    }
    const savedSlug = localStorage.getItem("lastTournamentSlug");
    return (savedSlug ? getTournamentBySlug(savedSlug) : undefined) ?? defaultTournament;
  })();

  useFavicon();

  return (
    <div className="min-h-screen w-full bg-brand-900 text-white">
      <Navbar currentTournament={fallbackTournament} />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 sm:pb-8">
        <Outlet />
      </main>
      <footer className="border-t border-brand-600 mt-16 py-6 pb-24 sm:pb-6 text-center text-xs text-brand-400/50">
        Champagnat Sports Hub 2026 — Datos: api.urba.org.ar y api.tournamenttracker.buenosaireshockey.ar
      </footer>
      <BottomNav currentTournament={fallbackTournament} />
    </div>
  );
}
