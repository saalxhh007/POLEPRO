"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Calendar, GraduationCap, Building, Users, Briefcase } from "lucide-react"

interface StudentProfileDialogProps {
  isOpen: boolean
  onClose: () => void
  student: any
}

export function StudentProfileDialog({ isOpen, onClose, student }: StudentProfileDialogProps) {
  if (!student) return null

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Profile</DialogTitle>
          <DialogDescription>Detailed information about the student</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={`${apiUrl}/storage/${student.image}`}
                alt={`${student.first_name_ar} ${student.last_name_ar}`}
              />
              <AvatarFallback className="text-lg">
                {student.first_name_ar?.charAt(0)}
                {student.last_name_ar?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">
                {student.first_name_ar} {student.last_name_ar}
              </h3>
              <p className="text-muted-foreground">Matricule: {student.matricule}</p>
              <Badge variant="outline" className="w-fit">
                {student.gender === "m" ? "Male" : "Female"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{student.email}</span>
              </div>
              {student.phone_number && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{student.phone_number}</span>
                </div>
              )}
              {student.birth_date && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Born: {new Date(student.birth_date).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {student.Domain_ar && (
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>Domain: {student.Domain_ar}</span>
                </div>
              )}
              {student.option_ar && (
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>Option: {student.option_ar}</span>
                </div>
              )}
              {student.diploma_ar && (
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>Diploma: {student.diploma_ar}</span>
                </div>
              )}
              {student.faculty_code && (
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>Faculty Code: {student.faculty_code}</span>
                </div>
              )}
              {student.department_code && (
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>Department Code: {student.department_code}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Startup & Team Information */}
          {(student.startup || student.teamMemberships?.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Startup & Team Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {student.startup && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>Startup: {student.startup.name}</span>
                  </div>
                )}
                {student.teamMemberships?.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Team Memberships:</span>
                    </div>
                    <div className="ml-7 space-y-1">
                      {student.teamMemberships.map((membership: any, index: number) => (
                        <Badge key={index} variant="secondary">
                          {membership.team?.name || `Team ${index + 1}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
