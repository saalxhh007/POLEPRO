"use client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StudentsList } from "@/components/dashboard/students-list"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { useRouter } from "next/navigation"

export default function StudentsPage() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const role = useSelector((state: RootState) => state.auth.role)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || role !== "admin") {
      router.push("/unauthorized")
    }
  }, [isAuthenticated, role, router])

  if (!isAuthenticated || role !== "admin") {
    return null
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Students" text="Manage students and track their progress in the program." />
      <StudentsList />
    </DashboardShell>
  )
}
