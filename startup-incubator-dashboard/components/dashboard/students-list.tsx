"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { MoreHorizontal, Search, Filter, Users } from "lucide-react"
import { AddStudentForm } from "./add-student-form"
import { EditStudentDialog } from "./edit-student-dialog"
import { StudentProfileDialog } from "./student-profile-dialog"
import { AssignProjectDialog } from "./assign-project-dialog"
import axios from "axios"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"

export function StudentsList() {
  // Use State Vars
  const [searchQuery, setSearchQuery] = useState("")
  const [students, setStudents] = useState<any[]>([])
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  // Dialog states
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isAssignProjectDialogOpen, setIsAssignProjectDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)

  // Searched Students
  const filteredStudents = students.filter(
    (student) =>
      student.matricule?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.first_name_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.last_name_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.Domain_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.option_ar?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get All The Students
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/user/all-students/`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data.success) {
        setStudents(response.data.data)
      } else {
        toast.error("Failed To Fetch Students")
      }
    } catch (error) {
      toast.error(`${error}`)
      console.error("Error fetching students:", error)
    }
  }

  // Remove A Student
  const removeStudent = async (id: number) => {
    try {
      const toastId = toast.loading("Removing Student ...")

      const response = await axios.delete(`${apiUrl}/api/user/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data.success) {
        toast.success("Student removed successfully!", { id: toastId })
        fetchStudents()
      } else {
        toast.error("Failed to remove student", { id: toastId })
      }
    } catch (error) {
      toast.error("Failed to remove student")
      console.error("Error removing student:", error)
    }
  }

  const handleAssignProject = (student: any) => {
    setSelectedStudent(student)
    setIsAssignProjectDialogOpen(true)
  }

  const handleEditDetails = (student: any) => {
    setSelectedStudent(student)
    setIsEditDialogOpen(true)
  }

  const handleViewProfile = (student: any) => {
    setSelectedStudent(student)
    setIsProfileDialogOpen(true)
  }

  const handleProjectAssigned = () => {
    fetchStudents()
  }

  const handleStudentUpdated = () => {
    fetchStudents()
  }

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "graduated":
        return "secondary"
      case "on-hold":
        return "outline"
      case "dropped":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
      case "graduated":
        return "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700"
      case "on-hold":
        return "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-700"
      case "dropped":
        return "bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700"
      default:
        return ""
    }
  }

  useEffect(() => {
    fetchStudents()
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
                  placeholder="Search students..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <AddStudentForm onStudentAdded={fetchStudents} />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Option</TableHead>
                  <TableHead>Diploma</TableHead>
                  <TableHead>Startup</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`${apiUrl}/storage/${student.image}`}
                              alt={`${student.first_name_ar} ${student.last_name_ar}`}
                            />
                            <AvatarFallback>
                              {student.first_name_ar
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {student.first_name_ar} {student.last_name_ar}
                            </div>
                            <div className="text-sm text-muted-foreground">{student.matricule}</div>
                            <div className="text-sm text-muted-foreground">{student.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.Domain_ar}</TableCell>
                      <TableCell>{student.option_ar}</TableCell>
                      <TableCell>{student.diploma_ar}</TableCell>
                      <TableCell>{student.startup_name ? student.startup_name : "N/A"}</TableCell>
                      <TableCell>{student.gender === "m" ? "Male" : "Female"}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewProfile(student)}>View profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditDetails(student)}>Edit details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={student.startup_name !== "No Startup" ? () => { } : () => handleAssignProject(student)}
                              disabled={student.startup_name !== "No Startup"} >
                              Assign project
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => removeStudent(student.id)}>
                              Remove student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedStudent && (
        <>
          <EditStudentDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            student={selectedStudent}
            onUpdate={handleStudentUpdated}
          />

          <StudentProfileDialog
            isOpen={isProfileDialogOpen}
            onClose={() => setIsProfileDialogOpen(false)}
            student={selectedStudent}
          />

          <AssignProjectDialog
            isOpen={isAssignProjectDialogOpen}
            onClose={() => setIsAssignProjectDialogOpen(false)}
            student={selectedStudent}
            onAssigned={handleProjectAssigned}
          />
        </>
      )}
    </>
  )
}
