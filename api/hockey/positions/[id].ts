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

const CLUB_OFF     = 20_000_000;
const TEAM_OFF     = 21_000_000;
const STANDING_OFF = 23_000_000;

function clubId(c: number)             { return CLUB_OFF     + c; }
function teamId(t: number, c: number)  { return TEAM_OFF     + t * 10_000 + c; }
function standId(t: number, i: number) { return STANDING_OFF + t * 1_000  + i; }

function normalize(hockey: any, tid: number) {
  const det   = hockey.detalle ?? {};
  const tabla: any[] = hockey.fases?.[0]?.zonas?.[0]?.tabla ?? [];

  const positions = tabla.map((e: any, idx: number) => {
    const c = parseInt(e.clubId, 10);
    return {
      id: standId(tid, idx + 1), championship_id: tid,
      team_id: teamId(tid, c), position: parseInt(e.puesto, 10),
      played: parseInt(e.partidosJugados, 10), won: parseInt(e.partidosGanados, 10),
      tied: parseInt(e.partidosEmpatados, 10), lost: parseInt(e.partidosPerdidos, 10),
      points_favor: parseInt(e.golesAFavor, 10), points_against: parseInt(e.golesEnContra, 10),
      bonus_offensive: parseInt(e.puntosBonus ?? "0", 10) || 0, bonus_defensive: 0,
      points_total: parseInt(e.puntos, 10), champion: false,
      created_at: null, updated_at: new Date().toISOString(), deleted_at: null,
      created_by: 0, updated_by: 0, deleted_by: 0,
      team: {
        id: teamId(tid, c), name: e.club.trim(),
        club_id: clubId(c), championship_id: tid,
        created_at: "", updated_at: "", deleted_at: null,
        club: { id: clubId(c), name: e.club.trim(), image_uri: e.club_escudo, image_uri_with_base_url: e.club_escudo, is_formative: 0 },
      },
      championship: { id: tid, name: det.nombreTorneo ?? `Hockey ${tid}` },
    };
  });

  return { positions, source: "api", lastSync: null };
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
    console.error("[hockey/positions]", err.message);
    res.status(502).json({ error: err.message });
  }
}
