import { fetchChampionship, fetchPositions } from "@/services/api/urbaApi";
import { mapChampionshipResponse } from "@/services/mappers/championshipMapper";
import { mapStandingsResponse } from "@/services/mappers/standingsMapper";
import type { TournamentDataProvider, TournamentDataResult } from "./TournamentDataProvider";

/**
 * Obtiene datos desde el server local (BFF) que sirve desde SQLite.
 * Los endpoints del server son los mismos — el server internamente resuelve DB vs API.
 * La diferencia la marca el header de respuesta o el campo `source` en el JSON.
 */
export class DbTournamentDataProvider implements TournamentDataProvider {
  async getChampionship(id: number, trackedTeamName: string): Promise<TournamentDataResult> {
    const [championshipResponse, positionsResponse] = await Promise.all([
      fetchChampionship(id),
      fetchPositions(id),
    ]);

    return {
      championship: mapChampionshipResponse(championshipResponse),
      standings: mapStandingsResponse(positionsResponse, trackedTeamName),
      source: "db",
      lastSync: (positionsResponse as any).lastSync ?? null,
    };
  }
}
