"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Award, Target, Flame, BookOpen, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'learning' | 'performance' | 'streak';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  completedAt?: string;
  rewardXP: number;
}

interface AchievementsProps {
  userId: number;
}

export default function Achievements({ userId }: AchievementsProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getUserAchievements(userId);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setAchievements(response.data as Achievement[]);
      } else {
        // Handle case where data is undefined (empty response)
        setAchievements([]);
      }
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError('No se pudieron cargar los logros');
    } finally {
      setLoading(false);
    }
  };

  const updateAchievements = async () => {
    try {
      setUpdating(true);
      setError(null);
      const response = await apiClient.updateUserAchievements(userId);
      
      if (response.error) {
        setError(response.error);
      } else {
        // Recargar los logros después de la actualización
        await fetchAchievements();
      }
    } catch (err) {
      console.error('Error updating achievements:', err);
      setError('No se pudieron actualizar los logros');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const updateAndFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        await apiClient.updateUserAchievements(userId);
        await fetchAchievements();
      } catch (err) {
        console.error('Error in updateAndFetch:', err);
        setError('No se pudieron actualizar los logros');
      } finally {
        setLoading(false);
      }
    };
    updateAndFetch();
  }, [userId]);

  const getRarityColor = (rarity: string, isCompleted: boolean) => {
    const baseColors = {
      common: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600',
      uncommon: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700',
      rare: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      epic: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      legendary: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
    };
    
    const color = baseColors[rarity as keyof typeof baseColors] || baseColors.common;
    
    if (isCompleted) {
      return color.replace('100', '200').replace('300', '400').replace('dark:bg-gray-800', 'dark:bg-gray-700') + ' ring-2 ring-green-500/30 dark:ring-green-400/30';
    }
    
    return color;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return <BookOpen className="w-4 h-4" />;
      case 'performance': return <Target className="w-4 h-4" />;
      case 'streak': return <Flame className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="w-3 h-3" />;
      case 'uncommon': return <Star className="w-3 h-3" />;
      case 'rare': return <Star className="w-3 h-3" />;
      case 'epic': return <Star className="w-3 h-3" />;
      case 'legendary': return <Trophy className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-2 bg-muted rounded w-2/3"></div>
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
            <p className="text-destructive">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <RefreshCw className="w-4 h-4" />
              Intentar de nuevo
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (achievements.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">No hay logros disponibles.</p>
          <p className="text-sm text-muted-foreground">
            Completa cuestionarios para desbloquear logros.
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedCount = achievements.filter(a => a.isCompleted).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              Progreso de Logros
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold">
              {completedCount} / {totalCount}
            </div>
            <Badge variant="secondary">
              {Math.round((completedCount / totalCount) * 100)}% Completado
            </Badge>
          </div>
          <div className="relative">
            <Progress value={(completedCount / totalCount) * 100} className="h-3" />
            {completedCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-white dark:text-gray-900 text-xs font-bold">✓</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={`transition-all duration-200 h-full flex flex-col ${
              achievement.isCompleted 
                ? 'ring-2 ring-green-500 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800 shadow-lg' 
                : 'hover:shadow-md border-gray-200 dark:border-gray-700'
            }`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-full flex items-center justify-center flex-shrink-0 ${
                    achievement.isCompleted 
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}>
                    {achievement.isCompleted ? (
                      <Award className="w-4 h-4" />
                    ) : (
                      getCategoryIcon(achievement.category)
                    )}
                  </div>
                  <CardTitle className={`text-sm font-medium leading-tight ${
                    achievement.isCompleted ? 'text-green-800 dark:text-green-300' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {achievement.name}
                  </CardTitle>
                </div>
                <Badge className={`text-xs flex-shrink-0 ml-2 ${getRarityColor(achievement.rarity, achievement.isCompleted)}`}>
                  {getRarityIcon(achievement.rarity)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col justify-between px-6 pb-6">
              <div>
                <p className="text-xs text-muted-foreground leading-relaxed text-center mb-4">
                  {achievement.description}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Progreso</span>
                    <span className="font-semibold">
                      {achievement.progress} / {achievement.maxProgress}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className={`h-2.5 ${achievement.isCompleted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}
                    />
                    {achievement.isCompleted && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center">
                        <span className="text-white dark:text-gray-900 text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800 mt-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-medium">
                    {achievement.rewardXP} XP
                  </Badge>
                  {achievement.isCompleted && (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                      <Award className="w-3 h-3" />
                      <span className="text-xs">¡Completado!</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-center min-h-[32px] flex items-center justify-center">
                  {achievement.completedAt ? (
                    <span className="text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-950/50 p-2 rounded-md w-full">
                      ✓ Completado el {new Date(achievement.completedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground opacity-60 w-full">
                      — Sin completar —
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 