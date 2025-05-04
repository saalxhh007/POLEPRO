"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Search, Users, Grid3X3, List, Share2, UserPlus } from "lucide-react"
import { EventsFilter } from "@/components/events/events-filter"
import { useEffect, useState } from "react"
import axios from "axios"

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const fetchEvents = () => {
    axios.get(`${apiUrl}/api/event`)
      .then(response => {
        setEvents(response.data.data)
       })
      .catch(err => {
        console.error('Error fetching events:', err);
      })
  }
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Événements</h1>
          <p className="text-muted-foreground">Découvrez nos prochains événements et inscrivez-vous</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/events">
            <Button variant="outline">Accès administrateur</Button>
          </Link>
          <Button>Proposer un événement</Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <div className="sticky top-20">
            <EventsFilter />
          </div>
        </div>

        <div className="lg:w-3/4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Rechercher..." className="pl-8" />
            </div>

            <div className="flex items-center gap-2">
              <Select defaultValue="date-asc">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-asc">Date (croissant)</SelectItem>
                  <SelectItem value="date-desc">Date (décroissant)</SelectItem>
                  <SelectItem value="popularity">Popularité</SelectItem>
                  <SelectItem value="capacity">Capacité</SelectItem>
                </SelectContent>
              </Select>

              <Tabs defaultValue="grid" className="hidden md:block">
                <TabsList>
                  <TabsTrigger value="grid" className="px-3">
                    <Grid3X3 className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list" className="px-3">
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-video relative">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    width={400}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white rounded-lg p-2 text-center shadow-md">
                      <div className="text-xl font-bold text-primary">{event.date.split(" ")[0]}</div>
                      <div className="text-xs">{event.date.split(" ")[1]}</div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full h-8 w-8 bg-white/80 hover:bg-white text-primary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      <span className="sr-only">Ajouter aux favoris</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full h-8 w-8 bg-white/80 hover:bg-white text-primary"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Partager</span>
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      className={
                        event.category === "workshop"
                          ? "bg-blue-100 text-blue-800"
                          : event.category === "conference"
                            ? "bg-purple-100 text-purple-800"
                            : event.category === "masterclass"
                              ? "bg-amber-100 text-amber-800"
                              : event.category === "networking"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                      }
                    >
                      {event.category === "workshop"
                        ? "Atelier"
                        : event.category === "conference"
                          ? "Conférence"
                          : event.category === "masterclass"
                            ? "Masterclass"
                            : event.category === "networking"
                              ? "Networking"
                              : event.category === "open-day"
                                ? "Journée Portes Ouvertes"
                                : "Événement"}
                    </Badge>
                    <Badge
                      variant={event.registered / event.capacity > 0.8 ? "destructive" : "outline"}
                      className={event.registered / event.capacity > 0.8 ? "" : "bg-green-50 text-green-700"}
                    >
                      {event.registered / event.capacity > 0.8 ? "Presque complet" : "Places disponibles"}
                    </Badge>
                  </div>
                  <Link href={`/events/${event.id}`}>
                    <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">{event.title}</h3>
                  </Link>
                  <p className="text-gray-500 mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.registered} participants / {event.capacity} places
                    </span>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link href={`/events/${event.id}`}>
                      <Button className="w-full">Voir plus de détails</Button>
                    </Link>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        className="flex items-center justify-center gap-1"
                        onClick={(e) => {
                          e.preventDefault()
                          // Dans une application réelle, ceci déclencherait une action pour ajouter aux favoris
                          alert(`Événement "${event.title}" ajouté aux favoris`)
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                        <span className="sr-only md:not-sr-only md:text-xs lg:text-sm">Favoriser</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center justify-center gap-1"
                        onClick={(e) => {
                          e.preventDefault()
                          // Dans une application réelle, ceci ouvrirait une boîte de dialogue de partage
                          alert(`Partager l'événement "${event.title}"`)
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:text-xs lg:text-sm">Partager</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center justify-center gap-1"
                        onClick={(e) => {
                          e.preventDefault()
                          // Dans une application réelle, ceci ouvrirait un formulaire d'inscription
                          alert(`S'inscrire à l'événement "${event.title}"`)
                        }}
                      >
                        <UserPlus className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:text-xs lg:text-sm">S'inscrire</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button className="mx-auto">Voir tous les événements</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

