import type { Metadata } from "next"
import { MessagingInterface } from "@/components/dashboard/messaging-interface"

export const metadata: Metadata = {
  title: "Messagerie | Incubateur Guelma",
  description: "Système de messagerie pour l'incubateur de startups de Guelma",
}

export default function MessagingPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Messagerie</h1>
      </div>
      <div className="grid gap-4">
        <MessagingInterface />
      </div>
    </div>
  )
}

