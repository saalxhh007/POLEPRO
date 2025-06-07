"use client"
import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ResourceLibrary } from "@/components/dashboard/resource-library"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ResourceLibraryPage() {
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
      <DashboardHeader
        heading="Bibliothèque de Ressources"
        text="Partagez des documents, guides et ressources avec les startups et mentors de l'incubateur."
      />
      <ResourceLibrary />
    </DashboardShell>
  )
}

