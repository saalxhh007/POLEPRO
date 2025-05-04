"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import toast from "react-hot-toast"

const formSchema = z.object({
  matricule: z
    .string()
    .min(12, { message: "Matricule must be exactly 12 characters" })
    .max(12, { message: "Matricule must be exactly 12 characters" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Matricule must contain only letters and numbers" }),
  first_name_ar: z.string().min(1, { message: "First name is required" }),
  last_name_ar: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  idea: z.string().min(1, { message: "Idea is required" }),
  name: z.string().min(1, { message: "team Name is required" }),
  number_of_members: z.string(),
})

export default function StudentForm() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matricule: "",
      first_name_ar: "",
      last_name_ar: "",
      email: "",
      idea: "",
      name: "",
      number_of_members: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const parsedValues = {
      ...values,
      number_of_members: Number(values.number_of_members),
    };
    
    axios.post(`${apiUrl}/api/approval/submit-form`, parsedValues)
      .then(response => {
        if (response.data.success) {
          toast.success("Form Sent Succesffully You Will Get A Response")
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        }
      })
      .catch((err) => {
        if (!err.response.data.success) {
          toast.error("Matricule Already Exists")
        }
        else{
          toast.error("Error Occurred When Sending The Form")
          console.log(err);
        }
      })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Student Registration</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="matricule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matricule</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your 12-digit matricule" {...field} />
                </FormControl>
                <FormDescription>Your unique 12-character student ID</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name </FormLabel>
                  <FormControl>
                    <Input placeholder="الاسم الأول" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="اللقب" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="اسم الفريق" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="number_of_members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>number of members</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="العدد" {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Idea</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your idea or project proposal" className="min-h-[120px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit Application
          </Button>
        </form>
      </Form>
    </div>
  )
}
