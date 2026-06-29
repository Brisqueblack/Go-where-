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

// ── US Expansion Cities: Boston, Philadelphia, Washington DC, Chicago, Miami ──

const US_CITIES_VENUES = {
  boston: {
    beantown: {
      morning: [
        { name: 'Boston Common & Public Garden', cat: 'park', cost: 0, lat: 42.3540, lng: -71.0691, desc: 'America\'s oldest public park. The swan boats and the Make Way for Ducklings statues are pure Boston charm.' },
        { name: 'Mike & Patty\'s Sandwich Shop', cat: 'restaurant', cost: 10, lat: 42.3507, lng: -71.0652, desc: 'Tiny takeout spot in Bay Village with legendary breakfast sandwiches.' },
      ],
      afternoon: [
        { name: 'Freedom Trail Walk', cat: 'culture', cost: 0, lat: 42.3574, lng: -71.0544, desc: 'A 2.5-mile red brick road through 16 historic sites. Start at Boston Common.' },
        { name: 'Faneuil Hall & Quincy Market', cat: 'shopping', cost: 15, lat: 42.3600, lng: -71.0549, desc: 'Historic market building with food stalls, street performers, and local shops.' },
        { name: 'Museum of Fine Arts', cat: 'culture', cost: 25, lat: 42.3394, lng: -71.0945, desc: 'One of the most comprehensive art museums in the world.' },
      ],
      evening: [
        { name: 'Union Oyster House', cat: 'restaurant', cost: 40, lat: 42.3613, lng: -71.0568, desc: 'America\'s oldest continuously operating restaurant (since 1826). Famous for clam chowder and oysters.' },
        { name: 'Kendall Square Brewery Tour', cat: 'entertainment', cost: 15, lat: 42.3625, lng: -71.0856, desc: 'Walk between Cambridge craft breweries for tastings and tours.' },
      ]
    },
    cambridge: {
      morning: [
        { name: 'Tatte Bakery & Café', cat: 'cafe', cost: 10, lat: 42.3725, lng: -71.1109, desc: 'Boston\'s beloved local bakery chain. The shakshuka and pistachio croissant are iconic.' },
      ],
      afternoon: [
        { name: 'Harvard Yard & Museums', cat: 'culture', cost: 0, lat: 42.3744, lng: -71.1167, desc: 'Walk through historic Harvard Yard. The Natural History Museum has stunning glass flowers.' },
        { name: 'Charles River Esplanade', cat: 'outdoor', cost: 0, lat: 42.3565, lng: -71.0691, desc: 'A scenic 3-mile riverfront path perfect for walking, biking, or picnicking.' },
      ],
      evening: [
        { name: 'Neptune Oyster (North End)', cat: 'restaurant', cost: 45, lat: 42.3638, lng: -71.0541, desc: 'Tiny, cash-only oyster bar with the best lobster roll in the city. Expect a wait — worth it.' },
      ]
    }
  },
  philadelphia: {
    center_city: {
      morning: [
        { name: 'Reading Terminal Market', cat: 'restaurant', cost: 10, lat: 39.9536, lng: -75.1616, desc: 'One of America\'s oldest and largest public markets. Get a soft pretzel and a roast pork sandwich.' },
        { name: 'Philadelphia Museum of Art Steps', cat: 'culture', cost: 0, lat: 39.9650, lng: -75.1809, desc: 'Run up the "Rocky Steps" for an iconic Philly photo and a stunning view of the skyline.' },
      ],
      afternoon: [
        { name: 'Independence Hall', cat: 'culture', cost: 0, lat: 39.9494, lng: -75.1499, desc: 'Where the Declaration of Independence was signed. Free timed entry tickets required.' },
        { name: 'Spruce Street Harbor Park', cat: 'park', cost: 0, lat: 39.9412, lng: -75.1420, desc: 'A seasonal pop-up park on the Delaware River with hammocks, beer garden, and floating barges.' },
      ],
      evening: [
        { name: 'Zahav (Modern Israeli)', cat: 'restaurant', cost: 55, lat: 39.9477, lng: -75.1504, desc: 'James Beard Award-winning Israeli restaurant. The hummus and lamb shoulder are legendary.' },
        { name: 'Johnny Brenda\'s (Fishtown)', cat: 'bar', cost: 12, lat: 39.9763, lng: -75.1331, desc: 'A Fishtown institution — great craft beer selection, live music, and an incredible burger.' },
      ]
    },
    fishtown: {
      morning: [
        { name: 'Fishtown Bagel', cat: 'restaurant', cost: 8, lat: 39.9716, lng: -75.1360, desc: 'Hand-rolled Montreal-style bagels with creative schmears. The "Everything" with scallion cream cheese is perfect.' },
      ],
      afternoon: [
        { name: 'Philadelphia Magic Gardens', cat: 'culture', cost: 10, lat: 39.9416, lng: -75.1582, desc: 'A mesmerizing mosaic art environment created by Isaiah Zagar — tiles, bottles, and mirrors everywhere.' },
        { name: 'Rittenhouse Square', cat: 'park', cost: 0, lat: 39.9500, lng: -75.1717, desc: 'The city\'s most elegant park. Perfect for people-watching and afternoon coffee.' },
      ],
      evening: [
        { name: 'Frankford Hall Beer Garden', cat: 'bar', cost: 15, lat: 39.9759, lng: -75.1327, desc: 'A massive German-style beer hall with communal tables, pretzels, and outdoor space.' },
      ]
    }
  },
  washington_dc: {
    national_mall: {
      morning: [
        { name: 'Eastern Market', cat: 'shopping', cost: 10, lat: 38.8855, lng: -76.9956, desc: 'Historic 1873 market hall with local produce, crafts, and the famous "Market Lunch" blueberry pancakes.' },
        { name: 'National Mall Morning Walk', cat: 'park', cost: 0, lat: 38.8895, lng: -77.0232, desc: 'A 2-mile walk from the Capitol to the Lincoln Memorial past world-famous monuments.' },
      ],
      afternoon: [
        { name: 'Smithsonian National Air & Space Museum', cat: 'museum', cost: 0, lat: 38.8881, lng: -77.0199, desc: 'Free admission. See the Wright Brothers plane, Apollo 11 module, and a touchable moon rock.' },
        { name: 'Library of Congress', cat: 'culture', cost: 0, lat: 38.8869, lng: -77.0046, desc: 'The stunning Italian Renaissance-style main reading room is breathtaking. Free tour.' },
        { name: 'U.S. Botanic Garden', cat: 'park', cost: 0, lat: 38.8877, lng: -77.0130, desc: 'A free oasis of glasshouses with tropical plants, orchids, and a children\'s garden.' },
      ],
      evening: [
        { name: 'Oyamel (Cocina Mexicana)', cat: 'restaurant', cost: 35, lat: 38.8979, lng: -77.0221, desc: 'José Andrés\' acclaimed Mexican spot. The guacamole and tacos al pastor are must-haves.' },
        { name: 'The Dabney (Mid-Atlantic)', cat: 'restaurant', cost: 70, lat: 38.9210, lng: -77.0230, desc: 'A Michelin-starred restaurant celebrating Mid-Atlantic ingredients and open-fire cooking.' },
      ]
    },
    georgetown: {
      morning: [
        { name: 'Baked & Wired (Georgetown)', cat: 'cafe', cost: 6, lat: 38.9044, lng: -77.0623, desc: 'Locals\' choice over Georgetown Cupcake. Try the "Award-Winning" carrot cupcake.' },
      ],
      afternoon: [
        { name: 'The Phillips Collection', cat: 'museum', cost: 16, lat: 38.9114, lng: -77.0470, desc: 'America\'s first museum of modern art. Renoir\'s "Luncheon of the Boating Party" lives here.' },
        { name: 'C&O Canal Walk', cat: 'outdoor', cost: 0, lat: 38.9056, lng: -77.0647, desc: 'A peaceful towpath along the historic Chesapeake & Ohio Canal — feels a world away from politics.' },
      ],
      evening: [
        { name: 'Fiola Mare (Waterfront)', cat: 'restaurant', cost: 60, lat: 38.9020, lng: -77.0606, desc: 'Stunning Italian seafood on the Georgetown waterfront. The views of the Kennedy Center are magical at sunset.' },
      ]
    }
  },
  chicago: {
    the_loop: {
      morning: [
        { name: 'The Art Institute of Chicago', cat: 'museum', cost: 25, lat: 41.8796, lng: -87.6237, desc: 'One of the world\'s greatest art museums. Seurat\'s "A Sunday on La Grande Jatte" is here.' },
        { name: 'Lou Mitchell\'s Restaurant', cat: 'restaurant', cost: 12, lat: 41.8827, lng: -87.6290, desc: 'Classic Chicago diner that claims to have invented the buttered pancake. Free Milk Duds with every order.' },
      ],
      afternoon: [
        { name: 'Millennium Park & Cloud Gate', cat: 'park', cost: 0, lat: 41.8826, lng: -87.6233, desc: '"The Bean" is Chicago\'s most iconic modern art piece. Summer concerts at the Pritzker Pavilion are free.' },
        { name: 'Chicago Architecture River Cruise', cat: 'culture', cost: 40, lat: 41.8860, lng: -87.6230, desc: 'The best way to see Chicago\'s world-famous architecture. The CAFC tour guides are incredible.' },
        { name: 'Museum of Science and Industry', cat: 'museum', cost: 22, lat: 41.7907, lng: -87.5837, desc: 'Housed in the only remaining building from the 1893 World\'s Fair. The U-505 submarine is awe-inspiring.' },
      ],
      evening: [
        { name: 'The Girl & The Goat', cat: 'restaurant', cost: 50, lat: 41.8832, lng: -87.6521, desc: 'Stephanie Izard\'s James Beard Award-winning restaurant. The goat empanadas are legendary.' },
        { name: 'Green Mill Cocktail Lounge', cat: 'entertainment', cost: 15, lat: 41.9706, lng: -87.6607, desc: 'Al Capone\'s former hangout — now Chicago\'s best jazz club. The poetry slam on Sundays is world-class.' },
      ]
    },
    wicker_park: {
      morning: [
        { name: 'Longman & Eagle', cat: 'restaurant', cost: 15, lat: 41.9109, lng: -87.6770, desc: 'A Michelin-starred gastropub that also operates as a 6-room inn upstairs. The biscuits and gravy are sinful.' },
      ],
      afternoon: [
        { name: 'Wicker Park & The 606 Trail', cat: 'outdoor', cost: 0, lat: 41.9084, lng: -87.6768, desc: 'A vibrant neighborhood park connected to the 606 — an elevated rail-trail with art installations.' },
        { name: 'Alinea (Molecular Gastronomy)', cat: 'restaurant', cost: 150, lat: 41.9138, lng: -87.6501, desc: 'Grant Achatz\'s world-famous tasting menu. Over-the-top, mind-bending, unforgettable.' },
      ],
      evening: [
        { name: 'The Violet Hour', cat: 'bar', cost: 18, lat: 41.9082, lng: -87.6778, desc: 'A hidden speakeasy with no sign. The craft cocktails are the best in Chicago.' },
      ]
    }
  },
  miami: {
    south_beach: {
      morning: [
        { name: 'South Beach Boardwalk', cat: 'outdoor', cost: 0, lat: 25.7798, lng: -80.1302, desc: 'A 4-mile oceanfront path from South Pointe Park to 46th Street. Perfect sunrise walk.' },
        { name: 'Versailles Restaurant (Little Havana)', cat: 'restaurant', cost: 12, lat: 25.7634, lng: -80.2125, desc: 'The most famous Cuban restaurant in the world. The cafecito and Cuban sandwich are non-negotiable.' },
      ],
      afternoon: [
        { name: 'Wynwood Walls', cat: 'art', cost: 0, lat: 25.8015, lng: -80.1986, desc: 'An outdoor museum of massive street art murals in the Wynwood Arts District. Free and self-guided.' },
        { name: 'Vizcaya Museum & Gardens', cat: 'culture', cost: 22, lat: 25.7443, lng: -80.2101, desc: 'A stunning 1914 Italian Renaissance-style villa with formal gardens overlooking Biscayne Bay.' },
        { name: 'Bayside Marketplace', cat: 'shopping', cost: 15, lat: 25.7606, lng: -80.1885, desc: 'Waterfront marketplace with shops, live music, and boat tours of the bayside mansions.' },
      ],
      evening: [
        { name: 'Joe\'s Stone Crab', cat: 'restaurant', cost: 55, lat: 25.7775, lng: -80.1305, desc: 'A Miami institution since 1913. Stone crab claws, key lime pie, and legendary waits.' },
        { name: 'Mango\'s Tropical Café', cat: 'entertainment', cost: 20, lat: 25.7810, lng: -80.1286, desc: 'Live salsa, reggaeton, and samba on Ocean Drive. Pure Miami energy.' },
      ]
    },
    brickell: {
      morning: [
        { name: 'Miami Circle & Brickell Key Walk', cat: 'outdoor', cost: 0, lat: 25.7645, lng: -80.1876, desc: 'A scenic 2-mile loop around Brickell Key with stunning skyline views of downtown Miami.' },
      ],
      afternoon: [
        { name: 'Frost Museum of Science', cat: 'museum', cost: 30, lat: 25.7605, lng: -80.1914, desc: 'A cutting-edge science museum with a planetarium and an incredible aquarium tank.' },
        { name: 'Little Havana (Calle Ocho)', cat: 'culture', cost: 8, lat: 25.7654, lng: -80.2120, desc: 'Cuban coffee, cigar rolling, domino games at Maximo Gomez Park. The heartbeat of Miami\'s Cuban culture.' },
      ],
      evening: [
        { name: 'Coyo Taco (Wynwood)', cat: 'restaurant', cost: 15, lat: 25.8018, lng: -80.1978, desc: 'Incredible Mexican street food with homemade tortillas. The al pastor tacos and margaritas are perfect.' },
      ]
    }
  }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffleAndTake(arr, n) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, n)
}

// ── City-aware transport strings ──────────────────────────────────────────────
function getTransport(cityKey, context) {
  const transports = {
    tokyo: { subway: 'Take the Yamanote line to your next stop', walk_uber: '15 min walk or short taxi ride', evening: 'Take the train or a short taxi ride' },
    'new york': { subway: 'Take the subway from your previous stop', walk_uber: '15 min walk or 5 min Uber', evening: 'Take the subway or a 10 min Uber' },
    nyc: { subway: 'Take the subway from your previous stop', walk_uber: '15 min walk or 5 min Uber', evening: 'Take the subway or a 10 min Uber' },
    boston: { subway: 'Hop on the T (Red Line) to your next stop', walk_uber: '15 min walk or quick Uber', evening: 'Take the T or a short Uber ride' },
    philadelphia: { subway: 'Take SEPTA\'s Market-Frankford Line', walk_uber: 'A 10 min walk or quick rideshare', evening: 'SEPTA or a short Uber' },
    washington: { subway: 'Take the Metro (Blue/Orange Line)', walk_uber: 'A pleasant walk or quick Metro ride', evening: 'Metro or a short Uber' },
    dc: { subway: 'Take the Metro (Blue/Orange Line)', walk_uber: 'A pleasant walk or quick Metro ride', evening: 'Metro or a short Uber' },
    chicago: { subway: 'Take the Chicago "L" (Blue Line)', walk_uber: '10 min walk or a quick Divvy bike ride', evening: 'Take the "L" or a short Uber' },
    miami: { subway: 'Take the Metrorail or a free trolley', walk_uber: 'A quick rideshare or walk', evening: 'Rideshare or the free Miami Trolley' },
  }
  const city = transports[cityKey] || transports['new york']
  return city[context] || 'Take the subway'
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
  const cityConfigs = {
    'new york': { data: NYC_VENUES, districts: ['manhattan', 'brooklyn'], tips: [
      'Book popular restaurants at least a week in advance.',
      'Get a MetroCard or OMNY tap for unlimited subway rides.',
      'The NYC Ferry is the city\'s best-kept secret — great views, cheap fares.',
      'Many museums have pay-what-you-wish hours. Check their websites!',
      'Walk between neighbourhoods to discover hidden spots not on any map.',
    ]},
    'nyc': { data: NYC_VENUES, districts: ['manhattan', 'brooklyn'], tips: ['...'] },
    'tokyo': { data: TOKYO_VENUES, districts: ['shinjuku', 'shitamachi'], tips: [
      'Get a Suica card for easy train travel — tap on/off across all Tokyo transit.',
      'Many restaurants have ticket machines outside. Just insert cash, press the picture, and hand the ticket to the chef.',
      'Convenience stores (konbini) in Japan are next-level — 7-Eleven egg salad sandwiches are a must-try.',
      'The Yamanote loop line connects all major Tokyo stations. It circles in 60 minutes.',
      'Learn two phrases: "Sumimasen" (excuse me / sorry) and "Arigato gozaimasu" (thank you).',
    ]},
    'boston': { data: US_CITIES_VENUES.boston, districts: ['beantown', 'cambridge'], tips: [
      'The T (MBTA) subway is the easiest way around. Get a CharlieCard for discounted fares.',
      'Boston is a walking city — most of the Freedom Trail is walkable in a few hours.',
      'North End is the place for Italian food. Mike\'s Pastry vs Modern Pastry is a lifelong debate.',
      'MIT and Harvard campuses are open to explore. The MIT Museum is a hidden gem.',
      'Duck Tours are touristy but actually fun — you drive into the Charles River!',
    ]},
    'philadelphia': { data: US_CITIES_VENUES.philadelphia, districts: ['center_city', 'fishtown'], tips: [
      'SEPTA is Philly\'s transit system. The Market-Frankford Line (the "El") connects most sights.',
      'Ignore the cheesesteak tourist traps. John\'s Roast Pork is what locals actually eat.',
      'Philadelphia is the city of murals — over 4,000 outdoor murals across the city.',
      'BYOB is normal at most restaurants. Bring your own wine or beer to save money.',
      'Reading Terminal Market is a must. Go on a weekday to avoid the crowds.',
    ]},
    'washington': { data: US_CITIES_VENUES.washington_dc, districts: ['national_mall', 'georgetown'], tips: [
      'Almost all Smithsonian museums are FREE. No tickets needed.',
      'The Metro is clean and efficient. Get a SmarTrip card for easiest travel.',
      'DC is very walkable — especially the National Mall area.',
      'Restaurant Week in January/August is the best time to try高端 dining at fixed prices.',
      'Cherry blossoms peak in late March/early April. The Tidal Basin loop is breathtaking.',
    ]},
    'chicago': { data: US_CITIES_VENUES.chicago, districts: ['the_loop', 'wicker_park'], tips: [
      'The Chicago "L" is the best way to get around. Get a Ventra card at any station.',
      'Deep dish is great, but locals actually eat more tavern-style thin crust.',
      'Summer in Chicago is unbeatable — free concerts, street festivals every weekend.',
      'The lakefront trail is 18 miles of continuous shoreline. Rent a Divvy bike.',
      'Chicago Architecture Foundation river cruise is worth every penny.',
    ]},
    'miami': { data: US_CITIES_VENUES.miami, districts: ['south_beach', 'brickell'], tips: [
      'The Miami Metrorail is limited — rideshare or the free trolleys are easier.',
      'South Beach is great, but locals prefer the beaches at Key Biscayne or Crandon Park.',
      'Learn to say "cafecito" (Cuban espresso). It\'s the social lubricant of Miami.',
      'Wynwood Walls are free. Go on the second Saturday for gallery walk events.',
      'Never pay for bottled water — the tap water in Miami is actually excellent.',
    ]},
  }

  // Find matching city config
  const cityKey = Object.keys(cityConfigs).find(key => destLower.includes(key)) || 'new york'
  const config = cityConfigs[cityKey]
  const venueData = config.data
  const districts = config.districts
  const tips = config.tips

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
        transport: d === 1 ? 'Starting from your hotel' : getTransport(cityKey, 'subway'),
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
        transport: i === 0 ? getTransport(cityKey, 'walk_uber') : getTransport(cityKey, 'subway'),
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
        transport: getTransport(cityKey, 'evening'),
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
