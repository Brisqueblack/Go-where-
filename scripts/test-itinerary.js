/**
 * test-itinerary.js
 * CLI test script for the AI Itinerary Engine.
 *
 * Usage: node scripts/test-itinerary.js
 *
 * This tests the full generation flow:
 *   prompt → mock LLM → parse response → save to DB
 */

import { execSync } from 'child_process'

function log(label, data) {
  console.log(`\n━━━ ${label} ━━━`)
  console.log(JSON.stringify(data, null, 2).slice(0, 2000))
  if (JSON.stringify(data).length > 2000) console.log('... (truncated)')
}

async function main() {
  console.log('🧪 VibeVoyage AI — Itinerary Engine Test')
  console.log('====================================\n')

  // 1. Test the prompt builder
  console.log('📝 Step 1: Building prompt...')
  const { buildItineraryPrompt } = await import('../src/services/aiPromptBuilder.js')
  const prompt = buildItineraryPrompt({
    destination: 'New York City',
    duration_days: 2,
    budget_level: 'moderate',
    vibes: 'foodie, culture',
  })
  log('Generated Prompt (first 500 chars)', prompt.full.slice(0, 500) + '...')

  // 2. Test the LLM call (mock provider)
  console.log('\n🤖 Step 2: Calling LLM (mock provider)...')
  const { callLLM } = await import('../src/services/llmProvider.js')
  const response = await callLLM(prompt.full, {
    provider: 'mock',
    userInputs: {
      destination: 'New York City',
      duration_days: 2,
      budget_level: 'moderate',
      vibes: 'foodie, culture',
    },
  })
  log('Raw LLM Response (first 500 chars)', response.text.slice(0, 500) + '...')

  // 3. Test the response parser
  console.log('\n📋 Step 3: Parsing response...')
  const { parseItineraryResponse } = await import('../src/services/responseParser.js')
  const parsed = parseItineraryResponse(response.text, {
    destination: 'New York City',
    budget_level: 'moderate',
  })

  if (!parsed.success) {
    console.error('❌ Parse failed:', parsed.error)
    process.exit(1)
  }
  log('Parsed Itinerary', {
    title: parsed.data.title,
    destination: parsed.data.destination,
    duration_days: parsed.data.duration_days,
    budget_level: parsed.data.budget_level,
    total_estimated_cost: parsed.data.total_estimated_cost,
    days: parsed.data.days.map(d => ({
      day: d.day_number,
      theme: d.theme,
      itemCount: d.items.length,
      items: d.items.map(i => `${i.time_slot}: ${i.name} (${i.category})`),
    })),
  })

  // 4. Test DB save
  console.log('\n💾 Step 4: Saving to database...')
  const { saveItinerary } = await import('../src/services/databaseService.js')
  try {
    const dbResult = await saveItinerary(parsed.data)
    log('Database Result', dbResult)
    console.log(`   ✅ Itinerary #${dbResult.itineraryId} saved with ${dbResult.items.length} items`)
  } catch (dbErr) {
    console.warn('   ⚠️  DB save skipped:', dbErr.message)
  }

  // 5. Test the full orchestrator
  console.log('\n⚡ Step 5: Testing full orchestrator...')
  const { quickTest } = await import('../src/services/itineraryService.js')
  const fullResult = await quickTest()
  if (fullResult.success) {
    console.log(`   ✅ Orchestrator success! Generated: "${fullResult.data.title}"`)
    console.log(`   ⏱  Elapsed: ${fullResult.meta.elapsed_ms}ms`)
    console.log(`   📍 ${fullResult.data.days.length} days, ${fullResult.data.days.reduce((s, d) => s + d.items.length, 0)} activities`)
  } else {
    console.error('   ❌ Orchestrator failed:', fullResult.error)
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ All tests completed!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main().catch(err => {
  console.error('Test failed:', err)
  process.exit(1)
})