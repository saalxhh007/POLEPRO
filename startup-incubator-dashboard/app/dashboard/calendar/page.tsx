import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CalendarView } from "@/components/dashboard/calendar-view"

export const metadata: Metadata = {
  title: "Calendrier",
  description: "Calendrier des activités et événements",
}

export default function CalendarPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Calendrier" text="Planifiez et visualisez toutes les activités et événements." />
      <CalendarView />
    </DashboardShell>
  )
}

