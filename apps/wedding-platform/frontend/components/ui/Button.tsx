'use client'

import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonType = 'button' | 'submit' | 'reset'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: ButtonType
  variant?: ButtonVariant
  disabled?: boolean
  className?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-rose-500 hover:bg-rose-600 text-white',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
  ghost: 'bg-transparent hover:bg-slate-50 text-slate-600',
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        rounded-lg px-4 py-2 font-medium
        transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  )
}
