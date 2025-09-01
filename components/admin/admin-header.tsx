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
    <div className="p-8">
      <h1 className="text-4xl font-serif font-light text-foreground mb-2">{title}</h1>
      <p className="text-lg text-muted-foreground mb-6">{description}</p>
      {children}
    </div>
  )
}
