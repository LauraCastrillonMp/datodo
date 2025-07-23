"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiClient } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  Target, 
  Users, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  FileText,
  BarChart3
} from "lucide-react";
import DataStructureDetail from "../admin/DataStructureDetail";
import DataStructureForm from "../admin/DataStructureForm";
import QuizForm from "../admin/QuizForm";
import ContentForm from "../admin/ContentForm";
import AnalyticsDashboard from "@/components/analytics-dashboard";
import QuizManager from "@/components/quiz-manager";
import ContentManager from "@/components/content-manager";

interface DataStructure {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    quizzes: number;
    content: number;
  };
  creator?: {
    id: number;
    name: string;
  };
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: any[];
  dataStructureId: number;
}

interface Content {
  id: number;
  title: string;
  type: string;
  dataStructureId: number;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [dataStructures, setDataStructures] = useState<DataStructure[]>([]);
  const [loadingStructures, setLoadingStructures] = useState(true);
  const [tab, setTab] = useState("overview");
  const [selectedStructureId, setSelectedStructureId] = useState<number | null>(null);
  const [showCreateStructure, setShowCreateStructure] = useState(false);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [showCreateContent, setShowCreateContent] = useState(false);
  const [editStructure, setEditStructure] = useState<DataStructure | null>(null);
  const [editQuiz, setEditQuiz] = useState<Quiz | null>(null);
  const [editContent, setEditContent] = useState<Content | null>(null);
  const [selectedStructureForQuiz, setSelectedStructureForQuiz] = useState<number | null>(null);
  const [selectedStructureForContent, setSelectedStructureForContent] = useState<number | null>(null);
  const [stats, setStats] = useState({
    totalStructures: 0,
    totalQuizzes: 0,
    totalContent: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    if (!user) return;
    if (user.role !== "teacher") {
      router.replace("/");
      return;
    }
    fetchDataStructures();
  }, [user]);

  const fetchDataStructures = async () => {
    setLoadingStructures(true);
    const { data } = await apiClient.getDataStructures();
    if (Array.isArray(data)) {
      setDataStructures(data);
      // Calcular estadísticas básicas
      const totalQuizzes = data.reduce((sum, ds) => sum + (ds._count?.quizzes || 0), 0);
      const totalContent = data.reduce((sum, ds) => sum + (ds._count?.content || 0), 0);
      setStats({
        totalStructures: data.length,
        totalQuizzes,
        totalContent,
        totalStudents: 0, // Esto requeriría un endpoint adicional
      });
    }
    setLoadingStructures(false);
  };

  const handleCreateStructure = async (values: { title: string; description: string; difficulty: string }) => {
    await apiClient.createDataStructure(values);
    setShowCreateStructure(false);
    fetchDataStructures();
  };

  const handleEditStructure = async (id: number, values: { title: string; description: string; difficulty: string }) => {
    await apiClient.updateDataStructure(id, values);
    setEditStructure(null);
    fetchDataStructures();
  };

  const handleDeleteStructure = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta estructura de datos?")) {
      await apiClient.deleteDataStructure(id);
      fetchDataStructures();
    }
  };

  const handleCreateQuiz = async (values: any) => {
    if (selectedStructureForQuiz) {
      await apiClient.createQuiz(selectedStructureForQuiz, values);
      setShowCreateQuiz(false);
      setSelectedStructureForQuiz(null);
      fetchDataStructures();
    }
  };

  const handleCreateContent = async (values: any) => {
    if (selectedStructureForContent) {
      await apiClient.createContent(selectedStructureForContent, values);
      setShowCreateContent(false);
      setSelectedStructureForContent(null);
      fetchDataStructures();
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel del Profesor</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateStructure(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Estructura
          </Button>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estructuras Creadas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStructures}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuestionarios</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contenido</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={tab} onValueChange={setTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="structures">Mis Estructuras</TabsTrigger>
          <TabsTrigger value="quizzes">Cuestionarios</TabsTrigger>
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Bienvenido al panel del profesor. Aquí puedes gestionar tus estructuras de datos, 
                crear cuestionarios y contenido educativo.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structures">
          {showCreateStructure && (
            <DataStructureForm
              onSubmit={handleCreateStructure}
              onCancel={() => setShowCreateStructure(false)}
            />
          )}
          {editStructure && (
            <DataStructureForm
              initial={editStructure}
              onSubmit={(values) => handleEditStructure(editStructure.id, values)}
              onCancel={() => setEditStructure(null)}
            />
          )}
          {selectedStructureId ? (
            <DataStructureDetail id={selectedStructureId} onBack={() => setSelectedStructureId(null)} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Mis Estructuras de Datos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Dificultad</TableHead>
                        <TableHead>Creador</TableHead>
                        <TableHead>Cuestionarios</TableHead>
                        <TableHead>Contenido</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingStructures ? (
                        <TableRow>
                          <TableCell colSpan={9}>Cargando...</TableCell>
                        </TableRow>
                      ) : dataStructures.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9}>No se encontraron estructuras de datos.</TableCell>
                        </TableRow>
                      ) : (
                        dataStructures.map((ds) => (
                          <TableRow key={ds.id}>
                            <TableCell>{ds.id}</TableCell>
                            <TableCell className="font-medium">{ds.title}</TableCell>
                            <TableCell className="max-w-xs truncate">{ds.description}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{ds.difficulty}</Badge>
                            </TableCell>
                            <TableCell>{ds.creator?.name || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{ds._count?.quizzes || 0}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{ds._count?.content || 0}</Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(ds.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => setSelectedStructureId(ds.id)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => setEditStructure(ds)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => {
                                    setSelectedStructureForQuiz(ds.id);
                                    setShowCreateQuiz(true);
                                  }}
                                >
                                  <Target className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => {
                                    setSelectedStructureForContent(ds.id);
                                    setShowCreateContent(true);
                                  }}
                                >
                                  <FileText className="w-4 h-4" />
                                </Button>
                                {ds.creator?.id === user?.id && (
                                  <Button 
                                    size="sm" 
                                    variant="destructive" 
                                    onClick={() => handleDeleteStructure(ds.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="quizzes">
          {selectedStructureForQuiz ? (
            <QuizManager
              dataStructureId={selectedStructureForQuiz}
              dataStructureTitle={dataStructures.find(ds => ds.id === selectedStructureForQuiz)?.title || ''}
              onQuizUpdated={fetchDataStructures}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Cuestionarios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Selecciona una estructura de datos de la tabla anterior para gestionar sus cuestionarios.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dataStructures.map((ds) => (
                    <Card key={ds.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">{ds.title}</h4>
                          <p className="text-sm text-gray-600">{ds.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{ds._count?.quizzes || 0} cuestionarios</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedStructureForQuiz(ds.id)}
                            >
                              Gestionar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="content">
          {selectedStructureForContent ? (
            <ContentManager
              dataStructureId={selectedStructureForContent}
              dataStructureTitle={dataStructures.find(ds => ds.id === selectedStructureForContent)?.title || ''}
              onContentUpdated={fetchDataStructures}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Contenido</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Selecciona una estructura de datos de la tabla anterior para gestionar su contenido educativo.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dataStructures.map((ds) => (
                    <Card key={ds.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">{ds.title}</h4>
                          <p className="text-sm text-gray-600">{ds.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{ds._count?.content || 0} contenido</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedStructureForContent(ds.id)}
                            >
                              Gestionar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard userRole="teacher" userId={user?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 