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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, Plus, FileUp } from "lucide-react"

export function ResourceUpload() {
  const [open, setOpen] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"file" | "link">("file")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  // Liste fictive des startups
  const startups = [
    { id: "1", name: "EcoTech Solutions" },
    { id: "2", name: "MediConnect" },
    { id: "3", name: "FinLedger" },
    { id: "4", name: "DataVision AI" },
    { id: "5", name: "Urban Mobility" },
  ]

  // Gérer l'ajout d'un tag
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  // Gérer la suppression d'un tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  // Gérer le glisser-déposer de fichiers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Ajouter une ressource
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle ressource</DialogTitle>
          <DialogDescription>
            Téléversez un document ou partagez un lien vers une ressource pour les startups et mentors.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={uploadMethod}
          onValueChange={(value) => setUploadMethod(value as "file" | "link")}
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">Téléverser un fichier</TabsTrigger>
            <TabsTrigger value="link">Ajouter un lien</TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4 mt-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <FileUp className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)}>
                    Changer de fichier
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center">
                    <FileUp className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-sm font-medium">Glissez-déposez votre fichier ici ou</p>
                  <div className="mt-2">
                    <Label htmlFor="file-upload" className="sr-only">
                      Choisir un fichier
                    </Label>
                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                    <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                      Parcourir
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">PDF, DOCX, XLSX, PPTX, etc. 50 MB max.</p>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="resource-url">URL de la ressource</Label>
              <Input id="resource-url" placeholder="https://" />
              <p className="text-xs text-muted-foreground">
                Entrez l'URL complète de la ressource que vous souhaitez partager.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la ressource</Label>
            <Input id="title" placeholder="Entrez un titre descriptif" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Décrivez brièvement cette ressource" className="min-h-[80px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guides">Guides</SelectItem>
                  <SelectItem value="templates">Templates</SelectItem>
                  <SelectItem value="presentations">Présentations</SelectItem>
                  <SelectItem value="legal">Documents légaux</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="market-research">Études de marché</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter un tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button type="button" variant="outline" size="icon" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      className="ml-1 rounded-full hover:bg-muted"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Supprimer</span>
                    </button>
                  </Badge>
                ))}
                {tags.length === 0 && <span className="text-xs text-muted-foreground">Aucun tag ajouté</span>}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Permissions d'accès</Label>
            <div className="border rounded-md p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="access-public" />
                <Label htmlFor="access-public" className="font-normal">
                  Public (accessible à tous)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="access-all-startups" defaultChecked />
                <Label htmlFor="access-all-startups" className="font-normal">
                  Toutes les startups
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="access-specific-startups" />
                <Label htmlFor="access-specific-startups" className="font-normal">
                  Startups spécifiques
                </Label>
              </div>

              <div className="pl-6 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {startups.map((startup) => (
                    <div key={startup.id} className="flex items-center space-x-2">
                      <Checkbox id={`startup-${startup.id}`} disabled />
                      <Label htmlFor={`startup-${startup.id}`} className="font-normal text-sm">
                        {startup.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="access-mentors" defaultChecked />
                <Label htmlFor="access-mentors" className="font-normal">
                  Mentors
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
            Téléverser la ressource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

