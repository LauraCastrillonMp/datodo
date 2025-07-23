"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Target, 
  Edit, 
  Trash2, 
  Eye, 
  Plus, 
  BarChart3,
  Users,
  Clock
} from "lucide-react";
import { apiClient } from "@/lib/api";
import QuizForm from "@/app/admin/QuizForm";

interface Quiz {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  questions: any[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    attempts: number;
  };
}

interface QuizManagerProps {
  dataStructureId: number;
  dataStructureTitle: string;
  onQuizUpdated: () => void;
}

// Función para transformar los datos del backend al formato del frontend
const transformQuizForForm = (quiz: any) => {
  return {
    ...quiz,
    questions: quiz.questions?.map((question: any) => ({
      id: question.id,
      text: question.questionText || question.text,
      options: question.options?.map((option: any) => option.optionText || option.text || '') || ['', '', '', ''],
      correctAnswer: question.options?.findIndex((option: any) => option.isCorrect) || 0,
      explanation: question.explanation || ''
    })) || []
  };
};

export default function QuizManager({ dataStructureId, dataStructureTitle, onQuizUpdated }: QuizManagerProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showQuizDetail, setShowQuizDetail] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, [dataStructureId]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching quizzes for structure:', dataStructureId);
      const response = await apiClient.getQuizzes(dataStructureId);
      console.log('📊 Quiz response:', response);
      if (response.data) {
        console.log('✅ Quizzes found:', response.data);
        setQuizzes(response.data);
      } else {
        console.log('❌ No quizzes data in response');
      }
    } catch (error) {
      console.error('❌ Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (values: any) => {
    try {
      // Transformar los datos del frontend al formato del backend
      const transformedValues = {
        ...values,
        questions: values.questions.map((question: any, questionIndex: number) => ({
          questionText: question.text,
          questionType: 'multiple_choice',
          order: questionIndex + 1,
          options: question.options.map((option: string, optionIndex: number) => ({
            optionText: option,
            isCorrect: optionIndex === question.correctAnswer,
            order: optionIndex + 1
          }))
        }))
      };
      
      console.log('🔄 Creating quiz with transformed values:', transformedValues);
      await apiClient.createQuiz(dataStructureId, transformedValues);
      setShowCreate(false);
      fetchQuizzes();
      onQuizUpdated();
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const handleEditQuiz = async (values: any) => {
    if (!editingQuiz) return;
    try {
      // Transformar los datos del frontend al formato del backend
      const transformedValues = {
        ...values,
        questions: values.questions.map((question: any, questionIndex: number) => ({
          id: question.id,
          questionText: question.text,
          questionType: 'multiple_choice',
          order: questionIndex + 1,
          options: question.options.map((option: string, optionIndex: number) => ({
            optionText: option,
            isCorrect: optionIndex === question.correctAnswer,
            order: optionIndex + 1
          }))
        }))
      };
      
      console.log('🔄 Sending transformed values to backend:', transformedValues);
      await apiClient.updateQuiz(dataStructureId, editingQuiz.id, transformedValues);
      setEditingQuiz(null);
      fetchQuizzes();
      onQuizUpdated();
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este cuestionario?")) {
      try {
        await apiClient.deleteQuiz(dataStructureId, quizId);
        fetchQuizzes();
        onQuizUpdated();
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'principiante': return 'bg-green-100 text-green-800';
      case 'intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'avanzado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Cuestionarios de {dataStructureTitle}</h3>
          <p className="text-sm text-gray-600">
            Gestiona los cuestionarios para esta estructura de datos
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cuestionario
        </Button>
      </div>

      {showCreate && (
        <QuizForm
          dataStructureId={dataStructureId}
          onSubmit={handleCreateQuiz}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {editingQuiz && (
        <QuizForm
          dataStructureId={dataStructureId}
          initial={editingQuiz}
          onSubmit={handleEditQuiz}
          onCancel={() => setEditingQuiz(null)}
        />
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Dificultad</TableHead>
                <TableHead>Preguntas</TableHead>
                <TableHead>Intentos</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8}>Cargando cuestionarios...</TableCell>
                </TableRow>
              ) : quizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>No hay cuestionarios para esta estructura.</TableCell>
                </TableRow>
              ) : (
                quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell>{quiz.id}</TableCell>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{quiz.description}</TableCell>
                    <TableCell>
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{quiz.questions?.length || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{quiz._count?.attempts || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedQuiz(quiz);
                            setShowQuizDetail(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            console.log('🔍 Editing quiz:', quiz);
                            console.log('📝 Quiz questions:', quiz.questions);
                            const transformedQuiz = transformQuizForForm(quiz);
                            console.log('🔄 Transformed quiz:', transformedQuiz);
                            setEditingQuiz(transformedQuiz);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteQuiz(quiz.id)}
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
        </CardContent>
      </Card>

      <Dialog open={showQuizDetail} onOpenChange={setShowQuizDetail}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {selectedQuiz?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedQuiz && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Descripción</p>
                  <p className="text-sm text-gray-600">{selectedQuiz.description}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Dificultad</p>
                  <Badge className={getDifficultyColor(selectedQuiz.difficulty)}>
                    {selectedQuiz.difficulty}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Preguntas</p>
                  <p className="text-sm text-gray-600">{selectedQuiz.questions?.length || 0} preguntas</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Preguntas del Cuestionario</h4>
                <div className="space-y-4">
                  {selectedQuiz.questions?.map((question, index) => (
                    <Card key={index} className="border">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <p className="font-medium">Pregunta {index + 1}: {question.text}</p>
                          <div className="space-y-2">
                            {question.options?.map((option: any, optionIndex: number) => (
                              <div
                                key={optionIndex}
                                className={`p-2 rounded ${
                                  optionIndex === question.correctAnswer
                                    ? 'bg-green-50 border border-green-200'
                                    : 'bg-gray-50'
                                }`}
                              >
                                <span className="font-medium">
                                  {String.fromCharCode(65 + optionIndex)}. 
                                </span>
                                {typeof option === 'string' ? option : option.optionText}
                                {optionIndex === question.correctAnswer && (
                                  <Badge variant="secondary" className="ml-2">
                                    Correcta
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                          {question.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 rounded">
                              <p className="text-sm font-medium text-blue-800">Explicación:</p>
                              <p className="text-sm text-blue-700">{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 