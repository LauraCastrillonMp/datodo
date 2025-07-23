"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, Target, Clock, Activity, Award, BookOpen } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { startOfWeek, addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeeklyData {
  day: string;
  quizzes: number;
  score: number;
  studyTime: number;
  xp: number;
}

interface ProgressChartsProps {
  userId: number;
}

// Función para generar datos de ejemplo cuando no hay datos reales
const generateSampleData = (): WeeklyData[] => {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  return days.map((day, index) => {
    // Generar datos más realistas basados en el día de la semana
    const isWeekend = index === 5 || index === 6; // Sábado o domingo
    const isToday = index === dayOfWeek;
    
    let quizzes = 0;
    let score = 0;
    let studyTime = 0;
    let xp = 0;
    
    if (isToday) {
      // Hoy: actividad moderada
      quizzes = Math.floor(Math.random() * 3) + 1;
      score = Math.floor(Math.random() * 40) + 60; // 60-100%
      studyTime = Math.floor(Math.random() * 30) + 15; // 15-45 minutos
      xp = quizzes * 25 + Math.floor(score / 10);
    } else if (isWeekend) {
      // Fines de semana: menos actividad
      if (Math.random() > 0.3) {
        quizzes = Math.floor(Math.random() * 2) + 1;
        score = Math.floor(Math.random() * 30) + 70; // 70-100%
        studyTime = Math.floor(Math.random() * 20) + 10; // 10-30 minutos
        xp = quizzes * 20 + Math.floor(score / 10);
      }
    } else {
      // Días de semana: actividad regular
      if (Math.random() > 0.2) {
        quizzes = Math.floor(Math.random() * 2) + 1;
        score = Math.floor(Math.random() * 35) + 65; // 65-100%
        studyTime = Math.floor(Math.random() * 25) + 15; // 15-40 minutos
        xp = quizzes * 22 + Math.floor(score / 10);
      }
    }
    
    return {
      day,
      quizzes,
      score,
      studyTime,
      xp
    };
  });
};

export default function ProgressCharts({ userId }: ProgressChartsProps) {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSampleData, setIsSampleData] = useState(false);

  useEffect(() => {
    const fetchWeeklyProgress = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getWeeklyProgress(userId);
        let processedData: WeeklyData[] = [];
        const dataArr = response.data as any[];
        if (dataArr && Array.isArray(dataArr) && dataArr.length > 0) {
          // Get start of this week (Monday)
          const today = new Date();
          const weekStart = startOfWeek(today, { weekStartsOn: 1 });
          // Build a full week array, fill with 0s if missing
          processedData = Array.from({ length: 7 }).map((_, i) => {
            const date = addDays(weekStart, i);
            const found = dataArr.find((item: any) => {
              const itemDate = new Date(item.date);
              return (
                itemDate.getFullYear() === date.getFullYear() &&
                itemDate.getMonth() === date.getMonth() &&
                itemDate.getDate() === date.getDate()
              );
            });
            return {
              day: format(date, 'EEE', { locale: es }),
              quizzes: found?.quizzes || 0,
              score: found?.score || 0,
              studyTime: found?.studyTime || 0,
              xp: found?.xp || 0,
            };
          });
        } else {
          processedData = generateSampleData();
        }
        setWeeklyData(processedData);
        setIsSampleData(!dataArr || !Array.isArray(dataArr) || dataArr.length === 0);
      } catch (err) {
        setError('Error al cargar el progreso semanal');
        setWeeklyData(generateSampleData());
        setIsSampleData(true);
      } finally {
        setLoading(false);
      }
    };
    fetchWeeklyProgress();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Loading Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalQuizzes = weeklyData.reduce((sum, day) => sum + day.quizzes, 0);
  const totalXP = weeklyData.reduce((sum, day) => sum + day.xp, 0);
  const totalStudyTime = weeklyData.reduce((sum, day) => sum + day.studyTime, 0);
  const averageScore = weeklyData.filter(d => d.quizzes > 0).length > 0 
    ? weeklyData.filter(d => d.quizzes > 0).reduce((sum, day) => sum + day.score, 0) / weeklyData.filter(d => d.quizzes > 0).length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Sample Data Notice */}
      {isSampleData && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <BookOpen className="w-4 h-4" />
              <p className="text-sm">
                Mostrando datos de ejemplo. Completa cuestionarios para ver tu progreso real.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Weekly Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuestionarios esta semana</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">
              {totalQuizzes > 0 ? '¡Excelente progreso!' : '¡Comienza a aprender hoy!'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">XP Ganado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalXP}</div>
            <p className="text-xs text-muted-foreground">
              {totalXP > 0 ? '¡Sigue así!' : 'Completa cuestionarios para ganar XP'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntuación Promedio</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageScore)}%</div>
            <p className="text-xs text-muted-foreground">
              {averageScore >= 80 ? '¡Excelente!' : averageScore >= 60 ? '¡Buen trabajo!' : '¡Sigue practicando!'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo de Estudio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudyTime}m</div>
            <p className="text-xs text-muted-foreground">
              {totalStudyTime > 0 ? '¡Mantén la consistencia!' : '¡Dedica tiempo a estudiar!'}
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Minimalistic Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Quiz Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Actividad Diaria de Cuestionarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyData} barCategoryGap={16}>
                <XAxis 
                  dataKey="day" 
                  stroke="#888"
                  fontSize={13}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888"
                  fontSize={13}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded bg-card p-2 shadow text-xs">
                          <div>{label}</div>
                          <div className="font-bold">{payload[0].value} cuestionarios</div>
                        </div>
                      )
                    }
                    return null
                  }}
                  cursor={{ fill: '#e5e7eb', opacity: 0.2 }}
                />
                <Bar 
                  dataKey="quizzes" 
                  fill="#6366f1" // flat indigo
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* XP Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Progreso Diario de XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  stroke="#888"
                  fontSize={13}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888"
                  fontSize={13}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded bg-card p-2 shadow text-xs">
                          <div>{label}</div>
                          <div className="font-bold">{payload[0].value} XP</div>
                        </div>
                      )
                    }
                    return null
                  }}
                  cursor={{ fill: '#e5e7eb', opacity: 0.2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="xp" 
                  stroke="#6366f1" // flat indigo
                  strokeWidth={2}
                  fill="#ede9fe" // subtle indigo background
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {/* Study Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Distribución Semanal de Tiempo de Estudio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} barCategoryGap={16}>
              <XAxis 
                dataKey="day" 
                stroke="#888"
                fontSize={13}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888"
                fontSize={13}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}m`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded bg-card p-2 shadow text-xs">
                        <div>{label}</div>
                        <div className="font-bold">{payload[0].value} minutos</div>
                      </div>
                    )
                  }
                  return null
                }}
                cursor={{ fill: '#e5e7eb', opacity: 0.2 }}
              />
              <Bar 
                dataKey="studyTime" 
                fill="#10b981" // flat green
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Score Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Tendencia de Puntuaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
              <XAxis 
                dataKey="day" 
                stroke="#888"
                fontSize={13}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888"
                fontSize={13}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded bg-card p-2 shadow text-xs">
                        <div>{label}</div>
                        <div className="font-bold">{payload[0].value}%</div>
                      </div>
                    )
                  }
                  return null
                }}
                cursor={{ fill: '#e5e7eb', opacity: 0.2 }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#f59e0b" // flat gold
                strokeWidth={2}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
} 