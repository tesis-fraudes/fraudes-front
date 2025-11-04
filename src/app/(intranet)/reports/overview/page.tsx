"use client";

import { ProtectedRoute } from "@/module/guard";
import { ContentOverviewPage } from "@/module/overview";

export default function OverviewPage() {
  return (
    <ProtectedRoute>
      <ContentOverviewPage />
    </ProtectedRoute>
  );
}

