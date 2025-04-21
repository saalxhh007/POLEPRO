"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"
import { useState } from "react"

export function ReportCharts() {
  const [chartPeriod, setChartPeriod] = useState("q2-2025")

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="performance" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="resources">Ressources</TabsTrigger>
            <TabsTrigger value="mentoring">Mentorat</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Select value={chartPeriod} onValueChange={setChartPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q2-2025">Q2 2025</SelectItem>
              <SelectItem value="q1-2025">Q1 2025</SelectItem>
              <SelectItem value="q4-2024">Q4 2024</SelectItem>
              <SelectItem value="q3-2024">Q3 2024</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Performance par startup</CardTitle>
            <CardDescription>Comparaison des scores de performance</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-80 p-6">
              <BarChartComponent />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Évolution de la croissance</CardTitle>
            <CardDescription>Tendances sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-80 p-6">
              <LineChartComponent />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Répartition par industrie</CardTitle>
            <CardDescription>Distribution des startups par secteur</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-80 p-6">
              <PieChartComponent />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Métriques clés</CardTitle>
            <CardDescription>Comparaison avec le trimestre précédent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Croissance des utilisateurs</span>
                  <span className="text-sm font-medium">+24%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "24%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Revenus</span>
                  <span className="text-sm font-medium">+18%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "18%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Taux de conversion</span>
                  <span className="text-sm font-medium">+12%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "12%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Satisfaction client</span>
                  <span className="text-sm font-medium">+8%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "8%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function BarChartComponent() {
  return (
    <div className="h-full w-full">
      <svg width="100%" height="100%" viewBox="0 0 500 300">
        {/* Axes */}
        <line x1="50" y1="250" x2="450" y2="250" stroke="#888" strokeWidth="1" />
        <line x1="50" y1="50" x2="50" y2="250" stroke="#888" strokeWidth="1" />

        {/* Y-axis labels */}
        <text x="30" y="250" textAnchor="end" fontSize="12" fill="#888">
          0
        </text>
        <text x="30" y="200" textAnchor="end" fontSize="12" fill="#888">
          25
        </text>
        <text x="30" y="150" textAnchor="end" fontSize="12" fill="#888">
          50
        </text>
        <text x="30" y="100" textAnchor="end" fontSize="12" fill="#888">
          75
        </text>
        <text x="30" y="50" textAnchor="end" fontSize="12" fill="#888">
          100
        </text>

        {/* X-axis labels */}
        <text x="100" y="270" textAnchor="middle" fontSize="12" fill="#888">
          EcoTech
        </text>
        <text x="175" y="270" textAnchor="middle" fontSize="12" fill="#888">
          MediConnect
        </text>
        <text x="250" y="270" textAnchor="middle" fontSize="12" fill="#888">
          FinLedger
        </text>
        <text x="325" y="270" textAnchor="middle" fontSize="12" fill="#888">
          DataVision
        </text>
        <text x="400" y="270" textAnchor="middle" fontSize="12" fill="#888">
          Urban Mobility
        </text>

        {/* Bars */}
        <rect x="75" y="100" width="50" height="150" fill="#0ea5e9" fillOpacity="0.8" />
        <rect x="150" y="125" width="50" height="125" fill="#0ea5e9" fillOpacity="0.8" />
        <rect x="225" y="175" width="50" height="75" fill="#0ea5e9" fillOpacity="0.8" />
        <rect x="300" y="75" width="50" height="175" fill="#0ea5e9" fillOpacity="0.8" />
        <rect x="375" y="150" width="50" height="100" fill="#0ea5e9" fillOpacity="0.8" />
      </svg>
    </div>
  )
}

function LineChartComponent() {
  return (
    <div className="h-full w-full">
      <svg width="100%" height="100%" viewBox="0 0 500 300">
        {/* Axes */}
        <line x1="50" y1="250" x2="450" y2="250" stroke="#888" strokeWidth="1" />
        <line x1="50" y1="50" x2="50" y2="250" stroke="#888" strokeWidth="1" />

        {/* Y-axis labels */}
        <text x="30" y="250" textAnchor="end" fontSize="12" fill="#888">
          0
        </text>
        <text x="30" y="200" textAnchor="end" fontSize="12" fill="#888">
          25
        </text>
        <text x="30" y="150" textAnchor="end" fontSize="12" fill="#888">
          50
        </text>
        <text x="30" y="100" textAnchor="end" fontSize="12" fill="#888">
          75
        </text>
        <text x="30" y="50" textAnchor="end" fontSize="12" fill="#888">
          100
        </text>

        {/* X-axis labels */}
        <text x="100" y="270" textAnchor="middle" fontSize="12" fill="#888">
          Jan
        </text>
        <text x="175" y="270" textAnchor="middle" fontSize="12" fill="#888">
          Fév
        </text>
        <text x="250" y="270" textAnchor="middle" fontSize="12" fill="#888">
          Mar
        </text>
        <text x="325" y="270" textAnchor="middle" fontSize="12" fill="#888">
          Avr
        </text>
        <text x="400" y="270" textAnchor="middle" fontSize="12" fill="#888">
          Mai
        </text>

        {/* Grid lines */}
        <line x1="50" y1="200" x2="450" y2="200" stroke="#eee" strokeWidth="1" />
        <line x1="50" y1="150" x2="450" y2="150" stroke="#eee" strokeWidth="1" />
        <line x1="50" y1="100" x2="450" y2="100" stroke="#eee" strokeWidth="1" />
        <line x1="50" y1="50" x2="450" y2="50" stroke="#eee" strokeWidth="1" />

        {/* Line for Growth */}
        <polyline points="100,200 175,180 250,150 325,120 400,100" fill="none" stroke="#0ea5e9" strokeWidth="3" />

        {/* Points for Growth */}
        <circle cx="100" cy="200" r="4" fill="#0ea5e9" />
        <circle cx="175" cy="180" r="4" fill="#0ea5e9" />
        <circle cx="250" cy="150" r="4" fill="#0ea5e9" />
        <circle cx="325" cy="120" r="4" fill="#0ea5e9" />
        <circle cx="400" cy="100" r="4" fill="#0ea5e9" />
      </svg>
    </div>
  )
}

function PieChartComponent() {
  // Données pour le graphique en secteurs
  const data = [
    { name: "CleanTech", percentage: 25, color: "#0ea5e9" },
    { name: "HealthTech", percentage: 20, color: "#10b981" },
    { name: "FinTech", percentage: 15, color: "#f59e0b" },
    { name: "AI/ML", percentage: 15, color: "#8b5cf6" },
    { name: "Transportation", percentage: 10, color: "#ec4899" },
    { name: "Other", percentage: 15, color: "#6b7280" },
  ]

  let cumulativePercentage = 0

  return (
    <div className="h-full w-full">
      <svg width="100%" height="100%" viewBox="0 0 500 300">
        <g transform="translate(150, 150)">
          {data.map((item) => {
            // Calcul des angles pour le secteur
            const startAngle = (cumulativePercentage / 100) * Math.PI * 2 - Math.PI / 2
            cumulativePercentage += item.percentage
            const endAngle = (cumulativePercentage / 100) * Math.PI * 2 - Math.PI / 2

            // Calcul des coordonnées des points du secteur
            const startX = Math.cos(startAngle) * 100
            const startY = Math.sin(startAngle) * 100
            const endX = Math.cos(endAngle) * 100
            const endY = Math.sin(endAngle) * 100

            // Déterminer si l'arc est grand (plus de 180 degrés) ou petit
            const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0

            // Créer le chemin SVG pour le secteur
            const path = [`M 0 0`, `L ${startX} ${startY}`, `A 100 100 0 ${largeArcFlag} 1 ${endX} ${endY}`, `Z`].join(
              " ",
            )

            return <path key={item.name} d={path} fill={item.color} stroke="white" strokeWidth="1" />
          })}
        </g>

        {/* Legend */}
        <g transform="translate(300, 50)">
          {data.map((item, index) => (
            <g key={item.name} transform={`translate(0, ${index * 25})`}>
              <rect width="15" height="15" fill={item.color} />
              <text x="20" y="12" fontSize="12" fill="#888">
                {item.name} ({item.percentage}%)
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

