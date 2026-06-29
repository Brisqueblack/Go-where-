/**
 * admin-feedback.js
 * CLI script to view and summarize user feedback.
 * Run: node scripts/admin-feedback.js
 */

import { execSync } from 'child_process'

function query(sql) {
  const escaped = sql.replace(/"/g, '\\"')
  return JSON.parse(execSync(`team-db "${escaped}"`, { encoding: 'utf-8', timeout: 10000 }))
}

console.log('📊 VibeVoyage AI — Feedback Dashboard')
console.log('======================================\n')

const summary = query(
  `SELECT COUNT(*) as total,
          ROUND(AVG(rating), 1) as avg_rating,
          SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END) as positive,
          SUM(CASE WHEN rating <= 2 THEN 1 ELSE 0 END) as negative
   FROM user_feedback`
)

const s = summary[0]
console.log(`Total responses: ${s.total}`)
console.log(`Average rating:  ${s.avg_rating} / 5`)
console.log(`Positive (4-5):  ${s.positive} (${s.total > 0 ? Math.round(s.positive / s.total * 100) : 0}%)`)
console.log(`Negative (1-2):  ${s.negative} (${s.total > 0 ? Math.round(s.negative / s.total * 100) : 0}%)`)
console.log('')

const rows = query(
  `SELECT f.id, f.rating, f.comment, f.source, f.created_at,
          COALESCE(i.title, '(deleted)') as trip
   FROM user_feedback f
   LEFT JOIN itineraries i ON f.itinerary_id = i.id
   ORDER BY f.created_at DESC LIMIT 15`
)

if (rows.length === 0) {
  console.log('No feedback yet.')
} else {
  console.log('Recent feedback:')
  console.log('─'.repeat(60))
  for (const r of rows) {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating)
    console.log(`  #${r.id} ${stars} — "${r.trip}"`)
    if (r.comment) console.log(`       "${r.comment}"`)
    console.log(`       ${r.created_at} · ${r.source}`)
    console.log('')
  }
}