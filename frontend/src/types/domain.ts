// ─── Modelos internos de dominio ───────────────────────────────────────────────
// La UI solo depende de estos tipos, nunca de api.ts directamente

export interface Club {
  id: number;
  name: string;
  imageUri: string;
  imageUrl: string; // URL completa lista para usar en <img>
}

export interface Team {
  id: number;
  name: string;
  clubId: number;
  club: Club;
  championshipId: number;
}

export interface MatchScore {
  localScore: number;
  visitScore: number;
  localOffensiveBonus: number;
  visitOffensiveBonus: number;
  localDefensiveBonus: number;
  visitDefensiveBonus: number;
}

export interface Match {
  id: number;
  roundId: number;
  localTeam: Team;
  visitTeam: Team;
  playdate: string;
  fulfilled: boolean;
  suspended: boolean;
  score: MatchScore | null; // null si no se jugó aún
  videoUrl: string | null;
}

export interface Round {
  id: number;
  name: string;
  championshipId: number;
  playoffs: boolean;
  playdate: string;
  matches: Match[];
}

export interface Season {
  id: number;
  name: string;
  closed: boolean;
}

export interface Championship {
  id: number;
  name: string;
  alias: string;
  season: Season;
  teams: Team[];
  rounds: Round[];
}

export interface StandingRow {
  id: number;
  position: number;
  team: Team;
  played: number;
  won: number;
  tied: number;
  lost: number;
  pointsFavor: number;
  pointsAgainst: number;
  pointsDiff: number;
  bonusOffensive: number;
  bonusDefensive: number;
  totalBonus: number;
  pointsTotal: number;
  champion: boolean;
  isTracked: boolean; // true si es el equipo seguido (San Cirano)
}

export interface TournamentData {
  championship: Championship;
  standings: StandingRow[];
  lastSync: string | null; // ISO date, null si viene de API en tiempo real
  source: "api" | "db";
}

// Tipos derivados para vistas específicas
export interface TeamStats {
  team: Team;
  standing: StandingRow | null;
  playedMatches: Match[];
  upcomingMatches: Match[];
  lastMatch: Match | null;
  nextMatch: Match | null;
}
