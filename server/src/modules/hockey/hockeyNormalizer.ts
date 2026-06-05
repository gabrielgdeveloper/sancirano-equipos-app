// Convierte la respuesta de la API de hockey al mismo shape que usa URBA rugby,
// para que todos los mappers y componentes del frontend funcionen sin cambios.

const HOCKEY_CLUB_OFFSET   = 20_000_000;
const HOCKEY_TEAM_OFFSET   = 21_000_000;
const HOCKEY_ROUND_OFFSET  = 22_000_000;
const HOCKEY_STANDING_OFFSET = 23_000_000;
const HOCKEY_MATCH_OFFSET  = 10_000_000;

export function hockeyClubId(clubIntId: number): number {
  return HOCKEY_CLUB_OFFSET + clubIntId;
}

export function hockeyTeamId(tournamentId: number, clubIntId: number): number {
  return HOCKEY_TEAM_OFFSET + tournamentId * 10_000 + clubIntId;
}

export function hockeyRoundId(tournamentId: number, fecha: number): number {
  return HOCKEY_ROUND_OFFSET + tournamentId * 1_000 + fecha;
}

export function hockeyStandingId(tournamentId: number, position: number): number {
  return HOCKEY_STANDING_OFFSET + tournamentId * 1_000 + position;
}

export function hockeyMatchId(rawMatchId: string): number {
  return HOCKEY_MATCH_OFFSET + parseInt(rawMatchId, 10);
}

export function parseHockeyDate(horario: string | undefined): string {
  if (!horario) return new Date().toISOString();
  // "2026/03/07 16:00:00" → ISO
  return horario.replace(/\//g, "-").replace(" ", "T");
}

function buildTeam(
  tournamentId: number,
  clubStringId: string,
  nombre: string,
  escudo: string
) {
  const clubInt = parseInt(clubStringId, 10);
  const clubId  = hockeyClubId(clubInt);
  const teamId  = hockeyTeamId(tournamentId, clubInt);
  return {
    id: teamId,
    name: nombre.trim(),
    club_id: clubId,
    championship_id: tournamentId,
    created_at: "",
    updated_at: "",
    deleted_at: null,
    club: {
      id: clubId,
      name: nombre.trim(),
      image_uri: escudo,
      image_uri_with_base_url: escudo,
      is_formative: 0,
    },
  };
}

export function normalizeHockeyChampionship(hockey: any, tournamentId: number) {
  const detalle = hockey.detalle ?? {};
  const fase = hockey.fases?.[0];
  const zona = fase?.zonas?.[0];
  const partidos: any[] = zona?.partidos ?? [];

  // Equipos únicos derivados de los partidos
  const teamsMap = new Map<string, ReturnType<typeof buildTeam>>();
  for (const p of partidos) {
    if (p.isGhostMatch) continue;
    if (!teamsMap.has(p.idClubLocal)) {
      teamsMap.set(p.idClubLocal, buildTeam(tournamentId, p.idClubLocal, p.nombreLocal, p.escudoImagePathLocal ?? ""));
    }
    if (!teamsMap.has(p.idClubVisitante)) {
      teamsMap.set(p.idClubVisitante, buildTeam(tournamentId, p.idClubVisitante, p.nombreVisitante, p.escudoImagePathVisitante ?? ""));
    }
  }

  // Agrupar partidos por fecha
  const roundsMap = new Map<number, any[]>();
  for (const p of partidos) {
    if (p.isGhostMatch) continue;
    const fecha = parseInt(p.numeroFecha, 10);
    if (!roundsMap.has(fecha)) roundsMap.set(fecha, []);
    roundsMap.get(fecha)!.push(p);
  }

  const rounds = Array.from(roundsMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([fecha, ps]) => {
      const roundId = hockeyRoundId(tournamentId, fecha);
      return {
        id: roundId,
        name: `Fecha ${fecha}`,
        championship_id: tournamentId,
        playoffs: false,
        playdate: parseHockeyDate(ps[0]?.horario),
        created_at: "",
        updated_at: "",
        matches: ps.map((p) => ({
          id: hockeyMatchId(p.id),
          local_team_id: hockeyTeamId(tournamentId, parseInt(p.idClubLocal, 10)),
          visit_team_id: hockeyTeamId(tournamentId, parseInt(p.idClubVisitante, 10)),
          round_id: roundId,
          playdate: parseHockeyDate(p.horario),
          fulfilled: p.played === true,
          suspended: false,
          local_team_score: parseInt(p.golesLocal ?? "0", 10) || 0,
          visit_team_score: parseInt(p.golesVisitante ?? "0", 10) || 0,
          local_team_offensive_bonus: 0,
          visit_team_offensive_bonus: 0,
          local_team_defensive_bonus: 0,
          visit_team_defensive_bonus: 0,
          video_club: "",
          video_tv: "",
          local_team: teamsMap.get(p.idClubLocal),
          visit_team: teamsMap.get(p.idClubVisitante),
        })),
      };
    });

  const divNombre = detalle.division?.divisionNombre ?? "";
  const catNombre = detalle.categoria?.categoriaNombre ?? "";

  const championship = {
    id: tournamentId,
    name: detalle.nombreTorneo ?? `Hockey ${tournamentId}`,
    alias: divNombre ? `${catNombre} ${divNombre}`.trim() : catNombre,
    closed: false,
    has_playoffs: false,
    stared: false,
    logo_image: "",
    season_id: parseInt(detalle.temporada?.temporadaId ?? "0", 10),
    season: {
      id: parseInt(detalle.temporada?.temporadaId ?? "0", 10),
      name: detalle.temporada?.temporadaNombre ?? "2026",
      closed: false,
      created_at: "",
      updated_at: "",
      deleted_at: null,
    },
    teams: Array.from(teamsMap.values()),
    rounds,
  };

  return {
    championship: [championship],
    source: "api" as const,
    lastSync: null,
  };
}

export function normalizeHockeyPositions(hockey: any, tournamentId: number) {
  const detalle = hockey.detalle ?? {};
  const zona = hockey.fases?.[0]?.zonas?.[0];
  const tabla: any[] = zona?.tabla ?? [];

  const positions = tabla.map((entry, idx) => {
    const clubInt = parseInt(entry.clubId, 10);
    const clubId  = hockeyClubId(clubInt);
    const teamId  = hockeyTeamId(tournamentId, clubInt);
    return {
      id: hockeyStandingId(tournamentId, idx + 1),
      championship_id: tournamentId,
      team_id: teamId,
      position: parseInt(entry.puesto, 10),
      played: parseInt(entry.partidosJugados, 10),
      won: parseInt(entry.partidosGanados, 10),
      tied: parseInt(entry.partidosEmpatados, 10),
      lost: parseInt(entry.partidosPerdidos, 10),
      points_favor: parseInt(entry.golesAFavor, 10),
      points_against: parseInt(entry.golesEnContra, 10),
      bonus_offensive: parseInt(entry.puntosBonus ?? "0", 10) || 0,
      bonus_defensive: 0,
      points_total: parseInt(entry.puntos, 10),
      champion: false,
      created_at: null,
      updated_at: new Date().toISOString(),
      deleted_at: null,
      created_by: 0,
      updated_by: 0,
      deleted_by: 0,
      team: {
        id: teamId,
        name: entry.club.trim(),
        club_id: clubId,
        championship_id: tournamentId,
        created_at: "",
        updated_at: "",
        deleted_at: null,
        club: {
          id: clubId,
          name: entry.club.trim(),
          image_uri: entry.club_escudo,
          image_uri_with_base_url: entry.club_escudo,
          is_formative: 0,
        },
      },
      championship: {
        id: tournamentId,
        name: detalle.nombreTorneo ?? `Hockey ${tournamentId}`,
      },
    };
  });

  return { positions, source: "api" as const, lastSync: null };
}
