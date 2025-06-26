// Debug utilities for troubleshooting image and component issues

// Log image loading issues
export const logImageError = (src, error, context = '') => {
  console.group(`🖼️ Image Loading Error ${context ? `(${context})` : ''}`);
  console.error('Source:', src);
  console.error('Error:', error);
  console.error('Timestamp:', new Date().toISOString());
  console.groupEnd();
};

// Log component errors
export const logComponentError = (componentName, error, props = {}) => {
  console.group(`⚠️ Component Error: ${componentName}`);
  console.error('Error:', error);
  console.error('Props:', props);
  console.error('Stack:', error.stack);
  console.error('Timestamp:', new Date().toISOString());
  console.groupEnd();
};

// Check if images are loading properly
export const checkImageHealth = () => {
  const images = document.querySelectorAll('img');
  const brokenImages = [];
  const loadingImages = [];
  const loadedImages = [];

  images.forEach((img, index) => {
    if (!img.src || img.src === '' || img.src.includes('undefined')) {
      brokenImages.push({ index, src: img.src, alt: img.alt });
    } else if (!img.complete) {
      loadingImages.push({ index, src: img.src, alt: img.alt });
    } else if (img.naturalWidth === 0) {
      brokenImages.push({ index, src: img.src, alt: img.alt });
    } else {
      loadedImages.push({ index, src: img.src, alt: img.alt });
    }
  });

  console.group('🖼️ Image Health Check');
  console.log(`Total images: ${images.length}`);
  console.log(`Loaded: ${loadedImages.length}`);
  console.log(`Loading: ${loadingImages.length}`);
  console.log(`Broken: ${brokenImages.length}`);
  
  if (brokenImages.length > 0) {
    console.warn('Broken images:', brokenImages);
  }
  
  if (loadingImages.length > 0) {
    console.info('Loading images:', loadingImages);
  }
  
  console.groupEnd();

  return {
    total: images.length,
    loaded: loadedImages.length,
    loading: loadingImages.length,
    broken: brokenImages.length,
    brokenImages,
    loadingImages,
    loadedImages
  };
};

// Monitor console for errors
export const monitorConsoleErrors = () => {
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args) => {
    // Check if it's an image-related error
    const message = args.join(' ').toLowerCase();
    if (message.includes('image') || message.includes('img') || message.includes('src')) {
      console.group('🚨 Image-related Console Error');
      originalError.apply(console, args);
      console.trace('Stack trace:');
      console.groupEnd();
    } else {
      originalError.apply(console, args);
    }
  };

  console.warn = (...args) => {
    // Check if it's an image-related warning
    const message = args.join(' ').toLowerCase();
    if (message.includes('image') || message.includes('img') || message.includes('src')) {
      console.group('⚠️ Image-related Console Warning');
      originalWarn.apply(console, args);
      console.trace('Stack trace:');
      console.groupEnd();
    } else {
      originalWarn.apply(console, args);
    }
  };

  // Return cleanup function
  return () => {
    console.error = originalError;
    console.warn = originalWarn;
  };
};

// Debug file upload issues
export const debugFileUpload = (file, errors = []) => {
  console.group('📁 File Upload Debug');
  console.log('File:', file);
  console.log('File name:', file?.name);
  console.log('File type:', file?.type);
  console.log('File size:', file?.size);
  console.log('Errors:', errors);
  
  if (file && file.type.startsWith('image/')) {
    console.log('Image file detected');
    
    // Try to create object URL
    try {
      const url = URL.createObjectURL(file);
      console.log('Object URL created:', url);
      
      // Test if image can be loaded
      const img = new Image();
      img.onload = () => {
        console.log('✅ Image loaded successfully');
        console.log('Dimensions:', img.naturalWidth, 'x', img.naturalHeight);
        URL.revokeObjectURL(url);
      };
      img.onerror = (error) => {
        console.error('❌ Image failed to load:', error);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (error) {
      console.error('❌ Failed to create object URL:', error);
    }
  }
  
  console.groupEnd();
};

// Performance monitoring for images
export const monitorImagePerformance = () => {
  if (!window.PerformanceObserver) {
    console.warn('PerformanceObserver not supported');
    return;
  }

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.initiatorType === 'img') {
        console.log(`🖼️ Image Performance: ${entry.name}`);
        console.log(`Duration: ${entry.duration.toFixed(2)}ms`);
        console.log(`Size: ${entry.transferSize} bytes`);
      }
    });
  });

  observer.observe({ entryTypes: ['resource'] });

  // Return cleanup function
  return () => observer.disconnect();
};

// Global error handler for unhandled image errors
export const setupGlobalImageErrorHandler = () => {
  window.addEventListener('error', (event) => {
    if (event.target && event.target.tagName === 'IMG') {
      logImageError(event.target.src, event.error || 'Unknown error', 'Global handler');
      
      // Try to replace with placeholder
      event.target.style.display = 'none';
      
      // Create placeholder element
      const placeholder = document.createElement('div');
      placeholder.className = 'image-placeholder bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-500 text-sm';
      placeholder.style.width = event.target.width || '100px';
      placeholder.style.height = event.target.height || '100px';
      placeholder.textContent = '🖼️ Image not available';
      
      // Insert placeholder after the broken image
      event.target.parentNode?.insertBefore(placeholder, event.target.nextSibling);
    }
  }, true);
};

// Initialize all debug utilities
export const initializeDebugUtils = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Initializing debug utilities...');
    
    // Setup global error handler
    setupGlobalImageErrorHandler();
    
    // Monitor console errors
    const cleanupConsoleMonitor = monitorConsoleErrors();
    
    // Monitor image performance
    const cleanupPerformanceMonitor = monitorImagePerformance();
    
    // Add global debug functions
    window.debugUtils = {
      checkImageHealth,
      debugFileUpload,
      logImageError,
      logComponentError
    };
    
    console.log('✅ Debug utilities initialized');
    console.log('Available functions: window.debugUtils');
    
    // Return cleanup function
    return () => {
      cleanupConsoleMonitor();
      cleanupPerformanceMonitor();
      delete window.debugUtils;
    };
  }
  
  return () => {}; // No-op cleanup for production
};
