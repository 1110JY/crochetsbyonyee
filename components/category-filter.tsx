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
            ? "bg-primary/90 hover:bg-primary text-primary-foreground"
            : "border-primary/20 hover:border-primary/30 text-muted-foreground hover:text-foreground"
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
              ? "bg-primary/90 hover:bg-primary text-primary-foreground"
              : "border-primary/20 hover:border-primary/30 text-muted-foreground hover:text-foreground"
          }
        >
          <Link href={`/products/${category.slug}`}>{category.name}</Link>
        </Button>
      ))}
    </div>
  )
}
