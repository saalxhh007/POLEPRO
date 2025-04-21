"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Filter } from "lucide-react"
import { AddMentorForm } from "./add-mentor-form"

export function MentorsList() {
  // Use State Vars
  const [searchQuery, setSearchQuery] = useState("")
  const [mentors, setMentors] = useState<any[]>([])
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  // Searched Mentors
  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get All The Mentors
  const fetchMentors = async () => {
    const res = await fetch(`${apiUrl}/api/mentor/`)
    const data = await res.json()
    
    if (data.success) {
      setMentors(data.data)
    }
  }

  // Remove A Mentor
  const removeMentor = async (id: number) => {
    try {
      const res = await fetch(`${apiUrl}/api/mentor/${id}`, { method: "delete" })
      const data = await res.json()
      
      if (data.success) {
        alert("Mentor deleted successfully")
        fetchMentors()
      } else {
        alert("Failed to delete mentor")
    }
    } catch (error) {
      alert("Something went wrong")
    }
  }

  useEffect(() => {
    fetchMentors()
  },[])
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search mentors..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <AddMentorForm onMentorAdded={fetchMentors} />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Expertise</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Startups</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMentors.length > 0 ? (
                filteredMentors.map((mentor) => (
                  <TableRow key={mentor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={mentor.image} />
                          <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{mentor.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{mentor.expertise}</TableCell>
                    <TableCell>{mentor.company}</TableCell>
                    <TableCell>{mentor.startups}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Assign to startup</DropdownMenuItem>
                          <DropdownMenuItem>Schedule session</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={()=>removeMentor(mentor.id)}>Remove mentor</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No mentors found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

