import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Play, ExternalLink } from 'lucide-react'

interface TheoryTabProps {
  generalContent: any[]
  applications: any[]
  resources: any[]
}

export function TheoryTab({ generalContent, applications, resources }: TheoryTabProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* General Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <BookOpen className="w-5 h-5" />
              Descripción General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {generalContent.length > 0 ? (
              generalContent.map((content) => (
                <div key={content.id}>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">{content.name}</h4>
                  <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: content.description || '' }} />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No hay información general disponible.</p>
            )}
            <Button className="w-full text-sm sm:text-base">
              <Play className="w-4 h-4 mr-2" />
              Ver Animación
            </Button>
          </CardContent>
        </Card>

        {/* Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Play className="w-5 h-5" />
              Aplicaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((content) => (
                  <div key={content.id}>
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">{content.name}</h4>
                    <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: content.description || '' }} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No hay aplicaciones disponibles.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <ExternalLink className="w-5 h-5" />
            Recursos Adicionales
          </CardTitle>
        </CardHeader>
        <CardContent>
          {resources.length > 0 ? (
            <div className="space-y-4">
              {resources.map((content) => (
                <div key={content.id}>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">{content.name}</h4>
                  {content.format === 'link' && content.description ? (
                    <a 
                      href={content.description} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm"
                    >
                      {content.name}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: content.description || '' }} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No hay recursos adicionales disponibles.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 