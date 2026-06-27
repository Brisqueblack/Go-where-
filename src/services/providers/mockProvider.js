/**
 * Mock LLM Provider — Returns realistic pre-built NYC itineraries.
 *
 * This provider is the default when no real LLM API key is configured.
 * It generates diverse, location-accurate itineraries across NYC
 * neighbourhoods, demonstrating the full data flow without external calls.
 */

// ── NYC venue database ─────────────────────────────────────────────────────
// Curated with real-ish names, categories, and approximate coordinates.

const NYC_VENUES = {
  // ── Manhattan ────────────────────────────────────────────────────────
  manhattan: {
    morning: [
      { name: 'Russ & Daughters Café', category: 'restaurant', lat: 40.7223, lng: -73.9874, cost: 25, desc: 'Iconic Jewish appetizing spot on the Lower East Side. Famous for bagels and lox.' },
      { name: 'Buvette', category: 'restaurant', lat: 40.7340, lng: -73.9998, cost: 30, desc: 'Cozy French-Italian gastrotheque in the West Village. Perfect for a leisurely brunch.' },
      { name: 'Jack\'s Wife Freda', category: 'restaurant', lat: 40.7285, lng: -74.0025, cost: 22, desc: 'Beloved Mediterranean-Mediterranean fusion spot with a warm,instagrammable vibe.' },
      { name: 'The Smile', category: 'restaurant', lat: 40.7256, lng: -73.9935, cost: 28, desc: 'Hidden basement café in NoHo with excellent coffee and healthy bowls.' },
      { name: 'Dominique Ansel Bakery', category: 'restaurant', lat: 40.7243, lng: -73.9995, cost: 15, desc: 'Home of the cronut! Grab a pastry and coffee to start your day.' },
    ],
    afternoon: [
      { name: 'The Metropolitan Museum of Art', category: 'museum', lat: 40.7794, lng: -73.9632, cost: 30, desc: 'World-renowned art museum on Museum Mile. Pay-what-you-wish for NY residents.' },
      { name: 'The High Line', category: 'park', lat: 40.7480, lng: -74.0048, cost: 0, desc: 'Elevated park built on historic rail tracks. Stroll through Chelsea with skyline views.' },
      { name: 'MoMA', category: 'museum', lat: 40.7614, lng: -73.9776, cost: 25, desc: 'Museum of Modern Art. Van Gogh, Warhol, and cutting-edge exhibits.' },
      { name: 'Chelsea Market', category: 'shopping', lat: 40.7425, lng: -74.0058, cost: 20, desc: 'Indoor food hall and market in the meatpacking district. Great for lunch browsing.' },
      { name: 'Strand Bookstore', category: 'shopping', lat: 40.7340, lng: -73.9930, cost: 15, desc: 'Legendary 18-mile bookstore in the East Village. Perfect for used-book lovers.' },
      { name: 'The Frick Collection', category: 'museum', lat: 40.7710, lng: -73.9674, cost: 22, desc: 'Intimate art museum in Henry Clay Frick\'s former mansion on the Upper East Side.' },
      { name: 'Brooklyn Bridge Walk', category: 'outdoor', lat: 40.7061, lng: -73.9969, cost: 0, desc: 'Walk from Manhattan to Brooklyn across the iconic bridge. Stunning skyline views.' },
      { name: 'Summit One Vanderbilt', category: 'landmark', lat: 40.7527, lng: -73.9772, cost: 45, desc: 'Immersive art experience and observation deck with floor-to-ceiling mirrors.' },
    ],
    evening: [
      { name: 'Katz\'s Delicatessen', category: 'restaurant', lat: 40.7222, lng: -73.9872, cost: 25, desc: 'NYC institution since 1888. The pastrami sandwich is legendary.' },
      { name: 'Los Tacos No. 1', category: 'restaurant', lat: 40.7420, lng: -74.0055, cost: 12, desc: 'Best authentic tacos in NYC. Cash only, no frills, unforgettable.' },
      { name: 'Carbone', category: 'restaurant', lat: 40.7305, lng: -73.9960, cost: 80, desc: 'Upscale Italian-American with a retro vibe. Reserve weeks ahead.' },
      { name: 'Ivan Ramen', category: 'restaurant', lat: 40.7510, lng: -73.9920, cost: 20, desc: 'Michelin-starred ramen in Hell\'s Kitchen. Slurp-worthy broth.' },
      { name: 'Joe\'s Shanghai', category: 'restaurant', lat: 40.7155, lng: -73.9975, cost: 18, desc: 'Famous for soup dumplings in Chinatown. Cash only, worth the wait.' },
      { name: 'Blue Note Jazz Club', category: 'entertainment', lat: 40.7305, lng: -74.0005, cost: 45, desc: 'World-famous jazz club in Greenwich Village. Intimate sets from legends.' },
      { name: 'The Comedy Cellar', category: 'entertainment', lat: 40.7300, lng: -74.0000, cost: 30, desc: 'Greenwich Village comedy club. You never know who\'ll drop in.' },
      { name: 'Sleep No More', category: 'entertainment', lat: 40.7550, lng: -73.9950, cost: 150, desc: 'Immersive Macbeth experience in Chelsea. Wear comfortable shoes.' },
      { name: 'Top of the Rock', category: 'landmark', lat: 40.7587, lng: -73.9787, cost: 40, desc: 'Rockefeller Center observation deck. Sunset views of the Empire State Building.' },
      { name: 'Dive Bar at The Sanctuary Hotel', category: 'entertainment', lat: 40.7600, lng: -73.9825, cost: 20, desc: 'Rooftop bar in Times Square with craft cocktails and skyline views.' },
    ],
  },

  // ── Brooklyn ─────────────────────────────────────────────────────────
  brooklyn: {
    morning: [
      { name: 'Lilia', category: 'restaurant', lat: 40.7190, lng: -73.9595, cost: 35, desc: 'Michelin-starred Italian in Williamsburg. The handmade pasta is worth the hype.' },
      { name: 'Milk Bar Williamsburg', category: 'restaurant', lat: 40.7127, lng: -73.9602, cost: 10, desc: 'Famous for cereal milk soft serve and compost cookies. Sweet breakfast treat.' },
      { name: 'Café Colette', category: 'restaurant', lat: 40.6850, lng: -73.9910, cost: 18, desc: 'Sunny Australian-style café in Williamsburg with excellent flat whites.' },
    ],
    afternoon: [
      { name: 'Brooklyn Museum', category: 'museum', lat: 40.6712, lng: -73.9636, cost: 16, desc: 'One of the oldest and largest art museums in the US. The First Saturday events are iconic.' },
      { name: 'Prospect Park', category: 'park', lat: 40.6602, lng: -73.9690, cost: 0, desc: 'Brooklyn\'s answer to Central Park. Designed by Olmsted & Vaux. Perfect for a picnic.' },
      { name: 'Smorgasburg Williamsburg', category: 'restaurant', lat: 40.7140, lng: -73.9620, cost: 25, desc: 'Massive outdoor food market on weekends. 100+ vendors, something for everyone.' },
      { name: 'DUMBO Arts District', category: 'shopping', lat: 40.7033, lng: -73.9898, cost: 0, desc: 'Galleries, indie shops, and the iconic Washington Street view of the Manhattan Bridge.' },
    ],
    evening: [
      { name: 'Peter Luger Steak House', category: 'restaurant', lat: 40.7105, lng: -73.9615, cost: 70, desc: 'Brooklyn institution since 1887. Cash-only, porterhouse steak is the move.' },
      { name: 'Di Fara Pizza', category: 'restaurant', lat: 40.6200, lng: -73.9590, cost: 15, desc: 'Legendary Midwood pizzeria. Dom DeMarco\'s hand-crafted pies are worth the trip.' },
      { name: 'Roberta\'s Pizza', category: 'restaurant', lat: 40.7030, lng: -73.9325, cost: 22, desc: 'Bushwick pizza pioneer. Hipster vibe, incredible wood-fired pies.' },
      { name: 'Brooklyn Bowl', category: 'entertainment', lat: 40.7200, lng: -73.9600, cost: 25, desc: 'Bowling, live music, and Blue Ribbon fried chicken under one roof in Williamsburg.' },
      { name: 'Elsewhere', category: 'entertainment', lat: 40.7050, lng: -73.9445, cost: 30, desc: 'Three-floor music venue and art space in Bushwick. Cutting-edge electronic shows.' },
    ],
  },

  // ── Hidden Gems ──────────────────────────────────────────────────────
  hidden: [
    { name: 'The Cloisters', category: 'museum', lat: 40.8648, lng: -73.9317, cost: 25, desc: 'Medieval art museum in Fort Tryon Park. Feels like a European monastery overlooking the Hudson.' },
    { name: 'City Island', category: 'outdoor', lat: 40.8465, lng: -73.7860, cost: 0, desc: 'A fishing village in the Bronx. Fresh seafood and small-town charm 20 min from Manhattan.' },
    { name: 'Green-Wood Cemetery', category: 'park', lat: 40.6525, lng: -73.9905, cost: 0, desc: 'Historic cemetery and arboretum in Brooklyn. Stunning Gothic architecture and birdwatching.' },
    { name: 'Socrates Sculpture Park', category: 'park', lat: 40.7685, lng: -73.9470, cost: 0, desc: 'Waterfront sculpture park in Long Island City with incredible Manhattan skyline views.' },
    { name: 'Jacqueline Kennedy Onassis Reservoir', category: 'outdoor', lat: 40.7800, lng: -73.9580, cost: 0, desc: 'Scenic 1.58-mile running track around Central Park\'s reservoir. Iconic NYC jogging spot.' },
  ],
}

// ── Theme templates ────────────────────────────────────────────────────────

const THEMES = [
  'Classic NYC Highlights',
  'Food Lover\'s Tour',
  'Arts & Culture Deep Dive',
  'Off the Beaten Path',
  'Shop & Stroll',
  'Neighbourhood Explorer',
  'Date Night Special',
  'Budget-Friendly Adventure',
]

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffleAndTake(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

/**
 * Generate a mock itinerary based on user preferences.
 * @param {object} inputs
 * @param {string} inputs.destination - e.g. "New York City"
 * @param {string} [inputs.vibes] - e.g. "foodie", "culture", "budget", "hidden gems"
 * @param {string} [inputs.budget_level] - "budget" | "moderate" | "luxury"
 * @param {number} [inputs.duration_days] - 1-5
 * @param {string} [inputs.preferences] - Additional text preferences
 * @returns {{ text: string }}
 */
export function mockGenerate(prompt, opts = {}) {
  // Parse user inputs from the options (passed from service layer)
  const inputs = opts.userInputs || {}
  const destination = inputs.destination || 'New York City'
  const vibes = (inputs.vibes || '').toLowerCase()
  const budgetLevel = inputs.budget_level || 'moderate'
  const duration = Math.min(Math.max(inputs.duration_days || 1, 1), 5)

  // Budget multiplier
  const budgetMultipliers = { budget: 0.6, moderate: 1.0, luxury: 2.0 }
  const bMulti = budgetMultipliers[budgetLevel] || 1.0

  // Select boroughs based on vibes
  const useBrooklyn = vibes.includes('hip') || vibes.includes('food') || vibes.includes('arts')
  const useHidden = vibes.includes('hidden') || vibes.includes('off') || vibes.includes('local')
  const boroughs = ['manhattan']
  if (useBrooklyn) boroughs.push('brooklyn')

  // Build days
  const days = []
  for (let d = 1; d <= duration; d++) {
    const borough = pickRandom(boroughs)
    const venues = NYC_VENUES[borough]
    const themeIndex = (d - 1) % THEMES.length
    const themePrefix = THEMES[themeIndex]

    // Pick venues for each time slot
    const morningVenues = shuffleAndTake(venues.morning, 1)
    const afternoonVenues = shuffleAndTake(venues.afternoon, 2)
    const eveningVenues = shuffleAndTake(venues.evening, 1)

    // Add a hidden gem on longer trips
    const extraVenues = []
    if (d % 2 === 0 && useHidden && NYC_VENUES.hidden.length > 0) {
      extraVenues.push(pickRandom(NYC_VENUES.hidden))
    }

    const items = [
      ...morningVenues.map(v => ({
        name: v.name,
        description: v.desc,
        category: v.category,
        timing: '9:00 AM - 11:00 AM',
        transport: d === 1 ? 'Starting from your hotel' : 'Take the subway from your previous stop',
        latitude: v.lat,
        longitude: v.lng,
        estimated_cost: Math.round(v.cost * bMulti),
        booking_url: null,
        time_slot: 'morning',
      })),
      ...afternoonVenues.map((v, i) => ({
        name: v.name,
        description: v.desc,
        category: v.category,
        timing: i === 0 ? '11:30 AM - 1:30 PM' : '2:00 PM - 4:00 PM',
        transport: i === 0 ? '15 min walk or 5 min Uber' : 'Take the subway — 10 min ride',
        latitude: v.lat,
        longitude: v.lng,
        estimated_cost: Math.round(v.cost * bMulti),
        booking_url: null,
        time_slot: 'afternoon',
      })),
      ...eveningVenues.map(v => ({
        name: v.name,
        description: v.desc,
        category: v.category,
        timing: '6:30 PM - 9:00 PM',
        transport: 'Take the subway or a 10 min Uber',
        latitude: v.lat,
        longitude: v.lng,
        estimated_cost: Math.round(v.cost * bMulti),
        booking_url: null,
        time_slot: 'evening',
      })),
      ...extraVenues.map(v => ({
        name: v.name,
        description: v.desc,
        category: v.category,
        timing: '10:00 AM - 12:00 PM',
        transport: 'Take the subway — about 20 min from midtown',
        latitude: v.lat,
        longitude: v.lng,
        estimated_cost: Math.round(v.cost * bMulti),
        booking_url: null,
        time_slot: 'morning',
      })),
    ]

    days.push({
      day_number: d,
      theme: `${themePrefix} — ${borough.charAt(0).toUpperCase() + borough.slice(1)}`,
      items,
    })
  }

  const totalCost = days.reduce((sum, d) =>
    sum + d.items.reduce((s, i) => s + (i.estimated_cost || 0), 0), 0
  )

  const itinerary = {
    title: `${duration}-Day ${destination} Adventure`,
    destination,
    duration_days: duration,
    budget_level: budgetLevel,
    vibes: vibes || 'balanced',
    days,
    total_estimated_cost: totalCost,
    notes: `Pro-tip: ${pickRandom([
      'Book popular restaurants at least a week in advance.',
      'Get a MetroCard or OMNY tap for unlimited subway rides.',
      'The NYC Ferry is the city\'s best-kept secret — great views, cheap fares.',
      'Many museums have pay-what-you-wish hours. Check their websites!',
      'Walk between neighbourhoods to discover hidden spots not on any map.',
    ])}`,
  }

  return {
    text: JSON.stringify(itinerary, null, 2),
    usage: { prompt: 0, completion: 0 }, // mock has no usage
  }
}