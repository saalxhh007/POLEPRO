import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EditEventForm } from "@/components/dashboard/edit-event-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function EditEventPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader heading="Modifier l'événement" text="Mettez à jour les informations de l'événement">
        <Link href="/dashboard/events">
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Retour aux événements</span>
          </Button>
        </Link>
      </DashboardHeader>

      <EditEventForm eventId={params.id} />
    </div>
  )
}

