"use client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EventHomeStats } from "@/components/dashboard/event-home-stats"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useRouter } from "next/navigation"

export default function EventHomeStatsPage() {
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
    <div className="flex flex-col gap-8">
      <DashboardHeader
        heading="Statistiques de la page d'accueil"
        text="Analyse des interactions des utilisateurs avec les événements sur la page d'accueil"
      >
        <Link href="/dashboard/events">
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Retour aux événements</span>
          </Button>
        </Link>
      </DashboardHeader>

      <EventHomeStats />
    </div>
  )
}

