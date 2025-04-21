"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, AlertCircle } from "lucide-react"

export function UpcomingDeadlines() {
  const deadlines = [
    {
      id: "1",
      title: "Date limite de candidature - Cohorte Automne",
      date: "15 Juillet 2025",
      daysLeft: 5,
      priority: "high",
    },
    {
      id: "2",
      title: "Remise des rapports trimestriels",
      date: "30 Juin 2025",
      daysLeft: 0,
      priority: "high",
    },
    {
      id: "3",
      title: "Préparation Demo Day",
      date: "10 Juin 2025",
      daysLeft: -5,
      priority: "medium",
    },
    {
      id: "4",
      title: "Évaluation des startups",
      date: "20 Juin 2025",
      daysLeft: -10,
      priority: "medium",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Échéances Importantes</CardTitle>
        <CardDescription>Prochaines dates limites et événements critiques</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deadlines.map((deadline) => (
            <div
              key={deadline.id}
              className={`flex items-start space-x-4 rounded-md border p-3 ${
                deadline.daysLeft <= 0
                  ? "border-red-200 bg-red-50"
                  : deadline.daysLeft <= 7
                    ? "border-amber-200 bg-amber-50"
                    : "border-gray-200 bg-gray-50"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  deadline.daysLeft <= 0
                    ? "bg-red-100 text-red-600"
                    : deadline.daysLeft <= 7
                      ? "bg-amber-100 text-amber-600"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {deadline.daysLeft <= 0 ? <AlertCircle className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{deadline.title}</p>
                  <Badge
                    variant={deadline.daysLeft <= 0 ? "destructive" : deadline.daysLeft <= 7 ? "outline" : "secondary"}
                  >
                    {deadline.daysLeft <= 0
                      ? "Urgent"
                      : deadline.daysLeft <= 7
                        ? `${deadline.daysLeft} jours`
                        : "À venir"}
                  </Badge>
                </div>
                <div className="flex items-center pt-1">
                  <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{deadline.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm">
            Voir toutes les échéances
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

