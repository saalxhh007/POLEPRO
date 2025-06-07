"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import axios from "axios"
import toast from "react-hot-toast"

interface BookResourceModalProps {
  resource: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onBookingCreated: () => void
}

export function BookResourceModal({ resource, open, onOpenChange, onBookingCreated }: BookResourceModalProps) {
  const [formData, setFormData] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    startTime: "",
    endTime: "",
    purpose: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resource || !formData.startDate || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      const bookingData = {
        start_date: formData.startDate,
        end_date: formData.endDate || formData.startDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
        purpose: formData.purpose,
        notes: formData.notes,
      }
      
      const response = await axios.post(`${apiUrl}/api/resource/booking/${resource.id}`, bookingData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data.success) {
        toast.success("Resource booked successfully")
        onBookingCreated()
        onOpenChange(false)
        setFormData({
          startDate: undefined,
          endDate: undefined,
          startTime: "",
          endTime: "",
          purpose: "",
          notes: "",
        })
      } else {
        toast.error("Failed to book resource")
      }
    } catch (error) {
      toast.error("Failed to book resource")
      console.error("Error booking resource:", error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Resource</DialogTitle>
          <DialogDescription>Book {resource?.name} for your event or meeting</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : "Same day"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, endDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              value={formData.purpose}
              onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
              placeholder="Meeting, training, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Any special requirements or notes"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Booking..." : "Book Resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
