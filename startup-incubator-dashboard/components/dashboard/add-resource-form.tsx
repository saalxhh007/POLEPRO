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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

interface ResourceFormData {
  name: string
  type: string
  capacity: string
  availability: string
  emplacement: string
}

export function AddResourceForm({ fetchResources }: { fetchResources: () => void }) {
  const [open, setOpen] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const [formData, setFormData] = useState<ResourceFormData>({
    name: "",
    type: "",
    capacity: "",
    availability: "available",
    emplacement: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    axios
      .post(`${apiUrl}/api/resource`, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        toast.success("Resource Added Succeffully")
        fetchResources()
        
      })
      .catch((err) => {
        console.log(err);
        
        toast.error("Failed To Add Resource")
      })
      .finally(() => {
        setFormData({
          name: "",
          type: "",
          capacity: "",
          availability: "available",
          emplacement: ""
        })
        setOpen(false)
        setIsSubmitting(false)
      })
  }

  const handleInputChange = (field: keyof ResourceFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter une Ressource
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une Ressource</DialogTitle>
          <DialogDescription>Remplissez les informations pour ajouter une nouvelle ressource.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                placeholder="Nom de la ressource"
                className="col-span-3"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select required value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting-space">Meeting Space</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="coworking">Coworking</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacité
              </Label>
              <Input
                type="number"
                id="capacity"
                placeholder="Capacité (ex: 10)"
                className="col-span-3"
                required
                min="1"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emplacement" className="text-right">
                Emplacement
              </Label>
              <Input
                id="emplacement"
                placeholder="Emplacement de la ressource"
                className="col-span-3"
                required
                value={formData.emplacement}
                onChange={(e) => handleInputChange("emplacement", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Ajout en cours..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
