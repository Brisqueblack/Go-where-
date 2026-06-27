import { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'

/**
 * Timeline — Vertical timeline container with dots and connecting line.
 * Renders a list of TimelineItem children.
 */
export function TimelineContainer({ children, className }) {
  return (
    <div className={cn('relative pl-8', className)}>
      {/* Vertical line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-teal/40" aria-hidden="true" />
      <div className="space-y-3">{children}</div>
    </div>
  )
}

/**
 * TimelineItem — A single entry in the timeline.
 * Wraps content with a dot marker on the timeline line.
 */
export function TimelineItem({ time, children, className }) {
  return (
    <div className={cn('relative', className)}>
      {/* Dot on timeline */}
      <div
        className="absolute -left-[22px] top-[14px] w-[14px] h-[14px] rounded-full bg-teal border-[3px] border-sand z-10"
        aria-hidden="true"
      />
      {/* Time label */}
      {time && (
        <p className="absolute -left-[76px] top-[12px] text-xs font-semibold text-text-secondary w-14 text-right">
          {time}
        </p>
      )}
      {/* Content */}
      <div className="ml-0">{children}</div>
    </div>
  )
}