import crypto from "crypto";

const KEY = Buffer.from("uweoEVNeycw7CFBXtHNCy3nbJZmUPl0EosXGRrNDgdU=", "base64");

function decrypt(encryptedStr: string): string {
  const s = encryptedStr.trim().replace(/^"|"$/g, "");
  const colonIdx = s.indexOf(":");
  const iv = Buffer.from(s.slice(0, colonIdx), "hex");
  const ct = Buffer.from(s.slice(colonIdx + 1), "hex");
  const decipher = crypto.createDecipheriv("aes-256-ctr", KEY, iv);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
}

function parseDate(horario: string | undefined): string {
  if (!horario) return new Date().toISOString();
  return horario.replace(/\//g, "-").replace(" ", "T");
}

const CLUB_OFF  = 20_000_000;
const TEAM_OFF  = 21_000_000;
const ROUND_OFF = 22_000_000;
const MATCH_OFF = 10_000_000;

function clubId(c: number)                         { return CLUB_OFF  + c; }
function teamId(t: number, c: number)              { return TEAM_OFF  + t * 10_000 + c; }
function roundId(t: number, f: number)             { return ROUND_OFF + t * 1_000  + f; }
function matchId(m: string)                        { return MATCH_OFF + parseInt(m, 10); }

function buildTeam(tid: number, clubStr: string, nombre: string, escudo: string) {
  const c = parseInt(clubStr, 10);
  return {
    id: teamId(tid, c), name: nombre.trim(),
    club_id: clubId(c), championship_id: tid,
    created_at: "", updated_at: "", deleted_at: null,
    club: { id: clubId(c), name: nombre.trim(), image_uri: escudo, image_uri_with_base_url: escudo, is_formative: 0 },
  };
}

function normalize(hockey: any, tid: number) {
  const det = hockey.detalle ?? {};
  const partidos: any[] = (hockey.fases?.[0]?.zonas?.[0]?.partidos ?? []).filter((p: any) => !p.isGhostMatch);

  const teams = new Map<string, ReturnType<typeof buildTeam>>();
  for (const p of partidos) {
    if (!teams.has(p.idClubLocal))
      teams.set(p.idClubLocal, buildTeam(tid, p.idClubLocal, p.nombreLocal, p.escudoImagePathLocal ?? ""));
    if (!teams.has(p.idClubVisitante))
      teams.set(p.idClubVisitante, buildTeam(tid, p.idClubVisitante, p.nombreVisitante, p.escudoImagePathVisitante ?? ""));
  }

  const roundsMap = new Map<number, any[]>();
  for (const p of partidos) {
    const f = parseInt(p.numeroFecha, 10);
    if (!roundsMap.has(f)) roundsMap.set(f, []);
    roundsMap.get(f)!.push(p);
  }

  const rounds = Array.from(roundsMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([f, ps]) => {
      const rid = roundId(tid, f);
      return {
        id: rid, name: `Fecha ${f}`, championship_id: tid,
        playoffs: false, playdate: parseDate(ps[0]?.horario),
        created_at: "", updated_at: "",
        matches: ps.map((p) => ({
          id: matchId(p.id),
          local_team_id:  teamId(tid, parseInt(p.idClubLocal, 10)),
          visit_team_id:  teamId(tid, parseInt(p.idClubVisitante, 10)),
          round_id: rid, playdate: parseDate(p.horario),
          fulfilled: p.played === true, suspended: false,
          local_team_score:  parseInt(p.golesLocal ?? "0", 10) || 0,
          visit_team_score:  parseInt(p.golesVisitante ?? "0", 10) || 0,
          local_team_offensive_bonus: 0, visit_team_offensive_bonus: 0,
          local_team_defensive_bonus: 0, visit_team_defensive_bonus: 0,
          video_club: "", video_tv: "",
          local_team:  teams.get(p.idClubLocal),
          visit_team:  teams.get(p.idClubVisitante),
        })),
      };
    });

  return {
    championship: [{
      id: tid, name: det.nombreTorneo ?? `Hockey ${tid}`,
      alias: [det.categoria?.categoriaNombre, det.division?.divisionNombre].filter(Boolean).join(" "),
      closed: false, has_playoffs: false, stared: false, logo_image: "",
      season_id: parseInt(det.temporada?.temporadaId ?? "0", 10),
      season: { id: parseInt(det.temporada?.temporadaId ?? "0", 10), name: det.temporada?.temporadaNombre ?? "2026", closed: false, created_at: "", updated_at: "", deleted_at: null },
      teams: Array.from(teams.values()), rounds,
    }],
    source: "api", lastSync: null,
  };
}

export default async function handler(req: any, res: any) {
  const id = parseInt(req.query.id as string, 10);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
  try {
    const paddedId = id.toString().padStart(8, "0");
    const response = await fetch(`https://api.tournamenttracker.buenosaireshockey.ar/torneos/${paddedId}`);
    if (!response.ok) throw new Error(`Hockey API error: ${response.status}`);
    const raw = decrypt(await response.text());
    const data = normalize(JSON.parse(raw), id);
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.json(data);
  } catch (err: any) {
    console.error("[hockey/championship]", err.message);
    res.status(502).json({ error: err.message });
  }
}
