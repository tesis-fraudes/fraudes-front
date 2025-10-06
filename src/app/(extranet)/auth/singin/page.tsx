"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PublicRoute, USER_ROLES_CONFIG, UserRole, useAuth } from "@/module/guard";
import { useRoles } from "@/module/guard/hooks/useRoles";
import { type LoginFormData, loginSchema } from "@/module/guard/schemas/auth.schema";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.ANALISTA);
  const { login, isLoading } = useAuth();
  const { roles, isLoading: isLoadingRoles, error: rolesError } = useRoles();

  // Función para mapear role_id a UserRole
  const getUserRoleFromRoleId = (roleId: number): UserRole => {
    const roleMapping: Record<number, UserRole> = {
      1: UserRole.ADMIN,        // Administrador
      2: UserRole.ANALISTA,     // Analista
      3: UserRole.GERENTE,      // Gerencia
    };
    return roleMapping[roleId] || UserRole.ANALISTA;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "rodolfo.pena@gmail.com",
      password: "123456",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("📝 Formulario enviado:", data);
    console.log("👤 Rol seleccionado:", role);
    setError("");

    try {
      console.log("🚀 Llamando a login...");
      await login({
        email: data.email,
        password: data.password,
        role: role,
      });
      console.log("✅ Login completado exitosamente");
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">NeuroShield - Sistema de Detección y Gestión de Fraudes</h1>
            <p className="text-gray-600">Inicia sesión para acceder al sistema</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className={`mt-1 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pr-10 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
              <div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol de Usuario</Label>
                  <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona tu rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingRoles ? (
                        <SelectItem value="loading" disabled>
                          Cargando roles...
                        </SelectItem>
                      ) : rolesError ? (
                        <SelectItem value="error" disabled>
                          Error al cargar roles
                        </SelectItem>
                      ) : (
                        roles.map((roleData) => {
                          const userRole = getUserRoleFromRoleId(roleData.id);
                          return (
                            <SelectItem key={roleData.id} value={userRole}>
                              {roleData.name}
                            </SelectItem>
                          );
                        })
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {USER_ROLES_CONFIG[role]?.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember" {...register("rememberMe")} />
                <Label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Recordarme
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
              {isLoading || isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              © 2024 NeuroShield - Sistema de Detección y Gestión de Fraudes. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <PublicRoute>
      <SignInForm />
    </PublicRoute>
  );
}
