import { useState, useEffect, useRef } from 'react'

/**
 * Loading Screen (Screen 3)
 * Delightful wait state while AI generates the itinerary.
 * Shows rotating fun messages and auto-completes.
 */
export default function LoadingPage({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [isLongWait, setIsLongWait] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const timerRef = useRef(null)
  const longWaitRef = useRef(null)
  const msgTimerRef = useRef(null)

  // Rotating fun messages
  const messages = [
    { line: "Finding your vibe...", sub: "Scanning the city for hidden gems..." },
    { line: "Asking locals...", sub: "Our local friends know the best spots..." },
    { line: "Planning your route...", sub: "Optimizing the perfect timeline for you..." },
    { line: "Checking the weather...", sub: "Making sure the timing is just right..." },
    { line: "Curating experiences...", sub: "Hand-picking activities that match your mood..." },
    { line: "Almost there...", sub: "Double-checking every detail of your adventure..." },
  ]

  useEffect(() => {
    // Rotate messages every 2.5 seconds
    msgTimerRef.current = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 2500)

    // Animate progress bar from 0→100% over ~3 seconds
    const duration = 3000
    const interval = 30
    const step = 100 / (duration / interval)

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step
        if (next >= 100) {
          clearInterval(timerRef.current)
          clearInterval(msgTimerRef.current)
          clearTimeout(longWaitRef.current)
          setTimeout(() => onComplete?.(), 300)
          return 100
        }
        return next
      })
    }, interval)

    // If >6 seconds, show "Still working on it..."
    longWaitRef.current = setTimeout(() => {
      setIsLongWait(true)
    }, 6000)

    return () => {
      clearInterval(timerRef.current)
      clearInterval(msgTimerRef.current)
      clearTimeout(longWaitRef.current)
    }
  }, [onComplete])

  // Sparkle particles
  const sparkles = [
    { left: '15%', top: '35%', delay: '0s', size: '6px' },
    { left: '65%', top: '30%', delay: '0.4s', size: '4px' },
    { left: '40%', top: '70%', delay: '0.8s', size: '5px' },
    { left: '75%', top: '55%', delay: '1.2s', size: '3px' },
    { left: '25%', top: '60%', delay: '0.6s', size: '4px' },
    { left: '55%', top: '25%', delay: '1.0s', size: '5px' },
    { left: '20%', top: '45%', delay: '0.3s', size: '3px' },
    { left: '80%', top: '40%', delay: '0.7s', size: '4px' },
  ]

  const currentMsg = isLongWait
    ? { line: 'Still finding your vibe...', sub: "We're curating the perfect experience. Almost there!" }
    : messages[messageIndex]

  return (
    <div className="fixed inset-0 bg-navy flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Sparkle particles */}
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-0 animate-sparkle-float"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            backgroundColor: i % 2 === 0 ? '#0A9B8C' : '#FF6B5B',
            animationDelay: s.delay,
            animationDuration: '2.5s',
          }}
        />
      ))}

      {/* Logo with glow */}
      <div className="relative mb-8">
        <div className="absolute -inset-8 rounded-full bg-teal/10 animate-spin-slow" />
        <div className="absolute -inset-4 rounded-full bg-teal/20 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '4s' }} />
        <div className="relative w-20 h-20 animate-pulse-logo">
          <img src="/logo-icon.png" alt="VibeVoyage AI" className="w-full h-full" />
        </div>
      </div>

      {/* Rotating Headline */}
      <h2 key={currentMsg.line} className="text-white font-heading font-bold text-xl md:text-2xl text-center px-4 mb-2 animate-fade-in">
        {currentMsg.line}
      </h2>

      {/* Subtext */}
      <p className="text-text-muted text-sm font-body text-center max-w-xs px-4 mb-12">
        {currentMsg.sub}
      </p>

      {/* Progress bar */}
      <div className="w-48 md:w-64 h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200 ease-out"
          style={{
            width: `${Math.min(progress, 100)}%`,
            background: 'linear-gradient(90deg, #0A9B8C, #FF6B5B)',
          }}
        />
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-logo {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
        @keyframes sparkle-float {
          0% { transform: translateY(20px); opacity: 0; }
          30% { opacity: 0.8; }
          70% { opacity: 0.6; }
          100% { transform: translateY(-60px); opacity: 0; }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-pulse-logo { animation: pulse-logo 2s ease-in-out infinite; }
        .animate-sparkle-float { animation: sparkle-float 2.5s ease-out infinite; }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </div>
  )
}