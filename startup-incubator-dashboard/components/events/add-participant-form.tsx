"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  role: z.enum(["etudiant", "entrepreneur", "developpeur", "designer", "investisseur"], {
    required_error: "Please select a role",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(8, { message: "Phone number must be at least 8 characters" }),
  organization: z.string().optional(),
  expectations: z.string().optional(),
  event_id: z.number().optional(),
})

type FormValues = z.infer<typeof formSchema>

type Event = {
  id: number
  title: string
}

interface AddParticipantFormProps {
  onSuccess?: () => void
}

export function AddParticipantForm({ onSuccess }: AddParticipantFormProps) {
  const [open, setOpen] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [eventOpen, setEventOpen] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      organization: "",
      expectations: "",
    },
  })
  
  const fetchEvents = () => {
    axios.get(`${apiUrl}/api/event`)
      .then(response => {
        setEvents(response.data.data)
      })
      .catch(err => {
        console.error("Failed to fetch events:", err)})
  } 

  useEffect(() => {
    fetchEvents()
  ,[apiUrl]})

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    axios.post(`${apiUrl}/api/participent/add`, data, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        if (response.data.success) {
          toast.success("participant Added Successfully")
          form.reset()
          if (onSuccess) onSuccess()
          setOpen(false)
        }
        else {
            toast.error("Failed To Add Participent")
          }
        })
        .catch(err => {
          toast.success("Failed To Add Participent")
          console.error("Failed to add participant:", err)
        })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <span>Add a participant</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Participant</DialogTitle>
          <DialogDescription>Fill in the details to add a new participant to an event.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="etudiant">Étudiant</SelectItem>
                      <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                      <SelectItem value="developpeur">Développeur</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="investisseur">Investisseur</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Organization name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expectations</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What do you expect from this event?" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event</FormLabel>
                  <Popover open={eventOpen} onOpenChange={setEventOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? events.find((event) => event.id === field.value)?.title : "Select an event"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search events..." />
                        <CommandList>
                          <CommandEmpty>No events found.</CommandEmpty>
                          <CommandGroup>
                            {events.map((event) => (
                              <CommandItem
                                key={event.id}
                                value={event.title}
                                onSelect={() => {
                                  form.setValue("event_id", event.id)
                                  setEventOpen(false)
                                }}
                              >
                                <Check
                                  className={cn("mr-2 h-4 w-4", event.id === field.value ? "opacity-100" : "opacity-0")}
                                />
                                {event.title}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Participant
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
