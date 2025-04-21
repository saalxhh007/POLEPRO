import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EventShare } from "@/components/dashboard/event-share"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function EventSharePage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader
        heading="Partager l'événement"
        text="Partagez cet événement sur les réseaux sociaux ou par email"
      >
        <Link href="/dashboard/events">
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Retour aux événements</span>
          </Button>
        </Link>
      </DashboardHeader>

      <EventShare eventId={params.id} />
    </div>
  )
}

