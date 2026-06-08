import { useNavigate } from "react-router-dom";
import { rugbyTournaments, hockeyTournaments, type TournamentConfig } from "@/config/tournaments";

interface TournamentSelectorProps {
  current: TournamentConfig | undefined;
}

export function TournamentSelector({ current }: TournamentSelectorProps) {
  const navigate = useNavigate();
  const sport = current?.sport ?? "rugby";
  const list = sport === "hockey" ? hockeyTournaments : rugbyTournaments;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    navigate(`/torneo/${e.target.value}`);
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
        className="bg-brand-600 border border-brand-400 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
      >
        {list.map((t) => (
          <option key={t.slug} value={t.slug}>{t.name}</option>
        ))}
      </select>
    </div>
  );
}
