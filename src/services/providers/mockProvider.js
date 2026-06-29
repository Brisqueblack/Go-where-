/**
 * mockProvider.js
 * A mock LLM provider for development and testing.
 * Returns realistic-looking NYC itineraries.
 */

const THEMES = [
  'Classic Highlights',
  'Hidden Gems & Local Spots',
  'Food Lover\'s Tour',
  'Art & Culture Exploration',
  'Outdoors & Parks',
]

const NYC_VENUES = {
  manhattan: {
    morning: [
      { name: 'The High Line', cat: 'park', cost: 0, lat: 40.7480, lng: -74.0048, desc: 'A stunning elevated park built on a historic freight rail line.' },
      { name: 'Central Park (Sheep Meadow)', cat: 'park', cost: 0, lat: 40.7713, lng: -73.9741, desc: 'The perfect spot for a morning picnic or people watching.' },
      { name: 'Russ & Daughters Café', cat: 'restaurant', cost: 25, lat: 40.7204, lng: -73.9897, desc: 'A lower east side institution famous for bagels and lox.' },
    ],
    afternoon: [
      { name: 'The Metropolitan Museum of Art', cat: 'museum', cost: 30, lat: 40.7794, lng: -73.9632, desc: 'One of the world\'s largest and finest art museums.' },
      { name: 'Chelsea Market', cat: 'shopping', cost: 20, lat: 40.7423, lng: -74.0062, desc: 'An iconic indoor food hall with dozens of local vendors.' },
      { name: 'The Frick Collection', cat: 'museum', cost: 25, lat: 40.7712, lng: -73.9672, desc: 'Masterpiece paintings in a stunning Gilded Age mansion.' },
    ],
    evening: [
      { name: 'Blue Note Jazz Club', cat: 'entertainment', cost: 35, lat: 40.7309, lng: -74.0007, desc: 'World-famous jazz venue in Greenwich Village.' },
      { name: 'Carbone', cat: 'restaurant', cost: 100, lat: 40.7280, lng: -73.9997, desc: 'High-end Italian-American food that feels like a 1950s movie.' },
      { name: 'Buvette', cat: 'restaurant', cost: 40, lat: 40.7328, lng: -74.0051, desc: 'A charming French bistro in the heart of the West Village.' },
    ]
  },
  brooklyn: {
    morning: [
      { name: 'Lilia', cat: 'restaurant', cost: 45, lat: 40.7176, lng: -73.9527, desc: 'Michelin-starred Italian in Williamsburg. The handmade pasta is worth the hype.' },
      { name: 'Brooklyn Bridge Walk', cat: 'outdoor', cost: 0, lat: 40.7061, lng: -73.9969, desc: 'Iconic views of the Manhattan skyline.' },
    ],
    afternoon: [
      { name: 'DUMBO Arts District', cat: 'shopping', cost: 15, lat: 40.7033, lng: -73.9881, desc: 'Galleries, bookstores, and the most famous photo spot in Brooklyn.' },
      { name: 'Prospect Park', cat: 'park', cost: 0, lat: 40.6602, lng: -73.9690, desc: 'Brooklyn\'s answer to Central Park, designed by the same architects.' },
      { name: 'Smorgasburg Williamsburg', cat: 'restaurant', cost: 20, lat: 40.7210, lng: -73.9619, desc: 'The largest weekly open-air food market in America.' },
    ],
    evening: [
      { name: 'Di Fara Pizza', cat: 'restaurant', cost: 30, lat: 40.6251, lng: -73.9615, desc: 'Widely considered the best pizza in New York City.' },
      { name: 'Brooklyn Academy of Music', cat: 'entertainment', cost: 40, lat: 40.6867, lng: -73.9779, desc: 'A multi-venue arts center with world-class performances.' },
    ]
  },
}

const TOKYO_VENUES = {
  shinjuku: {
    morning: [
      { name: 'Meiji Jingu Shrine', cat: 'culture', cost: 0, lat: 35.6764, lng: 139.6993, desc: 'A serene Shinto shrine surrounded by a 175-acre forest — right in the middle of Tokyo.' },
      { name: 'Tsukiji Outer Market', cat: 'restaurant', cost: 15, lat: 35.6649, lng: 139.7707, desc: 'The bustling outer market of the former Tsukiji fish market. Fresh seafood, street food, and kitchen knives.' },
    ],
    afternoon: [
      { name: 'Shibuya Sky Observation Deck', cat: 'culture', cost: 18, lat: 35.6580, lng: 139.7016, desc: 'A 360-degree open-air observation deck atop Shibuya Scramble — the best skyline view in Tokyo.' },
      { name: 'Harajuku Takeshita Street', cat: 'shopping', cost: 15, lat: 35.6702, lng: 139.7027, desc: 'The epicenter of Tokyo youth culture. Crazy fashion, crepes, and goth-Lolita boutiques.' },
      { name: 'Akihabara Electric Town', cat: 'shopping', cost: 20, lat: 35.7022, lng: 139.7734, desc: 'The world-famous electronics and anime district. Multi-story arcades, maid cafes, and retro game shops.' },
    ],
    evening: [
      { name: 'Ramen Street (Tokyo Station)', cat: 'restaurant', cost: 12, lat: 35.6812, lng: 139.7671, desc: 'A collection of 8 of Tokyo\'s best ramen shops under one roof in Tokyo Station.' },
      { name: 'Robot Restaurant (Shinjuku)', cat: 'entertainment', cost: 40, lat: 35.6945, lng: 139.7032, desc: 'A bizarre, spectacular, over-the-top show with robots, lasers, and dancing — pure Tokyo weirdness.' },
    ]
  },
  shitamachi: {
    morning: [
      { name: 'Senso-ji Temple (Asakusa)', cat: 'culture', cost: 0, lat: 35.7148, lng: 139.7967, desc: 'Tokyo\'s oldest temple, with a massive red lantern and a vibrant market street leading to it.' },
    ],
    afternoon: [
      { name: 'teamLab Borderless', cat: 'culture', cost: 30, lat: 35.6264, lng: 139.7841, desc: 'A mind-bending digital art museum where immersive light installations respond to your presence.' },
      { name: 'Ueno Park & Museums', cat: 'park', cost: 5, lat: 35.7145, lng: 139.7737, desc: 'A sprawling park with multiple world-class museums, a zoo, and cherry blossoms in spring.' },
    ],
    evening: [
      { name: 'Shinjuku Golden Gai', cat: 'bar', cost: 25, lat: 35.6938, lng: 139.7036, desc: 'Narrow alleys packed with tiny bars, each seating 5-10 people. A true Tokyo experience.' },
    ]
  }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffleAndTake(arr, n) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, n)
}

/**
 * Mocks an LLM call by generating a static JSON response.
 */
export async function mockGenerate(prompt, opts = {}) {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 800))

  const destination = opts.userInputs?.destination || 'New York City'
  const duration = opts.userInputs?.duration_days || 1
  const budgetLevel = opts.userInputs?.budget_level || 'moderate'
  const vibes = opts.userInputs?.vibes || ''

  // Check for Premium hidden gems — use venues from userInputs directly
  const premiumVenues = opts.userInputs?.venues || []
  const useHidden = premiumVenues.length > 0
  const bMulti = budgetLevel === 'luxury' ? 2.5 : (budgetLevel === 'budget' ? 0.6 : 1.0)
  
  // Select city-appropriate venue data and districts
  const destLower = destination.toLowerCase()
  const isTokyo = destLower.includes('tokyo')
  const venueData = isTokyo ? TOKYO_VENUES : NYC_VENUES
  const districts = isTokyo ? ['shinjuku', 'shitamachi'] : ['manhattan', 'brooklyn']
  const tips = isTokyo
    ? [
      'Get a Suica card for easy train travel — tap on/off across all Tokyo transit.',
      'Many restaurants have ticket machines outside. Just insert cash, press the picture, and hand the ticket to the chef.',
      'Convenience stores (konbini) in Japan are next-level — 7-Eleven egg salad sandwiches are a must-try.',
      'The Yamanote loop line connects all major Tokyo stations. It circles in 60 minutes.',
      'Learn two phrases: "Sumimasen" (excuse me / sorry) and "Arigato gozaimasu" (thank you).',
    ]
    : [
      'Book popular restaurants at least a week in advance.',
      'Get a MetroCard or OMNY tap for unlimited subway rides.',
      'The NYC Ferry is the city\'s best-kept secret — great views, cheap fares.',
      'Many museums have pay-what-you-wish hours. Check their websites!',
      'Walk between neighbourhoods to discover hidden spots not on any map.',
    ]

  const days = []

  for (let d = 1; d <= duration; d++) {
    const district = pickRandom(districts)
    const venues = venueData[district]
    const themeIndex = (d - 1) % THEMES.length
    const themePrefix = THEMES[themeIndex]

    // Pick venues for each time slot
    const morningVenues = shuffleAndTake(venues.morning, 1)
    const afternoonVenues = shuffleAndTake(venues.afternoon, 2)
    const eveningVenues = shuffleAndTake(venues.evening, 1)

    // Add a hidden gem if available and user is premium
    const extraVenues = []
    if (useHidden && d === 1) {
      // Inject one hidden gem on day 1 using actual venue data
      const gem = pickRandom(premiumVenues)
      extraVenues.push({
        name: gem.name,
        description: `${gem.description} Insider tip: ${gem.local_tip}`,
        category: gem.category || 'hidden_gem',
        timing: '11:00 AM - 12:30 PM',
        transport: 'A quick 10 min walk from your morning spot.',
        latitude: gem.latitude,
        longitude: gem.longitude,
        estimated_cost: Math.round((gem.estimated_cost || 15) * bMulti),
        booking_url: null,
        is_hidden_gem: true, // flag for the UI to show Premium badge
      })
    }

    const items = [
      ...morningVenues.map(v => ({
        name: v.name,
        description: v.desc,
        category: v.category,
        timing: '9:00 AM - 10:30 AM',
        transport: d === 1 ? 'Starting from your hotel' : isTokyo ? 'Take the Yamanote line to your next stop' : 'Take the subway from your previous stop',
        latitude: v.lat,
        longitude: v.lng,
        estimated_cost: Math.round(v.cost * bMulti),
        booking_url: null,
      })),
      ...extraVenues,
      ...afternoonVenues.map((v, i) => ({
        name: v.name,
        description: v.desc,
        category: v.category,
        timing: i === 0 ? '1:30 PM - 3:30 PM' : '4:00 PM - 5:30 PM',
        transport: i === 0 ? (isTokyo ? '15 min walk or short taxi ride' : '15 min walk or 5 min Uber') : isTokyo ? 'Take the Tokyo Metro — 10 min ride' : 'Take the subway — 10 min ride',
        latitude: v.lat,
        longitude: v.lng,
        estimated_cost: Math.round(v.cost * bMulti),
        booking_url: null,
      })),
      ...eveningVenues.map(v => ({
        name: v.name,
        description: v.desc,
        category: v.category,
        timing: '7:00 PM - 9:30 PM',
        transport: isTokyo ? 'Take the train or a short taxi ride' : 'Take the subway or a 10 min Uber',
        latitude: v.lat,
        longitude: v.lng,
        estimated_cost: Math.round(v.cost * bMulti),
        booking_url: null,
      })),
    ]

    days.push({
      day_number: d,
      theme: `${themePrefix} — ${district.charAt(0).toUpperCase() + district.slice(1)}`,
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
    notes: `Pro-tip: ${pickRandom(tips)}`,
  }

  return {
    text: JSON.stringify(itinerary, null, 2),
    usage: { prompt: 0, completion: 0 }, // mock has no usage
  }
}
