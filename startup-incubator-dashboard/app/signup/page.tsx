"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import axios from "axios"
import toast from "react-hot-toast"

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

type FormData = {
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
  confirmPassword: string
  idea: string
  team_name: string
  number_of_members: number
}

type FormErrors = {
  [key in keyof FormData]?: string
}

export default function SignupPage() {
  const router = useRouter()
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
    confirmPassword: "",
    idea: "",
    team_name: "",
    number_of_members: 0
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [availableDepartments, setAvailableDepartments] = useState<{ code: string; name: string }[]>([])

  const searchParams = useSearchParams()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const decodeToken = (token: any) => {
    axios
      .post(`${apiUrl}/api/user/decrypt-token-form`, { token })
      .then((response) => {
        if (response.data.success) {
          
          const student = response.data.student

          setFormData((prev) => ({
            ...prev,
            matricule: student.matricule,
            email: student.email,
            first_name_ar: student.first_name_ar,
            last_name_ar: student.last_name_ar,
            idea: student.idea,
            team_name: student.name,
            number_of_members: student.number_of_members,
            id: student.id
          }))
        } else {
          setGeneralError("Erreur lors du décodage du token. Veuillez réessayer.")
          return null
        }
      })
      .catch((err) => {
        return null
      })
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Matricule validation
    if (!formData.matricule) {
      newErrors.matricule = "Le matricule est requis"
    } else if (formData.matricule.length !== 12) {
      newErrors.matricule = "Le matricule doit contenir exactement 12 caractères"
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide"
    }

    // Phone validation
    if (!formData.phone_number) {
      newErrors.phone_number = "Le numéro de téléphone est requis"
    }

    // Birth date validation
    if (!formData.birth_date) {
      newErrors.birth_date = "La date de naissance est requise"
    } else {
      const birthYear = formData.birth_date.getFullYear();
      if (birthYear >= 2005) {
        newErrors.birth_date = "La date de naissance doit être avant 2005";
      }
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Le genre est requis"
    }

    if (!formData.last_name_ar) {
      newErrors.last_name_ar = "Le nom est requis"
    }

    if (!formData.first_name_ar) {
      newErrors.first_name_ar = "Le prénom est requis"
    }

    if (!formData.Domain_ar) {
      newErrors.Domain_ar = "Le domaine est requis"
    }

    if (!formData.option_ar) {
      newErrors.option_ar = "L'option est requise"
    }

    if (!formData.diploma_ar) {
      newErrors.diploma_ar = "Le diplôme est requis"
    }

    // Faculty and department validation
    if (!formData.faculty_code) {
      newErrors.faculty_code = "La faculté est requise"
    }

    if (!formData.department_code) {
      newErrors.department_code = "Le département est requis"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis"
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères"
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins une majuscule"
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins un chiffre"
    } else if (!/[@$!%*?&]/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)"
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    }

    if (!formData.idea) {
      newErrors.idea = "L'idée est requise"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Update departments when faculty changes
    if (name === "faculty_code") {
      setFormData((prev) => ({ ...prev, department_code: "" }))
      setAvailableDepartments(departments[value as keyof typeof departments] || [])
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, birth_date: date }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)

    if (!validateForm()) {
      return
    }

    const { id, ...dataToSend } = formData;
    
    setIsLoading(true)
    axios.post(`${apiUrl}/api/user/student/register/${id}`, dataToSend )
      .then(response => {
        toast.success("Account Created Successfully, Try Login")
          router.push("/login")
       })
      .catch(err => {
        toast.error("Failed To Create An Account")
      })
    .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    const token = searchParams.get("token")
    decodeToken(token)
  }, [searchParams])
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/thumbnail-aFlPs5tpcKuHWq8kmfEaQrc1JWZmnB.png"
                alt="Logo Université de Guelma"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <div className="h-6 w-px bg-muted" />
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20incubqteur-NWDtZ5DEtRRBOfP3FkY6RPl6pbjfTe.png"
                alt="Logo Incubateur"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Tabs defaultValue="fr" className="w-[180px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="fr">FR</TabsTrigger>
                <TabsTrigger value="ar">عربي</TabsTrigger>
                <TabsTrigger value="en">EN</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      {/* Registration Form */}
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Inscription</CardTitle>
              <CardDescription className="text-center">
                Créez votre compte pour accéder à l'incubateur BAG Services
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generalError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="matricule">
                        Matricule <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="matricule"
                        name="matricule"
                        value={formData.matricule}
                        onChange={handleInputChange}
                        placeholder="12345678"
                        maxLength={8}
                        disabled
                      />
                      {errors.matricule && <p className="text-sm text-red-500">{errors.matricule}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input value={formData.email} id="email" name="email" type="email" disabled />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone_number">
                        Numéro de téléphone <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="+213 123456789"
                      />
                      {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birth_date">
                        Date de naissance <span className="text-red-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              !formData.birth_date && "text-muted-foreground"
                            }`}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {formData.birth_date ? (
                              format(formData.birth_date, "dd MMMM yyyy", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={formData.birth_date}
                            onSelect={handleDateChange}
                            initialFocus
                            fromYear={1950}
                            toYear={2010}
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.birth_date && <p className="text-sm text-red-500">{errors.birth_date}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Genre <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup
                        value={formData.gender}
                        onValueChange={(value) => handleSelectChange("gender", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="m" id="gender-m" />
                          <Label htmlFor="gender-m" className="cursor-pointer">
                            Masculin
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="f" id="gender-f" />
                          <Label htmlFor="gender-f" className="cursor-pointer">
                            Féminin
                          </Label>
                        </div>
                      </RadioGroup>
                      {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                    </div>
                  </div>
                </div>

                {/* Arabic Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Informations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="last_name_ar">Nom</Label>
                      <Input
                        id="last_name_ar"
                        name="last_name_ar"
                        value={formData.last_name_ar}
                        onChange={handleInputChange}
                        dir="rtl"
                        lang="ar"
                        disabled
                      />
                      {errors.last_name_ar && <p className="text-sm text-red-500">{errors.last_name_ar}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="first_name_ar">Prénom</Label>
                      <Input
                        id="first_name_ar"
                        name="first_name_ar"
                        value={formData.first_name_ar}
                        onChange={handleInputChange}
                        dir="rtl"
                        lang="ar"
                        disabled
                      />
                      {errors.first_name_ar && <p className="text-sm text-red-500">{errors.first_name_ar}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="team_name">Team Name</Label>
                      <Input
                        id="team_name"
                        name="team_name"
                        value={formData.team_name}
                        onChange={handleInputChange}
                        dir="rtl"
                        lang="ar"
                        disabled
                      />
                      {errors.team_name && <p className="text-sm text-red-500">{errors.team_name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="number_of_members">Number of Members</Label>
                      <Input
                        id="number_of_members"
                        name="number_of_members"
                        value={formData.number_of_members}
                        onChange={handleInputChange}
                        type="number"
                      />
                      {errors.number_of_members && <p className="text-sm text-red-500">{errors.number_of_members}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="Domain_ar">
                        Domaine<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="Domain_ar"
                        name="Domain_ar"
                        value={formData.Domain_ar}
                        onChange={handleInputChange}
                        dir="rtl"
                        lang="ar"
                      />
                      {errors.Domain_ar && <p className="text-sm text-red-500">{errors.Domain_ar}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="option_ar">
                        Option<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="option_ar"
                        name="option_ar"
                        value={formData.option_ar}
                        onChange={handleInputChange}
                        dir="rtl"
                        lang="ar"
                      />
                      {errors.option_ar && <p className="text-sm text-red-500">{errors.option_ar}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="diploma_ar">
                        Diplôme<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="diploma_ar"
                        name="diploma_ar"
                        value={formData.diploma_ar}
                        onChange={handleInputChange}
                        dir="rtl"
                        lang="ar"
                      />
                      {errors.diploma_ar && <p className="text-sm text-red-500">{errors.diploma_ar}</p>}
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Informations académiques</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                {/* Project Idea */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Idée de projet</h3>
                  <div className="space-y-2">
                    <Label htmlFor="idea">
                      Votre idée de projet <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id="idea"
                      name="idea"
                      value={formData.idea}
                      onChange={(e) => setFormData((prev) => ({ ...prev, idea: e.target.value }))}
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Décrivez votre idée de projet en quelques phrases..."
                      disabled
                    />
                    {errors.idea && <p className="text-sm text-red-500">{errors.idea}</p>}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Sécurité</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        Mot de passe <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                      <p className="text-xs text-muted-foreground">
                        Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère
                        spécial (@$!%*?&)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirmer le mot de passe <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                      {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Inscription en cours..." : "S'inscrire"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <p className="text-center text-sm text-muted-foreground">
                Vous avez déjà un compte?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Se connecter
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; 2025 BAG Services. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Conditions d'utilisation
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
