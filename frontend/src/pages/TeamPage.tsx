import { useState } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";
import { useTournamentDataBySlug } from "@/hooks/useTournamentData";
import { useTeamStats } from "@/hooks/useTeamData";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { TeamBadge } from "@/components/common/TeamBadge";
import { MatchCard } from "@/components/fixtures/MatchCard";
import { DataSourceBadge } from "@/components/common/DataSourceBadge";
import { appConfig } from "@/config/appConfig";
import { getMatchResult, getTeamRole } from "@/utils/teamHelpers";
import type { Match } from "@/types/domain";

type FilterRole = "all" | "local" | "visit";

export function TeamPage() {
  const { slug } = useParams<{ slug: string }>();
  const [roleFilter, setRoleFilter] = useState<FilterRole>("all");

  const { data, isLoading, isError, error, refetch, tournament } = useTournamentDataBySlug(slug);

  const teamStats = useTeamStats(
    data?.championship,
    data?.standings,
    tournament?.trackedTeamName ?? appConfig.trackedTeamName,
    tournament?.trackedTeamId
  );

  if (isLoading) return <LoadingSpinner label="Cargando datos del equipo..." />;
  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;
  if (!data) return null;
  if (!teamStats) {
    return (
      <EmptyState
        title="Equipo no encontrado"
        message={`San Cirano no fue encontrado en el torneo ${data.championship.name}.`}
      />
    );
  }

  const { team, standing, playedMatches, upcomingMatches, lastMatch, nextMatch } = teamStats;
  const { source, lastSync } = data;

  function filterByRole(matches: Match[]): Match[] {
    if (roleFilter === "all") return matches;
    return matches.filter((m) => getTeamRole(m, team.id) === roleFilter);
  }

  const filteredPlayed = filterByRole(playedMatches);
  const filteredUpcoming = filterByRole(upcomingMatches);

  const wins = playedMatches.filter((m) => getMatchResult(m, team.id) === "won").length;
  const losses = playedMatches.filter((m) => getMatchResult(m, team.id) === "lost").length;
  const ties = playedMatches.filter((m) => getMatchResult(m, team.id) === "tied").length;

  return (
    <div className="flex flex-col gap-8">
      {/* Header del equipo */}
      <div className="bg-gradient-to-br from-brand-900/40 to-surface-700 rounded-2xl border border-brand-500/20 p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <TeamBadge imageUrl={team.club.imageUrl} name={team.club.name} size="xl" />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-white">{team.club.name}</h1>
            <p className="text-gray-400 mt-1">{data.championship.name}</p>
            {standing && (
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3">
                <span className="text-brand-300 font-semibold text-lg">
                  {standing.position}° en la tabla
                </span>
                <span className="text-white font-bold text-lg">{standing.pointsTotal} pts</span>
              </div>
            )}
          </div>
          <DataSourceBadge source={source} lastSync={lastSync} />
        </div>

        {/* Stats */}
        {standing && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-5">
            {[
              { label: "PJ", value: standing.played, color: "text-gray-200" },
              { label: "G", value: standing.won, color: "text-emerald-400" },
              { label: "E", value: standing.tied, color: "text-yellow-400" },
              { label: "P", value: standing.lost, color: "text-red-400" },
              { label: "PF", value: standing.pointsFavor, color: "text-gray-300" },
              { label: "PC", value: standing.pointsAgainst, color: "text-gray-300" },
              { label: "Dif", value: standing.pointsDiff > 0 ? `+${standing.pointsDiff}` : standing.pointsDiff, color: standing.pointsDiff >= 0 ? "text-emerald-400" : "text-red-400" },
            ].map(({ label, value, color }, idx, arr) => (
              <div
                key={label}
                className={clsx(
                  "bg-surface-800/60 rounded-xl p-3 text-center",
                  idx === arr.length - 1 && arr.length % 2 !== 0 && "col-span-2 sm:col-span-1"
                )}
              >
                <p className={clsx("text-2xl font-bold", color)}>{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Último y próximo partido */}
      <div className="grid sm:grid-cols-2 gap-4">
        {lastMatch && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Último partido
            </h2>
            <MatchCard match={lastMatch} highlightTeamId={team.id} />
            {(() => {
              const r = getMatchResult(lastMatch, team.id);
              const map = { won: ["Victoria", "text-emerald-400"], lost: ["Derrota", "text-red-400"], tied: ["Empate", "text-yellow-400"] } as const;
              return r ? <p className={clsx("text-sm font-bold mt-2 text-center", map[r][1])}>{map[r][0]}</p> : null;
            })()}
          </div>
        )}
        {nextMatch && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Próximo partido
            </h2>
            <MatchCard match={nextMatch} highlightTeamId={team.id} />
          </div>
        )}
      </div>

      {/* Filtro local/visitante */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Filtrar:</span>
        {(["all", "local", "visit"] as FilterRole[]).map((f) => (
          <button
            key={f}
            onClick={() => setRoleFilter(f)}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              roleFilter === f
                ? "bg-brand-600 text-white"
                : "bg-surface-600 text-gray-400 hover:text-gray-200"
            )}
          >
            {{ all: "Todos", local: "Local", visit: "Visitante" }[f]}
          </button>
        ))}
      </div>

      {/* Historial jugados */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">
            Partidos jugados ({filteredPlayed.length})
          </h2>
          <div className="flex gap-3 text-sm">
            <span className="text-emerald-400">{wins}G</span>
            <span className="text-yellow-400">{ties}E</span>
            <span className="text-red-400">{losses}P</span>
          </div>
        </div>
        {filteredPlayed.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[...filteredPlayed]
              .sort((a, b) => new Date(b.playdate).getTime() - new Date(a.playdate).getTime())
              .map((match) => {
                const result = getMatchResult(match, team.id);
                const borderColor = { won: "border-l-emerald-500", lost: "border-l-red-500", tied: "border-l-yellow-500" };
                return (
                  <div key={match.id} className={clsx("border-l-2", result ? borderColor[result] : "border-l-surface-500")}>
                    <MatchCard match={match} highlightTeamId={team.id} />
                  </div>
                );
              })}
          </div>
        ) : (
          <EmptyState message="No hay partidos jugados con ese filtro." />
        )}
      </section>

      {/* Próximos partidos */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">
          Próximos partidos ({filteredUpcoming.length})
        </h2>
        {filteredUpcoming.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredUpcoming
              .sort((a, b) => new Date(a.playdate).getTime() - new Date(b.playdate).getTime())
              .map((match) => (
                <MatchCard key={match.id} match={match} highlightTeamId={team.id} />
              ))}
          </div>
        ) : (
          <EmptyState message="No hay próximos partidos con ese filtro." />
        )}
      </section>
    </div>
  );
}
