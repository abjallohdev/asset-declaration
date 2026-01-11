"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop",
    quote: "Restoring public trust through transparency.",
    author: "Anti-Corruption Commission"
  },
  {
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2670&auto=format&fit=crop",
    quote: "Ensuring integrity and accountability for all public officials.",
    author: "Asset Declaration System"
  },
  {
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop",
    quote: "A modern platform for a transparent future.",
    author: "Digital Governance Initiative"
  }
]

export function AuthCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-900 text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: `url(${SLIDES[current].image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col justify-end p-10">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <blockquote className="space-y-2">
            <p className="text-2xl font-medium leading-relaxed">
              &ldquo;{SLIDES[current].quote}&rdquo;
            </p>
            <footer className="text-sm font-medium opacity-80">
              - {SLIDES[current].author}
            </footer>
          </blockquote>
        </motion.div>
        
        <div className="mt-8 flex gap-2">
            {SLIDES.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
      </div>
    </div>
  )
}
