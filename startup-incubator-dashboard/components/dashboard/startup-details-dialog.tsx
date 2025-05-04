"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, TrendingUp, CalendarIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import axios from "axios"
import { useEffect, useState } from "react"

interface StartupDetailsDialogProps {
  startup: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StartupDetailsDialog({ startup, open, onOpenChange }: StartupDetailsDialogProps) {
  if (!startup) return null
  const [founders, setFounders] = useState<any[]>([])
  // /team/{id}/founders
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const fetchFounders = () => {
    axios
      .get(`${apiUrl}/api/team/${startup.team_id}/founders`)
      .then(response => {
        setFounders(response.data.founders)
        console.log(response.data.founders);
       })
      .catch(err => {
        console.log(err);
        
      })
  }
  useEffect(() => {
    fetchFounders()
  }, [])
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{startup.name}</DialogTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={startup.status === "active" ? "default" : "destructive"}>
              {startup.status === "active" ? "Active" : "Warning"}
            </Badge>
            <span className="text-sm text-muted-foreground">ID: {startup.project_id}</span>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Company Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Industry</p>
                <p className="font-medium">{startup.industry}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Stage</p>
                <p className="font-medium">{startup.stage}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Join Date</p>
                <p className="font-medium">{startup.join_date}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Website</p>
                <p className="font-medium">
                  {startup.website ? (
                    <a
                      href={startup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {startup.website}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" /> Founders
            </h3>
            <div className="text-sm">
              <p className="font-medium">
                {founders.length > 0 ? founders.join(", ") : "No founders available"}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Metrics & Progress
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Funding Raised</p>
                <p className="font-medium">
                  {startup.funding_raised ? `$${startup.funding_raised.toLocaleString()}` : "Not available"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Team Size</p>
                <p className="font-medium">{startup.team_size || "Not available"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Monthly Revenue</p>
                <p className="font-medium">
                  {startup.monthly_revenue ? `$${startup.monthly_revenue.toLocaleString()}` : "Not available"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Users/Customers</p>
                <p className="font-medium">
                  {startup.users_count ? startup.users_count.toLocaleString() : "Not available"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3">
            <h3 className="font-semibold flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" /> Program Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Assigned Mentor</p>
                <p className="font-medium">{startup.mentor || "Not assigned"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Next Meeting</p>
                <p className="font-medium">{startup.next_meeting || "Not scheduled"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>Edit Startup</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
