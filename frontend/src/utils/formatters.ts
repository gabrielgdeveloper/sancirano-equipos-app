import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";

/** Formatea una fecha ISO a "Sáb 14 Mar" */
export function formatMatchDate(isoDate: string): string {
  try {
    const d = parseISO(isoDate);
    if (!isValid(d)) return isoDate;
    return format(d, "EEE d MMM", { locale: es });
  } catch {
    return isoDate;
  }
}

/** Formatea una fecha ISO a "14 de marzo de 2026" */
export function formatLongDate(isoDate: string): string {
  try {
    const d = parseISO(isoDate);
    if (!isValid(d)) return isoDate;
    return format(d, "d 'de' MMMM 'de' yyyy", { locale: es });
  } catch {
    return isoDate;
  }
}

/** Formatea una fecha ISO a "14/03/2026 21:24" */
export function formatDateTime(isoDate: string): string {
  try {
    const d = parseISO(isoDate);
    if (!isValid(d)) return isoDate;
    return format(d, "dd/MM/yyyy HH:mm", { locale: es });
  } catch {
    return isoDate;
  }
}

/** Capitaliza la primera letra */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
