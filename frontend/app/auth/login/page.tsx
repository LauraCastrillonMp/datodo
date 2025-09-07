"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Code, ArrowLeft, CheckCircle, Binary } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { toast } from "@/lib/toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const router = useRouter();
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid =
    email.length === 0 || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const isPasswordValid = password.length === 0 || password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    console.log("[Login] Submit: email=", email);

    let didFinish = false;
    const fallbackTimeout = setTimeout(() => {
      if (!didFinish) {
        console.log("[Login] Fallback timeout triggered");
        setError("No se pudo conectar. Intenta de nuevo.");
        setPassword("");
        setIsLoading(false);
        toast.error("No se pudo conectar. Intenta de nuevo.");
      }
    }, 3000);

    try {
      console.log("[Login] Calling signIn...");
      const result = await signIn(email, password);
      didFinish = true;
      clearTimeout(fallbackTimeout);
      console.log("[Login] signIn result:", result);

      if (result && result.error) {
        let errorMsg = "";
        let isCredentialError = false;
        if (
          typeof result.error === "string" &&
          (/401|unauthorized|credenciales|usuario|invalid credentials/i.test(
            result.error
          ) ||
            result.error.includes("HTTP error! status: 401"))
        ) {
          errorMsg = "Usuario no encontrado o credenciales incorrectas.";
          isCredentialError = true;
        } else if (
          typeof result.error === "string" &&
          /timeout|network/i.test(result.error)
        ) {
          errorMsg = "No se pudo conectar. Intenta de nuevo.";
        } else if (typeof result.error === "string") {
          errorMsg = result.error;
        } else {
          errorMsg = "Usuario no encontrado o credenciales incorrectas.";
          isCredentialError = true;
        }
        console.log("[Login] Error detected:", errorMsg);
        setError(errorMsg);
        setPassword("");
        setIsLoading(false);
        toast.error(errorMsg);
        // Focus password input for quick retry on credential error
        if (isCredentialError && passwordInputRef.current) {
          passwordInputRef.current.focus();
        }
        return;
      }
      if (!result || !result.data) {
        console.log(
          "[Login] No result or no data, treating as invalid credentials."
        );
        setError("Usuario no encontrado o credenciales incorrectas.");
        setPassword("");
        setIsLoading(false);
        toast.error("Usuario no encontrado o credenciales incorrectas.");
        if (passwordInputRef.current) passwordInputRef.current.focus();
        return;
      }
      console.log("[Login] Success, redirecting to home.");
      router.push("/");
    } catch (err) {
      didFinish = true;
      clearTimeout(fallbackTimeout);
      console.log("[Login] Exception caught:", err);
      setError("Error inesperado. Intenta de nuevo.");
      setPassword("");
      setIsLoading(false);
      toast.error("Error inesperado. Intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-blue-600 items-center justify-center p-8">
        <div className="text-center text-white space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gaming-purple rounded-lg flex items-center justify-center">
              <Binary className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg">Datodo</h1>
          </div>
          <p className="text-white/90">
            Aprende estructuras de datos de manera interactiva y divertida
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Simulaciones interactivas</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Teoría práctica</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Desafíos gamificados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-1 items-center justify-center bg-background p-4 sm:p-6 relative">
        {/* Back to Home Button */}
        <Link href="/" className="absolute top-4 sm:top-6 left-4 sm:left-6">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver al inicio</span>
          </Button>
        </Link>

        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gaming-purple rounded-lg flex items-center justify-center">
                <Binary className="w-5 h-5 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              Inicia sesión
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Ingrese sus credenciales para acceder a su cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Introduce tu correo electrónico"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  onBlur={() => setEmailTouched(true)}
                  required
                  className={
                    "text-sm sm:text-base" +
                    (error && /credenciales|usuario/i.test(error)
                      ? " border-red-500 focus:border-red-500"
                      : "")
                  }
                />
                {!isEmailValid && (emailTouched || email.length > 0) && (
                  <p className="text-xs text-red-500 mt-1">
                    Introduce un correo electrónico válido.
                  </p>
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
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    onBlur={() => setPasswordTouched(true)}
                    required
                    className={
                      "text-sm sm:text-base" +
                      (error && /credenciales|usuario/i.test(error)
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
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-2.364A9.956 9.956 0 0022 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.636-1.364"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.828-2.828A9.956 9.956 0 0022 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.21.896-4.21 2.343-5.657"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {!isPasswordValid &&
                  (passwordTouched || password.length > 0) && (
                    <p className="text-xs text-red-500 mt-1">
                      La contraseña debe tener al menos 6 caracteres.
                    </p>
                  )}
              </div>
              {error && (
                <div
                  className="p-3 bg-red-50 border border-red-200 rounded-md animate-shake"
                  aria-live="polite"
                >
                  <p className="text-sm text-red-600 font-semibold">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <Link
                  href="/auth/register"
                  className="text-purple-600 hover:underline"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
