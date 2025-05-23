import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EventHomeStats } from "@/components/dashboard/event-home-stats"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function EventSpecificHomeStatsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader
        heading="Statistiques de l'événement sur la page d'accueil"
        text="Analyse des interactions des utilisateurs avec cet événement sur la page d'accueil"
      >
        <Link href={`/dashboard/events`}>
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Retour aux événements</span>
          </Button>
        </Link>
      </DashboardHeader>

      <EventHomeStats eventId={params.id} />
    </div>
  )
}

