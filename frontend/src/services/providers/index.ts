import { appConfig } from "@/config/appConfig";
import { ApiTournamentDataProvider } from "./ApiTournamentDataProvider";
import { DbTournamentDataProvider } from "./DbTournamentDataProvider";
import type { TournamentDataProvider } from "./TournamentDataProvider";

export type { TournamentDataProvider };
export type { TournamentDataResult } from "./TournamentDataProvider";

/** Instancia singleton del provider activo según configuración */
export const tournamentDataProvider: TournamentDataProvider =
  appConfig.dataSource === "db"
    ? new DbTournamentDataProvider()
    : new ApiTournamentDataProvider();
