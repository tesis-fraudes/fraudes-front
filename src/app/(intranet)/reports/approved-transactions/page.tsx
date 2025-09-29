import { ProtectedRoute } from "@/module/guard/components/ProtectedRoute";
import ContentApprovedTransactionsReportPage from "@/module/reports/components/ContentApprovedTransactionsReportPage";

export default function ApprovedTransactionsReportPage() {
  return (
    <ProtectedRoute>
      <ContentApprovedTransactionsReportPage />
    </ProtectedRoute>
  );
}
