import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { EventParticipantsManager } from "@/components/dashboard/event-participants-manager"

export default async function EventParticipantsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader
        heading="Gestion des participants"
        text="Gérez les inscriptions et les participants à l'événement"
      >
        <Link href="/dashboard/events">
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Retour aux événements</span>
          </Button>
        </Link>
      </DashboardHeader>

      <EventParticipantsManager eventId={params.id} />
    </div>
  )
}
