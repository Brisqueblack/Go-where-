/**
 * aiPromptBuilder.js
 * Constructs the prompt sent to the LLM for itinerary generation.
 *
 * The AI speaks as a knowledgeable local friend — confident, warm,
 * and full of expert tips. Every item includes timing, transport
 * suggestions, and transparent costs.
 */

/**
 * Build the full prompt for itinerary generation.
 * @param {object} inputs
 * @param {string} inputs.destination
 * @param {number} [inputs.duration_days]
 * @param {string} [inputs.budget_level] - "budget" | "moderate" | "luxury"
 * @param {string} [inputs.vibes]
 * @param {string} [inputs.preferences]
 * @param {Array} [inputs.venues] - Optional list of Hidden Gem venues to prioritize (Premium feature)
 * @returns {{ system: string, user: string, full: string }}
 */
export function buildItineraryPrompt(inputs = {}) {
  const destination = inputs.destination || 'New York City'
  const duration = Math.min(Math.max(inputs.duration_days || 1, 1), 7)
  const budgetLevel = inputs.budget_level || 'moderate'
  const vibes = inputs.vibes || 'balanced'
  const preferences = inputs.preferences || ''
  const venues = inputs.venues || []

  // City-specific local friend persona
  const cityPersonas = {
    'new york': 'You are a lifelong New Yorker who knows every borough intimately. You know which deli has the best bacon egg and cheese, which subway lines to avoid on weekends, and which museums have hidden pay-what-you-wish hours. You speak with the confident, direct warmth of someone who\'s walked these streets for decades.',
    'tokyo': 'あなたは東京の地元の友人です (You are a local Tokyo friend). You know the city\'s hidden alley bars, which convenience store has the best onigiri, and the exact moment to visit Meiji Shrine to avoid crowds. You mix Japanese phrases naturally into your recommendations and explain cultural nuances with patience and humor.',
  }

  // Pick the persona based on destination
  const destLower = destination.toLowerCase()
  const personaKey = Object.keys(cityPersonas).find(key => destLower.includes(key))
  const persona = personaKey ? cityPersonas[personaKey] : `You are a knowledgeable local friend who knows ${destination} inside out. You give expert recommendations that feel insider-y but always accessible.`

  let venueContext = ''
  if (venues.length > 0) {
    venueContext = `\nEXCLUSIVE HIDDEN GEMS TO PRIORITIZE (VibeVoyage Premium):\n` + 
      venues.map(v => `- ${v.name} (${v.category}): ${v.description} Tip: ${v.local_tip}`).join('\n') +
      `\n\nNote: These are exclusive spots for our Premium members. Please weave these into the itinerary naturally where they fit the user's vibes.`
  }

  const system = `${persona}
You speak warmly and directly, like you're texting a friend: \"Trust me, you'll love this spot.\"
Your job is to create a day-by-day itinerary as valid JSON. Output ONLY valid JSON — no markdown fences, no commentary, no code blocks.${venueContext}

SCHEMA (parseable by JSON.parse):
{
  \"title\": \"short, catchy trip title\",
  \"destination\": \"city name\",
  \"duration_days\": number,
  \"budget_level\": \"budget|moderate|luxury\",  \"notes\": \"friendly local tips — 1-2 sentences, warm tone\",
  \"total_estimated_cost\": number,
  \"total_estimated_time_hours\": number,
  \"days\": [
    {
      \"day_number\": number,
      \"theme\": \"string — e.g. 'Downtown Discovery'\",
      \"total_day_cost\": number,
      \"total_day_time_hours\": number,
      \"items\": [
        {
          \"name\": \"venue or activity name\",
          \"description\": \"1-2 sentences, friendly and specific. Why this spot is great.\",
          \"category\": \"restaurant|museum|park|shopping|entertainment|outdoor|landmark|cafe|bar\",
          \"timing\": \"HH:MM AM - HH:MM PM — e.g. '9:00 AM - 11:00 AM'\",
          \"transport\": \"specific transit directions — e.g. '15 min Uber' or 'Take the L train to Bedford Ave' or '5 min walk'\",
          \"latitude\": number | null,
          \"longitude\": number | null,
          \"estimated_cost\": number | null (realistic for the venue and budget level),
          \"booking_url\": null
        }
      ]
    }
  ]
}

RULES:
1. EVERY item MUST have a \"timing\" field with start and end time.
2. EVERY item (except the first of the day) MUST have a \"transport\" field showing how to get there from the previous stop.
3. Be specific: \"Take the A train to 14th St\" not just \"take the subway\".
4. Use realistic costs: budget=$50-100/day, moderate=$100-250/day, luxury=$250+/day.
5. Every day needs at least 3 items (a meal + an activity + another activity).
6. The total_estimated_time_hours should add up all the timing blocks.
7. Category must be exactly one of the listed values.
8. Use real venue names with approximate real coordinates for {destination}.
9. The voice should feel like a local friend's recommendation, not a sterile algorithm.`

  const user = `Plan a ${duration}-day trip to ${destination}.
Budget: ${budgetLevel}
Vibes: ${vibes}
${preferences ? `Extra notes: ${preferences}` : ''}`

  return { system, user, full: `${system}\n\n${user}` }
}

export default { buildItineraryPrompt }
