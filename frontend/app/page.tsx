"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api"
import { SquareStackIcon as Stack, List, Binary, TreePine, Network, Hash, Play, BookOpen, ArrowRight } from "lucide-react"
import LandingPage from "./landing/page"
import Link from "next/link"
import { PageLoadingSpinner } from "@/components/loading-spinner"

interface DataStructure {
  id: number
  name: string
  slug: string
  description: string
  difficulty: string
  icon: string
  progress?: number
}

const iconMap = { Stack, List, Binary, TreePine, Network, Hash }
const difficultyColors = { Beginner: "bg-green-500", Intermediate: "bg-yellow-500", Advanced: "bg-red-500" }

export default function HomePage() {
  const { userProfile, loading, initialized } = useAuth()
  const [dataStructures, setDataStructures] = useState<DataStructure[]>([])
  const [dsLoading, setDsLoading] = useState(false)
  const [dsError, setDsError] = useState<string | null>(null)

  useEffect(() => {
    if (userProfile) {
      fetchData()
    }
  }, [userProfile])

  const fetchData = async () => {
    try {
      setDsLoading(true)
      setDsError(null)
      const { data: structures, error: structuresError } = await apiClient.getDataStructures()
      if (structuresError) {
        setDsError(structuresError)
        return
      }
      const structuresArray = Array.isArray(structures) ? structures : []
      const transformedStructures: DataStructure[] = structuresArray.map((structure: any) => ({
        id: structure.id,
        name: structure.title,
        slug: structure.slug || (structure.title || '').toLowerCase().replace(/\s+/g, '-'),
        description: structure.description,
        difficulty: structure.difficulty || 'Beginner',
        icon: structure.icon || 'List',
        progress: 0,
      }))
      setDataStructures(transformedStructures)
    } catch (error) {
      setDsError('Error al cargar las estructuras de datos')
    } finally {
      setDsLoading(false)
    }
  }

  const getIconComponent = (iconName: string) => iconMap[iconName as keyof typeof iconMap] || List

  // Show spinner while auth is loading/initializing
  if (loading || !initialized) {
    return <PageLoadingSpinner text="Cargando..." />
  }

  // Show landing page only if auth is initialized and user is not logged in
  if (!userProfile) {
    return <LandingPage />
  }

  // Dashboard para usuarios autenticados
  if (dsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (dsError) {
    return (
      <div className="p-6">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Error al cargar los datos</h2>
          <p className="text-muted-foreground">{dsError}</p>
          <Button onClick={fetchData} variant="outline">
            Intentar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-3 md:p-4 lg:p-6 space-y-6 sm:space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 w-full">
          <div className="space-y-2 w-full lg:w-auto">
            <h1 className="text-xl sm:text-3xl md:text-3xl font-bold">
              ¡Bienvenido de nuevo, {userProfile?.name || userProfile?.username || "Estudiante"}!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Continúa tu aprendizaje de estructuras de datos y mejora tus habilidades</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {dataStructures.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-muted-foreground">Aún no hay estructuras de datos disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {dataStructures.map((structure) => {
              const IconComponent = getIconComponent(structure.icon)
              return (
                <Link key={structure.id} href={`/structures/${structure.slug}`} className="w-full">
                  <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border-2 hover:border-gaming-purple w-full">
                    <CardHeader className="pb-3 p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-gaming-purple" />
                        <Badge variant="secondary" className={`${difficultyColors[structure.difficulty as keyof typeof difficultyColors] || "bg-gray-500"} text-white text-xs`}>
                          {structure.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-base sm:text-lg md:text-xl group-hover:text-gaming-purple transition-colors">
                        {structure.name}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">{structure.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 p-4 sm:p-6">
                      {userProfile && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Progreso</span>
                            <span>{structure.progress || 0}%</span>
                          </div>
                          <Progress value={structure.progress || 0} className="h-2" />
                        </div>
                      )}
                      <Button className="w-full mt-4 text-sm sm:text-base" variant="outline">
                        Saber más
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
