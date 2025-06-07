"use client"
import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RequestsList } from "@/components/dashboard/requests-list"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useRouter } from "next/navigation"
import loader from "@/components/ui/loader"

export default function RequestsPage() {
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const role = useSelector((state: RootState) => state.auth.role);
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      router.push('/unauthorized');
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, role, router]);

  if (loading) {
    return loader();
  }

  if (!isAuthenticated || role !== 'admin') {
    return <p>Redirecting...</p>;
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Requests" text="Review and manage startup incubator application requests." />
      <RequestsList />
    </DashboardShell>
  )
}
