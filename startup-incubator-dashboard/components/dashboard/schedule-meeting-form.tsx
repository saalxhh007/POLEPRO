"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Users } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ScheduleMeetingForm() {
  const [open, setOpen] = useState(false)
  const [meetingType, setMeetingType] = useState("in-person")

  // Liste fictive des participants potentiels
  const potentialParticipants = [
    { id: "1", name: "Admin User", role: "Administrateur" },
    { id: "2", name: "Alex Green", role: "Fondateur, EcoTech Solutions" },
    { id: "3", name: "Jamie Lee", role: "Fondateur, EcoTech Solutions" },
    { id: "4", name: "Sarah Johnson", role: "Mentor, Product Strategy" },
    { id: "5", name: "Michael Chen", role: "Mentor, Venture Capital" },
    { id: "6", name: "Priya Patel", role: "Mentor, Marketing" },
    { id: "7", name: "David Kim", role: "Fondateur, FinLedger" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Planifier une Réunion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Planifier une Réunion</DialogTitle>
          <DialogDescription>Remplissez les détails pour planifier une nouvelle réunion.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Titre
            </Label>
            <Input id="title" placeholder="Titre de la réunion" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="meeting-type" className="text-right">
              Type de réunion
            </Label>
            <Select defaultValue="project-review">
              <SelectTrigger id="meeting-type" className="col-span-3">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project-review">Revue de Projet</SelectItem>
                <SelectItem value="mentoring">Session de Mentorat</SelectItem>
                <SelectItem value="investor">Réunion Investisseurs</SelectItem>
                <SelectItem value="workshop">Atelier</SelectItem>
                <SelectItem value="team">Réunion d'Équipe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Format</Label>
            <RadioGroup
              defaultValue="in-person"
              className="col-span-3 flex flex-col space-y-2"
              onValueChange={setMeetingType}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-person" id="in-person" />
                <Label htmlFor="in-person" className="font-normal">
                  En personne
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="virtual" id="virtual" />
                <Label htmlFor="virtual" className="font-normal">
                  Virtuel
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hybrid" id="hybrid" />
                <Label htmlFor="hybrid" className="font-normal">
                  Hybride
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input id="date" type="date" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Heure
            </Label>
            <div className="col-span-3 flex gap-2 items-center">
              <Input id="time-start" type="time" />
              <span>à</span>
              <Input id="time-end" type="time" />
            </div>
          </div>

          {(meetingType === "in-person" || meetingType === "hybrid") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Lieu
              </Label>
              <Select>
                <SelectTrigger id="location" className="col-span-3">
                  <SelectValue placeholder="Sélectionner un lieu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conference-a">Salle de Conférence A</SelectItem>
                  <SelectItem value="conference-b">Salle de Conférence B</SelectItem>
                  <SelectItem value="meeting-room-1">Salle de Réunion 1</SelectItem>
                  <SelectItem value="meeting-room-2">Salle de Réunion 2</SelectItem>
                  <SelectItem value="auditorium">Auditorium Principal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(meetingType === "virtual" || meetingType === "hybrid") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform" className="text-right">
                Plateforme
              </Label>
              <Select defaultValue="zoom">
                <SelectTrigger id="platform" className="col-span-3">
                  <SelectValue placeholder="Sélectionner une plateforme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="teams">Microsoft Teams</SelectItem>
                  <SelectItem value="meet">Google Meet</SelectItem>
                  <SelectItem value="webex">Cisco Webex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(meetingType === "virtual" || meetingType === "hybrid") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Lien
              </Label>
              <Input id="link" placeholder="https://..." className="col-span-3" />
            </div>
          )}

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Participants</Label>
            <div className="col-span-3 space-y-2 border rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <Label>Sélectionner les participants</Label>
                <span className="text-xs text-muted-foreground">
                  <Users className="inline-block h-3 w-3 mr-1" />
                  {potentialParticipants.length} disponibles
                </span>
              </div>
              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                {potentialParticipants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-2">
                    <Checkbox id={`participant-${participant.id}`} />
                    <Label htmlFor={`participant-${participant.id}`} className="font-normal text-sm">
                      {participant.name}
                      <span className="text-xs text-muted-foreground ml-2">{participant.role}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="agenda" className="text-right pt-2">
              Ordre du jour
            </Label>
            <Textarea
              id="agenda"
              placeholder="Points à aborder pendant la réunion..."
              className="col-span-3 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reminder" className="text-right">
              Rappel
            </Label>
            <Select defaultValue="30">
              <SelectTrigger id="reminder" className="col-span-3">
                <SelectValue placeholder="Sélectionner un rappel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes avant</SelectItem>
                <SelectItem value="30">30 minutes avant</SelectItem>
                <SelectItem value="60">1 heure avant</SelectItem>
                <SelectItem value="1440">1 jour avant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-3 col-start-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="send-invites" defaultChecked />
                <Label htmlFor="send-invites" className="font-normal">
                  Envoyer des invitations par email
                </Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-3 col-start-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="add-calendar" defaultChecked />
                <Label htmlFor="add-calendar" className="font-normal">
                  Ajouter au calendrier de l'incubateur
                </Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button type="submit" onClick={() => setOpen(false)}>
            Planifier la réunion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

