"use client"
import type { Metadata } from "next"
import { MessagingInterface } from "@/components/dashboard/messaging-interface"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useRouter } from "next/navigation"

export default function MessagingPage() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const role = useSelector((state: RootState) => state.auth.role);
  const router = useRouter()
  useEffect(() => {
    console.log(isAuthenticated);
    
    if (!isAuthenticated || role !== 'admin') {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, role, router]);
  
  if (!isAuthenticated || role !== 'admin') {
    return null;
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Messagerie</h1>
      </div>
      <div className="grid gap-4">
        <MessagingInterface />
      </div>
    </div>
  )
}

