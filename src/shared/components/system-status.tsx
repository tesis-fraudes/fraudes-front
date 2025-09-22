"use client";

import { AlertCircle, CheckCircle, RefreshCw, XCircle } from "lucide-react";
import { useHealth } from "../hooks/useHealth";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function SystemStatus() {
  const { health, isLoading, error, checkHealth, isSystemHealthy } = useHealth();

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (error) return <XCircle className="h-4 w-4 text-red-500" />;
    if (isSystemHealthy) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusBadge = () => {
    if (isLoading) return <Badge variant="secondary">Verificando...</Badge>;
    if (error) return <Badge variant="destructive">Error</Badge>;
    if (isSystemHealthy)
      return (
        <Badge variant="default" className="bg-green-500">
          Saludable
        </Badge>
      );
    return <Badge variant="destructive">No saludable</Badge>;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
        <Button variant="ghost" size="sm" onClick={checkHealth} disabled={isLoading}>
          {getStatusIcon()}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estado:</span>
            {getStatusBadge()}
          </div>

          {health && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tiempo activo:</span>
                <span className="text-sm font-medium">
                  {Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m
                </span>
              </div>

              {health.version && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Versión:</span>
                  <span className="text-sm font-medium">{health.version}</span>
                </div>
              )}

              {health.environment && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Entorno:</span>
                  <span className="text-sm font-medium">{health.environment}</span>
                </div>
              )}
            </>
          )}

          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
