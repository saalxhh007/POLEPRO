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
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Participant, ParticipantForm } from "../types/participant"

interface EditParticipantDialogProps {
  editingParticipant: Participant | null
  onClose: () => void
  participantForm: ParticipantForm
  setParticipantForm: (form: ParticipantForm) => void
}

export function EditParticipantDialog({
  editingParticipant,
  onClose,
  participantForm,
  setParticipantForm,
}: EditParticipantDialogProps) {
  return (
    <Dialog open={!!editingParticipant} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le participant</DialogTitle>
          <DialogDescription>Modifiez les informations du participant.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom complet *</Label>
              <Input
                id="edit-name"
                value={participantForm.name}
                onChange={(e) => setParticipantForm({ ...participantForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={participantForm.email}
                onChange={(e) => setParticipantForm({ ...participantForm, email: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Téléphone</Label>
              <Input
                id="edit-phone"
                value={participantForm.phone}
                onChange={(e) => setParticipantForm({ ...participantForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Rôle *</Label>
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
            <Label htmlFor="edit-organization">Organisation/École/Entreprise</Label>
            <Input
              id="edit-organization"
              value={participantForm.organization}
              onChange={(e) => setParticipantForm({ ...participantForm, organization: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-expectations">Attentes de l'événement</Label>
            <Textarea
              id="edit-expectations"
              value={participantForm.expectations}
              onChange={(e) => setParticipantForm({ ...participantForm, expectations: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
