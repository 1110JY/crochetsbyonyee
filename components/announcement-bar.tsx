"use client"

export function AnnouncementBar() {
  const message = "Worldwide Shipping Available"
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-purple-500 text-white overflow-hidden whitespace-nowrap">
      <div className="py-2">
        <div className="animate-marquee inline-block">
          <span className="text-sm font-medium">
            {Array(20).fill(null).map((_, i) => (
              <span key={i}>
                {message}
                <span className="mx-6">🌍</span>
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  )
}
