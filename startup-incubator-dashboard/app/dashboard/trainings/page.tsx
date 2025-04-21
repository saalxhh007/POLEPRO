import type { Metadata } from "next"
import { TrainingsList } from "@/components/dashboard/trainings-list"

export const metadata: Metadata = {
  title: "Formations | Dashboard Incubateur",
  description: "Gérez les formations de l'incubateur de startups",
}

export default function TrainingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Formations</h1>
        <p className="text-muted-foreground">Gérez les formations proposées par l'incubateur</p>
      </div>
      <TrainingsList />
    </div>
  )
}

