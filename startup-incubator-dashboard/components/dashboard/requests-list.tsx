"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, Eye, CheckCircle, XCircle } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import { longFormatters } from "date-fns"
import { RootState } from "@/store"
import { useSelector } from "react-redux"

type Request = {
  id: string
  matricule: string
  first_name_ar: string
  last_name_ar: string
  email: string
  idea: string
  name: string
  number_of_members: number
  status: "pending" | "confirmed" | "declined"
}

export function RequestsList() {
    const [requests, setRequests] = useState<Request[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  
    
  const requestsData = () => {
      
      axios.get(`${apiUrl}/api/approval/all-pending`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }})
        .then(response => {
              setRequests(response.data)
           })
          .catch(err => {
          })
    }

  const filteredRequests = requests.filter(
    (request) =>
      request.matricule.includes(searchQuery) ||
      request.email.includes(searchQuery) ||
      request.first_name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.last_name_ar.toLowerCase().includes(searchQuery.toLowerCase()),
  )

    const handleViewRequest = (request: Request) => {
        setSelectedRequest(request)
        setIsDialogOpen(true)
    }

    const handleApproveRequest = (id: string) => {
      axios.post(`http://127.0.0.1:8000/api/approval/review-student/${id}`,
        { decision: 'approve' }, { headers: {
          Authorization: `Bearer ${accessToken}`
        }})
            .then(response => {
                if (response.data.success) {
                  toast.success("Request Approved Successfully")
                    setRequests(prevRequests =>
                        prevRequests.map(request =>
                            request.id === id ? { ...request, status: 'confirmed' } : request
                        )
                    )
                    if (selectedRequest?.id === id) {
                        setSelectedRequest({ ...selectedRequest, status: 'confirmed' });
                    }
                }
             })
            .catch(err => {
                toast.error("Failed To Approve Request")
            })
    }

    const handleRejectRequest = (id: string) => {
    axios.post(`http://127.0.0.1:8000/api/approval/review-student/${id}`, {
      decision: 'reject',
    },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => {
            if (response.data.success) {
                setRequests(prevRequests =>
                    prevRequests.map(request =>
                        request.id === id ? { ...request, status: 'declined' } : request
                    )
                )
                if (selectedRequest?.id === id) {
                    setSelectedRequest({ ...selectedRequest, status: 'declined' });
                    toast.success("Request Declined Successfully")
                }
                else {
                    toast.error("Failed To Declined Request")
                  }
            }
         })
        .catch(err => {
            toast.error("Failed To Decline Request")
        })
    }

  const getStatusBadge = (status: string) => {
    switch (status) {   
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

    useEffect(() => {
        requestsData()
    }, [])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Requests</CardTitle>
        <CardDescription>Review and manage startup incubator applications.</CardDescription>
        <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by ID, name, or email..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matricule</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No requests found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.matricule}</TableCell>
                  <TableCell>{`${request.first_name_ar} ${request.last_name_ar}`}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleViewRequest(request)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-green-500 hover:text-green-700"
                        onClick={() => handleApproveRequest(request.id)}
                        disabled={request.status === "confirmed"}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span className="sr-only">Approve</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRejectRequest(request.id)}
                        disabled={request.status === "declined"}
                      >
                        <XCircle className="h-4 w-4" />
                        <span className="sr-only">Reject</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {selectedRequest && (
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Request Details</DialogTitle>
                <DialogDescription>
                  Application request from {selectedRequest.first_name_ar} {selectedRequest.last_name_ar}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Matricule:</span>
                  <span className="col-span-3">{selectedRequest.matricule}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Name:</span>
                  <span className="col-span-3">
                    {selectedRequest.first_name_ar} {selectedRequest.last_name_ar}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="col-span-3">{selectedRequest.email}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Status:</span>
                  <span className="col-span-3">{getStatusBadge(selectedRequest.status)}</span>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <span className="text-sm font-medium">Idea:</span>
                  <div className="col-span-3 border rounded-md p-2 bg-muted/50">
                    <p className="text-sm">{selectedRequest.idea}</p>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex justify-between sm:justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-green-500 hover:text-green-700"
                    onClick={() => handleApproveRequest(selectedRequest.id)}
                    disabled={selectedRequest.status === "confirmed"}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRejectRequest(selectedRequest.id)}
                    disabled={selectedRequest.status === "declined"}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </CardContent>
    </Card>
  )
}
