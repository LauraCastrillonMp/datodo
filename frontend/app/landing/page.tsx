"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, CheckCircle, Code, Users, Database, Star, Clock, Rocket } from "lucide-react"
import dynamic from "next/dynamic"

// Lazy load non-critical sections
const FeaturesSection = dynamic(() => import("./sections/FeaturesSection"), { ssr: false })
const DataStructuresSection = dynamic(() => import("./sections/DataStructuresSection"), { ssr: false })
const TestimonialsSection = dynamic(() => import("./sections/TestimonialsSection"), { ssr: false })

const stats = [
  { number: "10,000+", label: "Estudiantes activos", icon: Users },
  { number: "50+", label: "Estructuras de datos", icon: Database },
  { number: "95%", label: "Tasa de satisfacción", icon: Star },
  { number: "24/7", label: "Acceso disponible", icon: Clock }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                DataStruct Academy
              </span>
              <p className="text-xs text-muted-foreground">Aprende • Practica • Domina</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="hover:bg-muted">Iniciar sesión</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Comenzar gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              🚀 La plataforma más avanzada para aprender estructuras de datos
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Domina las estructuras de datos
              <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                de forma interactiva
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Aprende estructuras de datos con simulaciones visuales, desafíos interactivos y un sistema de gamificación que hace que el aprendizaje sea adictivo.
            </p>
          </div>

          <form action="/auth/register" method="GET" className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-xl mx-auto">
            <div className="flex w-full max-w-md space-x-2">
              <Input
                type="email"
                name="email"
                placeholder="Tu correo electrónico"
                className="flex-1 text-lg"
                required
                aria-label="Correo electrónico"
              />
              <Button type="submit" className="px-8 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto">
                Comenzar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground w-full">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>100% Gratis para comenzar</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Acceso inmediato</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Lazy loaded sections */}
      <FeaturesSection />
      <DataStructuresSection />
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <Badge variant="secondary" className="px-4 py-2 bg-white/20 text-white border-white/30">
              🚀 Comienza tu viaje hoy
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              ¿Listo para dominar las estructuras de datos?
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Únete a miles de estudiantes y desarrolladores que ya han transformado su carrera con DataStruct Academy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 py-6 bg-white text-purple-600 hover:bg-gray-100">
                  <Rocket className="w-5 h-5 mr-2" />
                  Comenzar gratis ahora
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-purple-600">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
            <p className="text-sm text-purple-200">
              Acceso inmediato • 100% gratuito
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">DataStruct Academy</span>
                  <p className="text-xs text-muted-foreground">Aprende • Practica • Domina</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                La plataforma más avanzada para aprender estructuras de datos de forma interactiva y gamificada.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Plataforma</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/theory" className="hover:text-primary">Teoría</Link></li>
                <li><Link href="/simulator" className="hover:text-primary">Simulador</Link></li>
                <li><Link href="/challenges" className="hover:text-primary">Desafíos</Link></li>
                <li><Link href="/profile" className="hover:text-primary">Perfil</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Recursos</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Documentación</Link></li>
                <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary">Comunidad</Link></li>
                <li><Link href="#" className="hover:text-primary">Soporte</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Empresa</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Acerca de</Link></li>
                <li><Link href="#" className="hover:text-primary">Privacidad</Link></li>
                <li><Link href="#" className="hover:text-primary">Términos</Link></li>
                <li><Link href="#" className="hover:text-primary">Contacto</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              &copy; 2024 DataStruct Academy. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 