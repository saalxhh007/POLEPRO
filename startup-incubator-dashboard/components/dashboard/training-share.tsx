"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Share2, Copy, Facebook, Twitter, Linkedin, Mail, LinkIcon, CheckCircle, QrCode, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface TrainingShareProps {
  trainingId: string
  trainingTitle: string
  trainingDescription: string
  trainingDate: string
  trainingImage: string
}

export function TrainingShare({
  trainingId,
  trainingTitle,
  trainingDescription,
  trainingDate,
  trainingImage,
}: TrainingShareProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [customMessage, setCustomMessage] = useState(
    `Je vous invite à découvrir la formation "${trainingTitle}" qui aura lieu le ${trainingDate}. Inscrivez-vous dès maintenant !`,
  )
  const [includeImage, setIncludeImage] = useState(true)

  // URL de la formation (fictive pour l'exemple)
  const trainingUrl = `https://example.com/trainings/${trainingId}`

  // Code d'intégration (fictif pour l'exemple)
  const embedCode = `<iframe src="https://example.com/embed/trainings/${trainingId}" width="100%" height="450" frameborder="0"></iframe>`

  // Fonction pour copier le lien
  const copyLink = () => {
    navigator.clipboard.writeText(trainingUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Fonction pour copier le code d'intégration
  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Fonction pour partager sur les réseaux sociaux
  const shareOnSocial = (platform: string) => {
    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(trainingUrl)}&quote=${encodeURIComponent(customMessage)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(trainingUrl)}&text=${encodeURIComponent(customMessage)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(trainingUrl)}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(`Formation: ${trainingTitle}`)}&body=${encodeURIComponent(`${customMessage}\n\n${trainingUrl}`)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank")
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Partager la formation</CardTitle>
          <CardDescription>Partagez la formation "{trainingTitle}" sur différentes plateformes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="social" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="social">
                <Share2 className="mr-2 h-4 w-4" />
                Réseaux sociaux
              </TabsTrigger>
              <TabsTrigger value="link">
                <LinkIcon className="mr-2 h-4 w-4" />
                Lien direct
              </TabsTrigger>
              <TabsTrigger value="embed">
                <QrCode className="mr-2 h-4 w-4" />
                Intégration
              </TabsTrigger>
            </TabsList>

            <TabsContent value="social" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-message">Message personnalisé</Label>
                <Textarea
                  id="custom-message"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="min-h-20"
                />
                <div className="flex items-center space-x-2">
                  <Switch id="include-image" checked={includeImage} onCheckedChange={setIncludeImage} />
                  <Label htmlFor="include-image">Inclure l'image de la formation</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 space-y-2"
                  onClick={() => shareOnSocial("facebook")}
                >
                  <Facebook className="h-8 w-8 text-blue-600" />
                  <span>Facebook</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 space-y-2"
                  onClick={() => shareOnSocial("twitter")}
                >
                  <Twitter className="h-8 w-8 text-blue-400" />
                  <span>Twitter</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 space-y-2"
                  onClick={() => shareOnSocial("linkedin")}
                >
                  <Linkedin className="h-8 w-8 text-blue-700" />
                  <span>LinkedIn</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 space-y-2"
                  onClick={() => shareOnSocial("email")}
                >
                  <Mail className="h-8 w-8 text-gray-600" />
                  <span>Email</span>
                </Button>
              </div>

              {includeImage && (
                <div className="rounded-md border p-4">
                  <div className="aspect-video rounded-md overflow-hidden mb-2">
                    <img
                      src={trainingImage || "/placeholder.svg"}
                      alt={trainingTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium">{trainingTitle}</h3>
                  <p className="text-sm text-muted-foreground">{trainingDate}</p>
                  <p className="text-sm mt-2">{trainingDescription.substring(0, 100)}...</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="link" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="training-url">Lien de la formation</Label>
                <div className="flex space-x-2">
                  <Input
                    id="training-url"
                    value={trainingUrl}
                    readOnly
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <Button variant="outline" size="icon" onClick={copyLink}>
                    {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Aperçu du lien</h3>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                    <img
                      src={trainingImage || "/placeholder.svg"}
                      alt={trainingTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{trainingTitle}</h4>
                    <p className="text-sm text-muted-foreground">{trainingDate}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{trainingUrl}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Code QR</Label>
                <div className="flex justify-center p-4 border rounded-md">
                  <div className="w-40 h-40 bg-gray-200 flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-gray-500" />
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger le QR code
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="embed" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="embed-code">Code d'intégration</Label>
                <div className="flex space-x-2">
                  <Textarea
                    id="embed-code"
                    value={embedCode}
                    readOnly
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="icon" onClick={copyEmbedCode} className="h-auto">
                    {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Copiez ce code et collez-le dans votre site web pour intégrer cette formation.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Aperçu de l'intégration</Label>
                <div className="rounded-md border p-4">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="font-medium">{trainingTitle}</h3>
                      <p className="text-sm text-muted-foreground">{trainingDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={() => router.push(`/dashboard/trainings/${trainingId}`)}>
            Terminé
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

