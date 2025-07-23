import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Play } from 'lucide-react'

interface OperationHistoryPanelProps {
  operationHistory: string[]
}

export function OperationHistoryPanel({ operationHistory }: OperationHistoryPanelProps) {
  return (
    <div className="w-full !max-w-none">
      <div className="w-full !max-w-none border border-border rounded-lg bg-card">
        <div className="w-full !max-w-none p-4 border-b border-border">
          <span className="font-bold text-lg">Historial de Operaciones</span>
        </div>
        <div className="w-full !max-w-none p-4">
          <div className="space-y-2 max-h-[200px] overflow-y-auto w-full !max-w-none">
            {operationHistory.length === 0 ? (
              <p className="text-muted-foreground text-center w-full !max-w-none">Aún no hay operaciones</p>
            ) : (
              operationHistory.map((operation, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded w-full !max-w-none">
                  <Play className="w-4 h-4 text-primary" />
                  <span className="text-sm w-full !max-w-none">{operation}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 