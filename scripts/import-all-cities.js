import { readFileSync } from 'fs'
import { execSync } from 'child_process'
import { resolve, basename } from 'path'

// City mapping: filename prefix -> full city name
const CITY_MAP = {
  'nyc': 'New York',
  'new-york': 'New York',
  'new_york': 'New York',
  'tokyo': 'Tokyo',
  'boston': 'Boston',
  'philadelphia': 'Philadelphia',
  'dc': 'Washington D.C.',
  'washington-dc': 'Washington D.C.',
  'chicago': 'Chicago',
  'miami': 'Miami',
  // ── 7 New US Cities ──
  'los-angeles': 'Los Angeles',
  'la': 'Los Angeles',
  'las-vegas': 'Las Vegas',
  'vegas': 'Las Vegas',
  'orlando': 'Orlando',
  'san-francisco': 'San Francisco',
  'sf': 'San Francisco',
  'seattle': 'Seattle',
  'nashville': 'Nashville',
  'austin': 'Austin',
  // ── Phase 2: 22 New US Metros ──
  'houston': 'Houston',
  'dallas': 'Dallas',
  'atlanta': 'Atlanta',
  'phoenix': 'Phoenix',
  'san-antonio': 'San Antonio',
  'san-diego': 'San Diego',
  'portland': 'Portland',
  'sacramento': 'Sacramento',
  'riverside': 'Riverside',
  'minneapolis': 'Minneapolis',
  'detroit': 'Detroit',
  'st-louis': 'St. Louis',
  'cincinnati': 'Cincinnati',
  'kansas-city': 'Kansas City',
  'columbus': 'Columbus',
  'indianapolis': 'Indianapolis',
  'cleveland': 'Cleveland',
  'pittsburgh': 'Pittsburgh',
  'tampa': 'Tampa',
  'denver': 'Denver',
  'charlotte': 'Charlotte',
  'baltimore': 'Baltimore',
  // ── Phase 3: 35 Next Cities (awaiting designer gems) ──
  'san-jose': 'San Jose',
  'milwaukee': 'Milwaukee',
  'new-orleans': 'New Orleans',
  'memphis': 'Memphis',
  'oklahoma-city': 'Oklahoma City',
  'louisville': 'Louisville',
  'richmond': 'Richmond',
  'providence': 'Providence',
  'buffalo': 'Buffalo',
  'birmingham': 'Birmingham',
  'hartford': 'Hartford',
  'albuquerque': 'Albuquerque',
  'rochester': 'Rochester',
  'tucson': 'Tucson',
  'fresno': 'Fresno',
  'honolulu': 'Honolulu',
  'el-paso': 'El Paso',
  'grand-rapids': 'Grand Rapids',
  'greenville': 'Greenville',
  'knoxville': 'Knoxville',
  'wichita': 'Wichita',
  'toledo': 'Toledo',
  'boise': 'Boise',
  'colorado-springs': 'Colorado Springs',
  'dayton': 'Dayton',
  'des-moines': 'Des Moines',
  'daytona-beach': 'Daytona Beach',
  'palm-bay': 'Palm Bay',
  'ogden': 'Ogden',
  'bakersfield': 'Bakersfield',
  'syracuse': 'Syracuse',
  'allentown': 'Allentown',
  'cape-coral': 'Cape Coral',
  'springfield-ma': 'Springfield (MA)',
  'chattanooga': 'Chattanooga',
}

// Files to import (all -hidden-gems.json in shared directory)
const GLOBS = [
  '/home/team/shared/nyc-hidden-gems.json',
  '/home/team/shared/tokyo-hidden-gems.json',
  '/home/team/shared/boston-hidden-gems.json',
  '/home/team/shared/philadelphia-hidden-gems.json',
  '/home/team/shared/dc-hidden-gems.json',
  '/home/team/shared/chicago-hidden-gems.json',
  '/home/team/shared/miami-hidden-gems.json',
  // ── 7 New US Cities — files created by designer in hidden-gems/ ──
  '/home/team/shared/hidden-gems/la-hidden-gems.json',
  '/home/team/shared/hidden-gems/las-vegas-hidden-gems.json',
  '/home/team/shared/hidden-gems/orlando-hidden-gems.json',
  '/home/team/shared/hidden-gems/san-francisco-hidden-gems.json',
  '/home/team/shared/hidden-gems/seattle-hidden-gems.json',
  '/home/team/shared/hidden-gems/nashville-hidden-gems.json',
  '/home/team/shared/hidden-gems/austin-hidden-gems.json',
  // ── Phase 2: 22 New US Metros ──
  '/home/team/shared/hidden-gems/phase2/houston.json',
  '/home/team/shared/hidden-gems/phase2/dallas.json',
  '/home/team/shared/hidden-gems/phase2/atlanta.json',
  '/home/team/shared/hidden-gems/phase2/phoenix.json',
  '/home/team/shared/hidden-gems/phase2/san-antonio.json',
  '/home/team/shared/hidden-gems/phase2/san-diego.json',
  '/home/team/shared/hidden-gems/phase2/portland.json',
  '/home/team/shared/hidden-gems/phase2/sacramento.json',
  '/home/team/shared/hidden-gems/phase2/riverside.json',
  '/home/team/shared/hidden-gems/phase2/minneapolis.json',
  '/home/team/shared/hidden-gems/phase2/detroit.json',
  '/home/team/shared/hidden-gems/phase2/st-louis.json',
  '/home/team/shared/hidden-gems/phase2/cincinnati.json',
  '/home/team/shared/hidden-gems/phase2/kansas-city.json',
  '/home/team/shared/hidden-gems/phase2/columbus.json',
  '/home/team/shared/hidden-gems/phase2/indianapolis.json',
  '/home/team/shared/hidden-gems/phase2/cleveland.json',
  '/home/team/shared/hidden-gems/phase2/pittsburgh.json',
  '/home/team/shared/hidden-gems/phase2/tampa.json',
  '/home/team/shared/hidden-gems/phase2/denver.json',
  '/home/team/shared/hidden-gems/phase2/charlotte.json',
  '/home/team/shared/hidden-gems/phase2/baltimore.json',
  // ── Phase 3: 35 Next Cities (when designer creates files) ──
  '/home/team/shared/hidden-gems/phase3/san-jose.json',
  '/home/team/shared/hidden-gems/phase3/milwaukee.json',
  '/home/team/shared/hidden-gems/phase3/new-orleans.json',
  '/home/team/shared/hidden-gems/phase3/memphis.json',
  '/home/team/shared/hidden-gems/phase3/oklahoma-city.json',
  '/home/team/shared/hidden-gems/phase3/louisville.json',
  '/home/team/shared/hidden-gems/phase3/richmond.json',
  '/home/team/shared/hidden-gems/phase3/providence.json',
  '/home/team/shared/hidden-gems/phase3/buffalo.json',
  '/home/team/shared/hidden-gems/phase3/birmingham.json',
  '/home/team/shared/hidden-gems/phase3/hartford.json',
  '/home/team/shared/hidden-gems/phase3/albuquerque.json',
  '/home/team/shared/hidden-gems/phase3/rochester.json',
  '/home/team/shared/hidden-gems/phase3/tucson.json',
  '/home/team/shared/hidden-gems/phase3/fresno.json',
  '/home/team/shared/hidden-gems/phase3/honolulu.json',
  '/home/team/shared/hidden-gems/phase3/el-paso.json',
  '/home/team/shared/hidden-gems/phase3/grand-rapids.json',
  '/home/team/shared/hidden-gems/phase3/greenville.json',
  '/home/team/shared/hidden-gems/phase3/knoxville.json',
  '/home/team/shared/hidden-gems/phase3/wichita.json',
  '/home/team/shared/hidden-gems/phase3/toledo.json',
  '/home/team/shared/hidden-gems/phase3/boise.json',
  '/home/team/shared/hidden-gems/phase3/colorado-springs.json',
  '/home/team/shared/hidden-gems/phase3/dayton.json',
  '/home/team/shared/hidden-gems/phase3/des-moines.json',
  '/home/team/shared/hidden-gems/phase3/daytona-beach.json',
  '/home/team/shared/hidden-gems/phase3/palm-bay.json',
  '/home/team/shared/hidden-gems/phase3/ogden.json',
  '/home/team/shared/hidden-gems/phase3/bakersfield.json',
  '/home/team/shared/hidden-gems/phase3/syracuse.json',
  '/home/team/shared/hidden-gems/phase3/allentown.json',
  '/home/team/shared/hidden-gems/phase3/cape-coral.json',
  '/home/team/shared/hidden-gems/phase3/springfield-ma.json',
  '/home/team/shared/hidden-gems/phase3/chattanooga.json',
]

let totalImported = 0
let totalErrors = 0

for (const filePath of GLOBS) {
  try {
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))
    const venues = data.venues || []
    const fileName = basename(filePath).replace('-hidden-gems.json', '').replace('.json', '')
    const cityName = CITY_MAP[fileName] || fileName
    const meta = data.meta || {}

    console.log(`\n📦 ${meta.title || cityName}`)
    console.log(`   File: ${filePath}`)
    console.log(`   City: ${cityName}`)
    console.log(`   Venues in file: ${venues.length}`)

    // Delete existing venues for this city
    try {
      execSync(`team-db "DELETE FROM venues WHERE city = '${cityName.replace(/'/g, "''")}'"`, { encoding: 'utf-8', timeout: 10000 })
      console.log(`   🗑️  Cleared existing ${cityName} venues`)
    } catch (e) {
      console.log(`   ⚠️  No existing venues to clear for ${cityName}`)
    }

    // Import each venue
    let imported = 0
    let errors = 0

    for (const v of venues) {
              try {
                const name = (v.name || '').replace(/'/g, "''")
                const cat = (v.category || '').replace(/'/g, "''")
                const desc = (v.description || '').replace(/'/g, "''")
                const borough = (v.neighborhood || v.borough || '').replace(/'/g, "''")
                const tags = JSON.stringify(v.tags || []).replace(/'/g, "''")
                const tip = (v.local_tip || '').replace(/'/g, "''")
                const lat = v.latitude ?? 'NULL'
                const lng = v.longitude ?? 'NULL'
                const cost = v.estimated_cost ?? 'NULL'
                const bestTime = (v.best_time || '').replace(/'/g, "''")

                // Quality Foundation fields
                const authenticity = v.authenticity ?? 'NULL'
                const crowdLevel = v.crowd_level ?? 'NULL'
                const valueForMoney = v.value_for_money ?? 'NULL'
                const localPopularity = v.local_popularity ?? 'NULL'
                const touristVisibility = v.tourist_visibility ?? 'NULL'
                const photoAppeal = v.photo_appeal ?? 'NULL'

                // Compute hidden_gem_score if component scores are present
                let hiddenGemScore = 'NULL'
                if (v.hidden_gem_score != null) {
                  hiddenGemScore = v.hidden_gem_score
                } else if (authenticity !== 'NULL' && crowdLevel !== 'NULL' && valueForMoney !== 'NULL' && localPopularity !== 'NULL' && touristVisibility !== 'NULL' && photoAppeal !== 'NULL') {
                  // Weighted score formula: authenticity(20%) + value(20%) + local_pop(20%) - crowd(10%) - tourist_vis(15%) + photo(15%)
                  // Invert crowd_level and tourist_visibility since lower is better for hidden gems
                  const invCrowd = 6 - v.crowd_level  // 1-5 scale, 5=empty becomes best
                  const invTourist = 11 - v.tourist_visibility  // 1-10, higher locals-only
                  hiddenGemScore = Math.round(
                    (v.authenticity * 2.0) +
                    (invCrowd * 2.0) +
                    (v.value_for_money * 2.0) +
                    (v.local_popularity * 2.0) +
                    (invTourist * 1.5) +
                    (v.photo_appeal * 1.5)
                  )
                  hiddenGemScore = Math.min(Math.max(hiddenGemScore, 0), 100)
                }

                const warnings = v.warnings ? JSON.stringify(v.warnings).replace(/'/g, "''") : 'NULL'
                const alternativesTo = (v.alternatives_to || '').replace(/'/g, "''") || 'NULL'
                const whyLocalsLoveIt = (v.why_locals_love_it || '').replace(/'/g, "''") || 'NULL'
                const whatTouristsMiss = (v.what_tourists_miss || '').replace(/'/g, "''") || 'NULL'
                const insiderTip = (v.insider_tip || '').replace(/'/g, "''") || 'NULL'

                const sql = `INSERT INTO venues (name, category, description, latitude, longitude, estimated_cost, city, borough, tags, best_time, local_tip, hidden_gem_score, authenticity, crowd_level, value_for_money, local_popularity, tourist_visibility, photo_appeal, warnings, alternatives_to, why_locals_love_it, what_tourists_miss, insider_tip) VALUES ('${name}', '${cat}', '${desc}', ${lat}, ${lng}, ${cost}, '${cityName.replace(/'/g, "''")}', '${borough}', '${tags}', '${bestTime}', '${tip}', ${hiddenGemScore}, ${authenticity}, ${crowdLevel}, ${valueForMoney}, ${localPopularity}, ${touristVisibility}, ${photoAppeal}, ${warnings}, ${alternativesTo === 'NULL' ? 'NULL' : `'${alternativesTo}'`}, ${whyLocalsLoveIt === 'NULL' ? 'NULL' : `'${whyLocalsLoveIt}'`}, ${whatTouristsMiss === 'NULL' ? 'NULL' : `'${whatTouristsMiss}'`}, ${insiderTip === 'NULL' ? 'NULL' : `'${insiderTip}'`})`

        execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { encoding: 'utf-8', timeout: 10000 })
        imported++
      } catch (err) {
        console.error(`   ❌ Error importing "${v.name}":`, err.message)
        errors++
      }
    }

    console.log(`   ✅ Imported: ${imported} | Errors: ${errors}`)
    totalImported += imported
    totalErrors += errors

    // Import neighborhood vibes from meta
    if (meta.neighborhood_vibes && Array.isArray(meta.neighborhood_vibes)) {
      let vibesImported = 0
      for (const nv of meta.neighborhood_vibes) {
        try {
          const nName = (nv.name || nv.neighborhood || '').replace(/'/g, "''")
          const nVibe = (nv.vibe || nv.vibe_description || '').replace(/'/g, "''")
          if (nName) {
            execSync(`team-db "DELETE FROM neighborhood_vibes WHERE city = '${cityName.replace(/'/g, "''")}' AND neighborhood = '${nName}'"`, { encoding: 'utf-8', timeout: 10000 })
            execSync(`team-db "INSERT INTO neighborhood_vibes (city, neighborhood, vibe_description) VALUES ('${cityName.replace(/'/g, "''")}', '${nName}', '${nVibe}')"`, { encoding: 'utf-8', timeout: 10000 })
            vibesImported++
          }
        } catch (err) {
          console.error(`   ⚠️  Failed to import vibe for "${nv.name || nv.neighborhood}":`, err.message)
        }
      }
      if (vibesImported > 0) console.log(`   🏘️  Imported ${vibesImported} neighborhood vibes`)
    }

  } catch (err) {
    console.error(`\n❌ Failed to process ${filePath}:`, err.message)
    totalErrors++
  }
}

console.log('\n═══════════════════════════════════════')
console.log('📊 MASTER IMPORT SUMMARY')
console.log('═══════════════════════════════════════')
console.log(`Total imported across all cities: ${totalImported}`)
console.log(`Total errors: ${totalErrors}`)

const result = JSON.parse(execSync(`team-db "SELECT city, COUNT(*) as cnt FROM venues GROUP BY city ORDER BY city"`, { encoding: 'utf-8' }))
console.log(`\n📊 Venue Count by City:`)
for (const row of result) {
  console.log(`  ${row.city}: ${row.cnt}`)
}
console.log('═══════════════════════════════════════')

// Count total
const total = result.reduce((s, r) => s + r.cnt, 0)
console.log(`\n🏆 Total venues in database: ${total}`)