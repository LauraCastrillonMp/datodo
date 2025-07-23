"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  FileText, 
  Edit, 
  Trash2, 
  Eye, 
  Plus, 
  Clock,
  ExternalLink
} from "lucide-react";
import { apiClient } from "@/lib/api";
import ContentForm from "@/app/admin/ContentForm";

interface Content {
  id: number;
  name: string;
  contentType: string;
  format: string;
  value: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface ContentManagerProps {
  dataStructureId: number;
  dataStructureTitle: string;
  onContentUpdated: () => void;
}

export default function ContentManager({ dataStructureId, dataStructureTitle, onContentUpdated }: ContentManagerProps) {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showContentDetail, setShowContentDetail] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [dataStructureId]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching content for structure:', dataStructureId);
      const response = await apiClient.getDataStructureContent(dataStructureId);
      console.log('📊 Content response:', response);

      let contentArray: Content[] = [];
      if (Array.isArray(response.data)) {
        contentArray = response.data;
      } else if (
        response.data &&
        typeof response.data === 'object' &&
        !Array.isArray(response.data)
      ) {
        const dataObj = response.data as Record<string, unknown>;
        if (Array.isArray(dataObj['content'])) {
          contentArray = dataObj['content'];
        } else if (Array.isArray(dataObj['items'])) {
          contentArray = dataObj['items'];
        } else {
          // Si no hay array, loguea el objeto recibido
          console.warn('⚠️ Respuesta inesperada del backend:', response.data);
        }
      } else {
        console.warn('⚠️ Respuesta inesperada del backend:', response.data);
      }

      setContent(contentArray);
      console.log('✅ Content array set:', contentArray);
    } catch (error) {
      console.error('❌ Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContent = async (values: any) => {
    try {
      await apiClient.createContent(dataStructureId, values);
      setShowCreate(false);
      fetchContent();
      onContentUpdated();
    } catch (error) {
      console.error('Error creating content:', error);
    }
  };

  const handleEditContent = async (values: any) => {
    if (!editingContent) return;
    try {
      await apiClient.updateContent(dataStructureId, editingContent.id, values);
      setEditingContent(null);
      fetchContent();
      onContentUpdated();
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleDeleteContent = async (contentId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este contenido?")) {
      try {
        await apiClient.deleteContent(dataStructureId, contentId);
        fetchContent();
        onContentUpdated();
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'general': return 'bg-blue-100 text-blue-800';
      case 'property': return 'bg-green-100 text-green-800';
      case 'operation': return 'bg-purple-100 text-purple-800';
      case 'application': return 'bg-orange-100 text-orange-800';
      case 'resource': return 'bg-indigo-100 text-indigo-800';
      case 'example': return 'bg-pink-100 text-pink-800';
      case 'implementation': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video': return '🎥';
      case 'image': return '🖼️';
      case 'link': return '🔗';
      case 'code': return '💻';
      case 'pdf': return '📄';
      default: return '📝';
    }
  };

  const renderContentPreview = (content: Content) => {
    const safeValue = typeof content.value === 'string' ? content.value : content.value ? JSON.stringify(content.value) : "";
    switch (content.format) {
      case 'text':
        return (
          <div className="prose prose-sm max-w-none">
            <p>{safeValue.substring(0, 200)}...</p>
          </div>
        );
      case 'code':
        return (
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            <code>{safeValue.substring(0, 200)}...</code>
          </pre>
        );
      case 'link':
      case 'video':
      case 'image':
      case 'pdf':
        return (
          <div className="text-blue-600 hover:underline">
            <a href={safeValue} target="_blank" rel="noopener noreferrer">
              {safeValue}
            </a>
          </div>
        );
      default:
        return <p className="text-gray-600">{safeValue}</p>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Contenido de {dataStructureTitle}</h3>
          <p className="text-sm text-gray-600">
            Gestiona el contenido educativo para esta estructura de datos
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Contenido
        </Button>
      </div>

      {showCreate && (
        <ContentForm
          dataStructureId={dataStructureId}
          onSubmit={handleCreateContent}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {editingContent && (
        <ContentForm
          dataStructureId={dataStructureId}
          initial={editingContent}
          onSubmit={handleEditContent}
          onCancel={() => setEditingContent(null)}
        />
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Formato</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Vista Previa</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8}>Cargando contenido...</TableCell>
                </TableRow>
              ) : content.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>No hay contenido para esta estructura.</TableCell>
                </TableRow>
              ) : (
                content.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="outline">{item.order}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge className={getContentTypeColor(item.contentType)}>
                        {item.contentType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{getFormatIcon(item.format)}</span>
                        <span className="text-sm">{item.format}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.description || 'Sin descripción'}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="max-h-20 overflow-hidden">
                        {renderContentPreview(item)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedContent(item);
                            setShowContentDetail(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingContent(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteContent(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showContentDetail} onOpenChange={setShowContentDetail}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {selectedContent?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tipo de Contenido</p>
                  <Badge className={getContentTypeColor(selectedContent.contentType)}>
                    {selectedContent.contentType}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Formato</p>
                  <div className="flex items-center gap-1">
                    <span>{getFormatIcon(selectedContent.format)}</span>
                    <span>{selectedContent.format}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Orden</p>
                  <Badge variant="outline">{selectedContent.order}</Badge>
                </div>
              </div>

              {selectedContent.description && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Descripción</p>
                  <p className="text-sm text-gray-600">{selectedContent.description}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium">Contenido</p>
                <div className="border rounded p-4 bg-gray-50">
                  {(() => {
                    const safeValue = typeof selectedContent.value === 'string' ? selectedContent.value : selectedContent.value ? JSON.stringify(selectedContent.value) : "";
                    return (
                      <>
                        {selectedContent.format === 'text' && (
                          <div className="prose prose-sm max-w-none">
                            <p>{safeValue}</p>
                          </div>
                        )}
                        {selectedContent.format === 'code' && (
                          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                            <code>{safeValue}</code>
                          </pre>
                        )}
                        {(selectedContent.format === 'video' || selectedContent.format === 'link' || selectedContent.format === 'image' || selectedContent.format === 'pdf') && (
                          <div className="space-y-2">
                            <div className="text-blue-600 hover:underline">
                              <a href={safeValue} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                {safeValue}
                              </a>
                            </div>
                            {selectedContent.format === 'video' && (
                              <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                                <p className="text-gray-600">Vista previa del video</p>
                              </div>
                            )}
                            {selectedContent.format === 'image' && (
                              <img 
                                src={safeValue} 
                                alt={selectedContent.name}
                                className="max-w-full h-auto rounded"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
