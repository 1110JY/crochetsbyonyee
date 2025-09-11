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
    <div className="flex justify-start sm:justify-end relative">
      <Select
        defaultValue={currentSort || "newest"}
        onValueChange={handleSortChange}
      >
        <SelectTrigger className="w-full sm:w-[180px] bg-white border-2 border-gray-200 hover:border-primary/40 focus:border-primary shadow-sm text-gray-900 font-medium">
          <SelectValue placeholder="Sort by" className="text-gray-600" />
        </SelectTrigger>
        <SelectContent 
          className="z-[100] bg-white border-2 border-gray-200 shadow-lg rounded-lg" 
          side="bottom" 
          align="start" 
          sideOffset={4}
          avoidCollisions={false}
          position="popper"
        >
          {sortOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="text-gray-900 hover:bg-primary/10 focus:bg-primary/10 py-3 cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
