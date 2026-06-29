import { useState, useCallback } from 'react'
import { BottomNav, TopNav } from './components/ui'
import HomePage from './pages/HomePage'
import ItineraryInputPage from './pages/ItineraryInputPage'
import LoadingPage from './pages/LoadingPage'
import ResultsTimelinePage from './pages/ResultsTimelinePage'
import ResultsMapPage from './pages/ResultsMapPage'
import ActivityDetailPage from './pages/ActivityDetailPage'
import PremiumPage from './pages/PremiumPage'
import { generateItinerary as apiGenerate } from './services/api'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [activeTab, setActiveTab] = useState('home')
  const [resultsView, setResultsView] = useState('timeline') // 'timeline' | 'map'
  const [activeDetailItem, setActiveDetailItem] = useState(null)
  const [itinerary, setItinerary] = useState(null)
  const [isPremium, setIsPremium] = useState(() => {
    return localStorage.getItem('vibevoyage_premium') === 'true'
  })
  const [preferences, setPreferences] = useState({
    location: '',
    vibes: [],
    where: '',
    when: '',
    who: '',
    budget: '',
    time: '',
    interests: '',
  })
  const [genError, setGenError] = useState(null)

  // Map form time/duration to API duration_days
  const DURATION_MAP = {
    'few-hours': 1,
    'half-day': 1,
    'full-day': 1,
    'multi-day': 2,
  }

  // Map form budget to API budget_level
  const BUDGET_MAP = {
    budget: 'budget',
    moderate: 'moderate',
    splurge: 'luxury',
  }

  const handleNavigate = useCallback((page) => {
    setCurrentPage(page)
    if (page === 'home') {
      setActiveTab('home')
      setResultsView('timeline')
      setActiveDetailItem(null)
    }
  }, [])

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab)
    if (tab === 'home') setCurrentPage('home')
  }, [])

  const handleSubmitPreferences = useCallback(async (data) => {
    // Save preferences
    setGenError(null)
    setPreferences((prev) => ({ ...prev, ...data }))

    // Navigate to loading screen immediately
    handleNavigate('loading')

    // Build API params from form data
    const destination = data.where || preferences.location || 'New York City'
    const duration_days = DURATION_MAP[data.time] || 1
    const budget_level = BUDGET_MAP[data.budget] || 'moderate'
    const vibes = (data.vibes || []).join(', ')
    const preferences_text = data.interests || ''

    // Call the real AI engine
    const result = await apiGenerate({
      destination,
      duration_days,
      budget_level,
      vibes,
      preferences: preferences_text,
      is_premium: isPremium,
    })

    if (result.success) {
      setItinerary(result.data)
      handleNavigate('results-timeline')
    } else {
      console.error('[VibeVoyage] Generation failed:', result.error)
      setGenError(result.error || 'Something went wrong. Please try again.')
      handleNavigate('home')
    }
  }, [handleNavigate, preferences, isPremium])

  const handleLoadingComplete = useCallback(() => {
    // Loading animation timer finished — don't navigate.
    // The API call (handleSubmitPreferences) navigates to results when ready.
    // This prevents race conditions where the timer fires before the API returns.
  }, [])

  const handleToggleView = useCallback((view) => {
    setResultsView(view)
    if (view === 'timeline') handleNavigate('results-timeline')
    if (view === 'map') handleNavigate('results-map')
  }, [handleNavigate])

  const handleViewDetail = useCallback((item) => {
    setActiveDetailItem(item)
    handleNavigate('detail')
  }, [handleNavigate])

  const handleBackFromDetail = useCallback(() => {
    if (resultsView === 'map') {
      handleNavigate('results-map')
    } else {
      handleNavigate('results-timeline')
    }
  }, [handleNavigate, resultsView])

  const handleUpgrade = useCallback((planId) => {
    setIsPremium(true)
    localStorage.setItem('vibevoyage_premium', 'true')
    handleNavigate('home')
  }, [handleNavigate])

  // Pages that should NOT show the nav bars (full-screen experiences)
  const hideNav = ['loading', 'results-timeline', 'results-map', 'detail', 'premium'].includes(currentPage)

  return (
    <div className="min-h-screen bg-navy">
      {/* TopNav — visible on desktop (hidden during full-screen pages) */}
      {!hideNav && <TopNav activeTab={activeTab} onTabChange={handleTabChange} />}

      {/* Page content */}
      <div className={!hideNav ? 'md:pt-16' : ''}>
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            preferences={preferences}
            setPreferences={setPreferences}
          />
        )}

        {currentPage === 'input' && (
          <ItineraryInputPage
            preferences={preferences}
            setPreferences={setPreferences}
            onBack={() => handleNavigate('home')}
            onSubmit={handleSubmitPreferences}
          />
        )}

        {currentPage === 'loading' && (
          <LoadingPage onComplete={handleLoadingComplete} />
        )}

        {currentPage === 'results-timeline' && (
          <ResultsTimelinePage
            itinerary={itinerary}
            onBack={() => handleNavigate('home')}
            onViewDetail={handleViewDetail}
            onToggleView={handleToggleView}
            onGoPremium={() => handleNavigate('premium')}
          />
        )}

        {currentPage === 'results-map' && (
          <ResultsMapPage
            itinerary={itinerary}
            onBack={() => handleNavigate('home')}
            onViewDetail={handleViewDetail}
            onToggleView={handleToggleView}
          />
        )}

        {currentPage === 'detail' && (
          <ActivityDetailPage
            item={activeDetailItem}
            onBack={handleBackFromDetail}
          />
        )}

        {currentPage === 'premium' && (
          <PremiumPage
            isPremium={isPremium}
            onBack={() => handleNavigate('home')}
            onUpgrade={handleUpgrade}
          />
        )}
      </div>

      {/* BottomNav — visible on mobile (hidden during full-screen pages) */}
      {!hideNav && <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />}
    </div>
  )
}