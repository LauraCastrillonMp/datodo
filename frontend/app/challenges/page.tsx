"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Code, Clock, Trophy, Star, Search, CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: string
  points: number
  time_limit: number
  data_structure: {
    name: string
    slug: string
  }
  userProgress: {
    status: string
    score: number
  } | null
}

export default function ChallengesPage() {
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Desafíos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-dashed border-2 border-muted-foreground/20 transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-gaming-purple dark:hover:border-primary cursor-pointer">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-green-500 text-white">
                Principiante
              </Badge>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>15 min</span>
              </div>
            </div>
            <CardTitle className="text-xl">Operaciones de Matriz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Implemente operaciones básicas de matriz como inserción, eliminación y búsqueda.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-gaming-gold" />
                <span className="text-sm">50 XP</span>
              </div>
              <Button disabled variant="outline" size="sm">
                Próximamente
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-muted-foreground/20 transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-gaming-purple dark:hover:border-primary cursor-pointer">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-yellow-500 text-white">
                Intermedio
              </Badge>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>20 min</span>
              </div>
            </div>
            <CardTitle className="text-xl">Implementación de Pila</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Construya una estructura de datos de pila con operaciones de empuje, pop y inspección.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-gaming-gold" />
                <span className="text-sm">75 XP</span>
              </div>
              <Button disabled variant="outline" size="sm">
                Próximamente
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-muted-foreground/20 transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-gaming-purple dark:hover:border-primary cursor-pointer">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-red-500 text-white">
                Avanzado
              </Badge>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>30 min</span>
              </div>
            </div>
            <CardTitle className="text-xl">Recorrido de Árbol Binario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Implemente algoritmos de recorrido de árbol binario como recorrido en orden, recorrido previo y recorrido posterior.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-gaming-gold" />
                <span className="text-sm">100 XP</span>
              </div>
              <Button disabled variant="outline" size="sm">
                Próximamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-gaming-purple/10 to-gaming-gold/10 border-gaming-purple/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Code className="w-16 h-16 mx-auto text-gaming-purple" />
            <h3 className="text-xl font-semibold">¡Desafíos próximamente!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Estamos trabajando duro para traerte desafíos de codificación interactivos. ¡Pronto podrás probar tu conocimiento sobre estructuras de datos con problemas de codificación reales!
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/')}>Volver al panel</Button>
              <Button onClick={() => router.push('/theory')}>Ver teoría</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
