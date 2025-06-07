"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"

interface EditStudentDialogProps {
  isOpen: boolean
  onClose: () => void
  student: any
  onUpdate: () => void
}

export function EditStudentDialog({ isOpen, onClose, student, onUpdate }: EditStudentDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  const [formData, setFormData] = useState({
    matricule: "",
    email: "",
    phone_number: "",
    birth_date: "",
    gender: "",
    last_name_ar: "",
    first_name_ar: "",
    Domain_ar: "",
    option_ar: "",
    diploma_ar: "",
    faculty_code: "",
    department_code: "",
  })

  useEffect(() => {
    if (student) {
      setFormData({
        matricule: student.matricule || "",
        email: student.email || "",
        phone_number: student.phone_number || "",
        birth_date: student.birth_date || "",
        gender: student.gender || "",
        last_name_ar: student.last_name_ar || "",
        first_name_ar: student.first_name_ar || "",
        Domain_ar: student.Domain_ar || "",
        option_ar: student.option_ar || "",
        diploma_ar: student.diploma_ar || "",
        faculty_code: student.faculty_code || "",
        department_code: student.department_code || "",
      })
    }
  }, [student])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const toastId = toast.loading("Updating student...")

      const response = await axios.put(`${apiUrl}/api/student/${student.id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (response.data.success) {
        toast.success("Student updated successfully!", { id: toastId })
        onClose()
        onUpdate()
      } else {
        toast.error("Failed to update student", { id: toastId })
      }
    } catch (error) {
      toast.error("Failed to update student")
      console.error("Error updating student:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>Update the student's information below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="matricule">Matricule</Label>
                <Input
                  id="matricule"
                  value={formData.matricule}
                  onChange={(e) => handleInputChange("matricule", e.target.value)}
                  placeholder="Enter matricule"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange("phone_number", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birth_date">Birth Date</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleInputChange("birth_date", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first_name_ar">First Name (Arabic)</Label>
                <Input
                  id="first_name_ar"
                  value={formData.first_name_ar}
                  onChange={(e) => handleInputChange("first_name_ar", e.target.value)}
                  placeholder="الاسم الأول"
                  required
                  dir="rtl"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last_name_ar">Last Name (Arabic)</Label>
                <Input
                  id="last_name_ar"
                  value={formData.last_name_ar}
                  onChange={(e) => handleInputChange("last_name_ar", e.target.value)}
                  placeholder="اسم العائلة"
                  required
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="Domain_ar">Domain (Arabic)</Label>
                <Input
                  id="Domain_ar"
                  value={formData.Domain_ar}
                  onChange={(e) => handleInputChange("Domain_ar", e.target.value)}
                  placeholder="المجال"
                  dir="rtl"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="option_ar">Option (Arabic)</Label>
                <Input
                  id="option_ar"
                  value={formData.option_ar}
                  onChange={(e) => handleInputChange("option_ar", e.target.value)}
                  placeholder="التخصص"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="diploma_ar">Diploma (Arabic)</Label>
              <Input
                id="diploma_ar"
                value={formData.diploma_ar}
                onChange={(e) => handleInputChange("diploma_ar", e.target.value)}
                placeholder="الشهادة"
                dir="rtl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="faculty_code">Faculty Code</Label>
                <Input
                  id="faculty_code"
                  value={formData.faculty_code}
                  onChange={(e) => handleInputChange("faculty_code", e.target.value)}
                  placeholder="Enter faculty code"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department_code">Department Code</Label>
                <Input
                  id="department_code"
                  value={formData.department_code}
                  onChange={(e) => handleInputChange("department_code", e.target.value)}
                  placeholder="Enter department code"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
