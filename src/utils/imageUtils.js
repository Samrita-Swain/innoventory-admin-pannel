// Image utility functions for handling loading, errors, and fallbacks

// Check if a URL is a valid image
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  // Check for common image extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i;
  if (imageExtensions.test(url)) return true;
  
  // Check for data URLs
  if (url.startsWith('data:image/')) return true;
  
  // Check for blob URLs
  if (url.startsWith('blob:')) return true;
  
  return false;
};

// Preload an image and return a promise
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('No image source provided'));
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      resolve({
        src,
        width: img.naturalWidth,
        height: img.naturalHeight,
        loaded: true
      });
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };
    
    // Set a timeout for loading
    const timeout = setTimeout(() => {
      reject(new Error(`Image loading timeout: ${src}`));
    }, 10000); // 10 second timeout
    
    img.onload = () => {
      clearTimeout(timeout);
      resolve({
        src,
        width: img.naturalWidth,
        height: img.naturalHeight,
        loaded: true
      });
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      reject(new Error(`Failed to load image: ${src}`));
    };
    
    img.src = src;
  });
};

// Generate a placeholder image URL
export const generatePlaceholderImage = (width = 300, height = 200, text = 'Image') => {
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">
        ${text}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Get image dimensions without loading the full image
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof File)) {
      reject(new Error('Invalid file provided'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for dimension calculation'));
    };
    
    img.src = url;
  });
};

// Validate image file
export const validateImageFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    maxWidth = null,
    maxHeight = null
  } = options;

  const errors = [];

  // Check if file exists
  if (!file) {
    errors.push('No file provided');
    return { isValid: false, errors };
  }

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`);
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type (${file.type}) is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  // For dimension validation, we'd need to load the image (async)
  // This is handled separately in getImageDimensions

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Create a thumbnail from an image file
export const createImageThumbnail = (file, maxWidth = 150, maxHeight = 150, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid image file'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          resolve(blob);
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for thumbnail creation'));
    };

    img.src = url;
  });
};

// Handle image loading errors gracefully
export const handleImageError = (error, fallbackSrc = null) => {
  console.warn('Image loading error:', error);
  
  // Return fallback image or placeholder
  if (fallbackSrc) {
    return fallbackSrc;
  }
  
  // Generate a simple placeholder
  return generatePlaceholderImage(300, 200, 'Image not available');
};
