import "dotenv/config";
import express from "express";
import cors from "cors";
import { config } from "./config";
import championshipRoutes from "./routes/championship.routes";
import positionsRoutes from "./routes/positions.routes";
import syncRoutes from "./routes/sync.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Rutas del BFF — mismos paths que la API de URBA para transparencia
app.use("/api/championship", championshipRoutes);
app.use("/api/positions", positionsRoutes);
app.use("/api/sync", syncRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    dataSource: config.dataSource,
    timestamp: new Date().toISOString(),
  });
});

app.listen(config.port, () => {
  console.log(`[server] Corriendo en http://localhost:${config.port}`);
  console.log(`[server] DATA_SOURCE=${config.dataSource}`);
});
