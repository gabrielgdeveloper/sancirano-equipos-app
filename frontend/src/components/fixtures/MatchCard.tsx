import clsx from "clsx";
import type { Match } from "@/types/domain";
import { TeamBadge } from "@/components/common/TeamBadge";
import { formatMatchDate } from "@/utils/formatters";

interface MatchCardProps {
  match: Match;
  highlightTeamId?: number;
  compact?: boolean;
}

export function MatchCard({ match, highlightTeamId, compact = false }: MatchCardProps) {
  const { localTeam, visitTeam, score, fulfilled, suspended, playdate } = match;

  const localHighlight = highlightTeamId === localTeam.id;
  const visitHighlight = highlightTeamId === visitTeam.id;

  return (
    <div
      className={clsx(
        "bg-surface-700 rounded-xl p-3 flex flex-col gap-2 border",
        fulfilled ? "border-surface-500" : "border-surface-600",
        suspended && "opacity-60"
      )}
    >
      {/* Fecha y estado */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatMatchDate(playdate)}</span>
        {suspended && <span className="text-yellow-400 font-medium">Suspendido</span>}
        {!fulfilled && !suspended && <span className="text-gray-500">Pendiente</span>}
        {fulfilled && <span className="text-emerald-400 font-medium">Jugado</span>}
      </div>

      {/* Equipos y marcador — layout vertical en mobile, horizontal en sm+ */}
      <div className="flex flex-col gap-1 sm:hidden">
        {/* Local */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <TeamBadge imageUrl={localTeam.club.imageUrl} name={localTeam.name} size="xs" />
            <span className={clsx("text-sm font-medium truncate", localHighlight ? "text-brand-400" : "text-gray-200")}>
              {localTeam.name}
            </span>
          </div>
          <span className={clsx("text-lg font-bold tabular-nums flex-shrink-0", localHighlight ? "text-brand-400" : "text-white")}>
            {fulfilled && score != null ? score.localScore : "–"}
          </span>
        </div>

        {/* Visitante */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <TeamBadge imageUrl={visitTeam.club.imageUrl} name={visitTeam.name} size="xs" />
            <span className={clsx("text-sm font-medium truncate", visitHighlight ? "text-brand-400" : "text-gray-200")}>
              {visitTeam.name}
            </span>
          </div>
          <span className={clsx("text-lg font-bold tabular-nums flex-shrink-0", visitHighlight ? "text-brand-400" : "text-white")}>
            {fulfilled && score != null ? score.visitScore : "–"}
          </span>
        </div>

        {/* Bonus mobile */}
        {fulfilled && score && (score.localOffensiveBonus > 0 || score.localDefensiveBonus > 0 || score.visitOffensiveBonus > 0 || score.visitDefensiveBonus > 0) && (
          <div className="flex gap-3 text-xs mt-0.5 pl-9">
            <span>
              {score.localOffensiveBonus > 0 && <span className="text-brand-400">+{score.localOffensiveBonus}B</span>}
              {score.localDefensiveBonus > 0 && <span className="text-emerald-400 ml-1">+{score.localDefensiveBonus}D</span>}
            </span>
            <span>
              {score.visitOffensiveBonus > 0 && <span className="text-brand-400">+{score.visitOffensiveBonus}B</span>}
              {score.visitDefensiveBonus > 0 && <span className="text-emerald-400 ml-1">+{score.visitDefensiveBonus}D</span>}
            </span>
          </div>
        )}
      </div>

      {/* Layout horizontal — solo sm+ */}
      <div className="hidden sm:flex items-center justify-between gap-2">
        {/* Local */}
        <div className={clsx("flex items-center gap-2 flex-1 min-w-0", compact ? "flex-col text-center" : "")}>
          <TeamBadge imageUrl={localTeam.club.imageUrl} name={localTeam.name} size={compact ? "xs" : "sm"} />
          <span className={clsx("text-sm font-medium leading-tight truncate", localHighlight ? "text-brand-400" : "text-gray-200")}>
            {localTeam.name}
          </span>
        </div>

        {/* Marcador */}
        <div className="flex-shrink-0 text-center min-w-[80px]">
          {fulfilled && score ? (
            <div className="flex items-center justify-center gap-1">
              <span className={clsx("text-2xl font-bold tabular-nums", localHighlight ? "text-brand-400" : "text-white")}>
                {score.localScore}
              </span>
              <span className="text-gray-500 text-lg">–</span>
              <span className={clsx("text-2xl font-bold tabular-nums", visitHighlight ? "text-brand-400" : "text-white")}>
                {score.visitScore}
              </span>
            </div>
          ) : (
            <span className="text-gray-600 text-sm font-medium">vs</span>
          )}
          {fulfilled && score && (
            <div className="flex items-center justify-center gap-3 mt-1 text-xs text-gray-500">
              <span>
                {score.localOffensiveBonus > 0 && <span className="text-brand-400">+{score.localOffensiveBonus}B</span>}
                {score.localDefensiveBonus > 0 && <span className="text-emerald-400 ml-1">+{score.localDefensiveBonus}D</span>}
              </span>
              <span>
                {score.visitOffensiveBonus > 0 && <span className="text-brand-400">+{score.visitOffensiveBonus}B</span>}
                {score.visitDefensiveBonus > 0 && <span className="text-emerald-400 ml-1">+{score.visitDefensiveBonus}D</span>}
              </span>
            </div>
          )}
        </div>

        {/* Visitante */}
        <div className={clsx("flex items-center gap-2 flex-1 min-w-0 justify-end", compact ? "flex-col-reverse text-center" : "")}>
          <span className={clsx("text-sm font-medium leading-tight truncate text-right", visitHighlight ? "text-brand-400" : "text-gray-200")}>
            {visitTeam.name}
          </span>
          <TeamBadge imageUrl={visitTeam.club.imageUrl} name={visitTeam.name} size={compact ? "xs" : "sm"} />
        </div>
      </div>
    </div>
  );
}
