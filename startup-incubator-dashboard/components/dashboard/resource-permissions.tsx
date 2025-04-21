"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, Users, Building, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

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

interface ResourcePermissionsProps {
  resourceId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  resource: Resource
}

export function ResourcePermissions({ resourceId, open, onOpenChange, resource }: ResourcePermissionsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"startups" | "mentors" | "users">("startups")

  // Données fictives pour les startups
  const startups = [
    {
      id: "1",
      name: "EcoTech Solutions",
      logo: "/placeholder.svg?height=40&width=40",
      hasAccess:
        resource.access.includes("all-startups") ||
        (resource.specificStartups && resource.specificStartups.includes("1")),
    },
    {
      id: "2",
      name: "MediConnect",
      logo: "/placeholder.svg?height=40&width=40",
      hasAccess:
        resource.access.includes("all-startups") ||
        (resource.specificStartups && resource.specificStartups.includes("2")),
    },
    {
      id: "3",
      name: "FinLedger",
      logo: "/placeholder.svg?height=40&width=40",
      hasAccess:
        resource.access.includes("all-startups") ||
        (resource.specificStartups && resource.specificStartups.includes("3")),
    },
    {
      id: "4",
      name: "DataVision AI",
      logo: "/placeholder.svg?height=40&width=40",
      hasAccess:
        resource.access.includes("all-startups") ||
        (resource.specificStartups && resource.specificStartups.includes("4")),
    },
    {
      id: "5",
      name: "Urban Mobility",
      logo: "/placeholder.svg?height=40&width=40",
      hasAccess:
        resource.access.includes("all-startups") ||
        (resource.specificStartups && resource.specificStartups.includes("5")),
    },
  ]

  // Données fictives pour les mentors
  const mentors = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Product Strategy",
      avatar: "/placeholder-user.jpg",
      hasAccess: resource.access.includes("mentors"),
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Venture Capital",
      avatar: "/placeholder-user.jpg",
      hasAccess: resource.access.includes("mentors"),
    },
    {
      id: "3",
      name: "Priya Patel",
      role: "Marketing",
      avatar: "/placeholder-user.jpg",
      hasAccess: resource.access.includes("mentors"),
    },
    {
      id: "4",
      name: "David Kim",
      role: "Software Engineering",
      avatar: "/placeholder-user.jpg",
      hasAccess: resource.access.includes("mentors"),
    },
    {
      id: "5",
      name: "Emma Wilson",
      role: "UX/UI Design",
      avatar: "/placeholder-user.jpg",
      hasAccess: resource.access.includes("mentors"),
    },
  ]

  // Données fictives pour les utilisateurs individuels
  const users = [
    { id: "1", name: "Admin User", role: "Administrateur", avatar: "/placeholder-user.jpg", hasAccess: true },
    {
      id: "2",
      name: "Alex Green",
      role: "Fondateur, EcoTech Solutions",
      avatar: "/placeholder-user.jpg",
      hasAccess: resource.access.includes("all-startups"),
    },
    {
      id: "3",
      name: "Jamie Lee",
      role: "Fondateur, EcoTech Solutions",
      avatar: "/placeholder-user.jpg",
      hasAccess: resource.access.includes("all-startups"),
    },
    {
      id: "4",
      name: "Sarah Johnson",
      role: "Mentor, Product Strategy",
      avatar: "/placeholder-user.jpg",
      hasAccess: resource.access.includes("mentors"),
    },
    {
      id: "5",
      name: "Michael Chen",
      role: "Mentor, Venture Capital",
      avatar: "/placeholder-user.jpg",
      hasAccess: resource.access.includes("mentors"),
    },
  ]

  // Filtrer les éléments en fonction de la recherche
  const filteredStartups = startups.filter((startup) => startup.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gérer les permissions d'accès</DialogTitle>
          <DialogDescription>Définissez qui peut accéder à la ressource "{resource.title}"</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Accès global</h3>
            <Badge variant="outline" className={resource.access.includes("public") ? "bg-green-50 text-green-700" : ""}>
              {resource.access.includes("public") ? "Public" : "Restreint"}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="access-public" checked={resource.access.includes("public")} />
              <Label htmlFor="access-public" className="font-normal">
                Public (accessible à tous)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="access-all-startups" checked={resource.access.includes("all-startups")} />
              <Label htmlFor="access-all-startups" className="font-normal">
                Toutes les startups
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="access-mentors" checked={resource.access.includes("mentors")} />
              <Label htmlFor="access-mentors" className="font-normal">
                Tous les mentors
              </Label>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou gérer les accès individuels</span>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des utilisateurs ou des startups..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "startups" | "mentors" | "users")}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="startups" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>Startups</span>
              </TabsTrigger>
              <TabsTrigger value="mentors" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Mentors</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Utilisateurs</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="startups" className="mt-4">
              <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
                {filteredStartups.length > 0 ? (
                  filteredStartups.map((startup) => (
                    <div key={startup.id} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={startup.logo} alt={startup.name} />
                          <AvatarFallback>{startup.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{startup.name}</p>
                        </div>
                      </div>
                      <Checkbox
                        id={`startup-access-${startup.id}`}
                        checked={startup.hasAccess}
                        disabled={resource.access.includes("all-startups")}
                      />
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">Aucune startup trouvée.</div>
                )}
              </div>
              {resource.access.includes("all-startups") && (
                <p className="text-xs text-muted-foreground mt-2">
                  Toutes les startups ont déjà accès à cette ressource. Désactivez l'option "Toutes les startups" pour
                  gérer les accès individuels.
                </p>
              )}
            </TabsContent>

            <TabsContent value="mentors" className="mt-4">
              <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
                {filteredMentors.length > 0 ? (
                  filteredMentors.map((mentor) => (
                    <div key={mentor.id} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={mentor.avatar} alt={mentor.name} />
                          <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{mentor.name}</p>
                          <p className="text-xs text-muted-foreground">{mentor.role}</p>
                        </div>
                      </div>
                      <Checkbox
                        id={`mentor-access-${mentor.id}`}
                        checked={mentor.hasAccess}
                        disabled={resource.access.includes("mentors")}
                      />
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">Aucun mentor trouvé.</div>
                )}
              </div>
              {resource.access.includes("mentors") && (
                <p className="text-xs text-muted-foreground mt-2">
                  Tous les mentors ont déjà accès à cette ressource. Désactivez l'option "Tous les mentors" pour gérer
                  les accès individuels.
                </p>
              )}
            </TabsContent>

            <TabsContent value="users" className="mt-4">
              <div className="flex justify-end mb-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  <span>Ajouter un utilisateur</span>
                </Button>
              </div>
              <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.role}</p>
                        </div>
                      </div>
                      <Checkbox
                        id={`user-access-${user.id}`}
                        checked={user.hasAccess}
                        disabled={user.id === "1"} // Admin toujours accès
                      />
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">Aucun utilisateur trouvé.</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={() => onOpenChange(false)}>Enregistrer les permissions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

