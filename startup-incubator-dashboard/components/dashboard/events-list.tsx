"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Users,
  Eye,
  Edit,
  Trash,
  Download,
  Share2,
  UserPlus,
  MessageSquare,
  BarChart,
} from "lucide-react"
import { AddEventForm } from "./add-event-form"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from 'react-redux'
import { setEvent } from "@/store/slices/eventSlice"
import { RootState } from "@/store"

export function EventsList() {
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState("")
  const [events, setEvents] = useState<any[]>([])
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const fetchEvents = async () => {
    axios
      .get(`${apiUrl}/api/event/`)
      .then((response) => {
        if (response.data.success) {
          setEvents(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Fonctions pour gérer les interactions avec les événements de la page d'accueil
  const handleHomePageEventInteraction = (eventId: string, action: string) => {
    // Dans une application réelle, ceci enregistrerait l'interaction dans une base de données

    // Simuler une mise à jour des données
    switch (action) {
      case "view":
        console.log(`Vue de l'événement ${eventId} depuis la page d'accueil`)
        break
      case "favorite":
        console.log(`Événement ${eventId} ajouté aux favoris depuis la page d'accueil`)
        break
      case "share":
        console.log(`Événement ${eventId} partagé depuis la page d'accueil`)
        break
      case "register":
        console.log(`Inscription à l'événement ${eventId} depuis la page d'accueil`)
        break
      default:
        break
    }
  }

  const Router = useRouter()
  const handleViewEvent = (event: any) => {
    dispatch(setEvent(event))
    Router.push(`/events/${event.id}`)
  }

  const handleEditEvent = (eventId: number) => {
    Router.push(`/dashboard/events/${eventId}/edit`)
  }

  const handleManageAttendees = (eventId: string) => {
    Router.push(`/dashboard/events/${eventId}/participants`)
  }

  const handleSendReminder = (eventId: string) => {
    Router.push(`/dashboard/events/${eventId}/send-reminder`)
  }

  const handleViewStatistics = (eventId: string) => {
    Router.push(`/dashboard/events/${eventId}/statistics`)
  }

const handleDownloadPoster = (eventId: string) => {
  axios
    .get(`${apiUrl}/api/event/fiche-poster/${eventId}`, {
      responseType: "blob",
    })
    .then((response) => {
      const blob = new Blob([response.data]);

      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const contentDisposition = response.headers['content-disposition'];
      let filename = 'poster.png';

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      link.href = downloadURL;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadURL);
    })
    .catch((err) => {
      console.error("Failed to download poster:", err);
    });
};


  const handleShareEvent = (eventId: string) => {
    Router.push(`/dashboard/events/${eventId}/share`)
  }

  // Completed
  const handleCancelEvent = (eventId: string) => {
    try {
      const toastId = toast.loading("Deleting Event ...")
      if (confirm(`Are You Sure About Deleting This Event ?`)) {
        axios.delete(`${apiUrl}/api/event/${eventId}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then((response) => {
          toast.success(`${response.data.message}!`, { id: toastId })
          if (fetchEvents) fetchEvents()
        })
        .catch(error => {
          console.log(error)
          toast.error("Error While Deleting The Event")
        })
      }
      else {
        toast.dismiss("Dissmised")
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => Router.push("/dashboard/events/home-stats")}
            >
              <BarChart className="h-4 w-4" />
              <span>Statistiques</span>
            </Button>
            <Link href="/events">
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Voir public</span>
              </Button>
            </Link>
            <AddEventForm fetchEvents={fetchEvents} />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{event.type}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground text-xs mt-1">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span>{event.capacity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>
                        {event.status === "upcoming" ? "Upcoming" : "Completed"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View Event"
                          onClick={() => handleViewEvent(event)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditEvent(event.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Modifier l'événement</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleManageAttendees(event.id)}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              <span>Gérer les participants</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendReminder(event.id)}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              <span>Envoyer un rappel</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewStatistics(event.id)}>
                              <BarChart className="mr-2 h-4 w-4" />
                              <span>Statistiques d'interaction</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDownloadPoster(event.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              <span>Télécharger l'affiche</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShareEvent(event.id)}>
                              <Share2 className="mr-2 h-4 w-4" />
                              <span>Partager l'événement</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleCancelEvent(event.id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Annuler l'événement</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No events found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

