"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from "axios"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"
import { z } from "zod"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface EventRegistrationFormProps {
  eventId: number | undefined
}

export function EventRegistrationForm({ eventId }: EventRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState<string>("")
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const ROLES = ["etudiant", "entrepreneur", "developpeur", "designer", "investisseur", "intervenant"]

  const participantSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().optional(),
    role: z.string(),
    organization: z.string().optional(),
    expectations: z.string().optional(),
  })

  type ParticipantValues = z.infer<typeof participantSchema>

  const form = useForm<ParticipantValues>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      organization: "",
      expectations: "",
    },
  })

  async function onSubmit(data: ParticipantValues) {
    setIsSubmitting(true)
    setError(null)

    const toastId = toast.loading("Inscription en cours...")
    const submissionData = eventId ? { ...data, event_id: eventId } : data;
    
    axios.post(`${apiUrl}/api/participant/submit-form`, submissionData)
      .then(() => {
        toast.success("Inscription réussie!", { id: toastId })
        setIsSuccess(true)
        form.reset()
      })
      .catch((error) => {
        setIsSuccess(false)
        form.reset()
        console.error("Error submitting form:", error)
      })
      .finally(() => {
        setIsSubmitting(false)
      }) 
  }

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Inscription réussie!</AlertTitle>
          <AlertDescription className="text-green-700">
            Votre inscription a été envoyée. Vous recevrez un email avec tous les détails.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input id="name" {...form.register("name")} type="text" placeholder="Votre nom" required />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...form.register("email")} type="email" placeholder="Votre email" />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" {...form.register("phone")} placeholder="Votre numéro de téléphone" />
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={(value) => {
                    setRole(value)
                    field.onChange(value)
                  }}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre rôle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization">Organisation / Startup</Label>
          <Input id="organization" {...form.register("organization")} placeholder="Nom de votre organisation" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectations">Attentes particulières</Label>
          <Textarea
            id="expectations"
            {...form.register("expectations")}
            placeholder="Qu'attendez-vous de cet événement?"
            className="resize-none"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Inscription en cours..." : "S'inscrire à cet événement"}
        </Button>
      </form>
    </FormProvider>
  )
}
