import { useState, useCallback } from 'react'
import { BottomNav, TopNav } from './components/ui'
import HomePage from './pages/HomePage'
import ItineraryInputPage from './pages/ItineraryInputPage'
import LoadingPage from './pages/LoadingPage'
import ResultsTimelinePage from './pages/ResultsTimelinePage'
import ResultsMapPage from './pages/ResultsMapPage'
import ActivityDetailPage from './pages/ActivityDetailPage'
import sampleItinerary from './data/sampleItinerary'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [activeTab, setActiveTab] = useState('home')
  const [resultsView, setResultsView] = useState('timeline') // 'timeline' | 'map'
  const [activeDetailItem, setActiveDetailItem] = useState(null)
  const [itinerary, setItinerary] = useState(null)
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

  const handleSubmitPreferences = useCallback((data) => {
    console.log('Preferences ready for AI engine:', data)
    // Save preferences
    setPreferences((prev) => ({ ...prev, ...data }))
    // Navigate to loading screen
    handleNavigate('loading')
  }, [handleNavigate])

  const handleLoadingComplete = useCallback(() => {
    // Use sample itinerary data for demo — will be replaced by AI engine
    setItinerary(sampleItinerary)
    handleNavigate('results-timeline')
  }, [handleNavigate])

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

  // Pages that should NOT show the nav bars (full-screen experiences)
  const hideNav = ['loading', 'results-timeline', 'results-map', 'detail'].includes(currentPage)

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
      </div>

      {/* BottomNav — visible on mobile (hidden during full-screen pages) */}
      {!hideNav && <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />}
    </div>
  )
}