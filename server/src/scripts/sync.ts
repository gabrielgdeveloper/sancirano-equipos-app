/**
 * Script de sincronización inicial desde API a DB.
 * Uso: npm run sync
 * O directamente: ts-node src/scripts/sync.ts
 */
import "dotenv/config";
import { syncAllTournaments } from "../modules/sync/sync.service";
import { prisma } from "../db/prisma";

async function main() {
  console.log("=== Sincronización URBA → DB ===");
  console.log(`Inicio: ${new Date().toLocaleString("es-AR")}\n`);

  try {
    const results = await syncAllTournaments();
    console.log("\n=== Resultado ===");
    for (const r of results) {
      const ok = !r.name.startsWith("ERROR");
      console.log(`${ok ? "✓" : "✗"} ${r.name} (${r.id})`);
    }
    console.log(`\nFin: ${new Date().toLocaleString("es-AR")}`);
  } catch (err) {
    console.error("Error crítico:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
