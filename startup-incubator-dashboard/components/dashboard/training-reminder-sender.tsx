"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Mail, MessageSquare, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface TrainingReminderSenderProps {
  trainingId: string
  trainingTitle: string
  trainingDate: string
  trainingLocation: string
}

export function TrainingReminderSender({
  trainingId,
  trainingTitle,
  trainingDate,
  trainingLocation,
}: TrainingReminderSenderProps) {
  const router = useRouter()
  const [reminderType, setReminderType] = useState("email")
  const [selectedTemplate, setSelectedTemplate] = useState("default")
  const [emailSubject, setEmailSubject] = useState(`Rappel: Formation "${trainingTitle}"`)
  const [emailContent, setEmailContent] = useState(
    `Bonjour {nom},\n\nNous vous rappelons que vous êtes inscrit(e) à la formation "${trainingTitle}" qui aura lieu le ${trainingDate} à ${trainingLocation}.\n\nNous vous attendons avec impatience.\n\nCordialement,\nL'équipe de l'incubateur`,
  )
  const [smsContent, setSmsContent] = useState(
    `Rappel: Votre formation "${trainingTitle}" aura lieu le ${trainingDate} à ${trainingLocation}. À bientôt!`,
  )
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const [sendingProgress, setSendingProgress] = useState(0)
  const [sendingComplete, setSendingComplete] = useState(false)

  // Données fictives pour les participants
  const participants = [
    {
      id: "1",
      name: "Sophie Martin",
      email: "sophie.martin@example.com",
      phone: "+33612345678",
      status: "confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Thomas Dubois",
      email: "thomas.dubois@example.com",
      phone: "+33623456789",
      status: "confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Emma Petit",
      email: "emma.petit@example.com",
      phone: "+33634567890",
      status: "confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      name: "Lucas Bernard",
      email: "lucas.bernard@example.com",
      phone: "+33645678901",
      status: "confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Fonction pour sélectionner/désélectionner tous les participants
  const toggleSelectAll = () => {
    if (selectedParticipants.length === participants.length) {
      setSelectedParticipants([])
    } else {
      setSelectedParticipants(participants.map((p) => p.id))
    }
  }

  // Fonction pour gérer la sélection d'un participant
  const toggleParticipantSelection = (id: string) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(selectedParticipants.filter((pid) => pid !== id))
    } else {
      setSelectedParticipants([...selectedParticipants, id])
    }
  }

  // Fonction pour envoyer les rappels
  const sendReminders = async () => {
    if (selectedParticipants.length === 0) {
      alert("Veuillez sélectionner au moins un participant")
      return
    }

    setIsSending(true)
    setSendingProgress(0)

    // Simuler l'envoi des rappels
    const totalParticipants = selectedParticipants.length

    for (let i = 0; i < totalParticipants; i++) {
      // Simuler un délai pour l'envoi
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mettre à jour la progression
      setSendingProgress(Math.round(((i + 1) / totalParticipants) * 100))
    }

    // Terminer l'envoi
    setTimeout(() => {
      setSendingComplete(true)
      setIsSending(false)
    }, 1000)
  }

  // Fonction pour réinitialiser après l'envoi
  const resetAfterSending = () => {
    setSendingComplete(false)
    setSelectedParticipants([])
  }

  // Fonction pour appliquer un modèle
  const applyTemplate = (template: string) => {
    setSelectedTemplate(template)

    if (template === "default") {
      setEmailSubject(`Rappel: Formation "${trainingTitle}"`)
      setEmailContent(
        `Bonjour {nom},\n\nNous vous rappelons que vous êtes inscrit(e) à la formation "${trainingTitle}" qui aura lieu le ${trainingDate} à ${trainingLocation}.\n\nNous vous attendons avec impatience.\n\nCordialement,\nL'équipe de l'incubateur`,
      )
      setSmsContent(
        `Rappel: Votre formation "${trainingTitle}" aura lieu le ${trainingDate} à ${trainingLocation}. À bientôt!`,
      )
    } else if (template === "urgent") {
      setEmailSubject(`URGENT: Rappel pour votre formation "${trainingTitle}" demain`)
      setEmailContent(
        `Bonjour {nom},\n\nATTENTION: Nous vous rappelons que vous êtes inscrit(e) à la formation "${trainingTitle}" qui aura lieu DEMAIN, le ${trainingDate} à ${trainingLocation}.\n\nVeuillez confirmer votre présence en répondant à cet email.\n\nCordialement,\nL'équipe de l'incubateur`,
      )
      setSmsContent(
        `URGENT: Votre formation "${trainingTitle}" a lieu DEMAIN, ${trainingDate} à ${trainingLocation}. Merci de confirmer votre présence.`,
      )
    } else if (template === "change") {
      setEmailSubject(`Changement important: Formation "${trainingTitle}"`)
      setEmailContent(
        `Bonjour {nom},\n\nNous vous informons d'un changement concernant la formation "${trainingTitle}" à laquelle vous êtes inscrit(e).\n\nNouvelle date: ${trainingDate}\nNouveau lieu: ${trainingLocation}\n\nMerci de nous confirmer que vous avez bien pris note de ce changement.\n\nCordialement,\nL'équipe de l'incubateur`,
      )
      setSmsContent(
        `CHANGEMENT: Votre formation "${trainingTitle}" est déplacée au ${trainingDate} à ${trainingLocation}. Plus d'infos par email.`,
      )
    }
  }

  return (
    <div className="space-y-4">
      {sendingComplete ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Rappels envoyés avec succès
            </CardTitle>
            <CardDescription>
              Les rappels ont été envoyés à {selectedParticipants.length} participant(s).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Récapitulatif :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Type de rappel : {reminderType === "email" ? "Email" : "SMS"}</li>
              <li>Nombre de destinataires : {selectedParticipants.length}</li>
              <li>Date d'envoi : {new Date().toLocaleString("fr-FR")}</li>
            </ul>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push(`/dashboard/trainings/${trainingId}`)}>
              Retour à la formation
            </Button>
            <Button onClick={resetAfterSending}>Envoyer d'autres rappels</Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Envoyer des rappels</CardTitle>
              <CardDescription>Envoyez des rappels aux participants de la formation "{trainingTitle}"</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="compose" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="compose">Composer un message</TabsTrigger>
                  <TabsTrigger value="recipients">Destinataires</TabsTrigger>
                </TabsList>

                <TabsContent value="compose" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Type de rappel</Label>
                      <RadioGroup
                        value={reminderType}
                        onValueChange={setReminderType}
                        className="flex flex-col space-y-1 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="email" />
                          <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" /> Email
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sms" id="sms" />
                          <Label htmlFor="sms" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" /> SMS
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label>Modèle de message</Label>
                      <Select value={selectedTemplate} onValueChange={applyTemplate}>
                        <SelectTrigger className="w-full mt-2">
                          <SelectValue placeholder="Sélectionner un modèle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Rappel standard</SelectItem>
                          <SelectItem value="urgent">Rappel urgent (veille de l'événement)</SelectItem>
                          <SelectItem value="change">Notification de changement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {reminderType === "email" ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email-subject">Sujet de l'email</Label>
                          <Input
                            id="email-subject"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email-content">Contenu de l'email</Label>
                          <Textarea
                            id="email-content"
                            value={emailContent}
                            onChange={(e) => setEmailContent(e.target.value)}
                            className="min-h-32 font-mono text-sm"
                          />
                          <p className="text-xs text-muted-foreground">
                            Utilisez {"{nom}"} pour insérer le nom du participant.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="sms-content">Contenu du SMS</Label>
                        <Textarea
                          id="sms-content"
                          value={smsContent}
                          onChange={(e) => setSmsContent(e.target.value)}
                          className="min-h-20 font-mono text-sm"
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            Utilisez {"{nom}"} pour insérer le nom du participant.
                          </p>
                          <p className="text-xs text-muted-foreground">{smsContent.length}/160 caractères</p>
                        </div>
                      </div>
                    )}

                    <div className="rounded-md border p-4 bg-muted/50">
                      <h3 className="font-medium mb-2">Aperçu du message</h3>
                      {reminderType === "email" ? (
                        <div className="space-y-2">
                          <p>
                            <strong>Sujet:</strong> {emailSubject}
                          </p>
                          <div className="p-3 bg-white rounded border whitespace-pre-wrap">
                            {emailContent.replace("{nom}", "Prénom")}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-white rounded border whitespace-pre-wrap">
                          {smsContent.replace("{nom}", "Prénom")}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="recipients" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="select-all"
                        checked={selectedParticipants.length === participants.length && participants.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                      <Label htmlFor="select-all">
                        {selectedParticipants.length === participants.length && participants.length > 0
                          ? "Désélectionner tous les participants"
                          : "Sélectionner tous les participants"}
                      </Label>
                    </div>
                    <Badge variant="outline">{selectedParticipants.length} sélectionné(s)</Badge>
                  </div>

                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className={`flex items-center justify-between p-3 rounded-md border ${
                          selectedParticipants.includes(participant.id) ? "bg-primary-50 border-primary-200" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`participant-${participant.id}`}
                            checked={selectedParticipants.includes(participant.id)}
                            onCheckedChange={() => toggleParticipantSelection(participant.id)}
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                            <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {reminderType === "email" ? participant.email : participant.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {selectedParticipants.length} destinataire(s) sélectionné(s)
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.push(`/dashboard/trainings/${trainingId}`)}>
                  Annuler
                </Button>
                <Button onClick={sendReminders} disabled={selectedParticipants.length === 0 || isSending}>
                  {isSending ? "Envoi en cours..." : "Envoyer les rappels"}
                </Button>
              </div>
            </CardFooter>
          </Card>

          {isSending && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Envoi des rappels en cours
                </CardTitle>
                <CardDescription>Veuillez patienter pendant l'envoi des rappels...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={sendingProgress} className="h-2" />
                  <p className="text-center text-sm text-muted-foreground">
                    {sendingProgress}% - Envoi à {selectedParticipants.length} participant(s)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

