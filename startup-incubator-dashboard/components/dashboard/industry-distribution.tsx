"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function IndustryDistribution() {
  // Données de répartition des startups par industrie
  const industries = [
    { name: "CleanTech", percentage: 25, color: "#0ea5e9" },
    { name: "HealthTech", percentage: 20, color: "#10b981" },
    { name: "FinTech", percentage: 15, color: "#f59e0b" },
    { name: "AI/ML", percentage: 15, color: "#8b5cf6" },
    { name: "Transportation", percentage: 10, color: "#ec4899" },
    { name: "Education", percentage: 10, color: "#f43f5e" },
    { name: "Other", percentage: 5, color: "#6b7280" },
  ]

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Répartition par Industrie</CardTitle>
        <CardDescription>Distribution des startups par secteur d'activité</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <svg width="100%" height="100%" viewBox="0 0 400 300">
            {/* Pie Chart */}
            <PieChart data={industries} />

            {/* Legend */}
            <g transform="translate(250, 50)">
              {industries.map((industry, index) => (
                <g key={industry.name} transform={`translate(0, ${index * 25})`}>
                  <rect width="15" height="15" fill={industry.color} />
                  <text x="20" y="12" fontSize="12" fill="#888">
                    {industry.name} ({industry.percentage}%)
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}

function PieChart({ data }: { data: { name: string; percentage: number; color: string }[] }) {
  let cumulativePercentage = 0

  return (
    <g transform="translate(120, 150)">
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
        const path = [`M 0 0`, `L ${startX} ${startY}`, `A 100 100 0 ${largeArcFlag} 1 ${endX} ${endY}`, `Z`].join(" ")

        return <path key={item.name} d={path} fill={item.color} stroke="white" strokeWidth="1" />
      })}
    </g>
  )
}

