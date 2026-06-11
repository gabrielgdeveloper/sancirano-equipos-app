export interface ZoneConfig {
  positions: number[];
  label: string;
  color: "green" | "yellow" | "orange" | "red";
}

export interface TournamentConfig {
  id: number;
  slug: string;
  name: string;
  trackedTeamName: string;
  trackedTeamId?: number;
  sport: "rugby" | "hockey";
  zones?: ZoneConfig[];
}

const damasBZones: ZoneConfig[] = [
  { positions: [1, 2],       label: "Ascenso",  color: "green"  },
  { positions: [3],          label: "Playoff",  color: "yellow" },
  { positions: [11, 12],     label: "Repechaje", color: "orange" },
  { positions: [13, 14],     label: "Descenso", color: "red"    },
];

const damasD3Zones: ZoneConfig[] = [
  { positions: [1],      label: "Ascenso",   color: "green"  },
  { positions: [2],      label: "Playoff",   color: "yellow" },
  { positions: [12],     label: "Repechaje", color: "orange" },
  { positions: [13, 14], label: "Descenso",  color: "red"    },
];

export const rugbyTournaments: TournamentConfig[] = [
  { id: 2025177, slug: "primera",           name: "Primera",           trackedTeamName: "San Cirano",       sport: "rugby" },
  { id: 2025187, slug: "intermedia",         name: "Intermedia",        trackedTeamName: "San Cirano Inter", sport: "rugby" },
  { id: 2025188, slug: "pre-intermedia-a",   name: "Pre-Intermedia A",  trackedTeamName: "San Cirano Pre A", sport: "rugby" },
  { id: 2025189, slug: "pre-intermedia-b",   name: "Pre-Intermedia B",  trackedTeamName: "San Cirano Pre B", sport: "rugby" },
  { id: 2025202, slug: "pre-intermedia-c",   name: "Pre-Intermedia C",  trackedTeamName: "San Cirano Pre C", sport: "rugby" },
  { id: 2025203, slug: "pre-intermedia-d",   name: "Pre-Intermedia D",  trackedTeamName: "San Cirano Pre D", sport: "rugby", trackedTeamId: 202516951 },
  { id: 2025203, slug: "pre-intermedia-e",   name: "Pre-Intermedia E",  trackedTeamName: "San Cirano Pre E", sport: "rugby", trackedTeamId: 202516950 },
  { id: 2025215, slug: "m19-a",              name: "M19-A",             trackedTeamName: "San Cirano M19-A", sport: "rugby" },
  { id: 2025216, slug: "m19-b",              name: "M19-B",             trackedTeamName: "San Cirano M19-B", sport: "rugby" },
  { id: 2025229, slug: "m19-c",              name: "M19-C",             trackedTeamName: "San Cirano M19-C", sport: "rugby" },
  { id: 2025233, slug: "m17-a",              name: "M17-A",             trackedTeamName: "San Cirano M17-A", sport: "rugby" },
  { id: 2025234, slug: "m17-b",              name: "M17-B",             trackedTeamName: "San Cirano M17-B", sport: "rugby" },
  { id: 2025243, slug: "m16-a",              name: "M16-A",             trackedTeamName: "San Cirano M16-A", sport: "rugby" },
  { id: 2025244, slug: "m16-b",              name: "M16-B",             trackedTeamName: "San Cirano M16-B", sport: "rugby" },
  { id: 2025259, slug: "m15-a",              name: "M15-A",             trackedTeamName: "San Cirano M15-A", sport: "rugby" },
  { id: 2025260, slug: "m15-b",              name: "M15-B",             trackedTeamName: "San Cirano M15-B", sport: "rugby" },
];

export const hockeyTournaments: TournamentConfig[] = [
  { id: 338,  slug: "hockey-primera-a",    name: "Primera Tira A",    trackedTeamName: "SAN CIRANO", sport: "hockey", zones: damasBZones },
  { id: 383,  slug: "hockey-primera-b",    name: "Primera Tira B",    trackedTeamName: "SAN CIRANO", sport: "hockey", zones: damasD3Zones },
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

export const tournaments: TournamentConfig[] = [...rugbyTournaments, ...hockeyTournaments];

export function getTournamentBySlug(slug: string): TournamentConfig | undefined {
  return tournaments.find((t) => t.slug === slug);
}

export function getTournamentById(id: number): TournamentConfig | undefined {
  return tournaments.find((t) => t.id === id);
}

export const defaultTournament = rugbyTournaments[0];
export const defaultHockeyTournament = hockeyTournaments[0];
