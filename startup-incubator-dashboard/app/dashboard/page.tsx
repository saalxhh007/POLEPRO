"use client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Overview } from "@/components/dashboard/overview"
import { RecentStartups } from "@/components/dashboard/recent-startups"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { MentorAvailability } from "@/components/dashboard/mentor-availability"
import { ResourceAllocation } from "@/components/dashboard/resource-allocation"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { IndustryDistribution } from "@/components/dashboard/industry-distribution"
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useRouter } from "next/navigation"
import { useTokenRefresh } from "@/utils/useTokenRefresh"
import loader from "@/components/ui/loader"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const role = useSelector((state: RootState) => state.auth.role);
  const router = useRouter()
  useTokenRefresh()
    
  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      router.push('/unauthorized');
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, role, router]);
  
  if (loading) {
    return loader()
  }
if (!isAuthenticated || role !== 'admin') {
  return <p>Redirecting...</p>;
}
  else {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome to your startup incubator admin dashboard." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Overview />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <PerformanceChart />
        <IndustryDistribution />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <RecentStartups className="col-span-4" />
        <div className="col-span-3 space-y-4">
          <UpcomingDeadlines />
          <UpcomingEvents />
          <MentorAvailability />
          <ResourceAllocation />
        </div>
      </div>
    </DashboardShell>
  )
}

}