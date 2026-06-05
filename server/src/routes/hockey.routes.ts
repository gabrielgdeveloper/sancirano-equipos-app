import { Router } from "express";
import { getHockeyChampionship, getHockeyPositions } from "../modules/hockey/hockey.service";
import { syncHockeyTournament, syncAllHockeyTournaments } from "../modules/sync/hockey-sync.service";
import { hockeyTournaments } from "../config/tournaments";

const router = Router();

router.get("/championship/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
    const data = await getHockeyChampionship(id);
    res.json(data);
  } catch (err: any) {
    console.error("[hockey/championship]", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/positions/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
    const data = await getHockeyPositions(id);
    res.json(data);
  } catch (err: any) {
    console.error("[hockey/positions]", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/sync", async (_req, res) => {
  try {
    const results = await syncAllHockeyTournaments();
    res.json({ ok: true, synced: results, lastSync: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/sync/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const tournament = hockeyTournaments.find((t) => t.id === id);
    if (!tournament) return res.status(404).json({ error: `Torneo hockey ${id} no configurado` });
    const result = await syncHockeyTournament(tournament);
    res.json({ ok: true, synced: result, lastSync: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
