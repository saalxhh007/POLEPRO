"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  BarChart3,
  Calendar,
  ClipboardList,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Library,
  Menu,
  MessageSquare,
  Settings,
  Users,
  Briefcase,
  BookOpen,
  Lightbulb,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      title: "Overview",
    },
    {
      href: "/dashboard/startups",
      icon: Briefcase,
      title: "Startups",
    },
    {
      href: "/dashboard/mentors",
      icon: Users,
      title: "Mentors",
    },
    {
      href: "/dashboard/events",
      icon: Calendar,
      title: "Events",
    },
    {
      href: "/dashboard/projects",
      icon: Lightbulb,
      title: "Projects",
    },
    {
      href: "/dashboard/meetings",
      icon: MessageSquare,
      title: "Meetings",
    },
    {
      href: "/dashboard/messaging",
      icon: MessageCircle,
      title: "Messagerie",
    },
    {
      href: "/dashboard/resources",
      icon: Library,
      title: "Resources",
    },
    {
      href: "/dashboard/reports",
      icon: BarChart3,
      title: "Reports",
    },
    {
      href: "/dashboard/resource-library",
      icon: FileText,
      title: "Resource Library",
    },
    {
      href: "/dashboard/trainings",
      icon: BookOpen,
      title: "Trainings",
    },
    {
      href: "/dashboard/applications",
      icon: ClipboardList,
      title: "Applications",
    },
    {
      href: "/dashboard/help",
      icon: HelpCircle,
      title: "Help Center",
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      title: "Settings",
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 sm:max-w-xs">
        <div className="px-7">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary-700 bg-clip-text text-transparent">
              Guelma Incubator
            </span>
          </Link>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="pl-1 pr-7">
            <div className="mt-4 mb-4">
              <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">Main Navigation</h4>
              {routes.map((route) => (
                <Link key={route.href} href={route.href} onClick={() => setOpen(false)}>
                  <span
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-primary-50 hover:text-primary-600 transition-all",
                      pathname === route.href ? "bg-primary-50 text-primary-600" : "text-gray-600",
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    <span>{route.title}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

