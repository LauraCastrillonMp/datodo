import { Badge } from "@/components/ui/badge";

interface Property {
  label: string;
  value: React.ReactNode;
  badge?: boolean;
  badgeVariant?: "default" | "outline" | "secondary" | "destructive";
}

interface PropertiesCardProps {
  title?: string;
  properties: Property[];
}

export function PropertiesCard({
  title = "Propiedades",
  properties,
}: PropertiesCardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{title}</div>
      </div>
      <div className="card-content">
        <div className="space-y-3">
          {properties.map((prop, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span>{prop.label}</span>
              {prop.badge ? (
                <Badge variant={prop.badgeVariant || "outline"}>{prop.value}</Badge>
              ) : (
                <span className="font-mono">{prop.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 