import { prisma } from "../../db/prisma";
import { config } from "../../config";
import { fetchHockeyTournament } from "../../services/hockeyApiClient";
import {
  normalizeHockeyChampionship,
  normalizeHockeyPositions,
  hockeyClubId,
  hockeyTeamId,
} from "./hockeyNormalizer";

export async function getHockeyChampionship(id: number) {
  if (config.dataSource === "api") {
    const raw = await fetchHockeyTournament(id);
    return normalizeHockeyChampionship(raw, id);
  }

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
    throw new Error(`Torneo hockey ${id} no encontrado en DB. Ejecutá npm run sync primero.`);
  }

  function buildClubShape(club: { id: number; name: string; imageUri: string }) {
    return {
      id: club.id,
      name: club.name,
      image_uri: club.imageUri,
      image_uri_with_base_url: club.imageUri, // hockey: imageUri ya es URL completa
      is_formative: 0,
    };
  }

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
      club: buildClubShape(t.club),
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
        local_team_offensive_bonus: 0,
        visit_team_offensive_bonus: 0,
        local_team_defensive_bonus: 0,
        visit_team_defensive_bonus: 0,
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
          club: buildClubShape(m.localTeam.club),
        },
        visit_team: {
          id: m.visitTeam.id,
          name: m.visitTeam.name,
          club_id: m.visitTeam.clubId,
          championship_id: m.visitTeam.tournamentId,
          created_at: "",
          updated_at: "",
          deleted_at: null,
          club: buildClubShape(m.visitTeam.club),
        },
      })),
    })),
  };

  return {
    championship: [championship],
    source: "db" as const,
    lastSync: tournament.syncedAt.toISOString(),
  };
}

export async function getHockeyPositions(id: number) {
  if (config.dataSource === "api") {
    const raw = await fetchHockeyTournament(id);
    return normalizeHockeyPositions(raw, id);
  }

  const standings = await prisma.standing.findMany({
    where: { tournamentId: id },
    include: {
      team: { include: { club: true } },
      tournament: true,
    },
    orderBy: { position: "asc" },
  });

  const lastSync = standings[0]?.updatedAt?.toISOString() ?? null;

  function buildClubShape(club: { id: number; name: string; imageUri: string }) {
    return {
      id: club.id,
      name: club.name,
      image_uri: club.imageUri,
      image_uri_with_base_url: club.imageUri,
      is_formative: 0,
    };
  }

  const positions = standings.map((s) => ({
    id: s.id,
    championship_id: s.tournamentId,
    team_id: s.teamId,
    position: s.position,
    played: s.played,
    won: s.won,
    tied: s.tied,
    lost: s.lost,
    points_favor: s.pointsFavor,
    points_against: s.pointsAgainst,
    bonus_offensive: s.bonusOffensive,
    bonus_defensive: s.bonusDefensive,
    points_total: s.pointsTotal,
    champion: s.champion,
    created_at: null,
    updated_at: s.updatedAt.toISOString(),
    deleted_at: null,
    created_by: 0,
    updated_by: 0,
    deleted_by: 0,
    team: {
      id: s.team.id,
      name: s.team.name,
      club_id: s.team.clubId,
      championship_id: s.team.tournamentId,
      created_at: "",
      updated_at: "",
      deleted_at: null,
      club: buildClubShape(s.team.club),
    },
    championship: { id: s.tournament.id, name: s.tournament.name },
  }));

  return { positions, source: "db" as const, lastSync };
}
