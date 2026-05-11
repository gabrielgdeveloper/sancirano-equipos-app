import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { TournamentSelector } from "@/components/tournament/TournamentSelector";
import { type TournamentConfig } from "@/config/tournaments";

interface NavbarProps {
  currentTournament: TournamentConfig | undefined;
}

export function Navbar({ currentTournament }: NavbarProps) {
  const location = useLocation();
  const slug = currentTournament?.slug;

  const slugLinks = slug
    ? [
        { to: `/torneo/${slug}`, label: "Inicio" },
        { to: `/torneo/${slug}/equipo/san-cirano`, label: "San Cirano" },
        { to: `/torneo/${slug}/posiciones`, label: "Posiciones" },
      ]
    : [];
  const navLinks = [...slugLinks, { to: "/ultimos-resultados", label: "Resultados" }];

  return (
    <header className="sticky top-0 z-50 bg-surface-800/90 backdrop-blur-sm border-b border-surface-600">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-lg font-bold text-white leading-tight">
              San Cirano
              <span className="text-brand-400 ml-1">URBA</span>
              <span className="text-gray-400 text-sm font-normal ml-1">2026</span>
            </span>
          </Link>

          {/* Nav links */}
          {navLinks.length > 0 && (
            <nav className="hidden sm:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={clsx(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === to
                      ? "bg-brand-500/20 text-brand-300"
                      : "text-gray-400 hover:text-gray-200 hover:bg-surface-600"
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}

          {/* Tournament selector */}
          <TournamentSelector current={currentTournament} />
        </div>
      </div>
    </header>
  );
}
