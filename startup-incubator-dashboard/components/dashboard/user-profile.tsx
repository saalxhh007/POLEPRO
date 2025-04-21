"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Building, MapPin, Shield, Lock, LogOut } from "lucide-react"

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Tabs defaultValue="personal" className="space-y-4">
      <TabsList>
        <TabsTrigger value="personal">Informations Personnelles</TabsTrigger>
        <TabsTrigger value="security">Sécurité</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/placeholder-user.jpg" alt="@admin" />
                  <AvatarFallback className="text-4xl">AD</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Changer la photo
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Informations Personnelles</h3>
                  <Button variant={isEditing ? "default" : "outline"} onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Enregistrer" : "Modifier"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <div className="flex items-center border rounded-md px-3 py-2">
                      <User className="h-4 w-4 text-muted-foreground mr-2" />
                      <Input
                        id="name"
                        defaultValue="Admin User"
                        className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center border rounded-md px-3 py-2">
                      <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                      <Input
                        id="email"
                        defaultValue="admin@incubator.com"
                        className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="flex items-center border rounded-md px-3 py-2">
                      <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                      <Input
                        id="phone"
                        defaultValue="+33 1 23 45 67 89"
                        className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <div className="flex items-center border rounded-md px-3 py-2">
                      <Building className="h-4 w-4 text-muted-foreground mr-2" />
                      <Input
                        id="role"
                        defaultValue="Administrateur"
                        className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Adresse</Label>
                    <div className="flex items-center border rounded-md px-3 py-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <Input
                        id="address"
                        defaultValue="123 Rue de l'Innovation, 75001 Paris"
                        className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      defaultValue="Administrateur de la plateforme d'incubation de startups."
                      className="min-h-[100px]"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Sécurité du compte</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 text-muted-foreground mr-2" />
                      <h4 className="font-medium">Changer le mot de passe</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mettez à jour votre mot de passe pour sécuriser votre compte
                    </p>
                  </div>
                  <Button variant="outline">Modifier</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-muted-foreground mr-2" />
                      <h4 className="font-medium">Authentification à deux facteurs</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Ajoutez une couche de sécurité supplémentaire à votre compte
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 text-muted-foreground mr-2" />
                      <h4 className="font-medium">Sessions actives</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Gérez vos sessions actives sur différents appareils</p>
                  </div>
                  <Button variant="outline">Gérer</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Préférences de notification</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Notifications par email</h4>
                    <p className="text-sm text-muted-foreground">Recevez des mises à jour par email</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Notifications de nouvelles startups</h4>
                    <p className="text-sm text-muted-foreground">
                      Soyez informé lorsqu'une nouvelle startup rejoint l'incubateur
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Rappels d'événements</h4>
                    <p className="text-sm text-muted-foreground">Recevez des rappels pour les événements à venir</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Notifications de rapports</h4>
                    <p className="text-sm text-muted-foreground">
                      Soyez informé lorsque de nouveaux rapports sont disponibles
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Notifications de messages</h4>
                    <p className="text-sm text-muted-foreground">
                      Recevez des notifications pour les nouveaux messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

