import { fetchHockeyChampionship, fetchHockeyPositions } from "@/services/api/urbaApi";
import { mapChampionshipResponse } from "@/services/mappers/championshipMapper";
import { mapStandingsResponse } from "@/services/mappers/standingsMapper";
import type { TournamentDataProvider, TournamentDataResult } from "./TournamentDataProvider";

export class HockeyTournamentDataProvider implements TournamentDataProvider {
  async getChampionship(id: number, trackedTeamName: string, trackedTeamId?: number, trackedTeams?: Array<{ name: string; id?: number }>): Promise<TournamentDataResult> {
    const [championshipResponse, positionsResponse] = await Promise.all([
      fetchHockeyChampionship(id),
      fetchHockeyPositions(id),
    ]);

    return {
      championship: mapChampionshipResponse(championshipResponse),
      standings: mapStandingsResponse(positionsResponse, trackedTeamName, trackedTeamId, trackedTeams),
      source: (positionsResponse as any).source ?? "api",
      lastSync: (positionsResponse as any).lastSync ?? null,
    };
  }
}
