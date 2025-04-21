"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SettingsForm() {
  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">Général</TabsTrigger>
        <TabsTrigger value="appearance">Apparence</TabsTrigger>
        <TabsTrigger value="advanced">Avancé</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres Généraux</CardTitle>
            <CardDescription>Configurez les paramètres généraux de votre plateforme d'incubation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="incubator-name">Nom de l'Incubateur</Label>
              <Input id="incubator-name" defaultValue="Startup Incubator" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">Email de Contact</Label>
              <Input id="contact-email" type="email" defaultValue="contact@incubator.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Select defaultValue="fr">
                <SelectTrigger id="language">
                  <SelectValue placeholder="Sélectionner une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau Horaire</Label>
              <Select defaultValue="europe-paris">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Sélectionner un fuseau horaire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="europe-paris">Europe/Paris (GMT+1)</SelectItem>
                  <SelectItem value="europe-london">Europe/London (GMT+0)</SelectItem>
                  <SelectItem value="america-new_york">America/New_York (GMT-5)</SelectItem>
                  <SelectItem value="asia-tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public-profile">Profil Public</Label>
                <p className="text-sm text-muted-foreground">Rendre votre profil d'incubateur visible publiquement</p>
              </div>
              <Switch id="public-profile" />
            </div>

            <Button>Enregistrer les modifications</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appearance">
        <Card>
          <CardHeader>
            <CardTitle>Apparence</CardTitle>
            <CardDescription>Personnalisez l'apparence de votre tableau de bord</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Thème</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center space-y-2">
                  <div className="border rounded-md p-2 cursor-pointer bg-white">
                    <div className="w-full h-20 bg-white border-b"></div>
                    <div className="w-full h-10 bg-gray-50"></div>
                  </div>
                  <span className="text-sm">Clair</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="border rounded-md p-2 cursor-pointer bg-gray-950">
                    <div className="w-full h-20 bg-gray-900 border-b border-gray-800"></div>
                    <div className="w-full h-10 bg-gray-800"></div>
                  </div>
                  <span className="text-sm">Sombre</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="border rounded-md p-2 cursor-pointer bg-gradient-to-b from-white to-gray-950">
                    <div className="w-full h-20 bg-gradient-to-b from-white to-gray-200 border-b"></div>
                    <div className="w-full h-10 bg-gradient-to-b from-gray-900 to-gray-800"></div>
                  </div>
                  <span className="text-sm">Système</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Couleur d'Accent</Label>
              <div className="grid grid-cols-6 gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-amber-500 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-pink-500 cursor-pointer"></div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="font-size">Taille de Police</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="font-size">
                  <SelectValue placeholder="Sélectionner une taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Petite</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="animations">Animations</Label>
                <p className="text-sm text-muted-foreground">Activer les animations de l'interface</p>
              </div>
              <Switch id="animations" defaultChecked />
            </div>

            <Button>Appliquer les changements</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="advanced">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres Avancés</CardTitle>
            <CardDescription>Configurez les paramètres avancés de votre plateforme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="api-key">Clé API</Label>
              <div className="flex space-x-2">
                <Input id="api-key" defaultValue="sk_live_51NXxXXXXXXXXXXXXXXXXXXXX" type="password" />
                <Button variant="outline">Régénérer</Button>
              </div>
              <p className="text-sm text-muted-foreground">Utilisez cette clé pour accéder à l'API de la plateforme</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL de Webhook</Label>
              <Input id="webhook-url" placeholder="https://votre-site.com/webhook" />
              <p className="text-sm text-muted-foreground">Recevez des notifications en temps réel sur cette URL</p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="debug-mode">Mode Débogage</Label>
                <p className="text-sm text-muted-foreground">Activer les journaux de débogage détaillés</p>
              </div>
              <Switch id="debug-mode" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance-mode">Mode Maintenance</Label>
                <p className="text-sm text-muted-foreground">Mettre la plateforme en mode maintenance</p>
              </div>
              <Switch id="maintenance-mode" />
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Données et Confidentialité</h3>
              <div className="flex flex-col space-y-2">
                <Button variant="outline">Exporter toutes les données</Button>
                <Button variant="outline" className="text-red-500 hover:text-red-500 hover:bg-red-50">
                  Supprimer toutes les données
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

