"use client";

import { ProtectedRoute } from "@/module/guard";
import { ContentReportPage } from "@/module/reports";

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <ContentReportPage />
    </ProtectedRoute>
  );
}
