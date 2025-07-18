import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: 'icon' | 'skeuomorphic' | 'normal'
  children: React.ReactNode
  className?: string
}

export default function Button({variant, children, className, ...props}: ButtonProps) {
  if(variant === 'icon') {
    return (
      <button 
        {...props}
        className={`flex flex-row border border-border-light rounded-md p-1.5 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${className}`}
      >
        {children}
      </button>
    )
  } else if(variant === 'skeuomorphic') {
    return (
      <button 
        {...props}
        className={`flex flex-row gap-2 items-center px-2 py-1 rounded-md w-max skeuomorphic-button skeuomorphic-shadow ${className}`}
      >
        {children}
      </button>
    )
  } else if(variant === 'normal') {
    return (
      <button 
        {...props}
        className={`flex flex-row justify-center gap-2 items-center bg-white border border-border-light text-center rounded-md text-xs px-2 py-1.5 ${className}`}
      >
        {children}
      </button>
    )
  }
}