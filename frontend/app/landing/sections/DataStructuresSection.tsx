import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Layers, GitBranch, Database, Cpu, Activity, BarChart3 } from "lucide-react"

const dataStructures = [
  {
    name: "Pilas (Stacks)",
    description: "LIFO - Último en entrar, primero en salir",
    icon: Layers,
    difficulty: "Principiante"
  },
  {
    name: "Colas (Queues)",
    description: "FIFO - Primero en entrar, primero en salir",
    icon: GitBranch,
    difficulty: "Principiante"
  },
  // {
  //   name: "Listas Enlazadas Simples",
  //   description: "Estructuras de datos dinámicas y flexibles",
  //   icon: Database,
  //   difficulty: "Principiante"
  // },
  // {
  //   name: "Listas Enlazadas Dobles",
  //   description: "Navegación bidireccional eficiente",
  //   icon: Database,
  //   difficulty: "Intermedio"
  // },
  // {
  //   name: "Listas Enlazadas Circulares",
  //   description: "Recorrido infinito sin fin",
  //   icon: Database,
  //   difficulty: "Intermedio"
  // },
  // {
  //   name: "Árboles Binarios",
  //   description: "Estructuras jerárquicas eficientes",
  //   icon: Cpu,
  //   difficulty: "Intermedio"
  // },
  // {
  //   name: "Grafos",
  //   description: "Modelado de relaciones complejas",
  //   icon: Activity,
  //   difficulty: "Avanzado"
  // },
  // {
  //   name: "Tablas Hash",
  //   description: "Acceso rápido a datos con O(1)",
  //   icon: BarChart3,
  //   difficulty: "Intermedio"
  // }
]

export default function DataStructuresSection() {
  return (
    <section className="container mx-auto px-4 py-20 ">
      <div className="text-center space-y-4 mb-16 flex flex-col items-center">
        <Badge variant="outline" className="px-4 py-2">
          📚 Estructuras de datos
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold">
          Aprende las estructuras más importantes
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Desde conceptos básicos hasta estructuras avanzadas, cubrimos todo lo que necesitas saber.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {dataStructures.map((ds, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <ds.icon className="w-5 h-5 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {ds.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                {ds.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {ds.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
} 