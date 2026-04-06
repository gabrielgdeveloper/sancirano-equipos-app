import type {
  ApiChampionship,
  ApiChampionshipResponse,
  ApiMatch,
  ApiRound,
  ApiTeam,
} from "@/types/api";
import type { Championship, Club, Match, MatchScore, Round, Team } from "@/types/domain";
import { buildImageUrl } from "@/utils/imageHelpers";

function mapClub(apiTeam: ApiTeam): Club {
  return {
    id: apiTeam.club.id,
    name: apiTeam.club.name,
    imageUri: apiTeam.club.image_uri,
    imageUrl: buildImageUrl(apiTeam.club.image_uri),
  };
}

export function mapTeam(apiTeam: ApiTeam): Team {
  return {
    id: apiTeam.id,
    name: apiTeam.name,
    clubId: apiTeam.club_id,
    championshipId: apiTeam.championship_id,
    club: mapClub(apiTeam),
  };
}

function mapScore(apiMatch: ApiMatch): MatchScore | null {
  if (!apiMatch.fulfilled) return null;
  return {
    localScore: apiMatch.local_team_score,
    visitScore: apiMatch.visit_team_score,
    localOffensiveBonus: apiMatch.local_team_offensive_bonus,
    visitOffensiveBonus: apiMatch.visit_team_offensive_bonus,
    localDefensiveBonus: apiMatch.local_team_defensive_bonus,
    visitDefensiveBonus: apiMatch.visit_team_defensive_bonus,
  };
}

function mapMatch(apiMatch: ApiMatch): Match {
  return {
    id: apiMatch.id,
    roundId: apiMatch.round_id,
    localTeam: mapTeam(apiMatch.local_team),
    visitTeam: mapTeam(apiMatch.visit_team),
    playdate: apiMatch.playdate,
    fulfilled: apiMatch.fulfilled,
    suspended: apiMatch.suspended,
    score: mapScore(apiMatch),
    videoUrl: apiMatch.video_club || apiMatch.video_tv || null,
  };
}

function mapRound(apiRound: ApiRound): Round {
  return {
    id: apiRound.id,
    name: apiRound.name,
    championshipId: apiRound.championship_id,
    playoffs: apiRound.playoffs,
    playdate: apiRound.playdate,
    matches: (apiRound.matches ?? []).map(mapMatch),
  };
}

function mapChampionship(api: ApiChampionship): Championship {
  return {
    id: api.id,
    name: api.name,
    alias: api.alias,
    season: {
      id: api.season.id,
      name: api.season.name,
      closed: api.season.closed,
    },
    teams: (api.teams ?? []).map(mapTeam),
    rounds: (api.rounds ?? []).map(mapRound),
  };
}

export function mapChampionshipResponse(response: ApiChampionshipResponse): Championship {
  const raw = response.championship[0];
  if (!raw) throw new Error("Respuesta de campeonato vacía");
  return mapChampionship(raw);
}
