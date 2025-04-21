import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { EventsList } from "@/components/dashboard/events-list"

export const metadata: Metadata = {
  title: "Events",
  description: "Manage incubator events and workshops",
}

export default function EventsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Events" text="Manage workshops, demo days, and networking events." />
      <EventsList />
    </DashboardShell>
  )
}

