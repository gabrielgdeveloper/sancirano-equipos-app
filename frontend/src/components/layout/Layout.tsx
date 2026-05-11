import { Outlet, useParams } from "react-router-dom";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { getTournamentBySlug, defaultTournament } from "@/config/tournaments";
import { useFavicon } from "@/hooks/useFavicon";

export function Layout() {
  const { slug } = useParams<{ slug?: string }>();
  const currentTournament = slug ? getTournamentBySlug(slug) : undefined;
  const savedSlug = localStorage.getItem("lastTournamentSlug");
  const effectiveTournament =
    currentTournament ??
    (savedSlug ? getTournamentBySlug(savedSlug) : undefined) ??
    defaultTournament;
  useFavicon(currentTournament ?? defaultTournament);

  return (
    <div className="min-h-screen w-full bg-surface-900 text-white">
      <Navbar currentTournament={effectiveTournament} />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 sm:pb-8">
        <Outlet />
      </main>
      <footer className="border-t border-surface-700 mt-16 py-6 pb-24 sm:pb-6 text-center text-xs text-gray-600">
        Planteles San Cirano URBA 2026 — Datos: api.urba.org.ar
      </footer>
      <BottomNav currentTournament={effectiveTournament} />
    </div>
  );
}
