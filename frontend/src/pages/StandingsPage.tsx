import { useParams } from "react-router-dom";
import { useTournamentDataBySlug } from "@/hooks/useTournamentData";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { StandingsTable } from "@/components/standings/StandingsTable";
import { DataSourceBadge } from "@/components/common/DataSourceBadge";

export function StandingsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError, error, refetch } = useTournamentDataBySlug(slug);

  if (isLoading) return <LoadingSpinner label="Cargando posiciones..." />;
  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;
  if (!data) return null;

  const { championship, standings, source, lastSync } = data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Tabla de posiciones</h1>
          <p className="text-gray-400 mt-1">
            {championship.name} — {championship.season.name}
          </p>
        </div>
        <DataSourceBadge source={source} lastSync={lastSync} />
      </div>

      {standings.length > 0 ? (
        <StandingsTable standings={standings} compact={false} showPromotion={slug === "primera"} showPlayoff={slug === "intermedia" || (slug?.startsWith("pre-intermedia") ?? false)} showGanador={slug === "m19-a" || slug === "m17-a" || slug === "m16-a"} />
      ) : (
        <p className="text-gray-500 text-center py-12">No hay posiciones disponibles.</p>
      )}
    </div>
  );
}
