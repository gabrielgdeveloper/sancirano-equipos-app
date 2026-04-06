import type { StandingRow } from "@/types/domain";

/** Encuentra la fila de posición del equipo seguido. */
export function getTrackedTeamStanding(standings: StandingRow[]): StandingRow | null {
  return standings.find((s) => s.isTracked) ?? null;
}

/** Ordena standings por posición. */
export function sortStandings(standings: StandingRow[]): StandingRow[] {
  return [...standings].sort((a, b) => a.position - b.position);
}
