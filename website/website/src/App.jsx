import React, { useState, useEffect } from 'react';
import { ChevronLeft, Menu, X, Search, Globe, MapPin, Calendar, DollarSign, Star, Facebook, Twitter, Instagram, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
export default function TravelApp() {
  const [navOpen, setNavOpen] = useState(false);
  const [hotelsExpanded, setHotelsExpanded] = useState(false);
  const [toursExpanded, setToursExpanded] = useState(false);
  const [activitiesExpanded, setActivitiesExpanded] = useState(false);

  
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => observer.observe(el));
    
    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="font-sans overflow-x-hidden" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Main Banner */}
      <main id="home" className="relative bg-cover bg-center bg-no-repeat rounded-b-[50px] min-h-[800px]" 
        style={{ backgroundImage: "url('src/Imgs/Logo/algeria.jpg')" }}>
        
        {/* Header */}
        <header className="w-[73%] mx-auto pt-12 mb-40 flex justify-between items-center reveal md:grid md:grid-cols-[1fr_2fr_1fr]">
          <div className="logo">
            <img src="src/Imgs/Logo/logo.svg" alt="2rism" />
          </div>

          <nav className={`navbar ${navOpen ? 'navlistOn' : ''} hidden md:block`}>
            <ul className="flex justify-between items-center text-sm font-light">
              {['Home', 'Hotels', 'Restaurants', 'Tours', 'Destinations', 'Activities', 'Contact'].map((item, index) => (
                <li key={index} className="navlist">
                  <a href={`#${item.toLowerCase()}`} className="text-white opacity-70 hover:opacity-100">{item}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Navigation (Hidden on Desktop) */}
          <nav className={`navbar fixed left-0 right-0 bottom-0 bg-black p-12 rounded-t-[60px] z-30 transform transition-transform duration-300 ${
            navOpen ? 'translate-y-0' : 'translate-y-[200px]'
          } md:hidden`}>
            <ul className="grid grid-cols-3 text-center leading-[4.6] text-white">
              {['Home', 'Hotels', 'Restaurants', 'Tours', 'Destinations', 'Activities', 'Contact'].map((item, index) => (
                <li key={index} className={`navlist ${index === 6 ? 'col-span-3' : ''}`} onClick={() => setNavOpen(false)}>
                  <a href={`#${item.toLowerCase()}`} className="text-white">{item}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="user-profile flex justify-end items-center gap-4">
            {/* User profile placeholder */}
          </div>
        </header>

        {/* Showcase Content */}
        <div className="showcase-content text-center text-white text-2xl md:text-[25px] w-[350px] md:w-auto mx-auto reveal">
        <motion.h1
  className="mb-10 font-bold text-4xl md:text-6xl leading-tight"
  initial={{ 
    opacity: 0,
    y: 20
  }}
  whileInView={{ 
    opacity: 1,
    y: 0
  }}
  viewport={{ once: true }}
  transition={{
    duration: 3,
    ease: [0.5, 0, 0, 1]
  }}
>
  Your Perfect Algeria Itinerary, Powered by AI
</motion.h1>
          <a href="https://earth.google.com/web/" target="_blank" rel="noreferrer" 
            className="inline-flex justify-between items-center gap-4 bg-[#7b61ff] py-4 px-6 rounded-xl text-lg hover:opacity-90">
            <Globe size={24} /> Generate My Itinerary
          </a>
        </div>

        {/* Search Box */}
        <div className="showcase-search w-[90%] md:w-[80%] max-w-[1200px] mx-auto flex flex-col md:flex-row items-center bg-white justify-between p-4 md:p-6 rounded-xl mt-16 md:mt-[150px] shadow-md reveal">
          <div className="filters grid grid-cols-2 md:flex gap-4 md:gap-6">
            {/* Location */}
            <div className="filter flex items-center gap-4">
              <div className="search-icon">
              <img src="src/Imgs/icons/location.png" alt="" className="w-5 h-5" />
              </div>
              <div className="search-text w-full">
                <h4 className="text-sm text-gray-500 mb-1">Location</h4>
                <input type="text" id="startLocation" placeholder="Your location" 
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#7b61ff] focus:outline-none" />
              </div>
            </div>

            {/* Activity */}
            <div className="filter flex items-center gap-4">
              <div className="search-icon">
                <img src="src/Imgs/icons/activities.png" alt="" className="w-5 h-5" />
              </div>
              <div className="search-text w-full">
                <h4 className="text-sm text-gray-500 mb-1">Activity</h4>
                <select id="interests" 
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:border-[#7b61ff] focus:outline-none">
                  <option value="nature">Nature</option>
                  <option value="history">History</option>
                  <option value="beaches">Beaches</option>
                  <option value="culture">Culture</option>
                  <option value="adventure">Adventure</option>
                </select>
              </div>
            </div>

            {/* When */}
            <div className="filter flex items-center gap-4">
              <div className="search-icon">
              <img src="src/Imgs/icons/calendar.png" alt="" className="w-5 h-5" />
              </div>
              <div className="search-text w-full">
                <h4 className="text-sm text-gray-500 mb-1">When</h4>
                <input type="date" id="travelDate" 
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#7b61ff] focus:outline-none" />
              </div>
            </div>

            {/* Budget */}
            <div className="filter flex items-center gap-4">
              <div className="search-icon">
                <img src="src/Imgs/icons/budget.png" alt="" className="w-5 h-5" />
              </div>
              <div className="search-text w-full">
                <h4 className="text-sm text-gray-500 mb-1">Budget</h4>
                <input type="number" id="budget" placeholder="Max budget (DZD)" 
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#7b61ff] focus:outline-none" />
              </div>
            </div>

            {/* Hotel Stars */}
            <div className="filter hidden md:flex items-center gap-4">
              <div className="search-icon">
              <img src="src/Imgs/icons/star.png" alt="" className="w-5 h-5" />
              </div>
              <div className="search-text w-full">
                <h4 className="text-sm text-gray-500 mb-1">Hotel Stars</h4>
                <select id="hotelStars" 
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:border-[#7b61ff] focus:outline-none">
                  {[1, 2, 3, 4, 5].map(star => (
                    <option key={star} value={star}>{star} {star === 1 ? 'Star' : 'Stars'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="search-button-icon bg-[#7b61ff] p-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity w-full md:w-auto mt-4 md:mt-0 flex justify-center">
            <Search className="text-white" size={24} />
          </div>
        </div>
      </main>

      {/* Popular Destinations */}
      <section id="destinations" className="destinations px-4 md:px-0">
        <div className="container max-w-[1378px] mx-auto">
        <motion.h2
  className=" leading-tight section-title text-2xl md:text-[32px] font-bold mt-24 md:mt-48 mb-16 reveal"
  initial={{ 
    opacity: 0,
    y: 20
  }}
  whileInView={{ 
    opacity: 1,
    y: 0
  }}
  viewport={{ once: true }}
  transition={{
    duration: 3,
    ease: [0.5, 0, 0, 1]
  }}
>
Popular Destinations
</motion.h2>
          
          <div className="destinations-cards grid grid-cols-2 md:grid-cols-4 lg:flex gap-2 md:gap-4 reveal">
            {[
              { img: "https://images.unsplash.com/photo-1581790061118-2cd9a40164b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80", name: "Big Sur", location: "California, USA" },
              { img: "https://images.unsplash.com/photo-1527824404775-dce343118ebc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", name: "Prescott", location: "Arizona, USA" },
              { img: "https://images.unsplash.com/photo-1512936702668-1ab037aced2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", name: "Fort Mayers", location: "Florida, USA" },
              { img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1121&q=80", name: "Tucson", location: "Arizona, USA" },
              { img: "https://images.unsplash.com/photo-1601425262040-ba23fe84f701?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", name: "St. Joseph", location: "Michigan, USA" },
              { img: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", name: "Madrid", location: "Spain" },
              { img: "https://images.unsplash.com/photo-1542321993-8fc36217e26d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", name: "Senja Island", location: "Norway" },
              { img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80", name: "Eiffel Tower", location: "Paris, France" },
            ].map((dest, index) => (
              <div key={index} className="destination-card">
                <img src={dest.img} alt={dest.name} className="w-[350px] md:w-[350px] h-[200px] md:h-[200px] object-cover rounded-lg" />
                <h5 className="text-base font-medium mt-2">{dest.name}</h5>
                <h6 className="text-sm font-normal">{dest.location}</h6>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotels And Restaurants */}
      <section id="restaurants" className="hotel-restaurants">
        <div className="container max-w-[1378px] mx-auto">
          <div className="title-container flex items-center justify-between p-4 md:p-0">
            <h2 className="section-title text-2xl md:text-[32px] font-bold mt-24 md:mt-48 mb-16 reveal">Hotels And Restaurants</h2>
            <div className="section-button flex items-center justify-center gap-1 p-2 bg-[#f6f4ff] rounded-xl cursor-pointer text-sm" 
              onClick={() => setHotelsExpanded(!hotelsExpanded)}>
              {hotelsExpanded ? 'less' : 'view all'} <img src="./Imgs/icons/bleft.png" alt="" />
            </div>
          </div>
          
          <div className="hotel-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8 p-4 md:p-0 reveal">
            {[
              { img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", name: "Monastero Santa Rosa Hotel & Spa", location: "Salerno, Italy", rating: 5 },
              { img: "https://images.unsplash.com/photo-1586974726316-c6302de6a160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80", name: "Grand Hotel Tremezzo", location: "Lake Como, Italy", rating: 4 },
              { img: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80", name: "The Oberoi Udaivilas, Udaipur", location: "Udaipur, India", rating: 2 },
              { img: "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", name: "AKA Beverly Hills", location: "Los Angeles, United States", rating: 5 },
              { img: "https://images.unsplash.com/photo-1549294413-26f195200c16?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80", name: "Majestic Elegance", location: "Dominican Republic", rating: 4, hidden: true },
              { img: "https://images.unsplash.com/photo-1586495985096-787fb4a54ac0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80", name: "Dreams Watervilla", location: "Meeru Island, Maldives", rating: 5, hidden: true },
              { img: "https://images.unsplash.com/photo-1594741158704-5a784b8e59fb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", name: "Waldorf Astoria", location: "Rome, Italy", rating: 3, hidden: true },
              { img: "https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80", name: "Gilli Air", location: "Indonesia", rating: 4, hidden: true },
            ].map((hotel, index) => (
              <div key={index} className={`hotel-cards relative ${hotel.hidden && !hotelsExpanded ? 'hidden' : 'block'}`}>
                <img src={hotel.img} alt={hotel.name} className="w-full h-[250px] md:h-[380px] object-cover rounded-xl" />
                <h5 className="text-base font-medium mt-2">{hotel.name}</h5>
                <h6 className="flex items-center gap-2 text-sm font-normal mt-2">
                  <img src="src/Imgs/icons/map-pin-line.png" alt="" className="w-4 h-4" /> {hotel.location}
                </h6>
                <div className="ratings absolute bottom-1 right-0">
                  <img src={`src/Imgs/icons/rating=${hotel.rating}.png`} alt={`${hotel.rating} stars`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Tips and Advice */}
<section id="tours" className="py-16 bg-white">
  <div className="container max-w-6xl mx-auto px-4">
    <div className="flex justify-between items-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Travel Tips and Advice</h2>
      <button 
        onClick={() => setToursExpanded(!toursExpanded)}
        className="flex items-center gap-1 text-[#7b61ff] hover:text-[#6a50ee] transition-colors"
      >
        {toursExpanded ? 'Show less' : 'View all'}
        <ArrowRight className={`w-4 h-4 ${toursExpanded ? 'rotate-90' : ''}`} />
      </button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[
        {
          img: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80", // Update this path
          title: "East Village Ice Cream Crawl",
          desc: "We will stop at five different world-class ice cream shops on this 1.5 mile 1.5 hour tour. At each ice cream store we'll explore the story behind the business and see what makes the ice cream unique as you savor every bite.",
          date: "Today",
          author: "Avenger Initiative",
          comments: 2
        },
        {
          img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80", // Update this path
          title: "Brooklyn Bridge Cinematic Photo Walk",
          desc: "This experience takes place at the Brooklyn Bridge Park and Brooklyn Bridge, but I'm always open to capture clients at different locations upon request for an additional charge.",
          date: "Today",
          author: "Ager Pagla",
          comments: 12
        },
        
      ].map((tour, index) => (
        <div 
          key={index} 
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative h-48 md:h-56">
            <img 
              src={tour.img} 
              alt={tour.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
          
          <div className="p-6">
          <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900"> 
              {tour.title}
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {tour.desc}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                <img src="src/Imgs/icons/calendar.png" alt="Author" className="w-4 h-4 mr-1" />
                  {tour.date}
                </span>
                <span className="flex items-center">
                  <img src="src/Imgs/icons/user.png" alt="Author" className="w-4 h-4 mr-1" />
                  {tour.author}
                </span>
              </div>
              <span className="flex items-center">
                <img src="src/Imgs/icons/message.png" alt="Comments" className="w-4 h-4 mr-1" />
                {tour.comments} comments
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
      {/* Activities */}
      <section id="activities">
        <div className="container max-w-[1378px] mx-auto">
          <div className="title-container flex items-center justify-between p-4 md:p-0">
            <h2 className="section-title text-2xl md:text-[32px] font-bold mt-24 md:mt-48 mb-16 reveal">Activities</h2>
            <div className="section-button flex items-center justify-center gap-1 p-2 bg-[#f6f4ff] rounded-xl cursor-pointer text-sm"
              onClick={() => setActivitiesExpanded(!activitiesExpanded)}>
              {activitiesExpanded ? 'less' : 'view all'} <img src="./Imgs/icons/bleft.png" alt="" />
            </div>
          </div>
          
          <div className="activities-cards grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 p-4 md:p-0 reveal">
            {[
              { img: "https://images.unsplash.com/photo-1513432800008-a900568fccfe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", name: "Sailing" },
              { img: "https://images.unsplash.com/photo-1489805549589-3c5ae55fe740?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80", name: "Climbing" },
              { img: "https://images.unsplash.com/photo-1565992441121-4367c2967103?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80", name: "Skiing" },
              { img: "https://images.unsplash.com/19/nomad.JPG?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1098&q=80", name: "Hiking" },
            ].map((activity, index) => (
              <div key={index} className="activities-card">
                <img src={activity.img} alt={activity.name} className="w-full h-[250px] md:h-[380px] object-cover rounded-xl" />
                <h4 className="text-base md:text-lg font-medium mt-2">{activity.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="About" className="flex flex-col md:flex-row justify-center items-center gap-12 mt-24 md:mt-32 relative px-4 md:px-0">
        <div className="about-content z-10 backdrop-blur-md bg-white/30 p-6 rounded-lg reveal">
          <h2 className="text-2xl md:text-[32px] font-bold">About US</h2>
          <p className="mt-6 text-base md:text-lg max-w-[556px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a sapien justo. Nulla facilisis tristique imperdiet. Nullam a placerat odio. Sed in ex augue. Aliquam porta consectetur lorem sit amet ultrices. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
          </p>
          <div className="section-button flex items-center justify-center gap-1 p-2 bg-[#f6f4ff] rounded-xl cursor-pointer text-sm mt-6 w-[130px]">
            Read More <img src="src/Imgs/icons/bleft.png" alt="" />
          </div>
        </div>

        <div className="about-img md:static absolute right-0 opacity-30 md:opacity-100 reveal">
          <img src="src/Imgs/about img.png" alt="" className="w-[200px] md:w-[556px] h-auto md:h-[488px] rounded-xl" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f9f9f9] pt-16 pb-16 mt-24">
        <div className="container max-w-[1378px] mx-auto">
          <div className="footer-sections grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 p-4 md:p-0">
            <div className="footer-section">
              <img src="src/Imgs/Logo/logoblack.svg" alt="2rism" />
              <p className="text-sm leading-relaxed my-4 text-gray-600 max-w-[354px]">
                We always make our customers happy by providing as many choices as possible
              </p>
              <div className="footer-social-icons flex gap-6">
                <Facebook className="text-gray-600" size={24} />
                <Twitter className="text-gray-600" size={24} />
                <Instagram className="text-gray-600" size={24} />
              </div>
            </div>

            <div className="footer-section">
              <h3 className="text-lg font-medium">About</h3>
              <ul className="mt-4 space-y-2">
                {['About Us', 'Features', 'News', 'Menu'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-800">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="text-lg font-medium">Company</h3>
              <ul className="mt-4 space-y-2">
                {['Why 2rism', 'Partner with us', 'FAQ', 'Blog'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-800">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="text-lg font-medium">Support</h3>
              <ul className="mt-4 space-y-2">
                {['Account', 'Support Center', 'Feedback', 'Contact Us'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-800">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="text-lg font-medium">Contact</h3>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2">
                  <Mail className="text-gray-600" size={18} />
                  <span className="text-sm text-gray-600">contact@2rism.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <img src="src/Imgs/icons/phone.png" alt="Phone" className="w-4 h-4" />
                  <span className="text-sm text-gray-600">+213 123 456 789</span>
                </li>
                <li className="flex items-center gap-2">
                  <img src="src/Imgs/icons/location.png" alt="Location" className="w-4 h-4" />
                  <span className="text-sm text-gray-600">Algiers, Algeria</span>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="text-lg font-medium">Newsletter</h3>
              <p className="text-sm text-gray-600 mt-4 mb-2">Subscribe to our newsletter</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="p-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:border-[#7b61ff] flex-grow"
                />
                <button className="bg-[#7b61ff] text-white p-2 rounded-r-lg hover:bg-[#6a50ee] transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center px-4 md:px-0">
            <p className="text-sm text-gray-600">© 2023 2rism. All rights reserved</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-800">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-800">Terms of Service</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-800">Cookies Settings</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Toggle */}
      <button 
        className="fixed bottom-6 right-6 bg-[#7b61ff] p-3 rounded-full shadow-lg z-40 md:hidden"
        onClick={() => setNavOpen(!navOpen)}
      >
        {navOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <Menu className="text-white" size={24} />
        )}
      </button>
    </div>
  );
}

