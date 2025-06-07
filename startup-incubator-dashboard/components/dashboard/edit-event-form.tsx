"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Clock, MapPin, Users, Info, ImageIcon, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import { RootState } from "@/store"
import { useSelector } from "react-redux"

interface EditEventFormProps {
  eventId: number
}

export function EditEventForm({ eventId }: EditEventFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [fichePreview, setFichePreview] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [eventData, setEventData] = useState({
    title: "",
    type: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    description: "",
    speakers: "",
    tags: "",
    fiche: null,
    fiche_title: "",
    fiche_alternatif: "",
    supp: null,
    displayOnHomepage: false,
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const [year, month, day] = selectedDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    setEventData((prev) => ({ ...prev, date: formattedDate }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setEventData((prev: any) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setEventData((prev: any) => ({ ...prev, [id]: value }))
  }

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setEventData((prev: any) => ({ ...prev, [id]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const toastId = toast.loading("Updating Event ...")
    
    axios
      .put(`${apiUrl}/api/event/events/${eventId}`, eventData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
      .then(response => {
        toast.success("Event Updated Successfully")
        router.push("/dashboard/events")
      })
      .catch((error) => {
        console.log(error)
        toast.error("Failed To Update The Event!")
      })
      .finally(() => {
        toast.dismiss(toastId)
      })
  }

  const fetchData = (eventId: number) => {
    axios
      .get(`${apiUrl}/api/event/${eventId}`)
      .then((response) => {
        const [year, month, day] = (response.data.data.date).split('-')
        response.data.data.date = `${year}/${month}/${day}`;
        setEventData(response.data.data)
        console.log(response.data.data);
        
      })
  }

  const fetchPoster = (eventId: number) => {
    axios.get(`${apiUrl}/api/fiche-poster/${eventId}`)
      .then(() => {
        setFichePreview(`/api/fiche-poster/${eventId}`);
      })
      .catch((err) => {
      setFichePreview("/placeholder.svg?height=300&width=200");
       })
  }
  useEffect(() => {
    fetchData(eventId)
    fetchPoster(eventId)
  }, [])

  useEffect(() => {
    fetchPoster(eventId)
  }, [eventId])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Informations de base</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="media">Médias & Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'événement</Label>
              <Input
                id="title"
                value={eventData.title}
                onChange={handleInputChange}
                placeholder="Titre de l'événement"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type d'événement</Label>
              <Select value={eventData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workshop">Atelier</SelectItem>
                  <SelectItem value="conference">Conférence</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                  <SelectItem value="panel">Panel</SelectItem>
                  <SelectItem value="talk">Talk</SelectItem>
                  <SelectItem value="showcase">Showcase</SelectItem>
                  <SelectItem value="masterclass">Masterclass</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={eventData.date.split('/').reverse().join('-')}
                  onChange={handleDateChange} className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Heure</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    value={eventData.time}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Lieu</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={eventData.location}
                  onChange={handleInputChange}
                  placeholder="Lieu de l'événement"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacité</Label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="capacity"
                  type="number"
                  value={eventData.capacity}
                  onChange={handleInputChange}
                  placeholder="Nombre de places"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={() => setActiveTab("details")}>
              Suivant: Détails
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description détaillée</Label>
            <Textarea
              id="description"
              value={eventData.description}
              onChange={handleInputChange}
              placeholder="Description complète de l'événement"
              className="min-h-[150px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="speakers">Intervenants</Label>
            <Textarea
              id="speakers"
              value={eventData.speakers}
              onChange={handleInputChange}
              placeholder="Noms et rôles des intervenants (un par ligne)"
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input
              id="tags"
              value={eventData.tags}
              onChange={handleInputChange}
              placeholder="innovation, entrepreneuriat, financement..."
            />
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
              Retour
            </Button>
            <Button type="button" onClick={() => setActiveTab("media")}>
              Suivant: Médias & Documents
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Affiche de l'événement</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                <input type="file" id="fiche" className="hidden" accept="image/*" />
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
                  <Label htmlFor="fiche_title">Titre de l'affiche</Label>
                  <Input
                    id="fiche_title"
                    value={eventData.fiche_title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fiche_alternatif">Texte alternatif</Label>
                  <Input
                    id="fiche_alternatif"
                    value={eventData.fiche_alternatif}
                    onChange={handleInputChange}
                  />
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
            <Checkbox
              id="displayOnHomepage"
              checked={eventData.displayOnHomepage}
              onCheckedChange={(checked) => handleCheckboxChange("displayOnHomepage", checked as boolean)}
            />
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
            <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
              Retour
            </Button>
            <Button type="submit">Mettre à jour l'événement</Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  )
}

