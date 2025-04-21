import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, BookOpen, Lightbulb } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AddTrainingForm } from "@/components/dashboard/add-training-form"

export const metadata: Metadata = {
  title: "Ajouter une formation | Dashboard",
  description: "Créer une nouvelle formation pour l'incubateur de startups",
}

export default function AddTrainingPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ajouter une formation</h1>
          <p className="text-muted-foreground">Créez une nouvelle formation pour les startups de l'incubateur</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/trainings">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Retour aux formations
          </Link>
        </Button>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AddTrainingForm />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Guide de création
              </CardTitle>
              <CardDescription>Conseils pour créer une formation efficace</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Informations de base</h3>
                  <p className="text-sm text-muted-foreground">
                    Donnez un titre clair et une description détaillée qui explique les bénéfices de la formation.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Horaires et lieu</h3>
                  <p className="text-sm text-muted-foreground">
                    Planifiez des sessions avec des pauses adéquates. Choisissez un lieu accessible.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Contenu et matériels</h3>
                  <p className="text-sm text-muted-foreground">
                    Définissez des objectifs d'apprentissage clairs et préparez des supports de qualité.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Paramètres</h3>
                  <p className="text-sm text-muted-foreground">
                    Configurez les rappels et les certificats selon les besoins de votre formation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5" />
                Bonnes pratiques
              </CardTitle>
              <CardDescription>Maximisez l'impact de votre formation</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Limitez le nombre de participants pour favoriser les interactions</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Alternez théorie et exercices pratiques</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Prévoyez un questionnaire de satisfaction</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Envoyez les supports avant la formation</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>Proposez un suivi post-formation</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

