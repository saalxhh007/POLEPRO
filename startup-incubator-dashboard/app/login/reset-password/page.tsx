"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import api from "@/lib/axios"
import toast from "react-hot-toast"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Send password reset request to your API
      const response = await api.post(
        `${apiUrl}/api/user/reset-password`,
        { email },
        {
          withCredentials: true,
        },
      )

      if (response.data.success) {
        setSuccess(true)
        toast.success("Instructions de réinitialisation envoyées")
      } else {
        setError("Impossible d'envoyer l'email de réinitialisation")
        toast.error("Échec de l'envoi des instructions")
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.")
      toast.error("Échec de la réinitialisation")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

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

      {/* Reset Password Form */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 md:px-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Réinitialisation du mot de passe</CardTitle>
            <CardDescription className="text-center">
              {!success
                ? "Entrez votre adresse email pour recevoir les instructions de réinitialisation"
                : "Vérifiez votre boîte de réception pour les instructions de réinitialisation"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <p>
                    Un email avec les instructions de réinitialisation a été envoyé à <strong>{email}</strong>.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Si vous ne recevez pas l'email dans les prochaines minutes, vérifiez votre dossier spam.
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à la connexion
                  </Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Envoi en cours..." : "Envoyer les instructions"}
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à la connexion
                  </Link>
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
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
