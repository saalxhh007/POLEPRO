import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProjectTracker } from "@/components/dashboard/project-tracker"

export const metadata: Metadata = {
  title: "Suivi de Projets",
  description: "Suivi détaillé de chaque projet",
}

export default function ProjectsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Suivi de Projets" text="Suivez l'avancement et les métriques de chaque projet." />
      <ProjectTracker />
    </DashboardShell>
  )
}

