import { useQueries } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { rugbyTournaments, hockeyTournaments } from "@/config/tournaments";
import { getProvider } from "@/services/providers";
import type { TournamentDataResult } from "@/services/providers";
import type { TournamentConfig } from "@/config/tournaments";
import { getLastPlayedMatchForTeam } from "@/utils/matchHelpers";
import { MatchCard } from "@/components/fixtures/MatchCard";

const STALE_TIME = 5 * 60 * 1000;

interface TournamentResultProps {
  tournament: TournamentConfig;
  data: TournamentDataResult | undefined;
  isLoading: boolean;
  isError: boolean;
}

function TournamentResult({ tournament, data, isLoading, isError }: TournamentResultProps) {
  return (
    <section className="border-b border-brand-700 pb-6 last:border-0">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-white">{tournament.name}</h2>
        <Link
          to={`/torneo/${tournament.slug}`}
          className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
        >
          Ver torneo →
        </Link>
      </div>

      {isLoading && (
        <div className="bg-brand-700 rounded-xl p-4 text-center text-gray-500 text-sm">
          Cargando...
        </div>
      )}

      {isError && !isLoading && (
        <div className="bg-brand-700 rounded-xl p-4 text-center text-gray-500 text-sm">
          Error al cargar datos
        </div>
      )}

      {data && (() => {
        const trackedTeam = data.standings.find((s) => s.isTracked)?.team;
        if (!trackedTeam) {
          return (
            <div className="bg-brand-700 rounded-xl p-4 text-center text-gray-500 text-sm">
              Champagnat no encontrado
            </div>
          );
        }

        const lastMatch = getLastPlayedMatchForTeam(data.championship, trackedTeam.id);
        if (!lastMatch) {
          return (
            <div className="bg-brand-700 rounded-xl p-4 text-center text-gray-500 text-sm">
              Sin partidos jugados
            </div>
          );
        }

        const round = data.championship.rounds.find((r) => r.id === lastMatch.roundId);

        return (
          <div>
            {round && (
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{round.name}</p>
            )}
            <MatchCard match={lastMatch} highlightTeamId={trackedTeam.id} />
          </div>
        );
      })()}
    </section>
  );
}

export function LastResultsPage() {
  const [searchParams] = useSearchParams();
  const sport = searchParams.get("sport") === "hockey" ? "hockey" : "rugby";
  const activeTournaments = sport === "hockey" ? hockeyTournaments : rugbyTournaments;

  const results = useQueries({
    queries: activeTournaments.map((t) => ({
      queryKey: ["tournament", t.slug],
      queryFn: () =>
        getProvider(t.sport).getChampionship(t.id, t.trackedTeamName, t.trackedTeamId),
      staleTime: STALE_TIME,
      retry: 2,
    })),
  });

  const loadingCount = results.filter((r) => r.isLoading).length;
  const sportLabel = sport === "hockey" ? "Hockey" : "Rugby";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Últimos Resultados — {sportLabel}</h1>
        <p className="text-gray-400 mt-1">
          Último partido jugado por Champagnat en cada división
          {loadingCount > 0 && (
            <span className="ml-2 text-xs text-gray-600">
              — cargando {loadingCount}...
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {activeTournaments.map((tournament, i) => (
          <TournamentResult
            key={tournament.slug}
            tournament={tournament}
            data={results[i].data}
            isLoading={results[i].isLoading}
            isError={results[i].isError}
          />
        ))}
      </div>
    </div>
  );
}
