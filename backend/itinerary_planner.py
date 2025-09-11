import math
import json
import random
import re
from copy import deepcopy
from typing import List, Dict, Tuple  # Helper library for type hinting

class TourPlanningProblem:
    def __init__(self, initial_state: Dict, attractions: List[Dict],
                 user_prefs: Dict, constraints: Dict):
        """
        Args:
            initial_state: Initial state dictionary.
            attractions: List of attraction dictionaries.
            user_prefs: User preferences dictionary.
            constraints: Problem constraints dictionary.
        """
        self.initial_state = initial_state
        self.attractions = attractions
        self.user_prefs = user_prefs
        self.constraints = constraints

        # constant‑time lookup for any attraction name
        self._att_by_name = {a['name']: a for a in self.attractions}

        # cheaper if the user has a car
        self.dzd_per_km = 6.0 if constraints.get("has_car", False) else 10.0

        self.distance_cache = self._build_distance_cache()

    def _build_distance_cache(self) -> Dict[Tuple[str, str], float]:
        """Precompute distances between all pairs of attractions.
            store only upper‑triangle to halve the size"""
        cache = {}
        names = [a['name'] for a in self.attractions]
        for i, a1 in enumerate(self.attractions):
            for j in range(i + 1, len(self.attractions)):
                a2 = self.attractions[j]
                d = self._calculate_distance(a1['gps'], a2['gps'])
                cache[(a1['name'], a2['name'])] = d
                cache[(a2['name'], a1['name'])] = d          # mirror
        return cache

    @staticmethod
    def _calculate_distance(coord1: List[float], coord2: List[float]) -> float:
        """
        Haversine distance (km) between two GPS coordinates.
        """
        lat1, lon1 = map(math.radians, coord1)
        lat2, lon2 = map(math.radians, coord2)
        dlat, dlon = lat2 - lat1, lon2 - lon1
        a = (math.sin(dlat / 2)**2 +
             math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2)
        return 6371 * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    def actions(self, state: Dict) -> List[Tuple]:
        """
        Return a list of possible actions from the current state.
        Two types of actions:
          - ('add', <attraction_dict>): add an attraction to the current day.
          - ('next_day',): move to the next day.
        """
        valid_actions = []
        curr_day = state['curr_day']

        # If all days are planned, no further actions
        if curr_day >= len(state['itinerary']):
            return []

        # If the current day is full, only allow moving to next day
        if len(state['itinerary'][curr_day]) >= self.constraints['max_attractions_per_day']:
            return [('next_day',)]

        preferred = set(self.user_prefs.get('categories', []))

        # Check each attraction for validity
        for att in self.attractions:
            if att['category'] not in preferred:                 # <= preference filter
                continue
            if self._is_valid_addition(state, att):
                valid_actions.append(('add', att))

        # Allow 'next_day' if there's at least one attraction in the current day
        if len(state['itinerary'][curr_day]) > 0:
            valid_actions.append(('next_day',))

        return valid_actions

    def _is_valid_addition(self, state: Dict, attraction: Dict) -> bool:
        curr_day = state['curr_day']
        if curr_day >= 7:
            return False

        # 1) duplicates & per-day limit
        if any(attraction['name'] in day for day in state['itinerary']):
            return False
        if len(state['itinerary'][curr_day]) >= self.constraints['max_attractions_per_day']:
            return False

        # 2) compute travel / visit metrics once
        distance_km  = self._calculate_distance(state['current_location'], attraction['gps'])
        travel_time  = distance_km / 50          # ← avg 50 km/h
        visit_time   = self._parse_duration(attraction['visit_duration'])
        ticket_cost  = self._parse_cost(attraction['cost'])
        travel_cost  = self.travel_cost_km(state['current_location'], attraction['gps'])

        # 3) global budget cap  (✓ Bug 2.1 fixed)
        budget_cap = self.constraints.get("max_total_budget")
        if budget_cap is not None:
            prospective = state['total_cost'] + ticket_cost + travel_cost
            if prospective > budget_cap:
                return False

        # 4) daily time cap
        if state['daily_time'][curr_day] + travel_time + visit_time > self.constraints['max_daily_time']:
            return False

        # 5) optional daily-distance cap  (✓ Bug 2.2 fixed)
        max_dist = self.constraints.get("max_daily_distance")
        if max_dist is not None:
            if state['daily_distance'][curr_day] + distance_km > max_dist:
                return False

        return True

    def _estimate_travel_time(self, state: Dict, new_attraction: Dict) -> float:
        """
        Estimate travel time from the last visited attraction (or current location)
        to the new attraction.
        Assumes an average speed of 50 km/h.
        """
        curr_day = state['curr_day']
        day_attractions = state['itinerary'][curr_day]

        if not day_attractions:
            last_coords = state['current_location']
        else:
            last_att_name = day_attractions[-1]
            last_att = next(a for a in self.attractions if a['name'] == last_att_name)
            last_coords = last_att['gps']

        distance = self._calculate_distance(last_coords, new_attraction['gps'])
        return distance / 50  # hours

    def result(self, state: Dict, action: Tuple) -> Dict:
        new_state = deepcopy(state)
        action_type = action[0]
        curr_day = new_state['curr_day']

        if action_type == 'add':
            _, attraction = action

            # compute distance between previous location and new attraction
            distance_km = self._calculate_distance(
                new_state['current_location'], attraction['gps']
            )
            # track daily distance
            new_state['daily_distance'][curr_day] += distance_km

            ticket_cost  = self._parse_cost(attraction['cost'])
            travel_cost  = self.travel_cost_km(new_state['current_location'], attraction['gps'])
            new_state['total_cost'] += ticket_cost + travel_cost

            # compute travel & visit durations
            travel_time = self._estimate_travel_time(state, attraction)
            visit_time  = self._parse_duration(attraction['visit_duration'])

            new_state['daily_time'][curr_day] += travel_time + visit_time
            new_state['total_time']           += travel_time + visit_time

            new_state['itinerary'][curr_day].append(attraction['name'])
            new_state['current_location'] = attraction['gps']

        elif action_type == 'next_day':
            new_state['curr_day'] += 1

        return new_state

    def path_cost(self, current_cost: float, state1: Dict,
                  action: Tuple, state2: Dict) -> float:
        """
        For every node, path_cost == state['total_cost'] (in dinars).
        We **never** add the leg cost here – `result()` has already done it.
        """
        return state2['total_cost']

    def travel_cost_km(self, gps_a: List[float], gps_b: List[float]) -> float:
        """Return travel money (DZD) between two points."""
        dist = self._calculate_distance(gps_a, gps_b)
        return dist * self.dzd_per_km

    def is_goal(self, state: Dict) -> bool:
        """
        The goal is reached if:
         1) We have planned all 7 days (curr_day >= 7).
         2) Each day has at least one attraction.
         3) The total cost is within budget.
        """
        if state['curr_day'] < 7:
            return False
        for day_list in state['itinerary']:
            if len(day_list) == 0:
                return False
        if state['total_cost'] > self.constraints['max_total_budget']:
            return False
        return True

    def value(self, state: Dict) -> float:
        """
        Compute an overall quality score for a complete itinerary state.

        The final score is:

            satisfaction (0–100)
          − budget penalty (0–100)
          − time penalty   (0–50)
          − distance penalty (0–50)

        1. Satisfaction: how well the chosen attractions match user preferences,
           normalized to 0–100 via `_calculate_satisfaction`.
        2. Budget penalty: if total_cost exceeds the weekly budget, we impose
           up to −100 points proportional to the overspend.
        3. Time penalty: if total daily hours exceed 7×max_daily_time, up to −50 points.
        4. Distance penalty: if total travel kilometers exceed 50 km/h×max_daily_time×7,
           up to −50 points (captures excessive driving).

        Returns
        -------
        float
            A single scalar: higher means a better, more “satisfying” and feasible
            itinerary.
        """
        # 1) base satisfaction 0–100
        sat = self._calculate_satisfaction(state)

        # 2) budget penalty up to −100
        max_b = self.constraints.get('max_total_budget') or 1
        over_b = max(0.0, state['total_cost'] - max_b)
        cost_pen = min(100.0, (over_b / max_b) * 100.0)

        # 3) time penalty up to −50
        max_t = self.constraints['max_daily_time'] * 7
        over_t = max(0.0, sum(state['daily_time']) - max_t)
        time_pen = min(50.0, (over_t / max_t) * 50.0)

        # 4) distance penalty up to −50
        max_d = 50 * self.constraints['max_daily_time'] * 7
        over_d = max(0.0, sum(state['daily_distance']) - max_d)
        dist_pen = min(50.0, (over_d / max_d) * 50.0)

        return sat - cost_pen - time_pen - dist_pen


    def _calculate_satisfaction(self, state: Dict) -> float:
        """
        Compute a 0–100 “satisfaction” score based solely on user-preferred attractions.

        For each visited attraction:
        - +10×rating if it belongs to a preferred category
        - +5×rating otherwise

        The raw sum is then divided by the “ideal” maximum:
            10 points × max_rating (5) × 7 days × max attractions per day
        to yield a percentage in [0,100].

        Returns
        -------
        float
            How well the itinerary matches the user’s category/rating preferences.
        """
        score = 0.0
        preferred = set(self.user_prefs['categories'])

        for day in state['itinerary']:
            for name in day:
                a = self._att_by_name[name]
                weight = 10 if a['category'] in preferred else 5
                score += weight * a['rating']

        max_per_day = self.constraints['max_attractions_per_day']
        ideal_max = 10 * 5 * 7 * max_per_day
        return (score / ideal_max) * 100.0


    def _calculate_penalties(self, state: Dict) -> float:
        """
        Compute the sum of budget and time penalties, for diagnostic purposes.

        1. Budget penalty: (total_cost / max_total_budget) × 50
        2. Time penalty:   (sum(daily_time) / (7×max_daily_time)) × 30

        Returns
        -------
        float
            Combined penalty; higher means more severe violations of constraints.
        """
        cost_penalty = (state['total_cost'] / self.constraints['max_total_budget']) * 50
        time_penalty = (sum(state['daily_time']) /
                        (7 * self.constraints['max_daily_time'])) * 30
        return cost_penalty + time_penalty

    @staticmethod
    def _parse_cost(cost_str: str) -> float:
        """
        Convert cost field (e.g., "Free", "400 DZD", "Variable") to a numeric value.
        - "free" -> 0
        - "variable" or any non‑numeric -> 0
        - Otherwise, return the first number found.
        """
        s = cost_str.strip().lower()
        if "free" in s:
            return 0.0
        if "variable" in s:
            # treat Variable as zero cost, but later printed as "Variable", for e.g.: Shopping Malls
            return 0.0
        m = re.search(r"(\d+(?:\.\d+)?)", s)
        if m:
            return float(m.group(1))
        # fallback: everything else counts as zero
        return 0.0

    @staticmethod
    def _parse_duration(duration_str: str) -> float:
        """
        Convert a duration string (e.g., "1-2 hours", "0.5 hour", "3 hours") to a numeric estimate (hours).
        """
        duration_str = duration_str.lower().strip()
        # Matches "2 hours", "0.5 hour", "1-2 hours", etc.
        m = re.match(r"(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?\s*(?:h|hour|hrs?)", duration_str)
        if m:
            low = float(m.group(1))
            if m.group(2):
                high = float(m.group(2))
                return (low + high) / 2.0
            return low
        # Fallback if nothing matches
        return 2.0



# =========================================================================================


class Node:
    def __init__(self, state: Dict, parent: 'Node' = None, 
                 action: Tuple = None, path_cost: float = 0):
        """
        Args:
            state: The current state dictionary
            parent: Parent node
            action: Action that led to this node
            path_cost: Cumulative cost to reach this node
        """
        self.state = deepcopy(state)
        self.parent = parent
        self.action = action
        self.path_cost = path_cost
        self.depth = parent.depth + 1 if parent else 0
        self.value = None  # Will store heuristic/objective value
        
    def __lt__(self, other: 'Node') -> bool:
        """
        For priority queue ordering if needed (like in A*).
        If self.value is None, defaults to 0 for comparison.
        """
        return self.value < other.value if self.value is not None else False
        
    def expand(self, problem: TourPlanningProblem) -> List['Node']:
        """Generate all child nodes reachable from this node"""
        child_nodes = []
        for action in problem.actions(self.state):
            next_state = problem.result(self.state, action)
            child_node = Node(
                state=next_state,
                parent=self,
                action=action,
                path_cost=problem.path_cost(self.path_cost, self.state, action, next_state)
            )
            child_nodes.append(child_node)
        return child_nodes
        
    def path(self) -> List['Node']:
        """Return the path from root to this node"""
        node, path = self, []
        while node:
            path.append(node)
            node = node.parent
        return list(reversed(path))
        
    def __repr__(self) -> str:
        return (f"Node(day={self.state['curr_day']}, "
                f"cost={self.state['total_cost']}, "
                f"value={self.value})")
    
    def __eq__(self, other: 'Node') -> bool:
        """
        Equality check based on the state's itinerary and day.
        """
        return isinstance(other, Node) and self.state == other.state

    def __hash__(self) -> int:
        """
        Hash based on the itinerary's arrangement for use in sets/dicts.
        """
        # We'll hash a tuple of (current_day, tuple of each day’s attractions).
        # This avoids collisions from dict ordering
        day_tuples = tuple(tuple(day) for day in self.state['itinerary'])
        return hash((self.state['curr_day'], day_tuples))
    def generate_neighbors(self, problem: 'TourPlanningProblem') -> List['Node']:
        """
        Generate all possible neighbors by swapping, removing, or adding attractions
        for each day of the itinerary, respecting the problem constraints.

        Args:
            problem (TourPlanningProblem): The problem instance that holds the data for attractions and constraints.

        Returns:
            List[Node]: A list of neighboring nodes.
        """
        neighbors = []
        current_state = self.state
        attractions = problem.attractions
        constraints = problem.constraints

        for day_idx in range(7):  # Iterate over the 7 days
            day = current_state['itinerary'][day_idx]

            # ---- SWAP Attractions within a Day ----
            if len(day) > 1:  # If more than one attraction for the day, we can swap
                for i in range(len(day)):
                    for j in range(i + 1, len(day)):
                        new_state = deepcopy(current_state)
                        new_day = new_state['itinerary'][day_idx]
                        new_day[i], new_day[j] = new_day[j], new_day[i]

                        # Find the actual attraction dictionaries based on the names
                        attraction_i = next((att for att in attractions if att['name'] == new_day[i]), None)
                        attraction_j = next((att for att in attractions if att['name'] == new_day[j]), None)

                        # Check if the new state is valid before creating a child node
                        if attraction_i and attraction_j and \
                        problem._is_valid_addition(new_state, attraction_i) and \
                        problem._is_valid_addition(new_state, attraction_j):
                            child_node = Node(
                                state=new_state,
                                parent=self,
                                action=("swap", day_idx, i, j),
                                path_cost=self.path_cost  # Update if cost changes
                            )
                            neighbors.append(child_node)

            # ---- REMOVE Attraction ----
            for i in range(len(day)):
                new_state = deepcopy(current_state)
                removed_name = new_state['itinerary'][day_idx].pop(i)

                removed_attr = next(a for a in attractions if a['name'] == removed_name)
                new_state['total_cost'] -= problem._parse_cost(removed_attr['cost'])
                new_state['daily_time'][day_idx] -= problem._parse_duration(removed_attr['visit_duration'])
                new_state['total_time'] -= problem._parse_duration(removed_attr['visit_duration'])  # Update total time

                # Check if the new state is valid after removal
                if new_state['total_cost'] <= constraints['max_total_budget']:
                    child_node = Node(
                        state=new_state,
                        parent=self,
                        action=("remove", day_idx, removed_name),
                        path_cost=self.path_cost  # Update if needed
                    )
                    neighbors.append(child_node)

            # ---- ADD a New Attraction ----
            for att in attractions:
                if att['name'] in current_state['itinerary'][day_idx]:
                    continue  # Avoid duplicates

                new_state = deepcopy(current_state)
                if problem._is_valid_addition(new_state, att):  # Check if addition is valid
                    new_state['itinerary'][day_idx].append(att['name'])
                    new_state['total_cost'] += problem._parse_cost(att['cost'])
                    travel_time = problem._estimate_travel_time(current_state, att)
                    visit_time = problem._parse_duration(att['visit_duration'])
                    new_state['daily_time'][day_idx] += travel_time + visit_time
                    new_state['total_time'] += travel_time + visit_time  # Update total time

                    # Check if the new state is valid after addition
                    if (new_state['daily_time'][day_idx] <= constraints['max_daily_time'] and
                        new_state['total_cost'] <= constraints['max_total_budget']):
                        child_node = Node(
                            state=new_state,
                            parent=self,
                            action=("add", day_idx, att['name']),
                            path_cost=self.path_cost  # Update if needed
                        )
                        neighbors.append(child_node)

        return neighbors
    def generate_random_solution(self, problem: 'TourPlanningProblem') -> dict:
        """
        Generate a random initial solution for the tour planning problem.

        Args:
            problem: The tour planning problem instance.

        Returns:
            A random state representing a potential solution.
        """
        random_state = {
            'curr_day': 0,
            'itinerary': [[] for _ in range(7)],
            'total_cost': 0.0,
            'total_time': 0.0,
            'daily_time': [0.0 for _ in range(7)],
            'current_location': problem.initial_state['current_location'],
        }

        used_attractions = set()
        max_daily_time = problem.constraints['max_daily_time']
        max_total_budget = problem.constraints['max_total_budget']
        max_attractions_per_day = problem.constraints['max_attractions_per_day']

        for day in range(7):
            day_time = 0.0
            day_cost = 0.0
            attractions_today = 0

            while day_time < max_daily_time and attractions_today < max_attractions_per_day:
                # Create a list of candidates that haven't been used yet
                candidates = [
                    att['name'] for att in problem.attractions
                    if att['name'] not in used_attractions 
                ]
                if not candidates:
                    break  # No more candidates available

                # Randomly select an attraction from the candidates
                selected_name = random.choice(candidates)
                selected_attraction = next(att for att in problem.attractions if att['name'] == selected_name)
                visit_time = problem._parse_duration(selected_attraction['visit_duration'])
                attraction_cost = problem._parse_cost(selected_attraction['cost'])

                # Check if adding this attraction exceeds the daily time limit or total budget
                if day_time + visit_time > max_daily_time or day_cost + attraction_cost > max_total_budget:
                    break

                # Update the random state with the selected attraction
                random_state['itinerary'][day].append(selected_name)
                used_attractions.add(selected_name)
                day_cost += attraction_cost
                day_time += visit_time
                random_state['daily_time'][day] += visit_time
                random_state['total_time'] += visit_time
                random_state['total_cost'] += attraction_cost
                random_state['current_location'] = selected_attraction['gps']  # Update current location
                attractions_today += 1  # Increment the count of attractions for today

        return random_state
    def get_best(self,neighbors_list: List['Node'], problem: 'TourPlanningProblem') -> Tuple['Node', float]:
        """
        Get the neighbor with the best evaluation value.

        Args:
            neighbors_list: A list of Node instances.
            problem: Instance of TourPlanningProblem to evaluate nodes.

        Returns:
            A tuple of (best Node, its value)
        """
        best_value = float('-inf')
        best_node = None 

        for node in neighbors_list:
            # Compute or retrieve value
            if node.value is None:
                node.value = problem.value(node.state)

            if node.value > best_value:
                best_value = node.value
                best_node = node

        return best_node, best_value
    def suggest_hotels(self, problem, hotels_data, attractions_data):
        """Suggest hotels for the current itinerary"""
        return find_hotels_for_itinerary(
            self.state['itinerary'],
            attractions_data,
            hotels_data,
            problem.constraints['max_total_budget'],
            self.state['total_cost']
        ) 
    
# ========================================================================================





import math
from typing import List, Tuple, Dict
import json
def load_attractions(json_file: str) -> List[Dict]:
    """Load attractions from JSON file"""
    with open(json_file, encoding="utf-8") as f:
        return json.load(f) 

def create_initial_state(start_location: Tuple[float, float], user_prefs: Dict) -> Dict:
    """Create initial state dictionary"""
    return {
        'current_location': start_location,
        'itinerary': [[] for _ in range(7)],
        'curr_day': 0,
        'total_cost': 0.0,
        'total_time': 0.0,
        'daily_time': [0.0]*7,
        'daily_distance': [0.0]*7         
    }

def estimate_travel_time(distance_km: float,
                        transport_mode: str = 'car') -> float:
    """Convert distance to estimated travel time in hours"""
    speeds = {'car': 50, 'bus': 40, 'walking': 5}
    return distance_km / speeds.get(transport_mode, 50)

def calculate_day_time(itinerary_day: List[str],
                     attractions: List[Dict],
                     distance_matrix: Dict) -> float:
    """Calculate total time for a single day's itinerary"""
    total_time = 0
    for i in range(len(itinerary_day)):
        if i > 0:
            prev_att = next(a for a in attractions if a['name'] == itinerary_day[i-1])
            curr_att = next(a for a in attractions if a['name'] == itinerary_day[i])
            distance = distance_matrix[(prev_att['name'], curr_att['name'])]
            total_time += estimate_travel_time(distance)
        total_time += TourPlanningProblem._parse_duration(curr_att['visit_duration'])
    return total_time

def calculate_total_cost(itinerary: List[List[str]],
                       attractions: List[Dict]) -> float:
    """Calculate total cost of itinerary"""
    return sum(TourPlanningProblem._parse_cost(a['cost'])
              for day in itinerary
              for att_name in day
              for a in attractions if a['name'] == att_name)

def estimate_hotel_costs(hotel_standard: Tuple[int, int],
                        num_nights: int = 7) -> float:
    """Estimate hotel costs based on preferred star rating"""
    min_stars, max_stars = hotel_standard
    avg_stars = (min_stars + max_stars) / 2
    # Assuming 3000 DZD per night per star
    return avg_stars * 3000 * num_nights



def find_hotels_for_itinerary(itinerary, attractions_data, hotels_data, total_budget, spent_cost, min_stars=3, max_stars=5):
    """
    Find suitable hotels for cities in the itinerary within remaining budget.
    Returns a dictionary mapping days to list of suitable hotels (cheapest, middle, most expensive).
    Also returns the average total hotel cost.
    """
    # Calculate remaining budget and max price per night
    remaining_budget = total_budget - spent_cost
    max_price_per_night = remaining_budget / 7 if remaining_budget > 0 else 0
    
    hotels_by_day = {}
    total_hotel_cost = 0
    
    # Early warning if budget is exhausted
    if remaining_budget <= 0:
        print("⚠️ Budget Warning: All funds have been spent on attractions - no budget left for hotels")
        return {}, 0
    
    for day_idx in range(7):
        # Get city of last attraction that day
        day_city = None
        if day_idx < len(itinerary) and itinerary[day_idx]:
            last_att_name = itinerary[day_idx][-1]
            last_att = next((a for a in attractions_data if a['name'] == last_att_name), None)
            if last_att:
                day_city = last_att['city']
        
        if not day_city:
            # If no attractions that day, use previous day's city
            for d in range(day_idx-1, -1, -1):
                if d in hotels_by_day:
                    day_city = hotels_by_day[d][0]['city']
                    break
        
        if day_city:
            # Find suitable hotels in this city with strict star rating first
            suitable_hotels = [
                hotel for hotel in hotels_data 
                if hotel['city'].lower() == day_city.lower()
                and min_stars <= hotel['avg_review'] <= max_stars
                and hotel['price'] <= max_price_per_night
            ]
            
            # If none found, relax the star rating constraint
            if not suitable_hotels:
                suitable_hotels = [
                    hotel for hotel in hotels_data 
                    if hotel['city'].lower() == day_city.lower()
                    and hotel['price'] <= max_price_per_night
                ]
                # Sort by closest to desired star rating
                suitable_hotels.sort(key=lambda x: abs(x['avg_review'] - (min_stars + max_stars)/2))
                
                if not suitable_hotels:
                    print(f"⚠️ No hotels found in {day_city} within {max_price_per_night:.0f} DZD/night (even without star rating filter)")
                    continue
                else:
                    print(f"ℹ️ Found hotels in {day_city} but none match your {min_stars}-{max_stars} star preference")
                    print("   Showing best available options regardless of rating")
            
            # Sort by price
            suitable_hotels.sort(key=lambda x: x['price'])
            
            # Select 3 hotels: cheapest, middle, most expensive
            selected_hotels = []
            if len(suitable_hotels) >= 3:
                selected_hotels = [
                    suitable_hotels[0],  # cheapest
                    suitable_hotels[len(suitable_hotels)//2],  # middle
                    suitable_hotels[-1]  # most expensive
                ]
            elif suitable_hotels:
                selected_hotels = suitable_hotels
            
            if selected_hotels:
                # Calculate average price for these hotels
                avg_price = sum(h['price'] for h in selected_hotels) / len(selected_hotels)
                total_hotel_cost += avg_price
                
                hotels_by_day[day_idx+1] = selected_hotels
    
    # Final summary of hotel findings
    if not hotels_by_day:
        print("\n❌ No suitable hotels found for your entire itinerary")
        print(f"   Visited cities: {', '.join(set(a['city'] for day in itinerary for a in attractions_data if a['name'] in day))}")
        print(f"   Max price per night: {max_price_per_night:.0f} DZD")
        print(f"   Star preference: {min_stars}-{max_stars} stars")
    else:
        missing_days = [d for d in range(1,8) if d not in hotels_by_day]
        if missing_days:
            print(f"\n⚠️ Note: No hotels found for day(s) {', '.join(map(str, missing_days))}")
    
    return hotels_by_day, total_hotel_cost


# ============================================================================================

import heapq
from typing import Dict, Tuple

def a_star_search(problem: TourPlanningProblem) -> Node:
    """
    A* search algorithm to find an optimal itinerary.

    This function implements the A* search algorithm, which combines the cost to reach a state (g(n))
    with a heuristic estimate of the cost to reach the goal (h(n)) to efficiently explore the state space.

    Args:
        problem (TourPlanningProblem): The problem instance containing the initial state, attractions, user preferences, and constraints.

    Returns:
        Node: The goal node representing the optimal itinerary, or None if no valid itinerary is found.
    """
    # Initialize the root node with the initial state and zero path cost
    root = Node(problem.initial_state, path_cost=0.0)
    # Calculate the heuristic value for the root node
    h_root = heuristic(problem, root.state)
    # Set the initial value of the root node to be the heuristic value
    root.value = 0.25 * root.path_cost + h_root  # f(n) = g(n) + h(n)
    
    # Priority queue to store nodes to be explored, sorted by their value (f(n))
    frontier = []
    heapq.heappush(frontier, (root.value, id(root), root))
    
    # Dictionary to track the best (cost, heuristic) values for each state
    best_values = {state_to_key(root.state): (root.path_cost, h_root)}

    while frontier:
        # Pop the node with the lowest value from the frontier
        _, _, node = heapq.heappop(frontier)
        node_key = state_to_key(node.state)
        current_cost, current_h = best_values[node_key]

        # Skip if a better path to this state has already been found
        if node.path_cost > current_cost:
            continue

        # Check if the current node represents a complete itinerary
        if problem.is_goal(node.state):
            return node

        # Expand the current node to generate neighboring states
        for child in node.expand(problem):
            child_key = state_to_key(child.state)
            # Calculate the heuristic value for the child node
            new_h = heuristic(problem, child.state)
            new_cost = child.path_cost
            # Calculate the total cost (f(n)) for the child node
            f = new_cost + new_h

            # Update the best values if the child node has a lower cost or heuristic
            if child_key not in best_values or new_cost < best_values[child_key][0]:
                best_values[child_key] = (new_cost, new_h)
                child.value = f
                # Push the child node onto the frontier
                heapq.heappush(frontier, (f, id(child), child))

    # Return None if no valid itinerary is found
    return None

def heuristic(problem: TourPlanningProblem, state: Dict) -> float:
    """
    Heuristic function to estimate the cost to reach the goal from the given state.

    This heuristic combines several factors to guide the search towards an optimal solution:
    - Penalizing unused days to encourage filling all days.
    - Encouraging adding more attractions to the current day.
    - Estimating proximity costs for remaining attractions.
    - Considering the total cost to ensure proximity.
    - Encouraging attractions from preferred categories.
    - Rewarding states with more attractions on the current day.

    Args:
        problem (TourPlanningProblem): The problem instance containing the attractions and constraints.
        state (Dict): The current state dictionary.

    Returns:
        float: The heuristic value estimating the cost to reach the goal.
    """
    total_h = 0.0
    max_per_day = problem.constraints['max_attractions_per_day']
    remaining_days = 7 - state['curr_day']
    
    # Penalize for unused days to encourage filling all days
    total_h += remaining_days * 100  # Arbitrary penalty weight
    
    # If the current day isn't full, encourage adding more attractions
    if state['curr_day'] < len(state['itinerary']):
        curr_day_attractions = len(state['itinerary'][state['curr_day']])
        if curr_day_attractions < max_per_day:
            total_h -= (max_per_day - curr_day_attractions) * 200  # Increased bonus for adding more
    
    # Estimate proximity cost for remaining attractions
    if state['curr_day'] < len(state['itinerary']) and state['itinerary'][state['curr_day']]:
        last_attraction = state['itinerary'][state['curr_day']][-1]
        last_att = next(a for a in problem.attractions if a['name'] == last_attraction)
        last_coords = last_att['gps']
        
        avg_distance = sum(
            problem._calculate_distance(last_coords, a['gps'])
            for a in problem.attractions
            if a['name'] not in [att for day in state['itinerary'] for att in day]
        ) / len(problem.attractions)
        
        total_h += avg_distance * 5  # Decreased weight for proximity
    
    # Consider the cost to ensure proximity
    total_h += state['total_cost'] / 200  # Decreased weight for cost
    
    # Encourage attractions from preferred categories
    preferred_categories = set(problem.user_prefs.get('categories', []))
    if state['curr_day'] < len(state['itinerary']):
        current_day_attractions = state['itinerary'][state['curr_day']]
        for att_name in current_day_attractions:
            att = next(a for a in problem.attractions if a['name'] == att_name)
            if att['category'] in preferred_categories:
                total_h -= 100  # Increased bonus for preferred categories
    
    # Reward states with more attractions on the current day
    if state['curr_day'] < len(state['itinerary']):
        curr_day_attractions = len(state['itinerary'][state['curr_day']])
        total_h -= curr_day_attractions * 150  # Reward for more attractions per day
    
    return total_h

def state_to_key(state: Dict) -> Tuple:
    """
    Generate a unique key for the given state. The key should be a tuple of
    the current day and the itinerary, which is unique to each planning state.
    
    Args:
        state: The state dictionary
        
    Returns:
        A tuple that uniquely identifies the state
    """
    return (state['curr_day'], tuple(tuple(day) for day in state['itinerary']))

# ============================================================================================
# CSP-style constructive planner (time-limited greedy with constraints)

import time
import itertools
import collections

class TourCSP:
    def __init__(self, *, start_location, attractions, constraints, user_prefs):
        self.start_loc = start_location
        self.atts_full = attractions
        self.Kmax = constraints["max_attractions_per_day"]
        self.T_day_max = constraints["max_daily_time"]
        self.B_week_max = constraints["max_total_budget"]
        self.rate_km = 6.0 if constraints.get("has_car", False) else 10.0
        self.user_prefs = user_prefs

        # Quick look-ups
        self.coords = {a["name"]: a["gps"] for a in self.atts_full}
        self.visH = {a["name"]: self._parse_duration(a["visit_duration"]) for a in self.atts_full}
        self.ticket = {a["name"]: self._parse_cost(a["cost"]) for a in self.atts_full}
        self.rating = {a["name"]: a.get("rating", 3.0) for a in self.atts_full}
        self.category = {a["name"]: a.get("category", "Unknown") for a in self.atts_full}

        # Restrict POIs to preferred categories
        pref_cats = set(user_prefs.get("categories", []))
        self.pool = [a["name"] for a in self.atts_full if not pref_cats or a["category"] in pref_cats]
        
        # If too few attractions, add some others
        if len(self.pool) < 14:
            other_attractions = [a["name"] for a in self.atts_full if a["name"] not in self.pool]
            other_atts_sorted = sorted(other_attractions, key=lambda n: self.rating[n], reverse=True)
            self.pool.extend(other_atts_sorted[:14 - len(self.pool)])

        # Distance cache
        self.dist = {}
        names = list(self.pool)
        for i, n1 in enumerate(names):
            for n2 in names[i+1:]:
                d = self._haversine(self.coords[n1], self.coords[n2])
                self.dist[(n1, n2)] = d
                self.dist[(n2, n1)] = d
            self.dist[(None, n1)] = self.dist[(n1, None)] = self._haversine(self.start_loc, self.coords[n1])

        # Pre-compute domain tuples
        self.domain_template = self._build_domain_tuples()
        self.domain_template.sort(key=self._tuple_value, reverse=True)

    def _haversine(self, c1, c2):
        lat1, lon1 = map(math.radians, c1)
        lat2, lon2 = map(math.radians, c2)
        dlat, dlon = lat2 - lat1, lon2 - lon1
        a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
        return 6371 * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    def _parse_duration(self, txt: str) -> float:
        txt = txt.lower()
        m = re.match(r"(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?\s*(?:h|hour|hrs?)", txt)
        if not m:
            return 2.0
        lo = float(m.group(1))
        hi = float(m.group(2)) if m.group(2) else lo
        return (lo + hi) / 2.0

    def _parse_cost(self, txt: str) -> float:
        txt = txt.lower()
        if "free" in txt or "variable" in txt:
            return 0.0
        m = re.search(r"(\d+(?:\.\d+)?)", txt)
        return float(m.group(1)) if m else 0.0

    def _tuple_metrics(self, seq):
        """Return (internal_time, internal_cost, internal_distance) of an ordered POI sequence."""
        if not seq:
            return 0.0, 0.0, 0.0
        t = sum(self.visH[a] for a in seq)
        c = sum(self.ticket[a] for a in seq)
        dist = 0.0
        for i in range(1, len(seq)):
            d = self.dist.get((seq[i-1], seq[i]), 0.0)
            t += d / 50.0
            c += d * self.rate_km
            dist += d
        return t, c, dist

    def _tuple_value(self, tup):
        length_value = len(tup["seq"]) * 1000
        rating_value = sum(self.rating[name] for name in tup["seq"]) * 100
        pref_cats = set(self.user_prefs.get("categories", []))
        category_value = sum(50 if self.category[name] in pref_cats else 0 for name in tup["seq"])
        efficiency = len(tup["seq"]) / (tup["time"] + 1e-6) * 200
        return length_value + rating_value + category_value + efficiency

    def _build_domain_tuples(self):
        tuples = []
        attractions_by_city = collections.defaultdict(list)
        for name in self.pool:
            city = next((a["city"] for a in self.atts_full if a["name"] == name), "Unknown")
            attractions_by_city[city].append(name)
        
        for city, city_attractions in attractions_by_city.items():
            for k in range(1, min(self.Kmax + 1, len(city_attractions) + 1)):
                if k <= 3 or len(city_attractions) <= 5:
                    for seq in itertools.permutations(city_attractions, k):
                        time_h, cost, dist = self._tuple_metrics(seq)
                        if time_h <= self.T_day_max:
                            tuples.append({
                                "seq": seq,
                                "set": set(seq),
                                "time": time_h,
                                "cost": cost,
                                "distance": dist
                            })
                else:
                    for _ in range(min(100, math.factorial(len(city_attractions)) // math.factorial(len(city_attractions) - k))):
                        seq = tuple(random.sample(city_attractions, k))
                        time_h, cost, dist = self._tuple_metrics(seq)
                        if time_h <= self.T_day_max:
                            tuples.append({
                                "seq": seq,
                                "set": set(seq),
                                "time": time_h,
                                "cost": cost,
                                "distance": dist
                            })
        
        if len(attractions_by_city) > 1:
            for k in range(2, self.Kmax + 1):
                for _ in range(min(200, len(self.pool)**2)):
                    seq = tuple(random.sample(self.pool, k))
                    time_h, cost, dist = self._tuple_metrics(seq)
                    if time_h <= self.T_day_max:
                        tuples.append({
                            "seq": seq,
                            "set": set(seq),
                            "time": time_h,
                            "cost": cost,
                            "distance": dist
                        })
        
        return tuples

    def solve(self):
        assignment = [None] * 7
        domains = [self.domain_template[:] for _ in range(7)]
        used = set()
        spent = 0.0
        current_location = self.start_loc

        def backtrack(depth, spent, used, current_location):
            if depth == 7:
                return assignment, spent

            unassigned = [d for d in range(7) if assignment[d] is None]
            day = min(unassigned, key=lambda d: len(domains[d]))

            sorted_dom = sorted(domains[day], key=lambda t: self._haversine(current_location, self.coords[t["seq"][0]]) if t["seq"] else float('inf'))

            for tup in sorted_dom:
                if tup["set"] & used:
                    continue

                first_attr = tup["seq"][0] if tup["seq"] else None
                if first_attr:
                    travel_dist = self._haversine(current_location, self.coords[first_attr])
                    travel_time = travel_dist / 50.0
                    travel_cost = travel_dist * self.rate_km
                    total_time_d = travel_time + tup["time"]
                    total_cost_d = travel_cost + tup["cost"]
                else:
                    total_time_d = 0.0
                    total_cost_d = 0.0

                if total_time_d > self.T_day_max:
                    continue
                if spent + total_cost_d > self.B_week_max:
                    continue

                assignment[day] = tup
                new_spent = spent + total_cost_d
                new_used = used | tup["set"]
                new_current_location = self.coords[tup["seq"][-1]] if tup["seq"] else current_location

                new_domains = [list(filter(lambda t: not (t["set"] & tup["set"]), domains[d])) for d in range(7)]
                if all(new_domains[d] or assignment[d] is not None for d in range(7)):
                    result = backtrack(depth + 1, new_spent, new_used, new_current_location)
                    if result:
                        return result

                assignment[day] = None

            return None

        result = backtrack(0, 0.0, set(), current_location)
        if result:
            assign, spent_total = result
            itinerary = [tup["seq"] for tup in assign]
            daily_time = [self._calculate_daily_time(tup, assign[i-1] if i > 0 else None) for i, tup in enumerate(assign)]
            daily_distance = [self._calculate_daily_distance(tup, assign[i-1] if i > 0 else None) for i, tup in enumerate(assign)]
            return {
                "current_location": self.start_loc,
                "itinerary": itinerary,
                "curr_day": 7,
                "total_cost": spent_total,
                "total_time": sum(daily_time),
                "daily_time": daily_time,
                "daily_distance": daily_distance
            }
        return None

    def _calculate_daily_time(self, tup, prev_tup):
        if not tup["seq"]:
            return 0.0
        start_loc = self.start_loc if prev_tup is None else self.coords[prev_tup["seq"][-1]]
        travel_time = self._haversine(start_loc, self.coords[tup["seq"][0]]) / 50.0
        return travel_time + tup["time"]

    def _calculate_daily_distance(self, tup, prev_tup):
        if not tup["seq"]:
            return 0.0
        start_loc = self.start_loc if prev_tup is None else self.coords[prev_tup["seq"][-1]]
        travel_dist = self._haversine(start_loc, self.coords[tup["seq"][0]])
        return travel_dist + tup["distance"]

def csp_constructive_plan(problem: TourPlanningProblem, time_limit_sec: float = 10.0) -> Node:
    """
    Build a feasible 7-day itinerary using the full CSP algorithm with time limiting.
    Falls back to A* if CSP takes too long or fails to find a solution.
    
    Args:
        problem: The tour planning problem instance
        time_limit_sec: Maximum time to spend on CSP before falling back to A*
        
    Returns:
        Node with complete itinerary or None if no solution found
    """
    start_time = time.time()
    
    try:
        # Create CSP instance
        csp = TourCSP(
            start_location=problem.initial_state['current_location'],
            attractions=problem.attractions,
            constraints=problem.constraints,
            user_prefs=problem.user_prefs
        )
        
        # Try CSP solve with time limit
        csp_result = csp.solve()
        
        if csp_result and (time.time() - start_time) < time_limit_sec:
            # Convert CSP result to Node format
            node = Node(
                state=csp_result,
                parent=None,
                action=None,
                path_cost=csp_result['total_cost']
            )
            node.value = problem.value(csp_result)
            return node
        else:
            # CSP took too long or failed, fall back to A*
            print(f"CSP took too long or failed, falling back to A* after {time.time() - start_time:.2f}s")
            return None
            
    except Exception as e:
        print(f"CSP failed with error: {e}, falling back to A*")
        return None