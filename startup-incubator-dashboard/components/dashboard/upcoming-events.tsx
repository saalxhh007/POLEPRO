"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import { useEffect, useState } from "react"

export function UpcomingEvents() {
  const [events, setEvents] = useState<any[]>([])
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const fetchUpcommingEvents = async () => {
    const res = await fetch(`${apiUrl}/api/event/upcoming`)
    const data = await res.json()
    
    if (data.status) {
      setEvents(data.data)
    }
  }

  useEffect(() => {
    fetchUpcommingEvents()
    
  },[])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>You have {events.length} events scheduled.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{event.title}</p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
                <div className="flex items-center pt-1">
                  <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

