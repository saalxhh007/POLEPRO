import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EventReminderSender } from "@/components/dashboard/event-reminder-sender"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function SendReminderPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader heading="Envoyer des rappels" text="Envoyez des rappels aux participants de l'événement">
        <Link href="/dashboard/events">
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Retour aux événements</span>
          </Button>
        </Link>
      </DashboardHeader>

      <EventReminderSender eventId={params.id} />
    </div>
  )
}

