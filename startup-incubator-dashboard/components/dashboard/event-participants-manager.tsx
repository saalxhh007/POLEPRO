"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Check, X, Mail, Phone, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import { AddParticipantForm } from "../events/add-participant-form"

type Participant = {
  id: string
  name: string
  email: string
  phone: string
  organization?: string
  role: string
  status: "pending" | "confirmed" | "declined"
  expectations: string
}

interface EventParticipantsManagerProps {
  eventId: string
}

export function EventParticipantsManager({ eventId }: EventParticipantsManagerProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [participants, setParticipants] = useState<Participant[]>([])

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const fetchParticipants = async () => {
    try {
      axios
        .get(`${apiUrl}/api/participent/all`)
        .then((response) => {
          setParticipants(response.data.participants)
        })
        .catch((err) => {
          console.error(err)
        })
    } catch {}
  }

  const filteredParticipants = participants.filter((participant) => {
    if (activeTab !== "all" && participant.status !== activeTab) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        participant.name.toLowerCase().includes(query) ||
        participant.email.toLowerCase().includes(query) ||
        participant.organization?.toLowerCase().includes(query) ||
        participant.role?.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleApproveParticipant = (participantId: string) => {
    try {
      axios
        .post(`${apiUrl}/api/participent/admin/approve/${participantId}`, {
          status: "confirmed",
        })
        .then((response) => {
          setParticipants((prev) =>
            prev.map((p) => (p.id === participantId ? { ...p, status: "confirmed" as const } : p)),
          )
          console.log(response.data)
        })
      fetchParticipants().catch((err) => {
        console.error("Failed to approve participant:", err)
      })
    } catch (error) {
      console.error("Failed to approve participant:", error)
    }
  }

  const handleDeclineParticipant = (participantId: string) => {
    try {
      axios
        .post(`${apiUrl}/api/participent/admin/approve/${participantId}`, {
          status: "declined",
        })
        .then((response) => {
          setParticipants((prev) =>
            prev.map((p) => (p.id === participantId ? { ...p, status: "declined" as const } : p)),
          )
        })
      fetchParticipants().catch((err) => {
        console.error("Failed to approve participant:", err)
      })
    } catch (error) {
      console.error("Failed to approve participant:", error)
    }
  }

  const handleSendEmail = (participantId: string) => {
    const participant = participants.find((p) => p.id === participantId)
    alert(`Envoi d'un email à ${participant?.name} (${participant?.email})`)
  }

  const handleExportParticipants = async () => {
    axios.get(`${apiUrl}/api/participants/export`, {
      responseType: 'blob',
    })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'participants.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(err => {
        console.error("Failed to export participants:", err);
      })
  };
  
  useEffect(() => {
    fetchParticipants()
  }, [])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des participants</CardTitle>
        <CardDescription>Gérez les inscriptions et les participants à l'événement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un participant..."
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
            <Button variant="outline" className="flex items-center gap-2" onClick={handleExportParticipants}>
              <Download className="h-4 w-4" />
              <span>Exporter</span>
            </Button>
            <AddParticipantForm onSuccess={fetchParticipants} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmés</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="declined">Refusés</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Organisation</TableHead>
                <TableHead>Expectations</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-sm text-muted-foreground">{participant.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                          <span>{participant.email}</span>
                        </div>
                        {participant.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                            <span>{participant.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{participant.organization || "-"}</TableCell>
                    <TableCell>{participant.expectations}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          participant.status === "confirmed"
                            ? "default"
                            : participant.status === "pending"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {participant.status === "confirmed"
                          ? "Confirmé"
                          : participant.status === "pending"
                            ? "En attente"
                            : "Refusé"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {participant.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Approuver"
                              onClick={() => handleApproveParticipant(participant.id)}
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Refuser"
                              onClick={() => handleDeclineParticipant(participant.id)}
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleSendEmail(participant.id)}>
                              <Mail className="mr-2 h-4 w-4" />
                              <span>Envoyer un email</span>
                            </DropdownMenuItem>
                            {participant.status === "confirmed" && (
                              <DropdownMenuItem onClick={() => handleDeclineParticipant(participant.id)}>
                                <X className="mr-2 h-4 w-4" />
                                <span>Annuler la participation</span>
                              </DropdownMenuItem>
                            )}
                            {participant.status === "declined" && (
                              <DropdownMenuItem onClick={() => handleApproveParticipant(participant.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                <span>Approuver la participation</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucun participant trouvé.
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
