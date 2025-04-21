import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SettingsForm } from "@/components/dashboard/settings-form"

export const metadata: Metadata = {
  title: "Paramètres",
  description: "Gérer les paramètres de l'application",
}

export default function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Paramètres" text="Gérez les paramètres de votre plateforme d'incubation." />
      <SettingsForm />
    </DashboardShell>
  )
}

