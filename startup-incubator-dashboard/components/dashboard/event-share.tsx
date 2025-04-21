"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { Copy, Facebook, Twitter, Linkedin, Mail, LinkIcon } from "lucide-react"

interface EventShareProps {
  eventId: string
}

export function EventShare({ eventId }: EventShareProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("social")
  const [emailSubject, setEmailSubject] = useState("Invitation à un événement")
  const [emailContent, setEmailContent] = useState(
    "Bonjour,\n\nJe vous invite à participer à cet événement qui pourrait vous intéresser.\n\nVoici le lien: https://example.com/events/1\n\nCordialement,",
  )
  const [emailRecipients, setEmailRecipients] = useState("")

  const eventUrl = `https://example.com/events/${eventId}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl)
    alert("Lien copié dans le presse-papiers")
  }

  const handleShareSocial = (platform: string) => {
    // Dans une application réelle, ceci ouvrirait une fenêtre de partage
    alert(`Partage sur ${platform}`)
  }

  const handleSendEmails = () => {
    // Dans une application réelle, ceci enverrait des emails via une API
    alert(`Emails envoyés à ${emailRecipients.split(",").length} destinataires`)
    router.push("/dashboard/events")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partager l'événement</CardTitle>
        <CardDescription>Partagez cet événement sur les réseaux sociaux ou par email</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="embed">Intégrer</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <Input value={eventUrl} readOnly className="w-full" />
              </div>
              <Button variant="outline" onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copier
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleShareSocial("Facebook")}
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleShareSocial("Twitter")}
              >
                <Twitter className="h-4 w-4 text-sky-500" />
                Twitter
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleShareSocial("LinkedIn")}
              >
                <Linkedin className="h-4 w-4 text-blue-700" />
                LinkedIn
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => handleShareSocial("Email")}>
                <Mail className="h-4 w-4 text-gray-500" />
                Email
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email-recipients">Destinataires (séparés par des virgules)</Label>
              <Input
                id="email-recipients"
                value={emailRecipients}
                onChange={(e) => setEmailRecipients(e.target.value)}
                placeholder="email1@example.com, email2@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-subject">Objet de l'email</Label>
              <Input id="email-subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-content">Contenu de l'email</Label>
              <Textarea
                id="email-content"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => router.push("/dashboard/events")}>
                Annuler
              </Button>
              <Button onClick={handleSendEmails} disabled={!emailRecipients}>
                Envoyer
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="embed" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="embed-code">Code d'intégration</Label>
              <Textarea
                id="embed-code"
                value={`<iframe src="https://example.com/events/${eventId}/embed" width="100%" height="400" frameborder="0"></iframe>`}
                readOnly
                className="min-h-[100px] font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="show-header" defaultChecked />
                  <Label htmlFor="show-header">Afficher l'en-tête</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="show-description" defaultChecked />
                  <Label htmlFor="show-description">Afficher la description</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="show-register" defaultChecked />
                  <Label htmlFor="show-register">Afficher le bouton d'inscription</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copier le code
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

