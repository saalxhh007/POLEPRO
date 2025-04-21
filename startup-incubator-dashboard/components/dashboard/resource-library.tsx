"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Grid3X3, List } from "lucide-react"
import { ResourceUpload } from "./resource-upload"
import { ResourceItem } from "./resource-item"
import { ResourcePermissions } from "./resource-permissions"

export function ResourceLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedResource, setSelectedResource] = useState<string | null>(null)
  const [showPermissions, setShowPermissions] = useState(false)

  // Données fictives pour les ressources
  const resources = [
    {
      id: "1",
      title: "Guide de Pitch pour Investisseurs",
      description: "Comment préparer un pitch efficace pour les investisseurs",
      category: "guides",
      format: "pdf",
      size: "2.4 MB",
      uploadedBy: "Admin",
      uploadDate: "15 Mai 2025",
      downloads: 45,
      thumbnail: "/placeholder.svg?height=100&width=80",
      access: ["all-startups", "mentors"],
      tags: ["pitch", "investisseurs", "financement"],
    },
    {
      id: "2",
      title: "Modèle de Business Plan",
      description: "Template Excel pour créer votre business plan",
      category: "templates",
      format: "xlsx",
      size: "1.8 MB",
      uploadedBy: "Admin",
      uploadDate: "10 Juin 2025",
      downloads: 32,
      thumbnail: "/placeholder.svg?height=100&width=80",
      access: ["all-startups"],
      tags: ["business plan", "finance", "stratégie"],
    },
    {
      id: "3",
      title: "Présentation de l'Incubateur",
      description: "Présentation des services et avantages de l'incubateur",
      category: "presentations",
      format: "pptx",
      size: "5.2 MB",
      uploadedBy: "Admin",
      uploadDate: "5 Juin 2025",
      downloads: 28,
      thumbnail: "/placeholder.svg?height=100&width=80",
      access: ["public"],
      tags: ["incubateur", "services", "présentation"],
    },
    {
      id: "4",
      title: "Contrat de Confidentialité (NDA)",
      description: "Modèle de contrat de confidentialité à utiliser avec vos partenaires",
      category: "legal",
      format: "docx",
      size: "320 KB",
      uploadedBy: "Admin",
      uploadDate: "20 Mai 2025",
      downloads: 56,
      thumbnail: "/placeholder.svg?height=100&width=80",
      access: ["all-startups", "mentors"],
      tags: ["légal", "confidentialité", "contrat"],
    },
    {
      id: "5",
      title: "Guide de Propriété Intellectuelle",
      description: "Comment protéger votre propriété intellectuelle",
      category: "guides",
      format: "pdf",
      size: "3.1 MB",
      uploadedBy: "Admin",
      uploadDate: "12 Juin 2025",
      downloads: 19,
      thumbnail: "/placeholder.svg?height=100&width=80",
      access: ["all-startups", "mentors"],
      tags: ["propriété intellectuelle", "brevet", "protection"],
    },
    {
      id: "6",
      title: "Calendrier des Événements Q2 2025",
      description: "Planning des événements et ateliers pour le trimestre",
      category: "planning",
      format: "pdf",
      size: "1.5 MB",
      uploadedBy: "Admin",
      uploadDate: "1 Avril 2025",
      downloads: 67,
      thumbnail: "/placeholder.svg?height=100&width=80",
      access: ["all-startups", "mentors", "public"],
      tags: ["événements", "planning", "ateliers"],
    },
    {
      id: "7",
      title: "Analyse du Marché HealthTech 2025",
      description: "Étude de marché détaillée sur le secteur de la santé",
      category: "market-research",
      format: "pdf",
      size: "8.7 MB",
      uploadedBy: "Admin",
      uploadDate: "8 Juin 2025",
      downloads: 23,
      thumbnail: "/placeholder.svg?height=100&width=80",
      access: ["specific-startups", "mentors"],
      specificStartups: ["2"], // ID de MediConnect
      tags: ["healthtech", "marché", "analyse"],
    },
    {
      id: "8",
      title: "Guide de Levée de Fonds",
      description: "Stratégies et conseils pour réussir votre levée de fonds",
      category: "guides",
      format: "pdf",
      size: "4.2 MB",
      uploadedBy: "Admin",
      uploadDate: "25 Mai 2025",
      downloads: 41,
      thumbnail: "/placeholder.svg?height=100&width=80",
      access: ["all-startups", "mentors"],
      tags: ["financement", "levée de fonds", "investisseurs"],
    },
  ]

  // Filtrer les ressources
  const filteredResources = resources.filter(
    (resource) =>
      (resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (category === "all" || resource.category === category),
  )

  // Catégories disponibles
  const categories = [
    { value: "all", label: "Toutes les catégories" },
    { value: "guides", label: "Guides" },
    { value: "templates", label: "Templates" },
    { value: "presentations", label: "Présentations" },
    { value: "legal", label: "Documents légaux" },
    { value: "planning", label: "Planning" },
    { value: "market-research", label: "Études de marché" },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher des ressources..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="flex items-center border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <ResourceUpload />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="recent">Récentes</TabsTrigger>
              <TabsTrigger value="popular">Populaires</TabsTrigger>
              <TabsTrigger value="my-uploads">Mes uploads</TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredResources.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "space-y-4"
              }
            >
              {filteredResources.map((resource) => (
                <ResourceItem
                  key={resource.id}
                  resource={resource}
                  viewMode={viewMode}
                  onSelect={() => setSelectedResource(resource.id)}
                  onManagePermissions={() => {
                    setSelectedResource(resource.id)
                    setShowPermissions(true)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune ressource trouvée.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {showPermissions && selectedResource && (
        <ResourcePermissions
          resourceId={selectedResource}
          open={showPermissions}
          onOpenChange={setShowPermissions}
          resource={resources.find((r) => r.id === selectedResource)!}
        />
      )}
    </div>
  )
}

