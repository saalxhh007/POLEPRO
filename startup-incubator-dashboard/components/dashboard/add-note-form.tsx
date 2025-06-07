"use client"

import type React from "react"

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
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import axios from "axios"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"

interface AddNoteFormProps {
  startupId: string
  onNoteAdded: () => void
}

export function AddNoteForm({ startupId, onNoteAdded }: AddNoteFormProps) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const [createdBy, setCreatedBy] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    setIsLoading(true)

    try {
      const response = await axios.post(
        `${apiUrl}/api/notes`,
        {
          startup_id: Number.parseInt(startupId),
          content: content.trim(),
          created_by: createdBy.trim() || undefined,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (response.data.success) {
        setContent("")
        setCreatedBy("")
        setOpen(false)
        onNoteAdded()
      }
    } catch (error) {
      console.error("Error creating note:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter une note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle note</DialogTitle>
            <DialogDescription>Ajoutez une note ou un commentaire pour ce projet.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="content">Contenu *</Label>
              <Textarea
                id="content"
                placeholder="Écrivez votre note ici..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="created-by">Créé par (optionnel)</Label>
              <Input
                id="created-by"
                placeholder="Votre nom"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                maxLength={255}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!content.trim() || isLoading}>
              {isLoading ? "Création..." : "Créer la note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
