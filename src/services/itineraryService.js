import { buildItineraryPrompt } from './aiPromptBuilder.js'
import { parseItineraryResponse } from './responseParser.js'
import { callLLM } from './llmProvider.js'
import { saveItinerary, getVenues } from './databaseService.js'

/**
 * Generate a personalized itinerary from user inputs.
 */
export async function generateItinerary(inputs, opts = {}) {
  const startTime = Date.now()
  try {
    // 1. Fetch Exclusive Hidden Gems if user is Premium
    if (inputs.isPremium) {
      try {
        // Extract city name from destination for venue filtering
        const destLower = (inputs.destination || '').toLowerCase()
        const cityMap = {
          'new york': 'New York',
          'nyc': 'New York',
          'tokyo': 'Tokyo',
          'boston': 'Boston',
          'philadelphia': 'Philadelphia',
          'washington': 'Washington D.C.',
          'dc': 'Washington D.C.',
          'chicago': 'Chicago',
          'miami': 'Miami',
          'los angeles': 'Los Angeles',
          'la': 'Los Angeles',
          'las vegas': 'Las Vegas',
          'vegas': 'Las Vegas',
          'orlando': 'Orlando',
          'san francisco': 'San Francisco',
          'sf': 'San Francisco',
          'seattle': 'Seattle',
          'nashville': 'Nashville',
          'austin': 'Austin',
        }
        // Sort by key length (longest first) so 'las vegas' matches before 'la'
        const entries = Object.entries(cityMap).sort(([a], [b]) => b.length - a.length)
        // Use word-boundary matching so 'la' doesn't match "las vegas" or "orlando"
        const match = entries.find(([key]) => {
          const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          return new RegExp('(^|\\s|,|\\.|-|\\/)' + escaped + '($|\\s|,|\\.|-|\\/)', 'i').test(destLower)
        })
        const cityFilter = match ? match[1] : null

        if (cityFilter) {
          const venues = getVenues({ city: cityFilter, limit: 10 })
          console.log(`[Premium] Fetched ${venues.length} hidden gems for ${cityFilter}`)
          inputs.venues = venues
        } else {
          console.log(`[Premium] No venue dataset for destination "${inputs.destination}"`)
        }
      } catch (venueErr) {
        console.warn('[Itinerary] Failed to fetch venues:', venueErr.message)
      }
    }

    // 2. Build the prompt
    const prompt = buildItineraryPrompt(inputs)

    // 3. Call the LLM
    const providerName = opts.provider || 'mock'
    const llmOpts = {
      provider: providerName,
      userInputs: inputs,
      ...(providerName === 'mock' ? {} : { temperature: 0.1 }),
    }

    const response = await callLLM(prompt.full, llmOpts)

    // 4. Parse the response
    const parsed = parseItineraryResponse(response.text, {
      destination: inputs.destination,
      budget_level: inputs.budget_level,
    })

    if (!parsed.success) {
      if (opts._retried) return { success: false, error: parsed.error }
      console.warn('[Itinerary] First parse failed, retrying once...')
      return generateItinerary(inputs, { ...opts, _retried: true })
    }

    const itinerary = parsed.data

    // 5. Save to database (unless skipped)
    if (!opts.skipDb) {
      try {
        const dbResult = await saveItinerary(itinerary, inputs.user_email)
        itinerary.id = dbResult.itineraryId
      } catch (dbErr) {
        console.warn('[Itinerary] DB save failed:', dbErr.message)
      }
    }

    const elapsed = Date.now() - startTime
    return {
      success: true,
      data: itinerary,
      meta: {
        provider: providerName,
        elapsed_ms: elapsed,
        premium_content: !!(inputs.venues && inputs.venues.length > 0)
      },
    }
  } catch (err) {
    return {
      success: false,
      error: `Itinerary generation failed: ${err.message}`,
    }
  }
}

export async function quickTest() {
  return generateItinerary({
    destination: 'New York City',
    duration_days: 2,
    budget_level: 'moderate',
    vibes: 'foodie, culture',
    preferences: 'Love Italian food and jazz',
    isPremium: true
  }, { skipDb: false })
}

export default { generateItinerary, quickTest }