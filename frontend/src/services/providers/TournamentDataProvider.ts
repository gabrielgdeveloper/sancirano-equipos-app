import type { Championship, StandingRow } from "@/types/domain";

export interface TournamentDataResult {
  championship: Championship;
  standings: StandingRow[];
  source: "api" | "db";
  lastSync: string | null;
}

/**
 * Interfaz que desacopla la UI del origen de datos.
 * Implementada por ApiTournamentDataProvider y DbTournamentDataProvider.
 */
export interface TournamentDataProvider {
  getChampionship(id: number, trackedTeamName: string, trackedTeamId?: number): Promise<TournamentDataResult>;
}
