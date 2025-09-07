import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "María González",
    role: "Desarrolladora Full Stack",
    content: "Datodo transformó mi forma de entender las estructuras de datos. Las simulaciones visuales son increíbles.",
    avatar: "MG",
    rating: 5
  },
  {
    name: "Carlos Rodríguez",
    role: "Estudiante de CS",
    content: "La gamificación me mantiene motivado. He aprendido más en un mes aquí que en todo el semestre.",
    avatar: "CR",
    rating: 5
  },
  {
    name: "Ana Martínez",
    role: "Ingeniera de Software",
    content: "Perfecto para repasar conceptos antes de entrevistas técnicas. Los cuestionarios son muy útiles.",
    avatar: "AM",
    rating: 5
  }
]

export default function TestimonialsSection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center space-y-4 mb-16">
        <Badge variant="outline" className="px-4 py-2">
          💬 Testimonios
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold">
          Lo que dicen nuestros estudiantes
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Miles de estudiantes han transformado su carrera con Datodo.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </div>
              </div>
              <div className="flex space-x-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic">"{testimonial.content}"</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
} 