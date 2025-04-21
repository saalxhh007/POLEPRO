"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Share2, Printer, FileText, Eye, Clock, Calendar, User, BarChart } from "lucide-react"
import { ReportCharts } from "./report-charts"

interface ReportDetailsProps {
  reportId: string
}

export function ReportDetails({ reportId }: ReportDetailsProps) {
  // Données fictives pour un rapport spécifique
  const report = {
    id: "1",
    title: "Rapport Trimestriel Q2 2025",
    description: "Analyse complète des performances des startups pour le deuxième trimestre 2025.",
    type: "Trimestriel",
    date: "30 Juin 2025",
    author: "Admin User",
    format: "PDF",
    status: "published",
    period: "Q2 2025 (Avril - Juin)",
    downloads: 12,
    lastViewed: "Aujourd'hui",
    views: 28,
    createdAt: "15 Juin 2025",
    updatedAt: "28 Juin 2025",
    size: "2.4 MB",
    pages: 15,
    sections: [
      { id: "1", title: "Résumé exécutif", pages: "1-2" },
      { id: "2", title: "Performance des startups", pages: "3-7" },
      { id: "3", title: "Analyse des mentors", pages: "8-10" },
      { id: "4", title: "Utilisation des ressources", pages: "11-12" },
      { id: "5", title: "Événements et ateliers", pages: "13-14" },
      { id: "6", title: "Recommandations", pages: "15" },
    ],
    startups: [
      { id: "1", name: "EcoTech Solutions", performance: 85 },
      { id: "2", name: "MediConnect", performance: 78 },
      { id: "3", name: "FinLedger", performance: 62 },
      { id: "4", name: "DataVision AI", performance: 91 },
      { id: "5", name: "Urban Mobility", performance: 73 },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{report.title}</h2>
          <p className="text-muted-foreground">{report.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" /> Partager
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Imprimer
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Télécharger
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Informations générales</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Type:</dt>
                <dd>{report.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Période:</dt>
                <dd>{report.period}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Format:</dt>
                <dd>
                  <Badge
                    variant="outline"
                    className={report.format === "PDF" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}
                  >
                    {report.format}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Statut:</dt>
                <dd>
                  <Badge variant={report.status === "published" ? "default" : "secondary"}>
                    {report.status === "published" ? "Publié" : "Brouillon"}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Taille:</dt>
                <dd>{report.size}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Pages:</dt>
                <dd>{report.pages}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Activité</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <dt className="text-muted-foreground">Créé le:</dt>
                <dd>{report.createdAt}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <dt className="text-muted-foreground">Mis à jour le:</dt>
                <dd>{report.updatedAt}</dd>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <dt className="text-muted-foreground">Auteur:</dt>
                <dd>{report.author}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <dt className="text-muted-foreground">Vues:</dt>
                <dd>{report.views}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <dt className="text-muted-foreground">Téléchargements:</dt>
                <dd>{report.downloads}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <dt className="text-muted-foreground">Dernière consultation:</dt>
                <dd>{report.lastViewed}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sections du rapport</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {report.sections.map((section) => (
                <li key={section.id} className="flex justify-between items-center">
                  <span>{section.title}</span>
                  <span className="text-xs text-muted-foreground">Pages {section.pages}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
          <TabsTrigger value="charts">Graphiques</TabsTrigger>
          <TabsTrigger value="data">Données</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="border rounded-md p-6 bg-muted/20">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">Période: {report.period}</p>
                    <p className="text-sm text-muted-foreground">Généré le: {report.createdAt}</p>
                  </div>
                  <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                    <FileText className="h-3 w-3" />
                    <span>{report.format}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Résumé exécutif</h4>
                    <p className="text-sm">
                      Ce rapport présente une analyse complète des performances des startups de l'incubateur pour le
                      deuxième trimestre 2025. Les résultats montrent une croissance globale de 15% par rapport au
                      trimestre précédent, avec des performances particulièrement remarquables dans les secteurs de la
                      technologie propre et de l'intelligence artificielle.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Performance des startups</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="h-60 bg-muted/30 rounded-md flex items-center justify-center">
                        <div className="text-center">
                          <BarChart className="h-10 w-10 text-primary mx-auto mb-2" />
                          <span className="text-sm text-muted-foreground">Graphique de performance</span>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Top 3 des startups</h5>
                        <ul className="space-y-2">
                          {report.startups
                            .sort((a, b) => b.performance - a.performance)
                            .slice(0, 3)
                            .map((startup, index) => (
                              <li key={startup.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                                    {index + 1}
                                  </div>
                                  <span>{startup.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${startup.performance}%` }} />
                                  </div>
                                  <span className="text-xs font-medium">{startup.performance}%</span>
                                </div>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center text-muted-foreground text-sm">
                    <p>Aperçu limité. Téléchargez le rapport complet pour voir toutes les sections.</p>
                    <Button variant="link" className="mt-2">
                      <Download className="mr-2 h-4 w-4" /> Télécharger le rapport complet
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="mt-4">
          <ReportCharts />
        </TabsContent>

        <TabsContent value="data" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Données brutes</CardTitle>
              <CardDescription>Données utilisées pour générer ce rapport</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-2 px-4 text-left font-medium">Startup</th>
                      <th className="py-2 px-4 text-left font-medium">Croissance</th>
                      <th className="py-2 px-4 text-left font-medium">Revenus</th>
                      <th className="py-2 px-4 text-left font-medium">Utilisateurs</th>
                      <th className="py-2 px-4 text-left font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.startups.map((startup) => (
                      <tr key={startup.id} className="border-b">
                        <td className="py-2 px-4">{startup.name}</td>
                        <td className="py-2 px-4">{Math.floor(Math.random() * 30) + 5}%</td>
                        <td className="py-2 px-4">{Math.floor(Math.random() * 100000) + 10000} €</td>
                        <td className="py-2 px-4">{Math.floor(Math.random() * 10000) + 1000}</td>
                        <td className="py-2 px-4">{startup.performance}/100</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Exporter les données
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des versions</CardTitle>
              <CardDescription>Suivi des modifications du rapport</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Version 1.2 (Actuelle)</h4>
                      <Badge>Publiée</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Mise à jour le 28 Juin 2025 par Admin User</p>
                    <p className="text-sm">
                      Ajout des recommandations finales et correction des graphiques de performance.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Version 1.1</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Mise à jour le 22 Juin 2025 par Admin User</p>
                    <p className="text-sm">Ajout de l'analyse des mentors et mise à jour des données de performance.</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Version 1.0</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Créé le 15 Juin 2025 par Admin User</p>
                    <p className="text-sm">Version initiale du rapport avec les données préliminaires.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

