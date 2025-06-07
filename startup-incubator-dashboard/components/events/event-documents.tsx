"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, File } from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  size: string
  url: string
}

interface EventDocumentsProps {
  documents: Document[] | undefined
}

export function EventDocuments({ documents }: EventDocumentsProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  const handleDownload = (document: Document) => {
    // Dans une application réelle, ceci déclencherait un téléchargement
    setIsLoading({ ...isLoading, [document.id]: true })

    // Simuler un délai de téléchargement
    setTimeout(() => {
      setIsLoading({ ...isLoading, [document.id]: false })
      alert(`Téléchargement de ${document.name} - Cette action serait synchronisée avec le dashboard`)
    }, 1500)
  }

  const getIconForDocType = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />
      case "pptx":
        return <FileText className="h-8 w-8 text-orange-500" />
      case "docx":
        return <FileText className="h-8 w-8 text-blue-500" />
      case "xlsx":
        return <FileText className="h-8 w-8 text-green-500" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents de l'événement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents?.map((document) => (
            <div key={document.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                {getIconForDocType(document.type)}
                <div>
                  <p className="font-medium">{document.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {document.type.toUpperCase()} • {document.size}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => alert(`Aperçu de ${document.name}`)}
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Aperçu</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleDownload(document)}
                  disabled={isLoading[document.id]}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {isLoading[document.id] ? "Téléchargement..." : "Télécharger"}
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

