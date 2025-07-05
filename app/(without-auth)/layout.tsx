"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { ROUTES } from "@/lib/constants";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard redirectIfAuthenticated={ROUTES.MODEL}>{children}</AuthGuard>
  );
}
