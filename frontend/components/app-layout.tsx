"use client"

import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { PageLoadingSpinner } from "./loading-spinner"
import { Button } from "./ui/button"
import { ArrowLeft, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useIsMobile } from "./ui/use-mobile"

const publicRoutes = ['/landing', '/auth/login', '/auth/register', '/auth/forgot', '/auth/reset', '/test-auth', '/debug-auth']

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, initialized } = useAuth()
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Only treat as public route if not authenticated and on a public route
  const isPublicRoute = !user && (pathname === '/' || publicRoutes.some(route => pathname.startsWith(route)))

  // Debug logging
  console.log('🔧 AppLayout Debug:', {
    user: !!user,
    loading,
    initialized,
    pathname,
    isPublicRoute,
    isMobile,
    sidebarOpen,
    userDetails: user ? { id: user.id, username: user.username, role: user.role } : null
  })

  // For unauthenticated users on public routes, show content without layout
  if (isPublicRoute) {
    console.log('🌐 AppLayout: Showing public route without layout')
    return <div>{children}</div>
  }

  // Only show spinner for protected routes or authenticated users
  if (!initialized || loading) {
    console.log('⏳ AppLayout: Showing loading spinner')
    return <PageLoadingSpinner text="Inicializando..." />
  }

  // For authenticated users, always show the full layout with sidebar and header
  if (user) {
    console.log('✅ AppLayout: Showing authenticated layout with sidebar and header')
    return (
      <div className="flex min-h-screen h-screen bg-background">
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        `}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 w-full">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background w-full max-w-none">
            {children}
          </main>
        </div>
      </div>
    )
  }

  // For unauthenticated users on protected routes, show auth required message
  console.log('🔒 AppLayout: Showing auth required message')
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-red-600">Autenticación requerida</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Debes iniciar sesión para acceder a esta página.</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/auth/login" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Ir al login</Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
