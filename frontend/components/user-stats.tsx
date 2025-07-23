"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Clock, 
  Star, 
  Award,
  RefreshCw
} from "lucide-react"
import { LoadingSpinner } from "./loading-spinner"

interface UserStats {
  totalXP: number;
  level: number;
  quizzesCompleted: number;
  averageScore: number;
  streakDays: number;
  achievementsUnlocked: number;
  totalTimeSpent: number;
  dataStructuresMastered: number;
}

interface UserStatsProps {
  userId: number;
}

export default function UserStats({ userId }: UserStatsProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getUserStats(userId);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setStats(response.data as UserStats);
      }
    } catch (err) {
      setError('No se pudieron cargar las estadísticas del usuario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
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
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchStats}
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <RefreshCw className="w-4 h-4" />
              Intentar de nuevo
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">No hay estadísticas disponibles.</p>
          <p className="text-sm text-muted-foreground">
            Completa algunos cuestionarios para ver tus estadísticas.
          </p>
        </CardContent>
      </Card>
    );
  }

  const progressToNextLevel = (stats.totalXP % 1000) / 10;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const statCards = [
    {
      title: "XP Total",
      value: stats.totalXP.toLocaleString(),
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: `Nivel ${stats.level} • ${progressToNextLevel.toFixed(1)}% para el siguiente nivel`
    },
    {
      title: "Cuestionarios Completados",
      value: stats.quizzesCompleted,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: stats.quizzesCompleted > 0 
        ? `Puntaje promedio: ${stats.averageScore.toFixed(1)}%`
        : "¡Completa tu primer cuestionario!"
    },
    {
      title: "Racha Actual",
      value: `${stats.streakDays} días`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: stats.streakDays > 0 
        ? "¡Sigue así!"
        : "¡Comienza tu racha de estudio!"
    },
    {
      title: "Logros",
      value: stats.achievementsUnlocked,
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: stats.achievementsUnlocked > 0 
        ? "Logros desbloqueados"
        : "¡Desbloquea tu primer logro!"
    },
    {
      title: "Tiempo de Estudio",
      value: formatTime(stats.totalTimeSpent),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: stats.totalTimeSpent > 0 
        ? "Tiempo total de aprendizaje"
        : "¡Comienza a estudiar!"
    },
    {
      title: "Estructuras de Datos",
      value: stats.dataStructuresMastered,
      icon: Star,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: stats.dataStructuresMastered > 0 
        ? "Estructuras dominadas"
        : "¡Aprende tu primera estructura!"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Nivel {stats.level} Progreso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progreso de XP</span>
              <span>{progressToNextLevel.toFixed(1)}%</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{stats.totalXP % 1000} / 1000 XP</span>
              <span>Siguiente nivel: {stats.level + 1}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 