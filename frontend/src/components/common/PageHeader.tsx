import React from 'react';

//this component is used to display the page header

interface PageHeaderProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  backgroundImage 
}) => {
  return (
    <div className="relative h-96 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Page background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#062546]/80 to-[#1e6f9f]/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
