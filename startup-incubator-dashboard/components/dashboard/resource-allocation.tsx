"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function ResourceAllocation() {
  const resources = [
    {
      id: "1",
      name: "Office Space",
      used: 85,
      total: 100,
      unit: "desks",
    },
    {
      id: "2",
      name: "Meeting Rooms",
      used: 60,
      total: 100,
      unit: "hours/week",
    },
    {
      id: "3",
      name: "Equipment",
      used: 40,
      total: 100,
      unit: "items",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Allocation</CardTitle>
        <CardDescription>Current resource utilization.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {resources.map((resource) => (
            <div key={resource.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">{resource.name}</p>
                <p className="text-sm text-muted-foreground">
                  {resource.used}/{resource.total} {resource.unit}
                </p>
              </div>
              <Progress value={resource.used} max={resource.total} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

