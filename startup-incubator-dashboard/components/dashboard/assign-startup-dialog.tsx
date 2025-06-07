"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import axios from "axios"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

export function AssignStartupDialog({
  fetchMentors,
  isOpen,
  onClose,
  mentor,
}: { isOpen: any; onClose: any; mentor: any; fetchMentors: any }) {
  const [startups, setStartups] = useState([])
  const [selectedStartup, setSelectedStartup] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  useEffect(() => {
    const fetchStartups = async () => {
      axios
        .get(`${apiUrl}/api/startup`)
        .then((response) => {
          setStartups(response.data.data)
        })
        .catch((err) => {
          console.error("Error fetching startups:", err)
        })
    }
    if (isOpen) {
      fetchStartups()
    }
  }, [isOpen, apiUrl])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!selectedStartup) {
      toast.error("Please select a startup")
      return
    }

    setIsSubmitting(true)
    const assignmentData = {
      mentor_id: mentor.id,
      startup_id: selectedStartup.id,
    }
    axios
      .post(`${apiUrl}/api/mentor/startup/assign/`, assignmentData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        if (response.data.success) {
          toast.success(`${response.data.message}`)
          fetchMentors()
          onClose()
        }
      })
      .catch((err) => {
        toast.error(`Error Assigning A mentor To This Startup`)
        console.log(err)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  // Filter startups based on search query
  const filteredStartups = startups.filter((startup: any) =>
    startup.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign {mentor?.name} to a Startup</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="startup">Select Startup</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                  {selectedStartup ? selectedStartup.name : "Select a startup..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search startups..." value={searchQuery} onValueChange={setSearchQuery} />
                  <CommandList>
                    <CommandEmpty>No startup found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {filteredStartups.map((startup: any) => (
                        <CommandItem
                          key={startup.id}
                          value={startup.name}
                          onSelect={() => {
                            setSelectedStartup(startup)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedStartup?.id === startup.id ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {startup.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Assigning..." : "Assign Mentor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
