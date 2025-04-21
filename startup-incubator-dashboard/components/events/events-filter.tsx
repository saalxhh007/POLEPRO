"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Calendar, Filter, X } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

export function EventsFilter() {
  const [date, setDate] = useState<DateRange | undefined>()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const categories = [
    { id: "workshop", label: "Atelier" },
    { id: "conference", label: "Conférence" },
    { id: "masterclass", label: "Masterclass" },
    { id: "networking", label: "Networking" },
    { id: "open-day", label: "Journée Portes Ouvertes" },
  ]

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleReset = () => {
    setDate(undefined)
    setSelectedCategories([])
    setSelectedStatus("all")
  }

  const handleApplyFilters = () => {
    // Dans une application réelle, ceci déclencherait une requête de filtrage
    console.log("Filtres appliqués:", {
      date,
      categories: selectedCategories,
      status: selectedStatus,
    })

    // Simuler une synchronisation avec le dashboard
    console.log("Ces filtres seraient synchronisés avec le dashboard")

    alert("Filtres appliqués")
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Filtres</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 px-2">
            <X className="h-4 w-4 mr-1" />
            Réinitialiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Période</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "dd/MM/yyyy", { locale: fr })} -{" "}
                        {format(date.to, "dd/MM/yyyy", { locale: fr })}
                      </>
                    ) : (
                      format(date.from, "dd/MM/yyyy", { locale: fr })
                    )
                  ) : (
                    <span>Sélectionner une période</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Catégories</Label>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                  />
                  <Label htmlFor={`category-${category.id}`} className="font-normal">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Statut</Label>
            <RadioGroup defaultValue="all" value={selectedStatus} onValueChange={setSelectedStatus}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="status-all" />
                <Label htmlFor="status-all" className="font-normal">
                  Tous
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upcoming" id="status-upcoming" />
                <Label htmlFor="status-upcoming" className="font-normal">
                  À venir
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ongoing" id="status-ongoing" />
                <Label htmlFor="status-ongoing" className="font-normal">
                  En cours
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="past" id="status-past" />
                <Label htmlFor="status-past" className="font-normal">
                  Passés
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button className="w-full" onClick={handleApplyFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Appliquer les filtres
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

