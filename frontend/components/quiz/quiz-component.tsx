"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, Trophy, Clock, Target } from "lucide-react"
import { apiClient } from "@/lib/api"

interface QuizQuestion {
  id: number;
  question: string;
  options: { id: number; text: string }[];
  correctAnswers: number[];
  explanation?: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  difficulty?: string;
  questions: QuizQuestion[];
  timeLimit?: number;
}

interface QuizComponentProps {
  dataStructureId: string | number;
  dataStructureSlug?: string;
  onRecentScore?: (score: number | null) => void;
  onBestScore?: (score: number | null) => void;
}

export function QuizComponent({ dataStructureId, dataStructureSlug, onRecentScore, onBestScore }: QuizComponentProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [reviewMode, setReviewMode] = useState(false)
  const [savingResult, setSavingResult] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])
  const [recentResult, setRecentResult] = useState<number | null>(null)
  const [bestResult, setBestResult] = useState<number | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showQuizSelection, setShowQuizSelection] = useState(true)

  useEffect(() => {
    const fetchQuizzesAndResults = async () => {
      setLoading(true)
      setLoadError(null)
      let result: any = null
      try {
        if (dataStructureSlug) {
          result = await apiClient.getQuizzesBySlug(dataStructureSlug)
        }
        if ((!result || result.error || !result.data || (Array.isArray(result.data) && result.data.length === 0)) && typeof dataStructureId === 'number') {
          result = await apiClient.getQuizzes(dataStructureId)
        }
        if (result && !result.error && result.data) {
          const mappedQuizzes = result.data.map((quiz: any) => ({
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            difficulty: quiz.difficulty,
            timeLimit: quiz.timeLimit || 0,
            questions: quiz.questions.map((q: any) => {
              const sortedOptions = [...q.options].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
              const correctAnswers = sortedOptions
                .map((opt: any, idx: number) => opt.isCorrect ? idx : -1)
                .filter(idx => idx !== -1);
              const options = sortedOptions.map((opt: any) => {
                return { id: opt.id, text: opt.optionText };
              });
              return {
                id: q.id,
                question: q.questionText,
                options,
                correctAnswers,
                explanation: q.explanation || '',
              };
            })
          }))
          setQuizzes(mappedQuizzes)
          
          // If only one quiz, auto-select it
          if (mappedQuizzes.length === 1) {
            setSelectedQuizId(mappedQuizzes[0].id)
            setShowQuizSelection(false)
          }
        } else {
          setQuizzes([])
          setRecentResult(null)
          setBestResult(null)
          if (onRecentScore) onRecentScore(null)
          if (onBestScore) onBestScore(null)
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setLoadError('No se pudieron cargar los cuestionarios. Por favor, inténtalo de nuevo.');
        setQuizzes([])
      } finally {
        setLoading(false)
      }
    }
    if (dataStructureSlug || dataStructureId) fetchQuizzesAndResults()
  }, [dataStructureId, dataStructureSlug])

  // Load quiz results when selected quiz changes
  useEffect(() => {
    const loadQuizResults = async () => {
      if (selectedQuizId && quizzes.length > 0) {
        const selectedQuiz = quizzes.find(q => q.id === selectedQuizId)
        if (selectedQuiz) {
          const res = await apiClient.getQuizResults(Number(dataStructureId), selectedQuizId)
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            const sortedByDate = [...res.data].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
            const sortedByScore = [...res.data].sort((a, b) => Number(b.score) - Number(a.score))
            setRecentResult(Number(sortedByDate[0].score))
            setBestResult(Number(sortedByScore[0].score))
            if (onRecentScore) onRecentScore(Number(sortedByDate[0].score))
            if (onBestScore) onBestScore(Number(sortedByScore[0].score))
          } else {
            setRecentResult(null)
            setBestResult(null)
            if (onRecentScore) onRecentScore(null)
            if (onBestScore) onBestScore(null)
          }
        }
      }
    }
    loadQuizResults()
  }, [selectedQuizId, quizzes, dataStructureId, onRecentScore, onBestScore])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && quiz && !hasSubmitted) {
      // Don't auto-submit when time runs out, just show a message
      setShowResult(true)
      setHasSubmitted(true)
    }
  }, [timeLeft, quiz, hasSubmitted])

  useEffect(() => {
    if (selectedQuizId && quizzes && quizzes.length > 0) {
      const selectedQuiz = quizzes.find(q => q.id === selectedQuizId)
      if (selectedQuiz) {
        setQuiz(selectedQuiz);
        setTimeLeft(selectedQuiz.timeLimit || 600);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setSelectedAnswers(Array(selectedQuiz.questions.length).fill(null));
        setHasSubmitted(false);
        setShowQuizSelection(false);
      }
    } else {
      setQuiz(null);
    }
  }, [selectedQuizId, quizzes]);

  // Ensure selectedAnswers is properly initialized when quiz changes
  useEffect(() => {
    if (quiz && selectedAnswers.length !== quiz.questions.length) {
      setSelectedAnswers(Array(quiz.questions.length).fill(null));
    }
  }, [quiz, selectedAnswers.length]);

  const handleQuizSelection = (quizId: number) => {
    setSelectedQuizId(quizId)
  }

  const handleBackToSelection = () => {
    setShowQuizSelection(true)
    setQuiz(null)
    setSelectedQuizId(null)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setSelectedAnswers([])
    setHasSubmitted(false)
    setReviewMode(false)
    setSavingResult(false)
    setSubmitError(null)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const updatedAnswers = [...selectedAnswers];
      updatedAnswers[currentQuestion] = selectedAnswer;
      setSelectedAnswers(updatedAnswers);
      
      // Calculate score including the current question
      let newScore = 0;
      for (let i = 0; i <= currentQuestion; i++) {
        if (updatedAnswers[i] !== null && quiz!.questions[i].correctAnswers.includes(updatedAnswers[i]!)) {
          newScore++;
        }
      }
      setScore(newScore);
      
      if (currentQuestion < quiz!.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        // For the last question, pass the updated answers directly
        finishQuiz(updatedAnswers)
      }
    }
  }

  const finishQuiz = async (finalAnswers?: (number | null)[]) => {
    if (hasSubmitted) return;
    
    const answersToUse = finalAnswers || selectedAnswers;
    
    // Check if user has answered any questions
    const answeredQuestions = answersToUse.filter(answer => answer !== null).length;
    if (answeredQuestions === 0) {
      setSubmitError('Por favor, responde al menos una pregunta antes de enviar.');
      return;
    }
    
    console.log('Submitting quiz with answers:', {
      answeredQuestions,
      totalQuestions: quiz?.questions.length,
      selectedAnswers: answersToUse,
      timeLeft,
      quizQuestions: quiz?.questions.map((q, idx) => ({
        questionId: q.id,
        questionText: q.question,
        correctAnswers: q.correctAnswers,
        selectedAnswer: answersToUse[idx],
        selectedOptionId: answersToUse[idx] !== null ? quiz.questions[idx].options[answersToUse[idx]]?.id : null
      }))
    });
    
    setHasSubmitted(true);
    setShowResult(true)
    setSavingResult(true)
    setSubmitError(null)
    try {
      if (quiz) {
        // Ensure selectedAnswers array matches quiz questions length
        if (answersToUse.length !== quiz.questions.length) {
          setSelectedAnswers(Array(quiz.questions.length).fill(null));
          setHasSubmitted(false);
          return;
        }
        
        // Prepare answers for backend
        const answers = quiz.questions.map((q, idx) => {
          const selectedAnswerIndex = answersToUse[idx];
          
          // Additional safety check
          if (selectedAnswerIndex === null || selectedAnswerIndex === undefined) {
            return {
              questionId: q.id,
              selectedOptionIds: []
            };
          }
          
          if (selectedAnswerIndex < 0 || selectedAnswerIndex >= quiz.questions[idx].options.length) {
            return {
              questionId: q.id,
              selectedOptionIds: []
            };
          }
          
          const selectedOptionIds = [quiz.questions[idx].options[selectedAnswerIndex].id];
          
          return {
            questionId: q.id,
            selectedOptionIds
          };
        });
        
        console.log('Submitting answers to backend:', answers);
        
        const response = await apiClient.submitQuiz(Number(dataStructureId), quiz.id, answers)
        
        console.log('Backend response:', response);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        if (response.data && typeof response.data === 'object' && 'success' in response.data) {
          const responseData = response.data as any;
          if (responseData.success && responseData.data) {
            // Update recent and best scores
            const newScore = Number(responseData.data.score);
            setRecentResult(newScore);
            if (onRecentScore) onRecentScore(newScore);
            
            // Update best score if this is better
            if (!bestResult || newScore > bestResult) {
              setBestResult(newScore);
              if (onBestScore) onBestScore(newScore);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Quiz submission error:', err);
      setSubmitError(err.message || 'Error saving your result. Please try again.');
      setHasSubmitted(false); // Allow retry on error
    } finally {
      setSavingResult(false)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    // Set a default time limit if none is provided
    setTimeLeft(quiz?.timeLimit || 600)
    setReviewMode(false)
    setSavingResult(false)
    setSubmitError(null)
    setSelectedAnswers(quiz ? Array(quiz.questions.length).fill(null) : [])
    setHasSubmitted(false)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Cargando cuestionario...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loadError) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-red-600 mb-4">{loadError}</div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reintentar cargar cuestionario
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Show quiz selection if there are multiple quizzes and none is selected
  if (showQuizSelection && quizzes.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Selecciona un Cuestionario
          </CardTitle>
          <CardDescription>
            Elige el cuestionario que deseas realizar. Cada uno tiene diferentes niveles de dificultad.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {quizzes.map((quizOption) => (
              <div
                key={quizOption.id}
                className="border rounded-lg p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                onClick={() => handleQuizSelection(quizOption.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{quizOption.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {quizOption.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>• {quizOption.questions.length} preguntas</span>
                      <span>• {quizOption.timeLimit ? `${Math.floor(quizOption.timeLimit / 60)} min` : 'Sin límite'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {quizOption.difficulty || 'N/A'}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!quiz && quizzes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">No hay cuestionario disponible para esta estructura de datos.</p>
          {(recentResult !== null || bestResult !== null) && (
            <div className="mb-4 space-y-1">
              {recentResult !== null && <div>Tu puntuación más reciente: <span className="font-semibold">{recentResult}%</span></div>}
              {bestResult !== null && <div>Tu mejor puntuación: <span className="font-semibold">{bestResult}%</span></div>}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Por favor, contacta a un administrador para crear un cuestionario para esta estructura de datos.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (savingResult) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-4">Guardando tu resultado...</span>
        </CardContent>
      </Card>
    )
  }

  if (submitError) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-red-500">{submitError}</p>
        </CardContent>
      </Card>
    )
  }

  if (quiz && showResult && !reviewMode) {
    // Use backend score if available, otherwise calculate frontend score
    const backendScore = recentResult !== null ? recentResult : Math.round((score / quiz.questions.length) * 100);
    const timeRanOut = timeLeft === 0 && !hasSubmitted
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            {timeRanOut ? '¡Tiempo terminado!' : 'Resultados del cuestionario'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {timeRanOut ? (
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">¡Tiempo terminado!</div>
              <p className="text-muted-foreground mb-4">
                Respondiste correctamente {score} de {quiz.questions.length} preguntas
              </p>
              <p className="text-sm text-muted-foreground">
                Tu puntuación: <span className="font-semibold">{backendScore}%</span>
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{backendScore}%</div>
              <p className="text-muted-foreground">
                Respondiste correctamente {score} de {quiz.questions.length} preguntas
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={restartQuiz} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Intentar de nuevo
            </Button>
            {quizzes.length > 1 && (
              <Button onClick={handleBackToSelection} className="flex-1" variant="outline">
                <Target className="w-4 h-4 mr-2" />
                Otros cuestionarios
              </Button>
            )}
            {timeRanOut && !savingResult && (
              <Button onClick={() => finishQuiz()} className="flex-1" variant="outline">
                <Trophy className="w-4 h-4 mr-2" />
                Enviar respuestas
              </Button>
            )}
            {!timeRanOut && (
              <Button variant="outline" className="flex-1" onClick={() => setReviewMode(true)}>
                <Target className="w-4 h-4 mr-2" />
                Revisar respuestas
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (quiz && showResult && reviewMode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Revisar respuestas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {quiz.questions.map((question, idx) => (
            <div key={question.id} className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-semibold">P{idx + 1}:</span>
                <span>{question.question}</span>
              </div>
              <div className="space-y-2 ml-6">
                {question.options.map((option, optIdx) => {
                  const isCorrect = question.correctAnswers.includes(optIdx);
                  const isSelected = selectedAnswers[idx] === optIdx;
                  return (
                    <div key={optIdx} className={`flex items-center gap-2 ${isCorrect ? 'text-green-600' : isSelected && !isCorrect ? 'text-red-600' : ''}`}> 
                      <span className="font-mono">{String.fromCharCode(65 + optIdx)}.</span>
                      <span>{option.text}</span>
                      {isCorrect && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  )
                })}
              </div>
              {question.explanation && (
                <div className="mt-2 ml-6 text-sm text-muted-foreground">
                  <span className="font-semibold">Explicación:</span> {question.explanation}
                </div>
              )}
            </div>
          ))}
          <Button onClick={() => setReviewMode(false)} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a los resultados
          </Button>
          {quizzes.length > 1 && (
            <Button onClick={handleBackToSelection} className="w-full mt-2" variant="outline">
              <Target className="w-4 h-4 mr-2" />
              Otros cuestionarios
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  const question = quiz?.questions[currentQuestion]

  return (
    <Card>
      <CardHeader>
        {(recentResult !== null || bestResult !== null) && (
          <div className="mb-2 space-y-1">
            {recentResult !== null && <div>Tu puntuación más reciente: <span className="font-semibold">{recentResult}%</span></div>}
            {bestResult !== null && <div>Tu mejor puntuación: <span className="font-semibold">{bestResult}%</span></div>}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{quiz?.title}</CardTitle>
            <CardDescription>{quiz?.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Pregunta {currentQuestion + 1} de {quiz?.questions.length}</span>
            <span>{score} correctas</span>
          </div>
          <Progress value={quiz ? (currentQuestion / quiz.questions.length) * 100 : 0} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {question && (
          <div>
            <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className="w-full justify-start h-auto p-4"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-left">{option.text}</span>
                  </div>
                  {showResult && question.correctAnswers.includes(index) && (
                    <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                  )}
                  {showResult && selectedAnswer === index && !question.correctAnswers.includes(index) && (
                    <XCircle className="w-4 h-4 text-red-500 ml-2" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null || showResult}
          >
            {currentQuestion < (quiz?.questions.length || 0) - 1 ? (
              <>
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                Finalizar
              </>
            )}
          </Button>
        </div>

        {submitError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{submitError}</p>
            <Button 
              onClick={() => finishQuiz()} 
              size="sm" 
              className="mt-2"
              disabled={savingResult}
            >
              {savingResult ? 'Reintentando...' : 'Reintentar envío'}
            </Button>
          </div>
        )}
        
        <div className="mt-6 flex gap-3">
          <Button onClick={restartQuiz} variant="outline">
            Volver a intentar
          </Button>
          {quizzes.length > 1 && (
            <Button onClick={handleBackToSelection} variant="outline">
              Otros cuestionarios
            </Button>
          )}
          <Button onClick={() => window.history.back()}>
            Volver a la estructura de datos
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 