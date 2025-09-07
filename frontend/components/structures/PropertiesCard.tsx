import { Badge } from '@/components/ui/badge'
import { Target } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface PropertyContent {
  id: number
  name: string
  description?: string
  complexity?: string
}

interface PropertiesCardProps {
  properties: PropertyContent[]
}

export function PropertiesCard({ properties }: PropertiesCardProps) {
  return (
    <Card className="w-full !max-w-none">
      <CardHeader className="w-full !max-w-none">
        <CardTitle className="flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Propiedades
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full !max-w-none">
        {properties.length > 0 ? (
          <dl className="divide-y divide-muted w-full">
            {properties.map((content) => (
              <div key={content.id} className="py-4 w-full">
                <dt className="font-semibold flex items-center gap-2 w-full">
                  {content.name}
                  {/* {content.complexity && (
                    <Badge variant="outline" className="ml-2">{content.complexity}</Badge>
                  )} */}
                </dt>
                <dd className="prose max-w-none mt-1 w-full" dangerouslySetInnerHTML={{ __html: content.description || '' }} />
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-muted-foreground w-full">No hay propiedades disponibles para esta estructura de datos.</p>
        )}
      </CardContent>
    </Card>
  )
} 