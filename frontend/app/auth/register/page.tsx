"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Code, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "@/lib/toast"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signUp } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [usernameTouched, setUsernameTouched] = useState(false)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  // Validation helpers
  const isEmailValid = email.length === 0 || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
  const isPasswordValid = password.length === 0 || password.length >= 6
  const isUsernameValid = username.length === 0 || username.length >= 3

  // Password strength
  const getPasswordStrength = (pwd: string) => {
    if (pwd.length < 6) return 0;
    let score = 0;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  }
  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    let didFinish = false;
    const fallbackTimeout = setTimeout(() => {
      if (!didFinish) {
        setError("No se pudo conectar. Intenta de nuevo.")
        setPassword("")
        setIsLoading(false)
        toast.error("No se pudo conectar. Intenta de nuevo.")
      }
    }, 3000)
    try {
      const result = await signUp(email, password, username)
      didFinish = true;
      clearTimeout(fallbackTimeout);
      if (result.error) {
        let errorMsg = typeof result.error === 'string' ? result.error : (result.error && result.error.message) || 'Error en el registro';
        setError(errorMsg)
        setIsLoading(false)
        toast.error(errorMsg)
        if (passwordInputRef.current) passwordInputRef.current.focus();
      } else {
        toast.success("¡Registro exitoso! Redirigiendo...")
        router.push("/")
      }
    } catch (err) {
      didFinish = true;
      clearTimeout(fallbackTimeout);
      setError("Error inesperado. Intenta de nuevo.")
      setIsLoading(false)
      toast.error("Error inesperado. Intenta de nuevo.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side: Branding */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-purple-600 to-blue-600 text-white p-12 relative">
        <div className="absolute top-8 left-8 flex items-center space-x-2">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <Code className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold">DataStruct Academy</span>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
          <h1 className="text-4xl font-bold leading-tight">Únete a la Academia</h1>
          <p className="text-lg text-purple-100 max-w-md">
            Comienza tu camino para dominar las estructuras de datos con aprendizaje interactivo y gamificación.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3 text-purple-100">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Aprendizaje interactivo</span>
            </div>
            <div className="flex items-center space-x-3 text-purple-100">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Simulaciones visuales</span>
            </div>
            <div className="flex items-center space-x-3 text-purple-100">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Seguimiento del progreso</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-8 text-purple-200 text-xs">&copy; 2024 DataStruct Academy</div>
      </div>

      {/* Right Side: Register Form */}
      <div className="flex flex-1 items-center justify-center bg-background p-6 relative">
        {/* Back to Home Button */}
        <Link href="/" className="absolute top-6 left-6">
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Button>
        </Link>
        
        <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Crear cuenta</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Ingrese su información para comenzar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Introduce tu nombre de usuario"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  if (error) setError("")
                }}
                onBlur={() => setUsernameTouched(true)}
                required
                className={
                  "text-sm sm:text-base" +
                  (!isUsernameValid && (usernameTouched || username.length > 0)
                    ? " border-red-500 focus:border-red-500"
                    : "")
                }
              />
              {!isUsernameValid && (usernameTouched || username.length > 0) && (
                <p className="text-xs text-red-500 mt-1">El nombre de usuario debe tener al menos 3 caracteres.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="Introduce tu correo electrónico"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError("")
                }}
                onBlur={() => setEmailTouched(true)}
                required
                className={
                  "text-sm sm:text-base" +
                  (!isEmailValid && (emailTouched || email.length > 0)
                    ? " border-red-500 focus:border-red-500"
                    : "")
                }
              />
              {!isEmailValid && (emailTouched || email.length > 0) && (
                <p className="text-xs text-red-500 mt-1">Introduce un correo electrónico válido.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Introduce tu contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError("")
                  }}
                  onBlur={() => setPasswordTouched(true)}
                  required
                  className={
                    "text-sm sm:text-base" +
                    (!isPasswordValid && (passwordTouched || password.length > 0)
                      ? " border-red-500 focus:border-red-500"
                      : "")
                  }
                  ref={passwordInputRef}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-2.364A9.956 9.956 0 0022 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.636-1.364" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.828-2.828A9.956 9.956 0 0022 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.21.896-4.21 2.343-5.657" /></svg>
                  )}
                </button>
              </div>
              {/* Password strength meter */}
              {password.length > 0 && (
                <div className="flex items-center mt-1 space-x-2">
                  <div className="flex-1 h-2 rounded bg-gray-200 overflow-hidden">
                    <div
                      className={
                        "h-2 rounded transition-all " +
                        (passwordStrength === 0
                          ? "bg-red-400 w-1/5"
                          : passwordStrength === 1
                          ? "bg-orange-400 w-2/5"
                          : passwordStrength === 2
                          ? "bg-yellow-400 w-3/5"
                          : passwordStrength === 3
                          ? "bg-blue-400 w-4/5"
                          : "bg-green-500 w-full")
                      }
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {passwordStrength === 0
                      ? "Débil"
                      : passwordStrength === 1
                      ? "Débil"
                      : passwordStrength === 2
                      ? "Regular"
                      : passwordStrength === 3
                      ? "Fuerte"
                      : "Muy fuerte"}
                  </span>
                </div>
              )}
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md animate-shake" aria-live="polite">
                <p className="text-sm text-red-600 font-semibold">{error}</p>
              </div>
            )}
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white" disabled={isLoading || !isEmailValid || !isPasswordValid || !isUsernameValid}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Crear cuenta"
              )}
            </Button>
          </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/auth/login" className="text-purple-600 hover:underline font-medium">
                Iniciar sesión
              </Link>
            </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
