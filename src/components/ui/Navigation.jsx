import { cn } from '../../lib/utils'

/**
 * Navigation — Responsive nav bar.
 * Shows mobile bottom nav on small screens, top nav on desktop.
 *
 * Props:
 * - activeTab: 'home' | 'trips' | 'profile'
 * - onTabChange: (tab) => void
 */
export function BottomNav({ activeTab = 'home', onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: CompassIcon },
    { id: 'trips', label: 'My Trips', icon: SuitcaseIcon },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-navy z-50" role="navigation" aria-label="Main navigation">
      <div className="flex items-center justify-around h-16 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                'flex flex-col items-center gap-0.5 py-1 px-4 transition-colors cursor-pointer',
                isActive ? 'text-teal' : 'text-text-muted'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium font-body">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/**
 * TopNav — Desktop top navigation bar.
 */
export function TopNav({ activeTab = 'home', onTabChange }) {
  const links = [
    { id: 'home', label: 'Plan a Trip' },
    { id: 'trips', label: 'My Trips' },
    { id: 'saved', label: 'Saved' },
  ]

  return (
    <nav className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-navy z-50 items-center px-8 gap-8" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 flex-shrink-0">
        <img src="/logo-icon.png" alt="VibeVoyage AI" className="w-8 h-8" />
        <img src="/logo-horizontal.png" alt="VibeVoyage AI" className="h-6" />
      </a>

      {/* Nav links */}
      <div className="flex items-center gap-6 ml-4">
        {links.map((link) => {
          const isActive = activeTab === link.id
          return (
            <button
              key={link.id}
              onClick={() => onTabChange?.(link.id)}
              className={cn(
                'font-body text-sm font-medium py-1 border-b-2 transition-colors cursor-pointer',
                isActive
                  ? 'text-teal border-teal'
                  : 'text-text-on-dark/70 border-transparent hover:text-text-on-dark'
              )}
            >
              {link.label}
            </button>
          )
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-teal/20 flex items-center justify-center cursor-pointer">
        <UserIcon className="w-5 h-5 text-teal" />
      </div>
    </nav>
  )
}

// ─── Icon Components ───

function CompassIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.712 4.33a9 9 0 0 1 3.3 3.1M16.712 4.33A8.98 8.98 0 0 0 12 3a9 9 0 0 0-9 9 8.98 8.98 0 0 0 3.292 6.88M16.712 4.33l-4.066 8.576M3.292 18.88A9 9 0 0 0 12 21a9 9 0 0 0 6.673-2.998M3.292 18.88l4.066-8.576m0 0a3 3 0 1 1 5.284 0m-5.284 0a2.99 2.99 0 0 1 .879-1.36" />
    </svg>
  )
}

function SuitcaseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
    </svg>
  )
}

function UserIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  )
}