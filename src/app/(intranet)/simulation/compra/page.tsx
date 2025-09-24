import { ProtectedRoute } from "@/module/guard";
import { ContentSimulationCompraPage } from "@/module/simulation";

export default function SimulationCompraPage() {
  return (
    <ProtectedRoute>
      <ContentSimulationCompraPage />
    </ProtectedRoute>
  );
}


