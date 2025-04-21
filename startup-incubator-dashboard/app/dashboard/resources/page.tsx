import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ResourcesList } from "@/components/dashboard/resources-list"

export const metadata: Metadata = {
  title: "Resources",
  description: "Manage incubator resources",
}

export default function ResourcesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Resources" text="Manage office space, equipment, and other resources." />
      <ResourcesList />
    </DashboardShell>
  )
}

