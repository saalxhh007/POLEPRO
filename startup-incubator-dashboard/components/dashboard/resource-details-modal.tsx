"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, MapPin, Clock } from "lucide-react"

interface ResourceDetailsModalProps {
  resource: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResourceDetailsModal({ resource, open, onOpenChange }: ResourceDetailsModalProps) {
  if (!resource) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{resource.name}</DialogTitle>
          <DialogDescription>Resource details and information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge
              variant={resource.availability === "available" ? "outline" : "secondary"}
              className={resource.availability === "available" ? "bg-green-50 text-green-700" : ""}
            >
              {resource.availability === "available" ? "Available" : "Booked"}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Type</p>
                <p className="text-sm text-muted-foreground">{resource.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Capacity</p>
                <p className="text-sm text-muted-foreground">{resource.capacity} people</p>
              </div>
            </div>

            {resource.location && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{resource.location}</p>
                </div>
              </div>
            )}

            {resource.description && (
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
              </div>
            )}
          </div>

          {resource.amenities && resource.amenities.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Amenities</p>
                <div className="flex flex-wrap gap-1">
                  {resource.amenities.map((amenity: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
