export interface TournamentConfig {
  id: number;
  slug: string;
  name: string;
  trackedTeamName: string;
}

export const tournaments: TournamentConfig[] = [
  { id: 2025177, slug: "primera", name: "Primera", trackedTeamName: "San Cirano" },
  { id: 2025187, slug: "intermedia", name: "Intermedia", trackedTeamName: "San Cirano" },
  { id: 2025188, slug: "pre-intermedia-a", name: "Pre-Intermedia A", trackedTeamName: "San Cirano" },
  { id: 2025189, slug: "pre-intermedia-b", name: "Pre-Intermedia B", trackedTeamName: "San Cirano" },
  { id: 2025197, slug: "pre-intermedia-c", name: "Pre-Intermedia C", trackedTeamName: "San Cirano" },
  { id: 2025203, slug: "pre-intermedia-d", name: "Pre-Intermedia D", trackedTeamName: "San Cirano" },
];
