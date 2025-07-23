"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"
import { Moon, Sun, Settings, LogOut, User, Menu } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useIsMobile } from "./ui/use-mobile"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { setTheme, theme } = useTheme()
  const { userProfile, signOut } = useAuth()
  const router = useRouter()
  const isMobile = useIsMobile()

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between flex-wrap px-3 sm:px-4 md:px-6 py-3 gap-2 sm:gap-0">
        <div className="flex items-center space-x-2">
          {isMobile && onMenuClick && (
            <Button variant="ghost" size="sm" onClick={onMenuClick} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Inicio</span>
            <span>/</span>
            <span>Estructuras de Datos</span>
          </div>
          <div className="sm:hidden text-sm text-muted-foreground">
            <span>DataStruct</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-gaming-purple">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User avatar" />
                  <AvatarFallback className="text-xs sm:text-sm">{userProfile?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm">{userProfile?.name || userProfile?.username}</p>
                  <p className="w-[200px] truncate text-xs text-muted-foreground">{userProfile?.email}</p>
                </div>
              </div>
              <DropdownMenuItem asChild>
                <a href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </a>
              </DropdownMenuItem>
              {userProfile?.role === "admin" && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <span className="flex items-center">
                      <span className="mr-2">🏛️</span> Panel de Administración
                    </span>
                  </Link>
                </DropdownMenuItem>
              )}
              {userProfile?.role === "teacher" && (
                <DropdownMenuItem asChild>
                  <Link href="/teacher">
                    <span className="flex items-center">
                      <span className="mr-2">📚</span> Panel del Profesor
                    </span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
