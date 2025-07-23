import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReactNode } from 'react'

interface StructureTabsProps {
  visualizer: ReactNode
  theory: ReactNode
  challenges: ReactNode
}

export function StructureTabs({ visualizer, theory, challenges }: StructureTabsProps) {
  return (
    <Tabs defaultValue="visualizer" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3 h-auto p-1">
        <TabsTrigger value="visualizer" className="text-xs sm:text-sm py-2 px-3">
          Visualizador
        </TabsTrigger>
        <TabsTrigger value="theory" className="text-xs sm:text-sm py-2 px-3">
          Teoría
        </TabsTrigger>
        <TabsTrigger value="challenges" className="text-xs sm:text-sm py-2 px-3">
          Desafíos
        </TabsTrigger>
      </TabsList>
      <TabsContent value="visualizer" className="space-y-4">
        {visualizer}
      </TabsContent>
      <TabsContent value="theory" className="space-y-4">
        {theory}
      </TabsContent>
      <TabsContent value="challenges" className="space-y-4">
        {challenges}
      </TabsContent>
    </Tabs>
  )
} 