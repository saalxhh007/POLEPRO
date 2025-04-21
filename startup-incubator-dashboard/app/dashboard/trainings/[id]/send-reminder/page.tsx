import type { Metadata } from "next"
import { TrainingReminderSender } from "@/components/dashboard/training-reminder-sender"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Envoyer des rappels | Dashboard",
  description: "Envoyez des rappels aux participants de la formation",
}

interface SendReminderPageProps {
  params: {
    id: string
  }
}

export default function SendReminderPage({ params }: SendReminderPageProps) {
  // Dans une application réelle, vous récupéreriez les détails de la formation depuis une API
  const trainingTitle = "Fondamentaux du Business Model Canvas"
  const trainingDate = "15 novembre 2023 à 09:00"
  const trainingLocation = "Salle de conférence A"

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
            <h1 className="text-2xl font-bold tracking-tight">Envoyer des rappels</h1>
            <p className="text-muted-foreground">Formation: {trainingTitle}</p>
          </div>
        </div>
      </div>

      <TrainingReminderSender
        trainingId={params.id}
        trainingTitle={trainingTitle}
        trainingDate={trainingDate}
        trainingLocation={trainingLocation}
      />
    </div>
  )
}

