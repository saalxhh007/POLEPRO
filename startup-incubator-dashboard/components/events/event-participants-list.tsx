"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface Participant {
  id: string
  name: string
  email: string
  organization?: string
  avatar?: string
  registrationDate: string
}

interface EventParticipantsListProps {
  eventId: number | undefined
  limit?: number
}

export function EventParticipantsList({ eventId, limit }: EventParticipantsListProps) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simuler un chargement de données
    const timer = setTimeout(() => {
      // Dans une application réelle, vous récupéreriez les participants depuis une API
      const mockParticipants: Participant[] = [
        {
          id: "1",
          name: "Ahmed Benali",
          email: "ahmed.benali@example.com",
          organization: "Université de Guelma",
          avatar: "/placeholder.svg?height=40&width=40",
          registrationDate: "2025-05-15",
        },
        {
          id: "2",
          name: "Samira Hadj",
          email: "samira.hadj@example.com",
          organization: "TechInnovate",
          avatar: "/placeholder.svg?height=40&width=40",
          registrationDate: "2025-05-16",
        },
        {
          id: "3",
          name: "Karim Meziane",
          email: "karim.meziane@example.com",
          organization: "StartupAlgeria",
          avatar: "/placeholder.svg?height=40&width=40",
          registrationDate: "2025-05-17",
        },
        {
          id: "4",
          name: "Leila Bouaziz",
          email: "leila.bouaziz@example.com",
          organization: "Digital Solutions",
          avatar: "/placeholder.svg?height=40&width=40",
          registrationDate: "2025-05-18",
        },
        {
          id: "5",
          name: "Omar Taleb",
          email: "omar.taleb@example.com",
          organization: "Incubateur BAG",
          avatar: "/placeholder.svg?height=40&width=40",
          registrationDate: "2025-05-19",
        },
        {
          id: "6",
          name: "Fatima Zahra",
          email: "fatima.zahra@example.com",
          organization: "FinTech Algérie",
          avatar: "/placeholder.svg?height=40&width=40",
          registrationDate: "2025-05-20",
        },
        {
          id: "7",
          name: "Youcef Kaddour",
          email: "youcef.kaddour@example.com",
          organization: "AgriTech Solutions",
          avatar: "/placeholder.svg?height=40&width=40",
          registrationDate: "2025-05-21",
        },
      ]

      // Appliquer la limite si elle est définie
      const limitedParticipants = limit ? mockParticipants.slice(0, limit) : mockParticipants

      setParticipants(limitedParticipants)
      setIsLoading(false)

      // Simuler une synchronisation avec le dashboard
      console.log(
        `Chargement des participants pour l'événement ${eventId} - Ces données seraient synchronisées avec le dashboard`,
      )
    }, 1000)

    return () => clearTimeout(timer)
  }, [eventId, limit])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: limit || 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {participants.map((participant) => (
        <div key={participant.id} className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={participant.avatar} alt={participant.name} />
            <AvatarFallback>{participant.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium leading-none">{participant.name}</p>
            <p className="text-sm text-muted-foreground">{participant.organization}</p>
          </div>
        </div>
      ))}

      {limit && participants.length >= limit && (
        <Button variant="ghost" className="w-full text-primary" asChild>
          <Link href={`/events/${eventId}/participants`}>Voir tous les participants</Link>
        </Button>
      )}
    </div>
  )
}

