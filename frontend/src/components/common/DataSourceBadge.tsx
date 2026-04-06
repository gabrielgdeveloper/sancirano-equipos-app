import clsx from "clsx";
import { formatDateTime } from "@/utils/formatters";

interface DataSourceBadgeProps {
  source: "api" | "db";
  lastSync: string | null;
  onSync?: () => void;
  isSyncing?: boolean;
}

export function DataSourceBadge({ source, lastSync, onSync, isSyncing }: DataSourceBadgeProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span
        className={clsx(
          "px-2 py-1 rounded-full font-medium",
          source === "api"
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
        )}
      >
        {source === "api" ? "Datos en vivo — API URBA" : "Datos cacheados — DB local"}
      </span>

      {lastSync && (
        <span className="text-gray-500">
          Última sync: {formatDateTime(lastSync)}
        </span>
      )}

      {source === "db" && onSync && (
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="px-3 py-1 bg-surface-600 hover:bg-surface-500 text-gray-300 rounded-lg transition-colors disabled:opacity-50"
        >
          {isSyncing ? "Sincronizando..." : "Re-sync"}
        </button>
      )}
    </div>
  );
}
