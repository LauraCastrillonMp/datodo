import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";

interface StructureTabsProps {
  theory: ReactNode;
  visualizer: ReactNode;
  challenges: ReactNode;
}

export function StructureTabs({
  theory,
  visualizer,
  challenges,
}: StructureTabsProps) {
  return (
    <Tabs defaultValue="theory" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3 h-auto p-1">
        <TabsTrigger value="theory" className="text-xs sm:text-sm py-2 px-3">
          Teoría
        </TabsTrigger>
        <TabsTrigger
          value="visualizer"
          className="text-xs sm:text-sm py-2 px-3"
        >
          Visualizador
        </TabsTrigger>

        <TabsTrigger
          value="challenges"
          className="text-xs sm:text-sm py-2 px-3"
        >
          Desafíos
        </TabsTrigger>
      </TabsList>
      <TabsContent value="theory" className="space-y-4">
        {theory}
      </TabsContent>
      <TabsContent value="visualizer" className="space-y-4">
        {visualizer}
      </TabsContent>
      <TabsContent value="challenges" className="space-y-4">
        {challenges}
      </TabsContent>
    </Tabs>
  );
}
