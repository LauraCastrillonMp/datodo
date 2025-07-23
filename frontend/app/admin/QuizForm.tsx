"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Edit } from "lucide-react";

const difficulties = [
  { label: "Principiante", value: "principiante" },
  { label: "Intermedio", value: "intermedio" },
  { label: "Avanzado", value: "avanzado" },
];

interface Question {
  id?: string;
  text: string;
  options: (string | { optionText: string })[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizFormProps {
  dataStructureId?: number;
  initial?: {
    id?: number;
    title?: string;
    description?: string;
    difficulty?: string;
    questions?: Question[];
  };
  onSubmit: (values: {
    title: string;
    description: string;
    difficulty: string;
    questions: Question[];
  }) => void;
  onCancel: () => void;
}

export default function QuizForm({ dataStructureId, initial, onSubmit, onCancel }: QuizFormProps) {
  console.log('🔍 QuizForm received initial data:', initial);
  console.log('📝 Initial questions:', initial?.questions);
  
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [difficulty, setDifficulty] = useState(initial?.difficulty || difficulties[0].value);
  const [questions, setQuestions] = useState<Question[]>(
    initial?.questions?.map(q => ({
      ...q,
      options: q.options.map((opt: any) => typeof opt === 'string' ? opt : (opt && typeof opt === 'object' && 'optionText' in opt ? opt.optionText : ''))
    })) || [
      {
        text: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      }
    ]
  );
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      }
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    if (field === 'options') {
      updatedQuestions[index].options = value;
    } else {
      (updatedQuestions[index] as any)[field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ title, description, difficulty, questions });
    setLoading(false);
  };

  useEffect(() => {
    setQuestions(prevQuestions => prevQuestions.map(q => ({
      ...q,
      options: q.options.map(opt => typeof opt === 'string' ? opt : (opt && typeof opt === 'object' && 'optionText' in opt ? opt.optionText : ''))
    })));
  // eslint-disable-next-line
  }, []);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="w-5 h-5" />
          {initial?.id ? "Editar Cuestionario" : "Crear Nuevo Cuestionario"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Título del Cuestionario</label>
              <Input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
                placeholder="Ej: Conceptos Básicos de Pilas"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Dificultad</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                required
              >
                {difficulties.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Descripción</label>
            <Textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              required 
              placeholder="Describe el contenido del cuestionario..."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preguntas del Cuestionario</h3>
              <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Pregunta
              </Button>
            </div>

            {questions.map((question, questionIndex) => (
              <Card key={questionIndex} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Pregunta {questionIndex + 1}</Badge>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeQuestion(questionIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Pregunta</label>
                    <Textarea
                      value={question.text}
                      onChange={e => updateQuestion(questionIndex, 'text', e.target.value)}
                      required
                      placeholder="Escribe la pregunta aquí..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Opciones de Respuesta</label>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${questionIndex}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                            className="w-4 h-4"
                          />
                          <Input
                            value={typeof option === 'string' ? option : option.optionText || ''}
                            onChange={e => updateOption(questionIndex, optionIndex, e.target.value)}
                            placeholder={`Opción ${optionIndex + 1}`}
                            required
                          />
                          {question.correctAnswer === optionIndex && (
                            <Badge variant="secondary">Correcta</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Explicación</label>
                    <Textarea
                      value={question.explanation || ""}
                      onChange={e => updateQuestion(questionIndex, 'explanation', e.target.value)}
                      placeholder="Explica la respuesta correcta..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : initial?.id ? "Guardar Cambios" : "Crear Cuestionario"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 