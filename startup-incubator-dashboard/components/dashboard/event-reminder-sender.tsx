"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface Participant {
  id: string
  name: string
  email: string
  status: "pending" | "confirmed" | "declined"
  avatar?: string
}

interface EventReminderSenderProps {
  eventId: string
}

export function EventReminderSender({ eventId }: EventReminderSenderProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("email")
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [emailSubject, setEmailSubject] = useState("Rappel: Événement à venir")
  const [emailContent, setEmailContent] = useState(
    "Cher participant,\n\nNous vous rappelons que l'événement aura lieu le [DATE] à [HEURE] à [LIEU].\n\nNous avons hâte de vous y voir!\n\nCordialement,\nL'équipe de l'incubateur",
  )
  const [smsContent, setSmsContent] = useState(
    "Rappel: L'événement aura lieu le [DATE] à [HEURE] à [LIEU]. Nous avons hâte de vous y voir!",
  )

  // Dans une application réelle, vous récupéreriez les participants depuis une API
  const participants: Participant[] = [
    {
      id: "1",
      name: "Ahmed Benali",
      email: "ahmed.benali@example.com",
      status: "confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Samira Hadj",
      email: "samira.hadj@example.com",
      status: "confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Karim Meziane",
      email: "karim.meziane@example.com",
      status: "pending",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      name: "Leila Bouaziz",
      email: "leila.bouaziz@example.com",
      status: "confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "7",
      name: "Youcef Kaddour",
      email: "youcef.kaddour@example.com",
      status: "confirmed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const confirmedParticipants = participants.filter((p) => p.status === "confirmed")

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedParticipants(confirmedParticipants.map((p) => p.id))
    } else {
      setSelectedParticipants([])
    }
  }

  const handleSelectParticipant = (participantId: string, checked: boolean) => {
    if (checked) {
      setSelectedParticipants((prev) => [...prev, participantId])
    } else {
      setSelectedParticipants((prev) => prev.filter((id) => id !== participantId))
    }
  }

  const handleSendReminders = () => {
    // Dans une application réelle, vous enverriez les rappels via une API
    const method = activeTab === "email" ? "email" : "SMS"
    alert(`Rappels envoyés par ${method} à ${selectedParticipants.length} participants`)
    router.push("/dashboard/events")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Envoyer des rappels</CardTitle>
        <CardDescription>Envoyez des rappels aux participants de l'événement</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4 mt-4">
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
          </TabsContent>

          <TabsContent value="sms" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="sms-content">Contenu du SMS</Label>
              <Textarea
                id="sms-content"
                value={smsContent}
                onChange={(e) => setSmsContent(e.target.value)}
                className="min-h-[200px]"
              />
              <p className="text-xs text-muted-foreground mt-1">Caractères: {smsContent.length}/160</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Sélectionner les destinataires</h3>
            <div className="flex items-center space-x-2">
              <Checkbox id="select-all" checked={selectAll} onCheckedChange={handleSelectAll} />
              <Label htmlFor="select-all">Sélectionner tous</Label>
            </div>
          </div>

          <div className="border rounded-md">
            <div className="p-4 grid gap-4">
              {confirmedParticipants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`participant-${participant.id}`}
                      checked={selectedParticipants.includes(participant.id)}
                      onCheckedChange={(checked) => handleSelectParticipant(participant.id, checked as boolean)}
                    />
                    <Avatar>
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                      <AvatarFallback>{participant.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-sm text-muted-foreground">{participant.email}</p>
                    </div>
                  </div>
                  <Badge>Confirmé</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/events")}>
              Annuler
            </Button>
            <Button onClick={handleSendReminders} disabled={selectedParticipants.length === 0}>
              Envoyer {selectedParticipants.length > 0 && `(${selectedParticipants.length})`}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

