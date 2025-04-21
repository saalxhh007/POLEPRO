import type { Metadata } from "next"
import { TrainingDetails } from "@/components/dashboard/training-details"

export const metadata: Metadata = {
  title: "Détails de la formation | Dashboard Incubateur",
  description: "Consultez les détails de la formation",
}

export default function TrainingDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6">
      <TrainingDetails id={params.id} />
    </div>
  )
}

