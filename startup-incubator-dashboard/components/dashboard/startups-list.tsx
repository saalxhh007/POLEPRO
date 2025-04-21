"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Filter } from "lucide-react"
import { StartupFormDialog } from "./add-startup-form"

export function StartupsList() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [startups, setStartups] = useState<any[]>([])

  const fetchStartups = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/startup/`);
      const data = await res.json();
      console.log(data);
      
      if (data.status && Array.isArray(data.data)) {
        setStartups(data.data);
      } else {
        setStartups([]);
      }
    } catch (error) {
      console.error('Failed to fetch startups:', error);
    }
  };

  const filteredStartups = startups.filter(
    (startup) =>
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.founders.toLowerCase().includes(searchQuery.toLowerCase()),
  ) 

  const removeStartup = async (projectId: number) => {
    try {
    const res = await fetch(`${apiUrl}/api/startup/${projectId}`, {
      method: 'DELETE',
    });
      
      const result = await res.json();
      
    if (res.ok) {
      alert('Startup deleted successfully!');
      fetchStartups();
    } else {
      alert(result.message || 'Failed to delete startup');
    }
    } catch (error) {
      
    }
  }
  useEffect(() => {
    fetchStartups();
  }, []);
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search startups..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <StartupFormDialog />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Founders</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStartups.length > 0 ? (
                filteredStartups.map((startup) => (
                  <TableRow key={startup.id}>
                    <TableCell className="font-medium">{startup.name}</TableCell>
                    <TableCell>{startup.industry}</TableCell>
                    <TableCell>{startup.stage}</TableCell>
                    <TableCell>{startup.founders}</TableCell>
                    <TableCell>{startup.joinDate}</TableCell>
                    <TableCell>
                      <Badge variant={startup.status === "active" ? "default" : "destructive"}>
                        {startup.status === "active" ? "Active" : "Warning"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit startup</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Assign mentor</DropdownMenuItem>
                          <DropdownMenuItem>Schedule meeting</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={()=>removeStartup(startup.project_id)} className="text-destructive">Remove from program</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No startups found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}