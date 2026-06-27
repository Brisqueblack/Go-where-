import { cn } from '../../lib/utils'

export default function SegmentedControl({ options = [], value, onChange, className }) {
  return (
    <div className={cn('flex bg-gray-200 rounded-[8px] overflow-hidden', className)}>
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        const isSelected = value === val
        return (
          <button
            key={val}
            onClick={() => onChange?.(val)}
            className={cn(
              'flex-1 px-4 py-2.5 text-sm font-medium font-body transition-all duration-150 cursor-pointer',
              isSelected
                ? 'bg-coral text-white'
                : 'bg-transparent text-text-secondary hover:bg-gray-100'
            )}
            aria-pressed={isSelected}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}