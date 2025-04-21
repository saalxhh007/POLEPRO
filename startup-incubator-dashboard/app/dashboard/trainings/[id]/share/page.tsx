import type { Metadata } from "next"
import { TrainingShare } from "@/components/dashboard/training-share"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Partager la formation | Dashboard",
  description: "Partagez la formation sur différentes plateformes",
}

interface SharePageProps {
  params: {
    id: string
  }
}

export default function SharePage({ params }: SharePageProps) {
  // Dans une application réelle, vous récupéreriez les détails de la formation depuis une API
  const trainingTitle = "Fondamentaux du Business Model Canvas"
  const trainingDescription =
    "Apprenez à construire et analyser votre modèle d'affaires avec cette formation complète sur le Business Model Canvas."
  const trainingDate = "15 novembre 2023 à 09:00"
  const trainingImage = "/placeholder.svg?height=200&width=400"

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
            <h1 className="text-2xl font-bold tracking-tight">Partager la formation</h1>
            <p className="text-muted-foreground">Formation: {trainingTitle}</p>
          </div>
        </div>
      </div>

      <TrainingShare
        trainingId={params.id}
        trainingTitle={trainingTitle}
        trainingDescription={trainingDescription}
        trainingDate={trainingDate}
        trainingImage={trainingImage}
      />
    </div>
  )
}

