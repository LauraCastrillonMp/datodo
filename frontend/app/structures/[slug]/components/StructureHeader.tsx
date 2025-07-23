import { Badge } from '@/components/ui/badge'
import { User, Clock } from 'lucide-react'

interface StructureHeaderProps {
  title: string
  description: string
  difficulty: string
  creatorName: string
  updatedAt: string | Date
  getDifficultyColor: (difficulty: string) => string
  getDifficultyText: (difficulty: string) => string
}

export function StructureHeader({
  title,
  description,
  difficulty,
  creatorName,
  updatedAt,
  getDifficultyColor,
  getDifficultyText
}: StructureHeaderProps) {
  return (
    <div className="space-y-4 p-4 sm:p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{title}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={`${getDifficultyColor(difficulty)} text-white text-xs`}>
              {getDifficultyText(difficulty)}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Creado por {creatorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Actualizado {new Date(updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 