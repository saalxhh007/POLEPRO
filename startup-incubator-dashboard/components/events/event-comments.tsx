"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import axios from "axios"

interface Comment {
  id: string
  author: string
  comment: string
  date: string
}

interface EventCommentsProps {
  eventId: number | undefined
}

export function EventComments({ eventId }: EventCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const fetchComments = () => {
    if (!eventId) return
    axios
      .get(`${apiUrl}/api/event/comments/${eventId}`)
      .then((response) => {
        setComments(response.data.data)
      })
  }


  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !eventId) return

    setIsSubmitting(true)
    const commentData = {
      event_id: eventId,
      comment: newComment,
    }
    console.log(commentData.comment, commentData.event_id);
    
    axios
      .post(`${apiUrl}/api/event/comment`, commentData)
      .then((res) => {
        setNewComment("")
        fetchComments()
      })
      .catch((err) => {
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  useEffect(() => {
    fetchComments()
  }, [eventId])
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
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Annonymous</p>
                    <p className="text-xs text-muted-foreground">{comment.date}</p>
                  </div>
                  <p className="mt-1">{comment.comment}</p>
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

