"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, PlusCircle, X } from "lucide-react"

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

const TEAMS = [
  { id: 1, name: "Team Alpha" },
  { id: 2, name: "Team Beta" },
  { id: 3, name: "Team Gamma" },
]

const FACULTIES = [
  { code: "ENG", name: "Engineering" },
  { code: "BUS", name: "Business" },
  { code: "SCI", name: "Science" },
  { code: "ART", name: "Arts" },
]

const ADVISORS = [
  { id: 1, name: "Dr. Smith" },
  { id: 2, name: "Prof. Johnson" },
  { id: 3, name: "Dr. Williams" },
]

const STAGES = ["Ideation", "Validation", "Early Development", "Growth", "Scaling"]

const INDUSTRIES = ["Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing", "Other"]

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "warning", label: "Warning" },
  { value: "inactive", label: "Inactive" },
]

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  industry: z.string().optional(),
  stage: z.string().optional(),
  founders: z.array(z.string()).optional(),
  join_date: z.date().optional(),
  status: z.enum(["active", "warning", "inactive"]),
  progress: z.number().min(0).max(100).optional(),
  team_id: z.number(),
  idea_stage: z.string().min(1, "Idea stage is required"),
  idea: z.string().min(1, "Idea is required"),
  description: z.string().min(1, "Description is required"),
  innovation: z.string().min(1, "Innovation is required"),
  target_customers: z.string().min(1, "Target customers is required"),
  originality: z.string().min(1, "Originality is required"),
  sector: z.string().min(1, "Sector is required"),
  other_details: z.string().min(1, "Other details are required"),
  business_model: z.string().min(1, "Business model is required"),
  supervisor_name: z.string().min(1, "Supervisor name is required"),
  submission_date: z.date(),
  modified_date: z.date(),
  is_final: z.boolean(),
  in_pole: z.boolean(),
  approved_by_dean: z.boolean(),
  faculty_code: z.string().min(1, "Faculty code is required"),
  advisor_id: z.number(),
  advisor_grade: z.string().min(1, "Advisor grade is required"),
  advisor_specialization: z.string().min(1, "Advisor specialization is required"),
  advisor_faculty: z.string().min(1, "Advisor faculty is required"),
  advisor_department: z.string().min(1, "Advisor department is required"),
  idea_origin: z.string().min(1, "Idea origin is required"),
})

type FormValues = z.infer<typeof formSchema>

export function StartupFormDialog() {
  const [open, setOpen] = useState(false)
  const [teams, setTeams] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [founderInputValue, setFounderInputValue] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      industry: undefined,
      stage: undefined,
      founders: [],
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
      faculty_code: "",
      advisor_id: undefined as unknown as number,
      advisor_grade: "",
      advisor_specialization: "",
      advisor_faculty: "",
      advisor_department: "",
      idea_origin: "",
    },
  })

  function onSubmit(values: FormValues) {
    console.log(values)
    // Here you would typically send the data to your backend
    alert("Form submitted successfully!")
    setOpen(false)
  }

  function addFounder() {
    if (founderInputValue.trim() !== "") {
      const currentFounders = form.getValues("founders") || []
      form.setValue("founders", [...currentFounders, founderInputValue.trim()])
      setFounderInputValue("")
    }
  }

  function removeFounder(index: number) {
    const currentFounders = form.getValues("founders") || []
    form.setValue(
      "founders",
      currentFounders.filter((_, i) => i !== index),
    )
  }

  useEffect(() => {
    console.log();
    
  }, [])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add New Startup</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Startup</DialogTitle>
          <DialogDescription>Fill in the details to add a new startup to the system.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormLabel>Founders</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add founder name"
                      value={founderInputValue}
                      onChange={(e) => setFounderInputValue(e.target.value)}
                    />
                    <Button type="button" onClick={addFounder} size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("founders")?.map((founder, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {founder}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => removeFounder(index)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

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
                          {TEAMS.map((team) => (
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
                        onValueChange={(value) => field.onChange(Number.parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select advisor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ADVISORS.map((advisor) => (
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="advisor_grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Advisor Grade</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter advisor grade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="advisor_specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Advisor Specialization</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter specialization" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="advisor_faculty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Advisor Faculty</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter advisor faculty" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="advisor_department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Advisor Department</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter department" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="faculty_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faculty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select faculty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FACULTIES.map((faculty) => (
                            <SelectItem key={faculty.code} value={faculty.code}>
                              {faculty.name} ({faculty.code})
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
                            {STATUS_OPTIONS.map((status) => (
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
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
