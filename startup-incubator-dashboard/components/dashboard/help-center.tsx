"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, FileText, Video, MessageSquare, Mail, Phone } from "lucide-react"

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans la documentation..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="videos">Vidéos</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Questions Fréquentes</CardTitle>
              <CardDescription>Trouvez rapidement des réponses aux questions les plus courantes</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Comment ajouter une nouvelle startup ?</AccordionTrigger>
                  <AccordionContent>
                    Pour ajouter une nouvelle startup, accédez à la page "Startups" et cliquez sur le bouton "Ajouter
                    une Startup". Remplissez le formulaire avec les informations requises et cliquez sur "Enregistrer".
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Comment assigner un mentor à une startup ?</AccordionTrigger>
                  <AccordionContent>
                    Vous pouvez assigner un mentor à une startup de deux façons : soit depuis la page de détail de la
                    startup, soit depuis la page "Mentors" en utilisant le menu d'actions pour le mentor concerné.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Comment planifier un événement ?</AccordionTrigger>
                  <AccordionContent>
                    Pour planifier un événement, accédez à la page "Événements" et cliquez sur "Ajouter un Événement".
                    Remplissez les détails de l'événement, choisissez la date et l'heure, puis enregistrez.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Comment générer des rapports ?</AccordionTrigger>
                  <AccordionContent>
                    Accédez à la page "Rapports" et cliquez sur "Nouveau Rapport". Sélectionnez le type de rapport que
                    vous souhaitez générer, configurez les paramètres et cliquez sur "Générer".
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Comment suivre la progression d'une startup ?</AccordionTrigger>
                  <AccordionContent>
                    Utilisez la page "Suivi de Projets" pour suivre la progression de chaque startup. Vous pouvez voir
                    les jalons, les tâches et les KPIs pour chaque projet.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Guides et Documentation</CardTitle>
              <CardDescription>Consultez nos guides détaillés pour utiliser la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: "Guide de démarrage rapide",
                    description: "Apprenez les bases de la plateforme",
                    icon: FileText,
                  },
                  {
                    title: "Gestion des startups",
                    description: "Comment gérer efficacement vos startups",
                    icon: FileText,
                  },
                  {
                    title: "Programme de mentorat",
                    description: "Optimisez votre programme de mentorat",
                    icon: FileText,
                  },
                  {
                    title: "Organisation d'événements",
                    description: "Planifiez et gérez vos événements",
                    icon: FileText,
                  },
                  {
                    title: "Analyse et rapports",
                    description: "Exploitez les données de votre incubateur",
                    icon: FileText,
                  },
                  {
                    title: "Gestion des ressources",
                    description: "Optimisez l'utilisation de vos ressources",
                    icon: FileText,
                  },
                ].map((guide, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <guide.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{guide.title}</h3>
                      <p className="text-sm text-muted-foreground">{guide.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tutoriels Vidéo</CardTitle>
              <CardDescription>Apprenez visuellement avec nos tutoriels vidéo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: "Introduction à la plateforme",
                    duration: "5:32",
                    thumbnail: "/placeholder.svg?height=120&width=240",
                  },
                  {
                    title: "Comment ajouter et gérer des startups",
                    duration: "8:15",
                    thumbnail: "/placeholder.svg?height=120&width=240",
                  },
                  {
                    title: "Gestion efficace des mentors",
                    duration: "6:47",
                    thumbnail: "/placeholder.svg?height=120&width=240",
                  },
                  {
                    title: "Planification d'événements",
                    duration: "7:23",
                    thumbnail: "/placeholder.svg?height=120&width=240",
                  },
                ].map((video, index) => (
                  <div
                    key={index}
                    className="flex flex-col space-y-2 border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="w-full h-auto" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-black/70 flex items-center justify-center">
                          <Video className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">{video.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Contactez-nous</CardTitle>
              <CardDescription>Besoin d'aide supplémentaire ? Contactez notre équipe de support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Chat en direct</h3>
                      <p className="text-sm text-muted-foreground">Discutez avec un membre de notre équipe</p>
                      <Button variant="link" className="p-0 h-auto mt-1">
                        Démarrer un chat
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-muted-foreground">
                        Envoyez-nous un email, nous vous répondrons sous 24h
                      </p>
                      <Button variant="link" className="p-0 h-auto mt-1">
                        support@incubator.com
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Téléphone</h3>
                      <p className="text-sm text-muted-foreground">Appelez-nous du lundi au vendredi, de 9h à 18h</p>
                      <Button variant="link" className="p-0 h-auto mt-1">
                        +33 1 23 45 67 89
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input id="name" placeholder="Votre nom" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="votre@email.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Comment pouvons-nous vous aider ?" rows={4} />
                  </div>

                  <Button className="w-full">Envoyer le message</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

