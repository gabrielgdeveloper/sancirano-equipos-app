import { useQuery } from "@tanstack/react-query";
import { tournamentDataProvider } from "@/services/providers";
import type { TournamentDataResult } from "@/services/providers";
import { getTournamentBySlug, type TournamentConfig } from "@/config/tournaments";

const STALE_TIME = 5 * 60 * 1000; // 5 minutos

export function useTournamentData(tournament: TournamentConfig | undefined) {
  return useQuery<TournamentDataResult, Error>({
    queryKey: ["tournament", tournament?.id],
    queryFn: () => {
      if (!tournament) throw new Error("Torneo no encontrado");
      return tournamentDataProvider.getChampionship(tournament.id, tournament.trackedTeamName);
    },
    enabled: !!tournament,
    staleTime: STALE_TIME,
    retry: 2,
  });
}

export function useTournamentDataBySlug(slug: string | undefined) {
  const tournament = slug ? getTournamentBySlug(slug) : undefined;
  const query = useTournamentData(tournament);
  return { ...query, tournament };
}
