"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface EventHomeStatsProps {
  eventId?: string
}

export function EventHomeStats({ eventId }: EventHomeStatsProps) {
  const [period, setPeriod] = useState("week")

  // Données fictives pour les statistiques
  const interactionData = [
    { name: "Vues", value: eventId ? 245 : 1245 },
    { name: "Favoris", value: eventId ? 78 : 432 },
    { name: "Partages", value: eventId ? 42 : 287 },
    { name: "Inscriptions", value: eventId ? 35 : 198 },
  ]

  const dailyData = [
    { name: "Lun", vues: 42, favoris: 12, partages: 8, inscriptions: 5 },
    { name: "Mar", vues: 53, favoris: 15, partages: 10, inscriptions: 7 },
    { name: "Mer", vues: 61, favoris: 18, partages: 12, inscriptions: 9 },
    { name: "Jeu", vues: 45, favoris: 13, partages: 7, inscriptions: 6 },
    { name: "Ven", vues: 38, favoris: 11, partages: 5, inscriptions: 4 },
    { name: "Sam", vues: 65, favoris: 20, partages: 14, inscriptions: 11 },
    { name: "Dim", vues: 47, favoris: 14, partages: 9, inscriptions: 8 },
  ]

  const conversionRates = [
    { name: "Vues → Favoris", rate: 32 },
    { name: "Vues → Partages", rate: 23 },
    { name: "Vues → Inscriptions", rate: 16 },
    { name: "Favoris → Inscriptions", rate: 45 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {eventId
            ? "Statistiques d'interaction sur la page d'accueil"
            : "Statistiques globales des événements sur la page d'accueil"}
        </CardTitle>
        <CardDescription>
          Analyse des interactions des utilisateurs avec {eventId ? "cet événement" : "les événements"} sur la page
          d'accueil
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="daily">Évolution quotidienne</TabsTrigger>
            <TabsTrigger value="conversion">Taux de conversion</TabsTrigger>
          </TabsList>

          <div className="flex justify-end">
            <div className="space-x-2">
              <Button variant={period === "week" ? "default" : "outline"} size="sm" onClick={() => setPeriod("week")}>
                Semaine
              </Button>
              <Button variant={period === "month" ? "default" : "outline"} size="sm" onClick={() => setPeriod("month")}>
                Mois
              </Button>
              <Button variant={period === "year" ? "default" : "outline"} size="sm" onClick={() => setPeriod("year")}>
                Année
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {interactionData.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{item.value}</div>
                    <div className="text-sm text-muted-foreground">{item.name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={interactionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {interactionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="vues" fill="#0088FE" />
                      <Bar dataKey="favoris" fill="#00C49F" />
                      <Bar dataKey="partages" fill="#FFBB28" />
                      <Bar dataKey="inscriptions" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversion" className="space-y-4">
            <div className="space-y-4">
              {conversionRates.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.rate}%</span>
                  </div>
                  <Progress value={item.rate} className="h-2" />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

