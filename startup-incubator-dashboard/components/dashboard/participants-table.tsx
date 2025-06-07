"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Phone } from "lucide-react"
import type { Participant } from "../types/participant"
import { getStatusColor, getRoleIcon, getRoleLabel, getStatusLabel, getInitials } from "./participant-utils"
import { ParticipantActions } from "./participant-actions"

interface ParticipantsTableProps {
  participants: Participant[]
  selectedItems: string[]
  onSelectionChange: (selectedIds: string[]) => void
  onEdit: (participant: Participant) => void
  onDelete: (participantId: string) => void
  onSendEmail: (email: string) => void
  searchQuery: string
}

export function ParticipantsTable({
  participants,
  selectedItems,
  onSelectionChange,
  onEdit,
  onDelete,
  onSendEmail,
  searchQuery,
}: ParticipantsTableProps) {
  const filteredParticipants = participants.filter((participant) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      participant.name.toLowerCase().includes(searchLower) ||
      participant.email.toLowerCase().includes(searchLower) ||
      participant.role.toLowerCase().includes(searchLower) ||
      participant.organization?.toLowerCase().includes(searchLower)
    )
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(filteredParticipants.map((item) => item.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectItem = (participantId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedItems, participantId])
    } else {
      onSelectionChange(selectedItems.filter((id) => id !== participantId))
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={selectedItems.length === filteredParticipants.length && filteredParticipants.length > 0}
              onCheckedChange={handleSelectAll}
            />
          </TableHead>
          <TableHead>Participant</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Organisation</TableHead>
          <TableHead>Inscription</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredParticipants.length > 0 ? (
          filteredParticipants.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell>
                <Checkbox
                  checked={selectedItems.includes(participant.id)}
                  onCheckedChange={(checked) => handleSelectItem(participant.id, !!checked)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{participant.name}</div>
                    <div className="text-sm text-muted-foreground">{participant.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getRoleIcon(participant.role)}
                  <span>{getRoleLabel(participant.role)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{participant.organization || "—"}</div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(participant.status)}>{getStatusLabel(participant.status)}</Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {participant.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {participant.phone}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <ParticipantActions
                  participant={participant}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onSendEmail={onSendEmail}
                />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="h-24 text-center">
              {searchQuery ? "Aucun participant trouvé." : "Aucun participant ajouté pour cet événement."}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
