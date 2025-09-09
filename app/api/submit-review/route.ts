import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  console.log("=== Review submission started ===")
  try {
    // Parse form data for file uploads
    console.log("Parsing form data...")
    const formData = await request.formData()
    
    const rating = Number(formData.get('rating'))
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const customerName = formData.get('customerName') as string
    const email = formData.get('email') as string
    
    console.log("Received review data:", { rating, title, content, customerName, email })

    // Validate required fields
    if (!rating || !content || !customerName || !email) {
      console.log("Missing required fields")
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate rating is between 1-5
    if (rating < 1 || rating > 5) {
      console.log("Invalid rating")
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    console.log("Creating Supabase client...")
    const supabase = await createClient()

    // Combine title and content for the existing content field
    const reviewContent = title ? `${title}\n\n${content}` : content
    // Store only the customer name, not the email (email is private)
    const reviewerName = customerName

    console.log("Inserting to database:", { 
      customer_name: reviewerName, 
      content: reviewContent, 
      rating,
      is_published: false 
    })

    // Insert the review as an unpublished testimonial for admin review
    const insertData = {
      customer_name: reviewerName,
      content: reviewContent,
      rating,
      is_published: false, // Reviews need admin approval
      is_featured: false,
    }

    const { data, error } = await supabase
      .from("testimonials")
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      console.error("Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json(
        { 
          error: "Failed to submit review", 
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      )
    }

    console.log("Successfully inserted review:", data)

    return NextResponse.json(
      { 
        message: "Review submitted successfully! It will be published after moderation.",
        review: data,
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Error in review submission:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
