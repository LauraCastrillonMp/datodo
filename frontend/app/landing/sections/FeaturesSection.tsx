import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Brain, Target, Zap, Users, Award } from "lucide-react"

const features = [
  {
    icon: Play,
    title: "Aprendizaje Interactivo",
    description: "Practica con desafíos de codificación reales y simulaciones visuales que hacen que el aprendizaje sea divertido y efectivo.",
    color: "text-blue-500"
  },
  {
    icon: Brain,
    title: "Teoría Completa",
    description: "Fundamentos teóricos sólidos con explicaciones claras, ejemplos prácticos y casos de uso del mundo real.",
    color: "text-purple-500"
  },
  {
    icon: Target,
    title: "Gamificación",
    description: "Sistema de logros, niveles y recompensas que mantienen tu motivación y te ayudan a seguir progresando.",
    color: "text-green-500"
  },
  {
    icon: Zap,
    title: "Simulaciones Visuales",
    description: "Observa cómo las estructuras de datos cobran vida con animaciones fluidas y visualizaciones interactivas.",
    color: "text-orange-500"
  }
]

export default function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 py-20 flex flex-col items-center">
      <div className="text-center space-y-4 mb-16">
        <Badge variant="outline" className="px-4 py-2">
          ✨ Características únicas
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold">
          ¿Por qué elegir Datodo?
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Nuestra plataforma combina tecnología de vanguardia con métodos de aprendizaje comprobados para ofrecerte la mejor experiencia educativa.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-purple-200">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
} 