"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Search, Calendar, Clock, Video, Users, LinkIcon } from "lucide-react"
// Importer le nouveau composant ScheduleMeetingForm
import { ScheduleMeetingForm } from "./schedule-meeting-form"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

export function MeetingsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [meetingType, setMeetingType] = useState("all")
  const [tab, setTab] = useState("upcoming")

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const meetings = [
    {
      id: "1",
      title: "Revue de Projet EcoTech",
      type: "project-review",
      date: "8 Juin 2025",
      time: "14:00 - 15:00",
      participants: ["Admin", "Alex Green", "Jamie Lee"],
      location: "Salle de Réunion B",
      link: "https://meet.example.com/abc123",
      status: "upcoming",
    },
    {
      id: "2",
      title: "Session de Mentorat MediConnect",
      type: "mentoring",
      date: "9 Juin 2025",
      time: "11:00 - 12:30",
      participants: ["Sarah Johnson", "Michael Chen"],
      location: "Virtuel",
      link: "https://meet.example.com/def456",
      status: "upcoming",
    },
    {
      id: "3",
      title: "Réunion Investisseurs FinLedger",
      type: "investor",
      date: "11 Juin 2025",
      time: "15:00 - 16:30",
      participants: ["Admin", "David Kim", "John Smith", "Emma Wilson"],
      location: "Salle de Conférence A",
      link: "",
      status: "upcoming",
    },
    {
      id: "4",
      title: "Atelier Pitch DataVision AI",
      type: "workshop",
      date: "5 Juin 2025",
      time: "10:00 - 12:00",
      participants: ["Admin", "Priya Patel", "Thomas Wong"],
      location: "Salle de Formation",
      link: "",
      status: "completed",
    },
    {
      id: "5",
      title: "Réunion d'Équipe Hebdomadaire",
      type: "team",
      date: "4 Juin 2025",
      time: "09:00 - 10:00",
      participants: ["Admin", "Tous les mentors"],
      location: "Virtuel",
      link: "https://meet.example.com/ghi789",
      status: "completed",
    },
    {
      id: "6",
      title: "Présentation Urban Mobility",
      type: "project-review",
      date: "3 Juin 2025",
      time: "14:00 - 15:30",
      participants: ["Admin", "Carlos Rodriguez", "Emma Wilson"],
      location: "Salle de Réunion A",
      link: "",
      status: "completed",
    },
  ]
  const filteredMeetings = meetings.filter(
    (meeting) =>
      (meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.participants.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (meetingType === "all" || meeting.type === meetingType) &&
      (tab === "all" || meeting.status === tab),
  )

  // Fonction pour obtenir le badge de type de réunion
  const getMeetingTypeBadge = (type: string) => {
    switch (type) {
      case "project-review":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Revue de Projet</Badge>
      case "mentoring":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Mentorat</Badge>
      case "investor":
        return <Badge className="bg-green-500 hover:bg-green-600">Investisseurs</Badge>
      case "workshop":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Atelier</Badge>
      case "team":
        return <Badge className="bg-slate-500 hover:bg-slate-600">Équipe</Badge>
      default:
        return <Badge>Autre</Badge>
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher des réunions..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={meetingType} onValueChange={setMeetingType}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Type de réunion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="project-review">Revue de Projet</SelectItem>
                <SelectItem value="mentoring">Mentorat</SelectItem>
                <SelectItem value="investor">Investisseurs</SelectItem>
                <SelectItem value="workshop">Atelier</SelectItem>
                <SelectItem value="team">Équipe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ScheduleMeetingForm />
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="completed">Terminées</TabsTrigger>
            <TabsTrigger value="all">Toutes</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="rounded-md border mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Réunion</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMeetings.length > 0 ? (
                filteredMeetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className="font-medium">{meeting.title}</TableCell>
                    <TableCell>{getMeetingTypeBadge(meeting.type)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span>{meeting.date}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground text-xs mt-1">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>{meeting.time}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span>{meeting.participants.length} participants</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {meeting.link ? (
                          <div className="flex items-center text-primary">
                            <Video className="mr-1 h-3 w-3" />
                            <span>Virtuel</span>
                          </div>
                        ) : (
                          <span>{meeting.location}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {meeting.link && (
                          <Button variant="ghost" size="icon" title="Lien de réunion">
                            <LinkIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Ajouter au calendrier</DropdownMenuItem>
                            <DropdownMenuItem>Envoyer un rappel</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Annuler la réunion</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucune réunion trouvée.
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

