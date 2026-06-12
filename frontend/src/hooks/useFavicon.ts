import { useEffect } from "react";
import champagnatLogo from "@/assets/champagnat.png";

export function useFavicon() {
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = champagnatLogo;
    link.type = "image/png";
  }, []);
}
