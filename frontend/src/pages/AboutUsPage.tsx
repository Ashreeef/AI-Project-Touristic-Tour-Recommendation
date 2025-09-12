import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent } from '../components/ui/card';
import { Users, Target, Heart, Globe, Award, Lightbulb } from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen">
      <PageHeader 
        title="About 7wess"
        subtitle="Discovering Algeria's hidden gems through technology and passion"
        backgroundImage="/AboutUs.jpg"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Story Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Image */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <img
                  src="/AboutUs.jpg"
                  alt="About 7wess team"
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
              </div>
            </div>

            {/* Right side - Text content */}
            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-[#062546] mb-6 [font-family:'Outfit',Helvetica]">
                  Our Story
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed [font-family:'Outfit',Helvetica] mb-6">
                  We are six passionate students from ENSIA, united by our love for Algeria and technology. 7wess is our project to share the country's hidden gems and magnificent landscapes with the world.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed [font-family:'Outfit',Helvetica] mb-6">
                  From the pristine Mediterranean coastline to the vast Sahara Desert, from ancient Roman ruins to vibrant modern cities, Algeria offers unforgettable experiences for every traveler.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed [font-family:'Outfit',Helvetica]">
                  We believe travel is more than visiting places — it's about creating connections, embracing cultures, and making memories that last a lifetime.
                </p>
              </div>
            </div>
          </div>
        </section>

        

        {/* Mission & Vision Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#062546] mb-6 [font-family:'Outfit',Helvetica]">
              Our Mission & Vision
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto [font-family:'Outfit',Helvetica]">
              We're on a mission to showcase Algeria's beauty and make travel planning effortless for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <Target className="w-16 h-16 text-[#1e6f9f] mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-[#062546] mb-4 [font-family:'Outfit',Helvetica]">
                  Our Mission
                </h3>
                <p className="text-gray-700 leading-relaxed [font-family:'Outfit',Helvetica]">
                  To democratize travel in Algeria by providing intelligent, personalized recommendations that help both locals and international visitors discover the country's incredible diversity and beauty.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <Globe className="w-16 h-16 text-[#1e6f9f] mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-[#062546] mb-4 [font-family:'Outfit',Helvetica]">
                  Our Vision
                </h3>
                <p className="text-gray-700 leading-relaxed [font-family:'Outfit',Helvetica]">
                  To become the leading platform for discovering Algeria's tourism potential, fostering cultural exchange, and promoting sustainable travel practices across the country.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technology Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#062546] mb-6 [font-family:'Outfit',Helvetica]">
              Powered by Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto [font-family:'Outfit',Helvetica]">
              AI-powered travel planning that adapts to your unique style
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1e6f9f] via-[#062546] to-[#1e6f9f] rounded-3xl p-8 md:p-12 text-white">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-4 [font-family:'Outfit',Helvetica]">
                  Intelligent Travel Planning
                </h3>
                <p className="text-xl text-white/90 max-w-2xl mx-auto [font-family:'Outfit',Helvetica]">
                  Smart algorithms that create perfect itineraries for you
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 group-hover:bg-white/30 transition-all duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold mb-3 [font-family:'Outfit',Helvetica]">Smart Recommendations</h4>
                  <p className="text-white/80 text-lg [font-family:'Outfit',Helvetica]">
                    AI learns your preferences
                  </p>
                </div>

                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 group-hover:bg-white/30 transition-all duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold mb-3 [font-family:'Outfit',Helvetica]">Optimized Routes</h4>
                  <p className="text-white/80 text-lg [font-family:'Outfit',Helvetica]">
                    Perfect path planning
                  </p>
                </div>

                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 group-hover:bg-white/30 transition-all duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold mb-3 [font-family:'Outfit',Helvetica]">Budget Management</h4>
                  <p className="text-white/80 text-lg [font-family:'Outfit',Helvetica]">
                    Smart spending allocation
                  </p>
                </div>
              </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#062546] mb-6 [font-family:'Outfit',Helvetica]">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto [font-family:'Outfit',Helvetica]">
              The principles that guide everything we do at 7wess.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <Heart className="w-12 h-12 text-[#1e6f9f] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#062546] mb-3 [font-family:'Outfit',Helvetica]">
                  Passion
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed [font-family:'Outfit',Helvetica]">
                  We're driven by our genuine love for Algeria and its incredible diversity.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <Lightbulb className="w-12 h-12 text-[#1e6f9f] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#062546] mb-3 [font-family:'Outfit',Helvetica]">
                  Innovation
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed [font-family:'Outfit',Helvetica]">
                  We use cutting-edge technology to create seamless travel experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <Users className="w-12 h-12 text-[#1e6f9f] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#062546] mb-3 [font-family:'Outfit',Helvetica]">
                  Community
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed [font-family:'Outfit',Helvetica]">
                  We believe in bringing people together through shared travel experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <Award className="w-12 h-12 text-[#1e6f9f] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#062546] mb-3 [font-family:'Outfit',Helvetica]">
                  Excellence
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed [font-family:'Outfit',Helvetica]">
                  We're committed to delivering the highest quality recommendations and service.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <Globe className="w-12 h-12 text-[#1e6f9f] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#062546] mb-3 [font-family:'Outfit',Helvetica]">
                  Sustainability
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed [font-family:'Outfit',Helvetica]">
                  We promote responsible tourism that preserves Algeria's natural beauty.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <Target className="w-12 h-12 text-[#1e6f9f] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#062546] mb-3 [font-family:'Outfit',Helvetica]">
                  Accessibility
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed [font-family:'Outfit',Helvetica]">
                  We make travel planning accessible to everyone, regardless of budget or experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
};
