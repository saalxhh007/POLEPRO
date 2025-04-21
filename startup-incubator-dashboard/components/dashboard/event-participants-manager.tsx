"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Check, X, Mail, Phone, Download, UserPlus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Participant {
  id: string
  name: string
  email: string
  phone?: string
  organization?: string
  role?: string
  status: "pending" | "confirmed" | "declined"
  registrationDate: string
  notes?: string
  avatar?: string
}

interface EventParticipantsManagerProps {
  eventId: string
}

export function EventParticipantsManager({ eventId }: EventParticipantsManagerProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Dans une application réelle, vous récupéreriez les participants depuis une API
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "1",
      name: "Ahmed Benali",
      email: "ahmed.benali@example.com",
      phone: "+213 555 123 456",
      organization: "Université de Guelma",
      role: "Étudiant",
      status: "confirmed",
      registrationDate: "2025-05-15",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Samira Hadj",
      email: "samira.hadj@example.com",
      phone: "+213 555 234 567",
      organization: "TechInnovate",
      role: "Entrepreneure",
      status: "confirmed",
      registrationDate: "2025-05-16",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Karim Meziane",
      email: "karim.meziane@example.com",
      phone: "+213 555 345 678",
      organization: "StartupAlgeria",
      role: "Développeur",
      status: "pending",
      registrationDate: "2025-05-17",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      name: "Leila Bouaziz",
      email: "leila.bouaziz@example.com",
      phone: "+213 555 456 789",
      organization: "Digital Solutions",
      role: "Designer",
      status: "confirmed",
      registrationDate: "2025-05-18",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "5",
      name: "Omar Taleb",
      email: "omar.taleb@example.com",
      phone: "+213 555 567 890",
      organization: "Incubateur BAG",
      role: "Investisseur",
      status: "declined",
      registrationDate: "2025-05-19",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "6",
      name: "Fatima Zahra",
      email: "fatima.zahra@example.com",
      phone: "+213 555 678 901",
      organization: "FinTech Algérie",
      role: "Étudiante",
      status: "pending",
      registrationDate: "2025-05-20",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "7",
      name: "Youcef Kaddour",
      email: "youcef.kaddour@example.com",
      phone: "+213 555 789 012",
      organization: "AgriTech Solutions",
      role: "Entrepreneur",
      status: "confirmed",
      registrationDate: "2025-05-21",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const filteredParticipants = participants.filter((participant) => {
    // Filtrer par statut si nécessaire
    if (activeTab !== "all" && participant.status !== activeTab) {
      return false
    }

    // Filtrer par recherche
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
    setParticipants((prev) => prev.map((p) => (p.id === participantId ? { ...p, status: "confirmed" as const } : p)))
  }

  const handleDeclineParticipant = (participantId: string) => {
    setParticipants((prev) => prev.map((p) => (p.id === participantId ? { ...p, status: "declined" as const } : p)))
  }

  const handleSendEmail = (participantId: string) => {
    const participant = participants.find((p) => p.id === participantId)
    alert(`Envoi d'un email à ${participant?.name} (${participant?.email})`)
  }

  const handleExportParticipants = () => {
    alert("Exportation de la liste des participants au format CSV")
  }

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
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Ajouter un participant</span>
            </Button>
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
                <TableHead>Date d'inscription</TableHead>
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
                        <Avatar>
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                          <AvatarFallback>{participant.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
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
                    <TableCell>{participant.registrationDate}</TableCell>
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

