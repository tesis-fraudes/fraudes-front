import { ProtectedRoute } from "@/module/guard";
import { Permission } from "@/module/guard/types/roles";
import { ContentModelPage } from "@/module/model";

export default function ModelPage() {
  return (
    <ProtectedRoute 
      requiredPermissions={[Permission.MODEL_VIEW]}
    >
      <ContentModelPage />
    </ProtectedRoute>
  );
}
