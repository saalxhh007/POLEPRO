"use client"
import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ReportsList } from "@/components/dashboard/reports-list"
import { ReportDetails } from "@/components/dashboard/report-details"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useRouter } from "next/navigation"

export default function ReportsPage() {
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
      <DashboardHeader heading="Rapports" text="Générez et consultez les rapports de performance de l'incubateur." />

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste des rapports</TabsTrigger>
          <TabsTrigger value="details">Détails du rapport</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <ReportsList />
        </TabsContent>

        <TabsContent value="details">
          <ReportDetails reportId="1" />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

