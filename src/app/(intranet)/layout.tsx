import { ProtectedRoute, UserRole } from "@/module/guard";
import IntranetLayout from "@/shared/components/layouts/IntranetLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.GERENTE, UserRole.ANALISTA]}>
      <IntranetLayout>{children}</IntranetLayout>
    </ProtectedRoute>
  );
}
