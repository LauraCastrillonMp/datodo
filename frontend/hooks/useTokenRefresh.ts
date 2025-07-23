import { useEffect, useRef } from 'react'
import { apiClient } from '@/lib/api'

export const useTokenRefresh = (enabled = true) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!enabled) return

    intervalRef.current = setInterval(
      () => apiClient.refreshToken().catch(() => {}),
      4 * 60 * 1000 // 4 minutes
    )

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled])
} 