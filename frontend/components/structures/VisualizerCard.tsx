import { ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface VisualizerCardProps {
  title: string
  description: string
  actions: ReactNode
  children: ReactNode
}

export function VisualizerCard({ title, description, actions, children }: VisualizerCardProps) {
  return (
    <Card className="space-y-4 w-full mx-auto">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 w-full">
          <div className="space-y-1 w-full">
            <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
          {actions && (
            <div className="flex-shrink-0 w-full sm:w-auto flex justify-end sm:justify-center">
              {actions}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 w-full">
        {children}
      </CardContent>
    </Card>
  )
} 