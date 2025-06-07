"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Users, Search, Plus, Tag, ExternalLink, Edit, Trash2, Filter } from "lucide-react"
import toast from "react-hot-toast"
import api from "@/lib/axios"

interface Event {
  id: number
  title: string
  type: string
  description: string | null
  date: string
  time: string
  location: string
  capacity: number | null
  tags: string | null
  fiche: string | null
  fiche_title: string | null
  fiche_alternatif: string | null
  supp: string[] | null
  registered: boolean
  is_organizer: boolean
  participant_count: number
}

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents()
    }
  }, [isAuthenticated])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      // Fetch all events the user is involved with
      const response = await api.get(`${apiUrl}/api/event/my-events`)
      setEvents(response.data)

      // Filter events where user is registered
      setRegisteredEvents(response.data.filter((event: Event) => event.registered && !event.is_organizer))

    } catch (error) {
      console.error("Error fetching events:", error)
      toast.error("Impossible de récupérer vos événements")
    } finally {
      setLoading(false)
    }
  }

  const handleUnregister = async (eventId: number) => {
    try {
      await api.post(`${apiUrl}/api/event/${eventId}/unregister`)
      toast.success("Désinscription réussie")
      fetchEvents()
    } catch (error) {
      console.error("Error unregistering from event:", error)
      toast.error("Erreur lors de la désinscription")
    }
  }

  const handleDeleteEvent = async (eventId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      try {
        await api.delete(`${apiUrl}/api/event/${eventId}`)
        toast.success("Événement supprimé avec succès")
        fetchEvents()
      } catch (error) {
        console.error("Error deleting event:", error)
        toast.error("Erreur lors de la suppression de l'événement")
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ]
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()

    return { day, month, year }
  }

  const filteredRegisteredEvents = registeredEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterType === "all") return matchesSearch
    return matchesSearch && event.type === filterType
  })
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 container py-12">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des événements...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mes Événements</h1>
            <p className="text-muted-foreground">Gérez vos inscriptions et événements organisés</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/events">
              <Button variant="outline" className="w-full sm:w-auto">
                Parcourir les événements
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un événement..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="border rounded-md px-3 py-2 bg-background"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Tous les types</option>
              <option value="workshop">Atelier</option>
              <option value="conference">Conférence</option>
              <option value="hackathon">Hackathon</option>
              <option value="networking">Networking</option>
              <option value="other">Autre</option>
            </select>
          </div>
        </div>

        <Tabs defaultValue="registered">
          <TabsList className="mb-6">
            <TabsTrigger value="registered">
              Événements auxquels je participe ({filteredRegisteredEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registered">
            {filteredRegisteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRegisteredEvents.map((event) => {
                  const { day, month, year } = formatDate(event.date)
                  return (
                    <Card key={event.id} className="overflow-hidden transition-all hover:shadow-lg">
                      <div className="aspect-video relative">
                        <Image
                          src="/placeholder.svg?height=200&width=400"
                          alt={event.title}
                          width={400}
                          height={200}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-4 left-4">
                          <div className="bg-white rounded-lg p-2 text-center shadow-md">
                            <div className="text-xl font-bold text-primary">{day}</div>
                            <div className="text-xs">{month}</div>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-primary text-white">{event.type}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {event.description || "Aucune description disponible."}
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{`${day} ${month} ${year}`}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-primary" />
                            <span>
                              {event.participant_count} / {event.capacity || "∞"} participants
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Link href={`/events/${event.id}`}>
                            <Button variant="outline" className="w-full">
                              Voir les détails
                            </Button>
                          </Link>
                          <Button variant="destructive" className="w-full" onClick={() => handleUnregister(event.id)}>
                            Se désinscrire
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/10">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">Aucun événement</h3>
                <p className="text-muted-foreground mb-6">Vous n'êtes inscrit à aucun événement pour le moment.</p>
                <Link href="/events">
                  <Button>Parcourir les événements</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
