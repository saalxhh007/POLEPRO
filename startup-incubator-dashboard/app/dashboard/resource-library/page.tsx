import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ResourceLibrary } from "@/components/dashboard/resource-library"

export const metadata: Metadata = {
  title: "Bibliothèque de Ressources",
  description: "Accédez et partagez des ressources avec les startups et mentors",
}

export default function ResourceLibraryPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Bibliothèque de Ressources"
        text="Partagez des documents, guides et ressources avec les startups et mentors de l'incubateur."
      />
      <ResourceLibrary />
    </DashboardShell>
  )
}

