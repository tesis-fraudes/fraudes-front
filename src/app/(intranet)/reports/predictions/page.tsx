import { ProtectedRoute } from "@/module/guard/components/ProtectedRoute";
import ContentPredictionsReportPage from "@/module/reports/components/ContentPredictionsReportPage";

export default function PredictionsReportPage() {
  return (
    <ProtectedRoute>
      <ContentPredictionsReportPage />
    </ProtectedRoute>
  );
}
