import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'white'
  className?: string
  text?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  className,
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const variantClasses = {
    default: 'border-gray-300 border-t-gray-600',
    primary: 'border-gray-300 border-t-purple-600',
    white: 'border-white/20 border-t-white'
  }

  return (
    <div className={cn("flex flex-col justify-center items-center", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2", 
        sizeClasses[size],
        variantClasses[variant]
      )} />
      {text && (
        <p className={cn(
          "mt-2 text-sm",
          variant === 'white' ? 'text-white/80' : 'text-muted-foreground'
        )}>
          {text}
        </p>
      )}
    </div>
  )
}

export function PageLoadingSpinner({ text = "Cargando..." }: { text?: string }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner size="xl" text={text} />
    </div>
  )
}

export function CardLoadingSpinner({ text = "Cargando..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}
