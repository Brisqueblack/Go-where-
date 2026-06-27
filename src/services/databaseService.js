/**
 * databaseService.js
 * CRUD operations for itineraries and itinerary_items via team-db CLI.
 *
 * IMPORTANT: Each team-db call is a separate SQLite connection,
 * so we use INSERT ... RETURNING id instead of last_insert_rowid().
 */

import { execSync } from 'child_process'

/**
 * Execute a SQL statement via team-db CLI.
 * @param {string} sql - Single SQL statement
 * @returns {Array} Result rows
 */
function execSQL(sql) {
  try {
    const escaped = sql.replace(/"/g, '\\"')
    const output = execSync(`team-db "${escaped}"`, {
      encoding: 'utf-8',
      timeout: 15000,
    })
    return JSON.parse(output)
  } catch (err) {
    console.error('[DB Error]', err.stderr || err.message)
    throw new Error(`Database query failed: ${err.message}`)
  }
}

/**
 * Save a generated itinerary to the database.
 * Uses INSERT ... RETURNING id so each team-db call returns the new row ID.
 *
 * @param {object} itinerary - Parsed itinerary from responseParser
 * @returns {{ itineraryId: number, items: number[] }}
 */
export function saveItinerary(itinerary) {
  const escapedTitle = itinerary.title.replace(/'/g, "''")
  const escapedDest = itinerary.destination.replace(/'/g, "''")

  const prefs = JSON.stringify({
    budget_level: itinerary.budget_level,
    notes: itinerary.notes,
    vibes: itinerary.vibes || '',
  }).replace(/'/g, "''")

  // 1. Insert the itinerary and get ID via RETURNING
  const insertSQL = `INSERT INTO itineraries (title, destination, preferences, duration_days, budget_level) VALUES ('${escapedTitle}', '${escapedDest}', '${prefs}', ${itinerary.duration_days}, '${itinerary.budget_level}') RETURNING id`

  const insertResult = execSQL(insertSQL)
  const itineraryId = insertResult[0].id

  // 2. Insert each day's items
  const itemIds = []
  for (const day of itinerary.days) {
    for (let i = 0; i < day.items.length; i++) {
      const item = day.items[i]
      const escapedName = item.name.replace(/'/g, "''")
      const escapedDesc = (item.description || '').replace(/'/g, "''")
      const lat = item.latitude != null ? item.latitude : 'NULL'
      const lng = item.longitude != null ? item.longitude : 'NULL'
      const cost = item.estimated_cost != null ? item.estimated_cost : 'NULL'
      const bookingUrl = item.booking_url ? `'${item.booking_url.replace(/'/g, "''")}'` : 'NULL'
      const transport = item.transport ? `'${item.transport.replace(/'/g, "''")}'` : 'NULL'
      const timing = item.timing ? `'${item.timing.replace(/'/g, "''")}'` : 'NULL'

      const itemSQL = `INSERT INTO itinerary_items (itinerary_id, day_number, name, description, category, latitude, longitude, estimated_cost, booking_url, order_index, timing, transport) VALUES (${itineraryId}, ${day.day_number}, '${escapedName}', '${escapedDesc}', '${item.category}', ${lat}, ${lng}, ${cost}, ${bookingUrl}, ${i}, ${timing}, ${transport}) RETURNING id`

      const itemResult = execSQL(itemSQL)
      itemIds.push(itemResult[0].id)
    }
  }

  return { itineraryId, items: itemIds }
}

/**
 * Retrieve a saved itinerary with all its items.
 * @param {number} itineraryId
 * @returns {object|null}
 */
export function getItinerary(itineraryId) {
  const itineraries = execSQL(`SELECT * FROM itineraries WHERE id = ${itineraryId}`)
  if (itineraries.length === 0) return null

  const itinerary = itineraries[0]
  const rows = execSQL(
    `SELECT * FROM itinerary_items WHERE itinerary_id = ${itineraryId} ORDER BY day_number, order_index`
  )

  // Group items by day
  const dayMap = {}
  for (const row of rows) {
    if (!dayMap[row.day_number]) dayMap[row.day_number] = []
    dayMap[row.day_number].push(row)
  }

  const days = Object.entries(dayMap)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([dayNum, items]) => ({ day_number: Number(dayNum), items }))

  return { ...itinerary, days }
}

/**
 * List recent itineraries.
 * @param {number} [limit=20]
 * @returns {Array}
 */
export function listItineraries(limit = 20) {
  return execSQL(
    `SELECT id, title, destination, duration_days, budget_level, created_at FROM itineraries ORDER BY created_at DESC LIMIT ${limit}`
  )
}

export default { saveItinerary, getItinerary, listItineraries }