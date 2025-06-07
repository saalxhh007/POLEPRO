"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Edit,
  Shield,
  Bell,
  LogOut,
  UserPlus,
  Briefcase,
  FileText,
} from "lucide-react"
import toast from "react-hot-toast"
import api from "@/lib/axios"
import { useDispatch } from "react-redux"
import { logout } from "@/store/slices/authSlice"
import axios from "axios"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: number
  matricule: string
  password: string
  email: string
  phone_number: string
  birth_date: string
  gender: "m" | "f"
  last_name_ar: string
  first_name_ar: string
  Domain_ar: string
  option_ar: string
  diploma_ar: string
  faculty_code: string
  department_code: string
  department_name?: string
  startup_id?: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfileData()
    }
  }, [isAuthenticated])

  const fetchProfileData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/api/user/get-student-profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          token: accessToken,
        }
      })
      if (response.data.success) {
        setProfile(response.data.student)
        setFormData(response.data.student)
      } else {
        toast.error(response.data.message || "Erreur lors de la récupération du profil")
      }
    } catch (error) {
      console.error("Error fetching profile data:", error)
      toast.error("Impossible de récupérer les données du profil")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put(`${apiUrl}/api/user/profile/update`, formData)
      toast.success("Profil mis à jour avec succès")
      setEditing(false)
      fetchProfileData()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Erreur lors de la mise à jour du profil")
    }
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }
    axios.put(`${apiUrl}/api/user/password-update`, {
        matricule: profile?.matricule,
        current_password: currentPassword,
        new_password: newPassword,
    }, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
      })
      .then((response) => {
          console.log(response.data);
          
          toast.success("Mot de passe mis à jour avec succès")
          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
        })
        .catch((err) => {
          console.error("Error updating password:", err)
          toast.error("Erreur lors de la mise à jour du mot de passe")
      })
  }

  const handleLogout = () => {
    const toastId = toast.loading("Logging Out ...");
    axios.post(`${apiUrl}/api/user/logout`, {}, { withCredentials: true })
      .then(() => {
        dispatch(logout());
        toast.dismiss(toastId);
        toast.success("Logout successfully")
        router.push("/")
      })
      .catch(() => {
        toast.dismiss(toastId)
        toast.error("Logout failed, please try again.")
      });
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 container py-12">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement du profil...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile && !loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 container py-12">
          <div className="max-w-3xl mx-auto text-center">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Profil non disponible</h1>
            <p className="text-muted-foreground mb-8">
              Impossible de récupérer les informations de votre profil. Veuillez vous reconnecter.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary-600" onClick={handleLogout}>
              Se reconnecter
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <h2 className="text-2xl font-bold">{`${profile?.first_name_ar} ${profile?.last_name_ar}`}</h2>
                  <p className="text-muted-foreground mb-4">{profile?.matricule}</p>
                  <div className="flex gap-2 mb-4">
                    <Button variant="outline" className="flex items-center gap-2" onClick={() => setEditing(true)}>
                      <Edit className="h-4 w-4" />
                      Modifier
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{profile?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium">{profile?.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date de naissance</p>
                      <p className="font-medium">
                        {profile?.birth_date
                          ? new Date(profile.birth_date).toLocaleDateString("fr-FR")
                          : "Non spécifié"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Genre</p>
                      <p className="font-medium">{profile?.gender === "m" ? "Masculin" : "Féminin"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
                <div className="space-y-2">
                  <Link
                    href="/my-account/my-startup"
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <Briefcase className="h-5 w-5 text-primary" />
                    <span>Ma startup</span>
                  </Link>
                  <Link
                    href="/my-account/my-events"
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Mes événements</span>
                  </Link>
                  <Link
                    href="/documents"
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Mes documents</span>
                  </Link>
                  <Link
                    href="/network"
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <UserPlus className="h-5 w-5 text-primary" />
                    <span>Mon réseau</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="profile">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="academic">Informations académiques</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4">Informations personnelles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first_name_ar">Prénom</Label>
                            <Input
                              id="first_name_ar"
                              name="first_name_ar"
                              value={formData.first_name_ar || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last_name_ar">Nom</Label>
                            <Input
                              id="last_name_ar"
                              name="last_name_ar"
                              value={formData.last_name_ar || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone_number">Téléphone</Label>
                            <Input
                              id="phone_number"
                              name="phone_number"
                              value={formData.phone_number || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="birth_date">Date de naissance</Label>
                            <Input
                              id="birth_date"
                              name="birth_date"
                              type="date"
                              value={
                                formData.birth_date ? new Date(formData.birth_date).toISOString().split("T")[0] : ""
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gender">Genre</Label>
                            <select
                              id="gender"
                              name="gender"
                              className="w-full border rounded-md px-3 py-2"
                              value={formData.gender || "m"}
                              onChange={(e) => setFormData({ ...formData, gender: e.target.value as "m" | "f" })}
                            >
                              <option value="m">Masculin</option>
                              <option value="f">Féminin</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end mt-6 gap-2">
                          <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                            Annuler
                          </Button>
                          <Button type="submit">Enregistrer</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </form>
                ) : (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Informations personnelles</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => setEditing(true)}
                        >
                          <Edit className="h-4 w-4" />
                          Modifier
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground">Prénom</p>
                          <p className="font-medium">{profile?.first_name_ar}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Nom</p>
                          <p className="font-medium">{profile?.last_name_ar}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{profile?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Téléphone</p>
                          <p className="font-medium">{profile?.phone_number}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date de naissance</p>
                          <p className="font-medium">
                            {profile?.birth_date
                              ? new Date(profile.birth_date).toLocaleDateString("fr-FR")
                              : "Non spécifié"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Genre</p>
                          <p className="font-medium">{profile?.gender === "m" ? "Masculin" : "Féminin"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Matricule</p>
                          <p className="font-medium">{profile?.matricule}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="academic" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Informations académiques</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Faculté</p>
                        <p className="font-medium">
                          {profile?.faculty_code || profile?.faculty_code || "Non spécifié"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Département</p>
                        <p className="font-medium">
                          {profile?.department_name || profile?.department_code || "Non spécifié"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Domaine</p>
                        <p className="font-medium">{profile?.Domain_ar || "Non spécifié"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Option</p>
                        <p className="font-medium">{profile?.option_ar || "Non spécifié"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Diplôme</p>
                        <p className="font-medium">{profile?.diploma_ar || "Non spécifié"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Parcours académique</h3>
                    <div className="text-center py-8">
                      <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h4 className="text-lg font-medium mb-2">Aucune information disponible</h4>
                      <p className="text-muted-foreground">
                        Les informations détaillées sur votre parcours académique ne sont pas encore disponibles.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Changer le mot de passe</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current_password">Mot de passe actuel</Label>
                        <Input
                          id="current_password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new_password">Nouveau mot de passe</Label>
                        <Input
                          id="new_password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère
                          spécial.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm_password">Confirmer le mot de passe</Label>
                        <Input
                          id="confirm_password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Mettre à jour le mot de passe
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Paramètres de sécurité</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Notifications de connexion</p>
                            <p className="text-sm text-muted-foreground">
                              Recevoir une notification lors d'une nouvelle connexion
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            id="login_notifications"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Authentification à deux facteurs</p>
                            <p className="text-sm text-muted-foreground">
                              Ajouter une couche de sécurité supplémentaire
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            id="two_factor"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Sessions actives</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Session actuelle</p>
                            <p className="text-xs text-muted-foreground">
                              Navigateur: Chrome • Appareil: Desktop • IP: 192.168.1.1
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Actif</Badge>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full" onClick={handleLogout}>
                        Se déconnecter de toutes les sessions
                      </Button>
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
