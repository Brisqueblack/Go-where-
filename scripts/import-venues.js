/**
 * import-venues.js
 * Imports the curated NYC Hidden Gems from JSON into the venues table.
 * Run: node scripts/import-venues.js
 */

import { readFileSync } from 'fs'
import { execSync } from 'child_process'

const data = JSON.parse(readFileSync('/home/team/shared/nyc-hidden-gems.json', 'utf-8'))
const venues = data.venues

let imported = 0
let errors = 0

for (const v of venues) {
  try {
    const name = v.name.replace(/'/g, "''")
    const cat = (v.category || '').replace(/'/g, "''")
    const desc = (v.description || '').replace(/'/g, "''")
    const borough = (v.borough || '').replace(/'/g, "''")
    const tags = JSON.stringify(v.tags || []).replace(/'/g, "''")
    const tip = (v.local_tip || '').replace(/'/g, "''")
    const lat = v.latitude ?? 'NULL'
    const lng = v.longitude ?? 'NULL'
    const cost = v.estimated_cost ?? 'NULL'
    const bestTime = (v.best_time || '').replace(/'/g, "''")

    const sql = `INSERT INTO venues (name, category, description, latitude, longitude, estimated_cost, borough, tags, best_time, local_tip) VALUES ('${name}', '${cat}', '${desc}', ${lat}, ${lng}, ${cost}, '${borough}', '${tags}', '${bestTime}', '${tip}')`

    execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { encoding: 'utf-8', timeout: 10000 })
    imported++
  } catch (err) {
    console.error(`Error importing "${v.name}":`, err.message)
    errors++
  }
}

console.log('\n📊 Import Summary')
console.log('━━━━━━━━━━━━━━━━')
console.log(`Total in file:  ${venues.length}`)
console.log(`Imported:       ${imported}`)
console.log(`Errors:         ${errors}`)

// Verify
const result = JSON.parse(execSync(`team-db "SELECT COUNT(*) as cnt FROM venues"`, { encoding: 'utf-8' }))
console.log(`In database:    ${result[0].cnt}`)
console.log('━━━━━━━━━━━━━━━━')