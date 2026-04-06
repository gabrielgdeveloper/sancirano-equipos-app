import "dotenv/config";

export type DataSource = "api" | "db";

export const config = {
  port: parseInt(process.env.PORT ?? "3001", 10),
  dataSource: (process.env.DATA_SOURCE ?? "api") as DataSource,
  urbaApiBaseUrl: process.env.URBA_API_BASE_URL ?? "https://api.urba.org.ar/api",
  imageBaseUrl:
    process.env.IMAGE_BASE_URL ??
    "https://urbaimagenes-cddyfadwc8dqcchn.z03.azurefd.net",
} as const;
