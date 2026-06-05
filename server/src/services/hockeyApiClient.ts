import axios from "axios";
import crypto from "crypto";

const KEY = Buffer.from("uweoEVNeycw7CFBXtHNCy3nbJZmUPl0EosXGRrNDgdU=", "base64");

function decrypt(encryptedStr: string): string {
  const s = encryptedStr.trim().replace(/^"|"$/g, "");
  const colonIdx = s.indexOf(":");
  if (colonIdx === -1) throw new Error("Formato encriptado inválido");
  const iv = Buffer.from(s.slice(0, colonIdx), "hex");
  const ct = Buffer.from(s.slice(colonIdx + 1), "hex");
  const decipher = crypto.createDecipheriv("aes-256-ctr", KEY, iv);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
}

const hockeyClient = axios.create({
  baseURL: "https://api.tournamenttracker.buenosaireshockey.ar",
  timeout: 15000,
  transformResponse: [(data) => {
    if (typeof data !== "string") return data;
    try {
      return JSON.parse(decrypt(data));
    } catch {
      return data;
    }
  }],
});

export async function fetchHockeyTournament(id: number): Promise<any> {
  const paddedId = id.toString().padStart(8, "0");
  const { data } = await hockeyClient.get(`/torneos/${paddedId}`);
  return data;
}
