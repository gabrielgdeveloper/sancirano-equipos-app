import { useMemo } from "react";
import type { Championship, StandingRow, TeamStats } from "@/types/domain";
import { findTrackedTeam, getTeamMatches } from "@/utils/teamHelpers";
import {
  getLastPlayedMatchForTeam,
  getNextMatchForTeam,
  getPlayedMatches,
  getUpcomingMatches,
} from "@/utils/matchHelpers";
import { getTrackedTeamStanding } from "@/utils/standingsHelpers";

export function useTeamStats(
  championship: Championship | undefined,
  standings: StandingRow[] | undefined,
  trackedTeamName: string
): TeamStats | null {
  return useMemo(() => {
    if (!championship) return null;

    const team = findTrackedTeam(championship, trackedTeamName);
    if (!team) return null;

    const allTeamMatches = getTeamMatches(championship, team.id);
    const playedMatches = getPlayedMatches(allTeamMatches);
    const upcomingMatches = getUpcomingMatches(allTeamMatches);
    const lastMatch = getLastPlayedMatchForTeam(championship, team.id);
    const nextMatch = getNextMatchForTeam(championship, team.id);
    const standing = standings ? getTrackedTeamStanding(standings) : null;

    return {
      team,
      standing,
      playedMatches,
      upcomingMatches,
      lastMatch,
      nextMatch,
    };
  }, [championship, standings, trackedTeamName]);
}
