import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { 
  MapPin, 
  Calendar, 
  Activity, 
  DollarSign, 
  Star, 
  Clock, 
  Car, 
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  ChevronDown
} from 'lucide-react';
import { useItinerary } from '../../hooks/useItinerary';
import { ItineraryRequest, generateItinerary as apiGenerateItinerary } from '../../services/api';

interface SearchFormData {
  currentLocation: string;
  travelDate: string;
  preferredActivities: string[];
  budget: string;
  minHotelStars: string;
  maxHotelStars: string;
  maxAttractionsPerDay: string;
  maxTravelHoursPerDay: string;
  hasCar: boolean;
}

export const SearchFormSection: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SearchFormData>({
    currentLocation: '',
    travelDate: '',
    preferredActivities: [],
    budget: '',
    minHotelStars: '',
    maxHotelStars: '',
    maxAttractionsPerDay: '',
    maxTravelHoursPerDay: '',
    hasCar: false,
  });

  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);

  const {
    isGenerating,
    isLoadingCategories,
    categories,
    error,
    loadCategories,
    loadWilayas,
    clearError
  } = useItinerary();

  const [localError, setLocalError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');

  // Load categories and wilayas on component mount
  useEffect(() => {
    loadCategories();
    loadWilayas();
  }, [loadCategories, loadWilayas]);

  const handleInputChange = (field: keyof SearchFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate location in real-time
    if (field === 'currentLocation' && typeof value === 'string') {
      validateLocation(value);
    }
  };

  const handleActivityChange = (activity: string, checked: boolean) => {
    const updatedActivities = checked
      ? [...formData.preferredActivities, activity]
      : formData.preferredActivities.filter(a => a !== activity);
    
    handleInputChange('preferredActivities', updatedActivities);
  };

  const validateLocation = async (location: string) => {
    if (!location.trim()) {
      setLocationStatus('idle');
      return;
    }

    setLocationStatus('validating');
    
    try {
      // Check if it's GPS coordinates
      if (location.includes(',') && !/[a-zA-Z]/.test(location)) {
        const [lat, lon] = location.split(',').map(coord => parseFloat(coord.trim()));
        if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
          setLocationStatus('valid');
          return;
        }
      }
      
      // Check if it's a known city name
      const knownCities = [
        'algiers', 'alger', 'oran', 'constantine', 'annaba', 'tlemcen', 'ghardaia',
        'setif', 'blida', 'batna', 'djelfa', 'biskra', 'tiaret', 'skikda', 'jijel',
        'mostaganem', 'boumerdes', 'tipaza', 'medea', 'bouira', 'tizi ouzou', 'bejaia'
      ];
      
      const locationLower = location.toLowerCase().replace(/,?\s*(algeria|dz|wilaya|province)\s*$/, '').trim();
      
      if (knownCities.some(city => city.includes(locationLower) || locationLower.includes(city))) {
        setLocationStatus('valid');
      } else {
        setLocationStatus('invalid');
      }
    } catch (error) {
      setLocationStatus('invalid');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    // Enhanced validation with better error messages
    const validationErrors: string[] = [];
    
    if (!formData.currentLocation.trim()) {
      validationErrors.push('Current Location is required');
    }
    
    if (!formData.budget.trim()) {
      validationErrors.push('Budget is required');
    } else if (isNaN(parseFloat(formData.budget)) || parseFloat(formData.budget) <= 0) {
      validationErrors.push('Please enter a valid budget amount');
    }
    
    if (formData.preferredActivities.length === 0) { 
      validationErrors.push('At least one preferred activity is required');
    }

    // Validate hotel star ratings
    if (formData.minHotelStars && formData.maxHotelStars) {
      const minStars = parseInt(formData.minHotelStars);
      const maxStars = parseInt(formData.maxHotelStars);
      if (minStars > maxStars) {
        validationErrors.push('Minimum hotel stars cannot be greater than maximum stars');
      }
    }

    // Validate attractions per day
    if (formData.maxAttractionsPerDay) {
      const attractions = parseInt(formData.maxAttractionsPerDay);
      if (isNaN(attractions) || attractions < 1 || attractions > 10) {
        validationErrors.push('Max attractions per day must be between 1 and 10');
      }
    }

    // Validate travel hours
    if (formData.maxTravelHoursPerDay) {
      const hours = parseFloat(formData.maxTravelHoursPerDay);
      if (isNaN(hours) || hours < 1 || hours > 24) {
        validationErrors.push('Max travel hours per day must be between 1 and 24');
      }
    }

    if (validationErrors.length > 0) {
      setLocalError(validationErrors.join('. '));
      return;
    }

    try {
      const request: ItineraryRequest = {
        wilaya: formData.currentLocation, // For now, using location as wilaya - this should be improved
        location: formData.currentLocation,
        activities: formData.preferredActivities, 
        budget: parseFloat(formData.budget),
        minHotelStars: formData.minHotelStars ? parseInt(formData.minHotelStars) : undefined,
        maxHotelStars: formData.maxHotelStars ? parseInt(formData.maxHotelStars) : undefined,
        maxAttractions: formData.maxAttractionsPerDay ? parseInt(formData.maxAttractionsPerDay) : undefined,
        maxTravelHours: formData.maxTravelHoursPerDay ? parseFloat(formData.maxTravelHoursPerDay) : undefined,
        hasCar: formData.hasCar,
      };

      const { data } = await apiGenerateItinerary(request);

      // Store itinerary in localStorage and navigate to results page
      localStorage.setItem('itinerary', JSON.stringify(data));
      navigate('/results', { state: { itinerary: data } });
    } catch (err) {
      console.error('Form submission error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate itinerary. Please try again.';
      setLocalError(errorMessage);
    }
  };

  const availableActivities = categories.length > 0 ? categories : [
    'Historical', 'Museum', 'Cultural', 'Nature', 'Beach', 'Religious', 
    'Garden', 'Amusement Park', 'Shopping Mall', 'Lake'
  ];

  const formFields = [
    {
      icon: MapPin,
      label: 'Current Location',
      field: 'currentLocation' as keyof SearchFormData,
      type: 'input',
      placeholder: 'e.g., Algiers, Algeria or 36.737, 3.086',
    },
    {
      icon: Calendar,
      label: 'Travel Date',
      field: 'travelDate' as keyof SearchFormData,
      type: 'input',
      inputType: 'date',
      placeholder: 'Select travel date',
    },
    {
      icon: Activity,
      label: 'Preferred Activities',
      field: 'preferredActivities' as keyof SearchFormData,
      type: 'activities',
      placeholder: 'Select activity types',
    },
    {
      icon: DollarSign,
      label: 'Budget (DZD)',
      field: 'budget' as keyof SearchFormData,
      type: 'input',
      placeholder: 'Enter your budget',
    },
    {
      icon: Star,
      label: 'Min Hotel Stars',
      field: 'minHotelStars' as keyof SearchFormData,
      type: 'select',
      placeholder: 'Select minimum stars',
      options: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    },
    {
      icon: Star,
      label: 'Max Hotel Stars',
      field: 'maxHotelStars' as keyof SearchFormData,
      type: 'select',
      placeholder: 'Select maximum stars',
      options: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    },
    {
      icon: MapPin,
      label: 'Max Attractions/Day',
      field: 'maxAttractionsPerDay' as keyof SearchFormData,
      type: 'input',
      placeholder: 'e.g. 3',
    },
    {
      icon: Clock,
      label: 'Max Travel Hours/Day',
      field: 'maxTravelHoursPerDay' as keyof SearchFormData,
      type: 'input',
      placeholder: 'e.g. 6',
    },
  ];

  return (
    <section className="search-form-section py-16 sm:py-20 bg-transparent relative -mt-48 sm:-mt-64 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-[#052445] border-none shadow-2xl rounded-[30px] sm:rounded-[40px] overflow-hidden relative">
            {/* Loading Overlay */}
            {isGenerating && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-[30px] sm:rounded-[40px]">
                <div className="text-center text-white px-4">
                  <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin mx-auto mb-4 text-[#1e6f9f]" />
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 [font-family:'Outfit',Helvetica]">
                    Generating Your Itinerary
                  </h3>
                  <p className="text-base sm:text-lg [font-family:'Outfit',Helvetica] font-normal">
                    Please wait while we create your personalized travel plan...
                  </p>
                </div>
              </div>
            )}
            <CardContent className="p-6 sm:p-8 lg:p-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 [font-family:'Outfit',Helvetica]">
                Plan Your Perfect Algeria Adventure
              </h2>
              <p className="text-gray-300 text-lg sm:text-xl [font-family:'Outfit',Helvetica] font-normal">
                Tell us your preferences and we'll create a personalized itinerary just for you
              </p>
              
              {/* Error Display */}
              {(error || localError) && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                  <div className="flex items-center gap-3 text-red-200">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <p className="text-xs sm:text-sm [font-family:'Outfit',Helvetica]">
                      {error || localError}
                    </p>
                  </div>
                </div>
              )}
            </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
                  {formFields.map((field) => {
                    const IconComponent = field.icon;
                    return (
                      <div key={field.field} className="space-y-3 group">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#1e6f9f] transition-colors duration-300" />
                          <Label className="text-white font-semibold text-base sm:text-lg [font-family:'Outfit',Helvetica]">
                            {field.label}
                          </Label>
                        </div>
                        
                        {field.type === 'input' ? (
                          <div>
                            <Input
                              type={(field as any).inputType || 'text'}
                              value={formData[field.field] as string}
                              onChange={(e) => handleInputChange(field.field, e.target.value)}
                              className={`h-12 sm:h-14 bg-transparent border-2 border-white text-white placeholder:text-gray-400 focus:border-[#1e6f9f] rounded-xl text-base sm:text-lg [font-family:'Outfit',Helvetica] transition-all duration-300 hover:border-gray-300 ${
                                (field as any).inputType === 'date' ? 'text-white [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:mr-4' : ''
                              }`}
                              placeholder={field.placeholder}
                              style={(field as any).inputType === 'date' ? { 
                                colorScheme: 'dark',
                                color: 'white',
                                paddingLeft: '40px',
                                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Crect x=\'3\' y=\'4\' width=\'18\' height=\'18\' rx=\'2\' ry=\'2\'/%3E%3Cline x1=\'16\' y1=\'2\' x2=\'16\' y2=\'6\'/%3E%3Cline x1=\'8\' y1=\'2\' x2=\'8\' y2=\'6\'/%3E%3Cline x1=\'3\' y1=\'10\' x2=\'21\' y2=\'10\'/%3E%3C/svg%3E")',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: '12px center',
                                backgroundSize: '20px 20px'
                              } : {}}
                            />
                            {field.field === 'currentLocation' && (
                              <div className="mt-2 space-y-1">
                                {locationStatus === 'validating' && (
                                  <div className="flex items-center gap-2 text-sm text-blue-300 [font-family:'Outfit',Helvetica]">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Validating location...
                                  </div>
                                )}
                                {locationStatus === 'valid' && (
                                  <div className="flex items-center gap-2 text-sm text-green-300 [font-family:'Outfit',Helvetica]">
                                    <CheckCircle className="w-4 h-4" />
                                    Location recognized ✓
                                  </div>
                                )}
                                {locationStatus === 'invalid' && formData.currentLocation.trim() && (
                                  <div className="flex items-center gap-2 text-sm text-yellow-300 [font-family:'Outfit',Helvetica]">
                                    <AlertCircle className="w-4 h-4" />
                                    Unknown location - will default to Algiers
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : field.type === 'select' ? (
                          <Select 
                            value={formData[field.field] as string}
                            onValueChange={(value) => handleInputChange(field.field, value)}
                          >
                            <SelectTrigger className="h-12 sm:h-14 bg-transparent border-2 border-white text-white rounded-xl text-base sm:text-lg [font-family:'Outfit',Helvetica] transition-all duration-300 hover:border-gray-300">
                              <SelectValue placeholder={field.placeholder} />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                              {field.options && field.options.length > 0 ? (
                                field.options.map((option) => (
                                  <SelectItem key={option} value={option} className="text-[#062546] hover:bg-[#1e6f9f]/10">
                                    {option}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="loading" disabled className="text-gray-500">
                                  {isLoadingCategories ? 'Loading categories...' : 'No categories available'}
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        ) : field.type === 'activities' ? (
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setIsActivitiesOpen(!isActivitiesOpen)}
                              className="w-full h-12 sm:h-14 bg-transparent border-2 border-white text-white rounded-xl text-base sm:text-lg [font-family:'Outfit',Helvetica] transition-all duration-300 hover:border-gray-300 px-4 flex items-center justify-between"
                            >
                              <span className={formData.preferredActivities.length === 0 ? 'text-gray-400' : 'text-white'}>
                                {formData.preferredActivities.length === 0 
                                  ? field.placeholder
                                  : `${formData.preferredActivities.length} activities selected`
                                }
                              </span>
                              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isActivitiesOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isActivitiesOpen && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                                <div className="p-2 space-y-1">
                                  {availableActivities.map((activity) => (
                                    <label
                                      key={activity}
                                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                                    >
                                      <Checkbox
                                        checked={formData.preferredActivities.includes(activity)}
                                        onCheckedChange={(checked) => handleActivityChange(activity, checked as boolean)}
                                        className="data-[state=checked]:bg-[#1e6f9f] data-[state=checked]:border-[#1e6f9f]"
                                      />
                                      <span className="text-gray-700 text-sm [font-family:'Outfit',Helvetica]">
                                        {activity}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}

                  {/* Car Ownership */}
                  <div className="space-y-3 group">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Car className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#1e6f9f] transition-colors duration-300" />
                      <Label className="text-white font-semibold text-base sm:text-lg [font-family:'Outfit',Helvetica]">
                        Car Ownership
                      </Label>
                    </div>
                    <div className="h-12 sm:h-14 bg-transparent border-2 border-white rounded-xl flex items-center justify-between px-4 sm:px-6 transition-all duration-300 hover:border-gray-300">
                      <span className="text-white text-base sm:text-lg [font-family:'Outfit',Helvetica]">No</span>
                      <Switch
                        checked={formData.hasCar}
                        onCheckedChange={(checked) => handleInputChange('hasCar', checked)}
                        className="data-[state=checked]:bg-[#1e6f9f]"
                      />
                      <span className="text-white text-base sm:text-lg [font-family:'Outfit',Helvetica]">Yes</span>
                    </div>
                  </div>
                </div>

              <div className="text-center space-y-4">
                <Button 
                  type="submit"
                  size="lg"
                  disabled={isGenerating || isLoadingCategories}
                  className="w-full sm:w-auto bg-[#1e6f9f] hover:bg-[#1a5f8a] text-white px-8 sm:px-16 py-4 sm:py-5 text-lg sm:text-xl font-semibold group rounded-2xl shadow-2xl hover:shadow-[#1e6f9f]/30 transition-all duration-300 [font-family:'Outfit',Helvetica] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-spin" />
                      Generating Itineraries...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300" />
                      Search Itineraries
                    </>
                  )}
                </Button>
              </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
