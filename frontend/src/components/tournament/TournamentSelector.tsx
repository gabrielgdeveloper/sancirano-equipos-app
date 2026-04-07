import { useNavigate } from "react-router-dom";
import { tournaments, type TournamentConfig } from "@/config/tournaments";

interface TournamentSelectorProps {
  current: TournamentConfig | undefined;
}

export function TournamentSelector({ current }: TournamentSelectorProps) {
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const slug = e.target.value;
    navigate(`/torneo/${slug}`);
  }

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="tournament-select" className="hidden sm:block text-sm text-gray-400 whitespace-nowrap">
        Torneo:
      </label>
      <select
        id="tournament-select"
        value={current?.slug ?? ""}
        onChange={handleChange}
        className="bg-surface-600 border border-surface-400 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
      >
        {tournaments.map((t) => (
          <option key={t.slug} value={t.slug}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}
