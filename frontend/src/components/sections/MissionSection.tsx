import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Target, Award, Heart, Users, Globe, Shield } from 'lucide-react';

const missionItems = [
  {
    icon: Target,
    title: 'Expert Guidance',
    description: 'Local expertise and insider knowledge to create unforgettable experiences',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Carefully curated accommodations and experiences that exceed expectations',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Heart,
    title: 'Cultural Immersion',
    description: 'Authentic connections with Algeria\'s diverse cultures and traditions',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Users,
    title: 'Personalized Service',
    description: 'Tailored recommendations based on your unique preferences and interests',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Globe,
    title: 'Sustainable Tourism',
    description: 'Promoting responsible travel that benefits local communities',
    color: 'from-teal-500 to-teal-600',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Your safety and security are our top priorities throughout your journey',
    color: 'from-orange-500 to-orange-600',
  },
];

export const MissionSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Statement */}
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-[#062546] mb-8 [font-family:'Outfit',Helvetica]">
            Our Mission
          </h2>
          <p className="text-2xl text-gray-600 leading-relaxed [font-family:'Outfit',Helvetica] font-normal mb-16">
            7wess makes Algeria's beauty and heritage accessible through AI-powered 
            itineraries, with tailored hotels and budgets for every traveler.
          </p>
        </div>

        {/* Mission Items Grid */}
        <div className="max-w-5xl mx-auto">
          <Card className="bg-[#062546] border-none shadow-2xl rounded-[40px] overflow-hidden">
            <CardContent className="p-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {missionItems.slice(0, 3).map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-20 h-20 bg-[#1e6f9f] rounded-full flex items-center justify-center mx-auto mb-6">
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4 [font-family:'Outfit',Helvetica]">
                        {item.title}
                      </h3>
                      
                      <p className="text-white leading-relaxed text-lg [font-family:'Outfit',Helvetica] font-normal">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
};
