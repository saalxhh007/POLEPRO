"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import toast from "react-hot-toast"

export function MentorAvailability() {
  const [mentors, setMentors] = useState<any[]>([])
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const fetchMentorAvailability = async () => {
    try {
    const response = await axios.get(`${apiUrl}/api/mentor/check/available`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (response.data.success) {
      const availableMentors = response.data.data;

      if (availableMentors.length === 0) {
        toast.error("No mentors are available right now");
      } else {
        setMentors(availableMentors);
      }
    } else {
      toast.error("Something went wrong");
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch mentors");
  }
};


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

