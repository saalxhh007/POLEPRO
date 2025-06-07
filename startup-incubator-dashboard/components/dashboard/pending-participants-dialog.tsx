"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Phone, UserPlus } from "lucide-react"
import type { PendingParticipant } from "../types/participant"
import { getRoleIcon, getRoleLabel, getInitials } from "./participant-utils"

interface PendingParticipantsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  pendingParticipants: PendingParticipant[]
  onApprove: (participant: PendingParticipant) => void
  onReject: (participant: PendingParticipant) => void
}

export function PendingParticipantsDialog({
  isOpen,
  onOpenChange,
  pendingParticipants,
  onApprove,
  onReject,
}: PendingParticipantsDialogProps) {
  return (
    <>
      {pendingParticipants.length > 0 && (
        <Button variant="outline" size="sm" onClick={() => onOpenChange(true)} className="relative">
          <UserPlus className="mr-2 h-4 w-4" />
          Participants en attente
          <Badge className="ml-2 bg-yellow-100 text-yellow-800">{pendingParticipants.length}</Badge>
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Participants en attente d'approbation</DialogTitle>
            <DialogDescription>Approuvez ou rejetez les demandes de participation en attente.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {pendingParticipants.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Attentes</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingParticipants.map((pending, index) => (
                    <TableRow key={`${pending.email}-${index}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(pending.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{pending.name}</div>
                            <div className="text-sm text-muted-foreground">{pending.email}</div>
                            {pending.phone && (
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {pending.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(pending.role)}
                          <span>{getRoleLabel(pending.role)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{pending.organization || "—"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm max-w-xs truncate" title={pending.expectations}>
                          {pending.expectations || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => onApprove(pending)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => onReject(pending)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">Aucun participant en attente d'approbation.</div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
