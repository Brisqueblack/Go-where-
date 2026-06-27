/**
 * Utility: merge class names, filtering out falsy values.
 * Tailwind v4 compatible — no external dependency needed.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}