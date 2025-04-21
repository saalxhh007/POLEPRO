"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import {
  GripVertical,
  Plus,
  Trash2,
  Settings,
  Eye,
  Copy,
  CheckCircle,
  Type,
  ListChecks,
  ToggleLeft,
  Calendar,
  FileText,
  Mail,
  Phone,
  User,
  Building,
  Briefcase,
  MapPin,
  Globe,
  Hash,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Types pour les champs du formulaire
type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "phone"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "number"
  | "name"
  | "company"
  | "job"
  | "address"
  | "website"
  | "file"

interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  description?: string
}

interface TrainingRegistrationFormBuilderProps {
  trainingId: string
  trainingTitle: string
}

export function TrainingRegistrationFormBuilder({ trainingId, trainingTitle }: TrainingRegistrationFormBuilderProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("editor")
  const [formTitle, setFormTitle] = useState(`Inscription à la formation: ${trainingTitle}`)
  const [formDescription, setFormDescription] = useState(
    "Veuillez remplir ce formulaire pour vous inscrire à la formation.",
  )
  const [fields, setFields] = useState<FormField[]>([
    {
      id: "field-1",
      type: "name",
      label: "Nom complet",
      placeholder: "Votre nom et prénom",
      required: true,
    },
    {
      id: "field-2",
      type: "email",
      label: "Email",
      placeholder: "votre.email@example.com",
      required: true,
    },
    {
      id: "field-3",
      type: "phone",
      label: "Téléphone",
      placeholder: "Votre numéro de téléphone",
      required: false,
    },
    {
      id: "field-4",
      type: "company",
      label: "Entreprise",
      placeholder: "Nom de votre entreprise",
      required: true,
    },
    {
      id: "field-5",
      type: "job",
      label: "Poste",
      placeholder: "Votre poste actuel",
      required: true,
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  // Fonction pour ajouter un nouveau champ
  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: getDefaultLabelForType(type),
      placeholder: getDefaultPlaceholderForType(type),
      required: false,
    }

    if (type === "select" || type === "radio" || type === "checkbox") {
      newField.options = ["Option 1", "Option 2", "Option 3"]
    }

    setFields([...fields, newField])
  }

  // Fonction pour obtenir le libellé par défaut en fonction du type
  const getDefaultLabelForType = (type: FieldType): string => {
    switch (type) {
      case "text":
        return "Texte"
      case "textarea":
        return "Texte long"
      case "email":
        return "Email"
      case "phone":
        return "Téléphone"
      case "select":
        return "Liste déroulante"
      case "checkbox":
        return "Cases à cocher"
      case "radio":
        return "Boutons radio"
      case "date":
        return "Date"
      case "number":
        return "Nombre"
      case "name":
        return "Nom complet"
      case "company":
        return "Entreprise"
      case "job":
        return "Poste"
      case "address":
        return "Adresse"
      case "website":
        return "Site web"
      case "file":
        return "Fichier"
      default:
        return "Champ"
    }
  }

  // Fonction pour obtenir le placeholder par défaut en fonction du type
  const getDefaultPlaceholderForType = (type: FieldType): string => {
    switch (type) {
      case "text":
        return "Saisissez votre texte"
      case "textarea":
        return "Saisissez votre texte ici"
      case "email":
        return "votre.email@example.com"
      case "phone":
        return "Votre numéro de téléphone"
      case "select":
        return "Sélectionnez une option"
      case "checkbox":
        return ""
      case "radio":
        return ""
      case "date":
        return "JJ/MM/AAAA"
      case "number":
        return "0"
      case "name":
        return "Votre nom et prénom"
      case "company":
        return "Nom de votre entreprise"
      case "job":
        return "Votre poste actuel"
      case "address":
        return "Votre adresse"
      case "website":
        return "https://www.example.com"
      case "file":
        return ""
      default:
        return ""
    }
  }

  // Fonction pour obtenir l'icône en fonction du type
  const getIconForType = (type: FieldType) => {
    switch (type) {
      case "text":
        return <Type className="h-4 w-4" />
      case "textarea":
        return <FileText className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      case "select":
        return <ListChecks className="h-4 w-4" />
      case "checkbox":
        return <CheckCircle className="h-4 w-4" />
      case "radio":
        return <ToggleLeft className="h-4 w-4" />
      case "date":
        return <Calendar className="h-4 w-4" />
      case "number":
        return <Hash className="h-4 w-4" />
      case "name":
        return <User className="h-4 w-4" />
      case "company":
        return <Building className="h-4 w-4" />
      case "job":
        return <Briefcase className="h-4 w-4" />
      case "address":
        return <MapPin className="h-4 w-4" />
      case "website":
        return <Globe className="h-4 w-4" />
      case "file":
        return <FileText className="h-4 w-4" />
      default:
        return <Type className="h-4 w-4" />
    }
  }

  // Fonction pour mettre à jour un champ
  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  // Fonction pour supprimer un champ
  const deleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
  }

  // Fonction pour gérer le drag and drop
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(fields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFields(items)
  }

  // Fonction pour enregistrer le formulaire
  const saveForm = async () => {
    setIsSubmitting(true)

    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Formulaire enregistré:", {
        trainingId,
        title: formTitle,
        description: formDescription,
        fields,
      })

      toast({
        title: "Formulaire enregistré",
        description: "Le formulaire d'inscription a été enregistré avec succès.",
      })

      // Rediriger vers la page des formations
      router.push(`/dashboard/trainings/${trainingId}`)
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du formulaire:", error)

      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du formulaire.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fonction pour copier le code d'intégration
  const copyEmbedCode = () => {
    const embedCode = `<iframe src="https://example.com/embed/training-form/${trainingId}" width="100%" height="600" frameborder="0"></iframe>`
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Rendu du champ en fonction de son type (pour la prévisualisation)
  const renderFieldPreview = (field: FormField) => {
    switch (field.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
            <Input id={field.id} placeholder={field.placeholder} />
          </div>
        )
      case "textarea":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
            <Textarea id={field.id} placeholder={field.placeholder} />
          </div>
        )
      case "email":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
            <Input id={field.id} type="email" placeholder={field.placeholder} />
          </div>
        )
      case "phone":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
            <Input id={field.id} type="tel" placeholder={field.placeholder} />
          </div>
        )
      case "select":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
            <Select>
              <SelectTrigger id={field.id}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case "checkbox":
        return (
          <div className="space-y-2">
            <Label>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox id={`${field.id}-${index}`} />
                  <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
          </div>
        )
      case "radio":
        return (
          <div className="space-y-2">
            <Label>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
            <RadioGroup>
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                  <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )
      case "date":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
            <Input id={field.id} type="date" />
          </div>
        )
      case "number":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
            <Input id={field.id} type="number" placeholder={field.placeholder} />
          </div>
        )
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
            <Input id={field.id} placeholder={field.placeholder} />
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">
            <Settings className="mr-2 h-4 w-4" />
            Éditeur
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="mr-2 h-4 w-4" />
            Aperçu
          </TabsTrigger>
          <TabsTrigger value="embed">
            <Copy className="mr-2 h-4 w-4" />
            Intégration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du formulaire</CardTitle>
              <CardDescription>Configurez les paramètres généraux du formulaire d'inscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="form-title">Titre du formulaire</Label>
                <Input id="form-title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="form-description">Description</Label>
                <Textarea
                  id="form-description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Champs du formulaire</CardTitle>
              <CardDescription>Ajoutez, modifiez et réorganisez les champs du formulaire</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Label className="w-full mb-2">Ajouter un champ</Label>
                  <Button variant="outline" size="sm" onClick={() => addField("text")}>
                    <Type className="mr-2 h-4 w-4" />
                    Texte
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addField("textarea")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Texte long
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addField("email")}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addField("phone")}>
                    <Phone className="mr-2 h-4 w-4" />
                    Téléphone
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addField("select")}>
                    <ListChecks className="mr-2 h-4 w-4" />
                    Liste
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addField("checkbox")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Cases à cocher
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addField("radio")}>
                    <ToggleLeft className="mr-2 h-4 w-4" />
                    Boutons radio
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addField("date")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Date
                  </Button>
                </div>

                <Separator />

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="fields">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {fields.length === 0 ? (
                          <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                            Aucun champ ajouté. Utilisez les boutons ci-dessus pour ajouter des champs.
                          </div>
                        ) : (
                          fields.map((field, index) => (
                            <Draggable key={field.id} draggableId={field.id} index={index}>
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} className="border rounded-md">
                                  <Accordion type="single" collapsible>
                                    <AccordionItem value={field.id}>
                                      <div className="flex items-center p-3">
                                        <div {...provided.dragHandleProps} className="mr-2 cursor-move">
                                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="flex items-center flex-1 gap-2">
                                          {getIconForType(field.type)}
                                          <span className="font-medium">{field.label}</span>
                                          {field.required && (
                                            <Badge variant="outline" className="ml-2">
                                              Requis
                                            </Badge>
                                          )}
                                        </div>
                                        <AccordionTrigger className="mr-2" />
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => deleteField(field.id)}
                                          className="ml-2"
                                        >
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                          <span className="sr-only">Supprimer</span>
                                        </Button>
                                      </div>
                                      <AccordionContent className="p-3 pt-0">
                                        <div className="space-y-4">
                                          <div className="space-y-2">
                                            <Label htmlFor={`${field.id}-label`}>Libellé</Label>
                                            <Input
                                              id={`${field.id}-label`}
                                              value={field.label}
                                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                                            />
                                          </div>

                                          {field.type !== "checkbox" && field.type !== "radio" && (
                                            <div className="space-y-2">
                                              <Label htmlFor={`${field.id}-placeholder`}>Placeholder</Label>
                                              <Input
                                                id={`${field.id}-placeholder`}
                                                value={field.placeholder || ""}
                                                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                              />
                                            </div>
                                          )}

                                          <div className="space-y-2">
                                            <Label htmlFor={`${field.id}-description`}>Description</Label>
                                            <Textarea
                                              id={`${field.id}-description`}
                                              value={field.description || ""}
                                              onChange={(e) => updateField(field.id, { description: e.target.value })}
                                              placeholder="Description optionnelle"
                                            />
                                          </div>

                                          {(field.type === "select" ||
                                            field.type === "checkbox" ||
                                            field.type === "radio") && (
                                            <div className="space-y-2">
                                              <Label>Options</Label>
                                              {field.options?.map((option, optionIndex) => (
                                                <div key={optionIndex} className="flex items-center gap-2">
                                                  <Input
                                                    value={option}
                                                    onChange={(e) => {
                                                      const newOptions = [...(field.options || [])]
                                                      newOptions[optionIndex] = e.target.value
                                                      updateField(field.id, { options: newOptions })
                                                    }}
                                                  />
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                      const newOptions = [...(field.options || [])]
                                                      newOptions.splice(optionIndex, 1)
                                                      updateField(field.id, { options: newOptions })
                                                    }}
                                                  >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                    <span className="sr-only">Supprimer l'option</span>
                                                  </Button>
                                                </div>
                                              ))}
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                  const newOptions = [
                                                    ...(field.options || []),
                                                    `Option ${(field.options?.length || 0) + 1}`,
                                                  ]
                                                  updateField(field.id, { options: newOptions })
                                                }}
                                              >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Ajouter une option
                                              </Button>
                                            </div>
                                          )}

                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              id={`${field.id}-required`}
                                              checked={field.required}
                                              onCheckedChange={(checked) =>
                                                updateField(field.id, { required: checked === true })
                                              }
                                            />
                                            <Label htmlFor={`${field.id}-required`}>Champ obligatoire</Label>
                                          </div>
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push(`/dashboard/trainings/${trainingId}`)}>
                Annuler
              </Button>
              <Button onClick={saveForm} disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : "Enregistrer le formulaire"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{formTitle}</CardTitle>
              <CardDescription>{formDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {fields.map((field) => (
                    <div key={field.id}>{renderFieldPreview(field)}</div>
                  ))}

                  <div className="pt-4">
                    <Button className="w-full">S'inscrire à la formation</Button>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="embed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Code d'intégration</CardTitle>
              <CardDescription>
                Utilisez ce code pour intégrer le formulaire d'inscription sur votre site web
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="embed-code">Code HTML</Label>
                <div className="flex">
                  <Textarea
                    id="embed-code"
                    readOnly
                    value={`<iframe src="https://example.com/embed/training-form/${trainingId}" width="100%" height="600" frameborder="0"></iframe>`}
                    className="font-mono text-sm"
                  />
                  <Button variant="ghost" size="icon" onClick={copyEmbedCode} className="ml-2">
                    {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    <span className="sr-only">Copier</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Copiez ce code et collez-le dans votre site web pour intégrer le formulaire d'inscription.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Aperçu de l'intégration</Label>
                <div className="border rounded-md p-4 bg-gray-50">
                  <div className="aspect-video bg-white border rounded-md flex items-center justify-center">
                    <div className="text-center p-4">
                      <h3 className="font-medium">{formTitle}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{formDescription}</p>
                      <div className="mt-4 text-muted-foreground">[Aperçu du formulaire intégré]</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setActiveTab("editor")} className="w-full">
                Retour à l'éditeur
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

