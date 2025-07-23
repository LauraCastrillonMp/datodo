"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Zap,
  SquareStackIcon as Stack,
  Binary,
  TreePine,
  Network,
  Timer,
  Target,
} from "lucide-react"

interface SimulationStep {
  id: string
  operation: string
  description: string
  state: any
  highlight?: string[]
}

interface Algorithm {
  id: string
  name: string
  category: string
  difficulty: string
  description: string
  dataStructure: string
  icon: any
  steps: SimulationStep[]
}

export default function SimulatorPage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("")
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1000)
  const [autoPlay, setAutoPlay] = useState(false)

  const algorithms: Algorithm[] = [
    {
      id: "stack-operations",
      name: "Operaciones de Pila",
      category: "Lineal",
      difficulty: "Principiante",
      description: "Visualiza las operaciones push y pop en una pila",
      dataStructure: "Pila",
      icon: Stack,
      steps: [
        {
          id: "1",
          operation: "Inicializar",
          description: "Crear una pila vacía",
          state: { stack: [] },
          highlight: [],
        },
        {
          id: "2",
          operation: "Push 10",
          description: "Agregar el elemento 10 a la cima de la pila",
          state: { stack: [10] },
          highlight: ["0"],
        },
        {
          id: "3",
          operation: "Push 20",
          description: "Agregar el elemento 20 a la cima de la pila",
          state: { stack: [10, 20] },
          highlight: ["1"],
        },
        {
          id: "4",
          operation: "Push 30",
          description: "Agregar el elemento 30 a la cima de la pila",
          state: { stack: [10, 20, 30] },
          highlight: ["2"],
        },
        {
          id: "5",
          operation: "Pop",
          description: "Eliminar el elemento superior (30) de la pila",
          state: { stack: [10, 20] },
          highlight: [],
        },
      ],
    },
    {
      id: "bfs-traversal",
      name: "Recorrido BFS",
      category: "Grafo",
      difficulty: "Intermedio",
      description: "Visualización del algoritmo de búsqueda en anchura (BFS)",
      dataStructure: "Grafo",
      icon: Network,
      steps: [
        {
          id: "1",
          operation: "Inicializar",
          description: "Comenzar BFS desde el nodo A, agregar a la cola",
          state: {
            graph: { A: ["B", "C"], B: ["D"], C: ["D"], D: [] },
            queue: ["A"],
            visited: [],
            current: null,
          },
          highlight: ["A"],
        },
        {
          id: "2",
          operation: "Visitar A",
          description: "Desencolar A, marcar como visitado, agregar vecinos B y C a la cola",
          state: {
            graph: { A: ["B", "C"], B: ["D"], C: ["D"], D: [] },
            queue: ["B", "C"],
            visited: ["A"],
            current: "A",
          },
          highlight: ["A", "B", "C"],
        },
        {
          id: "3",
          operation: "Visitar B",
          description: "Desencolar B, marcar como visitado, agregar vecino D a la cola",
          state: {
            graph: { A: ["B", "C"], B: ["D"], C: ["D"], D: [] },
            queue: ["C", "D"],
            visited: ["A", "B"],
            current: "B",
          },
          highlight: ["B", "D"],
        },
        {
          id: "4",
          operation: "Visitar C",
          description: "Desencolar C, marcar como visitado, D ya está en la cola",
          state: {
            graph: { A: ["B", "C"], B: ["D"], C: ["D"], D: [] },
            queue: ["D"],
            visited: ["A", "B", "C"],
            current: "C",
          },
          highlight: ["C"],
        },
        {
          id: "5",
          operation: "Visitar D",
          description: "Desencolar D, marcar como visitado, no hay más vecinos",
          state: {
            graph: { A: ["B", "C"], B: ["D"], C: ["D"], D: [] },
            queue: [],
            visited: ["A", "B", "C", "D"],
            current: "D",
          },
          highlight: ["D"],
        },
      ],
    },
    {
      id: "binary-search",
      name: "Búsqueda Binaria",
      category: "Búsqueda",
      difficulty: "Intermedio",
      description: "Buscar un elemento en un arreglo ordenado",
      dataStructure: "Arreglo",
      icon: Binary,
      steps: [
        {
          id: "1",
          operation: "Inicializar",
          description: "Buscar el 7 en el arreglo ordenado [1,3,5,7,9,11,13]",
          state: {
            array: [1, 3, 5, 7, 9, 11, 13],
            target: 7,
            left: 0,
            right: 6,
            mid: null,
            found: false,
          },
          highlight: [],
        },
        {
          id: "2",
          operation: "Primera Iteración",
          description: "Calcular mid = (0+6)/2 = 3, array[3] = 7, ¡elemento encontrado!",
          state: {
            array: [1, 3, 5, 7, 9, 11, 13],
            target: 7,
            left: 0,
            right: 6,
            mid: 3,
            found: true,
          },
          highlight: ["3"],
        },
      ],
    },
    {
      id: "heap-sort",
      name: "Heap Sort",
      category: "Sorting",
      difficulty: "Advanced",
      description: "Sort an array using heap data structure",
      dataStructure: "Heap",
      icon: TreePine,
      steps: [
        {
          id: "1",
          operation: "Initial Array",
          description: "Start with unsorted array [4,10,3,5,1]",
          state: {
            array: [4, 10, 3, 5, 1],
            heapSize: 5,
            sorted: [],
          },
          highlight: [],
        },
        {
          id: "2",
          operation: "Build Max Heap",
          description: "Convert array into max heap [10,5,3,4,1]",
          state: {
            array: [10, 5, 3, 4, 1],
            heapSize: 5,
            sorted: [],
          },
          highlight: ["0"],
        },
        {
          id: "3",
          operation: "Extract Max",
          description: "Move max (10) to end, reduce heap size",
          state: {
            array: [5, 4, 3, 1, 10],
            heapSize: 4,
            sorted: [10],
          },
          highlight: ["4"],
        },
        {
          id: "4",
          operation: "Heapify",
          description: "Restore heap property [5,4,3,1]",
          state: {
            array: [5, 4, 3, 1, 10],
            heapSize: 4,
            sorted: [10],
          },
          highlight: ["0"],
        },
        {
          id: "5",
          operation: "Continue",
          description: "Repeat until array is sorted [1,3,4,5,10]",
          state: {
            array: [1, 3, 4, 5, 10],
            heapSize: 0,
            sorted: [1, 3, 4, 5, 10],
          },
          highlight: [],
        },
      ],
    },
  ]

  const selectedAlgo = algorithms.find((a) => a.id === selectedAlgorithm)
  const currentStepData = selectedAlgo?.steps[currentStep]

  const playSimulation = () => {
    if (!selectedAlgo) return

    setIsPlaying(true)
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= selectedAlgo.steps.length - 1) {
          setIsPlaying(false)
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, playbackSpeed)
  }

  const pauseSimulation = () => {
    setIsPlaying(false)
  }

  const resetSimulation = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const nextStep = () => {
    if (selectedAlgo && currentStep < selectedAlgo.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderVisualization = () => {
    if (!selectedAlgo || !currentStepData) return null

    switch (selectedAlgo.dataStructure) {
      case "Stack":
        return (
          <div className="flex flex-col items-center space-y-2 p-8">
            {currentStepData.state.stack.length === 0 ? (
              <div className="text-muted-foreground">Empty Stack</div>
            ) : (
              currentStepData.state.stack
                .slice()
                .reverse()
                .map((item: number, index: number) => {
                  const actualIndex = currentStepData.state.stack.length - 1 - index
                  const isHighlighted = currentStepData.highlight?.includes(actualIndex.toString())
                  return (
                    <div
                      key={index}
                      className={`
                      w-20 h-12 border-2 rounded flex items-center justify-center font-bold text-lg
                      transition-all duration-500 ${
                        isHighlighted
                          ? "border-gaming-gold bg-gaming-gold text-white scale-110"
                          : "border-gaming-purple bg-gaming-purple text-white"
                      }
                    `}
                    >
                      {item}
                    </div>
                  )
                })
            )}
            <div className="text-sm text-muted-foreground">↑ TOP</div>
          </div>
        )

      case "Graph":
        return (
          <div className="p-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Graph Visualization</h4>
                <svg width="200" height="200" className="border rounded">
                  {/* Nodes */}
                  {["A", "B", "C", "D"].map((node, index) => {
                    const positions = [
                      { x: 50, y: 50 }, // A
                      { x: 150, y: 50 }, // B
                      { x: 50, y: 150 }, // C
                      { x: 150, y: 150 }, // D
                    ]
                    const pos = positions[index]
                    const isVisited = currentStepData.state.visited.includes(node)
                    const isCurrent = currentStepData.state.current === node
                    const isHighlighted = currentStepData.highlight?.includes(node)

                    return (
                      <g key={node}>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="20"
                          className={`transition-all duration-500 ${
                            isCurrent
                              ? "fill-gaming-gold stroke-gaming-gold"
                              : isVisited
                                ? "fill-gaming-experience stroke-gaming-experience"
                                : isHighlighted
                                  ? "fill-gaming-purple stroke-gaming-purple"
                                  : "fill-muted stroke-border"
                          }`}
                          strokeWidth="2"
                        />
                        <text x={pos.x} y={pos.y + 5} textAnchor="middle" className="text-white font-bold">
                          {node}
                        </text>
                      </g>
                    )
                  })}

                  {/* Edges */}
                  <line x1="70" y1="50" x2="130" y2="50" stroke="currentColor" strokeWidth="2" />
                  <line x1="50" y1="70" x2="50" y2="130" stroke="currentColor" strokeWidth="2" />
                  <line x1="150" y1="70" x2="150" y2="130" stroke="currentColor" strokeWidth="2" />
                  <line x1="70" y1="150" x2="130" y2="150" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Queue</h4>
                  <div className="flex space-x-2">
                    {currentStepData.state.queue.map((node: string, index: number) => (
                      <div
                        key={index}
                        className="w-8 h-8 bg-gaming-purple text-white rounded flex items-center justify-center text-sm font-bold"
                      >
                        {node}
                      </div>
                    ))}
                    {currentStepData.state.queue.length === 0 && (
                      <div className="text-muted-foreground text-sm">Empty</div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Visited</h4>
                  <div className="flex space-x-2">
                    {currentStepData.state.visited.map((node: string, index: number) => (
                      <div
                        key={index}
                        className="w-8 h-8 bg-gaming-experience text-white rounded flex items-center justify-center text-sm font-bold"
                      >
                        {node}
                      </div>
                    ))}
                    {currentStepData.state.visited.length === 0 && (
                      <div className="text-muted-foreground text-sm">None</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "Array":
        return (
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-4">Array: Target = {currentStepData.state.target}</h4>
                <div className="flex space-x-2 justify-center">
                  {currentStepData.state.array.map((item: number, index: number) => {
                    const isLeft = index === currentStepData.state.left
                    const isRight = index === currentStepData.state.right
                    const isMid = index === currentStepData.state.mid
                    const isHighlighted = currentStepData.highlight?.includes(index.toString())

                    return (
                      <div key={index} className="text-center">
                        <div
                          className={`
                            w-12 h-12 border-2 rounded flex items-center justify-center font-bold
                            transition-all duration-500 ${
                              isMid
                                ? "border-gaming-gold bg-gaming-gold text-white scale-110"
                                : isLeft || isRight
                                  ? "border-gaming-purple bg-gaming-purple/20"
                                  : isHighlighted
                                    ? "border-gaming-experience bg-gaming-experience/20"
                                    : "border-border"
                            }
                          `}
                        >
                          {item}
                        </div>
                        <div className="text-xs mt-1 text-muted-foreground">{index}</div>
                        {isLeft && <div className="text-xs text-gaming-purple">L</div>}
                        {isRight && <div className="text-xs text-gaming-purple">R</div>}
                        {isMid && <div className="text-xs text-gaming-gold">M</div>}
                      </div>
                    )
                  })}
                </div>
              </div>

              {currentStepData.state.found && (
                <div className="text-center">
                  <Badge variant="default" className="bg-gaming-gold text-white">
                    Target Found at Index {currentStepData.state.mid}!
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )

      case "Heap":
        return (
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-4">Heap Sort Progress</h4>
                <div className="flex space-x-2 justify-center">
                  {currentStepData.state.array.map((item: number, index: number) => {
                    const isSorted =
                      currentStepData.state.sorted.includes(item) && index >= currentStepData.state.heapSize
                    const isHighlighted = currentStepData.highlight?.includes(index.toString())

                    return (
                      <div key={index} className="text-center">
                        <div
                          className={`
                            w-12 h-12 border-2 rounded flex items-center justify-center font-bold
                            transition-all duration-500 ${
                              isSorted
                                ? "border-gaming-experience bg-gaming-experience text-white"
                                : isHighlighted
                                  ? "border-gaming-gold bg-gaming-gold text-white scale-110"
                                  : index < currentStepData.state.heapSize
                                    ? "border-gaming-purple bg-gaming-purple/20"
                                    : "border-border"
                            }
                          `}
                        >
                          {item}
                        </div>
                        <div className="text-xs mt-1 text-muted-foreground">{index}</div>
                        {isSorted && <div className="text-xs text-gaming-experience">Sorted</div>}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="text-center">
                <Badge variant="outline">Heap Size: {currentStepData.state.heapSize}</Badge>
                <Badge variant="outline" className="ml-2">
                  Sorted: {currentStepData.state.sorted.length}
                </Badge>
              </div>
            </div>
          </div>
        )

      default:
        return <div className="p-8 text-center text-muted-foreground">Visualization not available</div>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Algorithm Simulator</h1>
        <p className="text-muted-foreground">
          Interactive step-by-step visualization of algorithms and data structures
        </p>
      </div>

      <Tabs defaultValue="simulator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="simulator">Simulador</TabsTrigger>
          <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="simulator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Simulation Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Algorithm</label>
                  <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose algorithm..." />
                    </SelectTrigger>
                    <SelectContent>
                      {algorithms.map((algo) => (
                        <SelectItem key={algo.id} value={algo.id}>
                          {algo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedAlgo && (
                  <>
                    <div className="pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Category:</span>
                          <Badge variant="outline">{selectedAlgo.category}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Difficulty:</span>
                          <Badge variant="secondary">{selectedAlgo.difficulty}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Data Structure:</span>
                          <Badge variant="outline">{selectedAlgo.dataStructure}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Step {currentStep + 1} of {selectedAlgo.steps.length}
                        </span>
                        <Badge variant="outline">
                          <Timer className="w-3 h-3 mr-1" />
                          {playbackSpeed}ms
                        </Badge>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={prevStep} disabled={currentStep === 0}>
                          ←
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={isPlaying ? pauseSimulation : playSimulation}
                          disabled={currentStep >= selectedAlgo.steps.length - 1}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={nextStep}
                          disabled={currentStep >= selectedAlgo.steps.length - 1}
                        >
                          →
                        </Button>
                        <Button variant="outline" size="sm" onClick={resetSimulation}>
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Speed</label>
                        <Select
                          value={playbackSpeed.toString()}
                          onValueChange={(value) => setPlaybackSpeed(Number(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2000">Slow (2s)</SelectItem>
                            <SelectItem value="1000">Normal (1s)</SelectItem>
                            <SelectItem value="500">Fast (0.5s)</SelectItem>
                            <SelectItem value="250">Very Fast (0.25s)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Visualization */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>{selectedAlgo ? selectedAlgo.name : "Select an Algorithm"}</CardTitle>
                {selectedAlgo && <CardDescription>{selectedAlgo.description}</CardDescription>}
              </CardHeader>
              <CardContent>
                {selectedAlgo ? (
                  <div className="min-h-[400px]">{renderVisualization()}</div>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    <div className="text-center">
                      <Target className="w-16 h-16 mx-auto mb-4" />
                      <p>Select an algorithm to start simulation</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Step Information */}
          {selectedAlgo && currentStepData && (
            <Card>
              <CardHeader>
                <CardTitle>Current Step: {currentStepData.operation}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{currentStepData.description}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="algorithms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {algorithms.map((algo) => {
              const IconComponent = algo.icon
              return (
                <Card
                  key={algo.id}
                  className="group hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border-2 hover:border-gaming-purple"
                  onClick={() => setSelectedAlgorithm(algo.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <IconComponent className="w-8 h-8 text-gaming-purple" />
                      <Badge variant="secondary">{algo.difficulty}</Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-gaming-purple transition-colors">
                      {algo.name}
                    </CardTitle>
                    <CardDescription>{algo.description}</CardDescription>
                    <div className="flex space-x-2">
                      <Badge variant="outline">{algo.category}</Badge>
                      <Badge variant="outline">{algo.dataStructure}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Steps:</span>
                        <Badge variant="outline">{algo.steps.length}</Badge>
                      </div>
                      <Button className="w-full group-hover:bg-gaming-purple group-hover:text-white transition-colors">
                        <Play className="w-4 h-4 mr-2" />
                        Start Simulation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Simulation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Playback Speed</label>
                  <Select value={playbackSpeed.toString()} onValueChange={(value) => setPlaybackSpeed(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3000">Very Slow (3s)</SelectItem>
                      <SelectItem value="2000">Slow (2s)</SelectItem>
                      <SelectItem value="1000">Normal (1s)</SelectItem>
                      <SelectItem value="500">Fast (0.5s)</SelectItem>
                      <SelectItem value="250">Very Fast (0.25s)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Animation Quality</label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Better Performance)</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High (Better Quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Color Theme</label>
                  <Select defaultValue="gaming">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gaming">Gaming Theme</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="colorful">Colorful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enable Smooth Animations</span>
                    <Button variant="outline" size="sm">
                      <Zap className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-pause on Step</span>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Debug Info</span>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Keyboard Shortcuts</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Play/Pause</span>
                      <Badge variant="outline" className="font-mono">
                        Space
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Step</span>
                      <Badge variant="outline" className="font-mono">
                        →
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Previous Step</span>
                      <Badge variant="outline" className="font-mono">
                        ←
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Reset</span>
                      <Badge variant="outline" className="font-mono">
                        R
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
