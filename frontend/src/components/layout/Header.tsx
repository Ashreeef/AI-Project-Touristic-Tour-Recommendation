import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Hotels', href: '/hotels' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '#contact' },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Determine if we're on homepage or other pages
  const isHomepage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith('#')) {
      return false; // Anchor links are never "active" in the traditional sense
    }
    return location.pathname === href;
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      // For contact section, scroll to footer on current page
      if (href === '#contact') {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // For other sections, navigate to home first, then scroll to section
        if (location.pathname !== '/') {
          window.location.href = `/${href}`;
        } else {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHomepage 
          ? (isScrolled ? 'bg-[#1e6f9f]/95 backdrop-blur-md shadow-xl' : 'bg-transparent')
          : 'bg-[#1e6f9f] shadow-lg'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="7WESS Logo" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Centered Desktop Navigation */}
          <div className="flex-1 flex justify-center">
            <nav className="hidden lg:flex items-center space-x-10">
              {navigationItems.map((item) => (
                item.href.startsWith('#') ? (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={`relative font-semibold text-lg transition-all duration-300 hover:text-white [font-family:'Outfit',Helvetica] ${
                      isHomepage ? (isScrolled ? 'text-white' : 'text-white/90') : 'text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`relative font-semibold text-lg transition-all duration-300 hover:text-white [font-family:'Outfit',Helvetica] ${
                      isActive(item.href)
                        ? 'text-white'
                        : isHomepage 
                          ? (isScrolled ? 'text-white/90' : 'text-white/90')
                          : 'text-white/90'
                    }`}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <span className="absolute -bottom-2 left-0 right-0 h-1 bg-white rounded-full" />
                    )}
                  </Link>
                )
              ))}
            </nav>
          </div>

        

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isHomepage 
                ? (isScrolled ? 'text-white hover:bg-white/20' : 'text-white hover:bg-white/10')
                : 'text-white hover:bg-white/20'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Panel */}
            <div className="absolute left-0 right-0 top-20 bg-[#1e6f9f] shadow-2xl border-t border-white/10 rounded-b-2xl mx-4">
              <nav className="px-6 py-8 space-y-6">
              {navigationItems.map((item) => (
                item.href.startsWith('#') ? (
                  <button
                    key={item.href}
                    onClick={() => {
                      handleNavClick(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-3 px-4 font-semibold text-lg transition-all duration-300 text-white hover:text-white/80 hover:bg-white/10 rounded-xl [font-family:'Outfit',Helvetica]"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-left py-3 px-4 font-semibold text-lg transition-all duration-300 rounded-xl [font-family:'Outfit',Helvetica] ${
                      isActive(item.href)
                        ? 'text-white bg-white/20'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
