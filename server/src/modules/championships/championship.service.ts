import { prisma } from "../../db/prisma";
import { fetchUrbaChampionship } from "../../services/urbaApiClient";
import { config } from "../../config";

/**
 * Obtiene el campeonato:
 * - Si DATA_SOURCE=api: consume URBA directo y re-mapea al shape que espera el frontend
 * - Si DATA_SOURCE=db: consulta SQLite y devuelve el mismo shape
 */
export async function getChampionship(id: number) {
  if (config.dataSource === "api") {
    const raw = await fetchUrbaChampionship(id);
    return { ...raw, source: "api", lastSync: null };
  }

  // Desde DB — construir el shape que coincide con lo que espera el frontend
  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      teams: { include: { club: true } },
      rounds: {
        include: {
          matches: {
            include: {
              localTeam: { include: { club: true } },
              visitTeam: { include: { club: true } },
            },
          },
        },
      },
    },
  });

  if (!tournament) {
    throw new Error(`Torneo ${id} no encontrado en DB. Ejecutá npm run sync primero.`);
  }

  // Re-mapear al shape de API para que los mappers del frontend funcionen igual
  const championship = {
    id: tournament.id,
    name: tournament.name,
    alias: tournament.alias,
    closed: tournament.closed,
    has_playoffs: false,
    stared: false,
    logo_image: "",
    season_id: tournament.seasonId,
    season: {
      id: tournament.seasonId,
      name: tournament.seasonName,
      closed: tournament.closed,
      created_at: "",
      updated_at: "",
      deleted_at: null,
    },
    teams: tournament.teams.map((t) => ({
      id: t.id,
      name: t.name,
      club_id: t.clubId,
      championship_id: t.tournamentId,
      created_at: "",
      updated_at: "",
      deleted_at: null,
      club: {
        id: t.club.id,
        name: t.club.name,
        image_uri: t.club.imageUri,
        image_uri_with_base_url: `${config.imageBaseUrl}/${t.club.imageUri}`,
        is_formative: 0,
      },
    })),
    rounds: tournament.rounds.map((r) => ({
      id: r.id,
      name: r.name,
      championship_id: r.tournamentId,
      playoffs: r.playoffs,
      playdate: r.playdate.toISOString(),
      created_at: "",
      updated_at: "",
      matches: r.matches.map((m) => ({
        id: m.id,
        local_team_id: m.localTeamId,
        visit_team_id: m.visitTeamId,
        round_id: m.roundId,
        playdate: m.playdate.toISOString(),
        fulfilled: m.fulfilled,
        suspended: m.suspended,
        local_team_score: m.localTeamScore,
        visit_team_score: m.visitTeamScore,
        local_team_offensive_bonus: m.localTeamOffensiveBonus,
        visit_team_offensive_bonus: m.visitTeamOffensiveBonus,
        local_team_defensive_bonus: m.localTeamDefensiveBonus,
        visit_team_defensive_bonus: m.visitTeamDefensiveBonus,
        video_club: m.videoUrl,
        video_tv: "",
        local_team: {
          id: m.localTeam.id,
          name: m.localTeam.name,
          club_id: m.localTeam.clubId,
          championship_id: m.localTeam.tournamentId,
          created_at: "",
          updated_at: "",
          deleted_at: null,
          club: {
            id: m.localTeam.club.id,
            name: m.localTeam.club.name,
            image_uri: m.localTeam.club.imageUri,
            image_uri_with_base_url: `${config.imageBaseUrl}/${m.localTeam.club.imageUri}`,
            is_formative: 0,
          },
        },
        visit_team: {
          id: m.visitTeam.id,
          name: m.visitTeam.name,
          club_id: m.visitTeam.clubId,
          championship_id: m.visitTeam.tournamentId,
          created_at: "",
          updated_at: "",
          deleted_at: null,
          club: {
            id: m.visitTeam.club.id,
            name: m.visitTeam.club.name,
            image_uri: m.visitTeam.club.imageUri,
            image_uri_with_base_url: `${config.imageBaseUrl}/${m.visitTeam.club.imageUri}`,
            is_formative: 0,
          },
        },
      })),
    })),
  };

  return {
    championship: [championship],
    source: "db",
    lastSync: tournament.syncedAt.toISOString(),
  };
}
