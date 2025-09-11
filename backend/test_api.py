#!/usr/bin/env python3
"""
Test script for the AI Touristic Tour Recommendation API

This script tests all API endpoints to ensure they work correctly.
Run this after starting the Flask server to verify functionality.

Usage:
    python test_api.py
"""

import requests
import json
import time
from typing import Dict, Any

# API base URL
BASE_URL = "http://localhost:5000/api"

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data['status']}")
            print(f"   Attractions loaded: {data['attractions_loaded']}")
            print(f"   Hotels loaded: {data['hotels_loaded']}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {str(e)}")
        return False

def test_get_categories():
    """Test the categories endpoint"""
    print("\nTesting categories endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/categories")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Categories retrieved: {len(data['categories'])} categories")
            print(f"   Sample categories: {data['categories'][:5]}")
            return True
        else:
            print(f"❌ Categories failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Categories error: {str(e)}")
        return False

def test_get_wilayas():
    """Test the wilayas endpoint"""
    print("\nTesting wilayas endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/wilayas")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Wilayas retrieved: {len(data['wilayas'])} wilayas")
            print(f"   Sample wilayas: {data['wilayas'][:5]}")
            return True
        else:
            print(f"❌ Wilayas failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Wilayas error: {str(e)}")
        return False

def test_get_attractions():
    """Test the attractions endpoint"""
    print("\nTesting attractions endpoint...")
    try:
        # Test without filters
        response = requests.get(f"{BASE_URL}/attractions?limit=5")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Attractions retrieved: {data['count']} attractions")
            return True
        else:
            print(f"❌ Attractions failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Attractions error: {str(e)}")
        return False

def test_generate_itinerary():
    """Test the itinerary generation endpoint"""
    print("\nTesting itinerary generation endpoint...")
    
    # Test data
    test_data = {
        "wilaya": "Algiers",
        "location": "36.737232, 3.086472",
        "activities": ["Museum", "Historical"],
        "budget": 50000,
        "minHotelStars": 3,
        "maxHotelStars": 4,
        "maxAttractions": 2,
        "maxTravelHours": 6.0,
        "hasCar": True
    }
    
    try:
        print(f"   Sending request with data: {test_data}")
        response = requests.post(
            f"{BASE_URL}/itinerary/generate",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("data", {}).get("success"):
                result = data["data"]
                print(f"✅ Itinerary generated successfully!")
                print(f"   Title: {result['title']}")
                print(f"   Total Budget: {result['totalBudget']} DZD")
                print(f"   Total Time: {result['totalTime']} hours")
                print(f"   Hotel Cost: {result['hotelCost']} DZD")
                print(f"   Satisfaction: {result['satisfaction']}%")
                print(f"   Days planned: {len(result['days'])}")
                
                # Show first day details
                if result['days']:
                    first_day = result['days'][0]
                    print(f"   First day activities: {len(first_day['activities'])}")
                    for activity in first_day['activities'][:2]:  # Show first 2 activities
                        print(f"     - {activity['time']}: {activity['title']}")
                
                return True
            else:
                print(f"❌ Itinerary generation failed: {data}")
                return False
        else:
            print(f"❌ Itinerary generation failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Itinerary generation error: {str(e)}")
        return False

def test_error_handling():
    """Test error handling with invalid data"""
    print("\nTesting error handling...")
    
    # Test with missing required fields
    invalid_data = {
        "wilaya": "Algiers",
        # Missing location, activities, budget
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/itinerary/generate",
            json=invalid_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 400:
            data = response.json()
            print(f"✅ Error handling works: {data['error']}")
            return True
        else:
            print(f"❌ Error handling failed: Expected 400, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error handling test error: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting API Tests for AI Touristic Tour Recommendation System")
    print("=" * 70)
    
    # Wait a moment for server to be ready
    print("Waiting for server to be ready...")
    time.sleep(2)
    
    tests = [
        test_health_check,
        test_get_categories,
        test_get_wilayas,
        test_get_attractions,
        test_generate_itinerary,
        test_error_handling
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        time.sleep(1)  # Small delay between tests
    
    print("\n" + "=" * 70)
    print(f"🏁 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The API is working correctly.")
    else:
        print("⚠️  Some tests failed. Please check the server logs and try again.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
