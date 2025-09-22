"use client";

import { ProtectedRoute } from "@/module/guard";
import { ContentTransactionsPage } from "@/module/transactions";

export default function TransactionsPage() {
  return (
    <ProtectedRoute>
      <ContentTransactionsPage />
    </ProtectedRoute>
  );
}
