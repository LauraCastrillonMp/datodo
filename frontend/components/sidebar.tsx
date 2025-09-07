"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { apiClient } from "@/lib/api"
import { useIsMobile } from "./ui/use-mobile"
import {
  Home,
  BookOpen,
  Play,
  Trophy,
  User,
  ChevronLeft,
  ChevronRight,
  SquareStackIcon as Stack,
  List,
  Binary,
  TreePine,
  Network,
  Hash,
  X,
} from "lucide-react"

interface DataStructure {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  slug: string;
}

interface SidebarProps {
  onClose?: () => void
}

const navigation = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Perfil", href: "/profile", icon: User },
  { name: "Desafíos", href: "/challenges", icon: Trophy },
  { name: "Teoría", href: "/theory", icon: BookOpen },
  { name: "Simulador", href: "/simulator", icon: Play },
]

const iconMap = {
  stack: Stack, queue: List, linked: List, 'enlazada-simple': List, 'enlazada-doble': List, 'enlazada-circular': List,
  tree: TreePine, bst: Binary, heap: TreePine, hash: Hash, graph: Network
}

export function Sidebar({ onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [dataStructures, setDataStructures] = useState<DataStructure[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const isMobile = useIsMobile()

  useEffect(() => {
    // apiClient.getDataStructures().then(result => {
    //   if (!result.error && result.data) setDataStructures(result.data as DataStructure[])
    // }).catch(() => setDataStructures([])).finally(() => setLoading(false))}

    apiClient.getDataStructures().then(result => {
      if (!result.error && result.data) setDataStructures(
        (result.data as DataStructure[]).filter(ds => ds.title.toLowerCase().includes('colas') || ds.title.toLowerCase().includes('pilas'))
      )
    }).catch(() => setDataStructures([])).finally(() => setLoading(false))
  }, [])
  const getIcon = (title: string) => {
    const lower = title.toLowerCase()
    return Object.entries(iconMap).find(([key]) => lower.includes(key))?.[1] || List
  }

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  const renderNavItem = (item: typeof navigation[0]) => (
    <Link key={item.name} href={item.href} onClick={handleNavClick}>
      <Button
        variant={pathname === item.href ? "secondary" : "ghost"}
        className={cn("w-full", collapsed ? "justify-center px-2" : "justify-start")}
      >
        <item.icon className="h-4 w-4" />
        {!collapsed && <span>{item.name}</span>}
      </Button>
    </Link>
  )

  return (
    <div
      className={cn(
        "flex flex-col bg-card border-r border-border transition-all duration-300 h-full max-h-screen overflow-y-auto",
        collapsed ? "w-16" : "w-64",
        isMobile ? "w-64" : ""
      )}
    >
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gaming-purple rounded-lg flex items-center justify-center">
              <Binary className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Datodo</h1>
            </div>
          </div>
        )}
        <div className="flex items-center space-x-1">
          {isMobile && onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          )}
          {!isMobile && (
            <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-4 sm:space-y-6">
          {/* Navigation */}
          <div>
            {!collapsed && (
              <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navegación</h3>
            )}
            <div className="space-y-1 mt-2">
              {navigation.slice(0, 2).map(renderNavItem)}
            </div>
          </div>

          {/* Data Structures */}
          <div>
            {!collapsed && (
              <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Estructuras de Datos
              </h3>
            )}
            <div className="space-y-1 mt-2">
              {loading ? (
                <div className="px-2 py-1">
                  <div className="animate-pulse bg-muted h-8 rounded"></div>
                </div>
              ) : (
                dataStructures.map((structure) => {
                  const IconComponent = getIcon(structure.title)
                  return (
                    <Link key={structure.id} href={`/structures/${structure.slug}`} onClick={handleNavClick}>
                      <Button
                        variant={pathname === `/structures/${structure.slug}` ? "secondary" : "ghost"}
                        className={cn("w-full", collapsed ? "justify-center p-2" : "justify-start")}
                      >
                        <IconComponent className="h-4 w-4" />
                        {!collapsed && <span>{structure.title}</span>}
                      </Button>
                    </Link>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
