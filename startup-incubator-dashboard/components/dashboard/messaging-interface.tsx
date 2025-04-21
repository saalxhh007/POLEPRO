"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Search, Phone, Video, MoreVertical, PaperclipIcon } from "lucide-react"

// Types pour les messages et les contacts
type Message = {
  id: string
  content: string
  sender: string
  timestamp: Date
  isCurrentUser: boolean
}

type Contact = {
  id: string
  name: string
  role: string
  avatar: string
  status: "online" | "offline" | "away"
  lastMessage: string
  unread: number
}

export function MessagingInterface() {
  // État pour stocker les messages et le message en cours de rédaction
  const [currentMessage, setCurrentMessage] = useState("")
  const [activeContact, setActiveContact] = useState<string>("1")
  const [searchQuery, setSearchQuery] = useState("")

  // Données fictives pour les contacts
  const contacts: Contact[] = [
    {
      id: "1",
      name: "Ahmed Benali",
      role: "Mentor",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastMessage: "Bonjour, comment avance votre projet?",
      unread: 2,
    },
    {
      id: "2",
      name: "Samira Hadj",
      role: "Expert",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastMessage: "J'ai examiné votre business plan",
      unread: 0,
    },
    {
      id: "3",
      name: "Karim Mezouar",
      role: "Fondateur",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "away",
      lastMessage: "Merci pour vos conseils",
      unread: 0,
    },
    {
      id: "4",
      name: "Leila Brahimi",
      role: "Admin",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastMessage: "La prochaine réunion est confirmée",
      unread: 1,
    },
    {
      id: "5",
      name: "Omar Taleb",
      role: "Observateur",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastMessage: "Félicitations pour votre progression",
      unread: 0,
    },
  ]

  // Filtrer les contacts en fonction de la recherche
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Données fictives pour les conversations
  const conversations: Record<string, Message[]> = {
    "1": [
      {
        id: "m1",
        content: "Bonjour, comment avance votre projet?",
        sender: "Ahmed Benali",
        timestamp: new Date(2023, 5, 10, 9, 30),
        isCurrentUser: false,
      },
      {
        id: "m2",
        content: "Bonjour Ahmed! Nous avons finalisé le prototype et nous sommes prêts pour les tests utilisateurs.",
        sender: "Vous",
        timestamp: new Date(2023, 5, 10, 9, 45),
        isCurrentUser: true,
      },
      {
        id: "m3",
        content: "Excellent! Avez-vous préparé un protocole de test?",
        sender: "Ahmed Benali",
        timestamp: new Date(2023, 5, 10, 10, 0),
        isCurrentUser: false,
      },
      {
        id: "m4",
        content: "Oui, nous avons défini les scénarios et les métriques à mesurer.",
        sender: "Vous",
        timestamp: new Date(2023, 5, 10, 10, 15),
        isCurrentUser: true,
      },
    ],
    "2": [
      {
        id: "m5",
        content: "J'ai examiné votre business plan",
        sender: "Samira Hadj",
        timestamp: new Date(2023, 5, 9, 14, 0),
        isCurrentUser: false,
      },
      {
        id: "m6",
        content: "Merci Samira! Avez-vous des suggestions d'amélioration?",
        sender: "Vous",
        timestamp: new Date(2023, 5, 9, 14, 30),
        isCurrentUser: true,
      },
    ],
    "3": [
      {
        id: "m7",
        content: "Merci pour vos conseils",
        sender: "Karim Mezouar",
        timestamp: new Date(2023, 5, 8, 11, 0),
        isCurrentUser: false,
      },
    ],
    "4": [
      {
        id: "m8",
        content: "La prochaine réunion est confirmée pour mardi à 14h",
        sender: "Leila Brahimi",
        timestamp: new Date(2023, 5, 7, 16, 0),
        isCurrentUser: false,
      },
    ],
    "5": [
      {
        id: "m9",
        content: "Félicitations pour votre progression",
        sender: "Omar Taleb",
        timestamp: new Date(2023, 5, 6, 10, 0),
        isCurrentUser: false,
      },
    ],
  }

  // Fonction pour envoyer un message
  const sendMessage = () => {
    if (currentMessage.trim() === "") return

    // Dans une application réelle, vous enverriez le message à une API
    // Ici, nous simulons simplement l'ajout du message à la conversation
    console.log(`Message envoyé à ${contacts.find((c) => c.id === activeContact)?.name}: ${currentMessage}`)

    // Réinitialiser le champ de message
    setCurrentMessage("")
  }

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-gray-400"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <Card className="w-full h-[calc(100vh-12rem)]">
      <div className="grid h-full md:grid-cols-[280px_1fr]">
        {/* Liste des contacts */}
        <div className="border-r">
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-lg font-medium">Conversations</CardTitle>
            <CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardDescription>
          </CardHeader>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="p-2">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center gap-3 rounded-lg p-2 cursor-pointer transition-colors ${
                    activeContact === contact.id ? "bg-primary-50 text-primary-600" : "hover:bg-muted"
                  }`}
                  onClick={() => setActiveContact(contact.id)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(
                        contact.status,
                      )}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{contact.name}</span>
                      {contact.unread > 0 && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">{contact.role}</span>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{contact.lastMessage}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Zone de conversation */}
        <div className="flex flex-col">
          {/* En-tête de la conversation */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={contacts.find((c) => c.id === activeContact)?.avatar}
                  alt={contacts.find((c) => c.id === activeContact)?.name}
                />
                <AvatarFallback>{contacts.find((c) => c.id === activeContact)?.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{contacts.find((c) => c.id === activeContact)?.name}</div>
                <div className="flex items-center gap-1">
                  <span
                    className={`h-2 w-2 rounded-full ${getStatusColor(
                      contacts.find((c) => c.id === activeContact)?.status || "offline",
                    )}`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {contacts.find((c) => c.id === activeContact)?.status === "online"
                      ? "En ligne"
                      : contacts.find((c) => c.id === activeContact)?.status === "away"
                        ? "Absent"
                        : "Hors ligne"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
                <span className="sr-only">Appel</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
                <span className="sr-only">Vidéo</span>
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Plus</span>
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {conversations[activeContact]?.map((message) => (
                <div key={message.id} className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className="mt-1 text-xs text-right opacity-70">{formatDate(message.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Zone de saisie */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <PaperclipIcon className="h-4 w-4" />
                <span className="sr-only">Joindre un fichier</span>
              </Button>
              <Input
                placeholder="Écrivez votre message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage()
                  }
                }}
                className="flex-1"
              />
              <Button size="icon" onClick={sendMessage}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Envoyer</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

