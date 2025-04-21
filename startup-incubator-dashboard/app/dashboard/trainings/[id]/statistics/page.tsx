import type { Metadata } from "next"
import { TrainingStatistics } from "@/components/dashboard/training-statistics"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Statistiques de formation | Dashboard",
  description: "Analysez les statistiques de la formation",
}

interface StatisticsPageProps {
  params: {
    id: string
  }
}

export default function StatisticsPage({ params }: StatisticsPageProps) {
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
            <h1 className="text-2xl font-bold tracking-tight">Statistiques</h1>
            <p className="text-muted-foreground">Formation: {trainingTitle}</p>
          </div>
        </div>
      </div>

      <TrainingStatistics trainingId={params.id} trainingTitle={trainingTitle} />
    </div>
  )
}

