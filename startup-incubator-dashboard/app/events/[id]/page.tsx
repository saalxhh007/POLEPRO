"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Share2, Users, ChevronLeft, ExternalLink, Eye } from "lucide-react"
import { EventRegistrationForm } from "@/components/events/event-registration-form"
import { EventParticipantsList } from "@/components/events/event-participants-list"
import { EventDocuments } from "@/components/events/event-documents"
import { EventComments } from "@/components/events/event-comments"

export default function EventPage({ params }: { params: { id: string } }) {
  // Dans une application réelle, vous récupéreriez les détails de l'événement à partir d'une API ou d'une base de données
  const event = {
    id: params.id,
    title: "Atelier d'Innovation Entrepreneuriale",
    description:
      "Cet atelier intensif de trois heures vous permettra d'explorer les méthodologies d'innovation les plus récentes et d'apprendre à les appliquer à votre projet entrepreneurial. Vous travaillerez en petits groupes sur des cas pratiques et bénéficierez des conseils personnalisés de nos mentors experts.",
    longDescription: `
      <p>L'innovation est au cœur de tout projet entrepreneurial réussi. Cet atelier vous donnera les outils et méthodologies nécessaires pour développer une approche innovante dans votre startup.</p>
      
      <p>Au programme :</p>
      <ul>
        <li>Introduction aux méthodologies d'innovation (Design Thinking, Lean Startup)</li>
        <li>Techniques de créativité et de génération d'idées</li>
        <li>Validation des hypothèses et prototypage rapide</li>
        <li>Études de cas et exemples de réussite</li>
        <li>Travaux pratiques en petits groupes</li>
        <li>Sessions de feedback personnalisé avec nos mentors</li>
      </ul>
      
      <p>Cet atelier s'adresse aux entrepreneurs en phase de démarrage, aux porteurs de projets, et à toute personne intéressée par l'innovation entrepreneuriale.</p>
      
      <p>Le nombre de places est limité pour garantir une expérience de qualité et des interactions personnalisées avec nos mentors.</p>
    `,
    date: "15 Juin 2025",
    time: "14:00 - 17:00",
    location: "Université de Guelma, Salle de Conférence A",
    locationDetails: "Bâtiment principal, 2ème étage, Salle 203",
    capacity: 50,
    registered: 32,
    status: "upcoming",
    category: "workshop",
    tags: ["innovation", "entrepreneuriat", "méthodologie", "design thinking"],
    speakers: [
      {
        id: "1",
        name: "Dr. Ahmed Benali",
        role: "Expert en Innovation",
        organization: "Université de Guelma",
        bio: "Docteur en management de l'innovation avec plus de 15 ans d'expérience dans l'accompagnement de startups innovantes.",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "2",
        name: "Samira Hadj",
        role: "Entrepreneure & Mentore",
        organization: "TechInnovate",
        bio: "Fondatrice de trois startups à succès et mentore pour plus de 50 projets entrepreneuriaux.",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    poster: "/placeholder.svg?height=800&width=600",
    documents: [
      { id: "1", name: "Programme détaillé", type: "pdf", size: "1.2 MB", url: "#" },
      { id: "2", name: "Supports de présentation", type: "pptx", size: "5.8 MB", url: "#" },
      { id: "3", name: "Ressources complémentaires", type: "pdf", size: "3.4 MB", url: "#" },
    ],
    relatedEvents: [
      { id: "2", title: "Pitch Perfect: Présenter son projet aux investisseurs", date: "20 Juin 2025" },
      { id: "3", title: "Financement des startups: Options et stratégies", date: "25 Juin 2025" },
    ],
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/events" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Retour aux événements
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge
                className={
                  event.category === "workshop"
                    ? "bg-blue-100 text-blue-800"
                    : event.category === "conference"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                }
              >
                {event.category === "workshop"
                  ? "Atelier"
                  : event.category === "conference"
                    ? "Conférence"
                    : "Événement"}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Places disponibles
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                // Dans une application réelle, ceci ouvrirait une boîte de dialogue de partage
                alert(`Partager l'événement "${event.title}"`)
              }}
            >
              <Share2 className="h-4 w-4" />
              <span>Partager</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                // Dans une application réelle, ceci ajouterait l'événement aux favoris
                alert(`Événement "${event.title}" ajouté aux favoris`)
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
              <span>Favoriser</span>
            </Button>
            <Link href="/events">
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Voir tous les événements</span>
              </Button>
            </Link>
            <Link href="/dashboard/events">
              <Button variant="secondary" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>Gérer (Admin)</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Image de l'événement */}
          <Card>
            <CardContent className="p-0 overflow-hidden rounded-lg">
              <div className="relative aspect-video">
                <Image src="/placeholder.svg?height=400&width=800" alt={event.title} fill className="object-cover" />
              </div>
            </CardContent>
          </Card>

          {/* Onglets d'information */}
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="speakers">Intervenants</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="comments">Commentaires</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>À propos de cet événement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: event.longDescription }} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations pratiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Date</h3>
                        <p>{event.date}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Horaire</h3>
                        <p>{event.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Lieu</h3>
                        <p>{event.location}</p>
                        <p className="text-sm text-muted-foreground">{event.locationDetails}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Participants</h3>
                        <p>
                          {event.registered} inscrits sur {event.capacity} places disponibles
                        </p>
                        <div className="mt-2 w-full">
                          <Progress value={(event.registered / event.capacity) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Événements associés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {event.relatedEvents.map((relatedEvent) => (
                      <Link key={relatedEvent.id} href={`/events/${relatedEvent.id}`}>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                          <div>
                            <h3 className="font-medium">{relatedEvent.title}</h3>
                            <p className="text-sm text-muted-foreground">{relatedEvent.date}</p>
                          </div>
                          <ChevronLeft className="h-4 w-4 rotate-180" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="speakers" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Intervenants</CardTitle>
                  <CardDescription>Découvrez les experts qui animeront cet événement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {event.speakers.map((speaker) => (
                      <div key={speaker.id} className="flex flex-col md:flex-row gap-4 items-start">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={speaker.image} alt={speaker.name} />
                          <AvatarFallback>{speaker.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold">{speaker.name}</h3>
                          <p className="text-primary font-medium">{speaker.role}</p>
                          <p className="text-sm text-muted-foreground">{speaker.organization}</p>
                          <p>{speaker.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <EventDocuments documents={event.documents} />
            </TabsContent>

            <TabsContent value="comments" className="mt-4">
              <EventComments eventId={event.id} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {/* Carte d'inscription */}
          <Card>
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle>S'inscrire à cet événement</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                {event.capacity - event.registered} places restantes sur {event.capacity}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <EventRegistrationForm eventId={event.id} />
            </CardContent>
          </Card>

          {/* Affiche de l'événement */}
          <Card>
            <CardHeader>
              <CardTitle>Affiche de l'événement</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <div className="relative aspect-[3/4] bg-muted">
                <Image
                  src={event.poster || "/placeholder.svg"}
                  alt={`Affiche: ${event.title}`}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="p-4">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => {
                    // Dans une application réelle, ceci ouvrirait l'affiche en plein écran
                    alert("Afficher l'affiche en plein écran")
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span>Voir l'affiche en plein écran</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Liste des participants */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Participants</CardTitle>
              <Badge>{event.registered}</Badge>
            </CardHeader>
            <CardContent>
              <EventParticipantsList eventId={event.id} limit={5} />
              <Separator className="my-2" />
              <Button variant="ghost" className="w-full text-primary" asChild>
                <Link href={`/events/${event.id}/participants`}>Voir tous les participants</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

