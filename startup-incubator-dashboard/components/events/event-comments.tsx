"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface Comment {
  id: string
  author: {
    name: string
    avatar?: string
  }
  content: string
  date: string
}

interface EventCommentsProps {
  eventId: string
}

export function EventComments({ eventId }: EventCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: {
        name: "Ahmed Benali",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Cet événement semble très intéressant ! J'ai hâte d'y participer et d'en apprendre davantage sur les méthodologies d'innovation.",
      date: "Il y a 2 jours",
    },
    {
      id: "2",
      author: {
        name: "Samira Hadj",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "Est-ce que les supports de présentation seront partagés après l'événement ?",
      date: "Il y a 1 jour",
    },
  ])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)

    // Simuler un délai d'envoi
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: {
        name: "Utilisateur actuel",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: newComment,
      date: "À l'instant",
    }

    setComments([...comments, comment])
    setNewComment("")
    setIsSubmitting(false)

    // Simuler une synchronisation avec le dashboard
    console.log(
      `Nouveau commentaire ajouté à l'événement ${eventId} - Cette action serait synchronisée avec le dashboard`,
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commentaires ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{comment.author.name}</p>
                    <p className="text-xs text-muted-foreground">{comment.date}</p>
                  </div>
                  <p className="mt-1">{comment.content}</p>
                </div>
              </div>
              <Separator className="mt-4" />
            </div>
          ))}

          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Ajouter un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
            <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
              {isSubmitting ? "Envoi en cours..." : "Publier un commentaire"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

