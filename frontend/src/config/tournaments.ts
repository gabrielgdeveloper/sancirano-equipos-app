export interface ZoneConfig {
  positions: number[];
  label: string;
  color: "green" | "yellow" | "orange" | "red";
}

export type TrackedTeamSpec = { name: string; id?: number; slug?: string };

export interface TournamentConfig {
  id: number;
  slug: string;
  name: string;
  trackedTeamName: string;
  trackedTeamId?: number;
  trackedTeams?: TrackedTeamSpec[];
  sport: "rugby" | "hockey";
  zones?: ZoneConfig[];
}

const damasC2Zones: ZoneConfig[] = [
  { positions: [1],       label: "Ascenso",  color: "green"  },
  { positions: [2],          label: "Playoff",  color: "yellow" },
  { positions: [11, 12],     label: "Repechaje", color: "orange" },
  { positions: [13, 14],     label: "Descenso", color: "red"    },
];

const damasE4Zones: ZoneConfig[] = [
  { positions: [1,2],      label: "Ascenso",   color: "green"  },
  { positions: [3],      label: "Playoff",   color: "yellow" },
  { positions: [12],     label: "Repechaje", color: "orange" },
  { positions: [13, 14], label: "Descenso",  color: "red"    },
];

const damasF2Zones: ZoneConfig[] = [
{ positions: [1,2],      label: "Ascenso",   color: "green"  },
  { positions: [3],      label: "Playoff",   color: "yellow" },
  { positions: [12],     label: "Repechaje", color: "orange" },
  { positions: [13, 14], label: "Descenso",  color: "red"    },
];

export const rugbyTournaments: TournamentConfig[] = [
  { id: 2025176, slug: "primera",           name: "Primera",           trackedTeamName: "Champagnat",       sport: "rugby" },
  { id: 2025184, slug: "intermedia",         name: "Intermedia",        trackedTeamName: "Champagnat Inter", sport: "rugby" },
  { id: 2025185, slug: "pre-intermedia-a",   name: "Pre-Intermedia A",  trackedTeamName: "Champagnat Pre A", sport: "rugby" },
  { id: 2025186, slug: "pre-intermedia-b",   name: "Pre-Intermedia B",  trackedTeamName: "Champagnat Pre B", sport: "rugby" },
  { id: 2025197, slug: "pre-intermedia-c",   name: "Pre-Intermedia C",  trackedTeamName: "Champagnat Pre C", sport: "rugby" },
  { id: 2025198, slug: "pre-intermedia-d",   name: "Pre-Intermedia D",  trackedTeamName: "Champagnat Pre D", sport: "rugby"},
  { id: 2025200, slug: "pre-intermedia-e",   name: "Pre-Intermedia E",  trackedTeamName: "Champagnat Pre E", sport: "rugby"},
  { id: 2025201, slug: "pre-intermedia-f",   name: "Pre-Intermedia F",  trackedTeamName: "Champagnat Pre E", sport: "rugby"},
  { id: 2025206, slug: "m22",   name: "M22",  trackedTeamName: "Champagnat M22", sport: "rugby"},
  { id: 2025213, slug: "m19-a",              name: "M19-A",             trackedTeamName: "Champagnat M19-A", sport: "rugby" },
  { id: 2025214, slug: "m19-b",              name: "M19-B",             trackedTeamName: "Champagnat M19-B", sport: "rugby" },
  { id: 2025227, slug: "m19-c",              name: "M19-C",             trackedTeamName: "Champagnat M19-C", sport: "rugby" },
  { id: 2025228, slug: "m19-d",              name: "M19-D",             trackedTeamName: "Champagnat M19-D", sport: "rugby" },
  { id: 2025226, slug: "m19-e",              name: "M19-E",             trackedTeamName: "Champagnat M19-E", sport: "rugby" },
  { id: 2025233, slug: "m17-a",              name: "M17-A",             trackedTeamName: "Champagnat M17-A", sport: "rugby" },
  { id: 2025234, slug: "m17-b",              name: "M17-B",             trackedTeamName: "Champagnat M17-B", sport: "rugby" },
  { id: 2025241, slug: "m17-c",              name: "M17-C",             trackedTeamName: "Champagnat M17-C", sport: "rugby" },
  { id: 2025245, slug: "m16-a",              name: "M16-A",             trackedTeamName: "Champagnat M16-A", sport: "rugby" },
  { id: 2025246, slug: "m16-b",              name: "M16-B",             trackedTeamName: "Champagnat M16-B", sport: "rugby" },
  { id: 2025249, slug: "m16-C",              name: "M16-C",             trackedTeamName: "Champagnat M16-C", sport: "rugby" },
  { id: 2025250, slug: "m16-d",              name: "M16-D",             trackedTeamName: "Champagnat M16-D", sport: "rugby" },
  { id: 2025257, slug: "m15-a",              name: "M15-A",             trackedTeamName: "Champagnat M15-A", sport: "rugby" },
  { id: 2025258, slug: "m15-b",              name: "M15-B",             trackedTeamName: "Champagnat M15-B", sport: "rugby" },
  { id: 2025263, slug: "m15-c",              name: "M15-C",             trackedTeamName: "Champagnat M15-C", sport: "rugby" },
];

export const hockeyTournaments: TournamentConfig[] = [
  { id: 356,  slug: "hockey-primera-a",    name: "Primera Tira A",    trackedTeamName: "CHAMPAGNAT", sport: "hockey", zones: damasC2Zones },
  { id: 440,  slug: "hockey-primera-b",    name: "Primera Tira B",    trackedTeamName: "CHAMPAGNAT B", sport: "hockey", zones: damasE4Zones },
  { id: 440,  slug: "hockey-primera-c",    name: "Primera Tira C",    trackedTeamName: "CHAMPAGNAT C", sport: "hockey", zones: damasE4Zones },
  { id: 458,  slug: "hockey-primera-d",    name: "Primera Tira D",    trackedTeamName: "CHAMPAGNAT D", sport: "hockey", zones: damasF2Zones },
  { id: 357,  slug: "hockey-intermedia-a", name: "Intermedia Tira A", trackedTeamName: "CHAMPAGNAT", sport: "hockey" },
  { id: 441,  slug: "hockey-intermedia-b", name: "Intermedia Tira B", trackedTeamName: "CHAMPAGNAT B", sport: "hockey" },
  { id: 441,  slug: "hockey-intermedia-c", name: "Intermedia Tira C", trackedTeamName: "CHAMPAGNAT C", sport: "hockey" },
  { id: 459,  slug: "hockey-intermedia-d", name: "Intermedia Tira D", trackedTeamName: "CHAMPAGNAT D", sport: "hockey" },
  { id: 358,  slug: "hockey-quinta-a",     name: "Quinta Tira A",     trackedTeamName: "CHAMPAGNAT", sport: "hockey" },
  { id: 442,  slug: "hockey-quinta-b",     name: "Quinta Tira B",     trackedTeamName: "CHAMPAGNAT B", sport: "hockey" },
  { id: 442,  slug: "hockey-quinta-c",     name: "Quinta Tira C",     trackedTeamName: "CHAMPAGNAT C", sport: "hockey" },
  { id: 460,  slug: "hockey-quinta-d",     name: "Quinta Tira D",     trackedTeamName: "CHAMPAGNAT D", sport: "hockey" },
  { id: 359,  slug: "hockey-sexta-a",      name: "Sexta Tira A",      trackedTeamName: "CHAMPAGNAT", sport: "hockey" },
  { id: 443,  slug: "hockey-sexta-b",      name: "Sexta Tira B",      trackedTeamName: "CHAMPAGNAT B", sport: "hockey" },
  { id: 443,  slug: "hockey-sexta-c",      name: "Sexta Tira C",      trackedTeamName: "CHAMPAGNAT C", sport: "hockey" },
  { id: 461,  slug: "hockey-sexta-d",      name: "Sexta Tira D",      trackedTeamName: "CHAMPAGNAT D", sport: "hockey" },
  { id: 360,  slug: "hockey-septima-a",    name: "Septima Tira A",    trackedTeamName: "CHAMPAGNAT", sport: "hockey" },
  { id: 444,  slug: "hockey-septima-b",    name: "Septima Tira B",    trackedTeamName: "CHAMPAGNAT B", sport: "hockey" },
  { id: 444,  slug: "hockey-septima-c",    name: "Septima Tira C",    trackedTeamName: "CHAMPAGNAT C", sport: "hockey" },
  { id: 462,  slug: "hockey-septima-d",    name: "Septima Tira D",    trackedTeamName: "CHAMPAGNAT D", sport: "hockey" },
  { id: 3725,  slug: "hockey-septima-proy",    name: "Septima Tira Proyeccion",    trackedTeamName: "CHAMPAGNAT Proyeccion", sport: "hockey" },
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
