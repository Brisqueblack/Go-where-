import { cn } from '../../lib/utils'

/**
 * ActivityCard — Two variants:
 * - "timeline" (default): Horizontal card with image left, details right
 * - "map": Compact card for the map bottom sheet
 */
export default function ActivityCard({
  image,
  title,
  rating,
  price,
  duration,
  time,
  tags = [],
  category,
  variant = 'timeline',
  onClick,
  className,
  isHiddenGem,
}) {
  if (variant === 'map') {
    return (
      <div
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 bg-white rounded-[12px] p-3 shadow-card cursor-pointer hover:shadow-card-hover transition-shadow duration-200',
          className
        )}
      >
        {image && (
          <img
            src={image}
            alt={title}
            className="w-14 h-14 rounded-[8px] object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-body font-semibold text-sm text-text-primary truncate">{title}</p>
          {time && <p className="font-body text-xs text-text-muted">{time}</p>}
        </div>
        {onClick && (
          <svg className="w-4 h-4 text-text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
          </svg>
        )}
      </div>
    )
  }

  // Timeline variant
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex gap-3 bg-white rounded-[12px] p-4 shadow-card cursor-pointer hover:shadow-card-hover transition-all duration-200',
        className
      )}
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="w-20 h-20 rounded-[8px] object-cover flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-body font-semibold text-text-primary text-sm leading-tight">
            {title}
            {isHiddenGem && (
              <span className="inline-flex items-center gap-1 ml-1.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-teal to-violet text-white text-[9px] font-bold uppercase tracking-wider leading-none">
                ✨ Premium
              </span>
            )}
          </h4>
        </div>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {rating && (
            <span className="text-amber text-xs font-medium">{rating} ★</span>
          )}
          {price !== undefined && price !== null && (
            <span className="text-text-secondary text-xs">
              {price === 0 ? 'Free' : `$${price}`}
            </span>
          )}
          {duration && (
            <span className="text-text-muted text-xs">{duration}</span>
          )}
        </div>
        {category && (
          <span className="text-text-muted text-xs mt-1 block">{category}</span>
        )}
        {tags.length > 0 && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {tags.map((tag) => {
              const isPopular = tag === 'Popular' || tag === 'Must Try'
              return (
                <span
                  key={tag}
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-medium text-white',
                    isPopular ? 'bg-amber' : 'bg-teal'
                  )}
                >
                  {tag}
                </span>
              )
            })}
          </div>
        )}
      </div>
      <svg className="w-4 h-4 text-text-muted flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
      </svg>
    </div>
  )
}