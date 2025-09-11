/**
 * Dedicated Itinerary Results Page
 * 
 * This page displays the generated itinerary with an interactive map
 * showing all attractions and hotels.
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  // Calendar,
  Download,
  Share2,
  Hotel,
  Activity,
  ArrowLeft,
  Map,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ItineraryResponse } from '../services/api';
import { InteractiveMap } from '../components/map/InteractiveMap';

export const ItineraryResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    // Get itinerary data from location state or localStorage
    const loadItinerary = async () => {
      setIsLoading(true);
      
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const itineraryData = location.state?.itinerary || 
        JSON.parse(localStorage.getItem('itinerary') || 'null');
      
      if (itineraryData) {
        setItinerary(itineraryData);
      } else {
        // Redirect to home if no itinerary data
        navigate('/');
      }
      
      setIsLoading(false);
    };

    loadItinerary();
  }, [location.state, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-[#1e6f9f] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#062546] mb-4 [font-family:'Outfit',Helvetica]">
            Loading Your Itinerary
          </h2>
          <p className="text-gray-600 [font-family:'Outfit',Helvetica] font-normal">
            Please wait while we prepare your personalized travel plan...
          </p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#062546] mb-4 [font-family:'Outfit',Helvetica]">
            No Itinerary Found
          </h2>
          <p className="text-gray-600 mb-6 [font-family:'Outfit',Helvetica] font-normal">
            Please generate an itinerary first.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="bg-[#1e6f9f] hover:bg-[#1a5f8a] text-white px-6 py-3 rounded-xl font-semibold [font-family:'Outfit',Helvetica]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    
    try {
      // Simulate download delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a downloadable itinerary document
      const content = `
7wess - Your Algeria Adventure Itinerary
${itinerary.title}

${itinerary.summary}

SUMMARY:
Total Budget: ${formatCurrency(itinerary.totalBudget)}
Total Time: ${formatTime(itinerary.totalTime)}
Hotel Cost: ${formatCurrency(itinerary.hotelCost)}
Remaining Budget: ${formatCurrency(itinerary.remainingBudget)}
Satisfaction Score: ${itinerary.satisfaction.toFixed(1)}%

ITINERARY:
${itinerary.days.map(day => `
Day ${day.day}: ${day.title}
Location: ${day.location}
Total Cost: ${formatCurrency(day.totalCost)}
Total Time: ${formatTime(day.totalTime)}

Activities:
${day.activities.map(activity => 
  `- ${activity.time}: ${activity.title} (${activity.category})
    Duration: ${activity.duration} | Cost: ${activity.cost} | Rating: ${activity.rating}/5`
).join('\n')}

Accommodation: ${day.accommodation.name}
Type: ${day.accommodation.type}
Price: ${formatCurrency(day.accommodation.price)}
Rating: ${day.accommodation.rating}/5
`).join('\n')}

Generated by 7wess - Your Ultimate Algeria Tour Guide
      `;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `algeria-itinerary-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    setShareSuccess(false);
    
    try {
      const shareData = {
        title: itinerary.title,
        text: itinerary.summary,
        url: window.location.href,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          setShareSuccess(true);
        } catch (err) {
          console.log('Error sharing:', err);
          // Fallback to clipboard
          await handleCopyToClipboard();
        }
      } else {
        // Fallback: copy to clipboard
        await handleCopyToClipboard();
      }
    } finally {
      setIsSharing(false);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${itinerary.title}\n\n${itinerary.summary}\n\nView full itinerary: ${window.location.href}`
      );
      alert('Itinerary link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      alert('Unable to copy to clipboard. Please copy the URL manually.');
    }
  };

  const handleGenerateNew = () => {
    localStorage.removeItem('itinerary');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-[#1e6f9f] text-[#1e6f9f] shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-[#062546] [font-family:'Outfit',Helvetica] mb-3">
                  {itinerary.title}
                </h1>
                <p className="text-lg text-gray-600 [font-family:'Outfit',Helvetica] font-normal max-w-3xl">
                  {itinerary.summary}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`px-6 py-3 transition-all duration-300 ${
                  downloadSuccess 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-[#1e6f9f] hover:bg-[#1a5f8a] text-white'
                }`}
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : downloadSuccess ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {isDownloading ? 'Downloading...' : downloadSuccess ? 'Downloaded!' : 'Download'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleShare}
                disabled={isSharing}
                className={`px-6 py-3 transition-all duration-300 ${
                  shareSuccess 
                    ? 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white' 
                    : 'border-[#1e6f9f] text-[#1e6f9f] hover:bg-[#1e6f9f] hover:text-white'
                }`}
              >
                {isSharing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : shareSuccess ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <Share2 className="w-4 h-4 mr-2" />
                )}
                {isSharing ? 'Sharing...' : shareSuccess ? 'Shared!' : 'Share'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-[#1e6f9f] mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-[#062546] mb-1 [font-family:'Outfit',Helvetica]">
                {formatCurrency(itinerary.totalBudget)}
              </h3>
              <p className="text-gray-600 [font-family:'Outfit',Helvetica] font-normal">Total Budget</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-[#1e6f9f] mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-[#062546] mb-1 [font-family:'Outfit',Helvetica]">
                {formatTime(itinerary.totalTime)}
              </h3>
              <p className="text-gray-600 [font-family:'Outfit',Helvetica] font-normal">Total Time</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6 text-center">
              <Hotel className="w-8 h-8 text-[#1e6f9f] mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-[#062546] mb-1 [font-family:'Outfit',Helvetica]">
                {formatCurrency(itinerary.hotelCost)}
              </h3>
              <p className="text-gray-600 [font-family:'Outfit',Helvetica] font-normal">Hotel Cost</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-[#1e6f9f] mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-[#062546] mb-1 [font-family:'Outfit',Helvetica]">
                {itinerary.satisfaction.toFixed(1)}%
              </h3>
              <p className="text-gray-600 [font-family:'Outfit',Helvetica] font-normal">Satisfaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map */}
        <Card className="bg-white border-0 shadow-lg rounded-2xl mb-8">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-[#062546] mb-4 [font-family:'Outfit',Helvetica] flex items-center gap-3">
              <Map className="w-6 h-6 text-[#1e6f9f]" />
              Interactive Map
            </h3>
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <span className="[font-family:'Outfit',Helvetica] font-normal">Attractions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                  <span className="[font-family:'Outfit',Helvetica] font-normal">Hotels</span>
                </div>
                {itinerary.days.map((day, dayIndex) => {
                  if (day.activities.length > 1) {
                    const routeColor = dayIndex === 0 ? '#1e6f9f' : dayIndex === 1 ? '#059669' : dayIndex === 2 ? '#dc2626' : '#7c3aed';
                    return (
                      <div key={dayIndex} className="flex items-center gap-2">
                        <div 
                          className="w-4 h-1 rounded" 
                          style={{ backgroundColor: routeColor }}
                        ></div>
                        <span className="[font-family:'Outfit',Helvetica] font-normal">
                          Day {dayIndex + 1} Route
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
            <InteractiveMap itinerary={itinerary} height="500px" />
          </CardContent>
        </Card>

        {/* Daily Itinerary */}
        <div className="space-y-8">
          {itinerary.days.map((day) => (
            <Card key={day.day} className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                {/* Day Header */}
                <div className="bg-gradient-to-r from-[#1e6f9f] to-[#062546] p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-bold mb-2 [font-family:'Outfit',Helvetica]">
                        {day.title}
                      </h3>
                      <div className="flex items-center gap-6 text-white/90">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          <span className="[font-family:'Outfit',Helvetica] font-normal">{day.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          <span className="[font-family:'Outfit',Helvetica] font-normal">{formatTime(day.totalTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          <span className="[font-family:'Outfit',Helvetica] font-normal">{formatCurrency(day.totalCost)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold [font-family:'Outfit',Helvetica]">
                        Day {day.day}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activities */}
                <div className="p-8">
                  <h4 className="text-2xl font-bold text-[#062546] mb-6 [font-family:'Outfit',Helvetica] flex items-center gap-3">
                    <Activity className="w-6 h-6 text-[#1e6f9f]" />
                    Activities
                  </h4>
                  
                  <div className="space-y-4">
                    {day.activities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                          <h5 className="text-xl font-bold text-[#062546] mb-2 [font-family:'Outfit',Helvetica]">
                            {activity.title}
                          </h5>
                          <p className="text-gray-600 mb-3 [font-family:'Outfit',Helvetica] font-normal">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-[#1e6f9f] rounded-full"></span>
                              {activity.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {activity.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {activity.cost}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              {activity.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Accommodation */}
                  {day.accommodation && (
                    <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <h4 className="text-xl font-bold text-[#062546] mb-4 [font-family:'Outfit',Helvetica] flex items-center gap-3">
                        <Hotel className="w-5 h-5 text-[#1e6f9f]" />
                        Accommodation
                      </h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-lg font-bold text-[#062546] [font-family:'Outfit',Helvetica]">
                            {day.accommodation.name}
                          </h5>
                          <p className="text-gray-600 [font-family:'Outfit',Helvetica] font-normal">
                            {day.accommodation.type} • {day.accommodation.city}
                          </p>
                          {day.accommodation.amenities.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              {day.accommodation.amenities.map((amenity, index) => (
                                <span key={index} className="text-xs bg-[#1e6f9f]/20 text-[#1e6f9f] px-2 py-1 rounded-full [font-family:'Outfit',Helvetica] font-normal">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#062546] [font-family:'Outfit',Helvetica]">
                            {formatCurrency(day.accommodation.price)}
                          </div>
                          <div className="flex items-center gap-1 text-[#1e6f9f]">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="[font-family:'Outfit',Helvetica] font-normal">
                              {day.accommodation.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              size="lg"
              className={`w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 [font-family:'Outfit',Helvetica] ${
                downloadSuccess 
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/30' 
                  : 'bg-[#1e6f9f] hover:bg-[#1a5f8a] text-white hover:shadow-[#1e6f9f]/30'
              }`}
            >
              {isDownloading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : downloadSuccess ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <Download className="w-5 h-5 mr-2" />
              )}
              {isDownloading ? 'Downloading...' : downloadSuccess ? 'Downloaded!' : 'Download Itinerary'}
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              disabled={isSharing}
              size="lg"
              className={`w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 [font-family:'Outfit',Helvetica] ${
                shareSuccess 
                  ? 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white shadow-green-600/30' 
                  : 'border-2 border-[#1e6f9f] text-[#1e6f9f] hover:bg-[#1e6f9f] hover:text-white hover:shadow-[#1e6f9f]/30'
              }`}
            >
              {isSharing ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : shareSuccess ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <Share2 className="w-5 h-5 mr-2" />
              )}
              {isSharing ? 'Sharing...' : shareSuccess ? 'Shared!' : 'Share Itinerary'}
            </Button>
            <Button
              variant="outline"
              onClick={handleGenerateNew}
              size="lg"
              className="w-full sm:w-auto border-2 border-gray-300 text-gray-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 [font-family:'Outfit',Helvetica]"
            >
              Generate New Itinerary
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
