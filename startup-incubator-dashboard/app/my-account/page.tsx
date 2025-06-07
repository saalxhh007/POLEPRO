"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Settings,
  Briefcase,
  Calendar,
  Bell,
  Shield,
  FileText,
  ChevronRight,
  GraduationCap,
  Clock,
  CheckCircle,
  MapPin,
} from "lucide-react"
import axios from "axios"

interface UserProfile {
  id: number
  matricule: string
  email: string
  phone_number: string
  first_name_ar: string
  last_name_ar: string
  avatar?: string
}

interface Startup {
  id: number
  name: string
  industry: string | null
  stage: string | null
  join_date: string | null
  status: "active" | "warning" | "inactive"
  progress: number | null
  team_id: number
  idea_stage: string | null
  idea: string | null
  description: string | null
  innovation: string | null
  target_customers: string | null
  sector: string | null
  originality: string | null
  other_details: string | null
  business_model: string | null
  supervisor_name: string | null
  submission_date: string | null
  modified_date: string | null
  is_final: boolean | number
  in_pole: boolean | number
  approved_by_dean: boolean | number
  faculty_id: number
  advisor_id: number | null
  idea_origin: string | null
}

interface Event {
  id: number
  title: string
  date: string
  location: string
  type: string
}

export default function MyAccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [startup, setStartup] = useState<Startup | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    setLoading(true)
    
    axios.post(`${apiUrl}/api/get-student-profile`, {
      token: accessToken
    })
    .then(response => {
      setProfile(response.data.student);
    })
    .catch(err => {
    });

    axios.get(`${apiUrl}/api/startup/get/my-startup`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
      .then(response => {
        const data = response.data;
        if (data && data.startup) {
          const startup: Startup = {
            id: data.startup.id,
            name: data.startup.name,
            industry: data.startup.industry,
            stage: data.startup.stage,
            join_date: data.startup.join_date,
            status: data.startup.status,
            progress: data.startup.progress,
            team_id: data.startup.team_id,
            idea_stage: data.startup.idea_stage,
            idea: data.startup.idea,
            description: data.startup.description,
            innovation: data.startup.innovation,
            target_customers: data.startup.target_customers,
            sector: data.startup.sector,
            originality: data.startup.originality,
            other_details: data.startup.other_details,
            business_model: data.startup.business_model,
            supervisor_name: data.startup.supervisor_name,
            submission_date: data.startup.submission_date,
            modified_date: data.startup.modified_date,
            is_final: data.startup.is_final,
            in_pole: data.startup.in_pole,
            approved_by_dean: data.startup.approved_by_dean,
            faculty_id: data.startup.faculty_id,
            advisor_id: data.startup.advisor_id,
            idea_origin: data.startup.idea_origin,
          };
          setStartup(startup);
        }
       })
      .catch(err => {
      })
      .finally(() => {
        setLoading(false)
      })

    // axios.get(`${apiUrl}/api/event/get/my-startup`)
    //   .then(response => {
    //     const sortedEvents = response.data.data
    //       .filter((event: Event) => new Date(event.date) >= new Date())
    //       .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
    //       .slice(0, 3)
    //     setEvents(sortedEvents)
    //   }
    // ).catch(err => { })
    // .finally(() => {
    //   setLoading(false)
    // })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif"
      case "warning":
        return "En attente"
      case "inactive":
        return "Inactif"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 container py-12">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement de votre compte...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mon Compte</h1>
            <p className="text-muted-foreground">Gérez votre profil, vos startups et vos événements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24">
                  {profile?.avatar ? (
                    <AvatarImage
                      src={profile.avatar || "/placeholder.svg"}
                      alt={`${profile.first_name_ar} ${profile.last_name_ar}`}
                    />
                  ) : (
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      {profile ? getInitials(profile.first_name_ar, profile.last_name_ar) : "??"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold">
                    {profile ? `${profile.first_name_ar} ${profile.last_name_ar}` : "Utilisateur"}
                  </h2>
                  <p className="text-muted-foreground mb-2">{profile?.matricule || "Matricule non disponible"}</p>
                  <p className="text-muted-foreground">{profile?.email || "Email non disponible"}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link href="/my-account/my-profile">
                    <Button variant="outline" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profil
                    </Button>
                  </Link>
                  <Link href="/my-account/settings">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Paramètres
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Startup Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <CardTitle>Ma Startup</CardTitle>
                  </div>
                  <Link href="/my-account/my-startups">
                    <Button variant="ghost" size="sm" className="gap-1">
                      Voir tout <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>Gérez votre projet entrepreneurial</CardDescription>
              </CardHeader>
              <CardContent>
                {startup ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{startup.name}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(startup.status)}`}>
                        {getStatusText(startup.status)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progression</span>
                        <span>{startup.progress || 0}%</span>
                      </div>
                      <Progress value={startup.progress || 0} className="h-2" />
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Étape: {startup.stage || "Non spécifié"}</span>
                      </div>
                    </div>
                    <div className="flex justify-between pt-2">
                      <div className="flex items-center gap-1 text-sm">
                        <CheckCircle
                          className={`h-4 w-4 ${startup.status === "active" ? "text-green-500" : "text-muted-foreground"}`}
                        />
                        <span className="text-muted-foreground">Projet actif</span>
                      </div>
                      <Link href="/my-account/my-startups">
                        <Button size="sm">Gérer</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">Aucune startup</h3>
                    <p className="text-muted-foreground mb-4">Vous n'avez pas encore créé de startup</p>
                    <Button>Créer une startup</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Events Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <CardTitle>Mes Événements</CardTitle>
                  </div>
                  <Link href="/my-account/my-events">
                    <Button variant="ghost" size="sm" className="gap-1">
                      Voir tout <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <CardDescription>Vos prochains événements</CardDescription>
              </CardHeader>
              <CardContent>
                {events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event, index) => (
                      <div key={event.id} className="flex items-start gap-4">
                        <div className="bg-muted rounded-md p-2 text-center min-w-[60px]">
                          <div className="text-lg font-bold text-primary">{new Date(event.date).getDate()}</div>
                          <div className="text-xs">
                            {new Date(event.date).toLocaleDateString("fr-FR", { month: "short" })}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full bg-muted">{event.type}</div>
                      </div>
                    ))}
                    <div className="pt-2 text-center">
                      <Link href="/my-account/my-events">
                        <Button variant="outline" size="sm">
                          Voir tous mes événements
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">Aucun événement</h3>
                    <p className="text-muted-foreground mb-4">Vous n'avez pas d'événements à venir</p>
                    <Link href="/events">
                      <Button>Parcourir les événements</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Accès rapide</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  <Link
                    href="/my-account/my-profile"
                    className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                  >
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Mon profil</p>
                      <p className="text-xs text-muted-foreground">Gérer vos informations personnelles</p>
                    </div>
                  </Link>
                  <Link
                    href="/my-account/my-startups"
                    className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                  >
                    <Briefcase className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Ma startup</p>
                      <p className="text-xs text-muted-foreground">Gérer votre projet entrepreneurial</p>
                    </div>
                  </Link>
                  <Link
                    href="/my-account/my-events"
                    className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                  >
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Mes événements</p>
                      <p className="text-xs text-muted-foreground">Voir vos inscriptions et événements</p>
                    </div>
                  </Link>
                  <Link
                    href="/my-account/settings"
                    className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
                  >
                    <Settings className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Paramètres</p>
                      <p className="text-xs text-muted-foreground">Configurer votre compte</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>État du compte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm">Sécurité</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    <span className="text-xs text-muted-foreground">Moyenne</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    <span className="text-sm">Notifications</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="text-xs text-muted-foreground">Activées</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">Documents</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    <span className="text-xs text-muted-foreground">Incomplets</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span className="text-sm">Profil académique</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="text-xs text-muted-foreground">Complet</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Compléter mon profil
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
