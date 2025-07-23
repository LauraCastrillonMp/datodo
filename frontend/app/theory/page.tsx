"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Search, 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  List, 
  SquareStackIcon as Stack, 
  TreePine, 
  Binary, 
  Hash, 
  Network,
  Play,
  CheckCircle,
  Circle,
  AlertCircle,
  BookMarked,
  Lightbulb,
  Zap,
  ExternalLink,
  RefreshCw
} from "lucide-react"
import { PageLoadingSpinner } from "@/components/loading-spinner"

interface DataStructure {
  id: number;
  title: string;
  description: string;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  createdAt: string;
  updatedAt: string;
  contents?: DataStructureContent[];
  creator: {
    id: number;
    name: string;
    username: string;
  };
}

interface DataStructureContent {
  id: number;
  contentType: 'general' | 'property' | 'operation' | 'application' | 'resource';
  format: 'text' | 'video' | 'image' | 'link';
  category?: string;
  name: string;
  description?: string;
  complexity?: string;
}

interface TheoryTopic {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  readTime: number;
  description: string;
  icon: any;
  concepts: string[];
  applications: string[];
  dataStructure?: DataStructure;
}

export default function TheoryPage() {
  const { user } = useAuth()
  const [readingProgress, setReadingProgress] = useState<{ [key: string]: number }>({})
  const [completedTopics, setCompletedTopics] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [dataStructures, setDataStructures] = useState<DataStructure[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data structures from API
  useEffect(() => {
    const fetchDataStructures = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiClient.getDataStructures()
        if (!result.error && result.data) {
          setDataStructures(Array.isArray(result.data) ? result.data : [])
        } else {
          setError(result.error || 'Failed to fetch data structures')
        }
      } catch (error) {
        console.error('Error fetching data structures:', error)
        setError('Failed to load theory content')
      } finally {
        setLoading(false)
      }
    }

    fetchDataStructures()
  }, [])

  // Map data structures to theory topics with safe content handling
  const theoryTopics: TheoryTopic[] = dataStructures.map((ds) => {
    const getIcon = (title: string) => {
      const lowerTitle = title.toLowerCase()
      if (lowerTitle.includes('stack') || lowerTitle.includes('pila')) return Stack
      if (lowerTitle.includes('queue') || lowerTitle.includes('cola')) return List
      if (lowerTitle.includes('enlazada-doble') || lowerTitle.includes('double')) return List
      if (lowerTitle.includes('enlazada-circular') || lowerTitle.includes('circular')) return List
      if (lowerTitle.includes('linked') || lowerTitle.includes('enlazada')) return List
      if (lowerTitle.includes('tree') || lowerTitle.includes('árbol')) return TreePine
      if (lowerTitle.includes('bst') || lowerTitle.includes('binario')) return Binary
      if (lowerTitle.includes('heap')) return TreePine
      if (lowerTitle.includes('hash')) return Hash
      if (lowerTitle.includes('graph') || lowerTitle.includes('grafo')) return Network
      return List
    }

    const getCategory = (title: string) => {
      const lowerTitle = title.toLowerCase()
      if (lowerTitle.includes('stack') || lowerTitle.includes('queue') || lowerTitle.includes('linked') || lowerTitle.includes('enlazada')) return "Lineal"
      if (lowerTitle.includes('tree') || lowerTitle.includes('heap') || lowerTitle.includes('bst')) return "Jerárquica"
      if (lowerTitle.includes('hash')) return "Asociativa"
      if (lowerTitle.includes('graph')) return "Red"
      return "Lineal"
    }

    const getDifficulty = (difficulty: string) => {
      switch (difficulty) {
        case 'principiante': return 'Principiante'
        case 'intermedio': return 'Intermedio'
        case 'avanzado': return 'Avanzado'
        default: return 'Principiante'
      }
    }

    // Safely extract concepts and applications from content
    const contents = ds.contents || []
    const concepts = contents
      .filter(content => content.contentType === 'property' || content.contentType === 'operation')
      .map(content => content.name)

    const applications = contents
      .filter(content => content.contentType === 'application')
      .map(content => content.name)

    // Default concepts and applications if none are available
    const defaultConcepts = ['Operaciones básicas', 'Implementación', 'Casos de uso', 'Complejidad temporal']
    const defaultApplications = ['Aplicaciones comunes', 'Uso en el mundo real', 'Resolución de problemas']

    return {
      id: ds.id.toString(),
      title: ds.title,
      category: getCategory(ds.title),
      difficulty: getDifficulty(ds.difficulty),
      readTime: Math.max(10, Math.floor((contents.length || 3) * 2)),
      description: ds.description,
      icon: getIcon(ds.title),
      concepts: concepts.length > 0 ? concepts : defaultConcepts,
      applications: applications.length > 0 ? applications : defaultApplications,
      dataStructure: ds
    }
  })

  const filteredTopics = theoryTopics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || topic.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(theoryTopics.map((t) => t.category)))]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Principiante":
        return "bg-green-500"
      case "Intermedio":
        return "bg-yellow-500"
      case "Avanzado":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Lineal":
        return "text-blue-500"
      case "Jerárquica":
        return "text-purple-500"
      case "Asociativa":
        return "text-orange-500"
      case "Red":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getProgress = (topicId: string) => {
    return readingProgress[topicId] || 0
  }

  const isCompleted = (topicId: string) => {
    return completedTopics.includes(topicId)
  }

  const markAsRead = (topicId: string) => {
    setReadingProgress(prev => ({ ...prev, [topicId]: 100 }))
    if (!completedTopics.includes(topicId)) {
      setCompletedTopics(prev => [...prev, topicId])
    }
  }

  const retryFetch = () => {
    setLoading(true)
    setError(null)
    // Re-fetch data structures
    const fetchDataStructures = async () => {
      try {
        const result = await apiClient.getDataStructures()
        if (!result.error && result.data) {
          setDataStructures(Array.isArray(result.data) ? result.data : [])
        } else {
          setError(result.error || 'Failed to fetch data structures')
        }
      } catch (error) {
        console.error('Error fetching data structures:', error)
        setError('Failed to load theory content')
      } finally {
        setLoading(false)
      }
    }
    fetchDataStructures()
  }

  if (loading) {
    return <PageLoadingSpinner text="Cargando contenido teórico..." />
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-red-600 mb-4">
              <h3 className="text-lg font-semibold mb-2">Error al cargar el contenido</h3>
                <p>{error}</p>
              </div>
              <Button onClick={retryFetch} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar de nuevo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (theoryTopics.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <BookMarked className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No hay contenido teórico disponible</h3>
              <p>Aún no se han creado estructuras de datos. Vuelve más tarde para ver contenido educativo.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Teoría de Estructuras de Datos</h1>
          <p className="text-muted-foreground">
            Fundamentos teóricos completos para comprender las estructuras de datos y sus aplicaciones
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar teoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize w-full sm:w-auto"
              >
                {category === 'all' ? 'Todas' : category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <TrendingUp className="w-5 h-5" />
            Progreso de aprendizaje
          </CardTitle>
          <CardDescription>
            Sigue tu progreso a lo largo del temario de estructuras de datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {theoryTopics.length}
              </div>
              <div className="text-sm text-muted-foreground">Temas totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {completedTopics.length}
              </div>
              <div className="text-sm text-muted-foreground">Completados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((completedTopics.length / theoryTopics.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Progreso</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theory Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...new Map(filteredTopics.map(topic => [topic.id, topic])).values()].map((topic) => (
          <Card key={topic.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <topic.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base md:text-lg">{topic.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge 
                        className={`${getDifficultyColor(topic.difficulty)} text-white text-xs`}
                      >
                        {topic.difficulty}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`${getCategoryColor(topic.category)} text-xs`}
                      >
                        {topic.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{topic.readTime} min</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {topic.description}
              </p>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-medium">{getProgress(topic.id)}%</span>
                </div>
                <Progress value={getProgress(topic.id)} className="h-2" />
              </div>

              {/* Key Concepts */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Conceptos clave</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {topic.concepts.slice(0, 3).map((concept, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {concept}
                    </Badge>
                  ))}
                  {topic.concepts.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{topic.concepts.length - 3} más
                    </Badge>
                  )}
                </div>
              </div>

              {/* Applications */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Aplicaciones</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {topic.applications.slice(0, 2).map((app, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {app}
                    </Badge>
                  ))}
                  {topic.applications.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{topic.applications.length - 2} más
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => markAsRead(topic.id)}
                  disabled={isCompleted(topic.id)}
                >
                  {isCompleted(topic.id) ? 'Completado' : 'Marcar como leído'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Practice
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTopics.length === 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Topics Found</h3>
              <p>Try adjusting your search terms or filters to find what you're looking for.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
