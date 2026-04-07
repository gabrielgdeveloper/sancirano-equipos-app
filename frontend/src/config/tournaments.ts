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
  { id: 2025202, slug: "pre-intermedia-c", name: "Pre-Intermedia C", trackedTeamName: "San Cirano" },
  { id: 2025203, slug: "pre-intermedia-d", name: "Pre-Intermedia D", trackedTeamName: "San Cirano" },
  { id: 2025203, slug: "pre-intermedia-e", name: "Pre-Intermedia D", trackedTeamName: "San Cirano" },
  
  // Nota: pre-intermedia-e comparte id con pre-intermedia-d en los datos originales
  // Actualizar cuando se confirme el ID correcto
  // { id: 2025204, slug: "pre-intermedia-e", name: "Pre-Intermedia E", trackedTeamName: "San Cirano" },
];

export function getTournamentBySlug(slug: string): TournamentConfig | undefined {
  return tournaments.find((t) => t.slug === slug);
}

export function getTournamentById(id: number): TournamentConfig | undefined {
  return tournaments.find((t) => t.id === id);
}

export const defaultTournament = tournaments[0];
