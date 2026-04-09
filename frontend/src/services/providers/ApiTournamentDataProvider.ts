import { fetchChampionship, fetchPositions } from "@/services/api/urbaApi";
import { mapChampionshipResponse } from "@/services/mappers/championshipMapper";
import { mapStandingsResponse } from "@/services/mappers/standingsMapper";
import type { TournamentDataProvider, TournamentDataResult } from "./TournamentDataProvider";

/**
 * Obtiene datos directamente desde las APIs externas de URBA.
 * Sin caché persistente — siempre datos frescos.
 */
export class ApiTournamentDataProvider implements TournamentDataProvider {
  async getChampionship(id: number, trackedTeamName: string, trackedTeamId?: number): Promise<TournamentDataResult> {
    const [championshipResponse, positionsResponse] = await Promise.all([
      fetchChampionship(id),
      fetchPositions(id),
    ]);

    return {
      championship: mapChampionshipResponse(championshipResponse),
      standings: mapStandingsResponse(positionsResponse, trackedTeamName, trackedTeamId),
      source: "api",
      lastSync: null,
    };
  }
}
