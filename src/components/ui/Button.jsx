import { cn } from '../../lib/utils'

const variants = {
  primary: 'bg-coral text-white hover:brightness-90 active:brightness-85 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed',
  secondary: 'bg-teal text-white hover:brightness-90 active:brightness-85 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed',
  outline: 'bg-transparent text-text-primary border-2 border-text-primary hover:bg-text-primary hover:text-white active:scale-[0.98] disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed',
  ghost: 'bg-transparent text-teal hover:bg-teal/10 active:bg-teal/20 disabled:text-gray-400 disabled:cursor-not-allowed',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-[8px]',
  md: 'px-5 py-2.5 text-sm rounded-[8px]',
  lg: 'px-8 py-3 text-base rounded-[12px]',
}

export default function Button({ variant = 'primary', size = 'md', children, disabled, className, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}