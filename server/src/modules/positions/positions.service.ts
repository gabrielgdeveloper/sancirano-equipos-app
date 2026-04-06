import { prisma } from "../../db/prisma";
import { fetchUrbaPositions } from "../../services/urbaApiClient";
import { config } from "../../config";

export async function getPositions(id: number) {
  if (config.dataSource === "api") {
    const raw = await fetchUrbaPositions(id);
    return { ...raw, source: "api", lastSync: null };
  }

  // Desde DB
  const standings = await prisma.standing.findMany({
    where: { tournamentId: id },
    include: {
      team: { include: { club: true } },
      tournament: true,
    },
    orderBy: { position: "asc" },
  });

  const lastSync = standings[0]?.updatedAt?.toISOString() ?? null;

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
    deleted_at: s.updatedAt.toISOString(),
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
      club: {
        id: s.team.club.id,
        name: s.team.club.name,
        image_uri: s.team.club.imageUri,
        image_uri_with_base_url: `${config.imageBaseUrl}/${s.team.club.imageUri}`,
        is_formative: 0,
      },
    },
    championship: { id: s.tournament.id, name: s.tournament.name },
  }));

  return { positions, source: "db", lastSync };
}
