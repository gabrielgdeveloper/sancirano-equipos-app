import { prisma } from "../../db/prisma";
import { fetchHockeyTournament } from "../../services/hockeyApiClient";
import { hockeyTournaments, type TournamentConfig } from "../../config/tournaments";
import {
  hockeyClubId,
  hockeyTeamId,
  hockeyRoundId,
  hockeyMatchId,
  hockeyStandingId,
  parseHockeyDate,
} from "../hockey/hockeyNormalizer";

export async function syncHockeyTournament(tournament: TournamentConfig): Promise<{ id: number; name: string }> {
  const raw = await fetchHockeyTournament(tournament.id);

  const detalle = raw.detalle ?? {};
  const fase = raw.fases?.[0];
  const zona = fase?.zonas?.[0];
  const partidos: any[] = (zona?.partidos ?? []).filter((p: any) => !p.isGhostMatch);
  const tabla: any[] = zona?.tabla ?? [];

  const seasonId = parseInt(detalle.temporada?.temporadaId ?? "0", 10);
  const seasonName = detalle.temporada?.temporadaNombre ?? "2026";
  const tournamentName = detalle.nombreTorneo ?? `Hockey ${tournament.id}`;
  const alias = [detalle.categoria?.categoriaNombre, detalle.division?.divisionNombre]
    .filter(Boolean)
    .join(" ");

  // Upsert torneo
  await prisma.tournament.upsert({
    where: { id: tournament.id },
    create: {
      id: tournament.id,
      slug: tournament.slug,
      name: tournamentName,
      alias,
      seasonId,
      seasonName,
      closed: false,
      syncedAt: new Date(),
    },
    update: {
      slug: tournament.slug,
      name: tournamentName,
      alias,
      closed: false,
      syncedAt: new Date(),
    },
  });

  // Clubes y equipos derivados de los partidos
  const clubsSeen = new Map<string, { nombre: string; escudo: string }>();
  for (const p of partidos) {
    if (!clubsSeen.has(p.idClubLocal)) {
      clubsSeen.set(p.idClubLocal, { nombre: p.nombreLocal.trim(), escudo: p.escudoImagePathLocal ?? "" });
    }
    if (!clubsSeen.has(p.idClubVisitante)) {
      clubsSeen.set(p.idClubVisitante, { nombre: p.nombreVisitante.trim(), escudo: p.escudoImagePathVisitante ?? "" });
    }
  }

  for (const [clubStringId, info] of clubsSeen) {
    const clubInt = parseInt(clubStringId, 10);
    const dbClubId  = hockeyClubId(clubInt);
    const dbTeamId  = hockeyTeamId(tournament.id, clubInt);

    await prisma.club.upsert({
      where: { id: dbClubId },
      create: { id: dbClubId, name: info.nombre, imageUri: info.escudo },
      update: { name: info.nombre, imageUri: info.escudo },
    });

    await prisma.team.upsert({
      where: { id: dbTeamId },
      create: { id: dbTeamId, name: info.nombre, clubId: dbClubId, tournamentId: tournament.id },
      update: { name: info.nombre, clubId: dbClubId, tournamentId: tournament.id },
    });
  }

  // Agrupar partidos por fecha → rounds
  const roundsMap = new Map<number, any[]>();
  for (const p of partidos) {
    const fecha = parseInt(p.numeroFecha, 10);
    if (!roundsMap.has(fecha)) roundsMap.set(fecha, []);
    roundsMap.get(fecha)!.push(p);
  }

  for (const [fecha, ps] of roundsMap) {
    const dbRoundId = hockeyRoundId(tournament.id, fecha);
    const playdate  = new Date(parseHockeyDate(ps[0]?.horario));

    await prisma.round.upsert({
      where: { id: dbRoundId },
      create: { id: dbRoundId, name: `Fecha ${fecha}`, playoffs: false, playdate, tournamentId: tournament.id },
      update: { name: `Fecha ${fecha}`, playoffs: false, playdate },
    });

    for (const p of ps) {
      const dbMatchId    = hockeyMatchId(p.id);
      const localTeamId  = hockeyTeamId(tournament.id, parseInt(p.idClubLocal, 10));
      const visitTeamId  = hockeyTeamId(tournament.id, parseInt(p.idClubVisitante, 10));
      const matchDate    = new Date(parseHockeyDate(p.horario));

      await prisma.match.upsert({
        where: { id: dbMatchId },
        create: {
          id: dbMatchId,
          localTeamId,
          visitTeamId,
          roundId: dbRoundId,
          playdate: matchDate,
          fulfilled: p.played === true,
          suspended: false,
          localTeamScore: parseInt(p.golesLocal ?? "0", 10) || 0,
          visitTeamScore: parseInt(p.golesVisitante ?? "0", 10) || 0,
          localTeamOffensiveBonus: 0,
          visitTeamOffensiveBonus: 0,
          localTeamDefensiveBonus: 0,
          visitTeamDefensiveBonus: 0,
          videoUrl: "",
        },
        update: {
          fulfilled: p.played === true,
          localTeamScore: parseInt(p.golesLocal ?? "0", 10) || 0,
          visitTeamScore: parseInt(p.golesVisitante ?? "0", 10) || 0,
        },
      });
    }
  }

  // Tabla de posiciones
  tabla.forEach(async (entry, idx) => {
    const clubInt   = parseInt(entry.clubId, 10);
    const dbTeamId  = hockeyTeamId(tournament.id, clubInt);
    const dbStandId = hockeyStandingId(tournament.id, idx + 1);

    await prisma.standing.upsert({
      where: { id: dbStandId },
      create: {
        id: dbStandId,
        tournamentId: tournament.id,
        teamId: dbTeamId,
        position: parseInt(entry.puesto, 10),
        played: parseInt(entry.partidosJugados, 10),
        won: parseInt(entry.partidosGanados, 10),
        tied: parseInt(entry.partidosEmpatados, 10),
        lost: parseInt(entry.partidosPerdidos, 10),
        pointsFavor: parseInt(entry.golesAFavor, 10),
        pointsAgainst: parseInt(entry.golesEnContra, 10),
        bonusOffensive: parseInt(entry.puntosBonus ?? "0", 10) || 0,
        bonusDefensive: 0,
        pointsTotal: parseInt(entry.puntos, 10),
        champion: false,
      },
      update: {
        position: parseInt(entry.puesto, 10),
        played: parseInt(entry.partidosJugados, 10),
        won: parseInt(entry.partidosGanados, 10),
        tied: parseInt(entry.partidosEmpatados, 10),
        lost: parseInt(entry.partidosPerdidos, 10),
        pointsFavor: parseInt(entry.golesAFavor, 10),
        pointsAgainst: parseInt(entry.golesEnContra, 10),
        bonusOffensive: parseInt(entry.puntosBonus ?? "0", 10) || 0,
        pointsTotal: parseInt(entry.puntos, 10),
      },
    });
  });

  return { id: tournament.id, name: tournamentName };
}

export async function syncAllHockeyTournaments(): Promise<Array<{ id: number; name: string }>> {
  const results = [];
  for (const t of hockeyTournaments) {
    try {
      const result = await syncHockeyTournament(t);
      results.push(result);
      console.log(`[hockey-sync] OK: ${result.name} (${result.id})`);
    } catch (err) {
      console.error(`[hockey-sync] ERROR: ${t.name} (${t.id})`, err);
      results.push({ id: t.id, name: `ERROR: ${t.name}` });
    }
  }
  return results;
}
