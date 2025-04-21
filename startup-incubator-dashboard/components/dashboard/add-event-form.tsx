"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Upload, ImageIcon, Calendar, Clock, MapPin, Users, Info } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export function AddEventForm() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [selectedPoster, setSelectedPoster] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState<string | null>(null)

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedPoster(file)

      // Créer une URL pour prévisualiser l'image
      const reader = new FileReader()
      reader.onload = (e) => {
        setPosterPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un Événement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel événement</DialogTitle>
          <DialogDescription>Remplissez les informations pour créer un nouvel événement.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Informations de base</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="media">Médias & Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'événement</Label>
                <Input id="title" placeholder="Titre de l'événement" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type d'événement</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Atelier</SelectItem>
                    <SelectItem value="conference">Conférence</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="panel">Panel</SelectItem>
                    <SelectItem value="talk">Talk</SelectItem>
                    <SelectItem value="masterclass">Masterclass</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description courte</Label>
              <Textarea id="description" placeholder="Brève description de l'événement" className="resize-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="date" type="date" className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Heure</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="time-start" type="time" className="pl-10" />
                  </div>
                  <span>à</span>
                  <Input id="time-end" type="time" className="flex-1" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="location" placeholder="Lieu de l'événement" className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacité</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="capacity" type="number" placeholder="Nombre de places" className="pl-10" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("details")}>Suivant: Détails</Button>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="long-description">Description détaillée</Label>
              <Textarea
                id="long-description"
                placeholder="Description complète de l'événement"
                className="min-h-[150px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="speakers">Intervenants</Label>
              <Textarea
                id="speakers"
                placeholder="Noms et rôles des intervenants (un par ligne)"
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Prérequis</Label>
              <Textarea
                id="requirements"
                placeholder="Prérequis pour participer à l'événement"
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
              <Input id="tags" placeholder="innovation, entrepreneuriat, financement..." />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("basic")}>
                Retour
              </Button>
              <Button onClick={() => setActiveTab("media")}>Suivant: Médias & Documents</Button>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Affiche de l'événement</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <input type="file" id="poster" className="hidden" accept="image/*" onChange={handlePosterChange} />
                  <label htmlFor="poster" className="cursor-pointer">
                    {posterPreview ? (
                      <div className="flex flex-col items-center">
                        <div className="relative w-full max-w-[200px] aspect-[3/4] mb-4">
                          <img
                            src={posterPreview || "/placeholder.svg"}
                            alt="Aperçu de l'affiche"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <Button variant="outline" size="sm">
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
                  <div className="space-y-2">
                    <Label htmlFor="poster-title">Titre de l'affiche</Label>
                    <Input id="poster-title" placeholder="Titre à afficher sur l'affiche" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="poster-alt">Texte alternatif</Label>
                    <Input id="poster-alt" placeholder="Description pour l'accessibilité" />
                  </div>
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
              <Label>Documents supplémentaires</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                <input type="file" id="documents" className="hidden" multiple accept=".pdf,.doc,.docx,.ppt,.pptx" />
                <label htmlFor="documents" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Cliquez pour ajouter des documents</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, PPT, PPTX jusqu'à 10MB</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="displayOnHomepage" />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="displayOnHomepage" className="text-sm font-medium leading-none">
                  Afficher sur la page d'accueil
                </Label>
                <p className="text-sm text-muted-foreground">
                  Cet événement sera mis en avant dans la section des événements de la page d'accueil
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("details")}>
                Retour
              </Button>
              <Button type="submit" onClick={() => setOpen(false)}>
                Créer l'événement
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

