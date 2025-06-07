export interface Participant {
  id: string
  name: string
  email: string
  phone?: string
  role: "etudiant" | "entrepreneur" | "developpeur" | "designer" | "investisseur"
  organization?: string
  expectations?: string
  bio?: string
  expertise?: string
  status?: string
}

export interface PendingParticipant {
  id?: string
  name: string
  email: string
  phone?: string
  role: "etudiant" | "entrepreneur" | "developpeur" | "designer" | "investisseur"
  organization?: string
  expectations?: string
  bio?: string
  expertise?: string
  event_id: string
}

export interface ParticipantForm {
  name: string
  email: string
  phone: string
  role: string
  organization: string
  expectations: string
  bio: string
  expertise: string
  status: string
}
