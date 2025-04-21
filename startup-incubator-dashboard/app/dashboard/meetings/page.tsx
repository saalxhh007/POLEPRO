import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { MeetingsList } from "@/components/dashboard/meetings-list"

export const metadata: Metadata = {
  title: "Réunions",
  description: "Gestion des réunions et sessions de mentorat",
}

export default function MeetingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Réunions" text="Planifiez et gérez les réunions avec les startups et les mentors." />
      <MeetingsList />
    </DashboardShell>
  )
}

