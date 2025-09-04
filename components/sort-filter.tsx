"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "alphabetical", label: "A-Z" },
]

interface SortFilterProps {
  currentSort?: string
}

export function SortFilter({ currentSort }: SortFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === "newest") {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }

    const queryString = params.toString()
    const currentPath = window.location.pathname
    
    router.push(queryString ? `${currentPath}?${queryString}` : currentPath)
    router.refresh()
  }

  return (
    <div className="flex justify-end relative">
      <Select
        defaultValue={currentSort || "newest"}
        onValueChange={handleSortChange}
      >
        <SelectTrigger className="w-[180px] bg-background border-primary/20">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent 
          className="z-[100]" 
          side="bottom" 
          align="end" 
          sideOffset={4}
          avoidCollisions={false}
          position="popper"
        >
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
