export interface TournamentConfig {
  id: number;
  slug: string;
  name: string;
  trackedTeamName: string;
  sport?: "rugby" | "hockey";
}

export const tournaments: TournamentConfig[] = [
  { id: 2025177, slug: "primera", name: "Primera", trackedTeamName: "San Cirano" },
  { id: 2025187, slug: "intermedia", name: "Intermedia", trackedTeamName: "San Cirano" },
  { id: 2025188, slug: "pre-intermedia-a", name: "Pre-Intermedia A", trackedTeamName: "San Cirano" },
  { id: 2025189, slug: "pre-intermedia-b", name: "Pre-Intermedia B", trackedTeamName: "San Cirano" },
  { id: 2025197, slug: "pre-intermedia-c", name: "Pre-Intermedia C", trackedTeamName: "San Cirano" },
  { id: 2025203, slug: "pre-intermedia-d", name: "Pre-Intermedia D", trackedTeamName: "San Cirano" },
];

export const hockeyTournaments: TournamentConfig[] = [
  { id: 338,  slug: "hockey-primera-a",    name: "Primera Tira A",    trackedTeamName: "SAN CIRANO", sport: "hockey" },
  { id: 383,  slug: "hockey-primera-b",    name: "Primera Tira B",    trackedTeamName: "SAN CIRANO", sport: "hockey" },
  { id: 486,  slug: "hockey-segunda",      name: "Segunda",           trackedTeamName: "SAN CIRANO", sport: "hockey" },
  { id: 339,  slug: "hockey-intermedia-a", name: "Intermedia Tira A", trackedTeamName: "SAN CIRANO", sport: "hockey" },
  { id: 384,  slug: "hockey-intermedia-b", name: "Intermedia Tira B", trackedTeamName: "SAN CIRANO", sport: "hockey" },
  { id: 3688, slug: "hockey-cuarta",       name: "Cuarta",            trackedTeamName: "SAN CIRANO", sport: "hockey" },
  { id: 340,  slug: "hockey-quinta-a",     name: "Quinta Tira A",     trackedTeamName: "SAN CIRANO", sport: "hockey" },
  { id: 385,  slug: "hockey-quinta-b",     name: "Quinta Tira B",     trackedTeamName: "SAN CIRANO", sport: "hockey" },
  { id: 341,  slug: "hockey-sexta-a",      name: "Sexta Tira A",      trackedTeamName: "SAN CIRANO", sport: "hockey" },
  { id: 386,  slug: "hockey-sexta-b",      name: "Sexta Tira B",      trackedTeamName: "SAN CIRANO", sport: "hockey" },
  { id: 342,  slug: "hockey-septima-a",    name: "Septima Tira A",    trackedTeamName: "SAN CIRANO", sport: "hockey" },
  { id: 387,  slug: "hockey-septima-b",    name: "Septima Tira B",    trackedTeamName: "SAN CIRANO", sport: "hockey" },
];
