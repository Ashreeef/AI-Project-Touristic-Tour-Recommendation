import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <img
                src="/AboutUs.jpg"
                alt="About 7wess"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </div>
          </div>

          {/* Right side - Text content */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#062546] mb-6 [font-family:'Outfit',Helvetica]">
                About Us
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed [font-family:'Outfit',Helvetica] mb-6">
                We are six students from ENSIA, passionate about Algeria and technology. 7wess is our project to share the country’s hidden gems and magnificent landscapes with the world.
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
      </div>
    </section>
  );
};
