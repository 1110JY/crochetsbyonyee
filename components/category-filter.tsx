"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/supabase/products"

interface CategoryFilterProps {
  categories: Category[]
  currentCategory?: string
}

export function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      <Button
        asChild
        variant={!currentCategory ? "default" : "outline"}
        className={
          !currentCategory
            ? "bg-amber-600 hover:bg-amber-700 text-white"
            : "border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
        }
      >
        <Link href="/products">All Products</Link>
      </Button>

      {categories.map((category) => (
        <Button
          key={category.id}
          asChild
          variant={currentCategory === category.slug ? "default" : "outline"}
          className={
            currentCategory === category.slug
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : "border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
          }
        >
          <Link href={`/products/${category.slug}`}>{category.name}</Link>
        </Button>
      ))}
    </div>
  )
}
