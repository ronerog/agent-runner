'use client'

import React from 'react'

interface InputProps {
  label?: string
  id: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
  className?: string
  required?: boolean
}

export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  className = '',
  required = false,
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          border rounded-lg px-3 py-2 text-sm text-slate-800
          focus:outline-none focus:ring-2 focus:ring-rose-300
          transition-colors
          ${error ? 'border-rose-500 bg-rose-50' : 'border-slate-200 bg-white'}
        `}
      />
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  )
}
