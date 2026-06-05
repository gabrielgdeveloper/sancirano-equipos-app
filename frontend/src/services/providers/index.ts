import { appConfig } from "@/config/appConfig";
import { ApiTournamentDataProvider } from "./ApiTournamentDataProvider";
import { DbTournamentDataProvider } from "./DbTournamentDataProvider";
import { HockeyTournamentDataProvider } from "./HockeyTournamentDataProvider";
import type { TournamentDataProvider } from "./TournamentDataProvider";

export type { TournamentDataProvider };
export type { TournamentDataResult } from "./TournamentDataProvider";

const rugbyProvider: TournamentDataProvider =
  appConfig.dataSource === "db"
    ? new DbTournamentDataProvider()
    : new ApiTournamentDataProvider();

const hockeyProvider: TournamentDataProvider = new HockeyTournamentDataProvider();

export function getProvider(sport: "rugby" | "hockey" = "rugby"): TournamentDataProvider {
  return sport === "hockey" ? hockeyProvider : rugbyProvider;
}
