import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, Download, Search, UserPlus } from "lucide-react"
import Link from "next/link"

export default function EventParticipantsPage({ params }: { params: { id: string } }) {
  // Dans une application réelle, vous récupéreriez les détails de l'événement et les participants à partir d'une API
  const event = {
    id: params.id,
    title: "Atelier d'Innovation Entrepreneuriale",
  }

  const participants = [
    {
      id: "1",
      name: "Ahmed Benali",
      email: "ahmed.benali@example.com",
      organization: "Université de Guelma",
      registrationDate: "15 Mai 2025",
      status: "confirmed",
    },
    {
      id: "2",
      name: "Samira Hadj",
      email: "samira.hadj@example.com",
      organization: "TechInnovate",
      registrationDate: "16 Mai 2025",
      status: "confirmed",
    },
    {
      id: "3",
      name: "Karim Meziane",
      email: "karim.meziane@example.com",
      organization: "StartupAlgeria",
      registrationDate: "17 Mai 2025",
      status: "confirmed",
    },
    {
      id: "4",
      name: "Leila Bouaziz",
      email: "leila.bouaziz@example.com",
      organization: "Digital Solutions",
      registrationDate: "18 Mai 2025",
      status: "confirmed",
    },
    {
      id: "5",
      name: "Omar Taleb",
      email: "omar.taleb@example.com",
      organization: "Incubateur BAG",
      registrationDate: "19 Mai 2025",
      status: "confirmed",
    },
    {
      id: "6",
      name: "Fatima Zahra",
      email: "fatima.zahra@example.com",
      organization: "FinTech Algérie",
      registrationDate: "20 Mai 2025",
      status: "pending",
    },
    {
      id: "7",
      name: "Youcef Kaddour",
      email: "youcef.kaddour@example.com",
      organization: "AgriTech Solutions",
      registrationDate: "21 Mai 2025",
      status: "pending",
    },
  ]

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
            <h1 className="text-3xl font-bold">Participants</h1>
            <p className="text-muted-foreground">Liste des participants à l'événement: {event.title}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Exporter CSV</span>
            </Button>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Ajouter un participant</span>
            </Button>
            <Link href="/dashboard/events">
              <Button variant="secondary">Gérer dans le dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Tous les participants ({participants.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Rechercher..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Organisation</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">{participant.name}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                  <TableCell>{participant.organization}</TableCell>
                  <TableCell>{participant.registrationDate}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        participant.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {participant.status === "confirmed" ? "Confirmé" : "En attente"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

