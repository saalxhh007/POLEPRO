"use client"
import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ResourcesList } from "@/components/dashboard/resources-list"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function ResourcesPage() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const role = useSelector((state: RootState) => state.auth.role);
  const router = useRouter()
  useEffect(() => {
    console.log(isAuthenticated);
    
    if (!isAuthenticated || role !== 'admin') {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, role, router]);
  
  if (!isAuthenticated || role !== 'admin') {
    return null;
  }
  return (
    <DashboardShell>
      <DashboardHeader heading="Resources" text="Manage office space, equipment, and other resources." />
      <ResourcesList />
    </DashboardShell>
  )
}

