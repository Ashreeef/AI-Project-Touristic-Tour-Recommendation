import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Hotels', href: '/hotels' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact', href: '#contact' },
];


export const Footer: React.FC = () => {
  const location = useLocation();

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

  return (
    <footer id="contact" className="bg-[#062546] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <p className="text-gray-300 text-base leading-6 mb-6 max-w-md mt-9">
              7wess — Your ultimate touristic guide for exploring the magnificent landscapes, rich culture, and hidden gems of Algeria.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-xl mb-6">Quick Links</h3>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                link.href.startsWith('#') ? (
                  <button
                    key={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className="block text-gray-300 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-xl mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-[#1e6f9f]" />
                <span className="text-gray-300">Algiers, Algeria</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2024 7wess. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
