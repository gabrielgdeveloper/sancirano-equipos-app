import { appConfig } from "@/config/appConfig";

/**
 * Construye la URL completa del escudo de un club.
 * La API ya trae `image_uri_with_base_url` pero usamos el imageUri para
 * que el helper sea la única fuente de verdad y permita cambiar la base URL desde config.
 */
export function buildImageUrl(imageUri: string | null | undefined): string {
  if (!imageUri) return "/placeholder-shield.svg";
  if (imageUri.startsWith("http")) return imageUri;
  const base = appConfig.imageBaseUrl.replace(/\/$/, "");
  const uri = imageUri.replace(/^\//, "");
  return `${base}/${uri}`;
}
