import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { AppLayout } from "@/components/app-layout"
import { Toaster } from "sonner"
import { ErrorBoundary } from "@/components/error-boundary"
// import { AuthDebug } from "@/components/auth-debug"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DataStruct Academy - Learn Data Structures with Gamification",
  description: "Interactive platform to learn data structures with theory, simulations, and gamification elements",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ErrorBoundary>
            <AuthProvider>
              <AppLayout>{children}</AppLayout>
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
