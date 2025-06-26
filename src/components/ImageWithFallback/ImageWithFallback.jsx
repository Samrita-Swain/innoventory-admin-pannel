import React, { useState, useEffect } from 'react';
import { PhotoIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ImageWithFallback = ({ 
  src, 
  alt = 'Image', 
  className = '', 
  fallbackIcon: FallbackIcon = PhotoIcon,
  showErrorMessage = false,
  onError = null,
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset states when src changes
    setImageError(false);
    setIsLoading(true);
  }, [src]);

  const handleImageError = (error) => {
    console.warn('Image failed to load:', src, error);
    setImageError(true);
    setIsLoading(false);
    
    if (onError) {
      onError(error);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  // If no src provided, show fallback immediately
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} {...props}>
        <FallbackIcon className="h-8 w-8 text-gray-400" />
        {showErrorMessage && (
          <span className="ml-2 text-sm text-gray-500">No image available</span>
        )}
      </div>
    );
  }

  // If image failed to load, show fallback
  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} {...props}>
        <div className="text-center">
          <ExclamationTriangleIcon className="h-8 w-8 text-gray-400 mx-auto mb-1" />
          {showErrorMessage && (
            <span className="text-xs text-gray-500">Failed to load image</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading placeholder */}
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${className}`}>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;
