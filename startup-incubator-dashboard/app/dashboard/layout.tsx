import type React from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]">
          <Sidebar className="hidden md:block">
            <SidebarContent>
              <DashboardNav />
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <div className="flex flex-col">
              <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <MobileNav />
                <div className="flex flex-1 items-center justify-end space-x-4">
                  <UserNav />
                </div>
              </header>
              <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}

