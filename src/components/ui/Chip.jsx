import { cn } from '../../lib/utils'

export default function Chip({ label, selected = false, icon, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 text-sm font-medium font-body transition-all duration-150 active:scale-95 cursor-pointer',
        selected
          ? 'bg-teal border-teal text-white'
          : 'bg-sand border-teal text-text-primary hover:bg-teal/10',
        className
      )}
      aria-pressed={selected}
      role="checkbox"
    >
      {icon && <span className="text-base">{icon}</span>}
      {label}
    </button>
  )
}

export function ChipGroup({ options = [], value = [], onChange, multi = true, className }) {
  const handleClick = (val) => {
    if (multi) {
      const next = value.includes(val) ? value.filter((v) => v !== val) : [...value, val]
      onChange?.(next)
    } else {
      onChange?.([val])
    }
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        const icon = typeof opt === 'string' ? null : opt.icon
        return (
          <Chip
            key={val}
            label={label}
            icon={icon}
            selected={value.includes(val)}
            onClick={() => handleClick(val)}
          />
        )
      })}
    </div>
  )
}