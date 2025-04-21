"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Download, Upload, Copy, CheckCircle, ImageIcon, Edit, Share2, Printer, FileText, QrCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

interface TrainingPosterProps {
  trainingId: string
  trainingTitle: string
  trainingDate: string
  trainingLocation: string
  trainingInstructor: string
}

export function TrainingPoster({
  trainingId,
  trainingTitle,
  trainingDate,
  trainingLocation,
  trainingInstructor,
}: TrainingPosterProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("preview")
  const [posterTemplate, setPosterTemplate] = useState("template1")
  const [posterTitle, setPosterTitle] = useState(trainingTitle)
  const [posterSubtitle, setPosterSubtitle] = useState("Une formation essentielle pour les entrepreneurs")
  const [posterDescription, setPosterDescription] = useState(
    "Apprenez à construire et analyser votre modèle d'affaires avec cette formation complète sur le Business Model Canvas.",
  )
  const [showQrCode, setShowQrCode] = useState(true)
  const [showLogo, setShowLogo] = useState(true)
  const [primaryColor, setPrimaryColor] = useState("#3b82f6")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  // URL fictive de l'affiche générée
  const posterUrl = "/placeholder.svg?height=600&width=400"

  // Fonction pour générer l'affiche
  const generatePoster = async () => {
    setIsGenerating(true)

    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Affiche générée",
        description: "L'affiche a été générée avec succès.",
      })

      setActiveTab("preview")
    } catch (error) {
      console.error("Erreur lors de la génération de l'affiche:", error)

      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération de l'affiche.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Fonction pour télécharger l'affiche
  const downloadPoster = (format: "png" | "jpg" | "pdf") => {
    // Dans une application réelle, vous généreriez le fichier ici
    toast({
      title: "Téléchargement réussi",
      description: `L'affiche a été téléchargée au format ${format.toUpperCase()}.`,
    })
  }

  // Fonction pour copier le lien de l'affiche
  const copyPosterLink = () => {
    navigator.clipboard.writeText(`https://example.com/posters/${trainingId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Fonction pour partager l'affiche
  const sharePoster = () => {
    router.push(`/dashboard/trainings/${trainingId}/share`)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview">
            <ImageIcon className="mr-2 h-4 w-4" />
            Aperçu
          </TabsTrigger>
          <TabsTrigger value="customize">
            <Edit className="mr-2 h-4 w-4" />
            Personnaliser
          </TabsTrigger>
          <TabsTrigger value="download">
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aperçu de l'affiche</CardTitle>
              <CardDescription>Voici à quoi ressemblera votre affiche</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="border rounded-md overflow-hidden">
                <img
                  src={posterUrl || "/placeholder.svg"}
                  alt="Aperçu de l'affiche"
                  className="max-h-[600px] object-contain"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("customize")}>
                <Edit className="mr-2 h-4 w-4" />
                Personnaliser
              </Button>
              <Button onClick={() => setActiveTab("download")}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="customize" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personnaliser l'affiche</CardTitle>
              <CardDescription>Modifiez le contenu et l'apparence de votre affiche</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="poster-template">Modèle d'affiche</Label>
                <Select value={posterTemplate} onValueChange={setPosterTemplate}>
                  <SelectTrigger id="poster-template">
                    <SelectValue placeholder="Sélectionner un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="template1">Modèle Classique</SelectItem>
                    <SelectItem value="template2">Modèle Moderne</SelectItem>
                    <SelectItem value="template3">Modèle Minimaliste</SelectItem>
                    <SelectItem value="template4">Modèle Coloré</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="poster-title">Titre</Label>
                <Input id="poster-title" value={posterTitle} onChange={(e) => setPosterTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="poster-subtitle">Sous-titre</Label>
                <Input
                  id="poster-subtitle"
                  value={posterSubtitle}
                  onChange={(e) => setPosterSubtitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="poster-description">Description</Label>
                <Textarea
                  id="poster-description"
                  value={posterDescription}
                  onChange={(e) => setPosterDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="primary-color">Couleur principale</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-qr-code">Afficher un QR code</Label>
                <Switch id="show-qr-code" checked={showQrCode} onCheckedChange={setShowQrCode} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-logo">Afficher le logo</Label>
                <Switch id="show-logo" checked={showLogo} onCheckedChange={setShowLogo} />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Image de fond</Label>
                <div className="border rounded-md p-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                      <Upload className="h-6 w-6 text-gray-500" />
                    </div>
                    <Button variant="secondary" size="sm">
                      Choisir une image
                    </Button>
                    <p className="mt-2 text-xs text-muted-foreground">PNG, JPG ou GIF jusqu'à 5MB</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("preview")}>
                Annuler
              </Button>
              <Button onClick={generatePoster} disabled={isGenerating}>
                {isGenerating ? "Génération en cours..." : "Générer l'affiche"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="download" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Télécharger l'affiche</CardTitle>
              <CardDescription>Téléchargez l'affiche dans différents formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-md overflow-hidden">
                <img
                  src={posterUrl || "/placeholder.svg"}
                  alt="Aperçu de l'affiche"
                  className="max-h-[400px] object-contain mx-auto"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 space-y-2"
                  onClick={() => downloadPoster("png")}
                >
                  <FileText className="h-8 w-8 text-blue-600" />
                  <span>PNG</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 space-y-2"
                  onClick={() => downloadPoster("jpg")}
                >
                  <FileText className="h-8 w-8 text-green-600" />
                  <span>JPG</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 space-y-2"
                  onClick={() => downloadPoster("pdf")}
                >
                  <FileText className="h-8 w-8 text-red-600" />
                  <span>PDF</span>
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="poster-link">Lien de l'affiche</Label>
                <div className="flex space-x-2">
                  <Input
                    id="poster-link"
                    value={`https://example.com/posters/${trainingId}`}
                    readOnly
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <Button variant="outline" size="icon" onClick={copyPosterLink}>
                    {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Partagez ce lien pour permettre à d'autres personnes de voir l'affiche
                </p>
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("preview")}>
                Retour à l'aperçu
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimer
                </Button>
                <Button onClick={sharePoster}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Partager
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

