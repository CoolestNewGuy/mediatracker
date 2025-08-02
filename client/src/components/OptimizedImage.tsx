import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string | null;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
  width?: number;
  height?: number;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  fallback,
  width = 200,
  height = 300
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={cn("bg-gray-700 flex items-center justify-center", className)}>
        {fallback || (
          <div className="text-gray-400 text-xs text-center p-2">
            No Image
          </div>
        )}
      </div>
    );
  }

  // Use image optimization service for external URLs
  const optimizedSrc = src.startsWith('http') 
    ? `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=${width}&h=${height}&fit=cover&q=80`
    : src;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-xs">Loading...</div>
        </div>
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        loading="lazy"
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}