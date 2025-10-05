import React from 'react';

interface DefaultPostImageProps {
  title: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function DefaultPostImage({ title, className = "", style = {} }: DefaultPostImageProps) {
  // Generate a gradient based on the title hash for consistency
  const getGradientFromTitle = (title: string) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Use hash to determine gradient colors
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-purple-500 to-pink-600', 
      'from-pink-500 to-red-600',
      'from-red-500 to-orange-600',
      'from-orange-500 to-yellow-600',
      'from-yellow-500 to-green-600',
      'from-green-500 to-teal-600',
      'from-teal-500 to-blue-600',
      'from-indigo-500 to-purple-600',
      'from-cyan-500 to-blue-600'
    ];
    
    return gradients[Math.abs(hash) % gradients.length];
  };

  const gradient = getGradientFromTitle(title);
  
  return (
    <div 
      className={`bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full -translate-x-12 -translate-y-12"></div>
      </div>
      
      {/* Title text */}
      <div className="relative z-10 text-center px-6">
        <h3 className="text-white font-bold text-lg lg:text-xl xl:text-2xl leading-tight drop-shadow-lg">
          {title}
        </h3>
      </div>
      
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10"></div>
    </div>
  );
}