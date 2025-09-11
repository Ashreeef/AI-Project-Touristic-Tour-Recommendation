import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { SearchFormSection } from '../components/sections/SearchFormSection';
import { DestinationsSection } from '../components/sections/DestinationsSection';
import { FeaturedHotelsSection } from '../components/sections/FeaturedHotelsSection';
import { MissionSection } from '../components/sections/MissionSection';
import { AboutSection } from '../components/sections/AboutSection';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <SearchFormSection />
      <DestinationsSection />
      <FeaturedHotelsSection />
      <MissionSection />
      <AboutSection />
    </div>
  );
};
