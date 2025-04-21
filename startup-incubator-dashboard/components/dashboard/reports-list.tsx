"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Search, FileText, Download, Share2, Printer, Filter } from "lucide-react"
import { ReportGenerator } from "./report-generator"

export function ReportsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [reportType, setReportType] = useState("all")
  const [reportPeriod, setReportPeriod] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")
  const [activeTab, setActiveTab] = useState("all")

  const reports = [
    {
      id: "1",
      title: "Rapport Trimestriel Q2 2025",
      type: "Trimestriel",
      date: "30 Juin 2025",
      author: "Admin",
      format: "PDF",
      status: "published",
      period: "Q2 2025",
      downloads: 12,
      lastViewed: "Aujourd'hui",
    },
    {
      id: "2",
      title: "Performance des Startups",
      type: "Analytique",
      date: "15 Juin 2025",
      author: "Admin",
      format: "Excel",
      status: "draft",
      period: "Juin 2025",
      downloads: 0,
      lastViewed: "Hier",
    },
    {
      id: "3",
      title: "Rapport d'Impact Économique",
      type: "Annuel",
      date: "1 Juin 2025",
      author: "Admin",
      format: "PDF",
      status: "published",
      period: "2024-2025",
      downloads: 28,
      lastViewed: "Il y a 3 jours",
    },
    {
      id: "4",
      title: "Analyse des Mentors",
      type: "Analytique",
      date: "25 Mai 2025",
      author: "Admin",
      format: "PDF",
      status: "published",
      period: "Mai 2025",
      downloads: 15,
      lastViewed: "Il y a 1 semaine",
    },
    {
      id: "5",
      title: "Utilisation des Ressources",
      type: "Mensuel",
      date: "31 Mai 2025",
      author: "Admin",
      format: "Excel",
      status: "published",
      period: "Mai 2025",
      downloads: 8,
      lastViewed: "Il y a 5 jours",
    },
    {
      id: "6",
      title: "Rapport de Financement",
      type: "Financier",
      date: "20 Mai 2025",
      author: "Admin",
      format: "PDF",
      status: "draft",
      period: "Q2 2025",
      downloads: 0,
      lastViewed: "Il y a 2 jours",
    },
    {
      id: "7",
      title: "Progression des Startups EcoTech",
      type: "Personnalisé",
      date: "10 Juin 2025",
      author: "Admin",
      format: "PDF",
      status: "published",
      period: "Jan-Juin 2025",
      downloads: 5,
      lastViewed: "Hier",
    },
    {
      id: "8",
      title: "Rapport de Mentorat",
      type: "Mensuel",
      date: "5 Juin 2025",
      author: "Admin",
      format: "PDF",
      status: "published",
      period: "Mai 2025",
      downloads: 7,
      lastViewed: "Il y a 4 jours",
    },
  ]

  // Filtrer les rapports
  const filteredReports = reports.filter(
    (report) =>
      (report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.type.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (reportType === "all" || report.type === reportType) &&
      (reportPeriod === "all" || report.period.includes(reportPeriod)) &&
      (activeTab === "all" ||
        (activeTab === "published" && report.status === "published") ||
        (activeTab === "draft" && report.status === "draft")),
  )

  // Trier les rapports
  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case "title-asc":
        return a.title.localeCompare(b.title)
      case "title-desc":
        return b.title.localeCompare(a.title)
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "downloads-asc":
        return a.downloads - b.downloads
      case "downloads-desc":
        return b.downloads - a.downloads
      default:
        return 0
    }
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher des rapports..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Type de rapport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="Trimestriel">Trimestriel</SelectItem>
                    <SelectItem value="Mensuel">Mensuel</SelectItem>
                    <SelectItem value="Annuel">Annuel</SelectItem>
                    <SelectItem value="Analytique">Analytique</SelectItem>
                    <SelectItem value="Financier">Financier</SelectItem>
                    <SelectItem value="Personnalisé">Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={reportPeriod} onValueChange={setReportPeriod}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les périodes</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="Q2 2025">Q2 2025</SelectItem>
                    <SelectItem value="Q1 2025">Q1 2025</SelectItem>
                    <SelectItem value="Juin 2025">Juin 2025</SelectItem>
                    <SelectItem value="Mai 2025">Mai 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filtres avancés
              </Button>
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" /> Imprimer
              </Button>
              <ReportGenerator />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="published">Publiés</TabsTrigger>
              <TabsTrigger value="draft">Brouillons</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-muted-foreground">
              {sortedReports.length} rapport{sortedReports.length !== 1 ? "s" : ""} trouvé
              {sortedReports.length !== 1 ? "s" : ""}
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date (récent d'abord)</SelectItem>
                <SelectItem value="date-asc">Date (ancien d'abord)</SelectItem>
                <SelectItem value="title-asc">Titre (A-Z)</SelectItem>
                <SelectItem value="title-desc">Titre (Z-A)</SelectItem>
                <SelectItem value="downloads-desc">Téléchargements (élevé-bas)</SelectItem>
                <SelectItem value="downloads-asc">Téléchargements (bas-élevé)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Téléchargements</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedReports.length > 0 ? (
                  sortedReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="font-medium">{report.title}</span>
                            <p className="text-xs text-muted-foreground">Dernière consultation: {report.lastViewed}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{report.type}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={report.format === "PDF" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}
                        >
                          {report.format}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.downloads}</TableCell>
                      <TableCell>
                        <Badge variant={report.status === "published" ? "default" : "secondary"}>
                          {report.status === "published" ? "Publié" : "Brouillon"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" title="Télécharger">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Partager">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Voir le rapport</DropdownMenuItem>
                              <DropdownMenuItem>Modifier</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Exporter en PDF</DropdownMenuItem>
                              <DropdownMenuItem>Exporter en Excel</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Aucun rapport trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

