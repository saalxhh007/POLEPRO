"use client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { MentorsList } from "@/components/dashboard/mentors-list"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useRouter } from "next/navigation"

export default function MentorsPage() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const role = useSelector((state: RootState) => state.auth.role);
  const router = useRouter()
  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, role, router]);
  
  if (!isAuthenticated || role !== 'admin') {
    return null;
  }
  return (
    <DashboardShell>
      <DashboardHeader heading="Mentors" text="Manage mentors and advisors for your startups." />
      <MentorsList />
    </DashboardShell>
  )
}

