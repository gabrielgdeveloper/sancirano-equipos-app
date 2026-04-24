import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useTournamentDataBySlug } from "@/hooks/useTournamentData";
import { useTeamStats } from "@/hooks/useTeamData";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { DataSourceBadge } from "@/components/common/DataSourceBadge";
import { TeamSummaryCard } from "@/components/team/TeamSummaryCard";
import { RoundSection } from "@/components/fixtures/RoundSection";
import { StandingsTable } from "@/components/standings/StandingsTable";
import { getLastPlayedRound, getNextRound } from "@/utils/matchHelpers";
import { triggerSync } from "@/services/api/urbaApi";
import { defaultTournament } from "@/config/tournaments";
import { appConfig } from "@/config/appConfig";

export function HomePage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  // Redirigir a torneo por defecto si no hay slug
  useEffect(() => {
    if (!slug) {
      const saved = localStorage.getItem("lastTournamentSlug");
      navigate(`/torneo/${saved ?? defaultTournament.slug}`, { replace: true });
    }
  }, [slug, navigate]);

  const { data, isLoading, isError, error, refetch, tournament } = useTournamentDataBySlug(slug);
  const queryClient = useQueryClient();

  const teamStats = useTeamStats(
    data?.championship,
    data?.standings,
    tournament?.trackedTeamName ?? appConfig.trackedTeamName,
    tournament?.trackedTeamId
  );

  // Persistir último torneo seleccionado
  useEffect(() => {
    if (slug) localStorage.setItem("lastTournamentSlug", slug);
  }, [slug]);

  if (!slug || isLoading) return <LoadingSpinner label="Cargando torneo..." />;
  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;
  if (!data) return null;

  const { championship, standings, source, lastSync } = data;
  const lastRound = getLastPlayedRound(championship);
  const nextRound = getNextRound(championship);
  const trackedTeamId = teamStats?.team.id;

  async function handleSync() {
    if (!tournament) return;
    await triggerSync(tournament.id);
    queryClient.invalidateQueries({ queryKey: ["tournament", tournament.id] });
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Planteles San Cirano{" "}
            <span className="text-brand-400">URBA 2026</span>
          </h1>
          <p className="text-gray-400 mt-1">
            {championship.name} — {championship.season.name}
          </p>
        </div>
        <DataSourceBadge
          source={source}
          lastSync={lastSync}
          onSync={handleSync}
        />
      </div>

      {/* San Cirano card */}
      {teamStats ? (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">San Cirano</h2>
          <TeamSummaryCard stats={teamStats} tournamentSlug={slug} trackedTeamName={tournament?.trackedTeamName} />
        </section>
      ) : (
        <div className="bg-surface-700 rounded-xl p-6 text-center text-gray-500">
          San Cirano no encontrado en este torneo.
        </div>
      )}

      {/* Última fecha jugada */}
      {lastRound && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            Última fecha — {lastRound.name}
          </h2>
          <RoundSection round={lastRound} highlightTeamId={trackedTeamId} />
        </section>
      )}

      {/* Próxima fecha */}
      {nextRound && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            Próxima fecha — {nextRound.name}
          </h2>
          <RoundSection round={nextRound} highlightTeamId={trackedTeamId} />
        </section>
      )}

      {/* Posiciones (compacta) */}
      {standings.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Tabla de posiciones</h2>
            <a
              href={`/torneo/${slug}/posiciones`}
              className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
            >
              Ver completa →
            </a>
          </div>
          <StandingsTable standings={standings} compact showPromotion={slug === "primera"} showPlayoff={slug === "intermedia" || (slug?.startsWith("pre-intermedia") ?? false)} showGanador={slug === "m19-a" || slug === "m17-a" || slug === "m16-a"} />
        </section>
      )}
    </div>
  );
}
