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
import type { RootState } from "@/store"
import { useSelector } from "react-redux"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type StudentRequest = {
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

type ResourceRequest = {
  id: string
  startup_id: string
  startup_name: string
  owner_name: string
  email: string
  resource_type: string
  description: string
  quantity: number
  requested_date: string
  status: "pending" | "approved" | "rejected"
}

export function RequestsList() {
  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>([])
  const [resourceRequests, setResourceRequests] = useState<ResourceRequest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudentRequest, setSelectedStudentRequest] = useState<StudentRequest | null>(null)
  const [selectedResourceRequest, setSelectedResourceRequest] = useState<ResourceRequest | null>(null)
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false)
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("students")

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  
  const fetchStudentRequests = () => {
    axios
      .get(`${apiUrl}/api/user/approval/all-pending`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setStudentRequests(response.data)
      })
      .catch((err) => {
        toast.error("Failed to fetch student requests")
      })
  }

  const fetchResourceRequests = () => {
    axios
      .get(`${apiUrl}/api/resources/requests`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setResourceRequests(response.data)
      })
      .catch((err) => {
        toast.error("Failed to fetch resource requests")
      })
  }

  const filteredStudentRequests = studentRequests.filter(
    (request) =>
      request.matricule.includes(searchQuery) ||
      request.email.includes(searchQuery) ||
      request.first_name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.last_name_ar.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredResourceRequests = resourceRequests.filter(
    (request) =>
      request.startup_id.includes(searchQuery) ||
      request.email.includes(searchQuery) ||
      request.startup_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.resource_type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewStudentRequest = (request: StudentRequest) => {
    setSelectedStudentRequest(request)
    setIsStudentDialogOpen(true)
  }

  const handleViewResourceRequest = (request: ResourceRequest) => {
    setSelectedResourceRequest(request)
    setIsResourceDialogOpen(true)
  }

  const handleApproveStudentRequest = (id: string) => {
  const loadingToast = toast.loading("Approving request...");
    axios
      .post(
        `${apiUrl}/api/user/approval/review-student/${id}`,
        { decision: "approve" },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Request Approved Successfully", { id: loadingToast })
          setResourceRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== id)
          );
          if (selectedStudentRequest?.id === id) {
            setSelectedStudentRequest({ ...selectedStudentRequest, status: "confirmed" })
          }
          fetchStudentRequests()
        }
      })
      .catch((err) => {
        console.log(err);
        
        toast.error("Failed To Approve Request", { id: loadingToast });
      })
  }

  const handleRejectStudentRequest = (id: string) => {
    const loadingToast = toast.loading("Rejecting request...");
    axios
      .post(
        `${apiUrl}/api/user/approval/review-student/${id}`,
        { decision: "reject" },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then((response) => {
        if (response.data.success) {
          setStudentRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== id)
          );
          if (selectedStudentRequest?.id === id) {
            setSelectedStudentRequest({ ...selectedStudentRequest, status: "declined" })
            toast.success("Request Declined Successfully", { id: loadingToast });
          }
          fetchStudentRequests()
        }
      })
      .catch(() => {
        toast.error("Failed To Decline Request", { id: loadingToast });
      })
  }

  const handleApproveResourceRequest = (id: string) => {
    axios
      .post(
        `${apiUrl}/api/resources/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then((response) => {
        toast.success("Resource Request Approved Successfully")
        setResourceRequests((prevRequests) =>
          prevRequests.map((request) => (request.id === id ? { ...request, status: "approved" } : request)),
        )
        if (selectedResourceRequest?.id === id) {
          setSelectedResourceRequest({ ...selectedResourceRequest, status: "approved" })
        }
      })
      .catch((err) => {
        toast.error("Failed To Approve Resource Request")
      })
  }

  const handleRejectResourceRequest = (id: string) => {
    axios
      .post(
        `${apiUrl}/api/resources/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then((response) => {
        toast.success("Resource Request Rejected Successfully")
        setResourceRequests((prevRequests) =>
          prevRequests.map((request) => (request.id === id ? { ...request, status: "rejected" } : request)),
        )
        if (selectedResourceRequest?.id === id) {
          setSelectedResourceRequest({ ...selectedResourceRequest, status: "rejected" })
        }
      })
      .catch((err) => {
        toast.error("Failed To Reject Resource Request")
      })
  }

  const getStudentStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
      case "declined":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const getResourceStatusBadge = (status: string) => {
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
    fetchStudentRequests()
    fetchResourceRequests()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application & Resource Requests</CardTitle>
        <CardDescription>Review and manage startup incubator applications and resource requests.</CardDescription>
        <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by ID, name, email, or resource type..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="students" onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="students">Student Applications</TabsTrigger>
            <TabsTrigger value="resources">Resource Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
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
                {filteredStudentRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No student requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudentRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.matricule}</TableCell>
                      <TableCell>{`${request.first_name_ar} ${request.last_name_ar}`}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{getStudentStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleViewStudentRequest(request)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-green-500 hover:text-green-700"
                            onClick={() => handleApproveStudentRequest(request.id)}
                            disabled={request.status === "confirmed"}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRejectStudentRequest(request.id)}
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
          </TabsContent>

          <TabsContent value="resources">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Startup</TableHead>
                  <TableHead>Resource Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResourceRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No resource requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResourceRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.startup_name}</TableCell>
                      <TableCell>{request.resource_type}</TableCell>
                      <TableCell>{request.quantity}</TableCell>
                      <TableCell>{getResourceStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleViewResourceRequest(request)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-green-500 hover:text-green-700"
                            onClick={() => handleApproveResourceRequest(request.id)}
                            disabled={request.status === "approved"}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRejectResourceRequest(request.id)}
                            disabled={request.status === "rejected"}
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
          </TabsContent>
        </Tabs>

        {/* Student Request Dialog */}
        <Dialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen}>
          {selectedStudentRequest && (
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Student Application Details</DialogTitle>
                <DialogDescription>
                  Application request from {selectedStudentRequest.first_name_ar} {selectedStudentRequest.last_name_ar}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Matricule:</span>
                  <span className="col-span-3">{selectedStudentRequest.matricule}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Name:</span>
                  <span className="col-span-3">
                    {selectedStudentRequest.first_name_ar} {selectedStudentRequest.last_name_ar}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="col-span-3">{selectedStudentRequest.email}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Status:</span>
                  <span className="col-span-3">{getStudentStatusBadge(selectedStudentRequest.status)}</span>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <span className="text-sm font-medium">Idea:</span>
                  <div className="col-span-3 border rounded-md p-2 bg-muted/50">
                    <p className="text-sm">{selectedStudentRequest.idea}</p>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex justify-between sm:justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-green-500 hover:text-green-700"
                    onClick={() => handleApproveStudentRequest(selectedStudentRequest.id)}
                    disabled={selectedStudentRequest.status === "confirmed"}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRejectStudentRequest(selectedStudentRequest.id)}
                    disabled={selectedStudentRequest.status === "declined"}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setIsStudentDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>

        {/* Resource Request Dialog */}
        <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
          {selectedResourceRequest && (
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Resource Request Details</DialogTitle>
                <DialogDescription>Resource request from {selectedResourceRequest.startup_name}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Startup ID:</span>
                  <span className="col-span-3">{selectedResourceRequest.startup_id}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Startup:</span>
                  <span className="col-span-3">{selectedResourceRequest.startup_name}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Owner:</span>
                  <span className="col-span-3">{selectedResourceRequest.owner_name}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="col-span-3">{selectedResourceRequest.email}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Resource:</span>
                  <span className="col-span-3">{selectedResourceRequest.resource_type}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <span className="col-span-3">{selectedResourceRequest.quantity}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Date:</span>
                  <span className="col-span-3">
                    {new Date(selectedResourceRequest.requested_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Status:</span>
                  <span className="col-span-3">{getResourceStatusBadge(selectedResourceRequest.status)}</span>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <span className="text-sm font-medium">Description:</span>
                  <div className="col-span-3 border rounded-md p-2 bg-muted/50">
                    <p className="text-sm">{selectedResourceRequest.description}</p>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex justify-between sm:justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-green-500 hover:text-green-700"
                    onClick={() => handleApproveResourceRequest(selectedResourceRequest.id)}
                    disabled={selectedResourceRequest.status === "approved"}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRejectResourceRequest(selectedResourceRequest.id)}
                    disabled={selectedResourceRequest.status === "rejected"}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setIsResourceDialogOpen(false)}>
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
