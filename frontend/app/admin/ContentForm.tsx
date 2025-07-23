"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Eye } from "lucide-react";

const contentTypes = [
  { label: "Teoría General", value: "general" },
  { label: "Propiedades", value: "property" },
  { label: "Operaciones", value: "operation" },
  { label: "Aplicaciones", value: "application" },
  { label: "Recursos", value: "resource" },
  { label: "Ejemplos", value: "example" },
  { label: "Implementación", value: "implementation" },
];

const formats = [
  { label: "Texto", value: "text" },
  { label: "Video", value: "video" },
  { label: "Imagen", value: "image" },
  { label: "Enlace", value: "link" },
  { label: "Código", value: "code" },
  { label: "PDF", value: "pdf" },
];

interface ContentFormProps {
  dataStructureId?: number;
  initial?: {
    id?: number;
    name?: string;
    contentType?: string;
    format?: string;
    value?: string;
    description?: string;
    order?: number;
  };
  onSubmit: (values: {
    name: string;
    contentType: string;
    format: string;
    value: string;
    description: string;
    order: number;
  }) => void;
  onCancel: () => void;
}

export default function ContentForm({ dataStructureId, initial, onSubmit, onCancel }: ContentFormProps) {
  const [name, setName] = useState(initial?.name || "");
  const [contentType, setContentType] = useState(initial?.contentType || contentTypes[0].value);
  const [format, setFormat] = useState(initial?.format || formats[0].value);
  const [value, setValue] = useState(initial?.value || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [order, setOrder] = useState(initial?.order || 1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ name, contentType, format, value, description, order });
    setLoading(false);
  };

  const getFormatPlaceholder = () => {
    switch (format) {
      case 'text':
        return "Escribe el contenido textual aquí...";
      case 'video':
        return "URL del video (YouTube, Vimeo, etc.)";
      case 'image':
        return "URL de la imagen o descripción";
      case 'link':
        return "URL del recurso externo";
      case 'code':
        return "Código de ejemplo...";
      case 'pdf':
        return "URL del archivo PDF";
      default:
        return "Contenido...";
    }
  };

  const getFormatInstructions = () => {
    switch (format) {
      case 'text':
        return "Escribe el contenido educativo en formato texto. Puedes usar markdown para formateo.";
      case 'video':
        return "Pega la URL completa del video. Asegúrate de que sea accesible públicamente.";
      case 'image':
        return "Proporciona la URL de la imagen o una descripción detallada de la imagen.";
      case 'link':
        return "URL del recurso externo que quieres compartir.";
      case 'code':
        return "Escribe el código de ejemplo con comentarios explicativos.";
      case 'pdf':
        return "URL del archivo PDF que quieres compartir.";
      default:
        return "";
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {initial?.id ? "Editar Contenido" : "Crear Nuevo Contenido"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Nombre del Contenido</label>
              <Input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                placeholder="Ej: Introducción a Pilas"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Orden de Visualización</label>
              <Input 
                type="number"
                value={order} 
                onChange={e => setOrder(parseInt(e.target.value) || 1)} 
                min={1}
                placeholder="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Tipo de Contenido</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={contentType}
                onChange={e => setContentType(e.target.value)}
                required
              >
                {contentTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Formato</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={format}
                onChange={e => setFormat(e.target.value)}
                required
              >
                {formats.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Descripción</label>
            <Textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Describe brevemente el contenido..."
              rows={2}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Contenido</label>
            {format === 'text' || format === 'code' ? (
              <Textarea
                value={value} 
                onChange={e => setValue(e.target.value)} 
                required 
                placeholder={getFormatPlaceholder()}
                rows={format === 'code' ? 10 : 6}
                className={format === 'code' ? 'font-mono' : ''}
              />
            ) : (
              <Input
                value={value} 
                onChange={e => setValue(e.target.value)} 
                required 
                placeholder={getFormatPlaceholder()}
              />
            )}
            {getFormatInstructions() && (
              <p className="text-sm text-gray-600 mt-1">{getFormatInstructions()}</p>
            )}
          </div>

          {/* Vista previa */}
          {value && (
            <div className="border rounded p-4 bg-gray-50">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Vista Previa
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{contentType}</Badge>
                  <Badge variant="outline">{format}</Badge>
                  {order > 1 && <Badge variant="outline">Orden: {order}</Badge>}
                </div>
                {format === 'text' && (
                  <div className="prose prose-sm max-w-none">
                    <p>{value}</p>
                  </div>
                )}
                {format === 'code' && (
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                    <code>{value}</code>
                  </pre>
                )}
                {(format === 'video' || format === 'link' || format === 'image' || format === 'pdf') && (
                  <div className="text-blue-600 hover:underline">
                    <a href={value} target="_blank" rel="noopener noreferrer">
                      {value}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : initial?.id ? "Guardar Cambios" : "Crear Contenido"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 