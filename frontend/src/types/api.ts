// ─── Tipos crudos que devuelve la API de URBA ─────────────────────────────────
// Estos tipos no deben usarse directamente en la UI — mapear a domain.ts

export interface ApiSeason {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  closed: boolean;
}

export interface ApiClub {
  id: number;
  name: string;
  image_uri: string;
  image_uri_with_base_url: string;
  is_formative: number;
}

export interface ApiTeam {
  id: number;
  name: string;
  club_id: number;
  championship_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  club: ApiClub;
}

export interface ApiMatch {
  id: number;
  local_team_id: number;
  visit_team_id: number;
  playdate: string;
  round_id: number;
  fulfilled: boolean;
  suspended: boolean;
  local_team_score: number;
  visit_team_score: number;
  local_team_offensive_bonus: number;
  visit_team_offensive_bonus: number;
  local_team_defensive_bonus: number;
  visit_team_defensive_bonus: number;
  video_club: string;
  video_tv: string;
  created_at: string;
  updated_at: string;
  local_team: ApiTeam;
  visit_team: ApiTeam;
}

export interface ApiRound {
  id: number;
  name: string;
  championship_id: number;
  playoffs: boolean;
  playdate: string;
  created_at: string;
  updated_at: string;
  matches: ApiMatch[];
}

export interface ApiChampionship {
  id: number;
  name: string;
  season_id: number;
  has_playoffs: boolean;
  closed: boolean;
  stared: boolean;
  alias: string;
  logo_image: string;
  created_at: string;
  updated_at: string;
  season: ApiSeason;
  teams: ApiTeam[];
  rounds: ApiRound[];
}

export interface ApiChampionshipResponse {
  championship: ApiChampionship[];
}

export interface ApiStanding {
  id: number;
  championship_id: number;
  team_id: number;
  position: number;
  played: number;
  won: number;
  tied: number;
  lost: number;
  points_favor: number;
  points_against: number;
  bonus_offensive: number;
  bonus_defensive: number;
  points_total: number;
  champion: boolean;
  created_at: string | null;
  updated_at: string;
  team: ApiTeam;
  championship: ApiChampionship;
}

export interface ApiPositionsResponse {
  positions: ApiStanding[];
}
