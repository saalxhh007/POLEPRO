"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, Users } from 'lucide-react';
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

interface AssignProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  onAssigned: () => void;
}

const ROLES = [
  { id: 1, name: 'Developer' },
  { id: 2, name: 'Designer' },
  { id: 3, name: 'Project Manager' },
  { id: 4, name: 'QA Tester' },
  { id: 5, name: 'Business Analyst' },
  { id: 6, name: 'Marketing Specialist' }
];

export function AssignProjectDialog({ isOpen, onClose, student, onAssigned }: AssignProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedRole, setSelectedRole] = useState(""); // Role name instead of ID
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Fetch available projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/startup`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      setSelectedProjectId("");
      setSelectedRole("");
    }
  }, [isOpen]);

  const handleAssign = async () => {
    if (!selectedProjectId) {
      toast.error("Please select a project");
      return;
    }

    setIsLoading(true);

      const toastId = toast.loading("Assigning project...");

      const response = await axios.post(
        `${apiUrl}/api/startup/assign/${student.id}`,
        {
          project_id: selectedProjectId,
          role: selectedRole,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      ).
        then((response) => {
              if (response.data.success) {
                  toast.success("Project assigned successfully!", { id: toastId });
                  onClose();
                  onAssigned();
              } else {
                  toast.error("Failed to assign project", { id: toastId });
              }
          })
          .catch((err) => {
              toast.error("Failed to assign project");
              console.error("Error assigning project:", err);
          })
          .finally(() => {
              setIsLoading(false);
          })
  };

  const selectedProject = projects.find((project) => project.id.toString() === selectedProjectId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Project</DialogTitle>
          <DialogDescription>
            Assign a project to {student?.first_name_ar} {student?.last_name_ar}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Student Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="text-sm font-medium">
                  {student?.first_name_ar} {student?.last_name_ar}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Matricule:</span>
                <span className="text-sm font-medium">{student?.matricule}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Domain:</span>
                <span className="text-sm font-medium">{student?.Domain_ar}</span>
              </div>
            </CardContent>
          </Card>

          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project">Select Project</Label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">{project.industry}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role.id} value={role.name}> {/* Use role name as value */}
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{role.name}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Project Details */}
          {selectedProject && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">{selectedProject.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{selectedProject.description}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Duration: {selectedProject.duration || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Team Size: {selectedProject.team_size || "Flexible"}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.skills?.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={isLoading || !selectedProjectId}>
            {isLoading ? "Assigning..." : "Assign Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
