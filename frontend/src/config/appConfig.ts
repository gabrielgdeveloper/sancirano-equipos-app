export type DataSource = "api" | "db";

export const appConfig = {
  /** "api" => consulta APIs externas de URBA; "db" => consulta el server local/cacheado */
  dataSource: (import.meta.env.VITE_DATA_SOURCE as DataSource) ?? "api",

  /** URL base del server propio (BFF) */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api",

  /** Nombre del equipo seguido por defecto */
  trackedTeamName: "San Cirano",

  /** URL base para los escudos de clubes */
  imageBaseUrl: "https://urbaimagenes-cddyfadwc8dqcchn.z03.azurefd.net",
} as const;
