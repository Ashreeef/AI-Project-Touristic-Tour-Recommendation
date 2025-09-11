import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight,
  Send,
  Heart,
  Check
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Hotels', href: '/hotels' },
  { label: 'About', href: '/about' },
];

const services = [
  { label: 'Trip Planning', href: '/itineraries' },
  { label: 'Hotel Booking', href: '/hotels' },
  { label: 'Local Guides', href: '#guides' },
  { label: 'Travel Insurance', href: '#insurance' },
];

// may do "Explore by City" in future instead of "Our Services"
const destinations = [
  { label: 'Algiers', href: '/destinations?city=algiers' },
  { label: 'Oran', href: '/destinations?city=oran' },
  { label: 'Constantine', href: '/destinations?city=constantine' },
  { label: 'Tlemcen', href: '/destinations?city=tlemcen' },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];


export const Footer: React.FC = () => {
  const location = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      // Navigate to home first, then scroll to section
      if (location.pathname !== '/') {
        window.location.href = `/${href}`;
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show success animation
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 2500);
    
    console.log('Newsletter subscription submitted');
  };

  return (
    <footer id="contact" className="bg-gradient-to-br from-[#062546] via-[#0a3c6b] to-[#1e6f9f] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat" />
      </div>
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-48"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1e6f9f]/10 rounded-full blur-3xl translate-y-48"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 xl:col-span-2 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4 [font-family:'Outfit',Helvetica]">
                7wess
              </h2>
              <p className="text-gray-300 text-base leading-7 mb-6 max-w-md [font-family:'Outfit',Helvetica] font-normal">
                Your ultimate touristic guide for exploring the magnificent landscapes, rich culture, and hidden gems of Algeria. 
                Discover authentic experiences crafted by locals, for travelers who seek more than just destinations.
              </p>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 relative overflow-hidden">
              {/* Success Effect Overlay */}
              <div className={`absolute inset-0 bg-emerald-500/95 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-500 ${
                isSubmitted 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-95 pointer-events-none'
              }`}>
                <div className="text-center transform transition-all duration-700 delay-100">
                  <div className={`bg-white rounded-full p-3 mx-auto mb-3 w-fit transition-all duration-500 ${
                    isSubmitted ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
                  }`}>
                    <Check className="w-6 h-6 text-emerald-500" />
                  </div>
                  <p className={`text-white font-semibold [font-family:'Outfit',Helvetica] transition-all duration-500 delay-200 ${
                    isSubmitted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    Successfully subscribed!
                  </p>
                  <p className={`text-emerald-100 text-sm [font-family:'Outfit',Helvetica] font-normal transition-all duration-500 delay-300 ${
                    isSubmitted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    Thank you for joining us
                  </p>
                </div>
              </div>

              <h4 className="text-lg font-semibold text-white mb-3 [font-family:'Outfit',Helvetica]">
                Stay Updated
              </h4>
              <p className="text-gray-300 text-sm mb-4 [font-family:'Outfit',Helvetica] font-normal">
                Get the latest travel tips and exclusive offers
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-white transition-all duration-300"
                  required
                  disabled={isSubmitted}
                />
                <Button 
                  type="submit"
                  className={`px-4 transition-all duration-300 ${
                    isSubmitted 
                    ? 'bg-emerald-500 scale-110' 
                    : 'bg-[#1e6f9f] hover:bg-[#1557a0] hover:scale-105'
                  }`}
                  disabled={isSubmitted}
                >
                  {isSubmitted ? (
                    <Check className="w-4 h-4 animate-pulse" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white [font-family:'Outfit',Helvetica]">
              Quick Links
            </h3>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center text-gray-300 hover:text-white transition-colors group [font-family:'Outfit',Helvetica] font-normal"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white [font-family:'Outfit',Helvetica]">
              Our Services
            </h3>
            <nav className="space-y-3">
              {services.map((service) => (
                service.href.startsWith('#') ? (
                  <button
                    key={service.href}
                    onClick={() => handleLinkClick(service.href)}
                    className="flex items-center text-gray-300 hover:text-white transition-colors group text-left [font-family:'Outfit',Helvetica] font-normal"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {service.label}
                    </span>
                  </button>
                ) : (
                  <Link
                    key={service.href}
                    to={service.href}
                    className="flex items-center text-gray-300 hover:text-white transition-colors group [font-family:'Outfit',Helvetica] font-normal"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {service.label}
                    </span>
                  </Link>
                )
              ))}
            </nav>
          </div>

          {/* Contact Info & Destinations */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 [font-family:'Outfit',Helvetica]">
                Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 group">
                  <div className="bg-[#1e6f9f]/20 p-2 rounded-lg group-hover:bg-[#1e6f9f]/30 transition-colors">
                    <MapPin className="w-5 h-5 text-[#1e6f9f]" />
                  </div>
                  <div>
                    <p className="text-white font-medium [font-family:'Outfit',Helvetica]">Location</p>
                    <p className="text-gray-300 text-sm [font-family:'Outfit',Helvetica] font-normal">
                      ENSIA, Algiers<br />Algeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 group">
                  <div className="bg-[#1e6f9f]/20 p-2 rounded-lg group-hover:bg-[#1e6f9f]/30 transition-colors">
                    <Mail className="w-5 h-5 text-[#1e6f9f]" />
                  </div>
                  <div>
                    <p className="text-white font-medium [font-family:'Outfit',Helvetica]">Email</p>
                    <p className="text-gray-300 text-sm [font-family:'Outfit',Helvetica] font-normal">
                      info@7wess.com
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Media & Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            {/* Social Links
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm [font-family:'Outfit',Helvetica] font-normal mr-2">
                Follow us:
              </span>
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="bg-white/10 hover:bg-[#1e6f9f]/50 p-3 rounded-full transition-all duration-300 hover:scale-110 group"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div> */}

            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center">
              <div className="flex items-center gap-2 text-gray-400 text-sm [font-family:'Outfit',Helvetica] font-normal">
                <span>© {new Date().getFullYear()} 7wess. Made with</span>
                <Heart className="w-4 h-4 text-red-400 fill-current" />
                <span>in Algeria</span>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
