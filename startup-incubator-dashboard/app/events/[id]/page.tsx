"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Share2, Users, ChevronLeft, ExternalLink, Eye } from "lucide-react"
import { EventRegistrationForm } from "@/components/events/event-registration-form"
import { EventDocuments } from "@/components/events/event-documents"
import { EventComments } from "@/components/events/event-comments"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import loader from "@/components/ui/loader"
import axios from "axios"

export default function EventPage({ params }: { params: Promise<{ id: number }> }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const event = useSelector((state: any) => state.event)
  const [posterUrl, setPosterUrl] = useState("");
  const [loading, setLoading] = useState(true)
  const [intervenants, setIntervenants] = useState<any[]>([])
  const remainingPlaces = (event?.capacity ?? 0) - (event?.registered ?? 0);

  const fetchIntervenants = () => {
    
    axios.get(`${apiUrl}/api/intervenant/event/${event.id}`)
      .then((response) => {
        console.log(response.data);
        
      setIntervenants(response.data.data)
      })
      .catch((error) => {
        console.log(error);
      }
      
    )
  }
  useEffect(() => {
    if (event) {
      fetchIntervenants()
      setLoading(false);
      axios.get(`${apiUrl}/api/event/fiche-poster/${event.id}`)
          .then(() => {
            setPosterUrl(`${apiUrl}/api/event/fiche-poster/${event.id}`);
          })
          .catch(() => {
          })
      fetchIntervenants()
    }
    else {
      setLoading(true);
    }
  }, [event]);

  if (loading) {
    return loader();
  }
    return (
      <div className="container py-8">
        {loading ? (
          loader()
        ) : (
            <>
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
                  event?.type === "workshop"
                    ? "bg-blue-100 text-blue-800"
                    : event?.type === "conference"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                }
              >
                {event?.type === "workshop"
                  ? "Atelier"
                  : event?.type === "conference"
                    ? "Conférence"
                    : "Événement"}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Places disponibles
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">{event?.title}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                // Dans une application réelle, ceci ouvrirait une boîte de dialogue de partage
                alert(`Partager l'événement "${event?.title}"`)
              }}
            >
              <Share2 className="h-4 w-4" />
              <span>Partager</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
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
                <Image src={posterUrl || "/placeholder.svg"} alt={event?.title} fill className="object-cover" />
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
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: event?.description }} />
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
                        <p>{event?.date}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Horaire</h3>
                        <p>{event?.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Lieu</h3>
                        <p>{event?.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Participants</h3>
                        <p>
                          {event?.registered} inscrits sur {event?.capacity} places disponibles
                        </p>
                        <div className="mt-2 w-full">
                          <Progress value={(event !== null? event?.registered / event?.capacity : 0) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
{/* 
              <Card>
                <CardHeader>
                  <CardTitle>Événements associés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {event?.relatedEvents.map((relatedEvent) => (
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
              </Card> */}
            </TabsContent>

            <TabsContent value="speakers" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Intervenants</CardTitle>
                  <CardDescription>Découvrez les experts qui animeront cet événement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {intervenants.map((intervenant) => (
                      <div key={intervenant.id} className="flex flex-col md:flex-row gap-4 items-start">
                        
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold">{intervenant.nom}</h3>
                          <p className="text-primary font-medium">{intervenant.role}</p>
                          <p className="text-sm text-muted-foreground">{intervenant.expertise}</p>
                          <p>{intervenant.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <EventDocuments documents={event?.supp} />
            </TabsContent>

            <TabsContent value="comments" className="mt-4">
              <EventComments eventId={event?.id} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {/* Carte d'inscription */}
          <Card>
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle>S'inscrire à cet événement</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                {remainingPlaces} places restantes sur {event?.capacity}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <EventRegistrationForm eventId={event?.id} />
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
                  src={posterUrl || "/placeholder.svg"}
                  alt={`Affiche: ${event?.title}`}
                  fill
                  className="object-contain p-2"
                />
              </div>
            </CardContent>
          </Card>
          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {event?.tags}
                  </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div></>
        )}
    </div>
  )
}

