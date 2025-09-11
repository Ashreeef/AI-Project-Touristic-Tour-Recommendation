# AI Touristic Tour Recommendation API Documentation

## Overview

This Flask-based REST API provides intelligent itinerary generation for tourists visiting Algeria. The system uses a hybrid approach with **CSP (Constraint Satisfaction Problem)** as the primary algorithm and **A* search** as a fallback to create optimized 7-day travel plans based on user preferences, budget constraints, and geographical proximity.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, no authentication is required. All endpoints are publicly accessible.

## Endpoints

### 1. Health Check

**GET** `/api/health` or `/health`

Check if the API is running and get basic system information.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "attractions_loaded": 316,
  "hotels_loaded": 681,
  "version": "1.0.0"
}
```

### 2. Get Attractions

**GET** `/api/attractions` or `/api/itinerary/attractions`

Retrieve all available attractions with optional filtering.

**Query Parameters:**
- `wilaya` (optional): Filter by wilaya/province name
- `category` (optional): Filter by attraction category
- `limit` (optional): Maximum number of results (default: all)

**Example Request:**
```
GET /api/attractions?wilaya=Algiers&category=Museum&limit=10
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "attractions": [
    {
      "name": "Bardo Museum",
      "category": "Museum",
      "city": "Algiers",
      "wilaya": "Algiers",
      "gps": [36.737232, 3.086472],
      "cost": "300 DZD",
      "visit_duration": "1-2 hours",
      "rating": 4.2,
      "description": "National museum of prehistory and ethnography"
    }
  ]
}
```

### 3. Get Hotels

**GET** `/api/hotels` or `/api/itinerary/hotels`

Retrieve available hotels with optional filtering.

**Query Parameters:**
- `wilaya` (optional): Filter by wilaya/province name
- `min_stars` (optional): Minimum star rating (integer)
- `max_stars` (optional): Maximum star rating (integer)
- `limit` (optional): Maximum number of results

**Response:**
```json
{
  "success": true,
  "count": 3,
  "hotels": [
    {
      "hotel": "Hotel El Djazair",
      "city": "Algiers",
      "avg_review": 4.5,
      "price": 5000,
      "amenities": ["WiFi", "Restaurant", "Parking"]
    }
  ]
}
```

### 4. Get Categories

**GET** `/api/categories` or `/api/itinerary/categories`

Get all available attraction categories.

**Response:**
```json
{
  "success": true,
  "categories": [
    "Amusement Park",
    "Beach",
    "Cultural",
    "Garden",
    "Historical",
    "Lake",
    "Museum",
    "Nature",
    "Religious",
    "Shopping Mall"
  ]
}
```

### 5. Get Wilayas

**GET** `/api/wilayas` or `/api/itinerary/wilayas`

Get all available wilayas (provinces).

**Response:**
```json
{
  "success": true,
  "wilayas": [
    "Algiers",
    "Annaba",
    "Batna",
    "Béjaïa",
    "Constantine",
    "Oran",
    "Sétif",
    "Tlemcen"
  ]
}
```

### 6. Generate Itinerary

**POST** `/api/itinerary/generate`

Generate an optimized 7-day itinerary using CSP algorithm with A* fallback.

**Request Body:**
```json
{
  "wilaya": "Algiers",
  "location": "36.737232, 3.086472",
  "activities": ["Museum", "Historical", "Cultural"],
  "budget": 150000,
  "minHotelStars": 3,
  "maxHotelStars": 5,
  "maxAttractions": 3,
  "maxTravelHours": 8.0,
  "hasCar": true,
  "algorithm": "csp",
  "cspTimeLimitSec": 10.0
}
```

**Required Fields:**
- `wilaya`: Target wilaya/province (string)
- `location`: GPS coordinates as "latitude, longitude" (string)
- `activities`: List of preferred activity categories (array of strings)
- `budget`: Total budget in DZD (number)

**Optional Fields:**
- `minHotelStars`: Minimum hotel star rating (integer, 1-5, default: 3)
- `maxHotelStars`: Maximum hotel star rating (integer, 1-5, default: 5)
- `maxAttractions`: Maximum attractions per day (integer, 1-10, default: 3)
- `maxTravelHours`: Maximum travel hours per day (number, 0-24, default: 8.0)
- `hasCar`: Whether user has a car (boolean, default: false)
- `algorithm`: Algorithm to use - "csp" or "astar" (string, default: "csp")
- `cspTimeLimitSec`: Time limit for CSP algorithm in seconds (number, default: 10.0)

**Response:**
```json
{
  "data": {
    "success": true,
    "title": "Algeria Adventure: 7-Day Itinerary",
    "summary": "A customized itinerary based on your preferences for Museum, Historical, Cultural activities.",
    "totalBudget": 12500.50,
    "totalTime": 42.5,
    "hotelCost": 35000.00,
    "remainingBudget": 102499.50,
    "satisfaction": 87.5,
    "days": [
      {
        "day": 1,
        "title": "Day 1: Adventure Day",
        "location": "Algiers",
        "coordinates": [36.737232, 3.086472],
        "totalCost": 1800.00,
        "totalTime": 6.5,
        "activities": [
          {
            "time": "9:00",
            "title": "Bardo Museum",
            "description": "Visit this Museum in Algiers",
            "category": "Museum",
            "cost": "300 DZD",
            "duration": "1-2 hours",
            "rating": 4.2,
            "coordinates": [36.737232, 3.086472]
          },
          {
            "time": "11:00",
            "title": "Casbah of Algiers",
            "description": "Visit this Historical in Algiers",
            "category": "Historical",
            "cost": "Free",
            "duration": "2-3 hours",
            "rating": 4.8,
            "coordinates": [36.737232, 3.086472]
          }
        ],
        "accommodation": {
          "name": "Hotel El Djazair",
          "city": "Algiers",
          "rating": 4.5,
          "price": 5000,
          "type": "4.5-star hotel",
          "amenities": ["WiFi", "Restaurant", "Parking"]
        }
      }
    ]
  }
}
```

### 7. Geocode Location

**POST** `/api/itinerary/geocode`

Convert a location string to GPS coordinates.

**Request Body:**
```json
{
  "location": "Algiers, Algeria"
}
```

**Response:**
```json
{
  "success": true,
  "coordinates": [36.737232, 3.086472],
  "location": "Algiers, Algeria"
}
```

### 8. Root Endpoint

**GET** `/` or `/api`

Get API information and available endpoints.

**Response:**
```json
{
  "message": "Algeria Travel Itinerary API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "generate_itinerary": "/api/itinerary/generate",
    "attractions": "/api/attractions",
    "hotels": "/api/hotels",
    "wilayas": "/api/wilayas",
    "categories": "/api/categories",
    "geocode": "/api/itinerary/geocode"
  },
  "algorithms": {
    "default": "csp",
    "available": ["csp", "astar"]
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Missing required fields: wilaya, location"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Endpoint not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Algorithm Details

### Primary: CSP (Constraint Satisfaction Problem)

The API primarily uses a CSP-based constructive planner that:

1. **Domain Generation**: Creates attraction sequences within cities
2. **Constraint Satisfaction**: Ensures all constraints are met:
   - Daily time limits
   - Budget constraints
   - Hotel star preferences
   - Geographical proximity
3. **Backtracking**: Uses intelligent backtracking for optimal solutions
4. **Time Limiting**: Falls back to A* if CSP takes too long

### Fallback: A* Search Algorithm

When CSP fails or times out, the system falls back to A* search:

1. **Heuristic Function**: Estimates remaining cost based on:
   - Unused days penalty
   - Attraction density rewards
   - Proximity costs
   - User preference matching
   - Budget constraints

2. **Cost Function**: Calculates total cost including:
   - Attraction entry fees
   - Travel costs (distance × rate)
   - Time constraints
   - Budget limitations

3. **State Space**: Explores all possible attraction combinations

### Algorithm Selection

- **Default**: CSP (faster, more efficient)
- **Fallback**: A* (guaranteed to find solution if one exists)
- **Configurable**: Users can specify algorithm preference

## Data Sources

- **Attractions**: 316+ Algerian tourist attractions with GPS coordinates, costs, ratings, and categories
- **Hotels**: 681+ hotels across Algeria with pricing and star ratings
- **Categories**: 10+ attraction types (Museum, Historical, Cultural, Nature, etc.)

## Performance Characteristics

### CSP Algorithm
- **Speed**: Very fast (typically < 1 second)
- **Quality**: High-quality solutions
- **Scalability**: Excellent for most use cases
- **Limitations**: May timeout on complex constraints

### A* Algorithm
- **Speed**: Slower (1-10 seconds)
- **Quality**: Optimal solutions
- **Scalability**: Limited by state space size
- **Guarantees**: Always finds solution if one exists

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://127.0.0.1:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)

## Logging

The API uses Python's built-in logging module with INFO level. Logs include:
- Request details
- Algorithm execution status
- CSP/A* fallback decisions
- Error messages with stack traces
- Performance metrics

## Development

### Running the Server

```bash
cd backend
python app.py
```

The server will start on `http://localhost:5000`

### Testing

```bash
cd backend
python test_api.py
```

### Dependencies

- Flask
- Flask-CORS
- Python 3.8+

### Environment Variables

Currently, no environment variables are required. All configuration is done in the code.

## Production Considerations

1. **Security**: Implement authentication and authorization
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Caching**: Implement Redis caching for frequently requested data
4. **Monitoring**: Add application performance monitoring
5. **Error Handling**: Implement structured error logging
6. **Database**: Consider moving from JSON files to a proper database
7. **Load Balancing**: Implement load balancing for high availability
8. **Algorithm Tuning**: Fine-tune CSP time limits based on usage patterns

## Support

For technical support or feature requests, please contact the development team.

## Version History

- **v1.1.0**: Enhanced with CSP algorithm and A* fallback
  - Primary CSP algorithm for faster solutions
  - A* fallback for guaranteed optimal solutions
  - Hotel recommendations with star rating filtering
  - Geocoding endpoint
  - Improved error handling
  - Enhanced API documentation

- **v1.0.0**: Initial release with A* algorithm implementation
  - Basic itinerary generation
  - Hotel recommendations
  - Comprehensive error handling
  - Full API documentation