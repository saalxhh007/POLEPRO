"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  MoreHorizontal,
  Search,
  Plus,
  Filter,
  Grid,
  ListIcon,
  Calendar,
  Edit,
  Users,
  Bell,
  BarChart2,
  Share2,
  FileImage,
  FormInput,
  Trash2,
  Eye,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import { toast } from "@/components/ui/use-toast"

// Types pour les formations
interface Training {
  id: string
  title: string
  instructor: string
  category: string
  level: string
  startDate: Date
  endDate: Date
  location: string
  capacity: number
  registeredCount: number
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  featured: boolean
}

export function TrainingsList() {
  const router = useRouter()
  const [view, setView] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Données fictives pour les formations
  const trainings: Training[] = [
    {
      id: "1",
      title: "Fondamentaux du Business Model Canvas",
      instructor: "Marie Dupont",
      category: "Business",
      level: "Débutant",
      startDate: new Date("2023-11-15"),
      endDate: new Date("2023-11-16"),
      location: "Salle de conférence A",
      capacity: 20,
      registeredCount: 15,
      status: "upcoming",
      featured: true,
    },
    {
      id: "2",
      title: "Stratégies de Growth Hacking",
      instructor: "Jean Martin",
      category: "Marketing",
      level: "Intermédiaire",
      startDate: new Date("2023-10-20"),
      endDate: new Date("2023-10-21"),
      location: "Salle de conférence B",
      capacity: 15,
      registeredCount: 15,
      status: "completed",
      featured: false,
    },
    {
      id: "3",
      title: "Introduction au Design Thinking",
      instructor: "Sophie Leclerc",
      category: "Design",
      level: "Débutant",
      startDate: new Date("2023-12-05"),
      endDate: new Date("2023-12-06"),
      location: "Salle de conférence C",
      capacity: 25,
      registeredCount: 10,
      status: "upcoming",
      featured: true,
    },
    {
      id: "4",
      title: "Développement Web pour Startups",
      instructor: "Thomas Dubois",
      category: "Technologie",
      level: "Intermédiaire",
      startDate: new Date("2023-11-28"),
      endDate: new Date("2023-11-30"),
      location: "Salle de conférence A",
      capacity: 15,
      registeredCount: 12,
      status: "upcoming",
      featured: false,
    },
    {
      id: "5",
      title: "Financement et Levée de Fonds",
      instructor: "Claire Moreau",
      category: "Finance",
      level: "Avancé",
      startDate: new Date("2023-10-10"),
      endDate: new Date("2023-10-11"),
      location: "Salle de conférence B",
      capacity: 20,
      registeredCount: 18,
      status: "completed",
      featured: false,
    },
    {
      id: "6",
      title: "Communication et Pitch",
      instructor: "Pierre Lambert",
      category: "Communication",
      level: "Débutant",
      startDate: new Date("2023-11-08"),
      endDate: new Date("2023-11-09"),
      location: "Salle de conférence C",
      capacity: 30,
      registeredCount: 25,
      status: "ongoing",
      featured: true,
    },
  ]

  // Filtrer les formations en fonction des critères de recherche et de filtre
  const filteredTrainings = trainings.filter((training) => {
    // Filtre par recherche
    const matchesSearch =
      training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.category.toLowerCase().includes(searchQuery.toLowerCase())

    // Filtre par catégorie
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(training.category)

    // Filtre par niveau
    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(training.level)

    // Filtre par statut
    const matchesStatus = selectedStatus === "all" || training.status === selectedStatus

    return matchesSearch && matchesCategory && matchesLevel && matchesStatus
  })

  // Obtenir les catégories uniques
  const categories = Array.from(new Set(trainings.map((training) => training.category)))

  // Obtenir les niveaux uniques
  const levels = Array.from(new Set(trainings.map((training) => training.level)))

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
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

  // Fonction pour gérer la suppression d'une formation
  const handleDeleteTraining = (id: string) => {
    // Simuler la suppression
    toast({
      title: "Formation supprimée",
      description: "La formation a été supprimée avec succès.",
    })

    // Dans une application réelle, vous feriez un appel API ici
    console.log("Formation supprimée:", id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des formations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filtrer par catégorie</DropdownMenuLabel>
              {categories.map((category) => (
                <DropdownMenuItem key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, category])
                      } else {
                        setSelectedCategories(selectedCategories.filter((c) => c !== category))
                      }
                    }}
                  />
                  <label htmlFor={`category-${category}`} className="flex-1 cursor-pointer">
                    {category}
                  </label>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Filtrer par niveau</DropdownMenuLabel>
              {levels.map((level) => (
                <DropdownMenuItem key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`level-${level}`}
                    checked={selectedLevels.includes(level)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedLevels([...selectedLevels, level])
                      } else {
                        setSelectedLevels(selectedLevels.filter((l) => l !== level))
                      }
                    }}
                  />
                  <label htmlFor={`level-${level}`} className="flex-1 cursor-pointer">
                    {level}
                  </label>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="upcoming">À venir</SelectItem>
                  <SelectItem value="ongoing">En cours</SelectItem>
                  <SelectItem value="completed">Terminées</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                </SelectContent>
              </Select>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="hidden md:flex border rounded-md">
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setView("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setView("list")}
              className="rounded-l-none"
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={() => router.push("/dashboard/trainings/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une formation
        </Button>
      </div>

      {filteredTrainings.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="rounded-full bg-muted p-3">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Aucune formation trouvée</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Aucune formation ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrainings.map((training) => (
            <Card key={training.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{training.title}</CardTitle>
                    <CardDescription>{training.instructor}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/trainings/${training.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/trainings/${training.id}/participants`}>
                          <Users className="mr-2 h-4 w-4" />
                          Gérer les participants
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/trainings/${training.id}/registration-form`}>
                          <FormInput className="mr-2 h-4 w-4" />
                          Formulaire d'inscription
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/trainings/${training.id}/send-reminder`}>
                          <Bell className="mr-2 h-4 w-4" />
                          Envoyer un rappel
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/trainings/${training.id}/statistics`}>
                          <BarChart2 className="mr-2 h-4 w-4" />
                          Statistiques
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/trainings/${training.id}/share`}>
                          <Share2 className="mr-2 h-4 w-4" />
                          Partager
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/trainings/${training.id}/poster`}>
                          <FileImage className="mr-2 h-4 w-4" />
                          Affiche
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                            <span className="text-red-500">Supprimer</span>
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmer la suppression</DialogTitle>
                            <DialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Annuler</Button>
                            <Button variant="destructive" onClick={() => handleDeleteTraining(training.id)}>
                              Supprimer
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">{training.category}</Badge>
                  <Badge variant="outline">{training.level}</Badge>
                  <Badge className={getStatusColor(training.status)}>{getStatusText(training.status)}</Badge>
                  {training.featured && <Badge variant="secondary">Mise en avant</Badge>}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>
                      {formatDate(training.startDate)} - {formatDate(training.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>
                      {training.registeredCount}/{training.capacity} participants
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/trainings/${training.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Détails
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/dashboard/trainings/${training.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Formation</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrainings.map((training) => (
                <TableRow key={training.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{training.title}</div>
                      <div className="text-sm text-muted-foreground">{training.instructor}</div>
                    </div>
                  </TableCell>
                  <TableCell>{training.category}</TableCell>
                  <TableCell>{training.level}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(training.startDate)}
                      <br />
                      {formatDate(training.endDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {training.registeredCount}/{training.capacity}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(training.status)}>{getStatusText(training.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/trainings/${training.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/trainings/${training.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/trainings/${training.id}/participants`}>
                              <Users className="mr-2 h-4 w-4" />
                              Gérer les participants
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/trainings/${training.id}/registration-form`}>
                              <FormInput className="mr-2 h-4 w-4" />
                              Formulaire d'inscription
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/trainings/${training.id}/send-reminder`}>
                              <Bell className="mr-2 h-4 w-4" />
                              Envoyer un rappel
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/trainings/${training.id}/statistics`}>
                              <BarChart2 className="mr-2 h-4 w-4" />
                              Statistiques
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/trainings/${training.id}/share`}>
                              <Share2 className="mr-2 h-4 w-4" />
                              Partager
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/trainings/${training.id}/poster`}>
                              <FileImage className="mr-2 h-4 w-4" />
                              Affiche
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                <span className="text-red-500">Supprimer</span>
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirmer la suppression</DialogTitle>
                                <DialogDescription>
                                  Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline">Annuler</Button>
                                <Button variant="destructive" onClick={() => handleDeleteTraining(training.id)}>
                                  Supprimer
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

