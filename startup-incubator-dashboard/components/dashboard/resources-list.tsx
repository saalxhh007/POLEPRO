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
import { AddResourceForm } from "./add-resource-form"
import { ResourceDetailsModal } from "./resource-details-modal"
import { EditResourceModal } from "./edit-resource-modal"
import { BookResourceModal } from "./book-resource-modal"
import { ViewScheduleModal } from "./view-schedule-modal"
import { DeleteResourceDialog } from "./delete-resource-dialog"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import axios from "axios"
import toast from "react-hot-toast"

export function ResourcesList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [resources, setResources] = useState<any[]>([])
  const [selectedResource, setSelectedResource] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showBookModal, setShowBookModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  const filteredResources = resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

  const handleViewDetails = (resource: any) => {
    setSelectedResource(resource)
    setShowDetailsModal(true)
  }

  const handleEditResource = (resource: any) => {
    setSelectedResource(resource)
    setShowEditModal(true)
  }

  const handleBookResource = (resource: any) => {
    setSelectedResource(resource)
    setShowBookModal(true)
  }

  const handleViewSchedule = (resource: any) => {
    setSelectedResource(resource)
    setShowScheduleModal(true)
  }

  const handleDeleteResource = (resource: any) => {
    setSelectedResource(resource)
    setShowDeleteDialog(true)
  }

  const confirmDeleteResource = async () => {
    if (!selectedResource) return

    try {
      const response = await axios.delete(`${apiUrl}/api/resource/${selectedResource.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data.success) {
        toast.success("Resource deleted successfully")
        fetchResources()
        setShowDeleteDialog(false)
        setSelectedResource(null)
      } else {
        toast.error("Failed to delete resource")
      }
    } catch (error) {
      toast.error("Failed to delete resource")
      console.error("Error deleting resource:", error)
    }
  }

  useEffect(() => {
    fetchResources()
  }, []) // Removed resources from dependency array to prevent infinite loop

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
                  placeholder="Search resources..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <AddResourceForm fetchResources={fetchResources} />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">{resource.name}</TableCell>
                      <TableCell>{resource.type}</TableCell>
                      <TableCell>{resource.capacity}</TableCell>
                      <TableCell>
                        <Badge
                          variant={resource.availability === "available" ? "outline" : "secondary"}
                          className={
                            resource.availability === "available"
                              ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                              : ""
                          }
                        >
                          {resource.availability === "available" ? "Available" : "Booked"}
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
                            <DropdownMenuItem onClick={() => handleViewDetails(resource)}>
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditResource(resource)}>
                              Edit resource
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleBookResource(resource)}>
                              Book resource
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewSchedule(resource)}>
                              View schedule
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteResource(resource)}
                            >
                              Remove resource
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No resources found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals and Dialogs */}
      <ResourceDetailsModal resource={selectedResource} open={showDetailsModal} onOpenChange={setShowDetailsModal} />

      <EditResourceModal
        resource={selectedResource}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onResourceUpdated={fetchResources}
      />

      <BookResourceModal
        resource={selectedResource}
        open={showBookModal}
        onOpenChange={setShowBookModal}
        onBookingCreated={fetchResources}
      />

      <ViewScheduleModal resource={selectedResource} open={showScheduleModal} onOpenChange={setShowScheduleModal} />

      <DeleteResourceDialog
        resource={selectedResource}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDeleteResource}
      />
    </>
  )
}
