"use client"

import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronRight,
  Calendar,
  Users,
  Briefcase,
  Award,
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react"
import { UserPlus, Share2 } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import api from "@/lib/axios"
import { logout } from "@/store/slices/authSlice"
import { RootState } from "@/store"
import toast from "react-hot-toast"
  
type ParticipantCounts = {
  [eventId: number]: number
}

export default function Home() {
  const [projects, setProjects] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [stats, setStats] = useState<any>([])
  const [participantCounts, setParticipantCounts] = useState<ParticipantCounts>({})
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const role = useSelector((state: RootState) => state.auth.role);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  function formatDate(isoDate: any) {
    const date = new Date(isoDate)
    const day = date.getUTCDate()
    const monthIndex = date.getUTCMonth()
    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ]
    const monthName = monthNames[monthIndex]

    return {
      day: day.toString().padStart(2, "0"),
      month: monthName,
    }
  }

  const fetchProjects = () => {
    api
      .get(`${apiUrl}/api/startup/all/recent`, {
        withCredentials: false,
      })
      .then((response) => {
        setProjects(response.data.slice(0, 3))
      })
      .catch((err) => {
      })
  }

  const fetchEvents = () => {
    api
      .get(`${apiUrl}/api/event/upcoming`, {
        withCredentials: false,
      })
      .then((response) => {
        setEvents(response.data.data.slice(0, 3))
      })
      .catch((err) => {
      })
  }

  const fetchStats = () => {
    axios
      .get(`${apiUrl}/api/stats`)
      .then(response => {
        setStats(response.data.data)
      })
      .catch( (err) => {
      }
      )
    
  }
  
  useEffect(() => {
    fetchProjects()
    fetchEvents()
    fetchStats()
    
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/thumbnail-aFlPs5tpcKuHWq8kmfEaQrc1JWZmnB.png"
                  alt="Logo Université de Guelma"
                  width={40}
                  height={40} 
                  className="h-10 w-auto"
                />
              </Link>
              <div className="h-6 w-px bg-muted" />
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20incubqteur-NWDtZ5DEtRRBOfP3FkY6RPl6pbjfTe.png"
                alt="Logo Incubateur"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <nav className="hidden md:flex gap-6">
              <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
                Accueil
              </Link>
              <Link href="#about" className="text-sm font-medium transition-colors hover:text-primary">
                À propos
              </Link>
              <Link href="#programs" className="text-sm font-medium transition-colors hover:text-primary">
                Programmes
              </Link>
              <Link href="/events" className="text-sm font-medium transition-colors hover:text-primary">
                Événements
              </Link>
              <Link href="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
                Témoignages
              </Link>
              <Link href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              { isAuthenticated && role === "student" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="my-account/my-startup" passHref>
                        <div className="flex items-center">
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>Ma startup</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="my-account/my-events" passHref>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Mes événements</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="my-account/my-profile" passHref>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profil</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="my-account/settings" passHref>
                        <div className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Paramètres</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                          const toastId = toast.loading("Logging Out ...");
                          axios.post(`${apiUrl}/api/user/logout`, {}, { withCredentials: true })
                            .then(() => {
                              dispatch(logout());
                              toast.dismiss(toastId);
                              toast.success("Logout successfully")
                            })
                            .catch(() => {
                              toast.dismiss(toastId);
                              toast.error("Logout failed, please try again.")
                            });
                        }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Se déconnecter</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : isAuthenticated && role === "admin" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                        >
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span className="sr-only">Admin menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Admin Menu</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link href="/dashboard" passHref>
                            <div className="flex items-center">
                              <span>Dashboard</span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                        onClick={() => {
                          const toastId = toast.loading("Logging Out ...");
                          axios.post(`${apiUrl}/api/user/logout`, {}, { withCredentials: true })
                            .then((response) => {
                              dispatch(logout());
                              toast.dismiss(toastId);
                              toast.success("Logout successfully")
                            })
                            .catch((error) => {
                              toast.dismiss(toastId);
                              toast.error("Logout failed, please try again.")
                            });
                        }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Se déconnecter</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
                
              ): (
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Se connecter
                  </Button>
                </Link>
              )}
            </div>
            <Button variant="outline" size="icon" className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-primary to-primary-700">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                Incubateur d'Innovation et d'Entrepreneuriat
              </h1>
              <p className="max-w-[600px] text-gray-200 md:text-xl">
                Transformez vos idées en entreprises prospères avec notre programme d'incubation complet à l'Université
                de Guelma.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="bg-accent text-accent-foreground hover:bg-accent-600">Postuler Maintenant</Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  En Savoir Plus
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Incubateur BAG Services"
                  width={500}
                  height={300}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-primary"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge className="bg-primary hover:bg-primary-600">À PROPOS</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Notre Incubateur</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                L'incubateur BAG Services de l'Université de Guelma accompagne les porteurs de projets innovants dans
                leur parcours entrepreneurial.
              </p>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center mt-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Notre Mission</h3>
              <p className="text-gray-500">
                Nous offrons un environnement propice à l'innovation et au développement des startups à travers deux
                programmes principaux : la catégorie 1275 et l'incubation internationale. Notre objectif est de
                transformer les idées innovantes en entreprises viables et durables.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-secondary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Accompagnement personnalisé</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-secondary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Mentorat par des experts</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-secondary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Accès aux financements</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-secondary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Réseau international de partenaires</span>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="p-3 rounded-full bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-center">Innovation</h3>
                <p className="text-center text-sm text-gray-500">Développement de solutions innovantes</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-center">Collaboration</h3>
                <p className="text-center text-sm text-gray-500">Travail d'équipe et partage de connaissances</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="p-3 rounded-full bg-primary/10">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-center">International</h3>
                <p className="text-center text-sm text-gray-500">Ouverture sur le monde et les marchés globaux</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="p-3 rounded-full bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-center">Excellence</h3>
                <p className="text-center text-sm text-gray-500">Recherche constante de la qualité</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge className="bg-primary hover:bg-primary-600">PROGRAMMES</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Nos Programmes d'Incubation</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Découvrez nos deux programmes principaux conçus pour répondre aux besoins spécifiques des entrepreneurs.
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:gap-12 mt-12">
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-video relative">
                <Image
                  src="/placeholder.svg?height=300&width=600"
                  alt="Programme 1275"
                  width={600}
                  height={300}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <h3 className="text-2xl font-bold text-white">Programme 1275</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-500 mb-4">
                  Le programme 1275 est spécialement conçu pour les entrepreneurs en phase initiale. Il offre un
                  accompagnement intensif pour transformer une idée en prototype viable.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span className="text-sm">Durée: 6 mois</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span className="text-sm">Ateliers hebdomadaires</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span className="text-sm">Mentorat personnalisé</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span className="text-sm">Accès aux ressources universitaires</span>
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button className="flex-1">S'inscrire</Button>
                  <Button variant="outline" className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                    Télécharger affiche
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-video relative">
                <Image
                  src="/placeholder.svg?height=300&width=600"
                  alt="Programme d'Incubation Internationale"
                  width={600}
                  height={300}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <h3 className="text-2xl font-bold text-white">Incubation Internationale</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-500 mb-4">
                  Notre programme d'incubation internationale est destiné aux startups ayant un potentiel de croissance
                  global. Il offre un accès à un réseau international de mentors et d'investisseurs.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span className="text-sm">Durée: 12 mois</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span className="text-sm">Opportunités de financement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span className="text-sm">Réseau international</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span className="text-sm">Accès aux marchés globaux</span>
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button className="flex-1">S'inscrire</Button>
                  <Button variant="outline" className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                    Télécharger affiche
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dynamic Space Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <Badge className="bg-primary hover:bg-primary-600">ESPACE DYNAMIQUE</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Découvrez Notre Écosystème</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explorez la vie au sein de notre incubateur à travers nos activités, notre équipe et nos projets.
              </p>
            </div>
          </div>

          {/* Gallery */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-primary">Galerie d'Événements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Événement 1"
                    width={300}
                    height={300}
                    className="h-auto w-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Événement 2"
                    width={300}
                    height={300}
                    className="h-auto w-full object-cover transition-all hover:scale-105"
                  />
                </div>
              </div>
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Événement 3"
                    width={300}
                    height={300}
                    className="h-auto w-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Événement 4"
                    width={300}
                    height={300}
                    className="h-auto w-full object-cover transition-all hover:scale-105"
                  />
                </div>
              </div>
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Événement 5"
                    width={300}
                    height={300}
                    className="h-auto w-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Événement 6"
                    width={300}
                    height={300}
                    className="h-auto w-full object-cover transition-all hover:scale-105"
                  />
                </div>
              </div>
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Événement 7"
                    width={300}
                    height={300}
                    className="h-auto w-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Événement 8"
                    width={300}
                    height={300}
                    className="h-auto w-full object-cover transition-all hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Staff */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-primary">Notre Équipe</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="mb-4 overflow-hidden rounded-full">
                    <Image
                      src="/placeholder.svg?height=150&width=150"
                      alt={`Staff ${i}`}
                      width={150}
                      height={150}
                      className="h-32 w-32 object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <h4 className="text-lg font-bold">Nom Prénom</h4>
                  <p className="text-sm text-gray-500">Fonction</p>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-primary">Projets Incubés</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-video relative">
                    {/* <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt={`Projet ${i}`}
                      width={400}
                      height={200}
                      className="object-cover w-full h-full"
                    /> */}
                  </div>
                  <CardContent className="p-4">
                    <h4 className="text-lg font-bold mb-2">{project.name}</h4>
                    <p className="text-sm text-gray-500 mb-2">{project.description}</p>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{project.industry}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Partners */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-primary">Nos Partenaires</h3>
            <div className="flex flex-wrap justify-center gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all"
                >
                  <Image
                    src="/placeholder.svg?height=80&width=160"
                    alt={`Partenaire ${i}`}
                    width={160}
                    height={80}
                    className="h-16 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-primary">Nos Chiffres Clés</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <h4 className="text-4xl font-bold text-primary mb-2">
                  {
                    stats.length > 1 && stats[1]?.counted_obj === "startups"
                      ? stats[1]?.counter
                      : 0
                  }
                </h4>
                <p className="text-sm text-gray-500">Projets Incubés</p>
              </Card>
              <Card className="text-center p-6">
                <h4 className="text-4xl font-bold text-primary mb-2">85%</h4>
                <p className="text-sm text-gray-500">Taux de Réussite</p>
              </Card>
              <Card className="text-center p-6">
                <h4 className="text-4xl font-bold text-primary mb-2">25</h4>
                <p className="text-sm text-gray-500">Partenaires</p>
              </Card>
              <Card className="text-center p-6">
                <h4 className="text-4xl font-bold text-primary mb-2">
                  {
                    stats.length > 1 && stats[1]?.counted_obj === "events"
                      ? stats[1]?.counter
                      : 0
                  }
                </h4>
                <p className="text-sm text-gray-500">Événements Organisés</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge className="bg-primary hover:bg-primary-600">TÉMOIGNAGES</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ce Qu'ils Disent de Nous</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Découvrez les expériences de nos entrepreneurs, mentors et partenaires.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="relative p-6">
                <div className="absolute -top-4 left-6 text-4xl text-primary">"</div>
                <div className="pt-4">
                  <p className="text-gray-500 mb-4">
                    L'incubateur BAG Services m'a fourni toutes les ressources et le soutien dont j'avais besoin pour
                    transformer mon idée en entreprise viable. Le mentorat et les ateliers ont été inestimables.
                  </p>
                  <div className="flex items-center gap-4">
                    <Image
                      src="/placeholder.svg?height=60&width=60"
                      alt={`Témoignage ${i}`}
                      width={60}
                      height={60}
                      className="rounded-full h-12 w-12 object-cover"
                    />
                    <div>
                      <h4 className="font-bold">Nom Prénom</h4>
                      <p className="text-sm text-gray-500">Entrepreneur, Nom de la Startup</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge className="bg-primary hover:bg-primary-600">ÉVÉNEMENTS</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Événements à Venir</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Participez à nos prochains événements et restez connecté à notre communauté.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {events.map((event, i) => {
              const { day, month } = formatDate(event.date)
              return (
                <Card key={event.id} className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-video relative">
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt={`Événement ${i}`}
                      width={400}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-white rounded-lg p-2 text-center shadow-md">
                        <div className="text-xl font-bold text-primary">{day}</div>
                        <div className="text-xs">{month}</div>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full h-8 w-8 bg-white/80 hover:bg-white text-primary"
                        onClick={(e) => {
                          e.preventDefault()
                          alert(`Événement ${i} ajouté aux favoris`)
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                        <span className="sr-only">Favoriser</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full h-8 w-8 bg-white/80 hover:bg-white text-primary"
                        onClick={(e) => {
                          e.preventDefault()
                          alert(`Partager l'événement ${i}`)
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Partager</span>
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{event.title}</h3>
                      <Badge
                        className={
                          event.capacity === participantCounts[event.id]
                            ? "bg-green-100 text-green-800"
                            : event.capacity - (participantCounts[event.id] || 0) <= 3
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                        }
                      >
                        {event.capacity === participantCounts[event.id]
                          ? "Places Completed"
                          : event.capacity - (participantCounts[event.id] || 0) <= 3
                            ? "Bientôt complet"
                            : "Still Places"}
                      </Badge>
                    </div>
                    <p className="text-gray-500 mb-4">
                      Description de l'événement et des thèmes qui seront abordés lors de cette session.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>{`${event.date}`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Users className="h-4 w-4" />
                      <span>
                        {participantCounts[event.id] || 0} Taken / {event.capacity} places
                      </span>
                    </div>
                    <div className="space-y-2">
                      <Link href={`/events/${i}`}>
                        <Button className="w-full">Voir plus de détails</Button>
                      </Link>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          className="flex items-center justify-center gap-1"
                          onClick={(e) => {
                            e.preventDefault()
                            alert(`Événement ${i} ajouté aux favoris`)
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                          <span className="sr-only md:not-sr-only md:text-xs lg:text-sm">Favoriser</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center justify-center gap-1"
                          onClick={(e) => {
                            e.preventDefault()
                            alert(`Partager l'événement ${i}`)
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:text-xs lg:text-sm">Partager</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center justify-center gap-1"
                          onClick={(e) => {
                            e.preventDefault()
                            alert(`S'inscrire à l'événement ${i}`)
                          }}
                        >
                          <UserPlus className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:text-xs lg:text-sm">S'inscrire</span>
                        </Button>
                      </div>
                      <Link href={`/events/${i}`}>
                        <Button variant="ghost" className="w-full text-primary">
                          Voir plus de détails
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/events">
              <Button className="gap-2">
                Voir tous les événements
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Prêt à Rejoindre Notre Incubateur?
              </h2>
              <p className="max-w-[600px] text-white/80 md:text-xl">
                Postulez dès maintenant et transformez votre idée en entreprise prospère avec notre soutien.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="bg-accent text-accent-foreground hover:bg-accent-600">Postuler Maintenant</Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Nous Contacter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="w-full py-6 md:py-12 bg-primary text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20incubqteur-NWDtZ5DEtRRBOfP3FkY6RPl6pbjfTe.png"
                  alt="Logo Incubateur"
                  width={120}
                  height={40}
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-sm text-white/70">
                Incubateur de l'Université 8 Mai 1945 Guelma
                <br />
                Accompagnant les entrepreneurs vers le succès
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-white hover:text-secondary">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-white hover:text-secondary">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-white hover:text-secondary">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-white hover:text-secondary">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link href="#" className="text-white hover:text-secondary">
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Liens Rapides</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-secondary">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-secondary">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="#programs" className="hover:text-secondary">
                    Programmes
                  </Link>
                </li>
                <li>
                  <Link href="#events" className="hover:text-secondary">
                    Événements
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className="hover:text-secondary">
                    Témoignages
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Université 8 Mai 1945, Guelma, Algérie</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href="tel:+213123456789" className="hover:text-secondary">
                    +213 12 345 6789
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:contact@bagservices.com" className="hover:text-secondary">
                    contact@bagservices.com
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Newsletter</h3>
              <p className="text-sm text-white/70">
                Abonnez-vous à notre newsletter pour recevoir les dernières actualités.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Votre email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button className="bg-accent text-accent-foreground hover:bg-accent-600">S'abonner</Button>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-white/20 pt-8 text-center text-sm">
            <p>© 2025 BAG Services. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
