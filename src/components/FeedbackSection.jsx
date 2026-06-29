/**
 * FeedbackSection.jsx
 * "Was this helpful?" feedback component with star rating and optional comment.
 * Uses the local friend tone: "Did I get the vibe right?"
 */

import { useState } from 'react'
import { submitFeedback } from '../services/api.js'

const STARS = [1, 2, 3, 4, 5]
const LABELS = ['Not really', 'Kinda', 'Pretty good', 'Great!', 'Perfect! 🙌']

export default function FeedbackSection({ itineraryId, source = 'results_page' }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return
    setSending(true)
    const result = await submitFeedback({ itinerary_id: itineraryId, rating, comment, source })
    if (result.success) setSubmitted(true)
    setSending(false)
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <p className="text-teal font-medium text-sm">🙌 Thanks — you're the best!</p>
        <p className="text-text-muted text-xs mt-1">Your vibe helps us get better.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[12px] p-5 shadow-card mt-8">
      <p className="text-text-primary font-heading font-semibold text-sm mb-1">
        Did I get the vibe right? 🎯
      </p>
      <p className="text-text-muted text-xs mb-3">
        Your feedback helps me plan even better adventures.
      </p>

      {/* Star rating */}
      <div className="flex items-center gap-1 mb-4">
        {STARS.map((star) => {
          const filled = star <= (hovered || rating)
          return (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="cursor-pointer transition-transform hover:scale-110"
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <svg className={`w-7 h-7 ${filled ? 'text-amber' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          )
        })}
        {rating > 0 && (
          <span className="text-xs text-text-muted ml-1">{LABELS[rating - 1]}</span>
        )}
      </div>

      {/* Comment box */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Anything you'd change? (optional)"
        rows={2}
        className="w-full px-3 py-2 rounded-[8px] border-2 border-gray-200 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-teal resize-none mb-3"
      />

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || sending}
        className="px-4 py-2 rounded-[8px] bg-teal hover:brightness-90 disabled:opacity-40 text-white text-sm font-medium transition-all cursor-pointer disabled:cursor-not-allowed"
      >
        {sending ? 'Sending...' : 'Send Feedback ✨'}
      </button>
    </div>
  )
}