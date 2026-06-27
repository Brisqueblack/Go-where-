/**
 * useItineraryGenerator.js
 * React hook for generating and managing itineraries from the UI.
 *
 * Usage:
 *   const { generate, itinerary, loading, error } = useItineraryGenerator()
 *   await generate({ destination: 'NYC', duration_days: 2 })
 */

import { useState, useCallback } from 'react'
import { generateItinerary as apiGenerate } from '../services/api.js'

/**
 * @typedef {object} GeneratorState
 * @property {boolean} loading
 * @property {object|null} itinerary
 * @property {string|null} error
 * @property {number|null} elapsedMs
 * @property {function} generate
 * @property {function} reset
 */

/**
 * Hook for itinerary generation.
 * @returns {GeneratorState}
 */
export function useItineraryGenerator() {
  const [loading, setLoading] = useState(false)
  const [itinerary, setItinerary] = useState(null)
  const [error, setError] = useState(null)
  const [elapsedMs, setElapsedMs] = useState(null)

  const generate = useCallback(async (inputs) => {
    setLoading(true)
    setError(null)
    setItinerary(null)

    const start = performance.now()

    try {
      const result = await apiGenerate({
        destination: inputs.destination,
        duration_days: inputs.duration_days || 1,
        budget_level: inputs.budget_level || 'moderate',
        vibes: inputs.vibes || 'balanced',
        preferences: inputs.preferences || '',
      })

      if (result.success) {
        setItinerary(result.data)
        setElapsedMs(result.meta?.elapsed_ms || Math.round(performance.now() - start))
      } else {
        setError(result.error || 'Generation failed')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setItinerary(null)
    setError(null)
    setLoading(false)
    setElapsedMs(null)
  }, [])

  return { loading, itinerary, error, elapsedMs, generate, reset }
}

export default useItineraryGenerator