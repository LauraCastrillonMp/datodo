import { ReactNode } from 'react'
import { VisualizerCard } from '@/components/structures/VisualizerCard'
import { OperationHistoryPanel } from '@/components/structures/OperationHistoryPanel'
import { StructureStatistics } from '@/components/structures/StructureStatistics'
import { PropertiesCard } from '@/components/structures/PropertiesCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Zap } from 'lucide-react'

interface VisualizerTabProps {
  dataStructureSlug: string
  renderVisualization: () => ReactNode
  currentStep: string
  keyboardShortcutsEnabled: boolean
  setKeyboardShortcutsEnabled: (v: boolean) => void
  operations: any[]
  isAnimating: boolean
  handleOperationClick: (op: string) => void
  inputValue: string
  setInputValue: (v: string) => void
  searchValue: string
  setSearchValue: (v: string) => void
  operationHistory: string[]
  items: number[]
  setItems: (v: number[]) => void
  setOperationHistory: (v: string[]) => void
  setCurrentStep: (v: string) => void
  setHighlightedItem: (v: number | null) => void
  showHelp: boolean
  setShowHelp: (v: boolean) => void
  NumberInputPanel: ReactNode
  OperationButtons: ReactNode
  StepDisplay: ReactNode
  getStructureType: () => string
  properties: any[]
  operationsContent: any[]
}

export function VisualizerTab({
  dataStructureSlug,
  renderVisualization,
  currentStep,
  keyboardShortcutsEnabled,
  setKeyboardShortcutsEnabled,
  operations,
  isAnimating,
  handleOperationClick,
  inputValue,
  setInputValue,
  searchValue,
  setSearchValue,
  operationHistory,
  items,
  setItems,
  setOperationHistory,
  setCurrentStep,
  setHighlightedItem,
  showHelp,
  setShowHelp,
  NumberInputPanel,
  OperationButtons,
  StepDisplay,
  getStructureType,
  properties,
  operationsContent
}: VisualizerTabProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[2000px] w-full flex flex-col gap-6">
        <VisualizerCard
          title={dataStructureSlug + ' Visualization'}
          description={`Interactive visualization of ${dataStructureSlug}`}
          actions={null}
        >
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
            {renderVisualization()}
          </div>
          <div className="space-y-3">
            {StepDisplay}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="keyboard-shortcuts-toggle"
                checked={keyboardShortcutsEnabled}
                onChange={e => setKeyboardShortcutsEnabled(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="keyboard-shortcuts-toggle" className="text-sm select-none cursor-pointer">
                Atajos de teclado
              </label>
            </div>
            {OperationButtons}
          </div>
        </VisualizerCard>
        <OperationHistoryPanel operationHistory={operationHistory} />
        <StructureStatistics items={items} operationHistory={operationHistory} getStructureType={getStructureType} />
        <PropertiesCard properties={properties} />
        <div className="w-full min-w-[2000px] border border-border rounded-lg bg-card mb-6">
          <div className="w-full p-4 border-b border-border flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <span className="font-bold text-lg">Operaciones</span>
          </div>
          <div className="w-full p-4">
            {operationsContent.length > 0 ? (
              <div className="space-y-4 w-full">
                {operationsContent.map((content: any) => (
                  <div key={content.id} className="space-y-2 w-full">
                    <h4 className="font-semibold">{content.name}</h4>
                    {content.complexity && (
                      <span className="mb-2 inline-block border rounded px-2 py-0.5 text-xs">Complejidad: {content.complexity}</span>
                    )}
                    <div className="prose max-w-none w-full" dangerouslySetInnerHTML={{ __html: content.description || '' }} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground w-full">No hay operaciones disponibles para esta estructura.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 