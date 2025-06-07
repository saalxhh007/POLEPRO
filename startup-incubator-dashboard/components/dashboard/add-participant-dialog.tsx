"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus } from "lucide-react"
import type { ParticipantForm } from "../types/participant"

interface AddParticipantDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  participantForm: ParticipantForm
  setParticipantForm: (form: ParticipantForm) => void
  onAdd: () => void
}

export function AddParticipantDialog({
  isOpen,
  onOpenChange,
  participantForm,
  setParticipantForm,
  onAdd,
}: AddParticipantDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Ajouter un participant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau participant</DialogTitle>
          <DialogDescription>
            Remplissez les informations du participant pour l'ajouter à l'événement.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={participantForm.name}
                onChange={(e) => setParticipantForm({ ...participantForm, name: e.target.value })}
                placeholder="Nom du participant"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={participantForm.email}
                onChange={(e) => setParticipantForm({ ...participantForm, email: e.target.value })}
                placeholder="email@exemple.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={participantForm.phone}
                onChange={(e) => setParticipantForm({ ...participantForm, phone: e.target.value })}
                placeholder="+33 1 23 45 67 89"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle *</Label>
              <Select
                value={participantForm.role}
                onValueChange={(value: any) => setParticipantForm({ ...participantForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="etudiant">Étudiant</SelectItem>
                  <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                  <SelectItem value="developpeur">Développeur</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="investisseur">Investisseur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization">Organisation/École/Entreprise</Label>
            <Input
              id="organization"
              value={participantForm.organization}
              onChange={(e) => setParticipantForm({ ...participantForm, organization: e.target.value })}
              placeholder="Nom de l'organisation"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectations">Attentes de l'événement</Label>
            <Textarea
              id="expectations"
              value={participantForm.expectations}
              onChange={(e) => setParticipantForm({ ...participantForm, expectations: e.target.value })}
              placeholder="Que souhaitez-vous retirer de cet événement ?"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onAdd}>Ajouter le participant</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
