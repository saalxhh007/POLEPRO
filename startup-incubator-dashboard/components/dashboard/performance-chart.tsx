"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "lucide-react"

export function PerformanceChart() {
  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Performance des Startups</CardTitle>
          <CardDescription>Suivi des métriques clés de performance des startups</CardDescription>
        </div>
        <Tabs defaultValue="bar">
          <TabsList className="grid w-[120px] grid-cols-2">
            <TabsTrigger value="bar">
              <BarChart className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="line">
              <LineChart className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="bar" className="h-full">
            <div className="h-[300px] w-full">
              <BarChartComponent />
            </div>
          </TabsContent>
          <TabsContent value="line" className="h-full">
            <div className="h-[300px] w-full">
              <LineChartComponent />
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">{/* Le contenu sera affiché via les TabsContent */}</div>
      </CardContent>
    </Card>
  )
}

function BarChartComponent() {
  return (
    <div className="h-full w-full">
      <svg width="100%" height="100%" viewBox="0 0 600 300">
        {/* Axes */}
        <line x1="50" y1="250" x2="550" y2="250" stroke="#888" strokeWidth="1" />
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
        <text x="475" y="270" textAnchor="middle" fontSize="12" fill="#888">
          Juin
        </text>

        {/* Bars for EcoTech */}
        <rect x="75" y="170" width="30" height="80" fill="#0ea5e9" fillOpacity="0.8" />
        <rect x="150" y="150" width="30" height="100" fill="#0ea5e9" fillOpacity="0.8" />
        <rect x="225" y="130" width="30" height="120" fill="#0ea5e9" fillOpacity="0.8" />
        <rect x="300" y="110" width="30" height="140" fill="#0ea5e9" fillOpacity="0.8" />
        <rect x="375" y="90" width="30" height="160" fill="#0ea5e9" fillOpacity="0.8" />
        <rect x="450" y="70" width="30" height="180" fill="#0ea5e9" fillOpacity="0.8" />

        {/* Bars for MediConnect */}
        <rect x="105" y="190" width="30" height="60" fill="#10b981" fillOpacity="0.8" />
        <rect x="180" y="170" width="30" height="80" fill="#10b981" fillOpacity="0.8" />
        <rect x="255" y="150" width="30" height="100" fill="#10b981" fillOpacity="0.8" />
        <rect x="330" y="130" width="30" height="120" fill="#10b981" fillOpacity="0.8" />
        <rect x="405" y="110" width="30" height="140" fill="#10b981" fillOpacity="0.8" />
        <rect x="480" y="90" width="30" height="160" fill="#10b981" fillOpacity="0.8" />

        {/* Legend */}
        <rect x="450" y="20" width="15" height="15" fill="#0ea5e9" fillOpacity="0.8" />
        <text x="470" y="32" fontSize="12" fill="#888">
          EcoTech
        </text>
        <rect x="450" y="40" width="15" height="15" fill="#10b981" fillOpacity="0.8" />
        <text x="470" y="52" fontSize="12" fill="#888">
          MediConnect
        </text>
      </svg>
    </div>
  )
}

function LineChartComponent() {
  return (
    <div className="h-full w-full">
      <svg width="100%" height="100%" viewBox="0 0 600 300">
        {/* Axes */}
        <line x1="50" y1="250" x2="550" y2="250" stroke="#888" strokeWidth="1" />
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
        <text x="475" y="270" textAnchor="middle" fontSize="12" fill="#888">
          Juin
        </text>

        {/* Grid lines */}
        <line x1="50" y1="200" x2="550" y2="200" stroke="#eee" strokeWidth="1" />
        <line x1="50" y1="150" x2="550" y2="150" stroke="#eee" strokeWidth="1" />
        <line x1="50" y1="100" x2="550" y2="100" stroke="#eee" strokeWidth="1" />
        <line x1="50" y1="50" x2="550" y2="50" stroke="#eee" strokeWidth="1" />

        {/* Line for EcoTech */}
        <polyline points="100,170 175,150 250,130 325,110 400,90 475,70" fill="none" stroke="#0ea5e9" strokeWidth="3" />

        {/* Points for EcoTech */}
        <circle cx="100" cy="170" r="4" fill="#0ea5e9" />
        <circle cx="175" cy="150" r="4" fill="#0ea5e9" />
        <circle cx="250" cy="130" r="4" fill="#0ea5e9" />
        <circle cx="325" cy="110" r="4" fill="#0ea5e9" />
        <circle cx="400" cy="90" r="4" fill="#0ea5e9" />
        <circle cx="475" cy="70" r="4" fill="#0ea5e9" />

        {/* Line for MediConnect */}
        <polyline
          points="100,190 175,170 250,150 325,130 400,110 475,90"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
        />

        {/* Points for MediConnect */}
        <circle cx="100" cy="190" r="4" fill="#10b981" />
        <circle cx="175" cy="170" r="4" fill="#10b981" />
        <circle cx="250" cy="150" r="4" fill="#10b981" />
        <circle cx="325" cy="130" r="4" fill="#10b981" />
        <circle cx="400" cy="110" r="4" fill="#10b981" />
        <circle cx="475" cy="90" r="4" fill="#10b981" />

        {/* Legend */}
        <line x1="450" y1="27" x2="465" y2="27" stroke="#0ea5e9" strokeWidth="3" />
        <circle cx="457.5" cy="27" r="4" fill="#0ea5e9" />
        <text x="470" y="32" fontSize="12" fill="#888">
          EcoTech
        </text>

        <line x1="450" y1="47" x2="465" y2="47" stroke="#10b981" strokeWidth="3" />
        <circle cx="457.5" cy="47" r="4" fill="#10b981" />
        <text x="470" y="52" fontSize="12" fill="#888">
          MediConnect
        </text>
      </svg>
    </div>
  )
}

