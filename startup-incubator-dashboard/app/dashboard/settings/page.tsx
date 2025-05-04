"use client"
import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SettingsForm } from "@/components/dashboard/settings-form"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function SettingsPage() {
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
      <DashboardHeader heading="Paramètres" text="Gérez les paramètres de votre plateforme d'incubation." />
      <SettingsForm />
    </DashboardShell>
  )
}

