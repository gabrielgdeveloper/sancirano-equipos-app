export interface TournamentConfig {
  id: number;
  slug: string;
  name: string;
  trackedTeamName: string;
  trackedTeamId?: number; // Usar cuando hay 2+ equipos del mismo club en el mismo torneo
}

export const tournaments: TournamentConfig[] = [
  { id: 2025177, slug: "primera", name: "Primera", trackedTeamName: "San Cirano" },
  { id: 2025187, slug: "intermedia", name: "Intermedia", trackedTeamName: "San Cirano Inter" },
  { id: 2025188, slug: "pre-intermedia-a", name: "Pre-Intermedia A", trackedTeamName: "San Cirano Pre A" },
  { id: 2025189, slug: "pre-intermedia-b", name: "Pre-Intermedia B", trackedTeamName: "San Cirano Pre B" },
  { id: 2025202, slug: "pre-intermedia-c", name: "Pre-Intermedia C", trackedTeamName: "San Cirano Pre C" },
  { id: 2025203, slug: "pre-intermedia-d", name: "Pre-Intermedia D", trackedTeamName: "San Cirano Pre D", trackedTeamId: 202516951 },
  { id: 2025203, slug: "pre-intermedia-e", name: "Pre-Intermedia E", trackedTeamName: "San Cirano Pre E", trackedTeamId: 202516950 },
  { id: 2025215, slug: "m19-a", name: "M19-A", trackedTeamName: "San Cirano M19-A" },
  { id: 2025216, slug: "m19-b", name: "M19-B", trackedTeamName: "San Cirano M19-B" },
  { id: 2025229, slug: "m19-c", name: "M19-C", trackedTeamName: "San Cirano M19-C" },
  { id: 2025233, slug: "m17-a", name: "M17-A", trackedTeamName: "San Cirano M17-A" },
  { id: 2025234, slug: "m17-b", name: "M17-B", trackedTeamName: "San Cirano M17-B" },
  { id: 2025243, slug: "m16-a", name: "M16-A", trackedTeamName: "San Cirano M16-A" },
  { id: 2025244, slug: "m16-b", name: "M16-B", trackedTeamName: "San Cirano M16-B" },
  { id: 2025259, slug: "m15-a", name: "M15-A", trackedTeamName: "San Cirano M15-A" },
  { id: 2025260, slug: "m15-b", name: "M15-B", trackedTeamName: "San Cirano M15-B" },
];

export function getTournamentBySlug(slug: string): TournamentConfig | undefined {
  return tournaments.find((t) => t.slug === slug);
}

export function getTournamentById(id: number): TournamentConfig | undefined {
  return tournaments.find((t) => t.id === id);
}

export const defaultTournament = tournaments[0];
