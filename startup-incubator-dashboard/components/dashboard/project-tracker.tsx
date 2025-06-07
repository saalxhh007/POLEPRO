"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CheckCircle2, Clock, FileText, GitPullRequest, MessageSquare, Users } from "lucide-react"
import { AddTaskForm } from "./add-task-form"
import axios from "axios"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { AddNoteForm } from "./add-note-form"

interface Project {
  id: any
  name: string
  progress: number
  status: string
  startDate: string
  endDate: string
  teamMembers: string
}
export function ProjectTracker() {
  const [selectedProject, setSelectedProject] = useState("1")
  const [projects, setProjects] = useState<Project[]>([])
  const [milestones, setMilestones] = useState<any>([])
  const [tasks, setTasks] = useState<any>([])
  const [notes, setNotes] = useState<any>([])

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  const fetchProjects = () => {
    axios
      .get(`${apiUrl}/api/startup/get/summary`)
      .then((response) => {
        if (response.data.success) {
          setProjects(response.data.data)
        }
      })
      .catch((err) => {
        console.error("Error fetching projects:", err)
      })
  }

  const fetchMilestonnes = () => {
    axios
      .get(`${apiUrl}/api/milestone/${selectedProject}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setMilestones(response.data.data)
        }
      })
      .catch((err) => {
        console.error("Error fetching milestonnes:", err)
      })
  }

  const fetchTasks = () => {
    axios
      .get(`${apiUrl}/api/tasks/startup/${selectedProject}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setTasks(response.data.data)
        }
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err)
      })
  }

  const fetchNotes = () => {
    axios
      .get(`${apiUrl}/api/notes/${selectedProject}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setNotes(response.data.data)
        }
      })
      .catch((err) => {
        console.error("Error fetching notes:", err)
      })
  }

  const selectedProjectData = projects.find((p) => p.id === selectedProject)

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      fetchMilestonnes()
      fetchTasks()
      fetchNotes()
    }
  }, [selectedProject])
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Sélectionner un projet" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Rapport
          </Button>
          <AddTaskForm id={selectedProject} fetchTasks={fetchTasks} />
        </div>
      </div>

      {selectedProjectData && (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Progression</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{selectedProjectData.progress}%</span>
                    <Badge>{selectedProjectData.status}</Badge>
                  </div>
                  <Progress value={selectedProjectData.progress} className="h-2" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Période</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedProjectData.startDate} - {selectedProjectData.endDate}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Équipe</h3>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedProjectData.teamMembers}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Prochaine étape</h3>
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {milestones.find((m: any) => m.status === "in-progress")?.title ||
                        milestones.find((m: any) => m.status === "planned")?.title}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="milestones">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="milestones">Jalons</TabsTrigger>
              <TabsTrigger value="tasks">Tâches</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="milestones">
              <Card>
                <CardHeader>
                  <CardTitle>Jalons du projet</CardTitle>
                  <CardDescription>Progression des étapes clés du projet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {milestones.map((milestone: any, index: any) => (
                      <div key={milestone.id} className="relative">
                        {index < milestones.length - 1 && (
                          <div className="absolute top-6 left-3 h-full w-px bg-muted-foreground/20" />
                        )}
                        <div className="flex gap-4">
                          <div
                            className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full ${
                              milestone.status === "completed"
                                ? "bg-primary text-primary-foreground"
                                : milestone.status === "in-progress"
                                  ? "bg-amber-500 text-white"
                                  : "bg-muted-foreground/20 text-muted-foreground"
                            }`}
                          >
                            {milestone.status === "completed" && <CheckCircle2 className="h-4 w-4" />}
                            {milestone.status === "in-progress" && <Clock className="h-4 w-4" />}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{milestone.title}</h3>
                              <Badge
                                variant={
                                  milestone.status === "completed"
                                    ? "default"
                                    : milestone.status === "in-progress"
                                      ? "outline"
                                      : "secondary"
                                }
                              >
                                {milestone.status === "completed"
                                  ? "Terminé"
                                  : milestone.status === "in-progress"
                                    ? "En cours"
                                    : "Planifié"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{milestone.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>Tâches</CardTitle>
                  <CardDescription>Liste des tâches à accomplir</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks.map((task: any) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              task.status === "completed"
                                ? "bg-green-500"
                                : task.status === "in-progress"
                                  ? "bg-amber-500"
                                  : "bg-muted-foreground/20"
                            }`}
                          />
                          <div>
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-sm text-muted-foreground">Assigné à: {task.assigned_to}</p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            task.status === "completed"
                              ? "default"
                              : task.status === "in-progress"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {task.status === "completed"
                            ? "Terminé"
                            : task.status === "in-progress"
                              ? "En cours"
                              : "Planifié"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notes">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Notes et commentaires</CardTitle>
                    <CardDescription>Discussions et notes sur le projet</CardDescription>
                  </div>
                  <AddNoteForm startupId={selectedProject} onNoteAdded={fetchNotes} />
                </CardHeader>
                <CardContent>
                  {notes.length === 0 ? (
                    <div className="flex items-center justify-center h-40">
                      <div className="flex flex-col items-center text-center">
                        <MessageSquare className="h-10 w-10 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">Aucune note pour le moment</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Ajoutez des notes et des commentaires pour suivre les discussions importantes.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notes.map((note: any) => (
                        <div key={note.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              {note.created_by && <span className="text-sm font-medium">{note.created_by}</span>}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(note.created_at).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
