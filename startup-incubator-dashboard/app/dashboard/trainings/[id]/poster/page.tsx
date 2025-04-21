import type { Metadata } from "next"
import { TrainingPoster } from "@/components/dashboard/training-poster"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Affiche de la formation | Dashboard",
  description: "Créez et téléchargez l'affiche de la formation",
}

interface PosterPageProps {
  params: {
    id: string
  }
}

export default function PosterPage({ params }: PosterPageProps) {
  // Dans une application réelle, vous récupéreriez les détails de la formation depuis une API
  const trainingTitle = "Fondamentaux du Business Model Canvas"
  const trainingDate = "15 novembre 2023 à 09:00"
  const trainingLocation = "Salle de conférence A"
  const trainingInstructor = "Marie Dupont"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/trainings">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Affiche de la formation</h1>
            <p className="text-muted-foreground">Formation: {trainingTitle}</p>
          </div>
        </div>
      </div>

      <TrainingPoster
        trainingId={params.id}
        trainingTitle={trainingTitle}
        trainingDate={trainingDate}
        trainingLocation={trainingLocation}
        trainingInstructor={trainingInstructor}
      />
    </div>
  )
}

