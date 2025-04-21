"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon, Clock, MapPin, Users } from "lucide-react"

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState("month")
  const [filter, setFilter] = useState("all")

  // Exemple d'événements
  const events = [
    {
      id: "1",
      title: "Demo Day",
      type: "event",
      date: new Date(2025, 5, 15), // 15 Juin 2025
      time: "13:00 - 17:00",
      location: "Auditorium Principal",
      attendees: 120,
    },
    {
      id: "2",
      title: "Atelier Pitch Investisseurs",
      type: "workshop",
      date: new Date(2025, 5, 10), // 10 Juin 2025
      time: "10:00 - 12:00",
      location: "Salle de Conférence A",
      attendees: 35,
    },
    {
      id: "3",
      title: "Réunion Équipe EcoTech",
      type: "meeting",
      date: new Date(2025, 5, 8), // 8 Juin 2025
      time: "14:00 - 15:00",
      location: "Salle de Réunion B",
      attendees: 5,
    },
    {
      id: "4",
      title: "Mentorat MediConnect",
      type: "mentoring",
      date: new Date(2025, 5, 9), // 9 Juin 2025
      time: "11:00 - 12:30",
      location: "Salle de Réunion C",
      attendees: 2,
    },
    {
      id: "5",
      title: "Networking Mixer",
      type: "event",
      date: new Date(2025, 5, 12), // 12 Juin 2025
      time: "18:00 - 20:00",
      location: "Terrasse",
      attendees: 80,
    },
    {
      id: "6",
      title: "Revue de Projet FinLedger",
      type: "meeting",
      date: new Date(2025, 5, 11), // 11 Juin 2025
      time: "15:00 - 16:30",
      location: "Salle de Réunion A",
      attendees: 8,
    },
  ]

  // Filtrer les événements pour la date sélectionnée (pour la vue jour)
  const dayEvents = date
    ? events.filter(
        (event) =>
          event.date.getDate() === date.getDate() &&
          event.date.getMonth() === date.getMonth() &&
          event.date.getFullYear() === date.getFullYear() &&
          (filter === "all" || event.type === filter),
      )
    : []

  // Fonction pour déterminer si un jour a des événements (pour la vue mois)
  const getDayHasEvents = (day: Date) => {
    return events.some(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear() &&
        (filter === "all" || event.type === filter),
    )
  }

  // Fonction pour obtenir le badge de type d'événement
  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "event":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Événement</Badge>
      case "workshop":
        return <Badge className="bg-green-500 hover:bg-green-600">Atelier</Badge>
      case "meeting":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Réunion</Badge>
      case "mentoring":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Mentorat</Badge>
      default:
        return <Badge>Autre</Badge>
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (date) {
                  const newDate = new Date(date)
                  newDate.setMonth(newDate.getMonth() - 1)
                  setDate(newDate)
                }
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (date) {
                  const newDate = new Date(date)
                  newDate.setMonth(newDate.getMonth() + 1)
                  setDate(newDate)
                }
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {date ? date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : ""}
            </h2>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
            <Tabs value={view} onValueChange={setView} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="month">Mois</TabsTrigger>
                <TabsTrigger value="day">Jour</TabsTrigger>
              </TabsList>
            </Tabs>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="event">Événements</SelectItem>
                <SelectItem value="workshop">Ateliers</SelectItem>
                <SelectItem value="meeting">Réunions</SelectItem>
                <SelectItem value="mentoring">Mentorat</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Ajouter
            </Button>
          </div>
        </div>

        <Tabs value={view} className="mt-4">
          <TabsContent value="month" className="mt-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                hasEvents: (date) => getDayHasEvents(date),
              }}
              modifiersClassNames={{
                hasEvents: "bg-primary/10 font-bold text-primary",
              }}
            />
          </TabsContent>
          <TabsContent value="day" className="mt-0">
            <div className="rounded-md border p-4">
              <h3 className="font-semibold mb-4">
                {date
                  ? date.toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
              </h3>

              {dayEvents.length > 0 ? (
                <div className="space-y-4">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex flex-col p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        {getEventTypeBadge(event.type)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-2 h-4 w-4" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="mr-2 h-4 w-4" />
                          {event.attendees} participants
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Aucun événement ce jour</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Il n'y a pas d'événements programmés pour cette date.
                  </p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un événement
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

