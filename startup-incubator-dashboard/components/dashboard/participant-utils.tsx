import { GraduationCap, Briefcase, Code, Palette, TrendingUp, UserPlus } from "lucide-react"

export const getStatusColor = (status: any) => {
  switch (status) {
    case "accepted":
    case "confirmed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "refused":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getRoleIcon = (role: string) => {
  switch (role) {
    case "etudiant":
      return <GraduationCap className="h-4 w-4" />
    case "entrepreneur":
      return <Briefcase className="h-4 w-4" />
    case "developpeur":
      return <Code className="h-4 w-4" />
    case "designer":
      return <Palette className="h-4 w-4" />
    case "investisseur":
      return <TrendingUp className="h-4 w-4" />
    default:
      return <UserPlus className="h-4 w-4" />
  }
}

export const getRoleLabel = (role: string) => {
  switch (role) {
    case "etudiant":
      return "Étudiant"
    case "entrepreneur":
      return "Entrepreneur"
    case "developpeur":
      return "Développeur"
    case "designer":
      return "Designer"
    case "investisseur":
      return "Investisseur"
    default:
      return role
  }
}

export const getStatusLabel = (status: any) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refusé"
    case "confirmed":
      return "Confirmé"
    default:
      return status
  }
}

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}
