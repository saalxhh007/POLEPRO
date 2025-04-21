import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StartupsList } from "@/components/dashboard/startups-list"

export const metadata: Metadata = {
  title: "Startups",
  description: "Manage startups in your incubator",
}

export default function StartupsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Startups" text="Manage startups in your incubator program." />
      <StartupsList />
    </DashboardShell>
  )
}

