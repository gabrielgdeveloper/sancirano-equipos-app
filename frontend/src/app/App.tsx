import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/pages/HomePage";
import { TeamPage } from "@/pages/TeamPage";
import { StandingsPage } from "@/pages/StandingsPage";
import { defaultTournament } from "@/config/tournaments";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Redirigir raíz al torneo por defecto */}
          <Route
            path="/"
            element={
              <Navigate
                to={`/torneo/${
                  localStorage.getItem("lastTournamentSlug") ?? defaultTournament.slug
                }`}
                replace
              />
            }
          />
          <Route element={<Layout />}>
            {/* Home del torneo */}
            <Route path="/torneo/:slug" element={<HomePage />} />
            {/* Vista de equipo */}
            <Route path="/torneo/:slug/equipo/:teamSlug" element={<TeamPage />} />
            {/* Tabla de posiciones */}
            <Route path="/torneo/:slug/posiciones" element={<StandingsPage />} />
          </Route>
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
