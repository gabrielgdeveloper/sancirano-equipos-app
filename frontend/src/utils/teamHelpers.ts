import type { Championship, Match, Team } from "@/types/domain";

/**
 * Normaliza un nombre de equipo para comparaciones tolerantes.
 */
function normalizeName(name: string): string {
  return name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Devuelve true si el nombre del equipo coincide (case-insensitive, tolerante a acentos).
 */
export function teamNameMatches(teamName: string, target: string): boolean {
  const n = normalizeName(teamName);
  const t = normalizeName(target);
  return n === t || n.includes(t) || t.includes(n);
}

/**
 * Encuentra el equipo seguido (ej: San Cirano) dentro del campeonato.
 * Si se proporciona trackedTeamId, busca por ID exacto (necesario cuando hay 2+ equipos del mismo club).
 * Si no, busca por nombre.
 */
export function findTrackedTeam(championship: Championship, trackedTeamName: string, trackedTeamId?: number): Team | null {
  if (trackedTeamId != null) {
    return championship.teams.find((t) => t.id === trackedTeamId) ?? null;
  }
  return (
    championship.teams.find((t) =>
      teamNameMatches(t.club.name, trackedTeamName) || teamNameMatches(t.name, trackedTeamName)
    ) ?? null
  );
}

/**
 * Obtiene todos los partidos de un equipo en el campeonato.
 */
export function getTeamMatches(championship: Championship, teamId: number): Match[] {
  return championship.rounds.flatMap((round) =>
    round.matches.filter(
      (m) => m.localTeam.id === teamId || m.visitTeam.id === teamId
    )
  );
}

/**
 * Determina si el equipo fue local o visitante en un partido.
 */
export function getTeamRole(match: Match, teamId: number): "local" | "visit" | null {
  if (match.localTeam.id === teamId) return "local";
  if (match.visitTeam.id === teamId) return "visit";
  return null;
}

/**
 * Determina el resultado de un partido para un equipo específico.
 */
export function getMatchResult(match: Match, teamId: number): "won" | "lost" | "tied" | null {
  if (!match.fulfilled || !match.score) return null;
  const role = getTeamRole(match, teamId);
  if (!role) return null;
  const myScore = role === "local" ? match.score.localScore : match.score.visitScore;
  const theirScore = role === "local" ? match.score.visitScore : match.score.localScore;
  if (myScore > theirScore) return "won";
  if (myScore < theirScore) return "lost";
  return "tied";
}
