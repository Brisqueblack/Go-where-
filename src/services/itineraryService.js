/**
 * itineraryService.js
 * Core orchestrator for AI-powered itinerary generation.
 *
 * Flow:
 *   User inputs → buildPrompt → callLLM → parseResponse → saveToDB → return
 *
 * The service abstracts over the LLM provider (mock/openai/anthropic)
 * so the UI never needs to know which provider is active.
 */

import { buildItineraryPrompt } from './aiPromptBuilder.js'
import { parseItineraryResponse } from './responseParser.js'
import { callLLM, getProvider } from './llmProvider.js'
import { saveItinerary } from './databaseService.js'

/**
 * Generate a personalized itinerary from user inputs.
 *
 * @param {object} inputs
 * @param {string} inputs.destination - Travel destination
 * @param {number} [inputs.duration_days] - Number of days (1-7)
 * @param {string} [inputs.budget_level] - "budget" | "moderate" | "luxury"
 * @param {string} [inputs.vibes] - Style/interests (e.g. "foodie", "culture")
 * @param {string} [inputs.preferences] - Additional free-text preferences
 * @param {string} [inputs.user_email] - Optional email for attribution
 * @param {object} [opts]
 * @param {string} [opts.provider] - LLM provider override
 * @param {boolean} [opts.skipDb] - Skip saving to DB (for testing)
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function generateItinerary(inputs, opts = {}) {
  const startTime = Date.now()

  try {
    // 1. Build the prompt
    const prompt = buildItineraryPrompt(inputs)

    // 2. Call the LLM
    const providerName = opts.provider || 'mock'
    const llmOpts = {
      provider: providerName,
      userInputs: inputs,
      ...(providerName === 'mock' ? {} : { temperature: 0.1 }),
    }

    const response = await callLLM(prompt.full, llmOpts)

    // 3. Parse the response
    const parsed = parseItineraryResponse(response.text, {
      destination: inputs.destination,
      budget_level: inputs.budget_level,
    })

    if (!parsed.success) {
      // Retry once with stricter prompt
      if (opts._retried) {
        return { success: false, error: parsed.error }
      }
      console.warn('[Itinerary] First parse failed, retrying once...')
      return generateItinerary(inputs, { ...opts, _retried: true })
    }

    const itinerary = parsed.data

    // 4. Save to database (unless skipped)
    if (!opts.skipDb) {
      try {
        const dbResult = await saveItinerary(itinerary, inputs.user_email)
        itinerary.id = dbResult.itineraryId
      } catch (dbErr) {
        console.warn('[Itinerary] DB save failed (returning data anyway):', dbErr.message)
      }
    }

    const elapsed = Date.now() - startTime

    return {
      success: true,
      data: itinerary,
      meta: {
        provider: providerName,
        elapsed_ms: elapsed,
      },
    }
  } catch (err) {
    return {
      success: false,
      error: `Itinerary generation failed: ${err.message}`,
    }
  }
}

/**
 * Quick test — generates an itinerary for NYC with default params.
 * Used by the test script and for development verification.
 */
export async function quickTest() {
  const result = await generateItinerary({
    destination: 'New York City',
    duration_days: 2,
    budget_level: 'moderate',
    vibes: 'foodie, culture',
    preferences: 'Love Italian food and jazz',
  }, { skipDb: false })

  return result
}

export default { generateItinerary, quickTest }