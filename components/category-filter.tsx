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
    <div className="flex justify-start sm:justify-end relative">
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
        <SelectTrigger className="w-full sm:w-[180px] bg-white border-2 border-gray-200 hover:border-primary/40 focus:border-primary shadow-sm text-gray-900 font-medium">
          <SelectValue placeholder="Select category" className="text-gray-600" />
        </SelectTrigger>
        <SelectContent 
          className="z-[100] bg-white border-2 border-gray-200 shadow-lg rounded-lg" 
          side="bottom" 
          align="start" 
          sideOffset={4}
          avoidCollisions={false}
          position="popper"
        >
          <SelectItem value="all" className="text-gray-900 hover:bg-primary/10 focus:bg-primary/10 py-3 cursor-pointer">All Products</SelectItem>
          {categories.map((category) => (
            <SelectItem 
              key={category.id} 
              value={category.slug}
              className="text-gray-900 hover:bg-primary/10 focus:bg-primary/10 py-3 cursor-pointer"
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
