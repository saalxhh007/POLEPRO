"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Task {
  id?: number;
  title: string;
  startup_id: number;
  assigned_to: number;
  status: string;
  date_limite: Date | string;
}

interface Member {
  id: number;
  first_name_ar: string;
  last_name_ar: string;
  role: string;
}

interface AddTaskFormProps {
  id: any;
  fetchTasks: any;
}

export function AddTaskForm({ id, fetchTasks }: AddTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Task>({
    id: 0,
    title: "",
    startup_id: id,
    assigned_to: 0,
    status: "Planifié",
    date_limite: "",
  });
  const [members, setMembers] = useState<Member[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

    const handleAdd = () => {
      const payload: Omit<Task, 'id'> = {
        title: form.title,
        startup_id: id,
        assigned_to: Number(form.assigned_to),
        status: form.status,
        date_limite: form.date_limite,
      };
    
    axios.post(`${apiUrl}/api/tasks`, payload, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      if (response.data.success) {
        console.log("Task created:", response.data.data);
        setOpen(false);
        fetchTasks(); 
      } else {
        console.error("Failed to create task:", response.data.message);
      }
    })
    .catch((err) => {
      console.error("Error creating task:", err.response?.data || err.message);
    });
  };

  const fetchMembers = () => {
      axios.get(`${apiUrl}/api/team/startup/team-members/${id}`)
        .then((response) => {
          if (response.data.success) {
            setMembers(response.data.members);
            
          } else {
            console.error('Failed to fetch members:', response.data.message);
          }
        })
        .catch((err) => {
          console.error('Error fetching members:', err);
        })
  };
  useEffect(() => {
  fetchMembers();
}, []);
  return (
    <div className="">
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter une Tâche
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une Tâche</DialogTitle>
          <DialogDescription>Remplissez les informations pour créer une nouvelle tâche.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Titre</Label>
            <Input
              id="title"
              placeholder="Titre de la tâche"
              className="col-span-3"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
<div className="grid grid-cols-4 items-center gap-4">
  <Label htmlFor="assignee" className="text-right">Assigné à</Label>
  <Select onValueChange={(val: string) => setForm({ ...form, assigned_to: val ? Number(val) : 0 })}>
    <SelectTrigger id="assignee" className="col-span-3">
      <SelectValue placeholder="Sélectionner une personne" />
    </SelectTrigger>
    <SelectContent>
      {members.map((member) => (
        <SelectItem key={member.id} value={member.id.toString()}>
          {member.first_name_ar} {member.last_name_ar}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Statut</Label>
            <Select onValueChange={(val) => {
              const map = {
                planned: "Planifié",
                "in-progress": "En cours",
                completed: "Terminé",
              };
              setForm({ ...form, status: map[val as keyof typeof map] });
            }}>
              <SelectTrigger id="status" className="col-span-3">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planifié</SelectItem>
                <SelectItem value="in-progress">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="due-date" className="text-right">Date limite</Label>
            <Input
              id="due-date"
              type="date"
              className="col-span-3"
              value={typeof form.date_limite === 'string' ? form.date_limite : form.date_limite.toISOString().split('T')[0]}
              onChange={(e) => setForm({ ...form, date_limite: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAdd}>
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog></div>
  );
}
