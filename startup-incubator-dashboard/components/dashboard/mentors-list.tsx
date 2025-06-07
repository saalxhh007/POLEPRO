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
import { AssignStartupDialog } from "./assign-startup-dialog"
import { AddMentorForm } from "./add-mentor-form"
import { EditMentorDialog } from "./edit-mentor-dialog"
import { MentorProfileDialog } from "./mentor-profile-dialog"
import axios from "axios"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

const ScheduleSessionDialog = ({ isOpen, onClose, mentor }: any) => null

export function MentorsList() {
  // Use State Vars
  const [searchQuery, setSearchQuery] = useState("")
  const [mentors, setMentors] = useState<any[]>([])
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  // Dialog states
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)

  // Searched Mentors
  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get All The Mentors
  const fetchMentors = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/mentor/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data.success) {
        setMentors(response.data.data)
      } else {
        toast.error("Failed To Fetch Mentors")
      }
    } catch (error) {
      toast.error("Failed To Fetch Mentors")
      console.error("Error fetching mentors:", error)
    }
  }

  // Remove A Mentor
  const removeMentor = async (id: number) => {
    try {
      const toastId = toast.loading("Deleting Mentor ...")

      const response = await axios.delete(`${apiUrl}/api/mentor/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data.success) {
        toast.success("Mentor deleted successfully!", { id: toastId })
        fetchMentors()
      } else {
        toast.error("Failed to delete mentor", { id: toastId })
      }
    } catch (error) {
      toast.error("Failed to delete mentor")
      console.error("Error deleting mentor:", error)
    }
  }

  // Handle dialog actions
  const handleScheduleSession = (mentor: any) => {
    setSelectedMentor(mentor)
    setIsScheduleDialogOpen(true)
  }

  const handleAssignStartup = (mentor: any) => {
    setSelectedMentor(mentor)
    setIsAssignDialogOpen(true)
  }

  const handleEditDetails = (mentor: any) => {
    setSelectedMentor(mentor)
    setIsEditDialogOpen(true)
  }

  const handleViewProfile = (mentor: any) => {
    setSelectedMentor(mentor)
    setIsProfileDialogOpen(true)
  }

  // Handle updates
  const handleSessionScheduled = () => {
    fetchMentors()
  }

  const handleStartupAssigned = () => {
    fetchMentors()
  }

  const handleMentorUpdated = () => {
    fetchMentors()
  }

  useEffect(() => {
    fetchMentors()
  }, [])

  return (
    <>
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
                            <AvatarImage src={`${apiUrl}/storage/${mentor.image}`} alt={mentor.name} />
                            <AvatarFallback>
                              {mentor.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
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
                            <DropdownMenuItem onClick={() => handleViewProfile(mentor)}>View profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditDetails(mentor)}>Edit details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleAssignStartup(mentor)}>
                              Assign to startup
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleScheduleSession(mentor)}>
                              Schedule session
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => removeMentor(mentor.id)}>
                              Remove mentor
                            </DropdownMenuItem>
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

      {selectedMentor && (
        <>
          <EditMentorDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            mentor={selectedMentor}
            onUpdate={handleMentorUpdated}
          />

          <MentorProfileDialog
            isOpen={isProfileDialogOpen}
            onClose={() => setIsProfileDialogOpen(false)}
            mentor={selectedMentor}
          />

          <AssignStartupDialog
            fetchMentors={fetchMentors}
            isOpen={isAssignDialogOpen}
            onClose={() => setIsAssignDialogOpen(false)}
            mentor={selectedMentor}
          />

          <ScheduleSessionDialog
            isOpen={isScheduleDialogOpen}
            onClose={() => setIsScheduleDialogOpen(false)}
            mentor={selectedMentor}
            onScheduled={handleSessionScheduled}
          />
        </>
      )}
    </>
  )
}
