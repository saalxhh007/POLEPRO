"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

interface Mentor {
  id: number
  name: string
  expertise: string
  availability: string
}

interface AssignMentorDialogProps {
  startup: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AssignMentorDialog({ startup, open, onOpenChange, onSuccess }: AssignMentorDialogProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [selectedMentor, setSelectedMentor] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchMentors()
      if (startup.mentor_id) {
        setSelectedMentor(startup.mentor_id.toString())
      } else {
        setSelectedMentor("")
      }
      setNotes("")
    }
  }, [open, startup])

  const fetchMentors = async () => {
    setIsLoading(true)
    axios.get(`${apiUrl}/api/mentor`)
      .then((response) => {
        if (response.data.success) {
          setMentors(response.data.data)
        }
        else {
          console.error("Failed to fetch mentors")
        }
      })
      .catch((err) => {
        console.error("Failed to fetch mentors:", err)
      })
      .finally(()=>{
        setIsLoading(false)
      })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMentor ) {
      toast.error("Please select a mentor")
      return;
    }
    setIsSubmitting(true)

    axios.post(`${apiUrl}/api/mentor/assign/`, {
      mentor_id: Number.parseInt(selectedMentor),
      startup_id: Number.parseInt(startup.id)
      })
        .then((response) => {
          if (!response.data.success) {
            toast.error(`${response.data.message}`)
          }
          else {
            toast.success("Mentor assigned successfully")
          }
         })
        .catch((err) => {
          toast.error("Failed to assign mentor")
          console.error("Error assigning mentor:", err)
        })
      .finally(()=>{
        setIsSubmitting(false)
      })

  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Mentor to {startup?.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="mentor">Select Mentor</Label>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a mentor" />
                </SelectTrigger>
                <SelectContent>
                  {mentors.map((mentor) => (
                    <SelectItem key={mentor.id} value={mentor.id.toString()}>
                      {mentor.name} - {mentor.expertise}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedMentor && (
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any specific notes about this mentorship assignment"
                className="min-h-[100px]"
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading || !selectedMentor}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign Mentor"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
