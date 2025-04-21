import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { HelpCenter } from "@/components/dashboard/help-center"

export const metadata: Metadata = {
  title: "Aide",
  description: "Centre d'aide et documentation",
}

export default function HelpPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Centre d'Aide" text="Trouvez de l'aide et consultez la documentation." />
      <HelpCenter />
    </DashboardShell>
  )
}

