'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  className?: string
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  className
}: OtpInputProps) {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value)
    }
  }, [value, length, onComplete])

  const handleChange = (index: number, inputValue: string) => {
    const numericValue = inputValue.replace(/\D/g, '')
    
    if (numericValue.length > 1) {
      // Handle paste
      const pastedValue = numericValue.slice(0, length)
      onChange(pastedValue)
      
      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedValue.length, length - 1)
      inputRefs.current[nextIndex]?.focus()
      setFocusedIndex(nextIndex)
      return
    }

    const newValue = value.split('')
    newValue[index] = numericValue
    const updatedValue = newValue.join('')
    
    onChange(updatedValue)

    // Move to next input if value is entered
    if (numericValue && index < length - 1) {
      const nextInput = inputRefs.current[index + 1]
      if (nextInput) {
        nextInput.focus()
        setFocusedIndex(index + 1)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      
      const newValue = value.split('')
      if (newValue[index]) {
        // Clear current input
        newValue[index] = ''
        onChange(newValue.join(''))
      } else if (index > 0) {
        // Move to previous input and clear it
        newValue[index - 1] = ''
        onChange(newValue.join(''))
        const prevInput = inputRefs.current[index - 1]
        if (prevInput) {
          prevInput.focus()
          setFocusedIndex(index - 1)
        }
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = inputRefs.current[index - 1]
      if (prevInput) {
        prevInput.focus()
        setFocusedIndex(index - 1)
      }
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      const nextInput = inputRefs.current[index + 1]
      if (nextInput) {
        nextInput.focus()
        setFocusedIndex(index + 1)
      }
    }
  }

  const handleFocus = (index: number) => {
    setFocusedIndex(index)
  }

  return (
    <div className={cn('flex gap-2 justify-center', className)}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={cn(
            'w-12 h-12 text-center text-xl font-mono border-2 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'transition-colors duration-200',
            focusedIndex === index
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-100'
          )}
        />
      ))}
    </div>
  )
}
