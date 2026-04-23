import clsx from "clsx";
import type { StandingRow } from "@/types/domain";
import { TeamBadge } from "@/components/common/TeamBadge";

interface StandingsTableProps {
  standings: StandingRow[];
  compact?: boolean;
  showPromotion?: boolean;
  showPlayoff?: boolean;
}

export function StandingsTable({ standings, compact = false, showPromotion = false, showPlayoff = false }: StandingsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-surface-600">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-700 text-gray-400 text-xs uppercase tracking-wider">
            <th className="px-3 py-3 text-left w-8">#</th>
            <th className="px-3 py-3 text-left">Equipo</th>
            <th className="px-3 py-3 text-center">PJ</th>
            <th className="px-3 py-3 text-center">G</th>
            <th className="px-3 py-3 text-center">E</th>
            <th className="px-3 py-3 text-center">P</th>
            {!compact && (
              <>
                <th className="px-3 py-3 text-center">PF</th>
                <th className="px-3 py-3 text-center">PC</th>
                <th className="px-3 py-3 text-center">Dif</th>
                <th className="px-3 py-3 text-center">BO</th>
                <th className="px-3 py-3 text-center">BD</th>
              </>
            )}
            <th className="px-3 py-3 text-center font-bold text-white">Pts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-600">
          {standings.map((row) => (
            <tr
              key={row.id}
              className={clsx(
                "transition-colors border-l-2",
                row.isTracked
                  ? "bg-brand-500/10 border-l-brand-500"
                  : showPromotion && row.position === 1
                  ? "border-l-emerald-500 hover:bg-surface-700"
                  : (showPromotion && row.position >= 2 && row.position <= 5) || (showPlayoff && row.position >= 1 && row.position <= 4)
                  ? "border-l-yellow-500 hover:bg-surface-700"
                  : "border-l-transparent hover:bg-surface-700"
              )}
            >
              <td className="px-3 py-3 text-gray-400 text-center font-medium">
                <div className="flex flex-col items-center gap-0.5">
                  <span>{row.position}</span>
                  {showPromotion && row.position === 1 && (
                    <span className="text-[9px] font-semibold text-emerald-400 uppercase leading-none">Ascenso</span>
                  )}
                  {((showPromotion && row.position >= 2 && row.position <= 5) || (showPlayoff && row.position >= 1 && row.position <= 4)) && (
                    <span className="text-[9px] font-semibold text-yellow-400 uppercase leading-none">Playoff</span>
                  )}
                </div>
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <TeamBadge
                    imageUrl={row.team.club.imageUrl}
                    name={row.team.name}
                    size="xs"
                  />
                  <span
                    className={clsx(
                      "font-medium whitespace-nowrap",
                      row.isTracked ? "text-brand-300" : "text-gray-200"
                    )}
                  >
                    {row.team.name}
                    {row.champion && (
                      <span className="ml-1 text-yellow-400" title="Campeón">
                        ★
                      </span>
                    )}
                  </span>
                </div>
              </td>
              <td className="px-3 py-3 text-center text-gray-300">{row.played}</td>
              <td className="px-3 py-3 text-center text-emerald-400 font-medium">{row.won}</td>
              <td className="px-3 py-3 text-center text-yellow-400">{row.tied}</td>
              <td className="px-3 py-3 text-center text-red-400">{row.lost}</td>
              {!compact && (
                <>
                  <td className="px-3 py-3 text-center text-gray-300">{row.pointsFavor}</td>
                  <td className="px-3 py-3 text-center text-gray-300">{row.pointsAgainst}</td>
                  <td
                    className={clsx(
                      "px-3 py-3 text-center font-medium",
                      row.pointsDiff > 0 ? "text-emerald-400" : row.pointsDiff < 0 ? "text-red-400" : "text-gray-400"
                    )}
                  >
                    {row.pointsDiff > 0 ? `+${row.pointsDiff}` : row.pointsDiff}
                  </td>
                  <td className="px-3 py-3 text-center text-gray-400">{row.bonusOffensive}</td>
                  <td className="px-3 py-3 text-center text-gray-400">{row.bonusDefensive}</td>
                </>
              )}
              <td
                className={clsx(
                  "px-3 py-3 text-center text-base font-bold",
                  row.isTracked ? "text-brand-300" : "text-white"
                )}
              >
                {row.pointsTotal}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
