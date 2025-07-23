"use client"

import { useEffect, useState } from "react"
import { PageLoadingSpinner } from "./loading-spinner"

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return <PageLoadingSpinner text="Inicializando..." />
  }

  return <>{children}</>
} 