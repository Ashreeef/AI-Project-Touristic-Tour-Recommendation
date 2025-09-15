import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-visible">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
            <img
              src="/bg.png"
              alt="Algeria landscape"
              className="w-full h-full object-cover"
            />
        <div className="absolute inset-0 bg-gradient-to-r from-[#062546]/60 to-[#1e6f9f]/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight [font-family:'Outfit',Helvetica]">
            <span className="block text-white drop-shadow-2xl">Discover And</span>
            <span className="block text-[#1e6f9f] drop-shadow-2xl">Explore Algeria</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-100 max-w-4xl mx-auto leading-relaxed [font-family:'Outfit',Helvetica] font-normal drop-shadow-lg px-2">
            Your ultimate Touristic Guide For exploring different places in Algeria!
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-2">
          <Button
            size="lg"
            onClick={() => {
              const formSection = document.querySelector('.search-form-section');
              if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full sm:w-auto bg-[#1e6f9f] hover:bg-[#1a5f8a] active:bg-[#164d73] text-white px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold group rounded-2xl shadow-2xl hover:shadow-[#1e6f9f]/30 hover:scale-105 active:scale-95 transition-all duration-300 [font-family:'Outfit',Helvetica]"
          >
            Start Planning
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/destinations')}
            className="w-full sm:w-auto border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#1e6f9f] active:bg-gray-100 px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold group rounded-2xl shadow-2xl hover:shadow-white/20 hover:scale-105 active:scale-95 transition-all duration-300 [font-family:'Outfit',Helvetica]"
          >
            Discover Destinations
          </Button>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};
