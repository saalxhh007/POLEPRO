"use client"

import { Download, Mail, Trash, UserPlus, Search } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios"

import type { Participant, PendingParticipant } from "../types/participant"
import { MoreHorizontal } from "lucide-react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

interface EventParticipantsManagerProps {
  eventId: string
}

const participantFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit comporter au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  phone: z.string().optional(),
  role: z.string().min(2, {
    message: "Le rôle doit comporter au moins 2 caractères.",
  }),
  organization: z.string().optional(),
  expectations: z.string().optional(),
  bio: z.string().optional(),
  expertise: z.string().optional(),
  status: z.string().optional(),
})

type ParticipantFormData = z.infer<typeof participantFormSchema>

export function EventParticipantsManager({ eventId }: EventParticipantsManagerProps) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [pendingParticipants, setPendingParticipants] = useState<PendingParticipant[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentView, setCurrentView] = useState<"participants" | "pending">("participants")
  const [role, setRole] = useState<string>("")
  const ROLES = ["etudiant", "entrepreneur", "developpeur", "designer", "investisseur", "intervenant"]

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [participantForm, setParticipantForm] = useState<ParticipantFormData>({
    name: "",
    email: "",
    phone: "",
    role: "etudiant",
    organization: "",
    expectations: "",
    bio: "",
    expertise: "",
    status: "approved",
  })

  const form = useForm<ParticipantFormData>({
    resolver: zodResolver(participantFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "etudiant",
      organization: "",
      expectations: "",
      bio: "",
      expertise: "",
      status: "approved",
    },
    mode: "onChange",
  })

  const fetchParticipants = async () => {
    setLoading(true)
    axios.get(`${apiUrl}/api/participant/all/${eventId}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        console.log(response.data);
        setParticipants(response.data.participants)
        setPendingParticipants(response.data.pending_participants || [])
      })
      .catch((error) => {
        console.error("Error fetching participants:", error)
        toast.error("Erreur lors du chargement des participants")
      }).finally(() => {
        setLoading(false)
      })
  }

  const handleAdd = (data: ParticipantFormData) => {
    const toastId = toast.loading("Ajout du participant...")
    const payload = {
      ...data,
      eventId,
    }

    axios.post(`${apiUrl}/api/participant/add/${eventId}`, payload, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        console.log(response.data);
        
        toast.success("Participant ajouté avec succès!", { id: toastId })
        setIsAddDialogOpen(false)
        form.reset()
        fetchParticipants()
      })
      .catch((err) => {
        console.error("Error adding participant:", err)
        toast.error("Erreur lors de l'ajout du participant", { id: toastId })
       })
    }

  const handleDelete = async (participantId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce participant ?")) return

    const toastId = toast.loading("Suppression du participant...")
    try {
      await axios.delete(`${apiUrl}/api/participant/delete/${eventId}/${participantId}`)
      toast.success("Participant supprimé avec succès!", { id: toastId })
      fetchParticipants()
    } catch (err) {
      console.error("Error deleting participant:", err)
      toast.error("Erreur lors de la suppression du participant", { id: toastId })
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) {
      toast.error("Veuillez sélectionner au moins un élément")
      return
    }

    try {
      const toastId = toast.loading("Exécution de l'action en cours...")
      await axios.post(`${apiUrl}/api/event/${eventId}/participants/bulk`, {
        action,
        ids: selectedItems,
      })
      toast.success("Action exécutée avec succès!", { id: toastId })
      setSelectedItems([])
      fetchParticipants()
    } catch (error) {
      console.error("Error executing bulk action:", error)
      toast.error("Erreur lors de l'exécution de l'action")
    }
  }

  const handleApprovePending = async (pendingParticipant: PendingParticipant) => {
    const toastId = toast.loading("Approbation du participant...")

    axios
      .post(`${apiUrl}/api/participant/admin/approve/${pendingParticipant.id}`, {
        status: "confirmed"
      }, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        toast.success("Participant accepted avec succès!", { id: toastId })
        fetchParticipants()
       })
      .catch((err) => {
        console.error("Error accepting participant:", err)
        toast.error("Erreur lors de accepting du participant")
       })
    
  }

  const handleRejectPending = async (pendingParticipant: PendingParticipant) => {
      const toastId = toast.loading("Rejet du participant...")
      axios.post(`${apiUrl}/api/participant/admin/approve/${pendingParticipant.id}`, {
      status: "declined",
      }, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
    })
      .then(() => {
        toast.success("Participant declined avec succès!", { id: toastId })
        fetchParticipants()
      })
      .catch((err) => {
        console.error("Error declining participant:", err)
        toast.error("Erreur lors de declining du participant")
      }
    )
  }

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  const handleExportData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/event/${eventId}/participants/export`, {
        responseType: "blob",
      })

      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `participants-${eventId}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
      toast.error("Erreur lors de l'export des données")
    }
  }

  const resetForm = () => {
    setParticipantForm({
      name: "",
      email: "",
      phone: "",
      role: "etudiant",
      organization: "",
      expectations: "",
      bio: "",
      expertise: "",
      status: "",
    })
  }

  const openEditDialog = (participant: Participant) => {
    setEditingParticipant(participant)
    setParticipantForm({
      name: participant.name,
      email: participant.email,
      phone: participant.phone || "",
      role: participant.role,
      organization: participant.organization || "",
      expectations: participant.expectations || "",
      bio: participant.bio || "",
      expertise: participant.expertise || "",
      status: participant.status || "",
    })
  }

  useEffect(() => {
    fetchParticipants()
  }, [eventId])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Chargement des participants...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with search and actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>Participants de l'événement</span>
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                <Button
                  variant={currentView === "participants" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("participants")}
                  className="h-8"
                >
                  Participants ({participants.length})
                </Button>
                <Button
                  variant={currentView === "pending" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("pending")}
                  className="h-8"
                >
                  En attente ({pendingParticipants.length})
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedItems.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions groupées ({selectedItems.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkAction("send-email")}>
                      <Mail className="mr-2 h-4 w-4" />
                      Envoyer un email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => handleBulkAction("delete")}>
                      <Trash className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>

              {currentView === "participants" && (
                <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            {currentView === "participants"
              ? "Gérez les inscriptions et la participation à votre événement. Les étudiants nécessitent une validation."
              : "Participants en attente de validation. Approuvez ou rejetez les demandes d'inscription."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un participant..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conditional content based on current view */}
      <Card>
        <CardContent className="p-0">
          {currentView === "participants" ? (
            <ScrollArea>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedItems.length === participants.length}
                        onCheckedChange={(checked) => setSelectedItems(checked ? participants.map((p) => p.id) : [])}
                      />
                    </TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants
                    .filter((participant) => {
                      const searchTerm = searchQuery.toLowerCase()
                      return (
                        participant.name.toLowerCase().includes(searchTerm) ||
                        participant.email.toLowerCase().includes(searchTerm) ||
                        participant.role.toLowerCase().includes(searchTerm) ||
                        (participant.organization && participant.organization.toLowerCase().includes(searchTerm))
                      )
                    })
                    .map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell className="font-medium">
                          <Checkbox
                            checked={selectedItems.includes(participant.id)}
                            onCheckedChange={() =>
                              setSelectedItems((prev) =>
                                prev.includes(participant.id)
                                  ? prev.filter((id) => id !== participant.id)
                                  : [...prev, participant.id],
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>{participant.name}</TableCell>
                        <TableCell>{participant.email}</TableCell>
                        <TableCell>{participant.role}</TableCell>
                        <TableCell>{participant.organization}</TableCell>
                        <TableCell>
                          {participant.status === "approved" ? (
                            <Badge variant="outline">Actif</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">En attente</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir le menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(participant)}>Modifier</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(participant.id)}>
                                Supprimer
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendEmail(participant.email)}>
                                Envoyer un email
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="p-6">
              {pendingParticipants.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Aucun participant en attente</div>
              ) : (
                <div className="space-y-4">
                  {pendingParticipants
                    .filter(
                      (participant) =>
                        participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        participant.email.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((participant) => (
                      <div key={participant.email} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium">{participant.name}</div>
                          <div className="text-sm text-muted-foreground">{participant.email}</div>
                          <div className="text-sm text-muted-foreground">
                            {participant.role} • {participant.organization || "Aucune organisation"}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprovePending(participant)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectPending(participant)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Rejeter
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Participant Dialog */}
      {isAddDialogOpen && (
        <AlertDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ajouter un participant</AlertDialogTitle>
              <AlertDialogDescription>Ajouter un nouveau participant à l'événement.</AlertDialogDescription>
            </AlertDialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="Nom du participant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex-sb">
                  <FormField
                  
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input id="email" placeholder="Email du participant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numero De Telephone</FormLabel>
                      <FormControl>
                        <Input id="phone" placeholder="Numero De Telephone du participant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  /></div>
                <div className="flex">
                <FormField
                  control={form.control}
                  name="expertise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expertise</FormLabel>
                      <FormControl>
                        <Input id="expertise" placeholder="Expertise du participant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biographie</FormLabel>
                      <FormControl>
                        <Input id="bio" placeholder="Biographie du participant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={(value) => {
                    setRole(value)
                    field.onChange(value)
                  }}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre rôle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organisation</FormLabel>
                      <FormControl>
                        <Input id="organization" placeholder="Organisation du participant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <Button type="submit" disabled={!form.formState.isValid}>
                    Ajouter
                  </Button>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Edit Participant Dialog */}
      {editingParticipant && (
        <AlertDialog open={true} onOpenChange={() => setEditingParticipant(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Modifier le participant</AlertDialogTitle>
              <AlertDialogDescription>Modifier les informations du participant.</AlertDialogDescription>
            </AlertDialogHeader>
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  // Handle edit logic here
                  setEditingParticipant(null)
                }}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="Nom du participant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input id="email" placeholder="Email du participant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rôle</FormLabel>
                      <FormControl>
                        <Input id="role" placeholder="Rôle du participant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organisation</FormLabel>
                      <FormControl>
                        <Input id="organization" placeholder="Organisation du participant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <Button type="submit">Enregistrer</Button>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
