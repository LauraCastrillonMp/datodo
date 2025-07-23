interface StepDisplayProps {
  currentStep: string
}

export function StepDisplay({ currentStep }: StepDisplayProps) {
  if (!currentStep) return null

  return (
    <div className="p-3 sm:p-4 bg-muted/50 rounded-lg border">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0 animate-pulse"></div>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {currentStep}
        </p>
      </div>
    </div>
  )
} 