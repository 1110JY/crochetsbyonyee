import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Try to get paths from JSON body first
    let paths: string[] = ["/"]
    
    try {
      const body = await request.json()
      if (body.paths && Array.isArray(body.paths)) {
        paths = body.paths
      }
    } catch (e) {
      // Fallback to query parameters
      const pathParam = request.nextUrl.searchParams.get("path")
      if (pathParam) {
        paths = pathParam.split(",")
      }
    }
    
    console.log("Revalidating paths:", paths)
    
    // Revalidate all provided paths
    paths.forEach(path => {
      console.log("Revalidating path:", path)
      revalidatePath(path, 'page')
    })

    return NextResponse.json({ 
      revalidated: true, 
      paths: paths,
      now: Date.now() 
    })
  } catch (err) {
    console.error("Revalidation error:", err)
    return NextResponse.json({ 
      revalidated: false, 
      error: "Failed to revalidate",
      details: err instanceof Error ? err.message : "Unknown error"
    }, { status: 500 })
  }
}
