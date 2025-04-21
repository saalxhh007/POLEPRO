"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Download,
  MoreVertical,
  FileText,
  FileIcon as FilePdf,
  FileSpreadsheet,
  FileIcon as FilePresentation,
  Eye,
  Share2,
  Lock,
  Edit,
} from "lucide-react"

interface Resource {
  id: string
  title: string
  description: string
  category: string
  format: string
  size: string
  uploadedBy: string
  uploadDate: string
  downloads: number
  thumbnail: string
  access: string[]
  tags: string[]
  specificStartups?: string[]
}

interface ResourceItemProps {
  resource: Resource
  viewMode: "grid" | "list"
  onSelect: () => void
  onManagePermissions: () => void
}

export function ResourceItem({ resource, viewMode, onSelect, onManagePermissions }: ResourceItemProps) {
  // Fonction pour obtenir l'icône en fonction du format
  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <FilePdf className="h-6 w-6 text-red-500" />
      case "xlsx":
      case "xls":
      case "csv":
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />
      case "pptx":
      case "ppt":
        return <FilePresentation className="h-6 w-6 text-orange-500" />
      default:
        return <FileText className="h-6 w-6 text-blue-500" />
    }
  }

  // Fonction pour obtenir le badge d'accès
  const getAccessBadge = (access: string[]) => {
    if (access.includes("public")) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700">
          Public
        </Badge>
      )
    } else if (access.includes("all-startups")) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          Toutes les startups
        </Badge>
      )
    } else if (access.includes("specific-startups")) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700">
          Startups spécifiques
        </Badge>
      )
    } else if (access.includes("mentors")) {
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700">
          Mentors
        </Badge>
      )
    } else {
      return <Badge variant="outline">Restreint</Badge>
    }
  }

  if (viewMode === "grid") {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative aspect-[4/3] bg-muted flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center bg-black/5">
            {getFormatIcon(resource.format)}
          </div>
          <img
            src={resource.thumbnail || "/placeholder.svg"}
            alt={resource.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={onSelect}>
                  <Eye className="mr-2 h-4 w-4" /> Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" /> Télécharger
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" /> Partager
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onManagePermissions}>
                  <Lock className="mr-2 h-4 w-4" /> Gérer les accès
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" /> Modifier
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="uppercase text-xs">
                {resource.format}
              </Badge>
              {getAccessBadge(resource.access)}
            </div>
            <h3 className="font-medium line-clamp-1">{resource.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{resource.uploadDate}</span>
              <span>{resource.downloads} téléchargements</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {resource.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {resource.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{resource.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  } else {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-muted rounded-md">
              {getFormatIcon(resource.format)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{resource.title}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={onSelect}>
                      <Eye className="mr-2 h-4 w-4" /> Voir les détails
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" /> Télécharger
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" /> Partager
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onManagePermissions}>
                      <Lock className="mr-2 h-4 w-4" /> Gérer les accès
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" /> Modifier
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{resource.description}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="uppercase text-xs">
                  {resource.format}
                </Badge>
                {getAccessBadge(resource.access)}
                <span className="text-xs text-muted-foreground">{resource.size}</span>
                <span className="text-xs text-muted-foreground">{resource.uploadDate}</span>
                <span className="text-xs text-muted-foreground">{resource.downloads} téléchargements</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
}

