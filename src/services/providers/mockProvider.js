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

// ── 7 New US Cities: Los Angeles, Las Vegas, Orlando, San Francisco, Seattle, Nashville, Austin ──

const LA_VENUES = {
  westside: {
    morning: [
      { name: 'Venice Beach Boardwalk', cat: 'outdoor', cost: 0, lat: 33.9925, lng: -118.4775, desc: 'The iconic oceanfront promenade — street performers, skate park, muscle beach, and endless people-watching.' },
      { name: 'Great White (Venice)', cat: 'restaurant', cost: 15, lat: 33.9889, lng: -118.4701, desc: 'A bright, airy California café with legendary avocado toast and acai bowls. The patio is pure LA sunshine.' },
    ],
    afternoon: [
      { name: 'Getty Center', cat: 'museum', cost: 0, lat: 34.0775, lng: -118.4750, desc: 'Stunning hilltop museum with world-class art, architecture gardens, and panoramic views of the entire LA basin. Parking $20, admission free.' },
      { name: 'Abbot Kinney Boulevard', cat: 'shopping', cost: 20, lat: 33.9905, lng: -118.4695, desc: 'Venice\'s coolest street — indie boutiques, art galleries, and the best people-watching west of the 405.' },
    ],
    evening: [
      { name: 'Gjelina (Venice)', cat: 'restaurant', cost: 40, lat: 33.9906, lng: -118.4694, desc: 'The quintessential Venice hot spot. Wood-fired veggies, incredible pizzas, and a scene that defines LA cool.' },
      { name: 'The Bungalow (Santa Monica)', cat: 'bar', cost: 20, lat: 34.0072, lng: -118.4873, desc: 'A whimsical beachside club with fire pits, lawn games, and the best sunset cocktails in Santa Monica.' },
    ]
  },
  eastside: {
    morning: [
      { name: 'Grand Central Market (Downtown)', cat: 'restaurant', cost: 12, lat: 34.0405, lng: -118.2502, desc: 'A historic 1917 market hall with dozens of food stalls. Get the egg sandwich at Eggslut or tacos at Villa Moreliana.' },
      { name: 'Griffith Observatory', cat: 'culture', cost: 0, lat: 34.1184, lng: -118.3004, desc: 'Free science exhibits, the best views of the Hollywood sign and DTLA, and spectacular sunset panoramas.' },
    ],
    afternoon: [
      { name: 'The Broad Museum', cat: 'museum', cost: 0, lat: 34.0537, lng: -118.2513, desc: 'Contemporary art museum with Yayoi Kusama\'s Infinity Mirror Rooms. Free but reserve tickets in advance.' },
      { name: 'Silver Lake Reservoir Walk', cat: 'outdoor', cost: 0, lat: 34.1001, lng: -118.2764, desc: 'A 2-mile loop around the reservoir with stunning views of the hills and the iconic Silver Lake dog park.' },
    ],
    evening: [
      { name: 'Sqirl (Silver Lake)', cat: 'restaurant', cost: 18, lat: 34.1027, lng: -118.2684, desc: 'The cult-favorite brunch spot does dinner too. Famous for their housemade jam and perfectly runny eggs.' },
      { name: 'The Echo (Echo Park)', cat: 'entertainment', cost: 20, lat: 34.0778, lng: -118.2609, desc: 'Legendary indie music venue where bands like Arcade Fire played before they were famous. Cheap drinks, great sound.' },
    ]
  }
}

const VEGAS_VENUES = {
  the_strip: {
    morning: [
      { name: 'Bellagio Conservatory & Botanical Gardens', cat: 'park', cost: 0, lat: 36.1125, lng: -115.1768, desc: 'A stunning indoor garden that changes with the seasons. Over-the-top floral displays that are completely free.' },
      { name: 'Peppermill Restaurant & Fireside Lounge', cat: 'restaurant', cost: 15, lat: 36.1302, lng: -115.1565, desc: 'A Vegas classic since 1972 — enormous portions, neon atmosphere, and the most iconic lounge on the Strip.' },
    ],
    afternoon: [
      { name: 'The Neon Museum (Boneyard)', cat: 'culture', cost: 20, lat: 36.1783, lng: -115.1367, desc: 'An outdoor museum of retired Vegas signs. The guided tour tells the city\'s history through its iconic neon.' },
      { name: 'The Forum Shops at Caesars', cat: 'shopping', cost: 15, lat: 36.1161, lng: -115.1739, desc: 'A shopping mall that feels like a Roman fantasy — talking statues, indoor fountains, and luxury boutiques.' },
    ],
    evening: [
      { name: 'Lakeside Dining at Wynn', cat: 'restaurant', cost: 75, lat: 36.1271, lng: -115.1624, desc: 'Upscale lakeside dining with a waterfall view. The $49 prime rib special is the best deal on the Strip.' },
      { name: 'The Chandelier Bar (The Cosmopolitan)', cat: 'bar', cost: 25, lat: 36.1099, lng: -115.1761, desc: 'A three-story bar wrapped in 2 million crystal beads. The hidden cocktail menu is legendary.' },
    ]
  },
  downtown: {
    morning: [
      { name: 'Fremont Street Experience', cat: 'outdoor', cost: 0, lat: 36.1692, lng: -115.1430, desc: 'The original Vegas — a five-block pedestrian mall with the giant Viva Vision light canopy. Free zip line overhead.' },
      { name: 'Evel Pie (Fremont East)', cat: 'restaurant', cost: 10, lat: 36.1708, lng: -115.1413, desc: 'A funky Evel Knievel-themed pizzeria with surprisingly great pizza. The "Living Dangerously" pie with jalapeños is a must.' },
    ],
    afternoon: [
      { name: 'The Mob Museum', cat: 'museum', cost: 27, lat: 36.1716, lng: -115.1442, desc: 'Housed in a former federal courthouse, this interactive museum tells the real story of organized crime in America.' },
      { name: 'Container Park', cat: 'shopping', cost: 10, lat: 36.1700, lng: -115.1400, desc: 'A shopping and entertainment complex made from shipping containers. The giant praying mantis sculpture shoots fire.' },
    ],
    evening: [
      { name: 'Esther\'s Kitchen (Arts District)', cat: 'restaurant', cost: 40, lat: 36.1667, lng: -115.1455, desc: 'The best restaurant in downtown Vegas. Handmade pasta, local ingredients, and a warm neighborhood vibe.' },
      { name: 'The Griffin (Fremont East)', cat: 'bar', cost: 12, lat: 36.1712, lng: -115.1416, desc: 'A dark, moody bar with a massive stone fireplace. The absinthe selection is the best in Vegas.' },
    ]
  }
}

const ORLANDO_VENUES = {
  theme_park_area: {
    morning: [
      { name: 'Lake Eola Park', cat: 'park', cost: 0, lat: 28.5436, lng: -81.3795, desc: 'Downtown Orlando\'s beautiful urban oasis. Rent a swan-shaped paddleboat and walk the 0.9-mile scenic loop.' },
      { name: 'The Glass Knife (Winter Park)', cat: 'cafe', cost: 12, lat: 28.5942, lng: -81.3486, desc: 'An impossibly elegant bakery with stunning cakes and pastries. The honey lavender latte is a local obsession.' },
    ],
    afternoon: [
      { name: 'Morse Museum of American Art', cat: 'museum', cost: 6, lat: 28.5978, lng: -81.3484, desc: 'Houses the world\'s most comprehensive collection of Tiffany glass. The chapel interior is breathtaking.' },
      { name: 'Wekiva Island', cat: 'outdoor', cost: 10, lat: 28.7482, lng: -81.3853, desc: 'A riverside oasis with kayak rentals, a floating dock bar, and live music. Paddle the spring-fed Wekiva River.' },
    ],
    evening: [
      { name: 'Domu Chibi (Mills 50)', cat: 'restaurant', cost: 20, lat: 28.5605, lng: -81.3685, desc: 'Incredible Japanese ramen and fried chicken. The spicy miso ramen and "Karaage" chicken are the stuff of legend.' },
      { name: 'The Courtesy Bar', cat: 'bar', cost: 15, lat: 28.5411, lng: -81.3798, desc: 'A hidden craft cocktail lounge in a historic house. No sign out front — look for the red door.' },
    ]
  },
  winter_park: {
    morning: [
      { name: 'Winter Park Farmers Market', cat: 'shopping', cost: 8, lat: 28.5972, lng: -81.3498, desc: 'A charming Saturday morning market in a historic train depot. Fresh produce, local honey, and homemade tamales.' },
    ],
    afternoon: [
      { name: 'Park Avenue (Winter Park)', cat: 'shopping', cost: 15, lat: 28.5975, lng: -81.3487, desc: 'Winter Park\'s tree-lined main street with upscale boutiques, art galleries, and sidewalk cafes. Very un-Orlando.' },
      { name: 'Harry P. Leu Gardens', cat: 'park', cost: 10, lat: 28.5698, lng: -81.3557, desc: '50 acres of stunning gardens on the shores of Lake Rowena. The butterfly garden and tropical collection are magical.' },
    ],
    evening: [
      { name: 'Ravenous Pig (Winter Park)', cat: 'restaurant', cost: 45, lat: 28.5979, lng: -81.3495, desc: 'A James Beard-nominated gastropub that put Orlando\'s food scene on the map. The cheddar biscuits are legendary.' },
    ]
  }
}

const SF_VENUES = {
  downtown: {
    morning: [
      { name: 'Ferry Building Marketplace', cat: 'restaurant', cost: 12, lat: 37.7955, lng: -122.3940, desc: 'A historic terminal turned foodie paradise. Slab bacon sandwiches at Boccalone, oysters at Hog Island, and Blue Bottle coffee.' },
      { name: 'Salesforce Park', cat: 'park', cost: 0, lat: 37.7890, lng: -122.3935, desc: 'A stunning 5.4-acre rooftop park hovering 70 feet above the streets. Native plants, a living roof, and free yoga classes.' },
    ],
    afternoon: [
      { name: 'San Francisco Museum of Modern Art (SFMOMA)', cat: 'museum', cost: 25, lat: 37.7858, lng: -122.4008, desc: 'Seven floors of world-class contemporary art. The living wall and the Oculus staircase are architectural marvels.' },
      { name: 'Chinatown Walking Tour', cat: 'culture', cost: 5, lat: 37.7941, lng: -122.4078, desc: 'The oldest Chinatown in North America. Walk through the Dragon Gate, visit the Golden Gate Fortune Cookie Factory, and grab dim sum.' },
    ],
    evening: [
      { name: 'Tadich Grill', cat: 'restaurant', cost: 45, lat: 37.7938, lng: -122.4015, desc: 'SF\'s oldest restaurant (1849). The cioppino and sand dabs are legendary. Wood-paneled booths and proper old-school service.' },
      { name: 'Bourbon & Branch', cat: 'bar', cost: 18, lat: 37.7823, lng: -122.4102, desc: 'A true speakeasy — no sign, password required (check their website). The craft cocktails are worth the secrecy.' },
    ]
  },
  the_mission: {
    morning: [
      { name: 'Tartine Bakery', cat: 'cafe', cost: 8, lat: 37.7606, lng: -122.4208, desc: 'The legendary bakery that defined SF\'s bread renaissance. The morning bun and country loaf are worth the inevitable line.' },
      { name: 'Dolores Park', cat: 'park', cost: 0, lat: 37.7596, lng: -122.4269, desc: 'SF\'s most iconic park — sunbathers, DJs, and the best people-watching in the city. Spectacular skyline views.' },
    ],
    afternoon: [
      { name: 'Clarion Alley Murals', cat: 'art', cost: 0, lat: 37.7635, lng: -122.4213, desc: 'A vibrant alley covered in politically charged murals. The rotating outdoor gallery is the heart of Mission District street art.' },
      { name: 'Mission Districtt Taqueria Crawl', cat: 'restaurant', cost: 10, lat: 37.7601, lng: -122.4207, desc: 'Hit La Taqueria (best carnitas), Taqueria El Farolito (best burrito), and Pancho Villa (best salsa bar). All within 3 blocks.' },
    ],
    evening: [
      { name: 'Foreign Cinema', cat: 'restaurant', cost: 50, lat: 37.7614, lng: -122.4203, desc: 'An enchanting Mission restaurant that projects films on the courtyard wall. Oysters, wood-fired chicken, and old movies under the stars.' },
      { name: 'The Chapel', cat: 'entertainment', cost: 25, lat: 37.7645, lng: -122.4211, desc: 'A stunning former mortuary turned music venue. Incredible acoustics, balcony seating, and an intimate atmosphere.' },
    ]
  }
}

const SEATTLE_VENUES = {
  capitol_hill: {
    morning: [
      { name: 'Volunteer Park Conservatory', cat: 'park', cost: 0, lat: 47.6314, lng: -122.3254, desc: 'A stunning Victorian-style glass greenhouse with five display houses. The dahlia garden and views from the water tower are unbeatable.' },
      { name: 'Victrola Coffee Roasters', cat: 'cafe', cost: 6, lat: 47.6145, lng: -122.3203, desc: 'The heart of Capitol Hill\'s coffee scene. Single-origin pour-overs in a bright, airy space with vinyl records spinning.' },
    ],
    afternoon: [
      { name: 'Chihuly Garden & Glass', cat: 'museum', cost: 29, lat: 47.6210, lng: -122.3501, desc: 'Dale Chihuly\'s breathtaking glass sculptures in a cathedral-like hall. The glass ceiling installation is pure magic.' },
      { name: 'Pike Place Market', cat: 'shopping', cost: 10, lat: 47.6092, lng: -122.3407, desc: 'America\'s oldest continuously operating farmers market. Watch fish fly, grab a bouquet from a flower stall, and find the original Starbucks.' },
    ],
    evening: [
      { name: 'Canlis', cat: 'restaurant', cost: 100, lat: 47.6360, lng: -122.3465, desc: 'Seattle\'s most iconic fine dining restaurant with sweeping views of Lake Union. The tasting menu is a culinary journey.' },
      { name: 'The Comet Tavern', cat: 'bar', cost: 8, lat: 47.6140, lng: -122.3197, desc: 'A grungy Capitol Hill dive bar that hasn\'t changed since the 90s. Cheap beer, a vintage jukebox, and pool tables.' },
    ]
  },
  downtown: {
    morning: [
      { name: 'Ballard Locks & Fish Ladder', cat: 'culture', cost: 0, lat: 47.6659, lng: -122.3972, desc: 'Watch boats transition between Puget Sound and Lake Union. The underwater fish ladder viewing room shows salmon migrating upstream.' },
    ],
    afternoon: [
      { name: 'Museum of Pop Culture (MoPOP)', cat: 'museum', cost: 28, lat: 47.6215, lng: -122.3492, desc: 'Frank Gehry\'s architectural masterpiece. The Sound Lab lets you play instruments from Nirvana to Kendrick Lamar.' },
      { name: 'Discovery Park', cat: 'outdoor', cost: 0, lat: 47.6639, lng: -122.4055, desc: 'Seattle\'s largest park — 534 acres of forests, meadows, and a 2-mile loop to a lighthouse with breathtaking Puget Sound views.' },
    ],
    evening: [
      { name: 'The Walrus and the Carpenter', cat: 'restaurant', cost: 45, lat: 47.6671, lng: -122.3967, desc: 'A James Beard Award-winning oyster bar in Ballard. Minimalist space, incredible raw bar, and the best seafood in Seattle.' },
      { name: 'Sunset Tavern (Ballard)', cat: 'entertainment', cost: 12, lat: 47.6685, lng: -122.3839, desc: 'A legendary Ballard dive with live local music every night. The dance floor gets sweaty, the drinks are cheap.' },
    ]
  }
}

const NASHVILLE_VENUES = {
  broadway: {
    morning: [
      { name: 'Ryman Auditorium Tour', cat: 'culture', cost: 25, lat: 36.1609, lng: -86.7766, desc: 'The "Mother Church of Country Music." The self-guided tour includes holographic performances and the history of the Grand Ole Opry.' },
      { name: 'Pancake Pantry (Hillsboro Village)', cat: 'restaurant', cost: 10, lat: 36.1425, lng: -86.7962, desc: 'A Nashville institution since 1960. 23 varieties of pancakes — the sweet potato pecan is legendary.' },
    ],
    afternoon: [
      { name: 'Country Music Hall of Fame', cat: 'museum', cost: 28, lat: 36.1586, lng: -86.7762, desc: 'A massive museum tracing country music from its roots to today. Elvis\'s gold Cadillac and Taylor Swift\'s costumes are on display.' },
      { name: 'Centennial Park & The Parthenon', cat: 'park', cost: 0, lat: 36.1496, lng: -86.8134, desc: 'A full-scale replica of the Athenian Parthenon houses an art museum inside. The park has walking trails and a beautiful pond.' },
    ],
    evening: [
      { name: 'Hattie B\'s Hot Chicken', cat: 'restaurant', cost: 14, lat: 36.1491, lng: -86.7900, desc: 'Nashville\'s most famous hot chicken. Choose your heat level from "Mild" to "Shut the Cluck Up." The pimento mac is essential.' },
      { name: 'The Bluebird Cafe', cat: 'entertainment', cost: 15, lat: 36.1011, lng: -86.8258, desc: 'The legendary listening room where Garth Brooks and Taylor Swift were discovered. Intimate, acoustic, unforgettable.' },
    ]
  },
  east_nashville: {
    morning: [
      { name: 'Five Points (East Nashville)', cat: 'shopping', cost: 10, lat: 36.1704, lng: -86.7547, desc: 'East Nashville\'s quirky commercial district — vintage shops, record stores, and indie boutiques in a walkable stretch.' },
    ],
    afternoon: [
      { name: 'Shelby Park', cat: 'outdoor', cost: 0, lat: 36.1732, lng: -86.7461, desc: 'Nashville\'s biggest park with walking trails, a lake, and the Steel slab skate park. The greenway connects to the Cumberland River.' },
      { name: 'The Basement East', cat: 'culture', cost: 10, lat: 36.1703, lng: -86.7543, desc: 'A beloved East Nashville music venue. The "I Believe in Nashville" mural outside is the most Instagrammed wall in the city.' },
    ],
    evening: [
      { name: 'Lockeland Table', cat: 'restaurant', cost: 35, lat: 36.1703, lng: -86.7545, desc: 'A neighborhood farm-to-table restaurant with wood-fired pizzas and southern hospitality. The pimento cheese fritters are divine.' },
      { name: 'The Fox Bar & Cocktail Club', cat: 'bar', cost: 16, lat: 36.1708, lng: -86.7542, desc: 'A dimly lit East Nashville speakeasy with inventive cocktails. No sign outside — look for the fox on the door.' },
    ]
  }
}

const AUSTIN_VENUES = {
  downtown: {
    morning: [
      { name: 'Barton Springs Pool', cat: 'outdoor', cost: 5, lat: 30.2647, lng: -97.7713, desc: 'A natural spring-fed pool in Zilker Park. The 68-degree water is refreshing year-round. Go early to avoid the crowds.' },
      { name: 'Veracruz All Natural', cat: 'restaurant', cost: 8, lat: 30.2685, lng: -97.7440, desc: 'Austin\'s best breakfast tacos — no debate. The migas taco with fresh salsa verde is a morning ritual for locals.' },
    ],
    afternoon: [
      { name: 'Texas State Capitol', cat: 'culture', cost: 0, lat: 30.2747, lng: -97.7404, desc: 'Larger than the US Capitol (by 7 feet!). Free tours, stunning rotunda, and the best free air conditioning downtown.' },
      { name: 'South Congress Avenue', cat: 'shopping', cost: 15, lat: 30.2551, lng: -97.7494, desc: 'Austin\'s most iconic street — vintage shops, weird boutiques, the "I Love You So Much" mural, and the Continental Club.' },
    ],
    evening: [
      { name: 'Franklin Barbecue', cat: 'restaurant', cost: 25, lat: 30.2782, lng: -97.7342, desc: 'Widely considered the best barbecue in the world. Get in line by 9 AM (yes, for dinner). The brisket is transcendent.' },
      { name: 'The Continental Club', cat: 'entertainment', cost: 15, lat: 30.2558, lng: -97.7493, desc: 'Austin\'s legendary honky-tonk on South Congress. Live music every night — rockabilly, country, blues, and soul.' },
    ]
  },
  south_congress: {
    morning: [
      { name: 'Zilker Park Botanical Garden', cat: 'park', cost: 2, lat: 30.2687, lng: -97.7721, desc: 'A serene 31-acre garden with native Texas plants, a Japanese garden, and a butterfly trail. The most peaceful spot in Austin.' },
    ],
    afternoon: [
      { name: 'The Blanton Museum of Art', cat: 'museum', cost: 12, lat: 30.2796, lng: -97.7348, desc: 'UT Austin\'s world-class art museum. The Ellsworth Kelly "Austin" chapel is a stunning standalone building of colored light.' },
      { name: 'Lady Bird Lake Hike & Bike Trail', cat: 'outdoor', cost: 0, lat: 30.2622, lng: -97.7495, desc: 'A 10-mile loop around the lake with skyline views, the iconic Pfluger Pedestrian Bridge, and bat watching at sunset.' },
    ],
    evening: [
      { name: 'Odd Duck (South Lamar)', cat: 'restaurant', cost: 40, lat: 30.2648, lng: -97.7583, desc: 'James Beard-nominated New American cuisine with Texas ingredients. The smoked carrots and goat dumplings are unforgettable.' },
      { name: 'Hotel San José Lounge (South Congress)', cat: 'bar', cost: 14, lat: 30.2555, lng: -97.7495, desc: 'A mid-century minimalist courtyard bar with string lights, pool tables, and the coolest vibe on South Congress.' },
    ]
  }
}

// ── Phase 2: 22 New US Metros (basic mock data — real gems in DB) ──
const PHASE2_VENUES = {
  houston: { main: { morning: [{ name: 'Houston Zoo', cat: 'culture', cost: 15, lat: 29.7150, lng: -95.3890, desc: 'One of the most visited zoos in the US with amazing primate and reptile exhibits.' }], afternoon: [{ name: 'Houston Museum District', cat: 'museum', cost: 0, lat: 29.7220, lng: -95.3910, desc: '19 museums in walking distance. The Museum of Fine Arts and Natural Science are world-class.' }, { name: 'Buffalo Bayou Park', cat: 'park', cost: 0, lat: 29.7520, lng: -95.3700, desc: 'A 160-acre park along the bayou with walking trails, cistern, and skyline views.' }], evening: [{ name: 'The Heights Dining', cat: 'restaurant', cost: 35, lat: 29.7800, lng: -95.3900, desc: 'The Heights neighborhood has the best restaurants and bars in Houston.' }] } },
  dallas: { main: { morning: [{ name: 'Dallas Arts District', cat: 'culture', cost: 0, lat: 32.7880, lng: -96.8020, desc: 'The largest contiguous arts district in the US.' }], afternoon: [{ name: 'Bishop Arts District', cat: 'shopping', cost: 15, lat: 32.7620, lng: -96.8220, desc: 'Walkable shopping and dining in a charming historic neighborhood.' }, { name: 'Klyde Warren Park', cat: 'park', cost: 0, lat: 32.7890, lng: -96.8010, desc: 'A 5-acre deck park built over a freeway.' }], evening: [{ name: 'Deep Ellum Music', cat: 'entertainment', cost: 20, lat: 32.7840, lng: -96.7820, desc: 'The best live music in Texas.' }] } },
  atlanta: { main: { morning: [{ name: 'Ponce City Market', cat: 'shopping', cost: 10, lat: 33.7720, lng: -82.3620, desc: 'Historic building turned food hall and shops.' }], afternoon: [{ name: 'BeltLine Eastside Trail', cat: 'outdoor', cost: 0, lat: 33.7580, lng: -82.3600, desc: 'The 2-mile Eastside Trail with murals and breweries.' }, { name: 'MLK National Historical Park', cat: 'culture', cost: 0, lat: 33.7550, lng: -84.3730, desc: 'Free tour of MLK\'s birth home.' }], evening: [{ name: 'The Optimist Seafood', cat: 'restaurant', cost: 50, lat: 33.7670, lng: -84.3810, desc: 'A seafood lover\'s paradise on the Westside.' }] } },
  phoenix: { main: { morning: [{ name: 'Camelback Mountain', cat: 'outdoor', cost: 0, lat: 33.5160, lng: -111.9600, desc: 'The iconic Echo Canyon trail. Go at sunrise.' }], afternoon: [{ name: 'Desert Botanical Garden', cat: 'park', cost: 25, lat: 33.4570, lng: -111.9440, desc: '50 acres of stunning desert plants.' }, { name: 'Roosevelt Row Arts', cat: 'culture', cost: 0, lat: 33.4590, lng: -112.0710, desc: 'Downtown arts hub with galleries and murals.' }], evening: [{ name: 'Little Miss BBQ', cat: 'restaurant', cost: 20, lat: 33.4470, lng: -112.0720, desc: 'The best BBQ in Arizona. Brisket sells out by 2pm.' }] } },
  portland: { main: { morning: [{ name: 'Forest Park Wildwood Trail', cat: 'outdoor', cost: 0, lat: 45.5400, lng: -122.7290, desc: '30 miles of trail through one of the largest urban forests.' }], afternoon: [{ name: 'Pearl District', cat: 'shopping', cost: 15, lat: 45.5250, lng: -122.6840, desc: 'Galleries, shops, and Powell\'s City of Books.' }, { name: 'Alberta Arts District', cat: 'culture', cost: 0, lat: 45.5590, lng: -122.6630, desc: 'A vibrant mile of galleries and food carts.' }], evening: [{ name: 'Le Pigeon', cat: 'restaurant', cost: 60, lat: 45.5210, lng: -122.6610, desc: 'James Beard Award-winning French dining.' }] } },
  denver: { main: { morning: [{ name: 'Red Rocks Park', cat: 'outdoor', cost: 0, lat: 39.6650, lng: -105.2050, desc: 'The iconic amphitheater. Go for sunrise.' }], afternoon: [{ name: 'RiNo Art District', cat: 'culture', cost: 0, lat: 39.7650, lng: -104.9860, desc: 'River North galleries, breweries, and street art.' }, { name: '16th Street Mall', cat: 'shopping', cost: 10, lat: 39.7440, lng: -104.9910, desc: 'A mile-long pedestrian mall with free shuttles.' }], evening: [{ name: 'Union Station', cat: 'restaurant', cost: 40, lat: 39.7530, lng: -104.9990, desc: 'The beautifully restored station with dining and cocktails.' }] } },
  'san antonio': { main: { morning: [{ name: 'The Alamo', cat: 'culture', cost: 0, lat: 29.4260, lng: -98.4860, desc: 'The iconic mission where Texas history was made.' }], afternoon: [{ name: 'Pearl District', cat: 'shopping', cost: 10, lat: 29.4520, lng: -98.4810, desc: 'The new foodie hub with farmers market.' }, { name: 'San Antonio Missions National Park', cat: 'culture', cost: 0, lat: 29.3620, lng: -98.4990, desc: 'Four UNESCO World Heritage missions along the river.' }], evening: [{ name: 'River Walk Museum Reach', cat: 'entertainment', cost: 20, lat: 29.4300, lng: -98.4830, desc: 'The less-crowded north section of the famous River Walk.' }] } },
  'san diego': { main: { morning: [{ name: 'Sunset Cliffs Natural Park', cat: 'outdoor', cost: 0, lat: 32.7280, lng: -117.2540, desc: 'Stunning ocean cliffs and the best free sunset spot.' }], afternoon: [{ name: 'North Park', cat: 'restaurant', cost: 15, lat: 32.7520, lng: -117.1300, desc: 'Where locals actually eat and drink.' }, { name: 'Balboa Park', cat: 'park', cost: 0, lat: 32.7340, lng: -117.1440, desc: '1,200 acres of gardens, museums, and the famous zoo.' }], evening: [{ name: 'Carnitas Snack Shack', cat: 'restaurant', cost: 15, lat: 32.7480, lng: -117.1270, desc: 'Incredible pork dishes in a tiny Embarcadero spot.' }] } },
  sacramento: { main: { morning: [{ name: 'Tower Bridge', cat: 'culture', cost: 0, lat: 38.5800, lng: -121.5060, desc: 'The iconic yellow bridge connecting Sacramento to West Sacramento.' }], afternoon: [{ name: 'Midtown Farmers Market', cat: 'shopping', cost: 10, lat: 38.5700, lng: -121.4810, desc: 'Farm-to-fork capital of California.' }, { name: 'Old Sacramento Waterfront', cat: 'culture', cost: 0, lat: 38.5830, lng: -121.5040, desc: 'Historic Gold Rush-era boardwalk along the Sacramento River.' }], evening: [{ name: 'The Golden Bear', cat: 'restaurant', cost: 30, lat: 38.5700, lng: -121.4820, desc: 'Midtown hotspot with craft cocktails and California cuisine.' }] } },
  riverside: { main: { morning: [{ name: 'Mission Inn', cat: 'culture', cost: 10, lat: 33.9830, lng: -117.3730, desc: 'The historic Mission Inn with stunning architecture and gardens.' }], afternoon: [{ name: 'Box Springs Mountain Park', cat: 'outdoor', cost: 0, lat: 33.9680, lng: -117.2900, desc: 'Best hiking trails in the Inland Empire.' }, { name: 'Downtown Riverside Arts Walk', cat: 'culture', cost: 0, lat: 33.9800, lng: -117.3750, desc: 'Galleries and street art in the historic downtown.' }], evening: [{ name: 'Mario\'s Place', cat: 'restaurant', cost: 35, lat: 33.9820, lng: -117.3740, desc: 'Upscale Italian in the Mission Inn district.' }] } },
  minneapolis: { main: { morning: [{ name: 'Chain of Lakes Trail', cat: 'outdoor', cost: 0, lat: 44.9450, lng: -93.3070, desc: 'The Grand Rounds trail connects Lake Calhoun, Harriet, and Isles.' }], afternoon: [{ name: 'Minneapolis Skyway System', cat: 'culture', cost: 0, lat: 44.9770, lng: -93.2650, desc: '11 miles of indoor walkways connecting downtown.' }, { name: 'Mill City Museum', cat: 'museum', cost: 12, lat: 44.9770, lng: -93.2560, desc: 'History of flour milling on the Mississippi riverfront.' }], evening: [{ name: 'Young Joni', cat: 'restaurant', cost: 40, lat: 44.9990, lng: -93.2790, desc: 'James Beard-nominated pizza and wood-fired food in Northeast.' }] } },
  detroit: { main: { morning: [{ name: 'Eastern Market', cat: 'shopping', cost: 10, lat: 42.3460, lng: -83.0400, desc: 'One of the oldest and largest public markets in the US.' }], afternoon: [{ name: 'Detroit Institute of Arts', cat: 'museum', cost: 14, lat: 42.3520, lng: -83.0650, desc: 'World-class museum with the Diego Rivera murals.' }, { name: 'Dequindre Cut Greenway', cat: 'outdoor', cost: 0, lat: 42.3400, lng: -83.0360, desc: 'A 2-mile rail-trail with street art and skyline views.' }], evening: [{ name: 'Lafayette Coney Island', cat: 'restaurant', cost: 8, lat: 42.3310, lng: -83.0470, desc: 'THE Detroit Coney Island. The original since 1917.' }] } },
  'st louis': { main: { morning: [{ name: 'Forest Park', cat: 'park', cost: 0, lat: 38.6380, lng: -90.2840, desc: 'Larger than Central Park — with free museums and zoo.' }], afternoon: [{ name: 'City Museum', cat: 'culture', cost: 18, lat: 38.6320, lng: -90.1960, desc: 'A giant playground made from reclaimed architectural artifacts.' }, { name: 'Delmar Loop', cat: 'shopping', cost: 10, lat: 38.6580, lng: -90.3060, desc: 'Eclectic entertainment district with live blues and indie shops.' }], evening: [{ name: 'Pappy\'s Smokehouse', cat: 'restaurant', cost: 18, lat: 38.6200, lng: -90.2100, desc: 'Some of the best BBQ ribs in the country.' }] } },
  cincinnati: { main: { morning: [{ name: 'Findlay Market', cat: 'shopping', cost: 8, lat: 39.1150, lng: -84.5250, desc: 'Ohio\'s oldest public market. Operating since 1855.' }], afternoon: [{ name: 'Over-the-Rhine', cat: 'culture', cost: 0, lat: 39.1100, lng: -84.5180, desc: 'The best-preserved 19th-century urban neighborhood in the US.' }, { name: 'Roebling Bridge', cat: 'culture', cost: 0, lat: 39.1060, lng: -84.5060, desc: 'The precursor to the Brooklyn Bridge. Free to walk.' }], evening: [{ name: 'Skyline Chili', cat: 'restaurant', cost: 8, lat: 39.1000, lng: -84.5130, desc: 'Greek-style chili on spaghetti. A local obsession.' }] } },
  'kansas city': { main: { morning: [{ name: 'Kansas City Streetcar', cat: 'culture', cost: 0, lat: 39.0970, lng: -94.5790, desc: 'Free streetcar through downtown and the Crossroads.' }], afternoon: [{ name: 'Crossroads Arts District', cat: 'culture', cost: 0, lat: 39.0920, lng: -94.5810, desc: 'The best First Friday art walk in the Midwest.' }, { name: 'Joe\'s Kansas City BBQ', cat: 'restaurant', cost: 15, lat: 39.0640, lng: -94.6060, desc: 'The legendary BBQ joint in a gas station. Burnt ends are the move.' }], evening: [{ name: 'Green Lady Lounge', cat: 'entertainment', cost: 15, lat: 39.0950, lng: -94.5860, desc: 'The best jazz lounge in KC. Dark, moody, incredible.' }] } },
  columbus: { main: { morning: [{ name: 'Short North Arts District', cat: 'culture', cost: 0, lat: 39.9870, lng: -83.0060, desc: 'The cultural corridor — galleries, bars, and restaurants.' }], afternoon: [{ name: 'German Village', cat: 'culture', cost: 0, lat: 39.9500, lng: -83.0000, desc: 'Brick streets and the Book Loft — 32 rooms of books.' }, { name: 'Scioto Mile', cat: 'park', cost: 0, lat: 39.9600, lng: -83.0020, desc: 'Waterfront park with fountains and skyline views.' }], evening: [{ name: 'North Market', cat: 'restaurant', cost: 12, lat: 39.9740, lng: -83.0030, desc: 'Historic public market with diverse food vendors.' }] } },
  indianapolis: { main: { morning: [{ name: 'Cultural Trail', cat: 'outdoor', cost: 0, lat: 39.7680, lng: -86.1580, desc: 'An 8-mile bike/pedestrian path connecting all downtown neighborhoods.' }], afternoon: [{ name: 'Mass Ave', cat: 'culture', cost: 0, lat: 39.7710, lng: -86.1480, desc: 'The arts and entertainment district.' }, { name: 'Indianapolis Children\'s Museum', cat: 'museum', cost: 18, lat: 39.8120, lng: -86.1570, desc: 'The largest children\'s museum in the world.' }], evening: [{ name: 'St. Elmo Steak House', cat: 'restaurant', cost: 60, lat: 39.7680, lng: -86.1570, desc: 'A legendary steakhouse since 1902. The shrimp cocktail is famous.' }] } },
  cleveland: { main: { morning: [{ name: 'West Side Market', cat: 'shopping', cost: 8, lat: 41.4890, lng: -81.7080, desc: 'Historic market since 1912. Get pierogi and a falafel.' }], afternoon: [{ name: 'University Circle', cat: 'culture', cost: 0, lat: 41.5100, lng: -81.6090, desc: 'Cultural hub — art museum, natural history, Severance Hall.' }, { name: 'Edgewater Beach', cat: 'outdoor', cost: 0, lat: 41.4970, lng: -81.7530, desc: 'The best Lake Erie beach with stunning sunsets.' }], evening: [{ name: 'Great Lakes Brewing Co', cat: 'restaurant', cost: 20, lat: 41.4820, lng: -81.6970, desc: 'Cleveland\'s original craft brewery in Ohio City.' }] } },
  pittsburgh: { main: { morning: [{ name: 'Duquesne Incline', cat: 'culture', cost: 4, lat: 40.4370, lng: -80.0210, desc: 'Funicular railway with stunning views of the three rivers.' }], afternoon: [{ name: 'Strip District', cat: 'shopping', cost: 10, lat: 40.4560, lng: -79.9920, desc: 'Warehouses turned into food and shopping paradise.' }, { name: 'Carnegie Museum of Art', cat: 'museum', cost: 20, lat: 40.4430, lng: -79.9500, desc: 'World-class art and natural history under one roof.' }], evening: [{ name: 'Primanti Bros', cat: 'restaurant', cost: 12, lat: 40.4570, lng: -79.9910, desc: 'The iconic sandwich with fries and coleslaw ON IT.' }] } },
  tampa: { main: { morning: [{ name: 'Tampa Riverwalk', cat: 'outdoor', cost: 0, lat: 27.9470, lng: -82.4580, desc: '2.4 miles of waterfront path with museums and parks.' }], afternoon: [{ name: 'Ybor City', cat: 'culture', cost: 0, lat: 27.9610, lng: -82.4410, desc: 'Historic Latin quarter — cigar shops, clubs, Cuban food.' }, { name: 'Florida Aquarium', cat: 'museum', cost: 25, lat: 27.9420, lng: -82.4460, desc: 'One of the top aquariums in the country.' }], evening: [{ name: 'Columbia Restaurant (Ybor)', cat: 'restaurant', cost: 35, lat: 27.9600, lng: -82.4410, desc: 'Florida\'s oldest restaurant. The 1905 salad and Cuban sandwich are legendary.' }] } },
  charlotte: { main: { morning: [{ name: 'NoDa Arts District', cat: 'culture', cost: 0, lat: 35.2310, lng: -80.8020, desc: 'North Davidson — galleries, breweries, live music.' }], afternoon: [{ name: 'South End Rail Trail', cat: 'outdoor', cost: 0, lat: 35.2180, lng: -80.8580, desc: '3.5 miles with murals, breweries, and restaurants.' }, { name: 'U.S. National Whitewater Center', cat: 'outdoor', cost: 25, lat: 35.2800, lng: -80.9340, desc: 'World\'s largest man-made whitewater river.' }], evening: [{ name: 'Soul Food Sessions', cat: 'restaurant', cost: 25, lat: 35.2330, lng: -80.8450, desc: 'Modern Southern cuisine in a cozy NoDa spot.' }] } },
  baltimore: { main: { morning: [{ name: 'Fell\'s Point', cat: 'culture', cost: 0, lat: 39.2830, lng: -76.5920, desc: 'Historic waterfront with cobblestone streets and great bars.' }], afternoon: [{ name: 'Lexington Market', cat: 'shopping', cost: 10, lat: 39.2910, lng: -76.6200, desc: 'Since 1782. Get a crab cake from Faidley\'s.' }, { name: 'Inner Harbor', cat: 'culture', cost: 0, lat: 39.2850, lng: -76.6150, desc: 'The iconic waterfront with the National Aquarium and USS Constellation.' }], evening: [{ name: 'Thames Street Oyster House', cat: 'restaurant', cost: 45, lat: 39.2820, lng: -76.5900, desc: 'The best seafood in Fell\'s Point. The lobster roll is incredible.' }] } },
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
    'los angeles': { subway: 'Drive 15 mins on the 101 freeway', walk_uber: '10 min Uber/Lyft or walk', evening: 'Drive or take a rideshare — LA nightlife needs wheels' },
    la: { subway: 'Drive 15 mins on the 101 freeway', walk_uber: '10 min Uber/Lyft or walk', evening: 'Drive or take a rideshare — LA nightlife needs wheels' },
    'las vegas': { subway: 'Take the monorail along the Strip', walk_uber: 'Quick walk or a short rideshare', evening: 'Take the monorail or walk the Strip' },
    vegas: { subway: 'Take the monorail along the Strip', walk_uber: 'Quick walk or a short rideshare', evening: 'Take the monorail or walk the Strip' },
    orlando: { subway: 'Ride the I-Ride Trolley', walk_uber: 'A quick rideshare or walk', evening: 'Take a rideshare to your next spot' },
    'san francisco': { subway: 'Hop on the BART', walk_uber: '10 min walk or grab a cable car', evening: 'BART or a short rideshare' },
    sf: { subway: 'Hop on the BART to your next stop', walk_uber: '10 min walk or grab a cable car to Powell', evening: 'BART or a quick Uber' },
    seattle: { subway: 'Take the Link Light Rail', walk_uber: '15 min walk or a quick ferry across the Sound?', evening: 'Link Light Rail or a rideshare' },
    nashville: { subway: 'Walk Broadway — everything is close together', walk_uber: '10 min walk or a quick rideshare', evening: 'Take a rideshare to East Nashville' },
    austin: { subway: 'Rent a bike on South Congress', walk_uber: '10 min walk or a quick rideshare', evening: 'Take a rideshare or the 801 bus' },
    // ── Phase 2: 22 New US Metros ──
    houston: { subway: 'Take the METRO rail (Red Line) toward your next stop', walk_uber: 'Drive the 610 loop or take a short rideshare', evening: 'Take a rideshare — Houston sprawl needs wheels' },
    dallas: { subway: 'Take the DART light rail (Red/Blue Line)', walk_uber: 'Quick rideshare or walk through downtown', evening: 'Take the DART or a rideshare' },
    atlanta: { subway: 'Take MARTA (Red/Gold Line) to your next stop', walk_uber: 'Walk or take the BeltLine trail', evening: 'MARTA or a rideshare on the BeltLine' },
    phoenix: { subway: 'Take the Valley Metro Light Rail', walk_uber: 'Take a rideshare — Phoenix is spread out', evening: 'Rideshare or drive' },
    'san antonio': { subway: 'Hop on VIA Transit or take a rideshare', walk_uber: 'Walk along the River Walk', evening: 'Walk the River Walk or rideshare' },
    'san diego': { subway: 'Take the San Diego Trolley (Blue Line)', walk_uber: 'Walk or a short rideshare', evening: 'Trolley or rideshare along the coast' },
    portland: { subway: 'Take the MAX Light Rail', walk_uber: 'Hop the streetcar through the Pearl District', evening: 'MAX or a short rideshare' },
    sacramento: { subway: 'Take the SacRT Gold Line Light Rail', walk_uber: 'Walk or rent a Jump bike', evening: 'Light Rail or rideshare' },
    riverside: { subway: 'Take Metrolink or the RTA bus', walk_uber: 'Take a rideshare — the IE is car territory', evening: 'Drive or rideshare' },
    minneapolis: { subway: 'Take the Blue Line Light Rail', walk_uber: 'Walk through the Skyway system or rideshare', evening: 'Light Rail or rideshare — Skyway closes at 9' },
    detroit: { subway: 'Take the QLine streetcar along Woodward', walk_uber: 'Walk or take the People Mover', evening: 'QLine, People Mover, or rideshare' },
    'st louis': { subway: 'Take MetroLink (Red Line) to your stop', walk_uber: 'Walk or a quick rideshare', evening: 'MetroLink or rideshare' },
    cincinnati: { subway: 'Take the Connector streetcar (free!)', walk_uber: 'Walk through Over-the-Rhine', evening: 'Streetcar or rideshare' },
    'kansas city': { subway: 'Take the KC Streetcar (free!) on Main', walk_uber: 'Walk through the Crossroads Arts District', evening: 'Streetcar or rideshare' },
    columbus: { subway: 'Take a COTA bus or rideshare', walk_uber: 'Walk the Short North or rideshare', evening: 'Rideshare or Lime scooter' },
    indianapolis: { subway: 'Take the IndyGo Red Line BRT', walk_uber: 'Walk along Mass Ave or rideshare', evening: 'Rideshare or scooter' },
    cleveland: { subway: 'Take the RTA Red Line to your stop', walk_uber: 'Walk or rideshare', evening: 'RTA or rideshare' },
    pittsburgh: { subway: 'Take the T (Light Rail) to Station Square', walk_uber: 'Walk or take an incline for the views', evening: 'The T or rideshare — the inclines run late' },
    tampa: { subway: 'Take the TECO Line Streetcar', walk_uber: 'Walk through Ybor City or rideshare', evening: 'Streetcar or rideshare along the Riverwalk' },
    denver: { subway: 'Take the RTD A Line or E Line light rail', walk_uber: 'Rent a scooter on 16th Street Mall', evening: 'Light Rail or scooter' },
    charlotte: { subway: 'Take the CATS Blue Line Light Rail', walk_uber: 'Walk the Rail Trail or rideshare', evening: 'Light Rail or rideshare' },
    baltimore: { subway: 'Take the Light Rail or Metro Subway', walk_uber: 'Hop the free Charm City Circulator', evening: 'Circulator, Light Rail, or rideshare' },
    // ── Phase 3: 35 Next Cities ──
    'san-jose': { subway: 'Hop on VTA Light Rail or take a Caltrain', walk_uber: 'Walk through downtown or rideshare', evening: 'VTA or rideshare' },
    milwaukee: { subway: 'Take The Hop streetcar', walk_uber: 'Walk the Lakefront trail or rideshare', evening: 'The Hop or rideshare' },
    'new-orleans': { subway: 'Take the St. Charles Streetcar', walk_uber: 'Walk the French Quarter or rideshare', evening: 'Streetcar or walk the Quarter' },
    memphis: { subway: 'Take the Main Street Trolley', walk_uber: 'Walk Beale Street or rideshare', evening: 'Trolley or rideshare' },
    'oklahoma-city': { subway: 'Take the Oklahoma City Streetcar', walk_uber: 'Walk the Plaza District or rideshare', evening: 'Streetcar or rideshare' },
    louisville: { subway: 'Take TARC bus or rideshare', walk_uber: 'Walk Bardstown Road or rideshare', evening: 'Rideshare — bourbon tours run late' },
    richmond: { subway: 'Take the GRTC Pulse Bus Rapid Transit', walk_uber: 'Walk Carytown or rideshare', evening: 'Pulse BRT or rideshare' },
    providence: { subway: 'Take the Providence/Stoughton Commuter Rail', walk_uber: 'Walk College Hill or rideshare', evening: 'Commuter Rail or rideshare' },
    buffalo: { subway: 'Take the NFTA Metro Rail', walk_uber: 'Walk Elmwood Village or rideshare', evening: 'Metro Rail or rideshare' },
    birmingham: { subway: 'Take the Birmingham Xpress BRT', walk_uber: 'Walk the Railroad District or rideshare', evening: 'Rideshare' },
    hartford: { subway: 'Take CTfastrak or rideshare', walk_uber: 'Walk Bushnell Park area or rideshare', evening: 'Rideshare' },
    albuquerque: { subway: 'Take ABQ Ride or the Rail Runner', walk_uber: 'Walk Old Town or rideshare', evening: 'Rideshare' },
    rochester: { subway: 'Take the RTS bus or rideshare', walk_uber: 'Walk Park Avenue or rideshare', evening: 'Rideshare' },
    tucson: { subway: 'Take the Sun Tran bus or Sun Link Streetcar', walk_uber: 'Walk Fourth Avenue or rideshare', evening: 'Streetcar or rideshare' },
    fresno: { subway: 'Take FAX bus or rideshare', walk_uber: 'Walk the Tower District or rideshare', evening: 'Rideshare' },
    honolulu: { subway: 'Take TheBus or the Waikiki Trolley', walk_uber: 'Walk Waikiki or rideshare', evening: 'TheBus or rideshare' },
    'el-paso': { subway: 'Take the Sun Metro bus or Brio BRT', walk_uber: 'Walk downtown or rideshare', evening: 'Rideshare' },
    'grand-rapids': { subway: 'Take The Rapid bus or rideshare', walk_uber: 'Walk the East Hills or rideshare', evening: 'Rideshare' },
    greenville: { subway: 'Take Greenlink bus or rideshare', walk_uber: 'Walk Main Street or rideshare', evening: 'Walk downtown — it\'s compact' },
    knoxville: { subway: 'Take KAT bus or rideshare', walk_uber: 'Walk Market Square or rideshare', evening: 'Rideshare' },
    wichita: { subway: 'Take the QLine bus or rideshare', walk_uber: 'Walk Old Town or rideshare', evening: 'Rideshare' },
    toledo: { subway: 'Take TARTA bus or rideshare', walk_uber: 'Walk the Maumee riverfront or rideshare', evening: 'Rideshare' },
    boise: { subway: 'Take ValleyRide bus or rideshare', walk_uber: 'Walk Hyde Park or rideshare', evening: 'Rideshare' },
    'colorado-springs': { subway: 'Take Mountain Metro bus or rideshare', walk_uber: 'Walk downtown or rideshare', evening: 'Rideshare' },
    dayton: { subway: 'Take the RTA bus or rideshare', walk_uber: 'Walk the Oregon District or rideshare', evening: 'Rideshare' },
    'des-moines': { subway: 'Take DART bus or rideshare', walk_uber: 'Walk the East Village or rideshare', evening: 'Rideshare' },
    'daytona-beach': { subway: 'Take Votran bus or rideshare', walk_uber: 'Walk the Boardwalk or rideshare', evening: 'Rideshare' },
    'palm-bay': { subway: 'Take Space Coast Area Transit or rideshare', walk_uber: 'Rideshare — spread out area', evening: 'Rideshare' },
    ogden: { subway: 'Take the FrontRunner commuter rail', walk_uber: 'Walk Historic 25th Street or rideshare', evening: 'FrontRunner or rideshare' },
    bakersfield: { subway: 'Take GET bus or rideshare', walk_uber: 'Walk downtown or rideshare', evening: 'Rideshare' },
    syracuse: { subway: 'Take Centro bus or rideshare', walk_uber: 'Walk Armory Square or rideshare', evening: 'Rideshare' },
    allentown: { subway: 'Take LANTA bus or rideshare', walk_uber: 'Walk Hamilton Street or rideshare', evening: 'Rideshare' },
    'cape-coral': { subway: 'Take LeeTran bus or rideshare', walk_uber: 'Rideshare — the city is spread along canals', evening: 'Rideshare' },
    'springfield-ma': { subway: 'Take PVTA bus or rideshare', walk_uber: 'Walk downtown or rideshare', evening: 'Rideshare' },
    chattanooga: { subway: 'Take CARTA bus or the free shuttle', walk_uber: 'Walk the North Shore or rideshare', evening: 'Free downtown shuttle or rideshare' },
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
    // ── 7 New US Cities ──
    'los angeles': { data: LA_VENUES, districts: ['westside', 'eastside'], tips: [
      'LA is a driving city. The 405 and 101 are brutal during rush hour (7-9 AM, 4-7 PM). Plan around it.',
      'In-N-Out is fine, but locals go to Tommy\'s for chili burgers or Howlin\' Ray\'s for Nashville hot chicken.',
      'The Getty Center is free — just pay for parking. Go on a clear day for insane ocean-to-mountain views.',
      'Venice Beach gets crowded on weekends. Go on a weekday morning for the best experience.',
      'The Metro B Line (Red) connects Downtown to Hollywood and Universal City. Underrated for avoiding traffic.',
    ]},
    'la': { data: LA_VENUES, districts: ['westside', 'eastside'], tips: [
      'LA is a driving city. The 405 and 101 are brutal during rush hour.',
      'In-N-Out is fine, but locals go to Tommy\'s for chili burgers.',
    ]},
    'las vegas': { data: VEGAS_VENUES, districts: ['the_strip', 'downtown'], tips: [
      'The Strip is longer than it looks — 4.2 miles end to end. Wear comfortable shoes.',
      'Skip the buffet lines. The best food in Vegas is at off-Strip locals\' spots.',
      'Downtown (Fremont Street) is cheaper, weirder, and more authentic than the Strip.',
      'The monorail runs behind the east side of the Strip. Cheaper than rideshares.',
      'Free parking is disappearing on the Strip. The Rio and downtown casinos still offer it.',
    ]},
    'vegas': { data: VEGAS_VENUES, districts: ['the_strip', 'downtown'], tips: [
      'The Strip is longer than it looks — 4.2 miles end to end.',
      'Downtown (Fremont Street) is cheaper, weirder, and more authentic.',
    ]},
    'orlando': { data: ORLANDO_VENUES, districts: ['theme_park_area', 'winter_park'], tips: [
      'Orlando is more than theme parks. Winter Park and Mills 50 have incredible local food scenes.',
      'I-Ride Trolley runs along International Drive. Cheap and easy.',
      'Lake Eola in downtown Orlando is gorgeous at sunset. Rent a swan boat.',
      'The best Cuban sandwich in Orlando is at Black Bean Deli — not in Miami.',
      'Summer afternoon thunderstorms are daily and predictable (2-4 PM). Plan indoor activities then.',
    ]},
    'san francisco': { data: SF_VENUES, districts: ['downtown', 'the_mission'], tips: [
      'SF is small but hilly. Wear comfortable shoes and bring layers — the fog can roll in any time.',
      'BART is the fastest way from the airport and between neighborhoods. Muni covers the rest.',
      'The Mission has the best burritos in the country. La Taqueria and El Farolito are the gold standard.',
      'Alcatraz tickets sell out weeks in advance. Book ahead or take a sunset firework cruise instead.',
      'The Golden Gate Bridge is free to walk/bike across. Rent a bike at Fisherman\'s Wharf and ride to Sausalito.',
    ]},
    'sf': { data: SF_VENUES, districts: ['downtown', 'the_mission'], tips: [
      'SF is small but hilly. The fog can roll in any time — bring layers.',
      'The Mission has the best burritos in the country.',
    ]},
    'seattle': { data: SEATTLE_VENUES, districts: ['capitol_hill', 'downtown'], tips: [
      'The Link Light Rail connects the airport to downtown in 35 minutes. Cheaper than a rideshare.',
      'Pike Place Market is best visited on weekday mornings before the cruise ship crowds arrive.',
      'Capitol Hill is where the locals actually hang out — coffee shops, bars, and indie bookstores.',
      'The Washington State Ferries are a bargain. $8 round trip to Bainbridge Island for a stunning skyline view.',
      'Seattle summers are perfect (70s and sunny). The rest of the year, a good rain jacket is essential.',
    ]},
    'nashville': { data: NASHVILLE_VENUES, districts: ['broadway', 'east_nashville'], tips: [
      'Broadway is fun for one night. East Nashville is where locals live, eat, and drink.',
      'Hot chicken heat levels are no joke. Start at "Medium" unless you have something to prove.',
      'The Ryman self-guided tour is worth every penny. Go see a show there if you can.',
      'Nashville is more walkable than people think — especially downtown and East Nashville.',
      'The Bluebird Cafe is tiny. Reservations open a month in advance and sell out in minutes.',
    ]},
    'austin': { data: AUSTIN_VENUES, districts: ['downtown', 'south_congress'], tips: [
      'Franklin BBQ is legendary but the line starts at 9 AM. Try Micklethwait Craft Meats or La Barbecue as alternatives.',
      'Barton Springs is $5 and worth every penny. Go on a weekday morning to avoid crowds.',
      'South Congress is Austin\'s soul. Walk it from the river to the "I Love You So Much" mural.',
      'Austin is intensely hot in summer (100°F+). Plan outdoor activities for early morning or evening.',
      'The 801 bus is the cheapest way to get around. CapMetro bikes are great for short trips downtown.',
    ]},
    // ── Phase 2: 22 New US Metros ──
    houston: { data: PHASE2_VENUES.houston, districts: ['main'], tips: ['Houston is enormous — 669 sq miles. You need a car or lots of patience.', '19 museums in the Museum District, many free on Thursdays.', 'Eat your way through: Vietnamese in Midtown, BBQ in the Heights, Mexican in East Downtown.'] },
    dallas: { data: PHASE2_VENUES.dallas, districts: ['main'], tips: ['Deep Ellum has the best live music in Texas (yes, better than Austin).', 'DART light rail is $2.50 for a day pass — connects to DFW airport.', 'Bishop Arts District is where locals actually hang out.'] },
    atlanta: { data: PHASE2_VENUES.atlanta, districts: ['main'], tips: ['Avoid the Connector (I-75/85) between 4-7 PM. Traffic is real.', 'MARTA covers downtown, midtown, and the airport.', 'Buford Highway has the best international food in the Southeast.'] },
    phoenix: { data: PHASE2_VENUES.phoenix, districts: ['main'], tips: ['Summer (May-Sept) is 110°F+ — plan outdoor activities for sunrise.', 'The Light Rail connects Mesa, Tempe, Phoenix, and Glendale.', 'Camelback Mountain hike is iconic. Go at sunrise to avoid the heat.'] },
    'san antonio': { data: PHASE2_VENUES['san antonio'], districts: ['main'], tips: ['River Walk\'s Museum Reach (north section) is where locals go.', 'Breakfast tacos are a food group. Try Taco Taco Cafe.', 'The Pearl District is the new foodie hub — farmers market on weekends.'] },
    'san diego': { data: PHASE2_VENUES['san diego'], districts: ['main'], tips: ['72°F and sunny is the average year-round. You\'ll never need a coat.', 'Skip Gaslamp. North Park and South Park are where locals hang.', 'Best fish tacos come from a food truck, not a restaurant.'] },
    portland: { data: PHASE2_VENUES.portland, districts: ['main'], tips: ['MAX Light Rail is free within the Fareless Square downtown.', 'Food cart pods are a way of life. Try the pod on Hawthorne.', 'Forest Park has 80+ miles of trails — one of the largest urban forests in the US.'] },
    sacramento: { data: PHASE2_VENUES.sacramento, districts: ['main'], tips: ['300+ days of sunshine. Hotter than you think in summer.', 'The Grid (downtown) is walkable and bikeable. Rent a Jump bike.', 'Farm-to-fork is the identity here. Every restaurant sources locally.'] },
    riverside: { data: PHASE2_VENUES.riverside, districts: ['main'], tips: ['Birthplace of California\'s citrus industry. The Mission Inn is the crown jewel.', 'Box Springs Mountain trails are the best hiking in the IE.', 'Festival of Lights at the Mission Inn (Nov-Jan) is spectacular.'] },
    minneapolis: { data: PHASE2_VENUES.minneapolis, districts: ['main'], tips: ['Winters are brutal (23°F avg high). The Skyway system is a lifesaver.', 'The Chain of Lakes are connected by the Grand Rounds trail.', 'The State Fair (Aug-Sept) is one of the best in the country.'] },
    detroit: { data: PHASE2_VENUES.detroit, districts: ['main'], tips: ['Eastern Market (Saturdays) is one of the oldest public markets in the US.', 'The QLine streetcar runs along Woodward Avenue.', 'Lafayette Coney Island vs American Coney Island — pick a side.'] },
    'st louis': { data: PHASE2_VENUES['st louis'], districts: ['main'], tips: ['Forest Park is larger than Central Park — and mostly free.', 'Toasted ravioli and gooey butter cake are St. Louis inventions.', 'City Museum is a giant playground made from reclaimed artifacts.'] },
    cincinnati: { data: PHASE2_VENUES.cincinnati, districts: ['main'], tips: ['Over-the-Rhine has the best-preserved 19th-century architecture in the US.', 'The Connector streetcar is free.', 'Skyline Chili is Greek-style chili on spaghetti — a local obsession.'] },
    'kansas city': { data: PHASE2_VENUES['kansas city'], districts: ['main'], tips: ['KC has more BBQ restaurants per capita than any US city.', 'The Streetcar is free — 2-mile loop through downtown.', 'First Fridays in the Crossroads is the best free art walk in the Midwest.'] },
    columbus: { data: PHASE2_VENUES.columbus, districts: ['main'], tips: ['The Short North is the cultural corridor — galleries, restaurants, bars.', 'German Village has brick streets and the Book Loft (32 rooms of books).', 'The Olentangy River Trail is 14 miles of paved path.'] },
    indianapolis: { data: PHASE2_VENUES.indianapolis, districts: ['main'], tips: ['The Cultural Trail is an 8-mile bike/pedestrian path through downtown.', 'Mass Ave is the arts district — theaters, galleries, bars.', 'The Children\'s Museum is the largest in the world.'] },
    cleveland: { data: PHASE2_VENUES.cleveland, districts: ['main'], tips: ['University Circle is the cultural hub — art museum, Severance Hall.', 'West Side Market has been operating since 1912. Get pierogi.', 'Edgewater Beach has stunning Lake Erie sunsets.'] },
    pittsburgh: { data: PHASE2_VENUES.pittsburgh, districts: ['main'], tips: ['450+ bridges — more than any city except Venice.', 'The Duquesne Incline has stunning skyline views.', 'The T (light rail) is free within downtown.'] },
    tampa: { data: PHASE2_VENUES.tampa, districts: ['main'], tips: ['The TECO Streetcar connects downtown to Ybor City — $2.50 all day.', 'The Cuban sandwich rivalry is real. Columbia vs La Segunda.', 'The Riverwalk is 2.4 miles of waterfront path.'] },
    denver: { data: PHASE2_VENUES.denver, districts: ['main'], tips: ['300 days of sunshine. Enjoy at one of 40+ breweries.', 'A Line from airport to downtown in 37 minutes.', 'Red Rocks is a must-visit even without a concert.'] },
    charlotte: { data: PHASE2_VENUES.charlotte, districts: ['main'], tips: ['The Light Rail has sparked development along the entire South End.', 'NoDa is the arts district — galleries, breweries, live music.', 'The Whitewater Center has the world\'s largest man-made whitewater river.'] },
    baltimore: { data: PHASE2_VENUES.baltimore, districts: ['main'], tips: ['The Charm City Circulator is FREE — three routes.', 'Lexington Market has been around since 1782. Get a crab cake from Faidley\'s.', 'Hampden has the best vintage shops in the city.'] },
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
