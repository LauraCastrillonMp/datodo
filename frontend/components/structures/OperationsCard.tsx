import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function OperationsCard({ operations }: { operations: any[] }) {
  return (
    <Card className="w-full !max-w-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Zap className="w-5 h-5" />
          Operaciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        {operations.length > 0 ? (
          <div className="space-y-4">
            {operations.map((operation: any) => (
              <div key={operation.id} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-semibold text-sm sm:text-base">
                    {operation.name}
                  </h4>
                  {operation.complexity && (
                    <Badge variant="outline" className="text-xs">
                      {operation.complexity}
                    </Badge>
                  )}
                </div>
                <div
                  className="prose max-w-none text-sm"
                  dangerouslySetInnerHTML={{
                    __html: operation.description || "",
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No hay operaciones disponibles para esta estructura.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
