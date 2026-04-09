import type { ApiPositionsResponse, ApiStanding } from "@/types/api";
import type { StandingRow } from "@/types/domain";
import { mapTeam } from "./championshipMapper";

function mapStanding(api: ApiStanding, trackedTeamName: string, trackedTeamId?: number): StandingRow {
  const isTracked = trackedTeamId != null
    ? api.team_id === trackedTeamId
    : (() => {
        const normalizedTracked = trackedTeamName.toLowerCase().trim();
        const normalizedTeamName = api.team.club.name.toLowerCase().trim();
        return normalizedTeamName.includes(normalizedTracked) || normalizedTracked.includes(normalizedTeamName);
      })();

  return {
    id: api.id,
    position: api.position,
    team: mapTeam(api.team),
    played: api.played,
    won: api.won,
    tied: api.tied,
    lost: api.lost,
    pointsFavor: api.points_favor,
    pointsAgainst: api.points_against,
    pointsDiff: api.points_favor - api.points_against,
    bonusOffensive: api.bonus_offensive,
    bonusDefensive: api.bonus_defensive,
    totalBonus: api.bonus_offensive + api.bonus_defensive,
    pointsTotal: api.points_total,
    champion: api.champion,
    isTracked,
  };
}

export function mapStandingsResponse(
  response: ApiPositionsResponse,
  trackedTeamName: string,
  trackedTeamId?: number
): StandingRow[] {
  return response.positions
    .map((s) => mapStanding(s, trackedTeamName, trackedTeamId))
    .sort((a, b) => a.position - b.position);
}
