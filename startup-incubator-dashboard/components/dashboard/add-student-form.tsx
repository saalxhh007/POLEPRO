"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"

interface FormData {
  id: string
  matricule: string
  email: string
  phone_number: string
  birth_date: Date | undefined
  gender: string
  last_name_ar: string
  first_name_ar: string
  Domain_ar: string
  option_ar: string
  diploma_ar: string
  faculty_code: string
  department_code: string
  password: string
}

interface AddStudentFormProps {
  onStudentAdded: () => void
}

const FACULTIES = [
  { code: "F5", id: 12, name: "Faculté de mathématiques et de l'informatique et des sciences de la matière" },
  { code: "F1", id: 8, name: " Faculté des sciences et de la technologie" },
  { code: "F2", id: 9, name: "Faculté des sciences économiques, commerciales et des sciences de gestion" },
  { code: "F3", id: 10, name: "Faculté de droit et des sciences politiques" },
  {
    code: "F4",
    id: 11,
    name: "Faculté des sciences de la nature et de la vie et sciences de la terre et de l'univers",
  },
  { code: "F6", id: 13, name: "Faculté des sciences humaines et sociales" },
  { code: "F7", id: 14, name: "Faculté des lettres et des langues " },
]

const departments = {
  "8": [
    { code: "02", name: "Génie des Procédés" },
    { code: "03", name: "Génie Mécanique" },
    { code: "04", name: "Génie Civil et Hydraulique" },
    { code: "06", name: "Génie Electrotechnique et automatique" },
    { code: "08", name: "Electronique et Télécommunications" },
    { code: "21", name: "Architecture" },
    { code: "26", name: "Sciences et Technologies" },
  ],
  "9": [
    { code: "10", name: "Sciences Economiques" },
    { code: "11", name: "Sciences de Gestion" },
    { code: "13", name: "Sciences Commerciales" },
  ],
  "10": [
    { code: "14", name: "Droit" },
    { code: "28", name: "Sciences Politiques" },
  ],
  "11": [
    { code: "09", name: "Biologie" },
    { code: "19", name: "Sciences de la Nature et de la Vie" },
    { code: "20", name: "Ecologie et Génie de l'Environnement" },
  ],
  "12": [
    { code: "01", name: "Mathématique" },
    { code: "07", name: "Informatique" },
    { code: "31", name: "Sciences de la Matière" },
  ],
  "13": [
    { code: "16", name: "Sociologie" },
    { code: "18", name: "Histoire" },
    { code: "22", name: "Psychologie" },
    { code: "23", name: "Philosophie" },
    { code: "24", name: "Archéologie" },
    { code: "25", name: "Sciences humaines" },
    { code: "27", name: "Sciences de l'information, de la communication et de bibliothéconomie" },
  ],
  "14": [
    { code: "15", name: "Lettres et Langue Anglaise" },
    { code: "17", name: "Langue et Littérature Arabe" },
    { code: "29", name: "Lettres et Langue Française" },
  ],
}

type FormErrors = {
  [key in keyof FormData]?: string
}
export function AddStudentForm({ onStudentAdded }: AddStudentFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  const [availableDepartments, setAvailableDepartments] = useState<{ code: string; name: string }[]>([])
  const [errors, setErrors] = useState<FormErrors>({})

  const [formData, setFormData] = useState<FormData>({
    id: "",
    matricule: "",
    email: "",
    phone_number: "",
    birth_date: undefined,
    gender: "",
    last_name_ar: "",
    first_name_ar: "",
    Domain_ar: "",
    option_ar: "",
    diploma_ar: "",
    faculty_code: "",
    department_code: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const toastId = toast.loading("Adding student...")

      const submitData = {
        ...formData,
        birth_date: formData.birth_date ? formData.birth_date.toISOString().split("T")[0] : undefined,
      }

      const response = await axios.post(`${apiUrl}/api/user/registerStudent`, submitData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (response.data.success) {
        toast.success("Student added successfully!", { id: toastId })
        setFormData({
          id: "",
          matricule: "",
          email: "",
          phone_number: "",
          birth_date: undefined,
          gender: "",
          last_name_ar: "",
          first_name_ar: "",
          Domain_ar: "",
          option_ar: "",
          diploma_ar: "",
          faculty_code: "",
          department_code: "",
          password: "",
        })
        setIsOpen(false)
        onStudentAdded()
      } else {
        toast.error("Failed to add student", { id: toastId })
      }
    } catch (error) {
      toast.error("Failed to add student")
      console.error("Error adding student:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === "birth_date") {
      setFormData((prev) => ({
        ...prev,
        [field]: value ? new Date(value) : undefined,
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Update departments when faculty changes
    if (name === "faculty_code") {
      setFormData((prev) => ({ ...prev, department_code: "" }))
      setAvailableDepartments(departments[value as keyof typeof departments] || [])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>Add a new student to the program. Fill in their details below.</DialogDescription>
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
                  value={formData.birth_date ? formData.birth_date.toISOString().split("T")[0] : ""}
                  onChange={(e) => handleInputChange("birth_date", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">Male</SelectItem>
                    <SelectItem value="f">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last_name_ar">Last Name (Arabic)</Label>
                <Input
                  id="last_name_ar"
                  value={formData.last_name_ar}
                  onChange={(e) => handleInputChange("last_name_ar", e.target.value)}
                  placeholder="Enter last name in Arabic"
                  required
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
                  placeholder="Enter first name in Arabic"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="Domain_ar">Domain (Arabic)</Label>
                <Input
                  id="Domain_ar"
                  value={formData.Domain_ar}
                  onChange={(e) => handleInputChange("Domain_ar", e.target.value)}
                  placeholder="Enter domain in Arabic"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="option_ar">Option (Arabic)</Label>
                <Input
                  id="option_ar"
                  value={formData.option_ar}
                  onChange={(e) => handleInputChange("option_ar", e.target.value)}
                  placeholder="Enter option in Arabic"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="diploma_ar">Diploma (Arabic)</Label>
                <Input
                  id="diploma_ar"
                  value={formData.diploma_ar}
                  onChange={(e) => handleInputChange("diploma_ar", e.target.value)}
                  placeholder="Enter diploma in Arabic"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faculty_code">
                  Faculté <span className="text-red-500">*</span>
                  </Label>
                <Select
                  value={formData.faculty_code}
                  onValueChange={(value) => handleSelectChange("faculty_code", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une faculté" />
                  </SelectTrigger>
                  <SelectContent>
                    {FACULTIES.map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.id.toString()}>
                        {faculty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.faculty_code && <p className="text-sm text-red-500">{errors.faculty_code}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department_code">
                  Département <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.department_code}
                  onValueChange={(value) => handleSelectChange("department_code", value)}
                  disabled={!formData.faculty_code}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDepartments.map((dept) => (
                      <SelectItem key={dept.code} value={dept.code}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department_code && <p className="text-sm text-red-500">{errors.department_code}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
