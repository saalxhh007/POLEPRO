"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RootState } from "@/store";
import axios from "axios";
import { Briefcase, Users, TrendingUp, LucideIcon } from "lucide-react"
import { headers } from "next/headers";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";

export function Overview() {
  type Trend = "up" | "down" | "neutral";
  type Stat = {
    title: string;
    value: string;
    icon: React.ElementType;
    description: string;
    trend: Trend;
  };
  const [stats, setStats] = useState<Stat[]>([])
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const fetchStats = async () => {
    axios
      .get(`${apiUrl}/api/stats`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(response => {
        if (response.data.success) {
        const counters = {
          startups: 0,
          mentors: 0,
          students: 0,
        };
        (response.data.data).forEach((item :  { counted_obj: string; counter: number }) => {
          if (item.counted_obj in counters) {
            counters[item.counted_obj as keyof typeof counters] = item.counter;
          }
        });
        const mappedStats: Stat[] = [
          {
            title: "Active Startups",
            value: counters.startups.toString(),
            icon: Briefcase,
            description: "+2 this month",
            trend: "up" as const,
          },
          {
            title: "Mentors",
            value: counters.mentors.toString(),
            icon: Users,
            description: "+5 this month",
            trend: "up" as const,
          },
          {
            title: "Students",
            value: counters.students.toString(),
            icon: Users,
            description: "New program coming",
            trend: "neutral" as const,
          },
          {
            title: "Success Rate",
            value: "68%",
            icon: TrendingUp,
            description: "+4% from last year",
            trend: "up" as const,
          },
        ];
        
        setStats(mappedStats);
      }
      })
      .catch(err => {
        console.error("Failed to fetch stats:", err);
    })
  }

    useEffect(() => {
      fetchStats()
    }, [])

    return (
      <>
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </>
    )
  }
