"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
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

export function ResourcesList() {
  const [searchQuery, setSearchQuery] = useState("")

  const resources = [
    {
      id: "1",
      name: "Conference Room A",
      type: "Meeting Space",
      capacity: "10 people",
      availability: "available",
      utilization: 65,
    },
    {
      id: "2",
      name: "Conference Room B",
      type: "Meeting Space",
      capacity: "20 people",
      availability: "booked",
      utilization: 80,
    },
    {
      id: "3",
      name: "Prototype Lab",
      type: "Workshop",
      capacity: "15 people",
      availability: "available",
      utilization: 45,
    },
    {
      id: "4",
      name: "Recording Studio",
      type: "Media",
      capacity: "5 people",
      availability: "booked",
      utilization: 90,
    },
    {
      id: "5",
      name: "Open Workspace",
      type: "Coworking",
      capacity: "50 people",
      availability: "available",
      utilization: 70,
    },
    {
      id: "6",
      name: "3D Printer",
      type: "Equipment",
      capacity: "N/A",
      availability: "available",
      utilization: 30,
    },
    {
      id: "7",
      name: "VR Development Kit",
      type: "Equipment",
      capacity: "N/A",
      availability: "booked",
      utilization: 85,
    },
  ]

  const filteredResources = resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
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
          <AddResourceForm />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Utilization</TableHead>
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
                      <div className="flex items-center gap-2">
                        <Progress value={resource.utilization} className="h-2 w-[60px]" />
                        <span className="text-xs text-muted-foreground">{resource.utilization}%</span>
                      </div>
                    </TableCell>
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
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit resource</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Book resource</DropdownMenuItem>
                          <DropdownMenuItem>View schedule</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Remove resource</DropdownMenuItem>
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
  )
}

