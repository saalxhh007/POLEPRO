"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

interface EditStartupDialogProps {
  startup: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const STAGES = ["Ideation", "Validation", "Early Development", "Growth", "Scaling"]

export function EditStartupDialog({ startup, open, onOpenChange, onSuccess }: EditStartupDialogProps) {
  const { toast } = useToast()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [isSubmitting, setIsSubmitting] = useState(false)
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    stage: undefined,
    join_date: "",
    status: "active",
    progress: 0,
    team_id: "",
    idea_stage: "",
    idea: "",
    description: "",
    innovation: "",
    target_customers: "",
    sector: "",
    originality: "",
    other_details: "",
    business_model: "",
    supervisor_name: "",
    submission_date: "",
    modified_date: "",
    is_final: false,
    in_pole: false,
    approved_by_dean: false,
    faculty_code: "",
    advisor_id: "",
    idea_origin: "",
  })

  // Initialize form with startup data when dialog opens
  useEffect(() => {
    if (startup && open) {
      setFormData({
        name: startup.name || "",
        industry: startup.industry || "",
        stage: startup.stage || "",
        join_date: startup.join_date || "",
        status: startup.status || "active",
        progress: startup.progress || 0,
        team_id: startup.team_id?.toString() || "",
        idea_stage: startup.idea_stage || "",
        idea: startup.idea || "",
        description: startup.description || "",
        innovation: startup.innovation || "",
        target_customers: startup.target_customers || "",
        sector: startup.sector || "",
        originality: startup.originality || "",
        other_details: startup.other_details || "",
        business_model: startup.business_model || "",
        supervisor_name: startup.supervisor_name || "",
        submission_date: startup.submission_date || "",
        modified_date: startup.modified_date || "",
        is_final: startup.is_final || false,
        in_pole: startup.in_pole || false,
        approved_by_dean: startup.approved_by_dean || false,
        faculty_code: startup.faculty_code || "",
        advisor_id: startup.advisor_id?.toString() || "",
        idea_origin: startup.idea_origin || "",
      })
    }
  }, [startup, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const apiData = {
      ...formData,
      progress: formData.progress ? (formData.progress) : undefined,
      team_id: formData.team_id ? parseInt(formData.team_id) : undefined,
      advisor_id: formData.advisor_id ? parseInt(formData.advisor_id) : undefined,
    }

    axios.put(`${apiUrl}/api/startup/${startup.id}`, apiData, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        if (response.data.success) {
          toast({
            title: "Success",
            description: "Startup updated successfully",
          })
          onOpenChange(false)
          onSuccess()
        }
        else {
          toast({
            title: "Error",
            description: "An unexpected error occurred",
            variant: "destructive",
          })
        }
      })
      .catch((err) => {
        console.error("Error updating startup:", err)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Startup: {startup?.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Startup Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2"><Label htmlFor="progress">Industry</Label>
              <Input
                id="progress"
                name="progress"
                type="number"
                min="0"
                max="100"
                placeholder="Enter progress percentage"
                value={formData.progress}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="stage">Stage</Label>
              <Select
                value={formData.stage}
                onValueChange={(value) => handleSelectChange("stage", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Startup"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
