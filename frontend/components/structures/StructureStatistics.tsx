import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart2 } from 'lucide-react'

interface StructureStatisticsProps {
  items: number[]
  operationHistory: string[]
  getStructureType: () => string
}

export function StructureStatistics({ items, operationHistory, getStructureType }: StructureStatisticsProps) {
  return (
    <Card className="w-full !max-w-none">
      <CardHeader className="w-full !max-w-none">
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5" />
          Estadísticas
        </CardTitle>
        <CardDescription>
          Estado actual y métricas de rendimiento
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full !max-w-none">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Elementos:</span>
              <span className="font-mono text-sm">{items.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Uso de Memoria:</span>
              <span className="font-mono text-sm">~{items.length * 8} bytes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Operaciones:</span>
              <span className="font-mono text-sm">{operationHistory.length}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Estado:</span>
              <Badge variant={items.length === 0 ? "destructive" : "default"} className="text-xs">
                {items.length === 0 ? "Vacía" : "Activa"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tipo:</span>
              <span className="font-mono text-sm capitalize">{getStructureType()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Última Op.:</span>
              <span className="font-mono text-xs text-muted-foreground">
                {operationHistory.length > 0 ? operationHistory[0].split(':')[0] : 'Ninguna'}
              </span>
            </div>
          </div>
        </div>
        {items.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="text-sm text-muted-foreground mb-2">Indicadores de Rendimiento:</div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Tiempo de Acceso:</span>
                <span className="text-xs font-mono">
                  {getStructureType() === 'stack' || getStructureType() === 'queue' ? 'O(1)' : 'O(n)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Inserción:</span>
                <span className="text-xs font-mono">
                  {getStructureType() === 'stack' || getStructureType() === 'queue' ? 'O(1)' : 'O(n)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Eliminación:</span>
                <span className="text-xs font-mono">
                  {getStructureType() === 'stack' || getStructureType() === 'queue' ? 'O(1)' : 'O(n)'}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 