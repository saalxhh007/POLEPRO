import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { MentorsList } from "@/components/dashboard/mentors-list"

export const metadata: Metadata = {
  title: "Mentors",
  description: "Manage mentors and advisors",
}

export default function MentorsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Mentors" text="Manage mentors and advisors for your startups." />
      <MentorsList />
    </DashboardShell>
  )
}

