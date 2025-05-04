"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

export function AddMentorForm({ onMentorAdded }: { onMentorAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [mentorData, setMentorData] = useState({
    name: "",
    expertise: "",
    company: "",
    email: "",
    bio: "",
    image: null,
  })

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setMentorData((prevData) => ({
      ...prevData,
      [name]: name === 'image' ? files[0] : value,
    }));
  };

  const createMentor = async () => {
      const formData = new FormData();
      formData.append("name", mentorData.name);
      formData.append("expertise", mentorData.expertise);
      formData.append("company", mentorData.company);
      formData.append("email", mentorData.email);
      formData.append("bio", mentorData.bio);
      if (mentorData.image) formData.append("image", mentorData.image);

      axios.post(`${apiUrl}/api/mentor/`, formData)
        .then(response => {
          if (response.data.success) {
            toast.success("Mentor created successfully");
            setOpen(false);
            onMentorAdded();
          }
        })
        .catch(err => {
          toast.error("Error creating mentor")
          console.log(err);
        })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add A Mentor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Mentor</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour ajouter un nouveau mentor à l'incubateur.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" name="name" placeholder="Complet Name" value={mentorData.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expertise" className="text-right">
              Expertise
            </Label>
            <Select
              value={mentorData.expertise} 
              onValueChange={(value) => setMentorData(prev => ({ ...prev, expertise: value }))}>
              <SelectTrigger id="expertise" className="col-span-3">
                <SelectValue placeholder="Select An Expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product-strategy">Product Strategy</SelectItem>
                <SelectItem value="venture-capital">Venture Capital</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="software-engineering">Software Engineering</SelectItem>
                <SelectItem value="ux-ui-design">UX/UI Design</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <Input id="company" name="company" placeholder="Company Name" onChange={handleChange} value={mentorData.company} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" type="email" name="email" placeholder="email@example.com" onChange={handleChange} value={mentorData.email} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Input id="bio" name="bio" placeholder="Short bio" onChange={handleChange} value={mentorData.bio} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Mentor Image
            </Label>
            <Input id="image" type="file" name="image" onChange={handleChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => createMentor()}>
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
