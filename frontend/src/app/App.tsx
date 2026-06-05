import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Layout } from "@/components/layout/Layout";
import { LandingPage } from "@/pages/LandingPage";
import { HomePage } from "@/pages/HomePage";
import { TeamPage } from "@/pages/TeamPage";
import { StandingsPage } from "@/pages/StandingsPage";
import { LastResultsPage } from "@/pages/LastResultsPage";

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
          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />
          <Route element={<Layout />}>
            {/* Home del torneo */}
            <Route path="/torneo/:slug" element={<HomePage />} />
            {/* Vista de equipo */}
            <Route path="/torneo/:slug/equipo/:teamSlug" element={<TeamPage />} />
            {/* Tabla de posiciones */}
            <Route path="/torneo/:slug/posiciones" element={<StandingsPage />} />
            {/* Últimos resultados de todas las divisiones */}
            <Route path="/ultimos-resultados" element={<LastResultsPage />} />
          </Route>
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
