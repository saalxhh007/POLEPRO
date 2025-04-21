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

export function AddMentorForm({ onMentorAdded }: { onMentorAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('');
  const [expertise, setExpertise] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const createMentor = async () => {
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("expertise", expertise)
      formData.append("company", company)
      formData.append("email", email)
      if (image) formData.append("image", image)

      const res = await fetch(`${apiUrl}/api/mentor/`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const result = await res.json()
        alert("Mentor created successfully")
        setOpen(false)
        onMentorAdded()
      } else {
        const errorResponse = await res.json()
        const errorMessages = errorResponse.error || "An unknown error occurred."
        alert(`Error creating mentor: ${errorResponse.message}\nDetails: ${errorMessages}`)
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.")
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un Mentor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un Mentor</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour ajouter un nouveau mentor à l'incubateur.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input id="name" placeholder="Nom complet" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expertise" className="text-right">
              Expertise
            </Label>
            <Select value={expertise} onValueChange={setExpertise}>
              <SelectTrigger id="expertise" className="col-span-3">
                <SelectValue placeholder="Sélectionner une expertise" />
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
              Entreprise
            </Label>
            <Input id="company" placeholder="Nom de l'entreprise" onChange={(e) => setCompany(e.target.value)} value={company} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" type="email" placeholder="email@example.com" onChange={(e) => setEmail(e.target.value)} value={email} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Photo du mentor
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setImage(files[0]);
                  } else {
                    setImage(null);
                  }
  }} className="col-span-3" />
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
