"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, PlusCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

interface StartupFormDialogProps {
  fetchStartups: () => void;
}

const INDUSTRIES = ["Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing", "Other"]
const STATUS = [
  { value: "active", label: "Active" },
  { value: "warning", label: "Warning" },
  { value: "inactive", label: "Inactive" },
]

const FACULTIES = [
  { id: 12, name: "Faculté de mathématiques et de l'informatique et des sciences de la matière" },
  { id: 8, name: " Faculté des sciences et de la technologie" },
  { id: 9, name: "Faculté des sciences économiques, commerciales et des sciences de gestion" },
  { id: 10, name: "Faculté de droit et des sciences politiques" },
  { id: 11, name: "Faculté des sciences de la nature et de la vie et sciences de la terre et de l'univers" },
  { id: 13, name: "Faculté des sciences humaines et sociales" },
  { id: 14, name: "Faculté des lettres et des langues " },
]

const STAGES = ["Ideation", "Validation", "Early Development", "Growth", "Scaling"]

const startupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  industry: z.string().optional(),
  stage: z.string().optional(),
  join_date: z.date().optional(),
  status: z.enum(["active", "warning", "inactive"]),
  progress: z.number().min(0).max(100).optional(),
  team_id: z.number().nonnegative(),
  idea_stage: z.string(),
  idea: z.string(),
  description: z.string(),
  innovation: z.string(),
  target_customers: z.string(),
  sector: z.string(),
  originality: z.string(),
  other_details: z.string(),
  business_model: z.string(),
  supervisor_name: z.string(),
  submission_date: z.date(),
  modified_date: z.date(),
  is_final: z.boolean(),
  in_pole: z.boolean(),
  approved_by_dean: z.boolean(),
  faculty_id: z.number().min(1, "Faculty is required"),
  advisor_id: z.number(),
  idea_origin: z.string(),
})

type StartupValues = z.infer<typeof startupSchema>

export function StartupFormDialog({ fetchStartups }: StartupFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [teams, setTeams] = useState<any[]>([])
  const [advisors, setAdvisors] = useState<any[]>([])
  const [advisorDetails, setAdvisorDetails] = useState({
    grade: "",
    specialization: "",
    faculty: "",
    department: "",
  })
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const form = useForm<StartupValues>({
    resolver: zodResolver(startupSchema),
    defaultValues: {
      name: "",
      industry: undefined,
      stage: undefined,
      join_date: new Date(),
      status: "active",
      progress: 0,
      team_id: undefined as unknown as number,
      idea_stage: "",
      idea: "",
      description: "",
      innovation: "",
      target_customers: "",
      originality: "",
      sector: "",
      other_details: "",
      business_model: "",
      supervisor_name: "",
      submission_date: new Date(),
      modified_date: new Date(),
      is_final: false,
      in_pole: false,
      approved_by_dean: false,
      faculty_id: undefined as unknown as number,
      advisor_id: undefined as unknown as number,
      idea_origin: "",
    },
  })
  // Send Create Startup Form
  function onSubmit(data: StartupValues) {
    const values = form.getValues()

    const toastId = toast.loading("Submitting form...");

    axios.post(`${apiUrl}/api/startup`, data, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        toast.success("Startup added successfully!", { id: toastId });
        fetchStartups();
        setOpen(false); 
      }
    )
      .catch((error) => {
        toast.error("Failed to submit form.", { id: toastId });})
  }

  const updateAdvisorDetails = (advisorId: string) => {
    const selectedAdvisor = advisors.find((a) => a.id === Number(advisorId))

    if (selectedAdvisor) {
      const details = {
        grade: selectedAdvisor.grade || "",
        specialization: selectedAdvisor.specialization || "",
        faculty: selectedAdvisor.faculty_name || "",
        department: selectedAdvisor.department_name || "",
      }

      setAdvisorDetails(details)

      form.setValue("advisor_id", selectedAdvisor.id)
    } else {
      setAdvisorDetails({
        grade: "",
        specialization: "",
        faculty: "",
        department: "",
      })

      form.setValue("advisor_id", 0);
    }
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/team/`)
      .then((response) => setTeams(response.data.data))
      .catch((error) => toast.error("Failed to fetch teams."))
  }, [])

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/advisors/`, { headers: {
        Authorization: `Bearer ${accessToken}`
      }})
      .then((response) => setAdvisors(response.data.data))
      .catch((error) =>  toast.error("Failed to fetch advisors."))
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setOpen(true)}>
          Add New Startup
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Startup</DialogTitle>
          <DialogDescription>Fill in the details to add a new startup to the system.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="startup-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="idea">Idea Details</TabsTrigger>
                <TabsTrigger value="advisor">Advisor Info</TabsTrigger>
                <TabsTrigger value="status">Status & Approvals</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Startup Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter startup name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INDUSTRIES.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stage</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STAGES.map((stage) => (
                              <SelectItem key={stage} value={stage}>
                                {stage}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="join_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Join Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="team_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number.parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team.id} value={team.id.toString()}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <FormField
                  control={form.control}
                  name="faculty_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faculty</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value !== undefined ? String(field.value) : undefined} >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select faculty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FACULTIES.map((faculty) => (
                            <SelectItem key={faculty.id} value={String(faculty.id)} >
                              {faculty.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="idea" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="idea_stage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idea Stage</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter idea stage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sector</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter sector" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="idea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idea</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the idea" className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detailed description" className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="innovation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Innovation</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the innovation" className="min-h-[80px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="originality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Originality</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the originality" className="min-h-[80px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="target_customers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Customers</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe target customers" className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="business_model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Model</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the business model" className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="other_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Details</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any other relevant details" className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idea_origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idea Origin</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter idea origin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="advisor" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="advisor_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advisor</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          updateAdvisorDetails(value)
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select An advisor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {advisors.map((advisor) => (
                            <SelectItem key={advisor.id} value={advisor.id.toString()}>
                              {advisor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supervisor_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supervisor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter supervisor name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormLabel>Advisor Grade</FormLabel>
                  <Input readOnly value={advisorDetails.grade}></Input>
                  <FormLabel>Advisor Specialization</FormLabel>
                  <Input readOnly value={advisorDetails.specialization}></Input>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormLabel>Advisor Faculty</FormLabel>
                  <Input readOnly value={advisorDetails.faculty}></Input>
                  <FormLabel>Advisor Department</FormLabel>
                  <Input readOnly value={advisorDetails.department}></Input>
                </div>
              </TabsContent>
              <TabsContent value="status" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STATUS.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="progress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Progress (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Enter progress percentage"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="submission_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Submission Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="modified_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Modified Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="is_final"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Is Final</FormLabel>
                          <FormDescription>Mark if this is the final version</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="in_pole"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>In Pole</FormLabel>
                          <FormDescription>Mark if this startup is in pole position</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="approved_by_dean"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Approved by Dean</FormLabel>
                          <FormDescription>Mark if this startup is approved by the dean</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="startup-form">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
