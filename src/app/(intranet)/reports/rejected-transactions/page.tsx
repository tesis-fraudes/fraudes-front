import { ProtectedRoute } from "@/module/guard/components/ProtectedRoute";
import ContentRejectedTransactionsReportPage from "@/module/reports/components/ContentRejectedTransactionsReportPage";

export default function RejectedTransactionsReportPage() {
  return (
    <ProtectedRoute>
      <ContentRejectedTransactionsReportPage />
    </ProtectedRoute>
  );
}
