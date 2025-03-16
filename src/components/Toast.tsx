"use client"

import React, { useEffect } from 'react'

interface ToastProps {
  message: string
  isVisible: boolean
  onHide: () => void
  type?: 'error' | 'success' | 'info'
  duration?: number
}

const Toast: React.FC<ToastProps> = ({
  message,
  isVisible,
  onHide,
  type = 'error',
  duration = 2000
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onHide])

  if (!isVisible) return null

  const baseClasses = 'fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white z-50 transition-opacity duration-300'
  const typeClasses = {
    error: 'bg-red-500',
    success: 'bg-green-500',
    info: 'bg-blue-500'
  }

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      {message}
    </div>
  )
}

export default Toast 