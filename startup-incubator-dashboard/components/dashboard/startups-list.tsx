"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Filter } from "lucide-react"
import { StartupFormDialog } from "./add-startup-form"
import { StartupDetailsDialog } from "./startup-details-dialog"
import { EditStartupDialog } from "./edit-startup"
import { AssignMentorDialog } from "./assign-mentor-dialog"
import { ScheduleMeetingDialog } from "./schedule-meeting-dialog"
import axios from "axios"
import toast from "react-hot-toast"

export function StartupsList() {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [startups, setStartups] = useState<any[]>([])
  const [selectedStartup, setSelectedStartup] = useState<any>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [assignMentorDialogOpen, setAssignMentorDialogOpen] = useState(false)
  const [scheduleMeetingDialogOpen, setScheduleMeetingDialogOpen] = useState(false)

  const fetchStartups = async () => {

      axios.get(`${apiUrl}/api/startup/`)
        .then((response) => {
          if (response.data.success) {
            setStartups(response.data.data)
          }
          else {
            setStartups([])
          }
         })
      .catch((err)=>{
        console.error("Failed to fetch startups:", err)
      })
  }

  const filteredStartups = startups.filter(
    (startup) =>
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof startup.founders === "string" && startup.founders.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (Array.isArray(startup.founders) &&
        startup.founders.some((founder: string) => founder.toLowerCase().includes(searchQuery.toLowerCase()))),
  )

  const removeStartup = async (id: number) => {
      axios.delete(`${apiUrl}/api/startup/${id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          console.log(response.data);
          if (response.data.success) {
            
            toast.success("Startup Deleted successfully!");
            fetchStartups()
          }
          else {
            toast.error("Error removing startup!");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error removing startup!");
        })
  }

  const viewStartupDetails = (startup: any) => {
    setSelectedStartup(startup)
    setDetailsDialogOpen(true)
  }

  const editStartup = (startup: any) => {
    setSelectedStartup(startup)
    setEditDialogOpen(true)
  }

  const assignMentor = (startup: any) => {
    setSelectedStartup(startup)
    setAssignMentorDialogOpen(true)
  }

  const scheduleMeeting = (startup: any) => {
    setSelectedStartup(startup)
    setScheduleMeetingDialogOpen(true)
  }

  useEffect(() => {
    fetchStartups()
  }, [])

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search startups..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <StartupFormDialog fetchStartups={fetchStartups} />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Founders</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStartups.length > 0 ? (
                filteredStartups.map((startup) => (
                  <TableRow key={startup.id}>
                    <TableCell className="font-medium">{startup.name}</TableCell>
                    <TableCell>{startup.industry}</TableCell>
                    <TableCell>{startup.stage}</TableCell>
                    <TableCell>
                      {Array.isArray(startup.founders) ? startup.founders.join(", ") : startup.founders}
                    </TableCell>
                    <TableCell>{startup.join_date}</TableCell>
                    <TableCell>
                      <Badge variant={startup.status === "active" ? "default" : "destructive"}>
                        {startup.status === "active" ? "Active" : "Warning"}
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
                          <DropdownMenuItem onClick={() => viewStartupDetails(startup)}>View details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => editStartup(startup)}>Edit startup</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => assignMentor(startup)}>Assign mentor</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => scheduleMeeting(startup)}>Schedule meeting</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => removeStartup(startup.id)}
                            className="text-destructive"
                          >
                            Remove from program
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No startups found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {selectedStartup && (
        <>
          <StartupDetailsDialog
            startup={selectedStartup}
            open={detailsDialogOpen}
            onOpenChange={setDetailsDialogOpen}
          />
          <EditStartupDialog
            startup={selectedStartup}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSuccess={fetchStartups}
          />
          <AssignMentorDialog
            startup={selectedStartup}
            open={assignMentorDialogOpen}
            onOpenChange={setAssignMentorDialogOpen}
            onSuccess={fetchStartups}
          />
          <ScheduleMeetingDialog
            startup={selectedStartup}
            open={scheduleMeetingDialogOpen}
            onOpenChange={setScheduleMeetingDialogOpen}
            onSuccess={fetchStartups}
          />
        </>
      )}
    </Card>
  )
}
