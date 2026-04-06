import axios from "axios";
import type { ApiChampionshipResponse, ApiPositionsResponse } from "@/types/api";
import { appConfig } from "@/config/appConfig";

const client = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 15000,
});

/** Obtiene campeonato con rounds, partidos y equipos */
export async function fetchChampionship(id: number): Promise<ApiChampionshipResponse> {
  const { data } = await client.get<ApiChampionshipResponse>(`/championship/${id}`);
  return data;
}

/** Obtiene tabla de posiciones */
export async function fetchPositions(id: number): Promise<ApiPositionsResponse> {
  const { data } = await client.get<ApiPositionsResponse>(`/positions/${id}`);
  return data;
}

/** Dispara sincronización completa a DB (solo si DATA_SOURCE=db en el server) */
export async function triggerSync(tournamentId?: number): Promise<{ message: string; lastSync: string }> {
  const url = tournamentId ? `/sync/${tournamentId}` : "/sync";
  const { data } = await client.post(url);
  return data;
}
