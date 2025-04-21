"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, FileText, BarChart, PieChart, LineChart, Table2, Calendar, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function ReportGenerator() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [reportType, setReportType] = useState("performance")
  const [reportFormat, setReportFormat] = useState("pdf")
  const [dateRange, setDateRange] = useState("custom")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeTables, setIncludeTables] = useState(true)

  // Options pour les startups
  const startups = [
    { id: "1", name: "EcoTech Solutions" },
    { id: "2", name: "MediConnect" },
    { id: "3", name: "FinLedger" },
    { id: "4", name: "DataVision AI" },
    { id: "5", name: "Urban Mobility" },
    { id: "6", name: "EdTech Innovators" },
    { id: "7", name: "FoodTech Solutions" },
    { id: "8", name: "SmartHome Systems" },
  ]

  // Options pour les métriques
  const metrics = [
    { id: "1", name: "Croissance des utilisateurs", category: "performance" },
    { id: "2", name: "Revenus", category: "performance" },
    { id: "3", name: "Taux de conversion", category: "performance" },
    { id: "4", name: "Taux de rétention", category: "performance" },
    { id: "5", name: "Coût d'acquisition client", category: "performance" },
    { id: "6", name: "Temps de développement", category: "development" },
    { id: "7", name: "Bugs résolus", category: "development" },
    { id: "8", name: "Déploiements", category: "development" },
    { id: "9", name: "Heures de mentorat", category: "mentoring" },
    { id: "10", name: "Satisfaction des startups", category: "mentoring" },
    { id: "11", name: "Utilisation des ressources", category: "resources" },
    { id: "12", name: "Taux d'occupation", category: "resources" },
  ]

  // Modèles de rapports
  const reportTemplates = [
    {
      id: "1",
      name: "Performance des startups",
      type: "performance",
      description: "Analyse complète des KPIs de performance des startups",
    },
    {
      id: "2",
      name: "Rapport de mentorat",
      type: "mentoring",
      description: "Évaluation de l'efficacité du programme de mentorat",
    },
    {
      id: "3",
      name: "Utilisation des ressources",
      type: "resources",
      description: "Analyse de l'utilisation des espaces et équipements",
    },
    {
      id: "4",
      name: "Rapport de développement",
      type: "development",
      description: "Suivi des progrès techniques des startups",
    },
    {
      id: "5",
      name: "Rapport financier",
      type: "financial",
      description: "Analyse des aspects financiers des startups",
    },
    { id: "6", name: "Rapport d'événements", type: "events", description: "Résumé et impact des événements organisés" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nouveau Rapport
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Générer un Nouveau Rapport</DialogTitle>
          <DialogDescription>
            Créez un rapport personnalisé en sélectionnant les données et le format souhaités.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Informations de base</TabsTrigger>
            <TabsTrigger value="data">Sélection des données</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-title">Titre du rapport</Label>
                <Input id="report-title" placeholder="Entrez un titre pour votre rapport" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-type">Type de rapport</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="mentoring">Mentorat</SelectItem>
                    <SelectItem value="resources">Ressources</SelectItem>
                    <SelectItem value="development">Développement</SelectItem>
                    <SelectItem value="financial">Financier</SelectItem>
                    <SelectItem value="events">Événements</SelectItem>
                    <SelectItem value="custom">Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-description">Description</Label>
              <Textarea
                id="report-description"
                placeholder="Décrivez brièvement l'objectif de ce rapport"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Période du rapport</Label>
                <RadioGroup value={dateRange} onValueChange={setDateRange} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last-month" id="last-month" />
                    <Label htmlFor="last-month" className="font-normal">
                      Dernier mois
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last-quarter" id="last-quarter" />
                    <Label htmlFor="last-quarter" className="font-normal">
                      Dernier trimestre
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last-year" id="last-year" />
                    <Label htmlFor="last-year" className="font-normal">
                      Dernière année
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom-date" />
                    <Label htmlFor="custom-date" className="font-normal">
                      Période personnalisée
                    </Label>
                  </div>
                </RadioGroup>

                {dateRange === "custom" && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="space-y-1">
                      <Label htmlFor="date-start" className="text-xs">
                        Date de début
                      </Label>
                      <Input id="date-start" type="date" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="date-end" className="text-xs">
                        Date de fin
                      </Label>
                      <Input id="date-end" type="date" />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Format de sortie</Label>
                <RadioGroup value={reportFormat} onValueChange={setReportFormat} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pdf" id="format-pdf" />
                    <Label htmlFor="format-pdf" className="font-normal">
                      PDF
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excel" id="format-excel" />
                    <Label htmlFor="format-excel" className="font-normal">
                      Excel
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="csv" id="format-csv" />
                    <Label htmlFor="format-csv" className="font-normal">
                      CSV
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="html" id="format-html" />
                    <Label htmlFor="format-html" className="font-normal">
                      HTML
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Utiliser un modèle</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {reportTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer hover:border-primary transition-colors ${reportType === template.type ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => setReportType(template.type)}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                      <CardDescription className="text-xs">{template.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("data")}>Suivant: Sélection des données</Button>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Startups à inclure</Label>
              <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox id="select-all-startups" />
                  <Label htmlFor="select-all-startups" className="font-medium">
                    Sélectionner toutes les startups
                  </Label>
                </div>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {startups.map((startup) => (
                    <div key={startup.id} className="flex items-center space-x-2">
                      <Checkbox id={`startup-${startup.id}`} defaultChecked />
                      <Label htmlFor={`startup-${startup.id}`} className="font-normal">
                        {startup.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Métriques à inclure</Label>
              <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox id="select-all-metrics" />
                  <Label htmlFor="select-all-metrics" className="font-medium">
                    Sélectionner toutes les métriques
                  </Label>
                </div>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {metrics
                    .filter((metric) => reportType === "custom" || metric.category === reportType)
                    .map((metric) => (
                      <div key={metric.id} className="flex items-center space-x-2">
                        <Checkbox id={`metric-${metric.id}`} defaultChecked />
                        <Label htmlFor={`metric-${metric.id}`} className="font-normal">
                          {metric.name}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Options de visualisation</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="include-charts"
                    checked={includeCharts}
                    onCheckedChange={(checked) => setIncludeCharts(!!checked)}
                  />
                  <div>
                    <Label htmlFor="include-charts" className="font-medium">
                      Inclure des graphiques
                    </Label>
                    <p className="text-sm text-muted-foreground">Ajouter des visualisations graphiques des données</p>

                    {includeCharts && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="flex flex-col items-center border rounded-md p-2 cursor-pointer hover:bg-muted">
                          <BarChart className="h-8 w-8 text-primary mb-1" />
                          <span className="text-xs">Barres</span>
                        </div>
                        <div className="flex flex-col items-center border rounded-md p-2 cursor-pointer hover:bg-muted">
                          <LineChart className="h-8 w-8 text-primary mb-1" />
                          <span className="text-xs">Lignes</span>
                        </div>
                        <div className="flex flex-col items-center border rounded-md p-2 cursor-pointer hover:bg-muted">
                          <PieChart className="h-8 w-8 text-primary mb-1" />
                          <span className="text-xs">Secteurs</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="include-tables"
                    checked={includeTables}
                    onCheckedChange={(checked) => setIncludeTables(!!checked)}
                  />
                  <div>
                    <Label htmlFor="include-tables" className="font-medium">
                      Inclure des tableaux
                    </Label>
                    <p className="text-sm text-muted-foreground">Ajouter des tableaux détaillés des données</p>

                    {includeTables && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="flex flex-col items-center border rounded-md p-2 cursor-pointer hover:bg-muted">
                          <Table2 className="h-8 w-8 text-primary mb-1" />
                          <span className="text-xs">Détaillé</span>
                        </div>
                        <div className="flex flex-col items-center border rounded-md p-2 cursor-pointer hover:bg-muted">
                          <Calendar className="h-8 w-8 text-primary mb-1" />
                          <span className="text-xs">Chronologique</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Options supplémentaires</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-summary" defaultChecked />
                  <Label htmlFor="include-summary" className="font-normal">
                    Inclure un résumé exécutif
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-recommendations" defaultChecked />
                  <Label htmlFor="include-recommendations" className="font-normal">
                    Inclure des recommandations
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-comparisons" defaultChecked />
                  <Label htmlFor="include-comparisons" className="font-normal">
                    Inclure des comparaisons
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-trends" defaultChecked />
                  <Label htmlFor="include-trends" className="font-normal">
                    Inclure l'analyse des tendances
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("basic")}>
                Retour
              </Button>
              <Button onClick={() => setActiveTab("preview")}>Suivant: Aperçu</Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu du rapport</CardTitle>
                <CardDescription>Voici un aperçu de votre rapport personnalisé</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-6 bg-muted/20">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold">Rapport de Performance des Startups</h3>
                      <p className="text-sm text-muted-foreground">Période: Q2 2025 (Avril - Juin 2025)</p>
                      <p className="text-sm text-muted-foreground">Généré le: {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                      <FileText className="h-3 w-3" />
                      <span>{reportFormat.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Résumé exécutif</h4>
                      <div className="h-20 bg-muted/30 rounded-md flex items-center justify-center text-muted-foreground text-sm">
                        Contenu du résumé exécutif
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Graphiques</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-40 bg-muted/30 rounded-md flex items-center justify-center text-muted-foreground text-sm">
                          Graphique en barres
                        </div>
                        <div className="h-40 bg-muted/30 rounded-md flex items-center justify-center text-muted-foreground text-sm">
                          Graphique en lignes
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Données détaillées</h4>
                      <div className="h-40 bg-muted/30 rounded-md flex items-center justify-center text-muted-foreground text-sm">
                        Tableau de données
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommandations</h4>
                      <div className="h-20 bg-muted/30 rounded-md flex items-center justify-center text-muted-foreground text-sm">
                        Contenu des recommandations
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("data")}>
                Retour
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Télécharger l'aperçu
                </Button>
                <Button onClick={() => setOpen(false)}>Générer le rapport</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

