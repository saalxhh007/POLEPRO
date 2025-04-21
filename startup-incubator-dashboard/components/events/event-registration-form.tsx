"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface EventRegistrationFormProps {
  eventId: string
}

export function EventRegistrationForm({ eventId }: EventRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Récupérer les données du formulaire
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string

    // Simuler une soumission de formulaire
    try {
      // Dans une application réelle, vous enverriez les données à une API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simuler une mise à jour du dashboard
      console.log(
        `Inscription de ${name} (${email}) à l'événement ${eventId} - Cette action serait synchronisée avec le dashboard`,
      )

      setIsSuccess(true)
    } catch (err) {
      setError("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Inscription réussie!</AlertTitle>
          <AlertDescription className="text-green-700">
            Votre inscription a été confirmée. Vous recevrez un email avec tous les détails.
          </AlertDescription>
        </Alert>
        <Button variant="outline" className="w-full" onClick={() => setIsSuccess(false)}>
          Modifier mon inscription
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nom complet</Label>
        <Input id="name" name="name" placeholder="Votre nom et prénom" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="votre@email.com" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" name="phone" placeholder="Votre numéro de téléphone" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization">Organisation / Startup</Label>
        <Input id="organization" name="organization" placeholder="Nom de votre organisation" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expectations">Attentes particulières</Label>
        <Textarea
          id="expectations"
          name="expectations"
          placeholder="Qu'attendez-vous de cet événement?"
          className="resize-none"
        />
      </div>

      <div className="flex items-start space-x-2 pt-2">
        <Checkbox id="terms" required />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="terms" className="text-sm font-normal">
            J'accepte les conditions de participation et la politique de confidentialité
          </Label>
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox id="newsletter" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="newsletter" className="text-sm font-normal">
            Je souhaite recevoir la newsletter et les informations sur les prochains événements
          </Label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Inscription en cours..." : "S'inscrire à cet événement"}
      </Button>
    </form>
  )
}

