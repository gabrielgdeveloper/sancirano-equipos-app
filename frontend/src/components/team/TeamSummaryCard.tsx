import { Link } from "react-router-dom";
import clsx from "clsx";
import type { TeamStats } from "@/types/domain";
import { TeamBadge } from "@/components/common/TeamBadge";
import { MatchCard } from "@/components/fixtures/MatchCard";
import { getMatchResult } from "@/utils/teamHelpers";

interface TeamSummaryCardProps {
  stats: TeamStats;
  tournamentSlug: string;
  trackedTeamName?: string;
}

export function TeamSummaryCard({ stats, tournamentSlug, trackedTeamName }: TeamSummaryCardProps) {
  const { team, standing, lastMatch, nextMatch } = stats;
  const displayName = trackedTeamName ?? team.club.name;

  return (
    <div className="bg-gradient-to-br from-brand-900/30 to-surface-700 rounded-2xl border border-brand-500/20 p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <TeamBadge imageUrl={team.club.imageUrl} name={displayName} size="lg" />
        <div>
          <h2 className="text-xl font-bold text-white">{displayName}</h2>
          {standing && (
            <p className="text-brand-300 text-sm mt-0.5">
              {standing.position}° posición — {standing.pointsTotal} pts
            </p>
          )}
        </div>
      </div>

      {/* Stats rápidos */}
      {standing && (
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: "Jugados", value: standing.played, color: "text-gray-300" },
            { label: "Ganados", value: standing.won, color: "text-emerald-400" },
            { label: "Empatados", value: standing.tied, color: "text-yellow-400" },
            { label: "Perdidos", value: standing.lost, color: "text-red-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-surface-800/60 rounded-lg p-2">
              <p className={clsx("text-xl font-bold", color)}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Último y próximo partido */}
      <div className="grid sm:grid-cols-2 gap-3">
        {lastMatch && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Último partido</p>
            <MatchCard match={lastMatch} highlightTeamId={team.id} compact />
            {(() => {
              const result = getMatchResult(lastMatch, team.id);
              const resultMap = { won: "Victoria", lost: "Derrota", tied: "Empate" };
              const colorMap = {
                won: "text-emerald-400",
                lost: "text-red-400",
                tied: "text-yellow-400",
              };
              return result ? (
                <p className={clsx("text-xs font-semibold mt-1 text-center", colorMap[result])}>
                  {resultMap[result]}
                </p>
              ) : null;
            })()}
          </div>
        )}
        {nextMatch && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Próximo partido</p>
            <MatchCard match={nextMatch} highlightTeamId={team.id} compact />
          </div>
        )}
      </div>

      {/* CTA */}
      <Link
        to={`/torneo/${tournamentSlug}/equipo/san-cirano`}
        className="text-center text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors py-1"
      >
        Ver detalle completo →
      </Link>
    </div>
  );
}
