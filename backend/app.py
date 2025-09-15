"""
Main Flask application
"""

import logging
from flask import Flask, jsonify, request
from datetime import datetime, timezone
from flask_cors import CORS
from pathlib import Path
import os
import json

# Minimal single-file backend: only depends on itinerary_planner.py
from typing import Any, Dict, List, Tuple
from itinerary_planner import (
    TourPlanningProblem,
    a_star_search,
    csp_constructive_plan,
    create_initial_state,
    load_attractions,
    find_hotels_for_itinerary
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = (BASE_DIR / ".." / "Data").resolve()

def load_json(filename: str, default=None):
    path = DATA_DIR / filename
    if not path.exists():
        return default if default is not None else []
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)

ATTRACTIONS = load_json("attractions.json", default=[])
HOTELS = load_json("cleaned_hotels.json", default=[])

def load_data():
    """Optional no-op loader to satisfy run_server.py imports.
    Data files are read on-demand by endpoints.
    """
    return True

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Enable CORS for all routes
    FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "*")
    CORS(app, resources={r"/api/*": {"origins": FRONTEND_ORIGIN}})

    # -------- Helpers (inline) --------
    def _parse_location(loc_str: str) -> Tuple[float, float]:
        """Accepts 'lat,lon' or city names and returns coordinates"""
        try:
            # Check if it's GPS coordinates (lat,lon format)
            if ',' in loc_str and not any(char.isalpha() for char in loc_str):
                lat_s, lon_s = loc_str.split(',', 1)
                lat = float(lat_s.strip())
                lon = float(lon_s.strip())
                # Validate coordinate ranges
                if -90 <= lat <= 90 and -180 <= lon <= 180:
                    return lat, lon
        except Exception:
            pass
        
        # City name mapping (major Algerian cities)
        city_coordinates = {
            'algiers': (36.737232, 3.086472),
            'alger': (36.737232, 3.086472),
            'oran': (35.696944, -0.633056),
            'constantine': (36.365, 6.614722),
            'annaba': (36.9, 7.766667),
            'tlemcen': (34.886667, -1.315278),
            'ghardaia': (32.483333, 3.666667),
            'setif': (36.19, 5.41),
            'blida': (36.47, 2.83),
            'batna': (35.55, 6.17),
            'bechar': (31.62, -2.22),
            'djelfa': (34.67, 3.25),
            'sidi bel abbes': (35.2, -0.63),
            'biskra': (34.85, 5.73),
            'tiaret': (35.37, 1.32),
            'el oued': (33.37, 6.87),
            'skikda': (36.87, 6.91),
            'jijel': (36.82, 5.77),
            'mostaganem': (35.94, 0.09),
            'm\'sila': (35.7, 4.54),
            'boumerdes': (36.76, 3.47),
            'tipaza': (36.59, 2.45),
            'medea': (36.26, 2.75),
            'bouira': (36.37, 3.9),
            'tizi ouzou': (36.72, 4.05),
            'bejaia': (36.75, 5.08),
            'bouira': (36.37, 3.9),
            'laghouat': (33.8, 2.87),
            'ouargla': (31.95, 5.33),
            'tamanrasset': (22.79, 5.53),
            'adrar': (27.87, -0.29),
            'el bayadh': (33.68, 1.02),
            'illizi': (26.5, 8.47),
            'bordj bou arreridj': (36.07, 4.76),
            'boumerdes': (36.76, 3.47),
            'el tarf': (36.77, 8.31),
            'tindouf': (27.67, -8.15),
            'tissemsilt': (35.61, 1.81),
            'el oued': (33.37, 6.87),
            'khenchela': (35.43, 7.14),
            'souk ahras': (36.28, 7.95),
            'mila': (36.45, 6.26),
            'ain defla': (36.26, 1.97),
            'naama': (33.27, -0.32),
            'ain temouchent': (35.31, -1.14),
            'guelma': (36.46, 7.43),
            'relizane': (35.74, 0.56),
            'el m\'ghair': (33.95, 5.92),
            'el meniaa': (30.5, 2.88),
            'ouled djellal': (34.42, 5.07),
            'bordj badji mokhtar': (21.32, 0.95),
            'beni abbes': (30.13, -2.17),
            'timimoun': (29.26, 0.23),
            'touggourt': (33.1, 6.06),
            'djanet': (24.55, 9.48),
            'in guezzam': (19.57, 5.77),
            'in salah': (27.21, 2.46)
        }
        
        # Try to match city name (case insensitive)
        loc_lower = loc_str.lower().strip()
        
        # Remove common suffixes
        for suffix in [', algeria', ', dz', ' wilaya', ' province']:
            if loc_lower.endswith(suffix):
                loc_lower = loc_lower[:-len(suffix)].strip()
        
        # Direct match
        if loc_lower in city_coordinates:
            return city_coordinates[loc_lower]
        
        # Partial match (for cases like "Algiers, Algeria")
        for city, coords in city_coordinates.items():
            if city in loc_lower or loc_lower in city:
                return coords
        
        # Default to Algiers if no match found
        logger.warning(f"Location '{loc_str}' not recognized, defaulting to Algiers")
        return 36.737232, 3.086472

    def _get_attractions(limit: int | None = None) -> List[Dict[str, Any]]:
        # Try common locations for attractions.json
        candidates = [
            os.path.join(os.path.dirname(__file__), 'attractions.json'),
            os.path.join(os.path.dirname(__file__), 'data', 'attractions.json'),
            os.path.join(os.path.dirname(__file__), 'Data', 'attractions.json'),
            os.path.join(os.path.dirname(__file__), '..', 'Data', 'attractions.json'),
            os.path.join(os.getcwd(), 'backend', 'attractions.json'),
            os.path.join(os.getcwd(), 'backend', 'data', 'attractions.json'),
            os.path.join(os.getcwd(), 'backend', 'Data', 'attractions.json'),
            os.path.join(os.getcwd(), 'Data', 'attractions.json'),
        ]
        data: List[Dict[str, Any]] = []
        for path in candidates:
            if os.path.exists(path):
                try:
                    data = load_attractions(path)
                    break
                except Exception:
                    continue
        # If still empty, return []
        if limit and data:
            return data[:limit]
        return data

    def _build_constraints(req: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'max_total_budget': float(req.get('budget', 0)),
            'max_daily_time': float(req.get('maxTravelHours', 8)),
            'max_attractions_per_day': int(req.get('maxAttractions', 3)),
            'has_car': bool(req.get('hasCar', False)),
            'min_hotel_stars': int(req.get('minHotelStars', 3)) if req.get('minHotelStars') is not None else 3,
            'max_hotel_stars': int(req.get('maxHotelStars', 5)) if req.get('maxHotelStars') is not None else 5,
        }

    def _format_response(goal_node: Any,
                         problem: TourPlanningProblem,
                         wilaya: str,
                         activities: List[str],
                         budget: float) -> Dict[str, Any]:
        # Hotels suggestion is optional; try to load hotels.json if present
        hotels_data: List[Dict[str, Any]] = []
        hotels_candidates = [
            os.path.join(os.path.dirname(__file__), 'hotels.json'),
            os.path.join(os.path.dirname(__file__), 'data', 'hotels.json'),
            os.path.join(os.path.dirname(__file__), 'Data', 'hotels.json'),
            os.path.join(os.path.dirname(__file__), '..', 'Data', 'cleaned_hotels.json'),
            os.path.join(os.getcwd(), 'Data', 'cleaned_hotels.json'),
        ]
        for hp in hotels_candidates:
            if os.path.exists(hp):
                try:
                    with open(hp, encoding='utf-8') as hf:
                        hotels_data = json.load(hf)
                except Exception:
                    pass
                break

        hotels_by_day, total_hotel_cost = find_hotels_for_itinerary(
            goal_node.state['itinerary'],
            problem.attractions,
            hotels_data,
            problem.constraints['max_total_budget'],
            goal_node.state['total_cost'],
            problem.constraints.get('min_hotel_stars', 3),
            problem.constraints.get('max_hotel_stars', 5),
        )

        result: Dict[str, Any] = {
            'success': True,
            'title': 'Algeria Adventure: 7-Day Itinerary',
            'summary': f"A customized itinerary based on your preferences for {', '.join(activities)}.",
            'totalBudget': round(goal_node.state['total_cost'], 2),
            'totalTime': round(sum(goal_node.state['daily_time']), 2),
            'hotelCost': round(total_hotel_cost, 2),
            'remainingBudget': round(budget - goal_node.state['total_cost'] - total_hotel_cost, 2),
            'satisfaction': round(problem._calculate_satisfaction(goal_node.state), 2),
            'days': []
        }

        for day_idx, day_plan in enumerate(goal_node.state['itinerary'], start=1):
            day_entries = []
            total_day_cost = 0.0

            for name in day_plan:
                att = problem._att_by_name[name]
                cost_val = problem._parse_cost(att.get('cost', '0'))
                total_day_cost += cost_val
                gps_coords = att.get('gps', [36.737232, 3.086472])
                if isinstance(gps_coords, list) and len(gps_coords) >= 2:
                    gps_coords = [float(gps_coords[0]), float(gps_coords[1])]
                else:
                    gps_coords = [36.737232, 3.086472]
                day_entries.append({
                    'name': att.get('name', 'Attraction'),
                    'gps': gps_coords,
                    'category': att.get('category', 'Unknown'),
                    'cost': att.get('cost', 'Free'),
                    'visit_duration': att.get('visit_duration', '2 hours'),
                    'rating': float(att.get('rating', 3.0)),
                    'description': att.get('description', f"Visit this {att.get('category', 'attraction')} in {wilaya}")
                })

            accommodation = {}
            if hotels_by_day.get(day_idx):
                best_hotel = hotels_by_day[day_idx][0]
                accommodation = {
                    'name': best_hotel.get('hotel', 'Recommended Hotel'),
                    'city': best_hotel.get('city', wilaya),
                    'rating': best_hotel.get('avg_review', 4.0),
                    'price': best_hotel.get('price', 0),
                    'type': f"{best_hotel.get('avg_review', 4.0)}-star hotel",
                    'amenities': ['WiFi', 'Restaurant', 'Parking']
                }
            else:
                accommodation = {
                    'name': 'No hotel found',
                    'city': wilaya,
                    'rating': 0,
                    'price': 0,
                    'type': 'No accommodation available',
                    'amenities': []
                }

            result['days'].append({
                'day': day_idx,
                'title': f'Day {day_idx}: Adventure Day',
                'location': wilaya,
                'coordinates': day_entries[-1]['gps'] if day_entries else [36.737232, 3.086472],
                'totalCost': round(total_day_cost, 2),
                'totalTime': round(goal_node.state['daily_time'][day_idx - 1], 2),
                'activities': [{
                    'time': f"{9 + i * 2}:00",
                    'title': entry['name'],
                    'description': entry['description'],
                    'category': entry['category'],
                    'cost': entry['cost'],
                    'duration': entry['visit_duration'],
                    'rating': entry['rating'],
                    'coordinates': entry['gps']
                } for i, entry in enumerate(day_entries)],
                'accommodation': accommodation
            })

        return result

    # -------- API endpoints (simplified) --------
    @app.post('/api/itinerary/generate')
    def generate_itinerary():
        try:
            data = request.get_json()
            if not data:
                return jsonify({"success": False, "error": "No JSON data provided"}), 400

            required = ['wilaya', 'location', 'activities', 'budget']
            missing = [k for k in required if not data.get(k)]
            if missing:
                return jsonify({"success": False, "error": f"Missing required fields: {', '.join(missing)}"}), 400

            wilaya = str(data['wilaya'])
            activities = list(data.get('activities') or [])
            budget = float(data.get('budget', 0))

            start_location = _parse_location(str(data.get('location', '')))
            user_prefs = {
                'categories': activities,
                'hotel_stars': (
                    int(data.get('minHotelStars', 3)),
                    int(data.get('maxHotelStars', 5))
                )
            }
            constraints = _build_constraints(data)

            all_attractions = _get_attractions()
            # Filter by wilaya/city if field exists
            attractions = [a for a in all_attractions if not activities or a.get('category') in activities]

            initial_state = create_initial_state(start_location, user_prefs)
            problem = TourPlanningProblem(initial_state, attractions, user_prefs, constraints)

            algorithm = str(data.get('algorithm', 'csp')).lower()
            time_limit = float(data.get('cspTimeLimitSec', 10.0))

            goal_node = None
            if algorithm == 'csp':
                try:
                    goal_node = csp_constructive_plan(problem, time_limit_sec=time_limit)
                    if goal_node is None:
                        logger.info('CSP failed to find solution, falling back to A*')
                except Exception:
                    logger.exception('CSP failed with exception; falling back to A*')
            
            # Fallback to A* if CSP didn't produce a result
            if goal_node is None:
                logger.info('Using A* search as fallback')
                goal_node = a_star_search(problem)

            if goal_node is None:
                return jsonify({
                    'success': False,
                    'error': 'No feasible itinerary found with the given constraints. Try relaxing your requirements.'
                }), 400

            return jsonify({"data": _format_response(goal_node, problem, wilaya, activities, budget)})
        except ValueError as e:
            return jsonify({"success": False, "error": str(e)}), 400
        except Exception:
            logger.exception("Unexpected error in itinerary generation")
            return jsonify({"success": False, "error": "An unexpected error occurred while generating your itinerary. Please try again."}), 500

    @app.get('/api/itinerary/attractions')
    @app.get('/api/attractions')
    def get_attractions():
        try:
            wilaya = request.args.get('wilaya')
            category = request.args.get('category')
            limit = request.args.get('limit', type=int)
            data = _get_attractions(limit=None)
            if wilaya:
                data = [a for a in data if a.get('city') == wilaya or a.get('wilaya') == wilaya]
            if category:
                data = [a for a in data if a.get('category') == category]
            if isinstance(limit, int) and limit > 0:
                data = data[:limit]
            return jsonify({"success": True, "attractions": data, "count": len(data)})
        except Exception:
            logger.exception("Error fetching attractions")
            return jsonify({"success": False, "error": "Failed to fetch attractions"}), 500

    @app.get('/api/itinerary/hotels')
    @app.get('/api/hotels')
    def get_hotels():
        try:
            wilaya = request.args.get('wilaya')
            min_stars = request.args.get('min_stars', type=int)
            max_stars = request.args.get('max_stars', type=int)
            limit = request.args.get('limit', type=int)
            # Load hotels.json if available
            hotels: List[Dict[str, Any]] = []
            for hp in [
                os.path.join(os.path.dirname(__file__), 'hotels.json'),
                os.path.join(os.path.dirname(__file__), 'data', 'hotels.json'),
                os.path.join(os.path.dirname(__file__), 'Data', 'hotels.json'),
                os.path.join(os.path.dirname(__file__), '..', 'Data', 'cleaned_hotels.json'),
                os.path.join(os.getcwd(), 'Data', 'cleaned_hotels.json'),
            ]:
                if os.path.exists(hp):
                    try:
                        with open(hp, encoding='utf-8') as f:
                            hotels = json.load(f)
                    except Exception:
                        pass
                    break
            if wilaya:
                hotels = [h for h in hotels if h.get('city') == wilaya or h.get('wilaya') == wilaya]
            if isinstance(min_stars, int):
                hotels = [h for h in hotels if float(h.get('avg_review', 0)) >= min_stars]
            if isinstance(max_stars, int):
                hotels = [h for h in hotels if float(h.get('avg_review', 5)) <= max_stars]
            if isinstance(limit, int) and limit > 0:
                hotels = hotels[:limit]
            return jsonify({"success": True, "hotels": hotels, "count": len(hotels)})
        except Exception:
            logger.exception("Error fetching hotels")
            return jsonify({"success": False, "error": "Failed to fetch hotels"}), 500

    @app.get('/api/itinerary/wilayas')
    @app.get('/api/wilayas')
    def get_wilayas():
        try:
            # Derive wilayas from attractions dataset
            data = _get_attractions()
            wilayas = sorted(list({a.get('city') or a.get('wilaya') for a in data if a.get('city') or a.get('wilaya')}))
            return jsonify({"success": True, "wilayas": wilayas})
        except Exception:
            logger.exception("Error fetching wilayas")
            return jsonify({"success": False, "error": "Failed to fetch wilayas"}), 500

    @app.get('/api/itinerary/categories')
    @app.get('/api/categories')
    def get_categories():
        try:
            data = _get_attractions()
            categories = sorted(list({a.get('category', 'Unknown') for a in data}))
            return jsonify({"success": True, "categories": categories})
        except Exception:
            logger.exception("Error fetching categories")
            return jsonify({"success": False, "error": "Failed to fetch categories"}), 500

    @app.post('/api/itinerary/geocode')
    def geocode_location():
        try:
            data = request.get_json()
            if not data or 'location' not in data:
                return jsonify({"success": False, "error": "Location string is required"}), 400
            location_str = data['location'].strip()
            if not location_str:
                return jsonify({"success": False, "error": "Location string cannot be empty"}), 400
            lat, lon = _parse_location(location_str)
            return jsonify({"success": True, "coordinates": [lat, lon], "location": location_str})
        except Exception:
            logger.exception("Error geocoding location")
            return jsonify({"success": False, "error": "Failed to geocode location"}), 500
    
    # Health check endpoints
    @app.get('/health')
    @app.get('/api/health')
    def health_check():
        """Health check endpoint with basic stats"""
        try:
            attractions = _get_attractions()
            # Try loading hotels similarly to other endpoints
            hotels_count = 0
            for hp in [
                os.path.join(os.path.dirname(__file__), 'hotels.json'),
                os.path.join(os.path.dirname(__file__), 'data', 'hotels.json'),
                os.path.join(os.path.dirname(__file__), 'Data', 'hotels.json'),
            ]:
                if os.path.exists(hp):
                    try:
                        with open(hp, encoding='utf-8') as f:
                            hotels = json.load(f)
                            hotels_count = len(hotels) if isinstance(hotels, list) else 0
                    except Exception:
                        hotels_count = 0
                    break

            return jsonify({
                "status": "healthy",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "attractions_loaded": len(attractions),
                "hotels_loaded": hotels_count,
                "version": "1.0.0",
            })
        except Exception:
            logger.exception("Error in health check")
            return jsonify({
                "status": "degraded",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "attractions_loaded": 0,
                "hotels_loaded": 0,
                "version": "1.0.0",
            }), 200
    
    # Root endpoint
    @app.route('/')
    @app.route('/api')
    def root():
        """Root endpoint with API information"""
        return jsonify({
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
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 errors"""
        return jsonify({
            "success": False,
            "error": "Endpoint not found"
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors"""
        logger.error(f"Internal server error: {str(error)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        """Handle 400 errors"""
        return jsonify({
            "success": False,
            "error": "Bad request"
        }), 400
    
    logger.info("Flask application created successfully")
    return app

# Create the app instance
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)