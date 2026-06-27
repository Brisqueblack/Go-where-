/**
 * VibeVoyage AI — Backend API Server
 *
 * Provides REST endpoints for itinerary generation and database operations.
 * Runs on port 8000 (loopback only). Vite proxies /api/* to this server.
 */

import express from 'express'
import { execSync } from 'child_process'

const app = express()
const PORT = 8000

app.use(express.json())

// ── CORS (since we're on a different port from Vite) ──────────────────────
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  if (_req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

// ── team-db helper ────────────────────────────────────────────────────────
function dbQuery(sql) {
  try {
    const escaped = sql.replace(/"/g, '\\"')
    const output = execSync(`team-db "${escaped}"`, {
      encoding: 'utf-8',
      timeout: 15000,
    })
    return JSON.parse(output)
  } catch (err) {
    console.error('[DB Error]', err.stderr || err.message)
    throw new Error(err.stderr || err.message)
  }
}

// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', provider: process.env.LLM_PROVIDER || 'mock' })
})

// ── Generate itinerary ─────────────────────────────────────────────────────
app.post('/api/itineraries/generate', async (req, res) => {
  try {
    const { destination, duration_days, budget_level, vibes, preferences, user_email } = req.body

    // Validate required field
    if (!destination) {
      return res.status(400).json({ success: false, error: 'destination is required' })
    }

    // Build the itinerary using the mock provider (or real LLM if configured)
    // For now, use the mock provider directly
    const { default: itineraryService } = await import('../src/services/itineraryService.js')

    const result = await itineraryService.generateItinerary({
      destination,
      duration_days: duration_days || 1,
      budget_level: budget_level || 'moderate',
      vibes: vibes || 'balanced',
      preferences: preferences || '',
      user_email,
    }, { skipDb: false })

    if (result.success) {
      res.json(result)
    } else {
      res.status(500).json(result)
    }
  } catch (err) {
    console.error('[Generate Error]', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// ── GET itinerary by ID ────────────────────────────────────────────────────
app.get('/api/itineraries/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' })

    const rows = dbQuery(`SELECT * FROM itineraries WHERE id = ${id}`)
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' })

    const items = dbQuery(
      `SELECT * FROM itinerary_items WHERE itinerary_id = ${id} ORDER BY day_number, order_index`
    )

    res.json({ ...rows[0], items })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── LIST recent itineraries ────────────────────────────────────────────────
app.get('/api/itineraries', (_req, res) => {
  try {
    const rows = dbQuery(
      'SELECT id, title, destination, duration_days, budget_level, created_at FROM itineraries ORDER BY created_at DESC LIMIT 20'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Start server ───────────────────────────────────────────────────────────
app.listen(PORT, '127.0.0.1', () => {
  console.log(`[API Server] Listening on http://127.0.0.1:${PORT}`)
})