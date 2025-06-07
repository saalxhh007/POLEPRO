"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Briefcase, Users, Calendar, Edit, FileText, Lightbulb, Target, Award, BarChart, CheckCircle, AlertCircle, Clock, Plus, StickyNote, CheckSquare, User } from 'lucide-react'
import toast from "react-hot-toast"
import api from "@/lib/axios"
import axios from "axios"

interface Startup {
  id: number
  name: string
  industry: string | null
  stage: string | null
  join_date: string | null
  status: "active" | "warning" | "inactive"
  founders: string[]
  progress: number | null
  team_id: number
  idea_stage: string | null
  idea: string | null
  description: string | null
  innovation: string | null
  target_customers: string | null
  originality: string | null
  sector: string | null
  other_details: string | null
  business_model: string | null
  supervisor_name: string | null
  submission_date: string | null
  modified_date: string | null
  is_final: boolean
  in_pole: boolean
  approved_by_dean: boolean
  faculty_id: number
  advisor_id: number | null
  idea_origin: string | null
}

export default function MyStartupPage() {
  const [startup, setStartup] = useState<Startup | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Startup>>({})
  const [notes, setNotes] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [newNote, setNewNote] = useState("")
  const [newTask, setNewTask] = useState({ title: "", assigned_to: "", status: "En cours", date_limite: "" })

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const fetchStartupData = async () => {
    setLoading(true)
    
    axios.get(`${apiUrl}/api/startup/get/my-startup`, {
      withCredentials: true,
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
      .then(response => {
        const data = response.data;
        if (response.data.success) {
          const startup: Startup = {
            id: data.startup.id,
            name: data.startup.name,
            industry: data.startup.industry,
            stage: data.startup.stage,
            join_date: data.startup.join_date,
            status: data.startup.status,
            progress: data.startup.progress,
            team_id: data.startup.team_id,
            idea_stage: data.startup.idea_stage,
            idea: data.startup.idea,
            description: data.startup.description,
            innovation: data.startup.innovation,
            target_customers: data.startup.target_customers,
            sector: data.startup.sector,
            originality: data.startup.originality,
            other_details: data.startup.other_details,
            business_model: data.startup.business_model,
            supervisor_name: data.startup.supervisor_name,
            submission_date: data.startup.submission_date,
            modified_date: data.startup.modified_date,
            is_final: data.startup.is_final,
            in_pole: data.startup.in_pole,
            approved_by_dean: data.startup.approved_by_dean,
            faculty_id: data.startup.faculty_id,
            advisor_id: data.startup.advisor_id,
            idea_origin: data.startup.idea_origin,
            founders: data.startup.founders
          };

          setStartup(startup);
        }
        else {
          toast.error("No startup associated with this student.")
        }
       })
      .catch(err => {
        if (!err.response.data.success) {
          console.log(err);
          
          toast.error("No startup associated with this student.")
        }
        
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const fetchNotes = () => {
    axios.get(`${apiUrl}/api/notes/${startup?.id}`, {
        withCredentials: true,
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })
        .then((response) => {
          if (response.data.success) {
            setNotes(response.data.data)
          }
        }).catch((error) => {
          console.error("Error fetching notes:", error)
    })
  }

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/tasks/Student/${startup?.id}`, {
        withCredentials: true,
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })
      if (response.data.success) {
        setTasks(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }

  const addNote = async () => {
    if (!newNote.trim()) return
    try {
      const response = await axios.post(`${apiUrl}/api/notes`, {
        startup_id: startup?.id,
        content: newNote
      }, {
        withCredentials: true,
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })
      if (response.data.success) {
        setNewNote("")
        fetchNotes()
        toast.success("Note ajoutée avec succès")
      }
    } catch (error) {
      console.error("Error adding note:", error)
      toast.error("Erreur lors de l'ajout de la note")
    }
  }

  const addTask = async () => {
    if (!newTask.title.trim()) return
    try {
      const response = await axios.post(`${apiUrl}/api/tasks`, {
        startup_id: startup?.id,
        ...newTask
      }, {
        withCredentials: true,
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })
      if (response.data.success) {
        setNewTask({ title: "", assigned_to: "", status: "En cours", date_limite: "" })
        fetchTasks()
        toast.success("Tâche ajoutée avec succès")
      }
    } catch (error) {
      console.error("Error adding task:", error)
      toast.error("Erreur lors de l'ajout de la tâche")
    }
  }

  const updateTaskStatus = async (taskId: number, status: string) => {
    try {
      const response = await axios.put(`${apiUrl}/api/tasks/${taskId}`, {
        status
      }, {
        withCredentials: true,
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })
      if (response.data.success) {
        fetchTasks()
        toast.success("Statut de la tâche mis à jour")
      }
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Erreur lors de la mise à jour de la tâche")
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchStartupData()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated && startup) {
      fetchNotes()
      fetchTasks()
    }
  }, [isAuthenticated, startup])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put(`${apiUrl}/api/startup/update`, formData)
      toast.success("Startup mise à jour avec succès")
      setEditing(false)
      fetchStartupData()
    } catch (error) {
      console.error("Error updating startup:", error)
      toast.error("Erreur lors de la mise à jour de la startup")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif"
      case "warning":
        return "En attente"
      case "inactive":
        return "Inactif"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 container py-12">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des données...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!startup && !loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 container py-12">
          <div className="max-w-3xl mx-auto text-center">
            <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Vous n'avez pas encore de startup</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Ma Startup</h1>
            <p className="text-muted-foreground">Gérez les informations de votre projet entrepreneurial</p>
          </div>
          {!editing ? (
            <Button onClick={() => setEditing(true)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditing(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>Enregistrer</Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">{startup?.name}</h2>
                  <Badge className={getStatusColor(startup?.status || "inactive")}>
                    {getStatusText(startup?.status || "inactive")}
                  </Badge>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Progression</p>
                    <div className="flex items-center gap-2">
                      <Progress value={startup?.progress || 0} className="h-2" />
                      <span className="text-sm font-medium">{startup?.progress || 0}%</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Secteur</p>
                    <p className="font-medium">{startup?.sector || "Non spécifié"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Date d'adhésion</p>
                    <p className="font-medium">
                      {startup?.join_date
                        ? new Date(startup.join_date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Non spécifié"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Étape</p>
                    <p className="font-medium">{startup?.stage || "Non spécifié"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Superviseur</p>
                    <p className="font-medium">{startup?.supervisor_name || "Non assigné"}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Projet finalisé</p>
                    <div className={`w-3 h-3 rounded-full ${startup?.is_final ? "bg-green-500" : "bg-gray-300"}`}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Dans le pôle</p>
                    <div className={`w-3 h-3 rounded-full ${startup?.in_pole ? "bg-green-500" : "bg-gray-300"}`}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Approuvé par le doyen</p>
                    <div
                      className={`w-3 h-3 rounded-full ${startup?.approved_by_dean ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Fondateurs</h3>
                <div className="space-y-4">
                  {startup?.founders && startup.founders.length > 0 ? (
                    startup.founders.map((founder: any, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{founder.first_name_ar}</p>
                          <p className="text-xs text-muted-foreground">{founder.role}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">Aucun fondateur spécifié</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Dates importantes</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date de soumission</p>
                      <p className="font-medium">
                        {startup?.submission_date
                          ? new Date(startup.submission_date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Non soumis"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Dernière modification</p>
                      <p className="font-medium">
                        {startup?.modified_date
                          ? new Date(startup.modified_date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Aucune modification"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details">
              <TabsList className="mb-6">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="business">Business Model</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="tasks">Tâches</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                {editing ? (
                  <form className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4">Informations générales</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nom du projet</Label>
                            <Input id="name" name="name" value={formData.name || ""} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="industry">Industrie</Label>
                            <Input
                              id="industry"
                              name="industry"
                              value={formData.industry || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sector">Secteur</Label>
                            <Input
                              id="sector"
                              name="sector"
                              value={formData.sector || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="stage">Étape</Label>
                            <Select
                              value={formData.stage || ""}
                              onValueChange={(value) => handleSelectChange("stage", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une étape" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="idea">Idée</SelectItem>
                                <SelectItem value="prototype">Prototype</SelectItem>
                                <SelectItem value="mvp">MVP</SelectItem>
                                <SelectItem value="growth">Croissance</SelectItem>
                                <SelectItem value="scale">Scale-up</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status">Statut</Label>
                            <Select
                              value={formData.status || "inactive"}
                              onValueChange={(value) =>
                                handleSelectChange("status", value as "active" | "warning" | "inactive")
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un statut" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Actif</SelectItem>
                                <SelectItem value="warning">En attente</SelectItem>
                                <SelectItem value="inactive">Inactif</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="progress">Progression (%)</Label>
                            <Input
                              id="progress"
                              name="progress"
                              type="number"
                              min="0"
                              max="100"
                              value={formData.progress || 0}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4">Description du projet</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="description">Description générale</Label>
                            <Textarea
                              id="description"
                              name="description"
                              rows={4}
                              value={formData.description || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="idea">Idée principale</Label>
                            <Textarea
                              id="idea"
                              name="idea"
                              rows={3}
                              value={formData.idea || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="innovation">Innovation</Label>
                            <Textarea
                              id="innovation"
                              name="innovation"
                              rows={3}
                              value={formData.innovation || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="target_customers">Clients cibles</Label>
                            <Textarea
                              id="target_customers"
                              name="target_customers"
                              rows={3}
                              value={formData.target_customers || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="originality">Originalité</Label>
                            <Textarea
                              id="originality"
                              name="originality"
                              rows={3}
                              value={formData.originality || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="idea_origin">Origine de l'idée</Label>
                            <Textarea
                              id="idea_origin"
                              name="idea_origin"
                              rows={3}
                              value={formData.idea_origin || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4">Statut du projet</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="is_final" className="cursor-pointer">
                              Projet finalisé
                            </Label>
                            <Switch
                              id="is_final"
                              checked={formData.is_final || false}
                              onCheckedChange={(checked) => handleSwitchChange("is_final", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="in_pole" className="cursor-pointer">
                              Dans le pôle
                            </Label>
                            <Switch
                              id="in_pole"
                              checked={formData.in_pole || false}
                              onCheckedChange={(checked) => handleSwitchChange("in_pole", checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="approved_by_dean" className="cursor-pointer">
                              Approuvé par le doyen
                            </Label>
                            <Switch
                              id="approved_by_dean"
                              checked={formData.approved_by_dean || false}
                              onCheckedChange={(checked) => handleSwitchChange("approved_by_dean", checked)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </form>
                ) : (
                  <>
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4">Informations générales</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-muted-foreground">Nom du projet</p>
                            <p className="font-medium">{startup?.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Industrie</p>
                            <p className="font-medium">{startup?.industry || "Non spécifié"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Secteur</p>
                            <p className="font-medium">{startup?.sector || "Non spécifié"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Étape</p>
                            <p className="font-medium">{startup?.stage || "Non spécifié"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Statut</p>
                            <Badge className={getStatusColor(startup?.status || "inactive")}>
                              {getStatusText(startup?.status || "inactive")}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Progression</p>
                            <div className="flex items-center gap-2">
                              <Progress value={startup?.progress || 0} className="h-2 flex-1" />
                              <span className="text-sm font-medium">{startup?.progress || 0}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4">Description du projet</h3>
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-5 w-5 text-primary" />
                              <h4 className="font-medium">Description générale</h4>
                            </div>
                            <p className="text-muted-foreground">
                              {startup?.description || "Aucune description fournie."}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb className="h-5 w-5 text-primary" />
                              <h4 className="font-medium">Idée principale</h4>
                            </div>
                            <p className="text-muted-foreground">
                              {startup?.idea || "Aucune idée principale définie."}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="h-5 w-5 text-primary" />
                              <h4 className="font-medium">Innovation</h4>
                            </div>
                            <p className="text-muted-foreground">
                              {startup?.innovation || "Aucune innovation spécifiée."}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="h-5 w-5 text-primary" />
                              <h4 className="font-medium">Clients cibles</h4>
                            </div>
                            <p className="text-muted-foreground">
                              {startup?.target_customers || "Aucun client cible défini."}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <BarChart className="h-5 w-5 text-primary" />
                              <h4 className="font-medium">Originalité</h4>
                            </div>
                            <p className="text-muted-foreground">
                              {startup?.originality || "Aucune originalité spécifiée."}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb className="h-5 w-5 text-primary" />
                              <h4 className="font-medium">Origine de l'idée</h4>
                            </div>
                            <p className="text-muted-foreground">
                              {startup?.idea_origin || "Aucune origine spécifiée."}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4">Statut du projet</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {startup?.is_final ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Clock className="h-5 w-5 text-yellow-500" />
                              )}
                              <span>Projet finalisé</span>
                            </div>
                            <Badge
                              className={
                                startup?.is_final ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {startup?.is_final ? "Oui" : "Non"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {startup?.in_pole ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Clock className="h-5 w-5 text-yellow-500" />
                              )}
                              <span>Dans le pôle</span>
                            </div>
                            <Badge
                              className={
                                startup?.in_pole ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {startup?.in_pole ? "Oui" : "Non"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {startup?.approved_by_dean ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                              )}
                              <span>Approuvé par le doyen</span>
                            </div>
                            <Badge
                              className={
                                startup?.approved_by_dean
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {startup?.approved_by_dean ? "Oui" : "Non"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>

              <TabsContent value="business" className="space-y-6">
                {editing ? (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-4">Modèle d'affaires</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="business_model">Description du modèle d'affaires</Label>
                          <Textarea
                            id="business_model"
                            name="business_model"
                            rows={6}
                            value={formData.business_model || ""}
                            onChange={handleInputChange}
                            placeholder="Décrivez votre modèle d'affaires, vos sources de revenus, votre structure de coûts, etc."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="other_details">Autres détails</Label>
                          <Textarea
                            id="other_details"
                            name="other_details"
                            rows={4}
                            value={formData.other_details || ""}
                            onChange={handleInputChange}
                            placeholder="Informations supplémentaires sur votre modèle d'affaires"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-4">Modèle d'affaires</h3>
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart className="h-5 w-5 text-primary" />
                            <h4 className="font-medium">Description du modèle d'affaires</h4>
                          </div>
                          <p className="text-muted-foreground">
                            {startup?.business_model || "Aucun modèle d'affaires défini."}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <h4 className="font-medium">Autres détails</h4>
                          </div>
                          <p className="text-muted-foreground">
                            {startup?.other_details || "Aucun détail supplémentaire fourni."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Documents du projet</h3>
                    <div className="space-y-4">
                      <div className="p-8 border-2 border-dashed rounded-lg text-center">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="text-lg font-medium mb-2">Téléverser des documents</h4>
                        <p className="text-muted-foreground mb-4">
                          Glissez-déposez vos fichiers ici ou cliquez pour parcourir
                        </p>
                        <Button>Parcourir les fichiers</Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Formats acceptés: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX (max 10MB)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Documents téléversés</h3>
                    <div className="text-center py-8">
                      <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h4 className="text-lg font-medium mb-2">Aucun document</h4>
                      <p className="text-muted-foreground">
                        Vous n'avez pas encore téléversé de documents pour ce projet
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Ajouter une note</h3>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Écrivez votre note ici..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={3}
                      />
                      <Button onClick={addNote} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Ajouter la note
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Notes du projet</h3>
                    <div className="space-y-4">
                      {notes.length > 0 ? (
                        notes.map((note) => (
                          <div key={note.id} className="p-4 border rounded-lg">
                            <div className="flex items-start gap-3">
                              <StickyNote className="h-5 w-5 text-primary mt-1" />
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-2">
                                  {note.created_by} • {new Date(note.created_at).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </p>
                                <p>{note.content}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h4 className="text-lg font-medium mb-2">Aucune note</h4>
                          <p className="text-muted-foreground">
                            Commencez par ajouter votre première note pour ce projet
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Ajouter une tâche</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="task-title">Titre de la tâche</Label>
                        <Input
                          id="task-title"
                          placeholder="Titre de la tâche"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="task-assigned">Assigné à</Label>
                        <Input
                          id="task-assigned"
                          placeholder="Nom de la personne"
                          value={newTask.assigned_to}
                          onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="task-status">Statut</Label>
                        <Select
                          value={newTask.status}
                          onValueChange={(value) => setNewTask({ ...newTask, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="En cours">En cours</SelectItem>
                            <SelectItem value="Terminé">Terminé</SelectItem>
                            <SelectItem value="Planifié">Planifié</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="task-deadline">Date limite</Label>
                        <Input
                          id="task-deadline"
                          type="datetime-local"
                          value={newTask.date_limite}
                          onChange={(e) => setNewTask({ ...newTask, date_limite: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button onClick={addTask} className="flex items-center gap-2 mt-4">
                      <Plus className="h-4 w-4" />
                      Ajouter la tâche
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Tâches du projet</h3>
                    <div className="space-y-4">
                      {tasks.length > 0 ? (
                        tasks.map((task) => (
                          <div key={task.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="mt-1">
                                  {task.status === "Terminé" ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : task.status === "En cours" ? (
                                    <Clock className="h-5 w-5 text-blue-500" />
                                  ) : (
                                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium mb-1">{task.title}</h4>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    {task.assigned_to && (
                                      <div className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        {task.assigned_to}
                                      </div>
                                    )}
                                    {task.date_limite && (
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(task.date_limite).toLocaleDateString("fr-FR", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric"
                                        })}
                                      </div>
                                    )}
                                    <div>
                                      Créé le {new Date(task.created_at).toLocaleDateString("fr-FR")}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={
                                    task.status === "Terminé"
                                      ? "bg-green-100 text-green-800"
                                      : task.status === "En cours"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }
                                >
                                  {task.status}
                                </Badge>
                                <Select
                                  value={task.status}
                                  onValueChange={(value) => updateTaskStatus(task.id, value)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="En cours">En cours</SelectItem>
                                    <SelectItem value="Terminé">Terminé</SelectItem>
                                    <SelectItem value="Planifié">Planifié</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h4 className="text-lg font-medium mb-2">Aucune tâche</h4>
                          <p className="text-muted-foreground">
                            Commencez par ajouter votre première tâche pour ce projet
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}