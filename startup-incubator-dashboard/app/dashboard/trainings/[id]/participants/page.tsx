import type { Metadata } from "next"
import { TrainingParticipantsManager } from "@/components/dashboard/training-participants-manager"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Gestion des participants | Dashboard",
  description: "Gérez les participants à la formation",
}

interface ParticipantsPageProps {
  params: {
    id: string
  }
}

export default function ParticipantsPage({ params }: ParticipantsPageProps) {
  // Dans une application réelle, vous récupéreriez les détails de la formation depuis une API
  const trainingTitle = "Fondamentaux du Business Model Canvas"

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
            <h1 className="text-2xl font-bold tracking-tight">Gestion des participants</h1>
            <p className="text-muted-foreground">Formation: {trainingTitle}</p>
          </div>
        </div>
      </div>

      <TrainingParticipantsManager trainingId={params.id} trainingTitle={trainingTitle} />
    </div>
  )
}

