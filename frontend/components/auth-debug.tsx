"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function AuthDebug() {
  const { user, userProfile, loading, initialized, refreshUser } = useAuth()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-yellow-50 border-yellow-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Debug de Autenticación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Cargando:</span>
          <Badge variant={loading ? "destructive" : "secondary"}>
            {loading ? "Sí" : "No"}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span>Inicializado:</span>
          <Badge variant={initialized ? "secondary" : "destructive"}>
            {initialized ? "Sí" : "No"}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span>Usuario:</span>
          <Badge variant={user ? "secondary" : "destructive"}>
            {user ? "Conectado" : "No conectado"}
          </Badge>
        </div>
        {user && (
          <div className="text-xs text-muted-foreground">
            <div>ID: {user.id}</div>
            <div>Email: {user.email}</div>
            <div>Rol: {user.role}</div>
          </div>
        )}
        <Button 
          size="sm" 
          variant="outline" 
          onClick={refreshUser}
          className="w-full"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Actualizar
        </Button>
      </CardContent>
    </Card>
  )
} 