import type { Round } from "@/types/domain";
import { MatchCard } from "./MatchCard";

interface RoundSectionProps {
  round: Round;
  highlightTeamId?: number;
  compact?: boolean;
}

export function RoundSection({ round, highlightTeamId, compact = false }: RoundSectionProps) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        {round.name}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {round.matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            highlightTeamId={highlightTeamId}
            compact={compact}
          />
        ))}
      </div>
    </section>
  );
}
