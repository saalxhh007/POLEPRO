"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CheckCircle2, Clock, FileText, GitPullRequest, MessageSquare, Plus, Users } from "lucide-react"
import { AddTaskForm } from "./add-task-form"

export function ProjectTracker() {
  const [selectedProject, setSelectedProject] = useState("1")

  const projects = [
    {
      id: "1",
      name: "EcoTech Solutions",
      progress: 75,
      status: "En cours",
      startDate: "15 Jan 2025",
      endDate: "15 Jul 2025",
      team: ["Alex Green", "Jamie Lee"],
      milestones: [
        { id: "m1", title: "Validation de l'idée", status: "completed", date: "15 Fév 2025" },
        { id: "m2", title: "Prototype MVP", status: "completed", date: "15 Mar 2025" },
        { id: "m3", title: "Tests utilisateurs", status: "in-progress", date: "15 Mai 2025" },
        { id: "m4", title: "Lancement bêta", status: "planned", date: "15 Jun 2025" },
        { id: "m5", title: "Lancement officiel", status: "planned", date: "15 Jul 2025" },
      ],
      tasks: [
        { id: "t1", title: "Finaliser l'interface utilisateur", status: "completed", assignee: "Jamie Lee" },
        { id: "t2", title: "Intégrer l'API de paiement", status: "in-progress", assignee: "Alex Green" },
        { id: "t3", title: "Optimiser les performances", status: "in-progress", assignee: "Jamie Lee" },
        { id: "t4", title: "Préparer la documentation", status: "planned", assignee: "Alex Green" },
      ],
      kpis: [
        { id: "k1", name: "Utilisateurs actifs", value: "120", target: "500", progress: 24 },
        { id: "k2", name: "Taux de conversion", value: "3.5%", target: "5%", progress: 70 },
        { id: "k3", name: "Temps moyen d'utilisation", value: "8 min", target: "12 min", progress: 67 },
      ],
    },
    {
      id: "2",
      name: "MediConnect",
      progress: 60,
      status: "En cours",
      startDate: "3 Nov 2024",
      endDate: "3 Mai 2025",
      team: ["Sarah Johnson", "Michael Chen"],
      milestones: [
        { id: "m1", title: "Validation de l'idée", status: "completed", date: "3 Déc 2024" },
        { id: "m2", title: "Prototype MVP", status: "completed", date: "3 Fév 2025" },
        { id: "m3", title: "Tests utilisateurs", status: "in-progress", date: "3 Avr 2025" },
        { id: "m4", title: "Lancement officiel", status: "planned", date: "3 Mai 2025" },
      ],
      tasks: [
        { id: "t1", title: "Développer le backend", status: "completed", assignee: "Michael Chen" },
        { id: "t2", title: "Créer l'application mobile", status: "in-progress", assignee: "Sarah Johnson" },
        { id: "t3", title: "Tester la sécurité", status: "planned", assignee: "Michael Chen" },
      ],
      kpis: [
        { id: "k1", name: "Utilisateurs inscrits", value: "85", target: "200", progress: 42 },
        { id: "k2", name: "Temps de réponse", value: "1.2s", target: "1s", progress: 83 },
      ],
    },
  ]

  const selectedProjectData = projects.find((p) => p.id === selectedProject)

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
          <AddTaskForm />
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
                    <span>{selectedProjectData.team.join(", ")}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Prochaine étape</h3>
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedProjectData.milestones.find((m) => m.status === "in-progress")?.title ||
                        selectedProjectData.milestones.find((m) => m.status === "planned")?.title}
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
              <TabsTrigger value="kpis">KPIs</TabsTrigger>
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
                    {selectedProjectData.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="relative">
                        {index < selectedProjectData.milestones.length - 1 && (
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
                    {selectedProjectData.tasks.map((task) => (
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
                            <p className="text-sm text-muted-foreground">Assigné à: {task.assignee}</p>
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
            <TabsContent value="kpis">
              <Card>
                <CardHeader>
                  <CardTitle>Indicateurs de performance (KPIs)</CardTitle>
                  <CardDescription>Mesures clés de la performance du projet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {selectedProjectData.kpis.map((kpi) => (
                      <div key={kpi.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{kpi.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{kpi.value}</span>
                            <span className="text-sm text-muted-foreground">/ {kpi.target}</span>
                          </div>
                        </div>
                        <Progress value={kpi.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Notes et commentaires</CardTitle>
                  <CardDescription>Discussions et notes sur le projet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40">
                    <div className="flex flex-col items-center text-center">
                      <MessageSquare className="h-10 w-10 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">Aucune note pour le moment</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Ajoutez des notes et des commentaires pour suivre les discussions importantes.
                      </p>
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" /> Ajouter une note
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

