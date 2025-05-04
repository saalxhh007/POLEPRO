"use client"
import { TrainingsList } from "@/components/dashboard/trainings-list"
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { RootState } from "@/store";

export default function TrainingsPage() {
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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Formations</h1>
        <p className="text-muted-foreground">Gérez les formations proposées par l'incubateur</p>
      </div>
      <TrainingsList />
    </div>
  )
}

