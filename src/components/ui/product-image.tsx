'use client'

import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

interface ProductImageProps {
  src: string | string[]
  alt: string
  className?: string
  fallbackIcon?: React.ReactNode
  fallbackText?: string
}

export function ProductImage({ 
  src, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackIcon,
  fallbackText = "No Image"
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Get the current image URL
  const getCurrentImageUrl = () => {
    if (Array.isArray(src)) {
      return src[currentImageIndex] || ''
    }
    return src || ''
  }

  const currentImageUrl = getCurrentImageUrl()

  // Handle image load error
  const handleImageError = () => {
    if (Array.isArray(src) && currentImageIndex < src.length - 1) {
      // Try next image in array
      setCurrentImageIndex(prev => prev + 1)
    } else {
      // All images failed or single image failed
      setImageError(true)
    }
  }

  // Reset error state when src changes
  const handleImageLoad = () => {
    setImageError(false)
  }

  // If no valid image URL or all images failed
  if (!currentImageUrl || imageError) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
        <div className="flex flex-col items-center justify-center text-gray-400">
          {fallbackIcon || (
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}
          <span className="text-sm font-medium text-gray-500">{fallbackText}</span>
        </div>
      </div>
    )
  }

  return (
    <img
      src={currentImageUrl}
      alt={alt}
      className={className}
      onError={handleImageError}
      onLoad={handleImageLoad}
      loading="lazy"
    />
  )
}
