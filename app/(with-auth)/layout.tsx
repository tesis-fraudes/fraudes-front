"use client"

import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { USER_ROLES, ROUTES } from "@/lib/constants";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard 
      requiredRole={[USER_ROLES.ANALISTA, USER_ROLES.GERENTE]}
      redirectTo={ROUTES.LOGIN}
    >
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
