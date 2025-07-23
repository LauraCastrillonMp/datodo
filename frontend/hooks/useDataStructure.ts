import { useState, useEffect, useMemo, useCallback } from 'react'
import { apiClient } from '@/lib/api'

interface DataStructureContent {
  id: number;
  contentType: 'general' | 'property' | 'operation' | 'application' | 'resource';
  format: 'text' | 'video' | 'image' | 'link';
  category?: string;
  name: string;
  description?: string;
  complexity?: string;
}

interface DataStructure {
  id: number;
  slug: string;
  title: string;
  description: string;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  createdAt: string;
  updatedAt: string;
  contents: DataStructureContent[];
  creator: {
    id: number;
    name: string;
    username: string;
  };
}

export function useDataStructure(slug: string) {
  const [dataStructure, setDataStructure] = useState<DataStructure | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDataStructure = useCallback(async (currentSlug: string) => {
    if (!currentSlug) return

    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.getDataStructureBySlug(currentSlug)
      
      if (result.error) {
        setError(result.error)
        setDataStructure(null)
      } else if (result.data) {
        setDataStructure(Array.isArray(result.data) ? result.data[0] : result.data)
      } else {
        setError('Estructura de datos no encontrada')
        setDataStructure(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la estructura de datos')
      setDataStructure(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    if (slug) {
      fetchDataStructure(slug).then(() => {
        // Only update state if component is still mounted
        if (!isMounted) return
      })
    } else {
      setLoading(false)
      setError(null)
      setDataStructure(null)
    }

    return () => {
      isMounted = false
    }
  }, [slug, fetchDataStructure])

  const contentByType = useMemo(() => {
    if (!dataStructure?.contents) return {}
    
    return dataStructure.contents.reduce((acc, content) => {
      if (!acc[content.contentType]) acc[content.contentType] = []
      acc[content.contentType].push(content)
      return acc
    }, {} as Record<string, DataStructureContent[]>)
  }, [dataStructure?.contents])

  const getContentByType = useCallback((contentType: DataStructureContent['contentType']) => 
    contentByType[contentType] || [], [contentByType])

  const retry = useCallback(() => {
    if (slug) {
      fetchDataStructure(slug)
    }
  }, [slug, fetchDataStructure])

  return {
    dataStructure,
    loading,
    error,
    retry,
    getContentByType,
    getGeneralContent: () => getContentByType('general'),
    getProperties: () => getContentByType('property'),
    getOperations: () => getContentByType('operation'),
    getApplications: () => getContentByType('application'),
    getResources: () => getContentByType('resource')
  }
} 