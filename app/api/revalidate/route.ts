import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const paths = request.nextUrl.searchParams.get("path")?.split(",") || ["/"]
    
    // Revalidate all provided paths
    paths.forEach(path => {
      revalidatePath(path)
    })

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: "Failed to revalidate" }, { status: 500 })
  }
}
