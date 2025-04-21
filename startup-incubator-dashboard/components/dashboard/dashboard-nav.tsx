"use client"

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
  MessageSquare,
  Settings,
  Users,
  Briefcase,
  BookOpen,
  Lightbulb,
  MessageCircle,
} from "lucide-react"

export function DashboardNav() {
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
    <nav className="grid items-start gap-2">
      {routes.map((route) => (
        <Link key={route.href} href={route.href}>
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-primary-50 hover:text-primary-600 transition-all",
              pathname === route.href ? "bg-primary-50 text-primary-600" : "text-gray-600",
            )}
          >
            <route.icon className="mr-2 h-4 w-4" />
            <span>{route.title}</span>
          </span>
        </Link>
      ))}
    </nav>
  )
}

