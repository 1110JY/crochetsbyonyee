export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category_id: string
  is_featured: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  description: string
  created_at: string
}

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Baby Items",
    description: "Soft and gentle crochet items for babies",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Home Decor",
    description: "Beautiful decorative pieces for your home",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Accessories",
    description: "Stylish crochet accessories and wearables",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Seasonal",
    description: "Holiday and seasonal decorations",
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Custom Orders",
    description: "Personalized crochet creations made to order",
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Gift Sets",
    description: "Curated collections perfect for gifting",
    created_at: new Date().toISOString(),
  },
]

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Soft Baby Blanket",
    description: "Ultra-soft crochet blanket perfect for newborns",
    price: 45.0,
    image_url: "/soft-baby-crochet-blanket.png",
    category_id: "1",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Elegant Table Runner",
    description: "Beautiful handcrafted table runner for special occasions",
    price: 35.0,
    image_url: "/elegant-crochet-home-decoration.png",
    category_id: "2",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Stylish Handbag",
    description: "Trendy crochet handbag with wooden handles",
    price: 28.0,
    image_url: "/stylish-crochet-accessories.png",
    category_id: "3",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Holiday Wreath",
    description: "Festive crochet wreath for seasonal decoration",
    price: 32.0,
    image_url: "/seasonal-crochet-decorations.png",
    category_id: "4",
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Custom Pet Sweater",
    description: "Made-to-measure sweater for your beloved pet",
    price: 25.0,
    image_url: "/custom-crochet-creations.png",
    category_id: "5",
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Baby Gift Set",
    description: "Complete set with blanket, hat, and booties",
    price: 65.0,
    image_url: "/crochet-gift-collection.png",
    category_id: "6",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
]

// Mock functions that match the database API
export async function getCategories(): Promise<Category[]> {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockCategories
}

export async function getProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockProducts
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockProducts.filter((product) => product.is_featured)
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockProducts.filter((product) => product.category_id === categoryId)
}
