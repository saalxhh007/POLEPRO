"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export function MentorAvailability() {
  const [mentors, setMentors] = useState<any[]>([])
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const fetchMentorAvailability = async () => {
    const res = await fetch(`${apiUrl}/api/mentor/available`)
    const data = await res.json()
    
    if (data.status) {
      setMentors(data.data)
      
    }
  }

  useEffect(() => {
    fetchMentorAvailability()
  },[])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentor Availability</CardTitle>
        <CardDescription>
          {mentors.filter((m) => m.availability === "available").length} mentors available now.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`${apiUrl}/${mentor.image}`} />
                  <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{mentor.name}</p>
                  <p className="text-sm text-muted-foreground">{mentor.expertise}</p>
                </div>
              </div>
              <Badge
                variant={mentor.availability === "available" ? "outline" : "secondary"}
                className={
                  mentor.availability === "available"
                    ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                    : ""
                }
              >
                {mentor.availability === "available" ? "Available" : "Busy"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

