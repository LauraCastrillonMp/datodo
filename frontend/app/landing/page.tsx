import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Code,
  Users,
  Database,
  Star,
  Clock,
  Rocket,
  Binary,
} from "lucide-react";
import dynamic from "next/dynamic";

// Lazy load non-critical sections with SSR enabled for faster first paint
const FeaturesSection = dynamic(() => import("./sections/FeaturesSection"));
const DataStructuresSection = dynamic(() => import("./sections/DataStructuresSection"));
const TestimonialsSection = dynamic(() => import("./sections/TestimonialsSection"));

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gaming-purple rounded-lg flex items-center justify-center">
              <Binary className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg">Datodo</h1>
          </div>
          <div className="flex items-center">
            <Link href="/auth/login">
              <Button variant="ghost" className="hover:bg-muted">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center flex flex-col items-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Domina las estructuras de datos
              <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                de forma interactiva
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Aprende estructuras de datos con simulaciones visuales, desafíos
              interactivos y un sistema de gamificación que hace que el
              aprendizaje sea adictivo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground w-full">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>100% Gratis para comenzar</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Acceso inmediato</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lazy loaded sections */}
      <FeaturesSection />
      <DataStructuresSection />
      {/* <TestimonialsSection /> */}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10 flex flex-col items-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <Badge
              variant="secondary"
              className="px-4 py-2 bg-white/20 text-white border-white/30"
            >
              🚀 Comienza tu viaje hoy
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              ¿Listo para dominar las estructuras de datos?
            </h2>
            {/* <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Únete a miles de estudiantes y desarrolladores que ya han
              transformado su carrera con Datodo.
            </p> */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto text-lg px-8 py-6 bg-white text-purple-600 hover:bg-gray-100"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Comenzar ahora
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-8 py-6 text-white hover:bg-white hover:text-purple-600"
                >
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12 px-8 flex justify-between items-center">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-gaming-purple rounded-lg flex items-center justify-center">
              <Binary className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg">Datodo</h1>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Hecho con ❤️ por Laura.
          </p>
        </div>
      </footer>
    </div>
  );
}
