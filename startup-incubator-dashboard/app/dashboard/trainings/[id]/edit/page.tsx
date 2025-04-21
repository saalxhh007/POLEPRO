import { EditTrainingForm } from "@/components/dashboard/edit-training-form"

interface EditTrainingPageProps {
  params: {
    id: string
  }
}

export default function EditTrainingPage({ params }: EditTrainingPageProps) {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modifier la formation</h1>
          <p className="text-muted-foreground">Modifiez les détails de la formation et enregistrez vos changements.</p>
        </div>
      </div>

      <EditTrainingForm trainingId={params.id} />
    </div>
  )
}

