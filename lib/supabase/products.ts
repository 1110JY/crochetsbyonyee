import {
  mockCategories,
  mockProducts,
  type Product as MockProduct,
  type Category as MockCategory,
} from "@/lib/mock-data"

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number | null
  category_id: string | null
  images: string[] | null
  materials: string[] | null
  dimensions: string | null
  care_instructions: string | null
  is_featured: boolean
  is_available: boolean
  stock_quantity: number
  created_at: string
  updated_at: string
  categories?: {
    id: string
    name: string
    slug: string
    description: string | null
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

function convertMockProduct(mockProduct: MockProduct): Product {
  const category = mockCategories.find((cat) => cat.id === mockProduct.category_id)
  return {
    id: mockProduct.id,
    name: mockProduct.name,
    slug: mockProduct.name.toLowerCase().replace(/\s+/g, "-"),
    description: mockProduct.description,
    price: mockProduct.price,
    category_id: mockProduct.category_id,
    images: [mockProduct.image_url],
    materials: ["Cotton yarn", "Polyester filling"],
    dimensions: "Various sizes available",
    care_instructions: "Hand wash cold, lay flat to dry",
    is_featured: mockProduct.is_featured,
    is_available: true,
    stock_quantity: 10,
    created_at: mockProduct.created_at,
    updated_at: mockProduct.created_at,
    categories: category
      ? {
          id: category.id,
          name: category.name,
          slug: category.name.toLowerCase().replace(/\s+/g, "-"),
          description: category.description,
        }
      : undefined,
  }
}

function convertMockCategory(mockCategory: MockCategory): Category {
  return {
    id: mockCategory.id,
    name: mockCategory.name,
    slug: mockCategory.name.toLowerCase().replace(/\s+/g, "-"),
    description: mockCategory.description,
    image_url: null,
    created_at: mockCategory.created_at,
    updated_at: mockCategory.created_at,
  }
}

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  let products = mockProducts.map(convertMockProduct)

  if (categorySlug) {
    const category = mockCategories.find((cat) => cat.name.toLowerCase().replace(/\s+/g, "-") === categorySlug)
    if (category) {
      products = products.filter((product) => product.category_id === category.id)
    }
  }

  return products
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const mockProduct = mockProducts.find((product) => product.name.toLowerCase().replace(/\s+/g, "-") === slug)

  return mockProduct ? convertMockProduct(mockProduct) : null
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  return mockProducts
    .filter((product) => product.is_featured)
    .map(convertMockProduct)
    .slice(0, 6)
}

export async function getCategories(): Promise<Category[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  return mockCategories.map(convertMockCategory)
}
