import type { Championship, Match, Round } from "@/types/domain";

/**
 * Ordena los rounds por fecha ascendente.
 */
export function sortRoundsByDate(rounds: Round[]): Round[] {
  return [...rounds].sort(
    (a, b) => new Date(a.playdate).getTime() - new Date(b.playdate).getTime()
  );
}

/**
 * Devuelve los partidos ya jugados de un array de partidos.
 */
export function getPlayedMatches(matches: Match[]): Match[] {
  return matches.filter((m) => m.fulfilled && !m.suspended);
}

/**
 * Devuelve los partidos futuros (no jugados) de un array de partidos.
 */
export function getUpcomingMatches(matches: Match[]): Match[] {
  return matches.filter((m) => !m.fulfilled && !m.suspended);
}

/**
 * Detecta el último round con al menos un partido jugado.
 */
export function getLastPlayedRound(championship: Championship): Round | null {
  const sortedRounds = sortRoundsByDate(championship.rounds);
  for (let i = sortedRounds.length - 1; i >= 0; i--) {
    const round = sortedRounds[i];
    if (round.matches.some((m) => m.fulfilled)) return round;
  }
  return null;
}

/**
 * Detecta el próximo round sin partidos jugados.
 */
export function getNextRound(championship: Championship): Round | null {
  const sortedRounds = sortRoundsByDate(championship.rounds);
  return (
    sortedRounds.find((round) => round.matches.every((m) => !m.fulfilled)) ?? null
  );
}

/**
 * Todos los partidos del campeonato aplanados.
 */
export function getAllMatches(championship: Championship): Match[] {
  return championship.rounds.flatMap((r) => r.matches);
}

/**
 * Encuentra el último partido jugado de un equipo.
 */
export function getLastPlayedMatchForTeam(championship: Championship, teamId: number): Match | null {
  const allPlayed = championship.rounds
    .flatMap((r) => r.matches)
    .filter(
      (m) =>
        m.fulfilled &&
        (m.localTeam.id === teamId || m.visitTeam.id === teamId)
    )
    .sort((a, b) => new Date(b.playdate).getTime() - new Date(a.playdate).getTime());

  return allPlayed[0] ?? null;
}

/**
 * Encuentra el próximo partido de un equipo.
 */
export function getNextMatchForTeam(championship: Championship, teamId: number): Match | null {
  const upcoming = championship.rounds
    .flatMap((r) => r.matches)
    .filter(
      (m) =>
        !m.fulfilled &&
        (m.localTeam.id === teamId || m.visitTeam.id === teamId)
    )
    .sort((a, b) => new Date(a.playdate).getTime() - new Date(b.playdate).getTime());

  return upcoming[0] ?? null;
}
