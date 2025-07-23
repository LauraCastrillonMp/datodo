import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Minus, Search, RefreshCw } from 'lucide-react'
import { ReactNode } from 'react'

interface Operation {
  id: number
  name: string
  description?: string
  complexity?: string
  icon: ReactNode
}

interface OperationButtonsProps {
  operations: Operation[]
  isAnimating: boolean
  handleOperationClick: (name: string) => void
  inputPanel?: ReactNode
}

export function OperationButtons({
  operations,
  isAnimating,
  handleOperationClick,
  inputPanel
}: OperationButtonsProps) {
  return (
    <div className="space-y-4">
      {inputPanel}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {operations.map((operation) => (
          <Button
            key={operation.id}
            onClick={() => handleOperationClick(operation.name)}
            disabled={isAnimating}
            className="text-xs sm:text-sm h-auto py-2 px-3 sm:py-3 sm:px-4"
            variant="outline"
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-4 h-4 sm:w-5 sm:h-5">
                {operation.icon}
              </div>
              <span className="text-center leading-tight">{operation.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}

function getOperationIcon(operationName: string): ReactNode {
  const operation = operationName.toLowerCase()
  if (operation.includes('insert') || operation.includes('add') || operation.includes('push') || 
      operation.includes('enqueue') || operation.includes('append') || operation.includes('set')) {
    return <Plus className="w-4 h-4" />
  } else if (operation.includes('delete') || operation.includes('remove') || operation.includes('pop') || 
             operation.includes('dequeue') || operation.includes('extract') || operation.includes('unset')) {
    return <Minus className="w-4 h-4" />
  } else if (operation.includes('search') || operation.includes('find') || operation.includes('lookup') || 
             operation.includes('peek') || operation.includes('get') || operation.includes('contains')) {
    return <Search className="w-4 h-4" />
  } else if (operation.includes('clear') || operation.includes('empty')) {
    return <RefreshCw className="w-4 h-4" />
  } else {
    return <Plus className="w-4 h-4" />
  }
} 