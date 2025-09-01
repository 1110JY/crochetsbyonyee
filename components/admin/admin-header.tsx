"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, User } from "lucide-react"

interface AdminHeaderProps {
  title: string
  description?: string
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  return (
    <div className="bg-white border-b border-amber-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-amber-900">{title}</h1>
          {description && <p className="text-amber-700 mt-1">{description}</p>}
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-50">
            <Bell className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
              Admin
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
