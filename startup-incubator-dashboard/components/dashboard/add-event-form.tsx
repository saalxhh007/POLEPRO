"use client"
import type React from "react"
import { DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, PlusCircle, X, Upload, ImageIcon, Clock, MapPin, Users, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"

interface AddEventFormProps {
  fetchEvents?: () => void
}
interface Intervenant {
  id: number
  nom: string
  expertise: string
  bio?: string
  photo?: string
  email: string
  telephone?: string
  organisation?: string
  event_id?: number
  role?: string
}

const EVENT_TYPES = ["workshop", "conference", "networking", "panel", "talk", "masterclass", "other"]

const formSchema = z.object({
  title: z.string().min(1, "Title Is Required"),
  type: z.string().min(1, "Type Is Required"),
  description: z.string().optional(),
  date: z.date({
    required_error: "Date Is Required",
  }),
  time: z.string().min(1, "Time Is Required"),
  location: z.string().min(1, "Location Is Required"),
  capacity: z.coerce.number().min(1, "Capacity Is 1 personne Minimum"),
  tags: z.string().optional(),
  // fiche
  fiche_title: z.string().optional(),
  fiche_alternatif: z.string().optional(),
  // supp
  // for intervenants table
  intervenants: z.array(z.string()),
})

const newIntervenantSchema = z.object({
  nom: z.string().min(1, "Name is required"),
  expertise: z.string().min(1, "Expertise is required"),
  bio: z.string().optional(),
  email: z.string().email("Invalid email address"),
  telephone: z.string().optional(),
  organisation: z.string().optional(),
  event_id: z.number().optional(),
  role: z.string().min(1, "Role is required"),
})

type FormValues = z.infer<typeof formSchema>
type NewIntervenantFormValues = z.infer<typeof newIntervenantSchema>

export function AddEventForm({ fetchEvents }: any) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [selectedFiche, setSelectedFiche] = useState<File | null>(null)
  const [fichePreview, setFichePreview] = useState<string | null>(null)
  const [supp, setSupp] = useState<File[]>([])
  const [intervenants, setIntervenants] = useState<Intervenant[]>([])
  const [newIntervenantDialogOpen, setNewIntervenantDialogOpen] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const [selectedIntervenantPhoto, setSelectedIntervenantPhoto] = useState<File | null>(null)
  const [intervenantPhotoPreview, setIntervenantPhotoPreview] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      description: "",
      date: undefined,
      time: "",
      location: "",
      capacity: 0,
      tags: "",
      // fiche
      fiche_title: "",
      fiche_alternatif: "",
      // supp
      intervenants: [],
    },
  })

  const newIntervenantForm = useForm<NewIntervenantFormValues>({
    resolver: zodResolver(newIntervenantSchema),
    defaultValues: {
      nom: "",
      expertise: "",
      bio: "",
      email: "",
      telephone: "",
      organisation: "",
      event_id: undefined,
      role: "",
    },
  })

  const handleFicheChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFiche(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setFichePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSuppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      setSupp((prev) => [...prev, ...fileArray])
    }
  }

  const removeSupp = (index: number) => {
    setSupp((prev) => prev.filter((_, i) => i !== index))
  }

  const handleIntervenantPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedIntervenantPhoto(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setIntervenantPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  // ( this would come from the backend )
  const handleCreateNewIntervenant = (data: NewIntervenantFormValues) => {
    
    const intervenantFormData = new FormData()
    intervenantFormData.append("nom", data.nom)
    intervenantFormData.append("expertise", data.expertise)
    intervenantFormData.append("email", data.email)
    intervenantFormData.append("role", data.role)

    if (data.bio) intervenantFormData.append("bio", data.bio)
    if (data.telephone) intervenantFormData.append("telephone", data.telephone)
    if (data.organisation) intervenantFormData.append("organisation", data.organisation)
    if (data.event_id) intervenantFormData.append("event_id", data.event_id.toString())
    if (selectedIntervenantPhoto) {
      intervenantFormData.append("photo", selectedIntervenantPhoto)
    }


    const toastId = toast.loading("Adding Intervenat")
    axios.post(`${apiUrl}/api/intervenant`, intervenantFormData, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    })
      .then((response) => {
        const savedIntervenant = response.data.data
        setIntervenants((prev) => [...prev, savedIntervenant])
        const currentIntervenants = form.getValues("intervenants")
        form.setValue("intervenants", [...currentIntervenants, savedIntervenant.id.toString()])
        setNewIntervenantDialogOpen(false)
        newIntervenantForm.reset()
        setSelectedIntervenantPhoto(null)
        setIntervenantPhotoPreview(null)
        toast.success("Intervenant créé avec succès!")
        toast.dismiss(toastId)
      })
      .catch((err) => {
        console.error("Error creating intervenant:", err)
        toast.error("Erreur lors de la création de l’intervenant")
        toast.dismiss(toastId)
    })
  }

  function onSubmit(data: FormValues) {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString())
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, String(value))
      }
    })

    // Add fiche if selected
    if (selectedFiche) {
      formData.append("fiche", selectedFiche)
    }
    supp.forEach((doc, index) => {
      formData.append(`supp`, doc)
    })
    const valuesArray = Array.from(formData.entries())
    const toastId = toast.loading("Création de l'événement...")

    axios
      .post(`${apiUrl}/api/event`, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        toast.success("Événement créé avec succès!", { id: toastId })
        if (fetchEvents) fetchEvents()
        setSelectedFiche(null)
        setFichePreview(null)
        setSupp([])
        setOpen(false)
      })
      .catch((error) => {
        console.log(error)
        toast.error("Error While Creating The Event", { id: toastId })
      })
  }

  const fetchIntervenants = () => {
      axios.get(`${apiUrl}/api/intervenant`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        
        .then((response) => {
          setIntervenants(response.data.data);
        })
        .catch((err) => {
          console.error('Error fetching intervenants:', err);
      })
  };
  
  useEffect(() => {
    if (open) {
      fetchIntervenants();
    }
  }, [open]);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Événement
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel événement</DialogTitle>
            <DialogDescription>Remplissez les informations pour créer un nouvel événement.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form id="event-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="basic">Informations de base</TabsTrigger>
                  <TabsTrigger value="details">Détails</TabsTrigger>
                  <TabsTrigger value="media">Médias & Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre de l'événement</FormLabel>
                          <FormControl>
                            <Input placeholder="Titre de l'événement" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type d'événement</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EVENT_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type === "workshop" && "Atelier"}
                                  {type === "conference" && "Conférence"}
                                  {type === "networking" && "Networking"}
                                  {type === "panel" && "Panel"}
                                  {type === "talk" && "Talk"}
                                  {type === "masterclass" && "Masterclass"}
                                  {type === "other" && "Autre"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Sélectionner une date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <FormLabel>Heure</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <div className="relative">
                                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input type="time" className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <span>à</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lieu</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Lieu de l'événement" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacité</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder="Nombre de places"
                                className="pl-10"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description détaillée</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description complète de l'événement"
                            className="min-h-[150px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="intervenants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Intervenants</FormLabel>
                        <div className="flex gap-2">
                          <Select
                            onValueChange={(value) => {
                              if (!field.value.includes(value)) {
                                field.onChange([...field.value, value])
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Sélectionner un intervenant" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {intervenants.map((intervenant) => (
                                <SelectItem
                                  key={intervenant.id}
                                  value={intervenant.id.toString()}
                                  disabled={field.value.includes(intervenant.id.toString())}
                                >
                                  {intervenant.nom} - {intervenant.role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button type="button" variant="outline" onClick={() => setNewIntervenantDialogOpen(true)}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Nouveau
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map((intervenantId: any) => {
                            const intervenant = intervenants.find((i) => i.id === intervenantId)
                            return (
                              <Badge key={intervenantId} variant="secondary" className="flex items-center gap-1">
                                {intervenant?.nom}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0"
                                  onClick={() => {
                                    field.onChange(field.value.filter((id) => id !== intervenantId))
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                  <span className="sr-only">Supprimer</span>
                                </Button>
                              </Badge>
                            )
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (séparés par des virgules)</FormLabel>
                        <FormControl>
                          <Input placeholder="innovation, entrepreneuriat, financement..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="media" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <FormLabel>Affiche de l'événement</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                        <input
                          type="file"
                          id="fiche"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFicheChange}
                        />
                        <label htmlFor="fiche" className="cursor-pointer">
                          {fichePreview ? (
                            <div className="flex flex-col items-center">
                              <div className="relative w-full max-w-[200px] aspect-[3/4] mb-4">
                                <img
                                  src={fichePreview || "/placeholder.svg"}
                                  alt="Aperçu de l'affiche"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <Button variant="outline" size="sm" type="button">
                                Changer l'affiche
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                              <p className="text-sm font-medium">Cliquez pour ajouter une affiche</p>
                              <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou PDF jusqu'à 5MB</p>
                            </div>
                          )}
                        </label>
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="fiche_title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Titre de l'affiche</FormLabel>
                              <FormControl>
                                <Input placeholder="Titre à afficher sur l'affiche" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="fiche_alternatif"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Texte alternatif</FormLabel>
                              <FormControl>
                                <Input placeholder="Description pour l'accessibilité" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-start space-x-2">
                          <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <p className="text-xs text-muted-foreground">
                            L'affiche sera utilisée pour promouvoir l'événement sur le site et les réseaux sociaux.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <FormLabel>Documents supplémentaires</FormLabel>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="supp"
                        className="hidden"
                        multiple
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        onChange={handleSuppChange}
                      />
                      <label htmlFor="supp" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Cliquez pour ajouter des documents</p>
                          <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, PPT, PPTX jusqu'à 10MB</p>
                        </div>
                      </label>
                    </div>

                    {supp.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <FormLabel>Documents sélectionnés</FormLabel>
                        <div className="space-y-2">
                          {supp.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                              <span className="text-sm truncate max-w-[80%]">{doc.name}</span>
                              <Button variant="ghost" size="sm" onClick={() => removeSupp(index)} type="button">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" form="event-form">
                  Créer l'événement
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog for creating a new intervenant */}
      <Dialog open={newIntervenantDialogOpen} onOpenChange={setNewIntervenantDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel intervenant</DialogTitle>
            <DialogDescription>
              Entrez les informations du nouvel intervenant. Cliquez sur sauvegarder quand vous avez terminé.
            </DialogDescription>
          </DialogHeader>
          <Form {...newIntervenantForm}>
            <form onSubmit={newIntervenantForm.handleSubmit(handleCreateNewIntervenant)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={newIntervenantForm.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de l'intervenant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newIntervenantForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rôle *</FormLabel>
                      <FormControl>
                        <Input placeholder="Rôle de l'intervenant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={newIntervenantForm.control}
                  name="expertise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expertise *</FormLabel>
                      <FormControl>
                        <Input placeholder="Domaine d'expertise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newIntervenantForm.control}
                  name="organisation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organisation</FormLabel>
                      <FormControl>
                        <Input placeholder="Entreprise ou organisation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={newIntervenantForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemple.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newIntervenantForm.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="+33 1 23 45 67 89" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={newIntervenantForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biographie</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Biographie de l'intervenant..."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Photo de l'intervenant</FormLabel>
                <div className="flex gap-4">
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer flex-1">
                    <input
                      type="file"
                      id="intervenant-photo"
                      className="hidden"
                      accept="image/*"
                      onChange={handleIntervenantPhotoChange}
                    />
                    <label htmlFor="intervenant-photo" className="cursor-pointer">
                      {intervenantPhotoPreview ? (
                        <div className="flex flex-col items-center">
                          <div className="relative w-20 h-20 mb-2">
                            <img
                              src={intervenantPhotoPreview || "/placeholder.svg"}
                              alt="Aperçu de la photo"
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <Button variant="outline" size="sm" type="button">
                            Changer la photo
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Ajouter une photo</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG jusqu'à 2MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setNewIntervenantDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Sauvegarder</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
