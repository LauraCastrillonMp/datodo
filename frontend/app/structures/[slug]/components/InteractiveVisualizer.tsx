import { useState, useEffect } from 'react'
import { Plus, ArrowRight, Minus, Search, RefreshCw, Zap } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVertical, RotateCcw, Code } from 'lucide-react'
import { VisualizerCard } from '@/components/structures/VisualizerCard'
import { StepDisplay } from '@/components/structures/StepDisplay'
import { OperationButtons } from '@/components/structures/OperationButtons'
import { NumberInputPanel } from '@/components/structures/NumberInputPanel'
import React from 'react'

interface InteractiveVisualizerProps {
  dataStructureSlug: string
  operations: any[]
  isAnimating: boolean
  setIsAnimating: (v: boolean) => void
  currentStep: string
  setCurrentStep: (v: string) => void
  highlightedItem: number | null
  setHighlightedItem: (v: number | null) => void
  operationHistory: string[]
  setOperationHistory: (v: string[]) => void
  showHelp: boolean
  setShowHelp: (v: boolean) => void
  getStructureType: () => string
  getOperationIcon: (op: string) => React.ReactNode
  needsInputValue: (op: string) => boolean
  needsSearchValue: (op: string) => boolean
}

export function InteractiveVisualizer({
  dataStructureSlug,
  operations,
  isAnimating,
  setIsAnimating,
  currentStep,
  setCurrentStep,
  highlightedItem,
  setHighlightedItem,
  operationHistory,
  setOperationHistory,
  showHelp,
  setShowHelp,
  getStructureType,
  getOperationIcon,
  needsInputValue,
  needsSearchValue
}: InteractiveVisualizerProps) {
  const [items, setItems] = useState<number[]>([])
  const [inputValue, setInputValue] = useState('')
  const [searchValue, setSearchValue] = useState('')

  // --- Persistencia en localStorage por 24h ---
  const STORAGE_KEY = `ds-visualizer-${dataStructureSlug}`
  const MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 horas

  // Cargar estado inicial
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && Array.isArray(parsed.items) && typeof parsed.timestamp === 'number') {
          const age = Date.now() - parsed.timestamp
          if (age < MAX_AGE_MS) {
            setItems(parsed.items)
            console.log(`Estado restaurado para ${dataStructureSlug}:`, parsed.items)
          } else {
            localStorage.removeItem(STORAGE_KEY)
            console.log(`Estado expirado para ${dataStructureSlug}`)
          }
        }
      }
    } catch (error) {
      console.error('Error cargando estado:', error)
    }
  }, [dataStructureSlug])

  // Guardar estado cada vez que cambian los items
  useEffect(() => {
    if (items.length > 0) {
      try {
        const data = { items, timestamp: Date.now() }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        console.log(`Estado guardado para ${dataStructureSlug}:`, items)
      } catch (error) {
        console.error('Error guardando estado:', error)
      }
    }
  }, [items, dataStructureSlug])

  // Process operations to add icons
  const processedOperations = operations.map((operation, index) => ({
    id: operation.id || index,
    name: operation.name,
    description: operation.description,
    complexity: operation.complexity,
    icon: getOperationIcon(operation.name)
  }))

  const handleOperationClick = async (operationName: string) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentStep(`Iniciando operación de ${operationName.toLowerCase()}...`)
    await new Promise(resolve => setTimeout(resolve, 1000))
    let newItems = [...items]
    let operationDescription = ''
    const structureType = getStructureType()
    try {
      switch (operationName.toLowerCase()) {
        case 'push':
        case 'add':
        case 'enqueue':
        case 'insert':
          if (!inputValue) {
            setCurrentStep('Por favor, ingresa un valor para agregar')
            setIsAnimating(false)
            return
          }
          const value = parseInt(inputValue)
          if (isNaN(value)) {
            setCurrentStep('Por favor, ingresa un número válido')
            setIsAnimating(false)
            return
          }
          setCurrentStep(`Agregando ${value} a la estructura...`)
          await new Promise(resolve => setTimeout(resolve, 1000))
          newItems.push(value)
          setItems(newItems)
          setHighlightedItem(newItems.length - 1)
          operationDescription = `${operationName}: Agregado ${value}`
          break
        case 'pop':
        case 'remove':
        case 'dequeue':
        case 'delete':
          if (newItems.length === 0) {
            setCurrentStep('La estructura está vacía - nada para eliminar')
            setIsAnimating(false)
            return
          }
          let removedItem
          if (structureType === 'queue' || structureType === 'linked-list') {
            removedItem = newItems.shift()
            setCurrentStep(`Eliminando ${removedItem} del frente...`)
          } else {
            removedItem = newItems.pop()
            setCurrentStep(`Eliminando ${removedItem} de la estructura...`)
          }
          await new Promise(resolve => setTimeout(resolve, 1000))
          setItems(newItems)
          setHighlightedItem(null)
          operationDescription = `${operationName}: Eliminado ${removedItem}`
          break
        case 'peek':
        case 'top':
        case 'front':
          if (newItems.length === 0) {
            setCurrentStep('La estructura está vacía - nada para ver')
            setIsAnimating(false)
            return
          }
          let peekIndex = structureType === 'queue' || structureType === 'linked-list' ? 0 : newItems.length - 1
          const peekItem = newItems[peekIndex]
          setCurrentStep(`Viendo ${peekItem} (elemento superior/frontal)...`)
          await new Promise(resolve => setTimeout(resolve, 1000))
          setHighlightedItem(peekIndex)
          operationDescription = `${operationName}: Visto ${peekItem}`
          break
        case 'search':
        case 'find':
          if (!searchValue) {
            setCurrentStep('Por favor, ingresa un valor para buscar')
            setIsAnimating(false)
            return
          }
          const searchVal = parseInt(searchValue)
          if (isNaN(searchVal)) {
            setCurrentStep('Por favor, ingresa un número válido para buscar')
            setIsAnimating(false)
            return
          }
          setCurrentStep(`Buscando ${searchVal}...`)
          await new Promise(resolve => setTimeout(resolve, 1000))
          const foundIndex = newItems.indexOf(searchVal)
          if (foundIndex !== -1) {
            setHighlightedItem(foundIndex)
            operationDescription = `${operationName}: Encontrado ${searchVal} en la posición ${foundIndex}`
            setCurrentStep(`¡Encontrado ${searchVal} en la posición ${foundIndex}!`)
          } else {
            setHighlightedItem(null)
            operationDescription = `${operationName}: ${searchVal} no encontrado`
            setCurrentStep(`${searchVal} no se encontró en la estructura`)
          }
          break
        case 'clear':
        case 'reset':
          setCurrentStep('Limpiando la estructura...')
          await new Promise(resolve => setTimeout(resolve, 1000))
          setItems([])
          setHighlightedItem(null)
          operationDescription = `${operationName}: Todos los elementos eliminados`
          setCurrentStep('Estructura limpiada correctamente')
          // Limpiar localStorage
          try { 
            localStorage.removeItem(STORAGE_KEY)
            console.log(`Estado limpiado para ${dataStructureSlug}`)
          } catch (error) {
            console.error('Error limpiando estado:', error)
          }
          break
        case 'size':
        case 'length':
        case 'count':
          setCurrentStep(`Contando elementos...`)
          await new Promise(resolve => setTimeout(resolve, 1000))
          operationDescription = `${operationName}: La estructura tiene ${newItems.length} elementos`
          setCurrentStep(`La estructura contiene ${newItems.length} elementos`)
          break
        case 'isempty':
        case 'empty':
          setCurrentStep(`Verificando si la estructura está vacía...`)
          await new Promise(resolve => setTimeout(resolve, 1000))
          const isEmpty = newItems.length === 0
          operationDescription = `${operationName}: La estructura está ${isEmpty ? 'vacía' : 'no vacía'}`
          setCurrentStep(`La estructura está ${isEmpty ? 'vacía' : 'no vacía'}`)
          break
        default:
          setCurrentStep(`Operación ${operationName} aún no implementada`)
          setIsAnimating(false)
          return
      }
      setOperationHistory([operationDescription, ...operationHistory.slice(0, 9)])
      setTimeout(() => {
        setCurrentStep('')
        setHighlightedItem(null)
      }, 2000)
    } catch (error) {
      setCurrentStep(`Error: ${error}`)
    } finally {
      setIsAnimating(false)
    }
  }

  const renderVisualization = () => {
    if (items.length === 0) {
      return (
        <div className="text-center text-muted-foreground">
          <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>La estructura está vacía</p>
          <p className="text-sm">Agrega elementos para verlos aquí</p>
        </div>
      )
    }

    const structureType = getStructureType()

    switch (structureType) {
      case 'stack':
        return (
          <div className="flex flex-col items-center justify-end min-h-[350px] relative overflow-x-auto w-full">
            <div className="space-y-1">
              {items.slice().reverse().map((item, index) => {
                const isTop = index === 0;
                const origIndex = items.length - 1 - index;
                return (
                  <div
                    key={origIndex}
                    className={
                      [
                        'bg-gradient-to-r from-blue-500 to-blue-600',
                        'text-white p-2 rounded text-center font-mono',
                        'shadow-lg transform transition-all duration-300',
                        'border border-blue-400 relative',
                        'w-20 sm:w-24 md:w-32',
                        highlightedItem === origIndex ? 'ring-2 ring-yellow-400 ring-opacity-50 scale-110' : '',
                        isTop ? 'ring-2 ring-yellow-400 ring-opacity-30' : ''
                      ].join(' ')
                    }
                    style={{
                      marginBottom: isTop ? '0' : '-4px',
                      zIndex: items.length - index
                    }}
                  >
                    <div className="font-bold text-sm">{item}</div>
                    <div className="text-xs opacity-75">
                      {isTop ? 'TOP' : `L${items.length - index}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )

      case 'queue':
        return (
          <div className="flex flex-col items-center justify-center min-h-[350px] overflow-x-auto w-full">
            <div className="border-2 border-gray-600 rounded-lg p-4 bg-gray-800/50 min-w-[320px] w-fit overflow-x-auto">
              <div className="flex items-center justify-center space-x-2">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className={`
                      bg-gradient-to-r from-green-500 to-green-600 
                      text-white p-2 rounded text-center font-mono
                      shadow-lg transform transition-all duration-300
                      border border-green-400 relative
                      w-16 sm:w-20 md:w-24
                      ${highlightedItem === index ? 'ring-2 ring-yellow-400 ring-opacity-50 scale-110' : ''}
                      ${index === 0 ? 'ring-2 ring-red-400 ring-opacity-30' : ''}
                      ${index === items.length - 1 ? 'ring-2 ring-blue-400 ring-opacity-30' : ''}
                    `}
                  >
                    <div className="font-bold text-sm">{item}</div>
                    <div className="text-xs opacity-75">
                      {index === 0 ? 'FRONT' : index === items.length - 1 ? 'BACK' : `P${index + 1}`}
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-red-400"></div>
                      </div>
                    )}
                    {index === items.length - 1 && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-blue-400"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between w-full max-w-md mt-4">
              <div className="text-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                <div className="text-xs text-gray-600">Front</div>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                <div className="text-xs text-gray-600">Back</div>
              </div>
            </div>
          </div>
        )

      case 'linked-list':
        return (
          <div className="flex flex-col items-center space-y-4 overflow-x-auto w-full">
            <div className="flex items-center space-x-2 min-w-[320px] w-fit">
              {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className={`
                      bg-gradient-to-r from-purple-500 to-purple-600 
                      text-white p-3 rounded text-center font-mono
                      shadow-lg transform transition-all duration-300
                      border border-purple-400 relative
                      w-16 sm:w-20 md:w-24
                      ${highlightedItem === index ? 'ring-2 ring-yellow-400 ring-opacity-50 scale-110' : ''}
                    `}
                  >
                    <div className="font-bold text-sm">{item}</div>
                    <div className="text-xs opacity-75">Node</div>
                  </div>
                  {index < items.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  )}
                  {index === items.length - 1 && (
                    <div className="text-xs text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded">
                      NULL
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Nodo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span>Puntero</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">NULL</div>
                    <span>Fin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'double-linked-list': {
        const NODE_WIDTH = 48;
        const NODE_HEIGHT = 48;
        const NODE_MARGIN = 6;
        const SVG_WIDTH = 52;
        const X1 = 12;
        const X2 = 40;
        return (
          <div className="flex flex-col items-center justify-end min-h-[350px] relative overflow-x-auto w-full">
            <div className="flex items-center justify-center mb-14 min-w-[320px] w-fit">
              {/* NULL inicial */}
              <div className="text-xs text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded" style={{ width: NODE_WIDTH, textAlign: 'center', margin: `0 ${NODE_MARGIN}px` }}>NULL</div>
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  {/* Nodo */}
                  <div
                    className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded text-center font-mono shadow-lg border border-blue-400 relative flex flex-col items-center justify-center w-12 sm:w-16 md:w-20`}
                    style={{ height: NODE_HEIGHT, margin: `0 ${NODE_MARGIN}px` }}
                  >
                    <div className="font-bold text-lg">{item}</div>
                  </div>
                  {/* Flechas entre nodos (excepto después del último nodo) */}
                  {index < items.length - 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: SVG_WIDTH, margin: `0 ${NODE_MARGIN}px` }}>
                      {/* Flecha siguiente (arriba) */}
                      <svg width={SVG_WIDTH} height={20}>
                        <defs>
                          <marker id="arrow-next" markerWidth="5" markerHeight="5" refX="4.5" refY="2.5" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,5 L5,2.5 z" fill="#2563eb" />
                          </marker>
                          <marker id="arrow-prev-end" markerWidth="5" markerHeight="5" refX="4.5" refY="2.5" orient="auto-start-reverse" markerUnits="strokeWidth">
                            <path d="M0,0 L0,5 L5,2.5 z" fill="#60a5fa" />
                          </marker>
                        </defs>
                        <line x1={X1} y1="10" x2={X2} y2="10" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#arrow-next)" />
                      </svg>
                      {/* Flecha anterior (abajo) */}
                      <svg width={SVG_WIDTH} height={20}>
                        <defs>
                          <marker id="arrow-prev-end" markerWidth="5" markerHeight="5" refX="4.5" refY="2.5" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,5 L5,2.5 z" fill="#60a5fa" />
                          </marker>
                        </defs>
                        <line x1={X2} y1="10" x2={X1} y2="10" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#arrow-prev-end)" />
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              ))}
              {/* NULL final */}
              <div className="text-xs text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded" style={{ width: NODE_WIDTH, textAlign: 'center', margin: `0 ${NODE_MARGIN}px` }}>NULL</div>
            </div>
            <div className="text-center mt-16">
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Nodo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg width="20" height="20">
                      <defs>
                        <marker id="legend-arrow-forward" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
                          <path d="M0,0 L0,4 L4,2 z" fill="#2563eb" />
                        </marker>
                      </defs>
                      <line x1="2" y1="10" x2="18" y2="10" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#legend-arrow-forward)" />
                    </svg>
                    <span>Siguiente</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg width="20" height="20">
                      <defs>
                        <marker id="legend-arrow-back" markerWidth="4" markerHeight="4" refX="1" refY="2" orient="auto">
                          <path d="M4,0 L4,4 L0,2 z" fill="#60a5fa" />
                        </marker>
                      </defs>
                      <line x1="18" y1="10" x2="2" y2="10" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#legend-arrow-back)" />
                    </svg>
                    <span>Anterior</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">NULL</div>
                    <span>Fin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      case 'circular-linked-list':
        return (
          <div className="flex flex-col items-center space-y-4 overflow-x-auto w-full">
            <div className="flex items-center space-x-2 min-w-[320px] w-fit">
              {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className={`
                      bg-gradient-to-r from-green-500 to-green-600 
                      text-white p-3 rounded text-center font-mono
                      shadow-lg transform transition-all duration-300
                      border border-green-400 relative
                      w-16 sm:w-20 md:w-24
                      ${highlightedItem === index ? 'ring-2 ring-yellow-400 ring-opacity-50 scale-110' : ''}
                    `}
                  >
                    <div className="font-bold text-sm">{item}</div>
                    <div className="text-xs opacity-75">Node</div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>
              ))}
              {items.length > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-green-400 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-xs text-green-600 font-medium">Circular</span>
                </div>
              )}
            </div>
            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Nodo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span>Puntero</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-green-400 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-2 h-2 text-green-400" />
                    </div>
                    <span>Circular</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'tree':
        // --- Improved SVG-based binary tree visualization ---
        // Helper to build a tree structure from the flat items array (assume level order)
        interface TreeNode {
          value: number;
          left: TreeNode | null;
          right: TreeNode | null;
          index: number;
        }
        function buildTree(items: number[]): TreeNode | null {
          if (!items.length) return null;
          const nodes: TreeNode[] = items.map((value: number, i: number) => ({ value, left: null, right: null, index: i }));
          for (let i = 0; i < nodes.length; i++) {
            const leftIdx = 2 * i + 1;
            const rightIdx = 2 * i + 2;
            if (leftIdx < nodes.length) nodes[i].left = nodes[leftIdx];
            if (rightIdx < nodes.length) nodes[i].right = nodes[rightIdx];
          }
          return nodes[0];
        }
        // Helper to assign x/y positions to each node
        interface PositionedNode extends TreeNode {
          x: number;
          y: number;
        }
        function layoutTree(node: TreeNode | null, depth = 0, x = 0, spread = 1): PositionedNode[] {
          if (!node) return [];
          const y = depth * 110 + 50; // More vertical space between levels
          let left: PositionedNode[] = [], right: PositionedNode[] = [];
          let pos: PositionedNode[] = [{ ...node, x, y }];
          const baseSpread = 260; // More horizontal space between nodes
          if (node.left) left = layoutTree(node.left, depth + 1, x - baseSpread / (depth + 1) * spread, spread * 0.7);
          if (node.right) right = layoutTree(node.right, depth + 1, x + baseSpread / (depth + 1) * spread, spread * 0.7);
          return [...left, ...pos, ...right];
        }
        // Helper to get edges for SVG lines
        interface Edge { from: PositionedNode; to: PositionedNode; }
        function getEdges(node: TreeNode | null, positions: PositionedNode[]): Edge[] {
          if (!node) return [];
          const edges: Edge[] = [];
          const parent = positions.find((n: PositionedNode) => n.index === node.index);
          if (node.left) {
            const left = positions.find((n: PositionedNode) => n.index === node.left!.index);
            if (parent && left) edges.push({ from: parent, to: left });
            edges.push(...getEdges(node.left, positions));
          }
          if (node.right) {
            const right = positions.find((n: PositionedNode) => n.index === node.right!.index);
            if (parent && right) edges.push({ from: parent, to: right });
            edges.push(...getEdges(node.right, positions));
          }
          return edges;
        }
        const tree = buildTree(items);
        const positions = tree ? layoutTree(tree) : [];
        const edges = tree ? getEdges(tree, positions) : [];
        // Center SVG horizontally
        const minX = Math.min(...positions.map((n: PositionedNode) => n.x), 0);
        const maxX = Math.max(...positions.map((n: PositionedNode) => n.x), 0);
        const width = Math.max(360, maxX - minX + 80);
        const height = Math.max(200, (positions.length ? Math.max(...positions.map((n: PositionedNode) => n.y)) : 0) + 60);
        return (
          <div className="flex flex-col items-center overflow-x-auto w-full">
            <div className="w-fit min-w-[360px]">
              <svg width={width} height={height} style={{ background: 'none', overflow: 'visible' }}>
                {/* Edges */}
                {edges.map((edge, i) => (
                  <line
                    key={i}
                    x1={edge.from.x - minX + 40}
                    y1={edge.from.y}
                    x2={edge.to.x - minX + 40}
                    y2={edge.to.y}
                    stroke="#FDBA74" // orange-300
                    strokeWidth={3}
                  />
                ))}
                {/* Nodes */}
                {positions.map((node, i) => {
                  // Node type: root, internal, or leaf
                  const isRoot = node.index === 0;
                  const isLeaf = !items[2 * node.index + 1] && !items[2 * node.index + 2];
                  let fill = isRoot ? '#FB923C' : isLeaf ? '#FDE68A' : '#FDBA74'; // orange-500, yellow-200, orange-300
                  let stroke = isRoot ? '#EA580C' : isLeaf ? '#F59E42' : '#FDBA74';
                  return (
                    <g key={i}>
                      <circle
                        cx={node.x - minX + 40}
                        cy={node.y}
                        r={26}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isRoot ? 4 : 2}
                        filter={highlightedItem === node.index ? 'drop-shadow(0 0 8px #FACC15)' : ''}
                      />
                      <text
                        x={node.x - minX + 40}
                        y={node.y + 6}
                        textAnchor="middle"
                        fontSize="20"
                        fontFamily="monospace"
                        fill="#1C1917"
                        fontWeight="bold"
                      >
                        {node.value}
                      </text>
                      {/* Level label */}
                      <text
                        x={node.x - minX + 40}
                        y={node.y + 32}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#9A3412"
                      >
                        {isRoot ? 'Raíz' : isLeaf ? 'Hoja' : 'Hijo'}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="flex justify-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full" style={{background:'#FB923C'}}></span> Raíz</div>
              <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full" style={{background:'#FDBA74'}}></span> Hijo</div>
              <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full" style={{background:'#FDE68A'}}></span> Hoja</div>
            </div>
          </div>
        )

      case 'hash':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, bucketIndex) => {
                const bucketItems = items.filter(item => item % 10 === bucketIndex)
                return (
                  <div key={bucketIndex} className="border-2 border-gray-600 rounded-lg p-2 min-h-[50px] bg-gray-800/30">
                    <div className="text-xs text-gray-400 mb-1">B{bucketIndex}</div>
                    <div className="space-y-1">
                      {bucketItems.map((item, index) => (
                        <div
                          key={index}
                          className={`
                            bg-gradient-to-r from-indigo-500 to-indigo-600 
                            text-white p-1 rounded text-center font-mono text-xs
                            shadow transform transition-all duration-300
                            border border-indigo-400 relative
                            ${highlightedItem === index ? 'ring-2 ring-yellow-400 ring-opacity-50 scale-110' : ''}
                          `}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-600">
              <div className="text-sm text-gray-300 mb-2">
                <strong>Función Hash:</strong> f(x) = x % 10
              </div>
              <div className="text-xs text-gray-400">
                {items.length > 0 && (
                  <div className="space-y-1">
                    {items.slice(0, 3).map((item, index) => (
                      <div key={index}>
                        f({item}) = {item} % 10 = {item % 10} → B{item % 10}
                      </div>
                    ))}
                    {items.length > 3 && <div>...</div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 'heap':
        return (
          <div className="flex flex-col items-center space-y-3">
            {items.length > 0 && (
              <div className="flex items-center justify-center space-x-6">
                <div
                  className={`
                    bg-gradient-to-r from-red-500 to-red-600 
                    text-white p-3 rounded text-center font-mono
                    shadow-lg transform transition-all duration-300
                    border border-red-400 relative
                    ${highlightedItem === items[0] ? 'ring-2 ring-yellow-400 ring-opacity-50 scale-110' : ''}
                  `}
                >
                  <div className="font-bold text-sm">{items[0]}</div>
                  <div className="text-xs opacity-75">Máx</div>
                  <div className="text-xs opacity-50">Raíz</div>
                </div>
              </div>
            )}
            {items.length > 1 && (
              <div className="flex items-center justify-center space-x-3">
                {items.slice(1, 3).map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-0.5 h-6 bg-gray-400 mb-1"></div>
                    <div
                      className={`
                        bg-gradient-to-r from-red-400 to-red-500 
                        text-white p-2 rounded text-center font-mono
                        shadow-lg transform transition-all duration-300
                        border border-red-300 relative
                        ${highlightedItem === item ? 'ring-2 ring-yellow-400 ring-opacity-50 scale-110' : ''}
                      `}
                    >
                      <div className="font-bold text-sm">{item}</div>
                      <div className="text-xs opacity-75">
                        {index === 0 ? 'Izquierdo' : 'Derecho'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {items.length > 3 && (
              <div className="flex items-center justify-center space-x-3">
                {items.slice(3, 7).map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-gray-400 mb-1"></div>
                    <div
                      className={`
                        bg-gradient-to-r from-red-300 to-red-400 
                        text-white p-1.5 rounded text-center font-mono text-xs
                        shadow-lg transform transition-all duration-300
                        border border-red-200 relative
                        ${highlightedItem === item ? 'ring-2 ring-yellow-400 ring-opacity-50 scale-110' : ''}
                      `}
                    >
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 text-center">
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Máximo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span>Hijos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-300 rounded-full"></div>
                    <span>Hojas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex flex-wrap gap-2 justify-center">
            {items.map((item, index) => (
              <div
                key={index}
                className={`
                  bg-gradient-to-r from-gray-500 to-gray-600 
                  text-white p-3 rounded text-center font-mono
                  shadow-lg transform transition-all duration-300
                  border border-gray-400 relative
                  ${highlightedItem === index ? 'ring-2 ring-yellow-400 ring-opacity-50 scale-110' : ''}
                `}
              >
                <div className="font-bold text-sm">{item}</div>
                <div className="text-xs opacity-75">[{index}]</div>
              </div>
            ))}
          </div>
        )
    }
  }

  return (
    <VisualizerCard
      title={`${dataStructureSlug} Visualization`}
      description={`Interactive visualization of ${dataStructureSlug} operations`}
      actions={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 mt-1 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50">
              <MoreVertical className="w-4 h-4" />
              Acciones
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => {
                const randomItems = Array.from({length: 5}, () => Math.floor(Math.random() * 100))
                setItems(randomItems)
                setOperationHistory([`Quick Fill: Added ${randomItems.length} random elements`, ...operationHistory.slice(0, 9)])
              }}
              disabled={isAnimating}
            >
              <Zap className="w-4 h-4 mr-2 text-green-500" /> Quick Fill
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setItems([])
                setOperationHistory([])
                setCurrentStep('')
                setHighlightedItem(null)
              }}
              disabled={isAnimating}
            >
              <RotateCcw className="w-4 h-4 mr-2 text-yellow-500" /> Reset
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    >
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
        {renderVisualization()}
      </div>
      <div className="space-y-3">
        <StepDisplay currentStep={currentStep} />
        <OperationButtons
          operations={processedOperations}
          isAnimating={isAnimating}
          handleOperationClick={handleOperationClick}
          inputPanel={
            <NumberInputPanel
              inputValue={inputValue}
              setInputValue={setInputValue}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              isAnimating={isAnimating}
              onValueEnter={() => handleOperationClick('Add')}
              onSearchEnter={() => handleOperationClick('Search')}
            />
          }
        />
      </div>
    </VisualizerCard>
  )
} 