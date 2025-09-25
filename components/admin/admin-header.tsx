"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, User } from "lucide-react"

import type { ReactNode } from "react"

interface AdminHeaderProps {
  title: string
  description: string
  children?: ReactNode
}

export function AdminHeader({ title, description, children }: AdminHeaderProps) {
  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="text-slate-600 mt-1 mb-4">{description}</p>
      {children}
    </div>
  )
}
