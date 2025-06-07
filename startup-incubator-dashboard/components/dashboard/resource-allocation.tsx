"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RootState } from "@/store"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"

export function ResourceAllocation() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const [resources, setResources] = useState<any[]>([])
  

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/resource/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (response.data.success) {
        setResources(response.data.data)
      } else {
        toast.error("Failed To Fetch Resources")
      }
    } catch (error) {
      toast.error("Failed To Fetch Resources")
      console.error("Error fetching Resources:", error)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])
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
                  {1}/{resource.capacity} {resource.capacity}
                </p>
              </div>
              <Progress value={0} max={resource.capacity} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

