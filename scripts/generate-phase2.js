/**
 * Phase 2 Generator — 22 US Metros expansion
 * Generates: AI personas, transport, city configs, import script
 * Run: node scripts/generate-phase2.js
 */

const CITIES = [
  { key: 'houston', name: 'Houston', aliases: ['htx'] },
  { key: 'dallas', name: 'Dallas', aliases: ['dfw'] },
  { key: 'atlanta', name: 'Atlanta', aliases: ['atl'] },
  { key: 'phoenix', name: 'Phoenix', aliases: ['phx'] },
  { key: 'san antonio', name: 'San Antonio', aliases: ['sato'] },
  { key: 'san diego', name: 'San Diego', aliases: ['sd'] },
  { key: 'portland', name: 'Portland', aliases: ['pdx'] },
  { key: 'sacramento', name: 'Sacramento', aliases: ['sac'] },
  { key: 'riverside', name: 'Riverside', aliases: ['ie', 'inland empire'] },
  { key: 'minneapolis', name: 'Minneapolis', aliases: ['mpls', 'twin cities'] },
  { key: 'detroit', name: 'Detroit', aliases: ['dtw', 'the d'] },
  { key: 'st louis', name: 'St. Louis', aliases: ['stl'] },
  { key: 'cincinnati', name: 'Cincinnati', aliases: ['cincy', 'cinci'] },
  { key: 'kansas city', name: 'Kansas City', aliases: ['kc', 'kcm'] },
  { key: 'columbus', name: 'Columbus', aliases: ['cbus'] },
  { key: 'indianapolis', name: 'Indianapolis', aliases: ['indy'] },
  { key: 'cleveland', name: 'Cleveland', aliases: ['cle'] },
  { key: 'pittsburgh', name: 'Pittsburgh', aliases: ['pgh', 'burgh'] },
  { key: 'tampa', name: 'Tampa', aliases: ['tpa'] },
  { key: 'denver', name: 'Denver', aliases: ['den'] },
  { key: 'charlotte', name: 'Charlotte', aliases: ['clt'] },
  { key: 'baltimore', name: 'Baltimore', aliases: ['bmore', 'bwi'] },
];

// Map city keys to filename slugs for gems
const CITY_SLUG = {
  houston: 'houston', dallas: 'dallas', atlanta: 'atlanta',
  phoenix: 'phoenix', 'san antonio': 'san-antonio', 'san diego': 'san-diego',
  portland: 'portland', sacramento: 'sacramento', riverside: 'riverside',
  minneapolis: 'minneapolis', detroit: 'detroit', 'st louis': 'st-louis',
  cincinnati: 'cincinnati', 'kansas city': 'kansas-city', columbus: 'columbus',
  indianapolis: 'indianapolis', cleveland: 'cleveland', pittsburgh: 'pittsburgh',
  tampa: 'tampa', denver: 'denver', charlotte: 'charlotte', baltimore: 'baltimore',
};

// ===== PERSONAS =====
const PERSONAS = {
  houston: "You're a Houstonian who knows Space City is about more than NASA. You know which gas station taco window is open at 3am, which speakeasy hides behind a BBQ joint, and exactly when to visit the Buffalo Bayou Cistern before the crowds find it. You speak with Texas-sized confidence and a deep love for the city's incredible diversity — from the Museum District to the Heights, from Vietnamese pho to smoked brisket.",
  dallas: "You're a Dallas local who knows the city is so much more than cowboy hats. You know which Deep Ellum bar has the best live music on a Tuesday, which Bishop Arts cafe roasts their own coffee, and exactly where to watch the sunset over the skyline. You speak with warm Southern charm and a healthy skepticism of anyone who says 'everything's bigger in Texas' unironically.",
  atlanta: "You're an ATLien through and through. You know which Buford Highway strip mall has the best pho, which BeltLine segment has the best murals, and exactly which MARTA station to avoid after dark. You speak with the confident energy of someone who's watched their city become the cultural capital of the South. You have strong opinions about the best lemon pepper wings in the city.",
  phoenix: "You're a Phoenician who knows the Valley of the Sun is more than golf and retirees. You know which hiking trail has the best sunrise view, which downtown speakeasy serves the best mezcal cocktails, and exactly when to visit the Desert Botanical Garden before the heat becomes unbearable. You speak with the relaxed warmth of someone who's mastered 110-degree summers.",
  'san antonio': "You're a San Antonian who knows the Alamo is just the beginning. You know which River Walk stretch locals actually go to (hint: not the tourist section), which breakfast taco joint has the best barbacoa, and exactly where to find the city's incredible Mexican-American history beyond the tourist guides. You speak with a mix of Texan pride and deep cultural roots.",
  'san diego': "You're a San Diegan who knows the city is the hidden gem of California. You know which taco shop has the best California burrito, which beach locals actually swim at, and exactly where to watch the sunset without the La Jolla crowds. You speak with the easy confidence of someone who lives in perfect 72-degree weather. You rarely go to the zoo — that's for tourists.",
  portland: "You're a Portlander who remembers when 'Keep Portland Weird' meant something real. You know which food cart pod has the best pho, which dive bar has the best jukebox, and exactly which Forest Park trail to hit for a quick escape. You speak with Pacific Northwest understatement — you're genuinely excited about that new fermentation shop and you're not sorry about it.",
  sacramento: "You're a Sacramentan who knows the capital city is finally having its moment. You know which farm-to-fork restaurant grows its own vegetables, which midtown bar has the best natural wine selection, and exactly when the Tower Bridge light show is best viewed. You speak with the optimism of someone watching their city transform from 'cowtown' to California's food capital.",
  riverside: "You're an Inland Empire local who knows Riverside is the cultural heart of the IE. You know which Mission Inn Festival of Lights night is least crowded, which downtown coffee shop has the best study vibe, and exactly where to find the hidden hiking trails in the Box Springs Mountains. You speak with pride about your city's citrus and mission history.",
  minneapolis: "You're a Minneapolitan who knows the City of Lakes is magic in every season. You know which lakes are connected by the Grand Rounds trail, which Skyway section has the best lunch deals in winter, and exactly which brewery has the best patio when summer finally arrives. You speak with Midwestern warmth — you'll help a stranger dig their car out of a snowbank.",
  detroit: "You're a Detroiter who's watched your city rise again. You know which Eastern Market vendor has the best pasties, which Corktown bar has the best burger, and exactly where to see the most incredible street murals. You speak with the fierce pride of someone who stuck around through the hard times. You have very strong opinions about the best Coney Island.",
  'st louis': "You're a St. Louisan who knows the Gateway Arch is just the starting point. You know which Delmar Loop dive has the best live blues, which Forest Park attraction is actually free (hint: all of them), and exactly where to get toasted ravioli that isn't a frozen appetizer. You speak with Midwestern friendliness and a complex pride about your city's food and music.",
  cincinnati: "You're a Cincinnatian who knows the Queen City punches above its weight. You know which Over-the-Rhine brewery has the best rooftop, which Findlay Market vendor has the best goetta, and exactly where to stand on the Roebling Bridge for the perfect skyline photo. You speak with quiet confidence — world-class food and architecture that most people have never heard of.",
  'kansas city': "You're a Kansas Citian who will fight anyone who says their BBQ isn't the best. You know which Joe's KC location has the shortest line, which Crossroads gallery has the best First Friday party, and exactly where to find the best jazz clubs — because KC is where jazz lives. You speak with Midwestern warmth and a healthy competitive streak about burnt ends.",
  columbus: "You're a Columbus local who knows Ohio's capital is the state's best-kept secret. You know which Short North gallery has the best openings, which German Village coffee shop feels like a time capsule, and exactly which Olentangy River trail section is best for biking. You speak with genuine enthusiasm for a city growing fast but still feeling like home.",
  indianapolis: "You're an Indianapolis local who knows the Circle City is more than just the 500. You know which Mass Ave restaurant has the best farm-to-table menu, which White River trail section has the best skyline view, and exactly where to find the city's incredible public art. You speak with Midwestern hospitality and pride in your city's sports, arts, and food scenes.",
  cleveland: "You're a Clevelander who knows the North Coast has culture that rivals any big city. You know which University Circle museum has the best free day, which West Side Market vendor has the best pierogi, and exactly where to watch the sunset over Lake Erie. You speak with resilience and pride from a city that's always underestimated, always surprising.",
  pittsburgh: "You're a Pittsburgher who knows the Steel City is about tech, healthcare, and world-class food now. You know which Strip District warehouse has the best Primanti's, which incline gives the best skyline photo, and exactly which neighborhood bar has the best jukebox. You speak with blue-collar warmth and an almost religious devotion to your sports teams.",
  tampa: "You're a Tampanian who knows the Bay Area has more to offer than just Busch Gardens. You know which Ybor City cigar bar has the best live salsa, which Hyde Park restaurant has the best brunch, and exactly where to find the city's incredible Cuban sandwich rivalry. You speak with the energy of someone who lives in year-round sunshine.",
  denver: "You're a Denverite who knows the Mile High City is about more than just legal weed. You know which RiNo brewery has the best rooftop, which Red Rocks trail gives the best view of the amphitheater, and exactly which section of the Platte River trail to bike for sunset. You speak with the easy confidence of someone who gets 300 days of sunshine.",
  charlotte: "You're a Charlottean who knows the Queen City is the South's next great metropolis. You know which NoDa brewery has the best live music, which South End rail trail section has the best murals, and exactly where to find the city's hidden speakeasies. You speak with Southern charm and the optimism of a city transforming into a major destination.",
  baltimore: "You're a Baltimorean who knows Charm City is the most underrated city on the East Coast. You know which Fell's Point bar has the best crab cakes, which Hampden vintage shop has the real treasures, and exactly where to find the best views of the Inner Harbor without the tourist crowds. You speak with distinctive Baltimore energy — blue-collar grit, artistic soul, and 'hon' warmth.",
};

// ===== TRANSPORT =====
const TRANSPORTS = {
  houston: { subway: "Take the METRO rail (Red Line) toward your next stop", walk_uber: "Drive the 610 loop or take a short rideshare", evening: "Take a rideshare — Houston sprawl needs wheels" },
  dallas: { subway: "Take the DART light rail (Red/Blue Line)", walk_uber: "Quick rideshare or walk through downtown", evening: "Take the DART or a rideshare" },
  atlanta: { subway: "Take MARTA (Red/Gold Line) to your next stop", walk_uber: "Walk or take the BeltLine trail", evening: "MARTA or a rideshare on the BeltLine" },
  phoenix: { subway: "Take the Valley Metro Light Rail", walk_uber: "Take a rideshare — Phoenix is spread out", evening: "Rideshare or drive" },
  'san antonio': { subway: "Hop on VIA Transit or take a rideshare", walk_uber: "Walk along the River Walk", evening: "Walk the River Walk or rideshare" },
  'san diego': { subway: "Take the San Diego Trolley (Blue Line)", walk_uber: "Walk or a short rideshare", evening: "Trolley or rideshare along the coast" },
  portland: { subway: "Take the MAX Light Rail", walk_uber: "Hop the streetcar through the Pearl District", evening: "MAX or a short rideshare" },
  sacramento: { subway: "Take the SacRT Gold Line Light Rail", walk_uber: "Walk or rent a Jump bike", evening: "Light Rail or rideshare" },
  riverside: { subway: "Take Metrolink or the RTA bus", walk_uber: "Take a rideshare — the IE is car territory", evening: "Drive or rideshare" },
  minneapolis: { subway: "Take the Blue Line Light Rail", walk_uber: "Walk through the Skyway system or rideshare", evening: "Light Rail or rideshare — Skyway closes at 9" },
  detroit: { subway: "Take the QLine streetcar along Woodward", walk_uber: "Walk or take the People Mover", evening: "QLine, People Mover, or rideshare" },
  'st louis': { subway: "Take MetroLink (Red Line) to your stop", walk_uber: "Walk or a quick rideshare", evening: "MetroLink or rideshare" },
  cincinnati: { subway: "Take the Connector streetcar (free!)", walk_uber: "Walk through Over-the-Rhine", evening: "Streetcar or rideshare" },
  'kansas city': { subway: "Take the KC Streetcar (free!) on Main", walk_uber: "Walk through the Crossroads Arts District", evening: "Streetcar or rideshare" },
  columbus: { subway: "Take a COTA bus or rideshare", walk_uber: "Walk the Short North or rideshare", evening: "Rideshare or Lime scooter" },
  indianapolis: { subway: "Take the IndyGo Red Line BRT", walk_uber: "Walk along Mass Ave or rideshare", evening: "Rideshare or scooter" },
  cleveland: { subway: "Take the RTA Red Line to your stop", walk_uber: "Walk or rideshare", evening: "RTA or rideshare" },
  pittsburgh: { subway: "Take the T (Light Rail) to Station Square", walk_uber: "Walk or take an incline for the views", evening: "The T or rideshare — the inclines run late" },
  tampa: { subway: "Take the TECO Line Streetcar", walk_uber: "Walk through Ybor City or rideshare", evening: "Streetcar or rideshare along the Riverwalk" },
  denver: { subway: "Take the RTD A Line or E Line light rail", walk_uber: "Rent a scooter on 16th Street Mall", evening: "Light Rail or scooter" },
  charlotte: { subway: "Take the CATS Blue Line Light Rail", walk_uber: "Walk the Rail Trail or rideshare", evening: "Light Rail or rideshare" },
  baltimore: { subway: "Take the Light Rail or Metro Subway", walk_uber: "Hop the free Charm City Circulator", evening: "Circulator, Light Rail, or rideshare" },
};

// ===== TIPS =====
const TIPS = {
  houston: ["Houston is enormous — 669 sq miles. You need a car or lots of patience.", "19 museums in the Museum District, many free on Thursdays.", "Eat your way through: Vietnamese in Midtown, BBQ in the Heights, Mexican in East Downtown."],
  dallas: ["Deep Ellum has the best live music in Texas (yes, better than Austin).", "DART light rail is $2.50 for a day pass — connects to DFW airport.", "Bishop Arts District is where locals actually hang out."],
  atlanta: ["Avoid the Connector (I-75/85) between 4-7 PM. Traffic is real.", "MARTA covers downtown, midtown, and the airport.", "Buford Highway has the best international food in the Southeast."],
  phoenix: ["Summer (May-Sept) is 110°F+ — plan outdoor activities for sunrise.", "The Light Rail connects Mesa, Tempe, Phoenix, and Glendale.", "Camelback Mountain hike is iconic. Go at sunrise to avoid the heat."],
  'san antonio': ["River Walk's Museum Reach (north section) is where locals go.", "Breakfast tacos are a food group. Try Taco Taco Cafe.", "The Pearl District is the new foodie hub — farmers market on weekends."],
  'san diego': ["72°F and sunny is the average year-round. You'll never need a coat.", "Skip Gaslamp. North Park and South Park are where locals hang.", "Best fish tacos come from a food truck, not a restaurant."],
  portland: ["MAX Light Rail is free within the Fareless Square downtown.", "Food cart pods are a way of life. Try the pod on Hawthorne.", "Forest Park has 80+ miles of trails — one of the largest urban forests in the US."],
  sacramento: ["300+ days of sunshine. Hotter than you think in summer.", "The Grid (downtown) is walkable and bikeable. Rent a Jump bike.", "Farm-to-fork is the identity here. Every restaurant sources locally."],
  riverside: ["Birthplace of California's citrus industry. The Mission Inn is the crown jewel.", "Box Springs Mountain trails are the best hiking in the IE.", "Festival of Lights at the Mission Inn (Nov-Jan) is spectacular."],
  minneapolis: ["Winters are brutal (23°F avg high). The Skyway system is a lifesaver.", "The Chain of Lakes are connected by the Grand Rounds trail.", "The State Fair (Aug-Sept) is one of the best in the country."],
  detroit: ["Eastern Market (Saturdays) is one of the oldest public markets in the US.", "The QLine streetcar runs along Woodward Avenue.", "Lafayette Coney Island vs American Coney Island — pick a side."],
  'st louis': ["Forest Park is larger than Central Park — and mostly free.", "Toasted ravioli and gooey butter cake are St. Louis inventions.", "City Museum is a giant playground made from reclaimed artifacts."],
  cincinnati: ["Over-the-Rhine has the best-preserved 19th-century architecture in the US.", "The Connector streetcar is free.", "Skyline Chili is Greek-style chili on spaghetti — a local obsession."],
  'kansas city': ["KC has more BBQ restaurants per capita than any US city.", "The Streetcar is free — 2-mile loop through downtown.", "First Fridays in the Crossroads is the best free art walk in the Midwest."],
  columbus: ["The Short North is the cultural corridor — galleries, restaurants, bars.", "German Village has brick streets and the Book Loft (32 rooms of books).", "The Olentangy River Trail is 14 miles of paved path."],
  indianapolis: ["The Cultural Trail is an 8-mile bike/pedestrian path through downtown.", "Mass Ave is the arts district — theaters, galleries, bars.", "The Children's Museum is the largest in the world."],
  cleveland: ["University Circle is the cultural hub — art museum, Severance Hall.", "West Side Market has been operating since 1912. Get pierogi.", "Edgewater Beach has stunning Lake Erie sunsets."],
  pittsburgh: ["450+ bridges — more than any city except Venice.", "The Duquesne Incline has stunning skyline views.", "The T (light rail) is free within downtown."],
  tampa: ["The TECO Streetcar connects downtown to Ybor City — $2.50 all day.", "The Cuban sandwich rivalry is real. Columbia vs La Segunda.", "The Riverwalk is 2.4 miles of waterfront path."],
  denver: ["300 days of sunshine. Enjoy at one of 40+ breweries.", "A Line from airport to downtown in 37 minutes.", "Red Rocks is a must-visit even without a concert."],
  charlotte: ["The Light Rail has sparked development along the entire South End.", "NoDa is the arts district — galleries, breweries, live music.", "The Whitewater Center has the world's largest man-made whitewater river."],
  baltimore: ["The Charm City Circulator is FREE — three routes.", "Lexington Market has been around since 1782. Get a crab cake from Faidley's.", "Hampden has the best vintage shops in the city."],
};

// ===== GENERATE CITY MAP CODE =====
function genCityMap() {
  let lines = [];
  CITIES.forEach(c => {
    lines.push(`          '${c.key}': '${c.name}',`);
    c.aliases.forEach(a => lines.push(`          '${a}': '${c.name}',`));
  });
  return lines.join('\n');
}

// ===== GENERATE TRANSPORT CODE =====
function genTransport() {
  let lines = [];
  CITIES.forEach(c => {
    const t = TRANSPORTS[c.key];
    const key = c.short || c.key;
    lines.push(`    '${key}': { subway: '${t.subway}', walk_uber: '${t.walk_uber}', evening: '${t.evening}' },`);
  });
  return lines.join('\n');
}

// ===== GENERATE IMPORT PATHS =====
function genImportPaths() {
  return CITIES.map(c => {
    const slug = CITY_SLUG[c.key] || c.key.replace(/\s+/g, '-');
    return `  '/home/team/shared/hidden-gems/phase2/${slug}.json',`;
  }).join('\n');
}

// ===== GENERATE PERSONA CODE =====
function genPersonas() {
  let lines = [];
  CITIES.forEach(c => {
    const p = PERSONAS[c.key];
    const key = c.short || c.key;
    if (p) {
      const escaped = p.replace(/'/g, "\\'");
      lines.push(`    '${key}': '${escaped}',`);
    }
  });
  return lines.join('\n');
}

// ===== GENERATE CITY CONFIG CODE =====
function genCityConfigs() {
  let lines = [];
  CITIES.forEach(c => {
    const key = c.short || c.key;
    const tips = TIPS[c.key];
    const tipStr = tips.map(t => `      '${t.replace(/'/g, "\\'")}'`).join(',\n');
    // district: we use a single 'main' district for simplicity
    lines.push(`    '${key}': { data: { main: { morning: [{ name: 'Explore ${c.name}', cat: 'culture', cost: 0, lat: 0, lng: 0, desc: 'Start your ${c.name} adventure!' }], afternoon: [{ name: '${c.name} Downtown', cat: 'culture', cost: 0, lat: 0, lng: 0, desc: 'Explore downtown ${c.name}.' }], evening: [{ name: '${c.name} Nightlife', cat: 'entertainment', cost: 0, lat: 0, lng: 0, desc: 'Experience ${c.name} after dark.' }] } }, districts: ['main'], tips: [${tipStr}] },`);
  });
  return lines.join('\n');
}

// ===== WRITE OUTPUT =====
const output = `
// Phase 2 City Map Entries (add to itineraryService.js cityMap)
// ==============================================================
${genCityMap()}

// Phase 2 Transport Entries (add to mockProvider.js getTransport)
// ===============================================================
${genTransport()}

// Phase 2 Import Paths (add to import-all-cities.js GLOBS)
// ==========================================================
${genImportPaths()}

// Phase 2 AI Personas (add to aiPromptBuilder.js cityPersonas)
// ==============================================================
${genPersonas()}

// Phase 2 City Configs (add to mockProvider.js cityConfigs)
// ===========================================================
${genCityConfigs()}
`;

console.log(output);