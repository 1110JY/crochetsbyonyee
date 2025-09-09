"use client"

import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Category } from "@/lib/supabase/products"

interface CategoryFilterProps {
  categories: Category[]
  currentCategory?: string
}

export function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
  const router = useRouter()

  return (
    <div className="flex justify-end relative">
      <Select
        defaultValue={currentCategory || "all"}
        onValueChange={(value) => {
          if (value === "all") {
            router.push("/products")
          } else {
            router.push(`/products/${value}`)
          }
        }}
      >
        <SelectTrigger className="w-[180px] bg-background border-primary/20 placeholder:text-gray-400">
          <SelectValue placeholder="Select category" className="placeholder:text-gray-400" />
        </SelectTrigger>
        <SelectContent 
          className="z-[100]" 
          side="bottom" 
          align="end" 
          sideOffset={4}
          avoidCollisions={false}
          position="popper"
        >
          <SelectItem value="all">All Products</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.slug}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
