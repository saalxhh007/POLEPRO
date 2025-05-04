"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Moon, Sun, Shield, Eye, Smartphone, Mail, Palette, Save, RotateCcw, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { logout } from "@/store/slices/authSlice"

interface UserSettings {
  id: number
  email_notifications: boolean
  push_notifications: boolean
  marketing_emails: boolean
  new_event_notifications: boolean
  language: string
  theme: "light" | "dark" | "system"
  timezone: string
  privacy_profile: "public" | "private" | "contacts"
  two_factor_auth: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    id: 0,
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    new_event_notifications: true,
    language: "fr",
    theme: "system",
    timezone: "Africa/Algiers",
    privacy_profile: "public",
    two_factor_auth: false,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings()
    }
  }, [isAuthenticated])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      // In a real application, you would fetch the user's settings from the API
      // For now, we'll use the default settings defined above
      // const response = await api.get(`${apiUrl}/api/user/settings`)
      // setSettings(response.data)

      // Simulate API call
      setTimeout(() => {
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Impossible de récupérer vos paramètres")
      setLoading(false)
    }
  }

  const handleSwitchChange = (name: keyof UserSettings, checked: boolean) => {
    setSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: keyof UserSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // In a real application, you would save the settings to the API
      // await api.put(`${apiUrl}/api/user/settings`, settings)

      // Simulate API call
      setTimeout(() => {
        toast.success("Paramètres enregistrés avec succès")
        setSaving(false)
      }, 800)
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Erreur lors de l'enregistrement des paramètres")
      setSaving(false)
    }
  }

  const handleResetSettings = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?")) {
      setSettings({
        id: 0,
        email_notifications: true,
        push_notifications: true,
        marketing_emails: false,
        new_event_notifications: true,
        language: "fr",
        theme: "system",
        timezone: "Africa/Algiers",
        privacy_profile: "public",
        two_factor_auth: false,
      })
      toast.success("Paramètres réinitialisés")
    }
  }

  const handleDeleteAccount = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      if (window.confirm("Toutes vos données seront supprimées définitivement. Confirmer la suppression ?")) {
        // In a real application, you would call the API to delete the account
        // api.delete(`${apiUrl}/api/user/account`)
        toast.success("Compte supprimé avec succès")
        dispatch(logout())
      }
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    toast.success("Déconnexion réussie")
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 container py-12">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des paramètres...</p>
            </div>
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
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">Gérez vos préférences et paramètres de compte</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetSettings} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </Button>
            <Button onClick={handleSaveSettings} disabled={saving} className="flex items-center gap-2">
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              Enregistrer
            </Button>
          </div>
        </div>

        <Tabs defaultValue="notifications">
          <TabsList className="mb-6">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            <TabsTrigger value="account">Compte</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Préférences de notification</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Notifications par email</p>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des notifications par email pour les activités importantes
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.email_notifications}
                      onCheckedChange={(checked) => handleSwitchChange("email_notifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Notifications push</p>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des notifications push sur votre appareil
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.push_notifications}
                      onCheckedChange={(checked) => handleSwitchChange("push_notifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Nouveaux événements</p>
                        <p className="text-sm text-muted-foreground">
                          Être notifié lorsque de nouveaux événements sont publiés
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.new_event_notifications}
                      onCheckedChange={(checked) => handleSwitchChange("new_event_notifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Emails marketing</p>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des emails concernant les nouveautés et offres
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.marketing_emails}
                      onCheckedChange={(checked) => handleSwitchChange("marketing_emails", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Fréquence des notifications</h3>
                <RadioGroup defaultValue="realtime">
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="realtime" id="realtime" />
                    <Label htmlFor="realtime">Temps réel</Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Résumé quotidien</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Résumé hebdomadaire</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Thème</h3>
                <RadioGroup
                  value={settings.theme}
                  onValueChange={(value) => handleSelectChange("theme", value as "light" | "dark" | "system")}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                    <div className="w-full h-24 bg-white border rounded-md flex items-center justify-center">
                      <Sun className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light">Clair</Label>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                    <div className="w-full h-24 bg-gray-900 border rounded-md flex items-center justify-center">
                      <Moon className="h-8 w-8 text-blue-400" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark">Sombre</Label>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                    <div className="w-full h-24 bg-gradient-to-r from-white to-gray-900 border rounded-md flex items-center justify-center">
                      <div className="flex">
                        <Sun className="h-8 w-8 text-yellow-500" />
                        <Moon className="h-8 w-8 text-blue-400 -ml-2" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system">Système</Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Langue et région</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Langue</Label>
                      <Select
                        value={settings.language}
                        onValueChange={(value) => handleSelectChange("language", value)}
                      >
                        <SelectTrigger id="language" className="w-full">
                          <SelectValue placeholder="Sélectionner une langue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ar">العربية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuseau horaire</Label>
                      <Select
                        value={settings.timezone}
                        onValueChange={(value) => handleSelectChange("timezone", value)}
                      >
                        <SelectTrigger id="timezone" className="w-full">
                          <SelectValue placeholder="Sélectionner un fuseau horaire" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Africa/Algiers">Alger (GMT+1)</SelectItem>
                          <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                          <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                          <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Personnalisation</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Palette className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Couleur d'accentuation</p>
                        <p className="text-sm text-muted-foreground">Choisir la couleur principale de l'interface</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary cursor-pointer border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-blue-500 cursor-pointer"></div>
                      <div className="w-6 h-6 rounded-full bg-green-500 cursor-pointer"></div>
                      <div className="w-6 h-6 rounded-full bg-purple-500 cursor-pointer"></div>
                      <div className="w-6 h-6 rounded-full bg-orange-500 cursor-pointer"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Confidentialité du profil</h3>
                <RadioGroup
                  value={settings.privacy_profile}
                  onValueChange={(value) =>
                    handleSelectChange("privacy_profile", value as "public" | "private" | "contacts")
                  }
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="public" id="public" className="mt-1" />
                    <div>
                      <Label htmlFor="public" className="font-medium">
                        Public
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Votre profil est visible par tous les utilisateurs de la plateforme.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="contacts" id="contacts" className="mt-1" />
                    <div>
                      <Label htmlFor="contacts" className="font-medium">
                        Contacts uniquement
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Votre profil est visible uniquement par vos contacts et les membres de votre réseau.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="private" id="private" className="mt-1" />
                    <div>
                      <Label htmlFor="private" className="font-medium">
                        Privé
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Votre profil est visible uniquement par vous et les administrateurs.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Sécurité</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Authentification à deux facteurs</p>
                        <p className="text-sm text-muted-foreground">
                          Ajouter une couche de sécurité supplémentaire à votre compte
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.two_factor_auth}
                      onCheckedChange={(checked) => handleSwitchChange("two_factor_auth", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Historique de connexion</p>
                        <p className="text-sm text-muted-foreground">
                          Suivre l'historique des connexions à votre compte
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Voir l'historique
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Données personnelles</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Télécharger mes données</p>
                      <p className="text-sm text-muted-foreground">
                        Obtenir une copie de toutes vos données personnelles
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Télécharger
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Supprimer les données de navigation</p>
                      <p className="text-sm text-muted-foreground">
                        Effacer votre historique de navigation sur la plateforme
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Effacer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Informations du compte</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">utilisateur@example.com</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date d'inscription</p>
                      <p className="font-medium">15 janvier 2023</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dernière connexion</p>
                      <p className="font-medium">Aujourd'hui à 14:30</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type de compte</p>
                      <p className="font-medium">Étudiant</p>
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
                    <div>
                      <p className="font-medium">Appareil actuel</p>
                      <p className="text-sm text-muted-foreground">Chrome sur Windows • IP: 192.168.1.1</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Actif</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">iPhone 13</p>
                      <p className="text-sm text-muted-foreground">Safari • Dernière activité: il y a 2 jours</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Déconnecter
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    Se déconnecter de toutes les sessions
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-red-600 mb-4">Zone de danger</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Désactiver le compte</p>
                      <p className="text-sm text-muted-foreground">Votre compte sera temporairement désactivé</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Désactiver
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-600">Supprimer le compte</p>
                      <p className="text-sm text-muted-foreground">
                        Cette action est irréversible et supprimera toutes vos données
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
