"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  BookOpen, 
  Activity,
  Calendar,
  Award
} from "lucide-react";
import { apiClient } from "@/lib/api";

interface AnalyticsProps {
  userRole: 'admin' | 'teacher';
  userId?: number;
}

interface SystemStats {
  totalUsers: number;
  totalStructures: number;
  totalQuizzes: number;
  totalContent: number;
  totalAttempts: number;
  averageScore: number;
  activeUsers: number;
  completedQuizzes: number;
}

export default function AnalyticsDashboard({ userRole, userId }: AnalyticsProps) {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalStructures: 0,
    totalQuizzes: 0,
    totalContent: 0,
    totalAttempts: 0,
    averageScore: 0,
    activeUsers: 0,
    completedQuizzes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Obtener datos básicos del sistema
      const [usersResponse, structuresResponse] = await Promise.all([
        apiClient.getUsers(),
        userRole === 'admin' ? apiClient.getDataStructures() : apiClient.getMyDataStructures()
      ]);

      if (usersResponse.data && structuresResponse.data) {
        const users = usersResponse.data;
        const structures = structuresResponse.data as { _count: { quizzes: number; content: number } }[];

        const totalQuizzes = structures.reduce((sum: number, ds) => sum + (ds._count.quizzes || 0), 0);
        const totalContent = structures.reduce((sum: number, ds) => sum + (ds._count.content || 0), 0);

        setStats({
          totalUsers: users.length,
          totalStructures: structures.length,
          totalQuizzes,
          totalContent,
          totalAttempts: 0, // Esto requeriría un endpoint específico
          averageScore: 0, // Esto requeriría un endpoint específico
          activeUsers: users.filter((u: any) => u.role === 'student').length,
          completedQuizzes: 0, // Esto requeriría un endpoint específico
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros de tiempo */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Analytics del Sistema</h2>
        <div className="flex gap-2">
          <Button 
            variant={timeRange === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('week')}
          >
            Semana
          </Button>
          <Button 
            variant={timeRange === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('month')}
          >
            Mes
          </Button>
          <Button 
            variant={timeRange === 'year' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('year')}
          >
            Año
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estructuras de Datos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStructures}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalContent} contenido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuestionarios</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedQuizzes} completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntaje Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalAttempts} intentos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de analytics detallados */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Nuevos usuarios</span>
                    <Badge variant="secondary">+12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cuestionarios completados</span>
                    <Badge variant="secondary">+45</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Contenido creado</span>
                    <Badge variant="secondary">+8</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Logros Destacados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Logros desbloqueados</span>
                    <Badge variant="secondary">156</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Puntuaciones perfectas</span>
                    <Badge variant="secondary">23</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rachas activas</span>
                    <Badge variant="secondary">7 días</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Estructura de Datos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aquí se mostrarían gráficos de rendimiento por estructura de datos.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aquí se mostrarían métricas de engagement de los usuarios.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Tendencias Temporales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aquí se mostrarían gráficos de tendencias a lo largo del tiempo.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 