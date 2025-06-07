"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

interface Participant {
  id: number
  name: string
  role: 'etudiant' | 'entrepreneur' | 'developpeur' | 'designer' | 'investisseur'
  email: string
  phone: string
  organisation: string
  expectations: string
  event_id: number
  status: string
}

interface EventReminderSenderProps {
  eventId: string
}

export function EventReminderSender({ eventId }: EventReminderSenderProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("email")
  const [selectedParticipantsidS, setSelectedParticipantsidS] = useState<number[]>([])
  const [confirmedParticipants, setConfirmedParticipants] = useState<Participant[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [emailSubject, setEmailSubject] = useState("Rappel: Événement à venir")
  const [emailContent, setEmailContent] = useState(
    "Cher participant,\n\nNous vous rappelons que l'événement aura lieu le [DATE] à [HEURE] à [LIEU].\n\nNous avons hâte de vous y voir!\n\nCordialement,\nL'équipe de l'incubateur",
  )
  const [smsContent, setSmsContent] = useState(
    "Rappel: L'événement aura lieu le [DATE] à [HEURE] à [LIEU]. Nous avons hâte de vous y voir!",
  )
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedParticipantsidS(confirmedParticipants.map(participant => participant.id));
    } else {
      setSelectedParticipantsidS([]);
    }
  };

  const handleSelectParticipant = (participantId: number, checked: boolean) => {
    setSelectedParticipantsidS((prev) => {
      if (checked) {
        return [...prev, participantId];
      } else {
        return prev.filter((id) => id !== participantId);
      }
    });
  };

  const handleSendReminders = () => {
    axios.post(`${apiUrl}/api/participants/send-reminders`, {
      participantIds: selectedParticipantsidS,
      subject: emailSubject,
      message: activeTab === 'email' ? emailContent : smsContent,
      type: activeTab,
    }, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}` 
      }
     })
      .then(response => {
      console.log(response.data);
      
      if (response.data.success) {
        toast.success("Reminders Sent To Participants Mails");
      } else {
        toast.error("Error In Sending Email's To Participants");
      }
    })
    .catch(err => {
      console.log(err);
      toast.error("Error In Sending Email's To Participants");
    });
  }
  
  const fetchParticipants = () => {
    axios.get(`${apiUrl}/api/participent/all`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(response => {
      const confirmed = response.data.participants.filter(
        (participant: Participant) => participant.status === "confirmed"
      );
      setConfirmedParticipants(confirmed);
      setSelectedParticipantsidS(confirmed.map((p: any) => p.id));
      setSelectAll(true);
    })
    .catch(err => {
      console.error("Failed to fetch participants:", err);
    });
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

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
                      checked={selectedParticipantsidS.includes(participant.id)} // Reflect the selection state
                      onCheckedChange={(checked) => handleSelectParticipant(participant.id, checked as boolean)}
                    />
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
            <Button onClick={handleSendReminders} disabled={selectedParticipantsidS.length === 0}>
              Envoyer {selectedParticipantsidS.length > 0}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
