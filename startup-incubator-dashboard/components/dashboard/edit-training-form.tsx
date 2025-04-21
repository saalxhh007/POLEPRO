"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Clock, Upload, Plus, Trash2, Save } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Schéma de validation pour le formulaire
const formSchema = z.object({
  title: z.string().min(5, {
    message: "Le titre doit contenir au moins 5 caractères",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères",
  }),
  instructor: z.string().min(2, {
    message: "Le nom de l'instructeur est requis",
  }),
  category: z.string({
    required_error: "Veuillez sélectionner une catégorie",
  }),
  level: z.string({
    required_error: "Veuillez sélectionner un niveau",
  }),
  duration: z.string().min(1, {
    message: "La durée est requise",
  }),
  startDate: z.date({
    required_error: "La date de début est requise",
  }),
  endDate: z.date({
    required_error: "La date de fin est requise",
  }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Format d'heure invalide (HH:MM)",
  }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Format d'heure invalide (HH:MM)",
  }),
  location: z.string().min(2, {
    message: "Le lieu est requis",
  }),
  capacity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "La capacité doit être un nombre positif",
  }),
  materials: z.array(z.string()).optional(),
  prerequisites: z.string().optional(),
  objectives: z.string().optional(),
  featured: z.boolean().default(false),
  registrationOpen: z.boolean().default(true),
  sendReminders: z.boolean().default(true),
  certificateAvailable: z.boolean().default(false),
  image: z.string().optional(),
})

interface EditTrainingFormProps {
  trainingId: string
}

export function EditTrainingForm({ trainingId }: EditTrainingFormProps) {
  const router = useRouter()
  const [materials, setMaterials] = useState<string[]>(["Slides", "Workbook", "Case Studies"])
  const [newMaterial, setNewMaterial] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Données fictives pour la formation existante
  const existingTraining = {
    id: trainingId,
    title: "Fondamentaux du Business Model Canvas",
    description:
      "Apprenez à construire et analyser votre modèle d'affaires avec cette formation complète sur le Business Model Canvas. Vous découvrirez comment identifier vos segments de clientèle, votre proposition de valeur, vos canaux de distribution, et bien plus encore.",
    instructor: "Marie Dupont",
    category: "Business",
    level: "Débutant",
    duration: "2 jours",
    startDate: new Date("2023-11-15T09:00:00"),
    endDate: new Date("2023-11-16T17:00:00"),
    startTime: "09:00",
    endTime: "17:00",
    location: "Salle de conférence A",
    capacity: "20",
    materials: ["Slides", "Workbook", "Case Studies"],
    prerequisites:
      "Aucun prérequis particulier. Cette formation est accessible à tous les entrepreneurs, qu'ils soient en phase de démarrage ou déjà établis.",
    objectives:
      "À la fin de cette formation, vous serez capable de:\n- Comprendre les 9 blocs du Business Model Canvas\n- Analyser votre modèle d'affaires actuel\n- Identifier les opportunités d'amélioration\n- Tester de nouvelles hypothèses\n- Présenter votre modèle d'affaires de manière claire et convaincante",
    featured: true,
    registrationOpen: true,
    sendReminders: true,
    certificateAvailable: false,
    image: "",
  }

  // Initialiser le formulaire avec les données existantes
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: existingTraining.title,
      description: existingTraining.description,
      instructor: existingTraining.instructor,
      category: existingTraining.category,
      level: existingTraining.level,
      duration: existingTraining.duration,
      startDate: existingTraining.startDate,
      endDate: existingTraining.endDate,
      startTime: existingTraining.startTime,
      endTime: existingTraining.endTime,
      location: existingTraining.location,
      capacity: existingTraining.capacity,
      materials: existingTraining.materials,
      prerequisites: existingTraining.prerequisites,
      objectives: existingTraining.objectives,
      featured: existingTraining.featured,
      registrationOpen: existingTraining.registrationOpen,
      sendReminders: existingTraining.sendReminders,
      certificateAvailable: existingTraining.certificateAvailable,
      image: "",
    },
  })

  // Détecter les changements dans le formulaire
  form.watch(() => setHasChanges(true))

  // Fonction pour ajouter un matériel
  const addMaterial = () => {
    if (newMaterial.trim() !== "") {
      const updatedMaterials = [...materials, newMaterial.trim()]
      setMaterials(updatedMaterials)
      form.setValue("materials", updatedMaterials)
      setNewMaterial("")
      setHasChanges(true)
    }
  }

  // Fonction pour supprimer un matériel
  const removeMaterial = (index: number) => {
    const updatedMaterials = [...materials]
    updatedMaterials.splice(index, 1)
    setMaterials(updatedMaterials)
    form.setValue("materials", updatedMaterials)
    setHasChanges(true)
  }

  // Fonction pour soumettre le formulaire
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Formation mise à jour:", values)

      toast({
        title: "Formation mise à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      })

      setHasChanges(false)

      // Rediriger vers la liste des formations
      router.push("/dashboard/trainings")
      router.refresh()
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la formation:", error)

      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la formation.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {hasChanges && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertDescription className="flex items-center justify-between">
              <span>Vous avez des modifications non enregistrées.</span>
              <Button type="submit" disabled={isSubmitting} size="sm">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer les modifications
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Informations de base</TabsTrigger>
            <TabsTrigger value="schedule">Horaires et lieu</TabsTrigger>
            <TabsTrigger value="content">Contenu et matériels</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre de la formation</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre de la formation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instructor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructeur</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'instructeur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description détaillée de la formation" className="min-h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Communication">Communication</SelectItem>
                        <SelectItem value="Technologie">Technologie</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Juridique">Juridique</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un niveau" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Débutant">Débutant</SelectItem>
                        <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                        <SelectItem value="Avancé">Avancé</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de début</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
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

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de fin</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de début</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input type="time" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de fin</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input type="time" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: 2 jours, 4 heures, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu</FormLabel>
                    <FormControl>
                      <Input placeholder="Lieu de la formation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacité maximale</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormDescription>Nombre maximum de participants</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objectifs d'apprentissage</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Objectifs que les participants atteindront"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Décrivez ce que les participants apprendront</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prerequisites"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prérequis</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Connaissances ou compétences requises" className="min-h-20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="materials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matériels de formation</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Ajouter un matériel (slides, workbook, etc.)"
                          value={newMaterial}
                          onChange={(e) => setNewMaterial(e.target.value)}
                        />
                        <Button type="button" variant="outline" size="icon" onClick={addMaterial}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <FormDescription>Ajoutez les matériels qui seront fournis aux participants</FormDescription>

                      {materials.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {materials.map((material, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                              <span>{material}</span>
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeMaterial(index)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image de la formation</FormLabel>
                  <FormControl>
                    <div className="border rounded-md p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-32 h-32 border rounded-md overflow-hidden">
                          <img
                            src="/placeholder.svg?height=128&width=128"
                            alt="Aperçu de l'image"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button type="button" variant="secondary">
                            <Upload className="mr-2 h-4 w-4" />
                            Changer l'image
                          </Button>
                          <p className="text-xs text-muted-foreground">PNG, JPG ou GIF jusqu'à 5MB</p>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Image qui sera affichée sur la page de la formation</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Mettre en avant</FormLabel>
                        <FormDescription>Afficher cette formation en évidence sur la page d'accueil</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationOpen"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Inscriptions ouvertes</FormLabel>
                        <FormDescription>Permettre aux utilisateurs de s'inscrire à cette formation</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sendReminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Envoyer des rappels</FormLabel>
                        <FormDescription>Envoyer automatiquement des rappels aux participants</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="certificateAvailable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Certificat disponible</FormLabel>
                        <FormDescription>Délivrer un certificat aux participants après la formation</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/trainings")}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement en cours..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

