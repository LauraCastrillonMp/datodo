"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, Info, ArrowUp, ArrowDown } from "lucide-react"
import { OperationHistory } from "./operation-history"
import { motion, AnimatePresence } from "framer-motion"

interface StackItem {
  value: number;
  id: string;
  timestamp: number;
}

export function StackSimulator() {
  const [stack, setStack] = useState<StackItem[]>([])
  const [inputValue, setInputValue] = useState("")
  const [operationHistory, setOperationHistory] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const push = () => {
    if (inputValue.trim() !== "" && !isAnimating) {
      setIsAnimating(true)
      const newItem: StackItem = {
        value: parseInt(inputValue),
        id: Date.now().toString(),
        timestamp: Date.now()
      }
      
      setTimeout(() => {
        const newStack = [newItem, ...stack]
        setStack(newStack)
        setOperationHistory(prev => [`Apilado ${inputValue} → Pila: [${newStack.map(s => s.value).join(', ')}]`, ...prev])
        setInputValue("")
        setIsAnimating(false)
      }, 300)
    }
  }

  const pop = () => {
    if (stack.length > 0 && !isAnimating) {
      setIsAnimating(true)
      const poppedValue = stack[0].value
      const remainingStack = stack.slice(1)
      
      setTimeout(() => {
        setStack(remainingStack)
        setOperationHistory(prev => [`Desapilado ${poppedValue} → Pila: [${remainingStack.map(s => s.value).join(', ')}]`, ...prev])
        setIsAnimating(false)
      }, 300)
    }
  }

  const peek = () => {
    if (stack.length > 0) {
      const topValue = stack[0].value
      setOperationHistory(prev => [`Visto el tope ${topValue} (elemento superior)`, ...prev])
    }
  }

  const clear = () => {
    if (stack.length > 0 && !isAnimating) {
      setIsAnimating(true)
      setTimeout(() => {
        setStack([])
        setOperationHistory(prev => ["Pila limpiada", ...prev])
        setIsAnimating(false)
      }, 300)
    }
  }

  const reset = () => {
    setStack([])
    setOperationHistory([])
    setInputValue("")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
      {/* Stack Visualization */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div>
              <CardTitle>Visualización de Pila</CardTitle>
              <CardDescription>Operaciones LIFO (Último en entrar, primero en salir)</CardDescription>
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
              <h4 className="font-semibold text-blue-800 mb-2">Propiedades de la Pila:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• LIFO: El último elemento apilado es el primero en desapilarse</li>
                <li>• O(1) de complejidad temporal para operaciones de push y pop</li>
                <li>• Usado en pilas de llamadas de funciones, operaciones de deshacer y evaluación de expresiones</li>
                <li>• Visual: Los elementos más nuevos aparecen arriba, los más antiguos abajo</li>
              </ul>
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[300px] flex flex-col justify-end relative overflow-x-auto">
            {stack.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2 opacity-60">
                  <rect x="10" y="60" width="60" height="10" rx="3" fill="#c7d2fe"/>
                  <rect x="20" y="45" width="40" height="10" rx="3" fill="#a5b4fc"/>
                  <rect x="30" y="30" width="20" height="10" rx="3" fill="#818cf8"/>
                </svg>
                <p className="text-lg font-semibold text-gray-500">La pila está vacía</p>
                <p className="text-sm text-muted-foreground">Agrega elementos para verlos aquí</p>
              </div>
            ) : (
              <>
                {/* Stack items - display as a real stack with items on top of each other */}
                <div className="flex flex-col-reverse items-center">
                  <AnimatePresence initial={false}>
                    {stack.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ y: -40, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: index === stack.length - 1 ? 1.08 : 1 }}
                        exit={{ y: 40, opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.25, type: "spring", bounce: 0.3 }}
                        className={
                          `relative bg-gradient-to-r from-blue-500 to-indigo-600 
                          text-white p-4 rounded-xl text-center font-mono text-lg
                          shadow-xl border-2 border-blue-400 mb-[-8px] w-24 sm:w-32 flex flex-col items-center
                          ${index === stack.length - 1 ? 'ring-4 ring-yellow-400 ring-opacity-60 z-10' : 'z-0'}
                          ${isAnimating && index === stack.length - 1 ? 'animate-pulse' : ''}`
                        }
                        style={{ zIndex: stack.length - index }}
                        aria-label={index === stack.length - 1 ? `Tope: ${item.value}` : `Elemento: ${item.value}`}
                      >
                        <div className="font-bold text-2xl drop-shadow-sm">{item.value}</div>
                        {index === stack.length - 1 && (
                          <div className="text-xs opacity-80 mt-1 font-semibold tracking-wide">TOPE</div>
                        )}
                        {index === 0 && (
                          <div className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 text-xs text-gray-300">BASE</div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <ArrowDown className="w-6 h-6 text-gray-400" />
                </div>
              </>
            )}
          </div>
          {/* Array view of the stack */}
          <div className="mt-2 flex flex-col items-center">
            <span className="text-xs text-muted-foreground mb-1">Vista de arreglo:</span>
            <div className="flex gap-2">
              {stack.length === 0 ? (
                <span className="text-xs text-gray-400">[ vacío ]</span>
              ) : (
                stack.slice().reverse().map((item, idx) => (
                  <div
                    key={item.id}
                    className={
                      `bg-indigo-100 border border-indigo-300 rounded px-3 py-1 text-indigo-700 font-mono text-sm shadow-sm
                      ${idx === stack.length - 1 ? 'bg-yellow-100 border-yellow-300 text-yellow-800 font-bold' : ''}`
                    }
                  >
                    {item.value}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Introduce un número"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && push()}
                disabled={isAnimating}
              />
              <Button 
                onClick={push} 
                disabled={!inputValue.trim() || isAnimating}
                className="min-w-[80px]"
              >
                <ArrowUp className="w-4 h-4 mr-1" />
                Apilar
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                onClick={pop} 
                disabled={stack.length === 0 || isAnimating}
              >
                <ArrowDown className="w-4 h-4 mr-1" />
                Desapilar
              </Button>
              <Button 
                variant="outline" 
                onClick={peek} 
                disabled={stack.length === 0}
              >
                <Play className="w-4 h-4 mr-1" />
                Ver tope
              </Button>
              <Button 
                variant="outline" 
                onClick={clear} 
                disabled={stack.length === 0 || isAnimating}
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

      {/* Stack Properties and History */}
      <div className="space-y-6">
        {/* Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Propiedades de la Pila</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Tamaño:</span>
                <Badge variant="outline">{stack.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Elemento Superior:</span>
                <span className="font-mono">
                  {stack.length > 0 ? stack[0].value : 'None'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>¿Está Vacía?</span>
                <Badge variant={stack.length === 0 ? "destructive" : "default"}>
                  {stack.length === 0 ? 'Sí' : 'No'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Capacidad:</span>
                <span className="text-muted-foreground">Dinámica</span>
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
                <span>Apilar:</span>
                <Badge variant="secondary">O(1)</Badge>
              </div>
              <div className="flex justify-between">
                <span>Desapilar:</span>
                <Badge variant="secondary">O(1)</Badge>
              </div>
              <div className="flex justify-between">
                <span>Ver tope:</span>
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