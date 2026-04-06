import axios from "axios";
import { config } from "../config";

const urbaClient = axios.create({
  baseURL: config.urbaApiBaseUrl,
  timeout: 15000,
});

export async function fetchUrbaChampionship(id: number) {
  const { data } = await urbaClient.get(`/championship/${id}`);
  return data;
}

export async function fetchUrbaPositions(id: number) {
  const { data } = await urbaClient.get(`/positions/${id}`);
  return data;
}
