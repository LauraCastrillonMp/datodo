"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, Info, ArrowRight, ArrowLeft } from "lucide-react"
import { OperationHistory } from "./operation-history"

interface QueueItem {
  value: number;
  id: string;
  timestamp: number;
}

export function QueueSimulator() {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [inputValue, setInputValue] = useState("")
  const [operationHistory, setOperationHistory] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const enqueue = () => {
    if (inputValue.trim() !== "" && !isAnimating) {
      setIsAnimating(true)
      const newItem: QueueItem = {
        value: parseInt(inputValue),
        id: Date.now().toString(),
        timestamp: Date.now()
      }
      
      setTimeout(() => {
        const newQueue = [...queue, newItem]
        setQueue(newQueue)
        setOperationHistory(prev => [`Encolado ${inputValue} → Cola: [${newQueue.map(q => q.value).join(', ')}]`, ...prev])
        setInputValue("")
        setIsAnimating(false)
      }, 300)
    }
  }

  const dequeue = () => {
    if (queue.length > 0 && !isAnimating) {
      setIsAnimating(true)
      const dequeuedValue = queue[0].value
      const remainingQueue = queue.slice(1)
      
      setTimeout(() => {
        setQueue(remainingQueue)
        setOperationHistory(prev => [`Desencolado ${dequeuedValue} → Cola: [${remainingQueue.map(q => q.value).join(', ')}]`, ...prev])
        setIsAnimating(false)
      }, 300)
    }
  }

  const peek = () => {
    if (queue.length > 0) {
      const frontValue = queue[0].value
      setOperationHistory(prev => [`Visto el frente ${frontValue} (elemento frontal)`, ...prev])
    }
  }

  const clear = () => {
    if (queue.length > 0 && !isAnimating) {
      setIsAnimating(true)
      setTimeout(() => {
        setQueue([])
        setOperationHistory(prev => ["Cola limpiada", ...prev])
        setIsAnimating(false)
      }, 300)
    }
  }

  const reset = () => {
    setQueue([])
    setOperationHistory([])
    setInputValue("")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
      {/* Queue Visualization */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div>
              <CardTitle>Visualización de Cola</CardTitle>
              <CardDescription>Operaciones FIFO (Primero en entrar, primero en salir)</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 w-full">
          {showInfo && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Propiedades de la Cola:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• FIFO: El primer elemento encolado es el primero en desencolarse</li>
                <li>• O(1) de complejidad temporal para operaciones de encolar y desencolar</li>
                <li>• Usado en búsqueda en anchura, planificación de tareas y colas de impresión</li>
              </ul>
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[300px] flex items-center justify-center relative overflow-x-auto">
            {queue.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <ArrowRight className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>La cola está vacía</p>
                <p className="text-sm">Agrega elementos para verlos aquí</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-6 h-6 text-gray-400" />
                {queue.map((item, index) => (
                  <div
                    key={item.id}
                    className={
                      `bg-gradient-to-r from-green-500 to-green-600 
                      text-white p-4 rounded-lg text-center font-mono text-lg
                      shadow-lg transform transition-all duration-300
                      w-20 sm:w-28
                      ${index === 0 ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
                      ${isAnimating ? 'scale-105' : 'scale-100'}`
                    }
                  >
                    <div className="font-bold">{item.value}</div>
                    {index === 0 && (
                      <div className="text-xs opacity-75 mt-1">FRENTE</div>
                    )}
                    {index === queue.length - 1 && (
                      <div className="text-xs opacity-75 mt-1">FINAL</div>
                    )}
                  </div>
                ))}
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Introduce un número"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && enqueue()}
                disabled={isAnimating}
              />
              <Button 
                onClick={enqueue} 
                disabled={!inputValue.trim() || isAnimating}
                className="min-w-[80px]"
              >
                <ArrowRight className="w-4 h-4 mr-1" />
                Encolar
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                onClick={dequeue} 
                disabled={queue.length === 0 || isAnimating}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Desencolar
              </Button>
              <Button 
                variant="outline" 
                onClick={peek} 
                disabled={queue.length === 0}
              >
                <Play className="w-4 h-4 mr-1" />
                Ver frente
              </Button>
              <Button 
                variant="outline" 
                onClick={clear} 
                disabled={queue.length === 0 || isAnimating}
              >
                Limpiar
              </Button>
            </div>

            <Button 
              variant="ghost" 
              onClick={reset}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reiniciar Todo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Queue Properties and History */}
      <div className="space-y-6">
        {/* Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Propiedades de la Cola</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Tamaño:</span>
                <Badge variant="outline">{queue.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Elemento frontal:</span>
                <span className="font-mono">
                  {queue.length > 0 ? queue[0].value : 'None'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Elemento final:</span>
                <span className="font-mono">
                  {queue.length > 0 ? queue[queue.length - 1].value : 'None'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>¿Está vacía?</span>
                <Badge variant={queue.length === 0 ? "destructive" : "default"}>
                  {queue.length === 0 ? 'Sí' : 'No'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operation History */}
        <OperationHistory history={operationHistory} />

        {/* Time Complexity */}
        <Card>
          <CardHeader>
            <CardTitle>Complejidad Temporal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Encolar:</span>
                <Badge variant="secondary">O(1)</Badge>
              </div>
              <div className="flex justify-between">
                <span>Desencolar:</span>
                <Badge variant="secondary">O(1)</Badge>
              </div>
              <div className="flex justify-between">
                <span>Ver frente:</span>
                <Badge variant="secondary">O(1)</Badge>
              </div>
              <div className="flex justify-between">
                <span>Buscar:</span>
                <Badge variant="secondary">O(n)</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 