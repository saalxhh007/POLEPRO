"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { error } from "console"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

interface RecentStartupsProps {
  className?: string
}

export function RecentStartups({ className }: RecentStartupsProps) {
  const [startups, setStartups] = useState<any[] | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    setHasMounted(true)

    const fetchRecentStartups = async () => {
      axios
        .get(`${apiUrl}/api/startup/recent`,{ headers: {
          Authorization: `Bearer ${accessToken}`,
        }})
        .then(res => {
          console.log(res);
          setStartups(res.data)
        })
      .catch(error => {
        console.error("Error fetching recent startups:", error)
        setStartups([])
      })
    }

    fetchRecentStartups()
  }, [])

  if (!hasMounted) return null

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Startups</CardTitle>
        <CardDescription>
          You have {startups?.length || 0} startups in your current cohort.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {startups?.length ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {startups.map((startup) => (
                  <TableRow key={startup.project_id}>
                    <TableCell className="font-medium">{startup.name}</TableCell>
                    <TableCell>{startup.industry}</TableCell>
                    <TableCell>{startup.stage}</TableCell>
                    <TableCell>{startup.progress}</TableCell>
                    <TableCell>
                      <Badge variant={startup.status === "active" ? "default" : "destructive"}>
                        {startup.status === "active" ? "Active" : "Warning"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/startups">
                  View all startups
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <p>No startup data available.</p>
        )}
      </CardContent>
    </Card>
  )
}
