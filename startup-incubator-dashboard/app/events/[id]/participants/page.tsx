"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import { ChevronLeft, Download, Search, UserPlus } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useState } from "react"

interface Event {
  id: number;
  title: string;
  type: string;
  description: string;
  date: string;
  time: string;
  capacity: number;
  location: string;
  fiche?: string | null;
  fiche_alternatif?: string | null;
  fiche_title?: string | null;
  tags: string;
  supp?: string | null;
}
export default function EventParticipantsPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>({
    id: 0,
    title: '',
    type: '',
    description: '',
    date: '',
    time: '',
    capacity: 0,
    location: '',
    fiche: null,
    fiche_alternatif: null,
    fiche_title: null,
    tags: '',
    supp: null,
  });
  const [participants, setParticipants] = useState<any[]>([])
  const [eventId, setEventId] = useState<string | null>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params
      setEventId(resolvedParams.id)
    }
    fetchParams()
  }, [params])
  
  const fetchEvent = () => {
    axios
      .get(`${apiUrl}/api/event/${eventId}`)
      .then((response) => {
        setEvent(response.data.data)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  useEffect(() => {
    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

  useEffect(() => {
    if (eventId) {
      console.log(event);
    }
  }, [event])
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link
          href={`/events/${eventId}`}
          className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Retour à l'événement
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Participants</h1>
            <p className="text-muted-foreground">Liste des participants à l'événement: {event?.title}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Exporter CSV</span>
            </Button>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Ajouter un participant</span>
            </Button>
            <Link href="/dashboard/events">
              <Button variant="secondary">Gérer dans le dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Tous les participants ({participants.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Rechercher..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Organisation</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">{participant.name}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                  <TableCell>{participant.organization}</TableCell>
                  <TableCell>{participant.registrationDate}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        participant.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {participant.status === "confirmed" ? "Confirmé" : "En attente"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

