import { useEffect } from "react";
import { useTournamentData } from "@/hooks/useTournamentData";
import { type TournamentConfig } from "@/config/tournaments";
import { appConfig } from "@/config/appConfig";

export function useFavicon(tournament: TournamentConfig | undefined) {
  const { data } = useTournamentData(tournament);

  useEffect(() => {
    if (!data) return;

    const tracked = data.championship.teams.find((t) =>
      t.club.name.toLowerCase().includes(appConfig.trackedTeamName.toLowerCase().split(" ")[1] ?? "cirano")
    );

    const imageUrl = tracked?.club.imageUrl;
    if (!imageUrl || imageUrl.includes("placeholder")) return;

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.href = imageUrl;
    link.type = imageUrl.endsWith(".svg") ? "image/svg+xml" : "image/png";
  }, [data]);
}
