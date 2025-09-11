"use client"

import { useEffect, useRef, useState } from "react"

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  duration?: number
  delay?: number
  className?: string
  threshold?: number
}

export function ScrollReveal({ 
  children, 
  direction = 'up', 
  distance = 30, 
  duration = 0.6, 
  delay = 0,
  className = "",
  threshold = 0.1
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay * 1000)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay, threshold])

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)'
    
    switch (direction) {
      case 'up':
        return `translate(0, ${distance}px)`
      case 'down':
        return `translate(0, -${distance}px)`
      case 'left':
        return `translate(${distance}px, 0)`
      case 'right':
        return `translate(-${distance}px, 0)`
      default:
        return `translate(0, ${distance}px)`
    }
  }

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionDuration: `${duration}s`,
        transitionProperty: 'opacity, transform'
      }}
    >
      {children}
    </div>
  )
}
