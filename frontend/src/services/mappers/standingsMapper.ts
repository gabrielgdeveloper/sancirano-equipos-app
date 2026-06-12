import type { ApiPositionsResponse, ApiStanding } from "@/types/api";
import type { StandingRow } from "@/types/domain";
import { mapTeam } from "./championshipMapper";

type TeamSpec = { name: string; id?: number };

function isTeamTracked(api: ApiStanding, specs: TeamSpec[]): boolean {
  return specs.some(({ name, id }) => {
    if (id != null && api.team_id === id) return true;
    const normalizedTracked = name.toLowerCase().trim();
    const normalizedTeamName = api.team.club.name.toLowerCase().trim();
    const normalizedTeamFull = api.team.name.toLowerCase().trim();
    return normalizedTeamName === normalizedTracked ||
      normalizedTeamFull === normalizedTracked ||
      (normalizedTracked.length > 5 && (normalizedTeamName.includes(normalizedTracked) || normalizedTeamFull.includes(normalizedTracked)));
  });
}

function mapStanding(api: ApiStanding, specs: TeamSpec[]): StandingRow {
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
    isTracked: isTeamTracked(api, specs),
  };
}

export function mapStandingsResponse(
  response: ApiPositionsResponse,
  trackedTeamName: string,
  trackedTeamId?: number,
  trackedTeams?: TeamSpec[]
): StandingRow[] {
  const specs: TeamSpec[] = trackedTeams ?? [{ name: trackedTeamName, id: trackedTeamId }];
  return response.positions
    .map((s) => mapStanding(s, specs))
    .sort((a, b) => a.position - b.position);
}
