import { Router } from "express";
import { getChampionship } from "../modules/championships/championship.service";

const router = Router();

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
    const data = await getChampionship(id);
    res.json(data);
  } catch (err: any) {
    console.error("[championship]", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
