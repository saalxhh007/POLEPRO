import { TrainingRegistrationFormBuilder } from "@/components/dashboard/training-registration-form-builder"

interface RegistrationFormPageProps {
  params: {
    id: string
  }
}

export default function RegistrationFormPage({ params }: RegistrationFormPageProps) {
  // Données fictives pour la formation
  const trainingTitle = "Fondamentaux du Business Model Canvas"

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Formulaire d'inscription</h1>
          <p className="text-muted-foreground">
            Créez et personnalisez le formulaire d'inscription pour cette formation.
          </p>
        </div>
      </div>

      <TrainingRegistrationFormBuilder trainingId={params.id} trainingTitle={trainingTitle} />
    </div>
  )
}

