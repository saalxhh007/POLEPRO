"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import axios from "axios"
import toast from "react-hot-toast"

interface EditResourceModalProps {
  resource: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onResourceUpdated: () => void
}

export function EditResourceModal({ resource, open, onOpenChange, onResourceUpdated }: EditResourceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: "",
    location: "",
    availability: "available",
  })
  const [isLoading, setIsLoading] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name || "",
        type: resource.type || "",
        capacity: resource.capacity?.toString() || "",
        location: resource.location || "",
        availability: resource.availability || "available",
      })
    }
  }, [resource])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resource) return

    setIsLoading(true)
    try {
      const response = await axios.put(`${apiUrl}/api/resource/${resource.id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (response.data.success) {
        toast.success("Resource updated successfully")
        onResourceUpdated()
        onOpenChange(false)
      } else {
        console.log(response.data);
        
        toast.error("Failed To update resource")
      }
    } catch (error) {
      toast.error("Failed to update resource")
      console.error("Error updating resource:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
          <DialogDescription>Update the resource information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Resource Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter resource name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select resource type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting-room">Meeting Room</SelectItem>
                <SelectItem value="conference-room">Conference Room</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="workspace">Workspace</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => handleInputChange("capacity", e.target.value)}
              placeholder="Enter capacity"
              min="1"
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Enter location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Select value={formData.availability} onValueChange={(value) => handleInputChange("availability", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
