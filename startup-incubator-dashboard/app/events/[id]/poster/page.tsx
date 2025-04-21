import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Download, Share2 } from "lucide-react"

export default function EventPosterPage({ params }: { params: { id: string } }) {
  // Dans une application réelle, vous récupéreriez les détails de l'événement à partir d'une API
  const event = {
    id: params.id,
    title: "Atelier d'Innovation Entrepreneuriale",
    poster: "/placeholder.svg?height=800&width=600",
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link
          href={`/events/${params.id}`}
          className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Retour à l'événement
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Affiche de l'événement</h1>
            <p className="text-muted-foreground">{event.title}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span>Partager</span>
            </Button>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Télécharger</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative max-w-2xl">
          <Image
            src={event.poster || "/placeholder.svg"}
            alt={`Affiche: ${event.title}`}
            width={600}
            height={800}
            className="object-contain border rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  )
}

