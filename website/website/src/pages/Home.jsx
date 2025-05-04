import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Menu, 
  X, 
  Search, 
  Globe, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  Clock,
  Activity,
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  ArrowRight,
  Car,
  AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
const images = {
  logo: 'src/Imgs/Logo/LogoPNG.png',
  algeria: 'src/Imgs/Logo/algeria.jpg',
  locationIcon: 'src/Imgs/icons/location.png',
  activitiesIcon: 'src/Imgs/icons/activities.png',
  calendarIcon: 'src/Imgs/icons/calendar.png',
  budgetIcon: 'src/Imgs/icons/budget.png',
  starIcon: 'src/Imgs/icons/star.png',
  userIcon: 'src/Imgs/icons/user.png',
  messageIcon: 'src/Imgs/icons/message.png',
  aboutImg: 'src/Imgs/about img.png',
  kk: 'src/Imgs/Logo/logoblack.svg',
  phoneIcon: 'src/Imgs/icons/phone.png',
  hourIcon: 'src/Imgs/icons/clock.png',
  bleftIcon: 'src/Imgs/icons/arrow-right.png'
};
const ALGERIAN_WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
  "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda",
  "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem",
  "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj",
  "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
  "Ghardaïa", "Relizane"
];

const WilayaInput = ({ formData, formErrors, onInputChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const handleWilayaInput = (e) => {
    const value = e.target.value;
    
    // First update the input value through the parent's handler
    onInputChange(e);
    
    // Then handle suggestions
    if (value.length > 0) {
      const filtered = ALGERIAN_WILAYAS.filter(wilaya =>
        wilaya.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
      setActiveSuggestion(0); // Reset active suggestion when typing
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (wilaya) => {
    // Update the input value through the parent's handler
    onInputChange({
      target: {
        name: "wilaya",
        value: wilaya
      }
    });
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev > 0 ? prev - 1 : 0
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (suggestions.length > 0) {
          onInputChange({
            target: {
              name: "wilaya",
              value: suggestions[activeSuggestion]
            }
          });
          setShowSuggestions(false);
        }
      }
    }
  };

  return (
    <div className="filter space-y-2 relative">
      <div className="flex items-center gap-2">
      <img src={images.locationIcon} alt="Location icon" className="w-5 h-5" />
        <h4 className="text-sm font-medium text-gray-700">Wilaya</h4>
      </div>
      <input 
        type="text" 
        name="wilaya"
        value={formData.wilaya}  
        onChange={handleWilayaInput}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onFocus={() => formData.wilaya.length > 0 && setShowSuggestions(true)}
        placeholder="Your wilaya" 
        className={`w-full p-3 border ${
          formErrors.wilaya ? 'border-red-500' : 'border-gray-200'
        } rounded-lg text-sm focus:border-[#7b61ff] focus:outline-none focus:ring-1 focus:ring-[#7b61ff] transition-all`}
        autoComplete="off"
      />
      {formErrors.wilaya && (
        <p className="text-red-500 text-xs mt-1">{formErrors.wilaya}</p>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((wilaya, index) => (
            <li
              key={wilaya}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                index === activeSuggestion ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleSuggestionClick(wilaya)}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
            >
              {wilaya}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Home = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [hotelsExpanded, setHotelsExpanded] = useState(false);
  const [toursExpanded, setToursExpanded] = useState(false);
  const [activitiesExpanded, setActivitiesExpanded] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [hasCar, setHasCar] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    wilaya: '',
    location: '',
    when: '',
    budget: '',
    minHotelStars: '3',
    maxHotelStars: '5',
    maxAttractions: '2',
    maxTravelHours: '4'
  });

  // Animation variants
  const titleVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.5, 0, 0, 1],
        delay: 0.1
      }
    }
  };

  const isValidGPS = (input) => {
    const trimmedInput = input.trim();
    const patterns = [
      // Decimal degrees (DD) format: e.g., 36.7538, 3.0588
      /^-?\d{1,3}(?:\.\d+)?,\s*-?\d{1,3}(?:\.\d+)?$/,
      
      // Degrees, minutes, seconds (DMS) format: e.g., 36°45'13.7"N 3°03'31.7"E
      /^\d{1,3}°\d{1,2}'\d{1,2}(?:\.\d+)?"[NS]\s*\d{1,3}°\d{1,2}'\d{1,2}(?:\.\d+)?"[EW]$/i,
      
      // Degrees and decimal minutes (DMM) format: e.g., 36 45.2283, 3 3.5283
      /^\d{1,3}\s\d{1,2}\.\d+,\s*\d{1,3}\s\d{1,2}\.\d+$/
    ];
  
    // Check if input matches any of the patterns
    return patterns.some(pattern => pattern.test(input.trim()));
  };

  const imageVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.5, 0, 0, 1],
        delay: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.5, 0, 0, 1]
      }
    })
  };

  const toggleActivity = (activity) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity) 
        : [...prev, activity]
    );
  };

  const activities = [
    "Nature", "Historical", "Religious", "Garden", 
    "Museums", "Cultural", "Beaches", "Amusement Park", 
    "Shopping Mall", "Lake", "Resort"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

     const trimmedWilaya = formData.wilaya.trim();
  if (!trimmedWilaya) {
    errors.wilaya = 'Wilaya is required';
    isValid = false;
  } else if (!ALGERIAN_WILAYAS.includes(trimmedWilaya)) {
    errors.wilaya = 'Please select a valid Algerian wilaya from the list';
    isValid = false;
  }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
      isValid = false;
    } else if (!isValidGPS(formData.location)) {
      errors.location = 'Please enter valid GPS coordinates (e.g., 36.7538, 3.0588 or 36°45\'13.7"N 3°03\'31.7"E)';
      isValid = false;
    }

    if (!formData.when) {
      errors.when = 'Date is required';
      isValid = false;
    }

    if (selectedActivities.length === 0) {
      errors.activities = 'At least one activity is required';
      isValid = false;
    }

    // Budget validation
    if (!formData.budget) {
      errors.budget = 'Budget is required';
      isValid = false;
    } else if (isNaN(formData.budget)) {
      errors.budget = 'Budget must be a number';
      isValid = false;
    } else if (Number(formData.budget) <= 0) {
      errors.budget = 'Budget must be greater than 0';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Form is valid, proceed with submission
      console.log('Form submitted:', { ...formData, activities: selectedActivities, hasCar });
      // You can navigate to the result page here or perform other actions
    }
  };

  const isFormValid = () => {
    return (
      formData.wilaya.trim() && 
      formData.location.trim() && 
      isValidGPS(formData.location) && 
      formData.when && 
      selectedActivities.length > 0 && 
      formData.budget && 
      !isNaN(formData.budget) && 
      Number(formData.budget) > 0
    );
  };

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
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581790061118-2cd9a40164b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80')" }}>
        
        {/* Header */}
        <header className="w-[73%] mx-auto pt-4 mb-40 flex justify-between items-center reveal md:grid md:grid-cols-[1fr_2fr_1fr]">
          <div className="logo w-[60%]">
            <img src={images.logo} alt="2rism" />
          </div>

          <nav className={`navbar ${navOpen ? 'navlistOn' : ''} hidden md:block`}>
            <ul className="flex justify-between items-center text-sm font-light">
              {[ 'Hotels', 'Restaurants', 'Tours', 'Destinations', 'Activities', 'Contact'].map((item, index) => (
                <li key={index} className="navlist">
                  <a href={`#${item.toLowerCase()}`} className="text-white opacity-70 hover:opacity-100">{item}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Navigation */}
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
          <motion.h2
            className="mb-10 font-bold text-4xl md:text-6xl leading-tight"
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-20% 0px -20% 0px" }}
            variants={titleVariants}
          >
            Your Perfect Algeria Itinerary, Powered by AI
          </motion.h2>
          <Link 
            to={isFormValid() ? "/result" : "#"} 
            onClick={(e) => !isFormValid() && e.preventDefault()}
            className={`inline-flex justify-between items-center gap-4 py-4 px-6 rounded-xl text-lg ${
              isFormValid() 
                ? 'bg-[#7b61ff] hover:opacity-90' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <Globe size={24} /> Generate My Itinerary
          </Link>
          {!isFormValid() && (
            <div className="mt-4 text-sm text-red-200 flex items-center justify-center gap-2">
              <AlertCircle size={16} />
              Please fill all required fields correctly
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="showcase-search w-[90%] md:w-[80%] max-w-[1200px] mx-auto bg-white p-5 md:p-8 rounded-2xl mt-16 md:mt-[150px] shadow-lg reveal border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Wilaya Input */}
<WilayaInput 
  formData={formData}
  formErrors={formErrors}
  onInputChange={handleInputChange}
/>

            {/* Location */}
            <div className="filter space-y-2">
  <div className="flex items-center gap-2">
    <img src={images.locationIcon} alt="" className="w-5 h-5" />
    <h4 className="text-sm font-medium text-gray-700">Location</h4>
  </div>
  <input 
    type="text" 
    name="location"
    value={formData.location}
    onChange={handleInputChange}
    placeholder="GPS coordinates (e.g., 36.7538, 3.0588)" 
    className={`w-full p-3 border ${
      formErrors.location ? 'border-red-500' : 'border-gray-200'
    } rounded-lg text-sm focus:border-[#7b61ff] focus:outline-none focus:ring-1 focus:ring-[#7b61ff] transition-all`}
  />
  {formErrors.location && (
    <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>
  )}
</div>
            
            {/* when */}
            <div className="filter space-y-2">
              <div className="flex items-center gap-2">
                <img src={images.calendarIcon} alt="" className="w-5 h-5" />
                <h4 className="text-sm font-medium text-gray-700">When*</h4>
              </div>
              <input 
                type="date" 
                name="when"
                value={formData.when}
                onChange={handleInputChange}
                className={`w-full p-3 border ${
                  formErrors.when ? 'border-red-500' : 'border-gray-200'
                } rounded-lg text-sm focus:border-[#7b61ff] focus:outline-none focus:ring-1 focus:ring-[#7b61ff] transition-all`}
              />
              {formErrors.when && (
                <p className="text-red-500 text-xs mt-1">{formErrors.when}</p>
              )}
            </div>

            <div className="filter space-y-2">
              <div className="flex items-center gap-2">
                <img src={images.activitiesIcon} alt="" className="w-5 h-5" />
                <h4 className="text-sm font-medium text-gray-700">Activity*</h4>
              </div>

              {/* Custom dropdown container */}
              <div className="relative">
                {/* Input box showing selected tags */}
                <div 
                  className={`w-full p-3 border ${
                    formErrors.activities ? 'border-red-500' : 'border-gray-200'
                  } rounded-lg text-sm cursor-pointer flex flex-wrap gap-2 min-h-[44px]`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedActivities.length === 0 ? (
                    <span className="text-gray-400">Select activities...</span>
                  ) : (
                    selectedActivities.map(activity => (
                      <div key={activity} className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-xs">
                        {activity}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleActivity(activity);
                          }}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
                {formErrors.activities && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.activities}</p>
                )}

                {/* Dropdown with checkboxes */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                    {activities.map((activity) => (
                      <label key={activity} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedActivities.includes(activity)}
                          onChange={() => toggleActivity(activity)}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {activity}
                          {activity === 'History' && <span className="ml-1 text-gray-400">(selected)</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Budget */}
            <div className="filter space-y-2">
              <div className="flex items-center gap-2">
                <img src={images.budgetIcon} alt="" className="w-5 h-5" />
                <h4 className="text-sm font-medium text-gray-700">Budget (DZD)*</h4>
              </div>
              <input 
                type="number" 
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="Max budget (DZD)" 
                min="1"
                className={`w-full p-3 border ${
                  formErrors.budget ? 'border-red-500' : 'border-gray-200'
                } rounded-lg text-sm focus:border-[#7b61ff] focus:outline-none focus:ring-1 focus:ring-[#7b61ff] transition-all`}
              />
              {formErrors.budget && (
                <p className="text-red-500 text-xs mt-1">{formErrors.budget}</p>
              )}
            </div>

            {/* Min Hotel Stars */}
<div className="filter space-y-2">
  <div className="flex items-center gap-2">
    <img src={images.starIcon} alt="" className="w-5 h-5" />
    <h4 className="text-sm font-medium text-gray-700">Min Hotel Stars</h4>
  </div>
  <select 
    name="minHotelStars"
    value={formData.minHotelStars}
    onChange={handleInputChange}
    className="w-full p-3 border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:border-[#7b61ff] focus:outline-none focus:ring-1 focus:ring-[#7b61ff] bg-white transition-all"
  >
    {[1, 2, 3, 4, 5].map(star => (
      <option key={`min-${star}`} value={star}>
        {star} {star === 1 ? 'Star' : 'Stars'}
      </option>
    ))}
  </select>
</div>

{/* Max Hotel Stars */}
<div className="filter space-y-2">
  <div className="flex items-center gap-2">
    <img src={images.starIcon} alt="" className="w-5 h-5" />
    <h4 className="text-sm font-medium text-gray-700">Max Hotel Stars</h4>
  </div>
  <select 
    name="maxHotelStars"
    value={formData.maxHotelStars}
    onChange={handleInputChange}
    className="w-full p-3 border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:border-[#7b61ff] focus:outline-none focus:ring-1 focus:ring-[#7b61ff] bg-white transition-all"
  >
    {[1, 2, 3, 4, 5].map(star => (
      <option key={`max-${star}`} value={star}>
        {star} {star === 1 ? 'Star' : 'Stars'}
      </option>
    ))}
  </select>
</div>

            <div className="filter space-y-2">
              <div className="flex items-center gap-2">
                <img src={images.activitiesIcon} alt="" className="w-5 h-5" />
                <h4 className="text-sm font-medium text-gray-700">Max attractions per day</h4>
              </div>
              <select 
                name="maxAttractions"
                value={formData.maxAttractions}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:border-[#7b61ff] focus:outline-none focus:ring-1 focus:ring-[#7b61ff] bg-white transition-all"
              >
                {[1, 2, 3].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'attraction' : 'attractions'}</option>
                ))}
              </select>
            </div>

            <div className="filter space-y-2">
              <div className="flex items-center gap-2">
                <img src={images.hourIcon} alt="" className="w-5 h-5" />
                <h4 className="text-sm font-medium text-gray-700">Max travel hours per day</h4>
              </div>
              <select 
                name="maxTravelHours"
                value={formData.maxTravelHours}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:border-[#7b61ff] focus:outline-none focus:ring-1 focus:ring-[#7b61ff] bg-white transition-all"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(hour => (
                  <option key={hour} value={hour}>{hour} {hour === 1 ? 'hour' : 'hours'}</option>
                ))}
              </select>
            </div>
            
            {/* Car Ownership Toggle */}
            <div className="filter space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#ffc457] to-[#e2bf23] flex items-center justify-center">
                  <Car size={14} className="text-white" />
                </div>
                <h4 className="text-sm font-medium text-gray-700">Car Ownership</h4>
              </div>
              <div className="w-full p-3 border border-gray-200 rounded-lg text-sm focus-within:border-[#7b61ff] focus-within:outline-none focus-within:ring-1 focus-within:ring-[#7b61ff] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Do you have a car?</span>
                  <div className="relative inline-block w-16">
                    <input 
                      type="checkbox" 
                      id="car-toggle"
                      className="sr-only"
                      checked={hasCar}
                      onChange={() => setHasCar(!hasCar)}
                    />
                    <label 
                      htmlFor="car-toggle"
                      className={`block h-7 rounded-full transition-colors duration-200 ${
                        hasCar ? 'bg-[#ffc457]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                          hasCar ? 'translate-x-9' : 'translate-x-0'
                        }`}
                      />
                    </label>
                    <span
                      className={`absolute top-1.5 text-xs font-medium transition-all duration-200 ${
                        hasCar ? 'left-2 text-white' : 'right-2 text-gray-600'
                      }`}
                    >
                      {hasCar ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Popular Destinations */}
<section id="destinations" className="destinations mx-4 md:px-0">
  <div className="container max-w-[1378px] mx-auto">
    <motion.h2
      className="leading-tight section-title text-2xl md:text-[32px] font-bold mt-24 md:mt-48 mb-16 reveal"
      initial="hidden"
      whileInView="visible"
      viewport={{ margin: "-20% 0px -20% 0px" }}
      variants={titleVariants}
    >
      Popular Destinations
    </motion.h2>
    
    <div className="destinations-cards grid grid-cols-2 md:grid-cols-4 lg:flex gap-2 md:gap-4 reveal">
      {[
        { 
          img: "https://images.unsplash.com/photo-1581790061118-2cd9a40164b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80", 
          name: "Tichy Beach", 
          location: "Béjaïa, east algeria",
          description: "Experience breathtaking coastal views and majestic redwood forests.",
          
        },
        { 
          img: "https://images.unsplash.com/photo-1527824404775-dce343118ebc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", 
          name:"Tassili n'Ajjer", 
          location: "Djanet, south algeria",
          description: "Discover the charm of this historic mountain town with its perfect blend of outdoor adventure and cultural attractions.",
          
        },
        { 
          img: "https://images.unsplash.com/photo-1512936702668-1ab037aced2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", 
          name: "Barbadjani Beach", 
          location: "Tlemcen, west algeria",
          description: "Enjoy sunny beaches, world-class fishing, and vibrant downtown in this amazing town.",
          
        },
        { 
          img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1121&q=80", 
          name: "M'Zab Valley", 
          location: "Ghardaïa, algeria",
          description: "Explore the Algerian Desert's beauty with stunning sunsets, hiking trails, and rich cultural heritage.",
         
        },
      ].map((dest, index) => (
        <motion.div 
          key={index}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
          variants={imageVariants}
          custom={index}
          className="destination-card relative group"
        >
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src={dest.img} 
              alt={dest.name} 
              className="w-[350px] md:w-[350px] h-[200px] md:h-[200px] object-cover rounded-lg transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end p-4">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <h5 className="text-base font-medium text-white">{dest.name}</h5>
                <h6 className="text-sm font-normal text-white">{dest.location}</h6>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4">
              <div className=" p-6 rounded-lg max-w-[90%]">
                <p className="text-sm text-white mb-2">{dest.description}</p>
                
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* Hotels And Restaurants */}
      <section id="restaurants" className="hotel-restaurants mx-4">
        <div className="container max-w-[1378px] mx-auto">
          <div className="title-container flex items-center justify-between p-4 md:p-0">
            <motion.h2
              className="leading-tight section-title text-2xl md:text-[32px] font-bold mt-24 md:mt-48 mb-16 reveal"
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: "-20% 0px -20% 0px" }}
              variants={titleVariants}
            >
              Hotels and Restaurants
            </motion.h2>
            <div className="section-button flex items-center justify-center gap-1 p-2 bg-[#f6f4ff] rounded-xl cursor-pointer text-sm" 
              onClick={() => setHotelsExpanded(!hotelsExpanded)}>
              {hotelsExpanded ? 'less' : 'view all'} <ArrowRight size={16} />
            </div>
          </div>
          
          <div className="hotel-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 p-4 md:p-0 reveal">
            {[
              { 
                img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", 
                name: "Monastero Santa Rosa", 
                location: "Salerno, Italy", 
                rating: 5,
                price: "DZD 183,967",
                type: "Deluxe Room"
              },
              { img: "https://images.unsplash.com/photo-1586974726316-c6302de6a160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80",
                name: "Grand Hotel Tremezzo",
                location: "Lake Como, Italy",
                rating: 4,
                price: "DZD 183,967",
                type: "Deluxe Room" },
              { img: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80",
                name: "The Oberoi Udaivilas, Udaipur",
                location: "Udaipur, India",
                rating: 2,
                price: "DZD 183,967",
                type: "Deluxe Room" },
                { img: "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                  name: "AKA Beverly Hills",
                  location: "Los Angeles, United States",
                  rating: 5,
                  price: "DZD 183,967",
                  type: "Deluxe Room" },
                { img: "https://images.unsplash.com/photo-1549294413-26f195200c16?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80",
                  name: "Majestic Elegance",
                  location: "Dominican Republic",
                  rating: 4,
                  hidden: true,
                  price: "DZD 183,967",
                  type: "Deluxe Room" },
                { img: "https://images.unsplash.com/photo-1586495985096-787fb4a54ac0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80", name: "Dreams Watervilla", location: "Meeru Island, Maldives", rating: 5, hidden: true },
                { img: "https://images.unsplash.com/photo-1594741158704-5a784b8e59fb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", name: "Waldorf Astoria", location: "Rome, Italy", rating: 3, hidden: true },
                { img: "https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80", name: "Gilli Air", location: "Indonesia", rating: 4, hidden: true },
            ].map((hotel, index) => (
              <motion.div 
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
                variants={cardVariants}
                custom={index}
                className={`hotel-cards relative group overflow-hidden rounded-xl shadow-md transition-all duration-300 ${hotel.hidden && !hotelsExpanded ? 'hidden' : 'block'}`}
              >
                {/* Hotel Image */}
                <img 
                  src={hotel.img} 
                  alt={hotel.name} 
                  className="w-full h-[250px] md:h-[300px] object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                
                {/* Default View (Before Hover) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-4">
                  <h5 className="text-white text-lg font-semibold">{hotel.name}</h5>
                  <h6 className="flex items-center gap-2 text-white text-sm">
                    <MapPin size={16} /> {hotel.location}
                  </h6>
                  <div className="flex mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < hotel.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center text-white">
                  <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin size={16} />
                    <span>{hotel.location}</span>
                  </div>
                  
                  <div className="text-sm mb-4">
                    <p className="font-medium">{hotel.type} for {hotel.price}</p>
                  </div>
                  
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Tips and Advice */}
      <section id="tours" className="py-2 bg-white">
        <div className="container max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <motion.h2
              className="leading-tight section-title text-2xl md:text-[32px] font-bold mt-24 md:mt-48 mb-16 reveal"
              initial="hidden"
              whileInView="visible"
              viewport={{ margin: "-20% 0px -20% 0px" }}
              variants={titleVariants}
            >
              Travel Tips and Advice
            </motion.h2>
            
          </div>
          
          {/* Horizontal Scrolling Container */}
          <div className="relative">
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <div className="flex space-x-8">
                {[
                  {
                    img: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                    title: "East Village Ice Cream Crawl",
                    desc: "We will stop at five different world-class ice cream shops on this 1.5 mile 1.5 hour tour.",
                    date: "Today",
                    author: "Avenger Initiative",
                    comments: 2
                  },
                  {
                    img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                    title: "Brooklyn Bridge Cinematic Photo Walk",
                    desc: "This experience takes place at the Brooklyn Bridge Park and Brooklyn Bridge.",
                    date: "Today",
                    author: "Ager Pagla",
                    comments: 12
                  },
                  {
                    img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                    title: "Brooklyn Bridge Cinematic Photo Walk",
                    desc: "This experience takes place at the Brooklyn Bridge Park and Brooklyn Bridge.",
                    date: "Today",
                    author: "Ager Pagla",
                    comments: 12
                  },
                ].map((tour, index) => (
                  <motion.div 
                    key={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
                    variants={cardVariants}
                    custom={index}
                    className="flex-shrink-0 w-[300px] md:w-[350px] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
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
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{tour.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                        {tour.desc}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Calendar size={16} className="mr-1" />
                            {tour.date}
                          </span>
                          <span className="flex items-center">
                            <img src={images.userIcon} alt="Author" className="w-4 h-4 mr-1" />
                            {tour.author}
                          </span>
                        </div>
                        <span className="flex items-center">
                          <img src={images.messageIcon} alt="Comments" className="w-4 h-4 mr-1" />
                          {tour.comments} comments
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Activities with Hover Effects */}
<section id="activities" className=' mx-4'>
  <div className="container max-w-[1378px] mx-auto">
    <div className="title-container flex items-center justify-between p-4 md:p-0">
      <motion.h2
        className="leading-tight section-title text-2xl md:text-[32px] font-bold mt-24 md:mt-48 mb-16 reveal"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-20% 0px -20% 0px" }}
        transition={{ duration: 0.8, ease: [0.5, 0, 0, 1], delay: 0.1 }}
      >
        Activities
      </motion.h2>

    </div>
    
    <div className="activities-cards grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-4 md:p-0 reveal">
      {[
        { 
          img: "https://images.unsplash.com/photo-1513432800008-a900568fccfe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", 
          name: "Sailing",
          description: "Experience the thrill of sailing through crystal clear waters with our expert guides.",
          duration: "Half-day",
          price: "From DZD 12,500",
          difficulty: "Beginner-friendly"
        },
        { 
          img: "https://images.unsplash.com/photo-1489805549589-3c5ae55fe740?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80", 
          name: "Climbing",
          description: "Scale breathtaking cliffs with professional instructors and top-notch equipment.",
          duration: "Full-day",
          price: "From DZD 18,000",
          difficulty: "Intermediate"
        },
        { 
          img: "https://images.unsplash.com/photo-1565992441121-4367c2967103?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80", 
          name: "Skiing",
          description: "Enjoy pristine slopes with equipment rental and lessons included in the package.",
          duration: "Full-day",
          price: "From DZD 22,000",
          difficulty: "All levels"
        },
        { 
          img: "https://images.unsplash.com/19/nomad.JPG?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1098&q=80", 
          name: "Hiking",
          description: "Discover scenic trails through mountains and forests with experienced guides.",
          duration: "Half-day or Full-day",
          price: "From DZD 8,500",
          difficulty: "Varies by trail"
        },
      ].map((activity, index) => (
        <div 
          key={index} 
          className="relative group overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
        >
          {/* Activity Image */}
          <img 
            src={activity.img} 
            alt={activity.name} 
            className="w-full h-[250px] md:h-[300px] object-cover transition-transform duration-300 group-hover:scale-105" 
          />
          
          {/* Default View (Before Hover) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-4">
            <h4 className="text-white text-lg font-semibold">{activity.name}</h4>
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center text-white">
            <h3 className="text-xl font-bold mb-2">{activity.name}</h3>
            <p className="text-sm mb-3">{activity.description}</p>
            
            <div className="grid grid-cols-2 gap-2 text-sm w-full mb-4">
              <div className="flex flex-col items-center">
                <span className="font-medium">Duration</span>
                <span>{activity.duration}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium">Difficulty</span>
                <span>{activity.difficulty}</span>
              </div>
            </div>
            
            <div className="text-lg font-medium mb-4">
              {activity.price}
            </div>
            
            
          </div>
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
            Read More <img src={images.bleftIcon} alt="" />
          </div>
        </div>

        <div className="about-img md:static absolute right-0 opacity-30 md:opacity-100 reveal">
          <img src={images.aboutImg} alt="" className="w-[200px] md:w-[556px] h-auto md:h-[488px] rounded-xl" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f1f1]  p-16 mt-24">
        <div className="container max-w-[1378px] mx-auto">
          <div className="footer-sections grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 p-4 md:p-0">
            <div className="footer-section">
            <img src={images.logo} className="w-[45%] h-[50%]" alt="2rism" />
              <p className="text-sm leading-relaxed mb-4 text-gray-600 max-w-[354px]">
                We always make our customers happy by providing as many choices as possible
              </p>
              <div className="footer-social-icons flex gap-6">
                <Facebook className="text-gray-600" size={24} />
                <Twitter className="text-gray-600" size={24} />
                <Instagram className="text-gray-600" size={24} />
              </div>
            </div>

            <div className="footer-section pt-8">
              <h3 className="text-lg font-medium">About</h3>
              <ul className="mt-4 space-y-2">
                {['About Us', 'Features', 'News', 'Menu'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-800">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section pt-8">
              <h3 className="text-lg font-medium">Company</h3>
              <ul className="mt-4 space-y-2">
                {['Why 7wess', 'Partner with us', 'FAQ', 'Blog'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-800">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section pt-8">
              <h3 className="text-lg font-medium">Support</h3>
              <ul className="mt-4 space-y-2">
                {['Account', 'Support Center', 'Feedback', 'Contact Us'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-800">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section pt-8">
              <h3 className="text-lg font-medium">Contact</h3>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2">
                  <Mail className="text-gray-600" size={18} />
                  <span className="text-sm text-gray-600">contact@7wess.com</span>
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
            <p className="text-sm text-gray-600">© 2025 7wess. All rights reserved</p>
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
export default Home;