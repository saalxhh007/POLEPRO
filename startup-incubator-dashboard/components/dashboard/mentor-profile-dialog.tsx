"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Mail, Phone, Briefcase, Users, Clock } from "lucide-react"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export function MentorProfileDialog({ isOpen, onClose, mentor }: { isOpen: any; onClose: any; mentor: any }) {
  if (!mentor) return null
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [startups, setStartups] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])

  const fetchStartups = () => {
    axios.get(`${apiUrl}/api/mentor/startups/${mentor.id}`)
      .then(response => {
        if (response.data.success) {
          setStartups(response.data.data)
        }
      })
      .catch(err => {
        if (!err.response.data.success) {
          toast.error("There Is No Startup")
          console.log(err);
        }
        else {
          toast.error("error fetching Startups")
          console.log(err);
        }
      })
  }

  const fetchSessions = () => {
    axios.get(`${apiUrl}/api/mentor/sessions/${mentor.id}`)
      .then(response => {
        if (response.data.success) {
          setSessions(response.data.data)
        }
      })
      .catch(err => {
        if (!err.response.data.success) {
          toast.error("There Is No Session")
          console.log(err);
        }
        else {
          toast.error("Error Fetching Sessions")
          console.log(err);
        }
      })
  }
  useEffect(() => {
    fetchStartups()
    fetchSessions()
  }, [mentor.id])
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mentor Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-24 h-24">
              <AvatarImage src={mentor.image || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">{mentor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{mentor.name}</h2>
                <Badge
                  variant={mentor.availability === "available" ? "outline" : "secondary"}
                  className={
                    mentor.availability === "available"
                      ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                      : ""
                  }
                >
                  {mentor.availability === "available" ? "Available" : "Busy"}
                </Badge>
              </div>
              <div className="text-lg text-muted-foreground">{mentor.expertise}</div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{mentor.company}</span>
              </div>
              {mentor.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{mentor.email}</span>
                </div>
              )}
              {mentor.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{mentor.phone}</span>
                </div>
              )}
            </div>
          </div>

          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="startups">Startups</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-4 pt-4">
              {mentor.bio ? (
                <div className="space-y-2">
                  <h3 className="font-medium">Bio</h3>
                  <p>{mentor.bio}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No bio information available.</p>
              )}
            </TabsContent>
            <TabsContent value="startups" className="space-y-4 pt-4">
              {startups.length > 0 ? (
                <div className="grid gap-4">
                  {startups.map((startup: any) => (
                    <Card key={startup.id}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">{startup.name}</CardTitle>
                        <CardDescription>{startup.industry}</CardDescription>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{startup.teamSize} team members</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No startups assigned yet.</p>
              )}
            </TabsContent>
            <TabsContent value="sessions" className="space-y-4 pt-4">
              {sessions.length > 0 ? (
                <div className="grid gap-4">
                  {sessions.map((session: any) => (
                    <Card key={session.id}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">{session.title}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <Clock className="h-4 w-4 ml-2" />
                            <span>
                              {session.time} ({session.duration} min)
                            </span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>With {session.team_id}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No sessions scheduled yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
