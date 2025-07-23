import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface OperationHistoryProps {
  history: string[];
  title?: string;
  maxHeight?: string;
}

export function OperationHistory({
  history,
  title = "Historial de Operaciones",
  maxHeight = "200px",
}: OperationHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3" style={{ maxHeight, overflowY: "auto" }}>
          {history.length === 0 ? (
            <div className="text-muted-foreground text-center py-4 text-sm">Aún no hay operaciones</div>
          ) : (
            history.map((operation, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm">{operation}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 