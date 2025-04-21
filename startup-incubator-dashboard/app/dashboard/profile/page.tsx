import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { UserProfile } from "@/components/dashboard/user-profile"

export const metadata: Metadata = {
  title: "Profil",
  description: "Gérer votre profil utilisateur",
}

export default function ProfilePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Profil" text="Gérez vos informations personnelles et vos préférences." />
      <UserProfile />
    </DashboardShell>
  )
}

