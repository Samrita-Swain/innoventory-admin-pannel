const LoadingSpinner = ({ size = 'md', color = 'primary', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-gray-600',
    white: 'border-white'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full animate-spin`}>
          <div className={`absolute inset-0 border-4 ${colorClasses[color]} rounded-full border-t-transparent animate-spin`}></div>
        </div>
        
        {/* Pulsing dots */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <div className={`w-1 h-1 ${colorClasses[color].replace('border-', 'bg-')} rounded-full animate-pulse`}></div>
          <div className={`w-1 h-1 ${colorClasses[color].replace('border-', 'bg-')} rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
          <div className={`w-1 h-1 ${colorClasses[color].replace('border-', 'bg-')} rounded-full animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
      
      {text && (
        <p className="text-sm text-gray-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
