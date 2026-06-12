import { useMemo } from "react";
import type { Championship, StandingRow, TeamStats } from "@/types/domain";
import type { TournamentConfig } from "@/config/tournaments";
import { findTrackedTeam, getTeamMatches } from "@/utils/teamHelpers";
import {
  getLastPlayedMatchForTeam,
  getNextMatchForTeam,
  getPlayedMatches,
  getUpcomingMatches,
} from "@/utils/matchHelpers";

const norm = (s: string) => s.toLowerCase().trim();

function buildTeamStats(
  championship: Championship,
  standings: StandingRow[] | undefined,
  name: string,
  id?: number
): TeamStats | null {
  // Find standing by exact team name match first (handles same team_id with different names)
  const standing =
    standings?.find((s) => norm(s.team.name) === norm(name) || norm(s.team.club.name) === norm(name)) ??
    standings?.find((s) => s.isTracked) ??
    null;

  const team = standing?.team ?? findTrackedTeam(championship, name, id);
  if (!team) return null;

  const allTeamMatches = getTeamMatches(championship, team.id);
  return {
    team,
    standing: standing ?? null,
    playedMatches: getPlayedMatches(allTeamMatches),
    upcomingMatches: getUpcomingMatches(allTeamMatches),
    lastMatch: getLastPlayedMatchForTeam(championship, team.id),
    nextMatch: getNextMatchForTeam(championship, team.id),
  };
}

export function useTeamStats(
  championship: Championship | undefined,
  standings: StandingRow[] | undefined,
  trackedTeamName: string,
  trackedTeamId?: number
): TeamStats | null {
  return useMemo(() => {
    if (!championship) return null;
    return buildTeamStats(championship, standings, trackedTeamName, trackedTeamId);
  }, [championship, standings, trackedTeamName, trackedTeamId]);
}

export function useMultiTeamStats(
  championship: Championship | undefined,
  standings: StandingRow[] | undefined,
  tournament: TournamentConfig | undefined
): TeamStats[] {
  return useMemo(() => {
    if (!championship || !tournament) return [];
    const specs = tournament.trackedTeams ?? [{ name: tournament.trackedTeamName, id: tournament.trackedTeamId }];
    return specs.flatMap(({ name, id }) => {
      const stats = buildTeamStats(championship, standings, name, id);
      return stats ? [stats] : [];
    });
  }, [championship, standings, tournament]);
}
