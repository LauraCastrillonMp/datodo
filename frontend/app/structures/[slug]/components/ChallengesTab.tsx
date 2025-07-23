import { QuizComponent } from '@/components/quiz/quiz-component'

interface ChallengesTabProps {
  dataStructureId: number
  dataStructureSlug: string
  onRecentScore: (score: number | null) => void
  onBestScore: (score: number | null) => void
}

export function ChallengesTab({ 
  dataStructureId, 
  dataStructureSlug, 
  onRecentScore, 
  onBestScore 
}: ChallengesTabProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold">Pon a Prueba tu Conocimiento</h2>
      <QuizComponent
        dataStructureId={dataStructureId}
        dataStructureSlug={dataStructureSlug}
        onRecentScore={onRecentScore}
        onBestScore={onBestScore}
      />
    </div>
  )
} 