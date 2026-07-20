import { useState } from 'react'
import { Button, ChipGroup, SegmentedControl } from '../components/ui'

const WHEN_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'weekend', label: 'This Weekend' },
  { value: 'pick-date', label: 'Pick a date' },
]

const WHO_OPTIONS = [
  { value: 'solo', label: '👤 Solo' },
  { value: 'couple', label: '👫 Couple' },
  { value: 'family', label: '👨‍👩‍👧‍👧 Family' },
  { value: 'friends', label: '👥 Friends' },
]

const WEATHER_OPTIONS = [
  { value: 'any', label: '🌈 Any Weather' },
  { value: 'sunny', label: '☀️ Sunny' },
  { value: 'cloudy', label: '⛅ Cloudy' },
  { value: 'rainy', label: '🌧️ Rainy' },
  { value: 'snowy', label: '❄️ Snowy' },
]

const VIBE_OPTIONS = [
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'adventurous', label: 'Adventurous' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'foodie', label: 'Foodie' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'artsy', label: 'Artsy' },
  { value: 'wellness', label: 'Wellness' },
]

const TIME_OPTIONS = [
  { value: 'few-hours', label: 'Few hours' },
  { value: 'half-day', label: 'Half day' },
  { value: 'full-day', label: 'Full day' },
  { value: 'multi-day', label: 'Multi-day' },
]

const BUDGET_OPTIONS = [
  { value: 'budget', label: '💰 Budget' },
  { value: 'moderate', label: '💰💰 Moderate' },
  { value: 'splurge', label: '💰💰💰 Splurge' },
]

export default function ItineraryInputPage({ preferences, setPreferences, onBack, onSubmit }) {
  const [where, setWhere] = useState(preferences.where || '')
  const [when, setWhen] = useState(preferences.when || '')
  const [who, setWho] = useState(preferences.who || '')
  const [weather, setWeather] = useState(preferences.weather || '')
  const [vibes, setVibes] = useState(preferences.vibes || [])
  const [budget, setBudget] = useState(preferences.budget || '')
  const [time, setTime] = useState(preferences.time || '')
  const [interests, setInterests] = useState(preferences.interests || '')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!where.trim()) newErrors.where = 'Where are you going?'
    if (!when) newErrors.when = 'When are you going?'
    if (!who) newErrors.who = 'Who\'s coming?'
    if (vibes.length === 0) newErrors.vibes = 'Pick at least one vibe'
    if (!time) newErrors.time = 'How much time?'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setPreferences((prev) => ({
      ...prev,
      where,
      when,
      who,
      weather,
      vibes,
      budget,
      time,
      interests,
    }))
    onSubmit?.({
      where,
      when,
      who,
      weather,
      vibes,
      budget,
      time,
      interests,
    })
  }

  const isComplete = where.trim() && when && who && vibes.length > 0 && time

  return (
    <div className="min-h-screen bg-sand relative overflow-y-auto">
      {/* Top bar with back */}
      <div className="sticky top-0 bg-white z-20 border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 h-14 max-w-lg mx-auto">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <svg className="w-5 h-5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-lg font-heading font-semibold text-text-primary">Set Your Vibe</h1>
        </div>
      </div>

      {/* Form content */}
      <div className="max-w-lg mx-auto px-4 pb-32 pt-6 space-y-6">
        {/* Where */}
        <div className="space-y-2">
          <label className="text-xs font-semibold font-body text-text-primary uppercase tracking-wider">Where</label>
          <input
            type="text"
            value={where}
            onChange={(e) => { setWhere(e.target.value); setErrors((e) => ({ ...e, where: '' })) }}
            placeholder="NYC, Brooklyn, SoHo..."
            className={`w-full px-4 py-3 rounded-[8px] border-2 bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-teal transition-colors text-sm font-body ${errors.where ? 'border-error' : 'border-gray-200'}`}
          />
          {errors.where && <p className="text-error text-xs font-body">{errors.where}</p>}
        </div>

        {/* When */}
        <div className="space-y-2">
          <label className="text-xs font-semibold font-body text-text-primary uppercase tracking-wider">When</label>
          <div className="flex gap-2 flex-wrap">
            {WHEN_OPTIONS.map((opt) => {
              const isSelected = when === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => { setWhen(opt.value); setErrors((e) => ({ ...e, when: '' })) }}
                  className={`px-4 py-2 rounded-[8px] text-sm font-medium font-body transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-teal text-white shadow-sm'
                      : 'bg-white border-2 border-gray-200 text-text-secondary hover:border-teal'
                  }`}
                  aria-pressed={isSelected}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
          {errors.when && <p className="text-error text-xs font-body">{errors.when}</p>}
        </div>

        {/* Who */}
        <div className="space-y-2">
          <label className="text-xs font-semibold font-body text-text-primary uppercase tracking-wider">Who</label>
          <div className="grid grid-cols-4 gap-2">
            {WHO_OPTIONS.map((opt) => {
              const isSelected = who === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => { setWho(opt.value); setErrors((e) => ({ ...e, who: '' })) }}
                  className={`flex flex-col items-center gap-1 px-2 py-3 rounded-[8px] text-sm font-medium font-body transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-teal text-white shadow-sm ring-2 ring-teal'
                      : 'bg-white border-2 border-gray-200 text-text-secondary hover:border-teal'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="text-lg">{opt.label.split(' ')[0]}</span>
                  <span className="text-xs">{opt.label.split(' ').slice(1).join(' ')}</span>
                </button>
              )
            })}
          </div>
          {errors.who && <p className="text-error text-xs font-body">{errors.who}</p>}
        </div>

        {/* Weather */}
        <div className="space-y-2">
          <label className="text-xs font-semibold font-body text-text-primary uppercase tracking-wider">Weather</label>
          <div className="flex gap-2 flex-wrap">
            {WEATHER_OPTIONS.map((opt) => {
              const isSelected = weather === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => setWeather(opt.value)}
                  className={`px-4 py-2 rounded-[8px] text-sm font-medium font-body transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-teal text-white shadow-sm'
                      : 'bg-white border-2 border-gray-200 text-text-secondary hover:border-teal'
                  }`}
                  aria-pressed={isSelected}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Vibe */}
        <div className="space-y-2">
          <label className="text-xs font-semibold font-body text-text-primary uppercase tracking-wider">Vibe</label>
          <ChipGroup
            options={VIBE_OPTIONS}
            value={vibes}
            onChange={(v) => { setVibes(v); setErrors((e) => ({ ...e, vibes: '' })) }}
            multi={true}
          />
          {errors.vibes && <p className="text-error text-xs font-body">{errors.vibes}</p>}
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="text-xs font-semibold font-body text-text-primary uppercase tracking-wider">Budget</label>
          <SegmentedControl
            options={BUDGET_OPTIONS}
            value={budget}
            onChange={setBudget}
          />
        </div>

        {/* Time */}
        <div className="space-y-2">
          <label className="text-xs font-semibold font-body text-text-primary uppercase tracking-wider">Time available</label>
          <div className="flex gap-2 flex-wrap">
            {TIME_OPTIONS.map((opt) => {
              const isSelected = time === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => { setTime(opt.value); setErrors((e) => ({ ...e, time: '' })) }}
                  className={`px-4 py-2 rounded-full border-2 text-sm font-medium font-body transition-all duration-150 active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-teal border-teal text-white'
                      : 'bg-white border-teal text-text-primary hover:bg-teal/10'
                  }`}
                  aria-pressed={isSelected}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
          {errors.time && <p className="text-error text-xs font-body">{errors.time}</p>}
        </div>

        {/* Special Interests */}
        <div className="space-y-2">
          <label className="text-xs font-semibold font-body text-text-primary uppercase tracking-wider">
            Special interests{' '}
            <span className="text-text-muted font-normal normal-case">(optional)</span>
          </label>
          <textarea
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="I love street art and jazz..."
            rows={3}
            className="w-full px-4 py-3 rounded-[8px] border-2 border-gray-200 bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-teal transition-colors text-sm font-body resize-none"
          />
        </div>

        {/* Spacer for sticky bottom button */}
        <div className="h-4" />
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-20">
        <div className="max-w-lg mx-auto">
          <Button
            variant="primary"
            size="lg"
            disabled={!isComplete}
            onClick={handleSubmit}
            className="w-full"
          >
            VibeVoyage ✨
          </Button>
        </div>
      </div>
    </div>
  )
}