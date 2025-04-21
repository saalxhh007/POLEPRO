"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Mail,
  Download,
  Search,
  MoreHorizontal,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  MessageSquare,
  Trash2,
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

// Types pour les participants
type ParticipantStatus = "pending" | "approved" | "rejected" | "waitlist" | "attended" | "no-show"

interface Participant {
  id: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  registrationDate: string
  status: ParticipantStatus
  notes: string
  avatar: string
}

interface TrainingParticipantsManagerProps {
  trainingId: string
  trainingTitle: string
}

export function TrainingParticipantsManager({ trainingId, trainingTitle }: TrainingParticipantsManagerProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState(`Information concernant la formation: ${trainingTitle}`)
  const [emailContent, setEmailContent] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Données fictives pour les participants
  const participants: Participant[] = [
    {
      id: "1",
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      phone: "+33 6 12 34 56 78",
      company: "Startup Innovation",
      position: "CEO",
      registrationDate: "2023-10-15T14:30:00",
      status: "approved",
      notes: "A demandé des informations sur les supports de cours",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Marie Martin",
      email: "marie.martin@example.com",
      phone: "+33 6 23 45 67 89",
      company: "TechSolutions",
      position: "CTO",
      registrationDate: "2023-10-16T09:15:00",
      status: "pending",
      notes: "",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Pierre Durand",
      email: "pierre.durand@example.com",
      phone: "+33 6 34 56 78 90",
      company: "FinTech Plus",
      position: "Product Manager",
      registrationDate: "2023-10-17T11:45:00",
      status: "waitlist",
      notes: "Intéressé par des sessions supplémentaires",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      name: "Sophie Bernard",
      email: "sophie.bernard@example.com",
      phone: "+33 6 45 67 89 01",
      company: "Marketing Pro",
      position: "Marketing Director",
      registrationDate: "2023-10-18T16:20:00",
      status: "rejected",
      notes: "Conflit d'horaire",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "5",
      name: "Thomas Petit",
      email: "thomas.petit@example.com",
      phone: "+33 6 56 78 90 12",
      company: "Design Studio",
      position: "UX Designer",
      registrationDate: "2023-10-19T10:30:00",
      status: "approved",
      notes: "",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "6",
      name: "Claire Moreau",
      email: "claire.moreau@example.com",
      phone: "+33 6 67 89 01 23",
      company: "Agence Digitale",
      position: "Project Manager",
      registrationDate: "2023-10-20T14:00:00",
      status: "pending",
      notes: "A demandé si la formation sera enregistrée",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Filtrer les participants
  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.company.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || participant.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Statistiques des participants
  const stats = {
    total: participants.length,
    approved: participants.filter((p) => p.status === "approved").length,
    pending: participants.filter((p) => p.status === "pending").length,
    waitlist: participants.filter((p) => p.status === "waitlist").length,
    rejected: participants.filter((p) => p.status === "rejected").length,
    capacity: 20,
  }

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "d MMMM yyyy à HH'h'mm", { locale: fr })
  }

  // Fonction pour obtenir la couleur du badge de statut
  const getStatusBadgeVariant = (status: ParticipantStatus) => {
    switch (status) {
      case "approved":
        return "success"
      case "pending":
        return "warning"
      case "waitlist":
        return "secondary"
      case "rejected":
        return "destructive"
      case "attended":
        return "default"
      case "no-show":
        return "outline"
      default:
        return "default"
    }
  }

  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (status: ParticipantStatus) => {
    switch (status) {
      case "approved":
        return "Approuvé"
      case "pending":
        return "En attente"
      case "waitlist":
        return "Liste d'attente"
      case "rejected":
        return "Refusé"
      case "attended":
        return "Présent"
      case "no-show":
        return "Absent"
      default:
        return status
    }
  }

  // Fonction pour gérer la sélection/désélection de tous les participants
  const toggleSelectAll = () => {
    if (selectedParticipants.length === filteredParticipants.length) {
      setSelectedParticipants([])
    } else {
      setSelectedParticipants(filteredParticipants.map((p) => p.id))
    }
  }

  // Fonction pour gérer la sélection/désélection d'un participant
  const toggleSelectParticipant = (id: string) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(selectedParticipants.filter((pId) => pId !== id))
    } else {
      setSelectedParticipants([...selectedParticipants, id])
    }
  }

  // Fonction pour approuver un participant
  const approveParticipant = (id: string) => {
    // Dans une application réelle, vous feriez un appel API ici
    toast({
      title: "Participant approuvé",
      description: "Le participant a été approuvé avec succès.",
    })
  }

  // Fonction pour refuser un participant
  const rejectParticipant = (id: string) => {
    // Dans une application réelle, vous feriez un appel API ici
    toast({
      title: "Participant refusé",
      description: "Le participant a été refusé.",
    })
  }

  // Fonction pour mettre un participant en liste d'attente
  const waitlistParticipant = (id: string) => {
    // Dans une application réelle, vous feriez un appel API ici
    toast({
      title: "Participant en liste d'attente",
      description: "Le participant a été placé en liste d'attente.",
    })
  }

  // Fonction pour envoyer un email aux participants sélectionnés
  const sendEmailToSelected = () => {
    setIsProcessing(true)

    // Simuler un appel API
    setTimeout(() => {
      setIsProcessing(false)
      setIsEmailDialogOpen(false)

      toast({
        title: "Email envoyé",
        description: `Email envoyé à ${selectedParticipants.length} participant(s).`,
      })

      // Réinitialiser le formulaire
      setEmailSubject(`Information concernant la formation: ${trainingTitle}`)
      setEmailContent("")
    }, 1500)
  }

  // Fonction pour exporter la liste des participants
  const exportParticipants = (format: "csv" | "pdf" | "excel") => {
    // Dans une application réelle, vous généreriez le fichier ici
    toast({
      title: "Export réussi",
      description: `La liste des participants a été exportée au format ${format.toUpperCase()}.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total des inscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Capacité: {stats.approved}/{stats.capacity} places
            </p>
            <Progress value={(stats.approved / stats.capacity) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approuvés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((stats.approved / stats.total) * 100)}% des inscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((stats.pending / stats.total) * 100)}% des inscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Liste d'attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.waitlist}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((stats.waitlist / stats.total) * 100)}% des inscriptions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="approved">Approuvés</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="waitlist">Liste d'attente</SelectItem>
              <SelectItem value="rejected">Refusés</SelectItem>
              <SelectItem value="attended">Présents</SelectItem>
              <SelectItem value="no-show">Absents</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={selectedParticipants.length === 0}>
                <Mail className="mr-2 h-4 w-4" />
                Envoyer un email
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Envoyer un email aux participants sélectionnés</DialogTitle>
                <DialogDescription>
                  Cet email sera envoyé à {selectedParticipants.length} participant(s) sélectionné(s).
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Sujet</Label>
                  <Input id="email-subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-content">Contenu</Label>
                  <Textarea
                    id="email-content"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    placeholder="Saisissez le contenu de votre email ici..."
                    className="min-h-[200px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={sendEmailToSelected} disabled={!emailSubject || !emailContent || isProcessing}>
                  {isProcessing ? "Envoi en cours..." : "Envoyer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Format d'export</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => exportParticipants("csv")}>
                <FileText className="mr-2 h-4 w-4" />
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportParticipants("excel")}>
                <FileText className="mr-2 h-4 w-4" />
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportParticipants("pdf")}>
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un participant
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedParticipants.length === filteredParticipants.length && filteredParticipants.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                    aria-label="Sélectionner tous les participants"
                  />
                </TableHead>
                <TableHead>Participant</TableHead>
                <TableHead>Entreprise</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Aucun participant trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredParticipants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedParticipants.includes(participant.id)}
                        onCheckedChange={() => toggleSelectParticipant(participant.id)}
                        aria-label={`Sélectionner ${participant.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{participant.name}</div>
                          <div className="text-sm text-muted-foreground">{participant.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{participant.company}</div>
                      <div className="text-sm text-muted-foreground">{participant.position}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(participant.registrationDate)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(participant.status) as any}>
                        {getStatusLabel(participant.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => approveParticipant(participant.id)}
                                disabled={participant.status === "approved"}
                              >
                                <CheckCircle
                                  className={`h-4 w-4 ${participant.status === "approved" ? "text-green-500" : ""}`}
                                />
                                <span className="sr-only">Approuver</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Approuver</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => waitlistParticipant(participant.id)}
                                disabled={participant.status === "waitlist"}
                              >
                                <Clock
                                  className={`h-4 w-4 ${participant.status === "waitlist" ? "text-blue-500" : ""}`}
                                />
                                <span className="sr-only">Liste d'attente</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mettre en liste d'attente</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => rejectParticipant(participant.id)}
                                disabled={participant.status === "rejected"}
                              >
                                <XCircle
                                  className={`h-4 w-4 ${participant.status === "rejected" ? "text-red-500" : ""}`}
                                />
                                <span className="sr-only">Refuser</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Refuser</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Plus d'actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Envoyer un email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Ajouter une note
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between py-4">
          <div className="text-sm text-muted-foreground">{filteredParticipants.length} participant(s) affiché(s)</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="outline" size="sm" disabled>
              Suivant
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

