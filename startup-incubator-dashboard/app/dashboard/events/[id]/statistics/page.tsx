import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EventStatistics } from "@/components/dashboard/event-statistics"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function EventStatisticsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader
        heading="Statistiques d'interaction"
        text="Analyse des interactions des utilisateurs avec cet événement"
      >
        <Link href="/dashboard/events">
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Retour aux événements</span>
          </Button>
        </Link>
      </DashboardHeader>

      <EventStatistics eventId={params.id} />
    </div>
  )
}

