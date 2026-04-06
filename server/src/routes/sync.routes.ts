import { Router } from "express";
import { syncAllTournaments, syncTournament } from "../modules/sync/sync.service";
import { tournaments } from "../config/tournaments";

const router = Router();

/** POST /api/sync — sincroniza todos los torneos */
router.post("/", async (_req, res) => {
  try {
    const results = await syncAllTournaments();
    res.json({ ok: true, synced: results, lastSync: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/** POST /api/sync/:id — sincroniza un torneo específico */
router.post("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const tournament = tournaments.find((t) => t.id === id);
    if (!tournament) return res.status(404).json({ error: `Torneo ${id} no configurado` });
    const result = await syncTournament(tournament);
    res.json({ ok: true, synced: result, lastSync: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
