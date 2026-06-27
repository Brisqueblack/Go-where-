/**
 * LLM Provider Interface
 *
 * Architecture:
 * ------------
 * We use a provider pattern so the LLM backend can be swapped without
 * changing the rest of the itinerary engine. Each provider implements:
 *
 *   generate(prompt) → { text: string, usage?: { prompt, completion } }
 *
 * Currently supported:
 *   - "mock"    : Returns realistic pre-built data (no API key required)
 *   - "openai"  : OpenAI-compatible API (GPT-4o-mini / GPT-4o)
 *   - "anthropic": Anthropic Claude API (Claude 3 Haiku / Sonnet)
 *
 * To switch providers, set VITE_LLM_PROVIDER env var or pass it to
 * getProvider(). The mock provider is the default.
 *
 * To add a new provider, create a file here and register it in
 * PROVIDER_REGISTRY below.
 */

import { mockGenerate } from './providers/mockProvider.js'

// ── Provider registry ──────────────────────────────────────────────────────
// Each entry: { name, generate(prompt, opts?) => Promise<{ text, usage? }> }

const PROVIDER_REGISTRY = {
  mock: { generate: mockGenerate },
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Resolve an LLM provider by name.
 * @param {string} [name] - Provider name (default: env var or "mock")
 * @returns {{ generate }}
 */
export function getProvider(name) {
  const providerName = name || import.meta.env?.VITE_LLM_PROVIDER || 'mock'
  const provider = PROVIDER_REGISTRY[providerName]
  if (!provider) {
    console.warn(`[LLM] Unknown provider "${providerName}", falling back to mock`)
    return PROVIDER_REGISTRY.mock
  }
  return provider
}

/**
 * Directly call the LLM with a prompt and return the response text.
 * @param {string} prompt - The full prompt to send
 * @param {object} [opts] - Provider-specific options
 * @param {string} [opts.provider] - Provider name override
 * @returns {Promise<{ text: string, usage?: { prompt: number, completion: number } }>}
 */
export async function callLLM(prompt, opts = {}) {
  const provider = getProvider(opts.provider)
  return provider.generate(prompt, opts)
}

export default { getProvider, callLLM }