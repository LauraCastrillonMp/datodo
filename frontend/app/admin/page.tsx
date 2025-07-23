"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiClient } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { 
  Users, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Shield,
  UserCheck,
  UserX,
  BarChart3,
  Settings,
  Activity
} from "lucide-react";
import DataStructureDetail from "./DataStructureDetail";
import DataStructureForm from "./DataStructureForm";
import AnalyticsDashboard from "@/components/analytics-dashboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: 'admin' | 'teacher' | 'student';
  createdAt: string;
  updatedAt: string;
}

interface DataStructure {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: number;
    name: string;
  };
  _count?: {
    quizzes: number;
    content: number;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    teachers: 0,
    students: 0,
  });
  const [dataStructures, setDataStructures] = useState<DataStructure[]>([]);
  const [loadingStructures, setLoadingStructures] = useState(true);
  const [tab, setTab] = useState("overview");
  const [selectedStructureId, setSelectedStructureId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editStructure, setEditStructure] = useState<DataStructure | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [systemStats, setSystemStats] = useState({
    totalQuizzes: 0,
    totalContent: 0,
    activeUsers: 0,
    totalAttempts: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searchTotalPages, setSearchTotalPages] = useState(0);
  const [userStats, setUserStats] = useState<any>(null);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [loadingUserData, setLoadingUserData] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") {
      router.replace("/");
      return;
    }
    fetchUsers();
    fetchDataStructures();
    fetchSystemStats();
  }, [user]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data } = await apiClient.getUsers();
    if (Array.isArray(data)) {
      setUsers(data);
      setStats({
        total: data.length,
        admins: data.filter((u) => u.role === "admin").length,
        teachers: data.filter((u) => u.role === "teacher").length,
        students: data.filter((u) => u.role === "student").length,
      });
    }
    setLoadingUsers(false);
  };

  const fetchDataStructures = async () => {
    setLoadingStructures(true);
    const { data } = await apiClient.getDataStructures();
    if (Array.isArray(data)) {
      setDataStructures(data);
    }
    setLoadingStructures(false);
  };

  const fetchSystemStats = async () => {
    // Calcular estadísticas del sistema basadas en los datos disponibles
    const totalQuizzes = dataStructures.reduce((sum, ds) => sum + (ds._count?.quizzes || 0), 0);
    const totalContent = dataStructures.reduce((sum, ds) => sum + (ds._count?.content || 0), 0);
    setSystemStats({
      totalQuizzes,
      totalContent,
      activeUsers: stats.students, // Usuarios activos serían los estudiantes
      totalAttempts: 0, // Esto requeriría un endpoint adicional
    });
  };

  const handleCreate = async (values: { title: string; description: string; difficulty: string }) => {
    await apiClient.createDataStructure(values);
    setShowCreate(false);
    fetchDataStructures();
  };

  const handleEdit = async (id: number, values: { title: string; description: string; difficulty: string }) => {
    await apiClient.updateDataStructure(id, values);
    setEditStructure(null);
    fetchDataStructures();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta estructura de datos?")) {
      await apiClient.deleteDataStructure(id);
      fetchDataStructures();
    }
  };

  const handleRoleChange = async (userId: number, newRole: 'admin' | 'teacher' | 'student') => {
    try {
      await apiClient.updateUser(userId, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('Error changing user role:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await apiClient.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const searchUsers = async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate async search for better UX
    setTimeout(() => {
      const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      );

      const limit = 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      setSearchResults(paginatedUsers);
      setSearchTotal(filteredUsers.length);
      setSearchTotalPages(Math.ceil(filteredUsers.length / limit));
      setSearchPage(page);
      setIsSearching(false);
    }, 300); // Small delay for better UX
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchUsers(query, 1);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchPageChange = (page: number) => {
    if (searchQuery.trim()) {
      searchUsers(searchQuery, page);
    }
  };

  const fetchUserData = async (userId: number) => {
    setLoadingUserData(true);
    try {
      const [statsResponse, achievementsResponse] = await Promise.all([
        apiClient.getUserStats(userId),
        apiClient.getUserAchievements(userId)
      ]);
      
      if (statsResponse.data) {
        setUserStats(statsResponse.data);
      }
      if (achievementsResponse.data && Array.isArray(achievementsResponse.data)) {
        setUserAchievements(achievementsResponse.data);
      } else {
        setUserAchievements([]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserStats(null);
      setUserAchievements([]);
    } finally {
      setLoadingUserData(false);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    fetchUserData(user.id);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Estructura
          </Button>
        </div>
      </div>

      {/* Estadísticas del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.admins} admin, {stats.teachers} prof, {stats.students} estudiantes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estructuras de Datos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataStructures.length}</div>
            <p className="text-xs text-muted-foreground">
              {systemStats.totalQuizzes} cuestionarios, {systemStats.totalContent} contenido
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Estudiantes activos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intentos de Cuestionarios</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalAttempts}</div>
            <p className="text-xs text-muted-foreground">
              Total de intentos
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={tab} onValueChange={setTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="structures">Estructuras de Datos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Bienvenido al panel de administración. Aquí puedes gestionar usuarios, 
                  estructuras de datos y monitorear el sistema.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setTab("users")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Gestionar Usuarios
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setTab("structures")}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Gestionar Estructuras
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setTab("analytics")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <div className="flex gap-4 items-center">
                <div className="flex-1 max-w-md">
                  <Input
                    placeholder="Buscar usuarios por nombre, email o usuario..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full"
                  />
                </div>
                {searchQuery && (
                  <div className="text-sm text-muted-foreground">
                    {isSearching ? 'Buscando...' : `${searchTotal} resultados`}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Correo</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Fecha de Creación</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isSearching ? (
                      <TableRow>
                        <TableCell colSpan={7}>Buscando...</TableCell>
                      </TableRow>
                    ) : searchQuery ? (
                      searchResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7}>No se encontraron usuarios que coincidan con la búsqueda.</TableCell>
                        </TableRow>
                      ) : (
                        searchResults.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell>{u.id}</TableCell>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{u.username}</TableCell>
                            <TableCell>
                              <Select
                                value={u.role}
                                onValueChange={(value: 'admin' | 'teacher' | 'student') => 
                                  handleRoleChange(u.id, value)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="student">Estudiante</SelectItem>
                                  <SelectItem value="teacher">Profesor</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              {new Date(u.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleUserSelect(u)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleDeleteUser(u.id)}
                                  disabled={u.id === user?.id}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )
                    ) : loadingUsers ? (
                      <TableRow>
                        <TableCell colSpan={7}>Cargando...</TableCell>
                      </TableRow>
                    ) : users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7}>No se encontraron usuarios.</TableCell>
                      </TableRow>
                    ) : (
                      users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>{u.id}</TableCell>
                          <TableCell>{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>{u.username}</TableCell>
                          <TableCell>
                            <Select
                              value={u.role}
                              onValueChange={(value: 'admin' | 'teacher' | 'student') => 
                                handleRoleChange(u.id, value)
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="student">Estudiante</SelectItem>
                                <SelectItem value="teacher">Profesor</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {new Date(u.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUserSelect(u)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteUser(u.id)}
                                disabled={u.id === user?.id}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {searchQuery && searchTotalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearchPageChange(searchPage - 1)}
                    disabled={searchPage <= 1}
                  >
                    Anterior
                  </Button>
                  <span className="flex items-center px-3 text-sm">
                    Página {searchPage} de {searchTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearchPageChange(searchPage + 1)}
                    disabled={searchPage >= searchTotalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structures">
          {showCreate && (
            <DataStructureForm
              onSubmit={handleCreate}
              onCancel={() => setShowCreate(false)}
            />
          )}
          {editStructure && (
            <DataStructureForm
              initial={editStructure}
              onSubmit={(values) => handleEdit(editStructure.id, values)}
              onCancel={() => setEditStructure(null)}
            />
          )}
          {selectedStructureId ? (
            <DataStructureDetail id={selectedStructureId} onBack={() => setSelectedStructureId(null)} />
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Estructuras de Datos</CardTitle>
                <Button onClick={() => setShowCreate(true)}>Crear</Button>
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
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingStructures ? (
                        <TableRow>
                          <TableCell colSpan={8}>Cargando...</TableCell>
                        </TableRow>
                      ) : dataStructures.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8}>No se encontraron estructuras de datos.</TableCell>
                        </TableRow>
                      ) : (
                        dataStructures.map((ds) => (
                          <TableRow key={ds.id}>
                            <TableCell>{ds.id}</TableCell>
                            <TableCell>{ds.title}</TableCell>
                            <TableCell>{ds.description}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{ds.difficulty}</Badge>
                            </TableCell>
                            <TableCell>{ds.creator?.name || 'N/A'}</TableCell>
                            <TableCell>{ds._count?.quizzes || 0}</TableCell>
                            <TableCell>{ds._count?.content || 0}</TableCell>
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
                                  variant="destructive" 
                                  onClick={() => handleDelete(ds.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
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

        <TabsContent value="analytics">
          <AnalyticsDashboard userRole="admin" />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aquí puedes configurar parámetros del sistema, gestionar roles y permisos.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalles del Usuario */}
      <Dialog open={!!selectedUser} onOpenChange={() => {
        setSelectedUser(null);
        setUserStats(null);
        setUserAchievements([]);
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Usuario</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* Header con información básica */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-primary">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant={
                    selectedUser.role === 'admin' ? 'destructive' :
                    selectedUser.role === 'teacher' ? 'default' : 'secondary'
                  }>
                    {selectedUser.role === 'admin' ? 'Administrador' :
                     selectedUser.role === 'teacher' ? 'Profesor' : 'Estudiante'}
                  </Badge>
                </div>
              </div>

              {/* Tabs para organizar la información */}
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                  <TabsTrigger value="achievements">Logros</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">ID de Usuario</label>
                      <p className="text-sm font-mono">{selectedUser.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Estado</label>
                      <p className="text-sm">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Activo
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Fecha de Registro</label>
                      <p className="text-sm">{new Date(selectedUser.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                      <p className="text-sm">{new Date(selectedUser.updatedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="space-y-4">
                  {loadingUserData ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Cargando estadísticas...</p>
                      </div>
                    </div>
                  ) : userStats ? (
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Nivel y XP</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-primary">{userStats.level}</div>
                          <p className="text-xs text-muted-foreground">{userStats.totalXP} XP total</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Cuestionarios</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{userStats.quizzesCompleted}</div>
                          <p className="text-xs text-muted-foreground">Completados</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Puntuación Promedio</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">{userStats.averageScore}%</div>
                          <p className="text-xs text-muted-foreground">Rendimiento</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Racha Actual</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-orange-600">{userStats.streakDays}</div>
                          <p className="text-xs text-muted-foreground">Días consecutivos</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Estructuras Dominadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">{userStats.dataStructuresMastered}</div>
                          <p className="text-xs text-muted-foreground">Diferentes temas</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Tiempo de Estudio</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-purple-600">{userStats.totalTimeSpent}</div>
                          <p className="text-xs text-muted-foreground">Minutos totales</p>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No hay estadísticas disponibles</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="achievements" className="space-y-4">
                  {loadingUserData ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Cargando logros...</p>
                      </div>
                    </div>
                  ) : userAchievements.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Logros Desbloqueados</h4>
                        <Badge variant="outline">
                          {userAchievements.filter(a => a.isCompleted).length} / {userAchievements.length}
                        </Badge>
                      </div>
                      <div className="grid gap-2 max-h-64 overflow-y-auto">
                        {userAchievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className={`p-3 rounded-lg border ${
                              achievement.isCompleted 
                                ? 'bg-accent/50 border-accent' 
                                : 'bg-muted/50 border-muted'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h5 className={`font-medium ${
                                  achievement.isCompleted ? 'text-accent-foreground' : 'text-muted-foreground'
                                }`}>
                                  {achievement.name}
                                </h5>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {achievement.description}
                                </p>
                                {achievement.maxProgress > 1 && (
                                  <div className="mt-2">
                                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                      <span>Progreso</span>
                                      <span>{achievement.progress} / {achievement.maxProgress}</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full ${
                                          achievement.isCompleted ? 'bg-accent' : 'bg-primary'
                                        }`}
                                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="ml-3">
                                {achievement.isCompleted ? (
                                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                                    <span className="text-accent-foreground text-sm">✓</span>
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                    <span className="text-muted-foreground text-sm">?</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No hay logros disponibles</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedUser(null);
                    setUserStats(null);
                    setUserAchievements([]);
                  }}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 