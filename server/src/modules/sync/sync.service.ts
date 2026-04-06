import { prisma } from "../../db/prisma";
import { fetchUrbaChampionship, fetchUrbaPositions } from "../../services/urbaApiClient";
import { tournaments, type TournamentConfig } from "../../config/tournaments";

/**
 * Sincroniza un torneo desde la API de URBA a la base de datos local.
 * Usa upsert para ser idempotente — se puede re-ejecutar sin duplicados.
 */
export async function syncTournament(tournament: TournamentConfig): Promise<{ id: number; name: string }> {
  const [champResponse, posResponse] = await Promise.all([
    fetchUrbaChampionship(tournament.id),
    fetchUrbaPositions(tournament.id),
  ]);

  const raw = champResponse.championship?.[0];
  if (!raw) throw new Error(`Campeonato ${tournament.id} vacío`);

  // Upsert torneo
  await prisma.tournament.upsert({
    where: { id: raw.id },
    create: {
      id: raw.id,
      slug: tournament.slug,
      name: raw.name,
      alias: raw.alias ?? "",
      seasonId: raw.season.id,
      seasonName: raw.season.name,
      closed: raw.closed,
      syncedAt: new Date(),
    },
    update: {
      slug: tournament.slug,
      name: raw.name,
      alias: raw.alias ?? "",
      closed: raw.closed,
      syncedAt: new Date(),
    },
  });

  // Upsert clubes y equipos
  const teams: any[] = raw.teams ?? [];
  for (const team of teams) {
    await prisma.club.upsert({
      where: { id: team.club.id },
      create: {
        id: team.club.id,
        name: team.club.name,
        imageUri: team.club.image_uri ?? "",
      },
      update: {
        name: team.club.name,
        imageUri: team.club.image_uri ?? "",
      },
    });

    await prisma.team.upsert({
      where: { id: team.id },
      create: {
        id: team.id,
        name: team.name,
        clubId: team.club.id,
        tournamentId: raw.id,
      },
      update: {
        name: team.name,
        clubId: team.club.id,
        tournamentId: raw.id,
      },
    });
  }

  // Upsert rounds y partidos
  const rounds: any[] = raw.rounds ?? [];
  for (const round of rounds) {
    await prisma.round.upsert({
      where: { id: round.id },
      create: {
        id: round.id,
        name: round.name,
        playoffs: round.playoffs ?? false,
        playdate: new Date(round.playdate),
        tournamentId: raw.id,
      },
      update: {
        name: round.name,
        playoffs: round.playoffs ?? false,
        playdate: new Date(round.playdate),
      },
    });

    const matches: any[] = round.matches ?? [];
    for (const match of matches) {
      await prisma.match.upsert({
        where: { id: match.id },
        create: {
          id: match.id,
          localTeamId: match.local_team_id,
          visitTeamId: match.visit_team_id,
          roundId: match.round_id,
          playdate: new Date(match.playdate),
          fulfilled: match.fulfilled ?? false,
          suspended: match.suspended ?? false,
          localTeamScore: match.local_team_score ?? 0,
          visitTeamScore: match.visit_team_score ?? 0,
          localTeamOffensiveBonus: match.local_team_offensive_bonus ?? 0,
          visitTeamOffensiveBonus: match.visit_team_offensive_bonus ?? 0,
          localTeamDefensiveBonus: match.local_team_defensive_bonus ?? 0,
          visitTeamDefensiveBonus: match.visit_team_defensive_bonus ?? 0,
          videoUrl: match.video_club || match.video_tv || "",
        },
        update: {
          fulfilled: match.fulfilled ?? false,
          suspended: match.suspended ?? false,
          localTeamScore: match.local_team_score ?? 0,
          visitTeamScore: match.visit_team_score ?? 0,
          localTeamOffensiveBonus: match.local_team_offensive_bonus ?? 0,
          visitTeamOffensiveBonus: match.visit_team_offensive_bonus ?? 0,
          localTeamDefensiveBonus: match.local_team_defensive_bonus ?? 0,
          visitTeamDefensiveBonus: match.visit_team_defensive_bonus ?? 0,
          videoUrl: match.video_club || match.video_tv || "",
        },
      });
    }
  }

  // Upsert posiciones
  const positions: any[] = posResponse.positions ?? [];
  for (const pos of positions) {
    await prisma.standing.upsert({
      where: { id: pos.id },
      create: {
        id: pos.id,
        tournamentId: raw.id,
        teamId: pos.team_id,
        position: pos.position,
        played: pos.played,
        won: pos.won,
        tied: pos.tied,
        lost: pos.lost,
        pointsFavor: pos.points_favor,
        pointsAgainst: pos.points_against,
        bonusOffensive: pos.bonus_offensive,
        bonusDefensive: pos.bonus_defensive,
        pointsTotal: pos.points_total,
        champion: pos.champion ?? false,
      },
      update: {
        position: pos.position,
        played: pos.played,
        won: pos.won,
        tied: pos.tied,
        lost: pos.lost,
        pointsFavor: pos.points_favor,
        pointsAgainst: pos.points_against,
        bonusOffensive: pos.bonus_offensive,
        bonusDefensive: pos.bonus_defensive,
        pointsTotal: pos.points_total,
        champion: pos.champion ?? false,
      },
    });
  }

  return { id: raw.id, name: raw.name };
}

/** Sincroniza todos los torneos configurados */
export async function syncAllTournaments(): Promise<Array<{ id: number; name: string }>> {
  const results = [];
  for (const t of tournaments) {
    try {
      const result = await syncTournament(t);
      results.push(result);
      console.log(`[sync] OK: ${result.name} (${result.id})`);
    } catch (err) {
      console.error(`[sync] ERROR: ${t.name} (${t.id})`, err);
      results.push({ id: t.id, name: `ERROR: ${t.name}` });
    }
  }
  return results;
}
