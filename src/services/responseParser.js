/**
 * responseParser.js
 * Parses and validates the raw text response from an LLM into structured
 * itinerary data matching the schema.
 *
 * Handles:
 * - Raw JSON extraction (strips markdown fences if LLM ignores instructions)
 * - Schema validation with default filling for missing fields
 * - Graceful error reporting with line-level context
 */

/**
 * Validated itinerary item schema.
 * @typedef {object} ItineraryItem
 * @property {string} name
 * @property {string} description
 * @property {string} category
 * @property {string|null} timing
 * @property {string|null} transport
 * @property {number|null} latitude
 * @property {number|null} longitude
 * @property {number|null} estimated_cost
 * @property {string|null} booking_url
 * @property {string} time_slot
 */

/**
 * Validated itinerary day schema.
 * @typedef {object} ItineraryDay
 * @property {number} day_number
 * @property {string} theme
 * @property {ItineraryItem[]} items
 */

/**
 * Validated itinerary schema.
 * @typedef {object} ParsedItinerary
 * @property {string} title
 * @property {string} destination
 * @property {number} duration_days
 * @property {string} budget_level
 * @property {string} notes
 * @property {number} total_estimated_cost
 * @property {ItineraryDay[]} days
 */

const VALID_CATEGORIES = new Set([
  'restaurant', 'museum', 'park', 'shopping',
  'entertainment', 'outdoor', 'landmark',
])

const VALID_TIME_SLOTS = new Set(['morning', 'afternoon', 'evening'])

/**
 * Attempt to extract JSON from raw LLM output.
 * Handles: plain JSON, markdown-fenced JSON, JSON in text blocks.
 */
function extractJSON(raw) {
  if (!raw || typeof raw !== 'string') return null

  let cleaned = raw.trim()

  // Remove markdown code fences (```json ... ``` or ``` ... ```)
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim()
  }

  // Try direct parse
  try {
    return { parsed: JSON.parse(cleaned), raw: cleaned }
  } catch {
    // Try to find first { ... } block
    const braceStart = cleaned.indexOf('{')
    const braceEnd = cleaned.lastIndexOf('}')
    if (braceStart !== -1 && braceEnd > braceStart) {
      try {
        const jsonStr = cleaned.slice(braceStart, braceEnd + 1)
        return { parsed: JSON.parse(jsonStr), raw: jsonStr }
      } catch {
        return null
      }
    }
    return null
  }
}

/**
 * Normalize a single item, filling defaults for missing/invalid fields.
 */
function normalizeItem(item, index) {
  const name = typeof item.name === 'string' ? item.name.trim() : `Activity ${index + 1}`
  const category = VALID_CATEGORIES.has(item.category) ? item.category : 'landmark'
  const timeSlot = VALID_TIME_SLOTS.has(item.time_slot) ? item.time_slot : 'afternoon'

  return {
    name: name || 'Unnamed Activity',
    description: typeof item.description === 'string' ? item.description : '',
    category,
    timing: typeof item.timing === 'string' ? item.timing : null,
    transport: typeof item.transport === 'string' ? item.transport : null,
    latitude: typeof item.latitude === 'number' ? item.latitude : null,
    longitude: typeof item.longitude === 'number' ? item.longitude : null,
    estimated_cost: typeof item.estimated_cost === 'number' ? item.estimated_cost : null,
    booking_url: typeof item.booking_url === 'string' ? item.booking_url : null,
    time_slot: timeSlot,
  }
}

/**
 * Normalize a single day.
 */
function normalizeDay(day) {
  const dayNumber = typeof day.day_number === 'number' ? Math.max(1, Math.floor(day.day_number)) : 1
  const items = Array.isArray(day.items) ? day.items.map(normalizeItem) : []

  return {
    day_number: dayNumber,
    theme: typeof day.theme === 'string' ? day.theme : `Day ${dayNumber}`,
    items,
  }
}

/**
 * Parse and validate a raw LLM response into a structured itinerary.
 *
 * @param {string} rawText - Raw text from LLM
 * @param {object} [defaults] - Default values to use if parsing fails
 * @returns {{ success: boolean, data?: ParsedItinerary, error?: string }}
 */
export function parseItineraryResponse(rawText, defaults = {}) {
  const extracted = extractJSON(rawText)

  if (!extracted) {
    return {
      success: false,
      error: 'Could not extract valid JSON from LLM response.',
      data: null,
    }
  }

  const raw = extracted.parsed

  // Validate top-level fields
  const errors = []
  if (!raw.title) errors.push('Missing title')
  if (!Array.isArray(raw.days)) errors.push('Missing or invalid days array')
  else if (raw.days.length === 0) errors.push('Days array is empty')

  if (errors.length > 0) {
    return {
      success: false,
      error: `Validation errors: ${errors.join('; ')}`,
      data: null,
    }
  }

  // Normalize everything
  const days = raw.days.map(normalizeDay).sort((a, b) => a.day_number - b.day_number)
  const totalCost = raw.total_estimated_cost != null
    ? raw.total_estimated_cost
    : days.reduce((sum, d) => sum + d.items.reduce((s, i) => s + (i.estimated_cost || 0), 0), 0)

  const data = {
    title: raw.title || `${defaults.destination || 'Trip'} Adventure`,
    destination: raw.destination || defaults.destination || 'New York City',
    duration_days: days.length,
    budget_level: raw.budget_level || defaults.budget_level || 'moderate',
    notes: typeof raw.notes === 'string' ? raw.notes : '',
    total_estimated_cost: totalCost,
    days,
  }

  return { success: true, data }
}

export default { parseItineraryResponse, extractJSON }