/**
 * api.js
 * Frontend API client for the VibeVoyage AI backend.
 * All calls are proxied through Vite's /api -> http://127.0.0.1:8000
 */

const API_BASE = '/api'

/**
 * Generate an itinerary from user inputs.
 * @param {object} params
 * @param {string} params.destination
 * @param {number} params.duration_days
 * @param {string} params.budget_level
 * @param {string} params.vibes
 * @param {string} params.preferences
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function generateItinerary(params) {
  try {
    const res = await fetch(`${API_BASE}/itineraries/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    return res.json()
  } catch (err) {
    return { success: false, error: `Network error: ${err.message}` }
  }
}

/**
 * Fetch an itinerary by ID.
 * @param {number} id
 * @returns {Promise<object>}
 */
export async function getItinerary(id) {
  const res = await fetch(`${API_BASE}/itineraries/${id}`)
  return res.json()
}

/**
 * List recent itineraries.
 * @returns {Promise<Array>}
 */
export async function listItineraries() {
  const res = await fetch(`${API_BASE}/itineraries`)
  return res.json()
}

/**
 * Health check.
 * @returns {Promise<object>}
 */
export async function healthCheck() {
  const res = await fetch(`${API_BASE}/health`)
  return res.json()
}

export default { generateItinerary, getItinerary, listItineraries, healthCheck }