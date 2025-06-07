"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, User } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import axios from "axios"
import toast from "react-hot-toast"
import { format } from "date-fns"

interface ViewScheduleModalProps {
  resource: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewScheduleModal({ resource, open, onOpenChange }: ViewScheduleModalProps) {
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  const fetchSchedule = async () => {
    if (!resource) return

    setIsLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/api/resource/booking/${resource.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data.success) {
        setBookings(response.data.data)
      } else {
        toast.error("Failed to fetch schedule")
      }
    } catch (error) {
      toast.error("Failed to fetch schedule")
      console.error("Error fetching schedule:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open && resource) {
      fetchSchedule()
    }
  }, [open, resource])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-700"
      case "pending":
        return "bg-yellow-50 text-yellow-700"
      case "cancelled":
        return "bg-red-50 text-red-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule for {resource?.name}</DialogTitle>
          <DialogDescription>View all bookings and availability</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading schedule...</p>
            </div>
          ) : bookings.length > 0 ? (
            bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{booking.purpose}</CardTitle>
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(booking.start_date), "PPP")}
                      {booking.end_date &&
                        booking.end_date !== booking.start_date &&
                        ` - ${format(new Date(booking.end_date), "PPP")}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {booking.start_time} - {booking.end_time}
                    </span>
                  </div>

                  {booking.bookedBy && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Booked by {booking.bookedBy}</span>
                    </div>
                  )}

                  {booking.notes && (
                    <div className="text-sm">
                      <p className="font-medium">Notes:</p>
                      <p className="text-muted-foreground">{booking.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No bookings found for this resource.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
