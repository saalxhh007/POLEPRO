"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Edit,
  Trash2,
  Share2,
  Bell,
  BarChart2,
  FormInput,
  FileImage,
  ChevronLeft,
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"

// Type pour les formations
interface Training {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  level: string
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
  duration: string
  location: string
  capacity: number
  registeredCount: number
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  featured: boolean
  objectives?: string
  prerequisites?: string
  materials?: string[]
  registrationOpen: boolean
  sendReminders: boolean
  certificateAvailable: boolean
}

// Type pour les participants
interface Participant {
  id: string
  name: string
  email: string
  company: string
  position: string
  registrationDate: Date
  status: "registered" | "confirmed" | "attended" | "cancelled" | "no-show"
}

export function TrainingDetails({ id }: { id: string }) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Données fictives pour une formation
  const training: Training = {
    id,
    title: "Fondamentaux du Business Model Canvas",
    description:
      "Cette formation vous permettra de maîtriser l'outil Business Model Canvas pour structurer et visualiser votre modèle d'affaires. Vous apprendrez à identifier les éléments clés de votre proposition de valeur, vos segments de clientèle, vos canaux de distribution, vos sources de revenus et votre structure de coûts.",
    instructor: "Marie Dupont",
    category: "Business",
    level: "Débutant",
    startDate: new Date("2023-11-15"),
    endDate: new Date("2023-11-16"),
    startTime: "09:00",
    endTime: "17:00",
    duration: "2 jours (14 heures)",
    location: "Salle de conférence A, Paris",
    capacity: 20,
    registeredCount: 15,
    status: "upcoming",
    featured: true,
    objectives:
      "À l'issue de cette formation, vous serez capable de :\n- Comprendre les 9 blocs du Business Model Canvas\n- Analyser votre modèle d'affaires actuel\n- Identifier les opportunités d'innovation\n- Tester et valider vos hypothèses\n- Présenter votre modèle d'affaires de manière claire et convaincante",
    prerequisites:
      "Aucun prérequis spécifique. Cette formation s'adresse aux entrepreneurs en herbe, aux porteurs de projets et aux dirigeants d'entreprise souhaitant repenser leur modèle d'affaires.",
    materials: [
      "Support de cours au format PDF",
      "Templates de Business Model Canvas",
      "Études de cas et exemples",
      "Accès à la plateforme en ligne pendant 3 mois",
    ],
    registrationOpen: true,
    sendReminders: true,
    certificateAvailable: true,
  }

  // Données fictives pour les participants
  const participants: Participant[] = [
    {
      id: "1",
      name: "Jean Martin",
      email: "jean.martin@example.com",
      company: "Startup XYZ",
      position: "CEO",
      registrationDate: new Date("2023-10-05"),
      status: "confirmed",
    },
    {
      id: "2",
      name: "Sophie Dubois",
      email: "sophie.dubois@example.com",
      company: "Tech Innovate",
      position: "Product Manager",
      registrationDate: new Date("2023-10-08"),
      status: "registered",
    },
    {
      id: "3",
      name: "Thomas Leroy",
      email: "thomas.leroy@example.com",
      company: "Digital Solutions",
      position: "Marketing Director",
      registrationDate: new Date("2023-10-12"),
      status: "confirmed",
    },
  ]

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return format(date, "d MMMM yyyy", { locale: fr })
  }

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "ongoing":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Fonction pour obtenir le texte du statut en français
  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "À venir"
      case "ongoing":
        return "En cours"
      case "completed":
        return "Terminée"
      case "cancelled":
        return "Annulée"
      default:
        return status
    }
  }

  // Fonction pour obtenir la couleur du badge en fonction du statut du participant
  const getParticipantStatusColor = (status: string) => {
    switch (status) {
      case "registered":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "attended":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "no-show":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Fonction pour obtenir le texte du statut du participant en français
  const getParticipantStatusText = (status: string) => {
    switch (status) {
      case "registered":
        return "Inscrit"
      case "confirmed":
        return "Confirmé"
      case "attended":
        return "Présent"
      case "cancelled":
        return "Annulé"
      case "no-show":
        return "Absent"
      default:
        return status
    }
  }

  // Fonction pour supprimer une formation
  const handleDeleteTraining = () => {
    // Simuler la suppression
    toast({
      title: "Formation supprimée",
      description: "La formation a été supprimée avec succès.",
    })

    // Dans une application réelle, vous feriez un appel API ici
    console.log("Formation supprimée:", id)

    // Rediriger vers la liste des formations
    router.push("/dashboard/trainings")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/trainings")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour aux formations
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/trainings/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={handleDeleteTraining}>
                  Supprimer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{training.title}</CardTitle>
                  <CardDescription className="mt-1">Par {training.instructor}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{training.category}</Badge>
                  <Badge variant="outline">{training.level}</Badge>
                  <Badge className={getStatusColor(training.status)}>{getStatusText(training.status)}</Badge>
                  {training.featured && <Badge variant="secondary">Mise en avant</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Calendar className="mr-2 h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Dates</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(training.startDate)}
                      {training.startDate.toDateString() !== training.endDate.toDateString() &&
                        ` - ${formatDate(training.endDate)}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="mr-2 h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Horaires</div>
                    <div className="text-sm text-muted-foreground">
                      {training.startTime} - {training.endTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="mr-2 h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Lieu</div>
                    <div className="text-sm text-muted-foreground">{training.location}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="mr-2 h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Durée</div>
                    <div className="text-sm text-muted-foreground">{training.duration}</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{training.description}</p>
              </div>

              {training.objectives && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Objectifs d'apprentissage</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{training.objectives}</p>
                  </div>
                </>
              )}

              {training.prerequisites && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Prérequis</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{training.prerequisites}</p>
                  </div>
                </>
              )}

              {training.materials && training.materials.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Matériels de formation</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {training.materials.map((material, index) => (
                        <li key={index}>{material}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="participants">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="participants" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Participants</CardTitle>
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/trainings/${id}/participants`}>
                        <Users className="mr-2 h-4 w-4" />
                        Gérer les participants
                      </Link>
                    </Button>
                  </div>
                  <CardDescription>
                    {training.registeredCount} participants inscrits sur {training.capacity} places disponibles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={(training.registeredCount / training.capacity) * 100} className="h-2" />

                  <div className="mt-4 space-y-4">
                    {participants.slice(0, 3).map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{participant.name}</div>
                            <div className="text-sm text-muted-foreground">{participant.company}</div>
                          </div>
                        </div>
                        <Badge className={getParticipantStatusColor(participant.status)}>
                          {getParticipantStatusText(participant.status)}
                        </Badge>
                      </div>
                    ))}

                    {training.registeredCount > 3 && (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/dashboard/trainings/${id}/participants`}>Voir tous les participants</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de la formation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Inscriptions ouvertes</div>
                      <div className="text-sm text-muted-foreground">
                        Les utilisateurs peuvent s'inscrire à cette formation
                      </div>
                    </div>
                    <Badge variant={training.registrationOpen ? "default" : "outline"}>
                      {training.registrationOpen ? "Activé" : "Désactivé"}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Rappels automatiques</div>
                      <div className="text-sm text-muted-foreground">
                        Envoyer des rappels aux participants avant la formation
                      </div>
                    </div>
                    <Badge variant={training.sendReminders ? "default" : "outline"}>
                      {training.sendReminders ? "Activé" : "Désactivé"}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Certificat disponible</div>
                      <div className="text-sm text-muted-foreground">
                        Les participants reçoivent un certificat après la formation
                      </div>
                    </div>
                    <Badge variant={training.certificateAvailable ? "default" : "outline"}>
                      {training.certificateAvailable ? "Activé" : "Désactivé"}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Mise en avant</div>
                      <div className="text-sm text-muted-foreground">
                        La formation est mise en avant sur la page d'accueil
                      </div>
                    </div>
                    <Badge variant={training.featured ? "default" : "outline"}>
                      {training.featured ? "Activé" : "Désactivé"}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/dashboard/trainings/${id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier les paramètres
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Formulaire d'inscription</CardTitle>
                    <CardDescription>Personnalisez le formulaire d'inscription pour cette formation</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button className="w-full" asChild>
                      <Link href={`/dashboard/trainings/${id}/registration-form`}>
                        <FormInput className="mr-2 h-4 w-4" />
                        Gérer le formulaire
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Envoyer un rappel</CardTitle>
                    <CardDescription>Envoyez un rappel aux participants inscrits</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button className="w-full" asChild>
                      <Link href={`/dashboard/trainings/${id}/send-reminder`}>
                        <Bell className="mr-2 h-4 w-4" />
                        Envoyer un rappel
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Statistiques</CardTitle>
                    <CardDescription>Consultez les statistiques détaillées de cette formation</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button className="w-full" asChild>
                      <Link href={`/dashboard/trainings/${id}/statistics`}>
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Voir les statistiques
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Partager</CardTitle>
                    <CardDescription>Partagez cette formation sur les réseaux sociaux</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button className="w-full" asChild>
                      <Link href={`/dashboard/trainings/${id}/share`}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Partager
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Affiche</CardTitle>
                    <CardDescription>Téléchargez l'affiche de la formation</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button className="w-full" asChild>
                      <Link href={`/dashboard/trainings/${id}/poster`}>
                        <FileImage className="mr-2 h-4 w-4" />
                        Voir l'affiche
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Aperçu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                <FileImage className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Statut</div>
                  <Badge className={getStatusColor(training.status)}>{getStatusText(training.status)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Participants</div>
                  <div className="text-sm">
                    {training.registeredCount}/{training.capacity}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Catégorie</div>
                  <div className="text-sm">{training.category}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Niveau</div>
                  <div className="text-sm">{training.level}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/trainings/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/dashboard/trainings/${id}/participants`}>
                  <Users className="mr-2 h-4 w-4" />
                  Participants
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/dashboard/trainings/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier la formation
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/dashboard/trainings/${id}/participants`}>
                  <Users className="mr-2 h-4 w-4" />
                  Gérer les participants
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/dashboard/trainings/${id}/send-reminder`}>
                  <Bell className="mr-2 h-4 w-4" />
                  Envoyer un rappel
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/dashboard/trainings/${id}/statistics`}>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Voir les statistiques
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/dashboard/trainings/${id}/poster`}>
                  <FileImage className="mr-2 h-4 w-4" />
                  Télécharger l'affiche
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

