#!/usr/bin/env python3
"""
Startup script for the AI Touristic Tour Recommendation Backend

This script starts the Flask server with proper configuration and logging.
It also performs basic health checks before starting.

Usage:
    py run_server.py [--port PORT] [--debug]
"""

import sys
import os
import argparse
import time
from app import app, load_data

def check_dependencies():
    """Check if all required dependencies are available"""
    try:
        import flask
        import flask_cors
        print("✅ All dependencies are available")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please install requirements: pip install -r requirements.txt")
        return False

def check_data_files():
    """Check if required data files exist"""
    data_dir = os.path.join(os.path.dirname(__file__), "..", "Data")
    attractions_file = os.path.join(data_dir, "attractions.json")
    hotels_file = os.path.join(data_dir, "cleaned_hotels.json")
    
    if not os.path.exists(attractions_file):
        print(f"❌ Attractions file not found: {attractions_file}")
        return False
    
    if not os.path.exists(hotels_file):
        print(f"❌ Hotels file not found: {hotels_file}")
        return False
    
    print("✅ All data files are available")
    return True

def test_server_startup(port=5000, timeout=10):
    """Test if the server starts successfully"""
    print(f"Testing server startup on port {port}...")
    
    try:
        # Start server in a separate thread for testing
        import threading
        import time
        
        def run_server():
            app.run(host="0.0.0.0", port=port, debug=False, use_reloader=False)
        
        server_thread = threading.Thread(target=run_server, daemon=True)
        server_thread.start()
        
        # Wait for server to start
        time.sleep(3)
        
        # Test health endpoint
        try:
            import requests
            response = requests.get(f"http://localhost:{port}/api/health", timeout=5)
            if response.status_code == 200:
                print("✅ Server started successfully")
                return True
            else:
                print(f"❌ Server health check failed: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"❌ Server not responding: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Server startup test failed: {e}")
        return False

def main():
    """Main startup function"""
    parser = argparse.ArgumentParser(description="Start the AI Touristic Tour Recommendation Backend")
    parser.add_argument("--port", type=int, default=5000, help="Port to run the server on (default: 5000)")
    parser.add_argument("--debug", action="store_true", help="Enable debug mode")
    parser.add_argument("--test", action="store_true", help="Run tests before starting")
    parser.add_argument("--skip-checks", action="store_true", help="Skip startup checks")
    
    args = parser.parse_args()
    
    print("🚀 Starting AI Touristic Tour Recommendation Backend")
    print("=" * 60)
    
    # Run startup checks unless skipped
    if not args.skip_checks:
        print("Running startup checks...")
        
        if not check_dependencies():
            sys.exit(1)
        
        if not check_data_files():
            sys.exit(1)
        
        print("✅ All startup checks passed")
    
    # Load data
    print("Loading data...")
    try:
        load_data()
        print("✅ Data loaded successfully")
    except Exception as e:
        print(f"❌ Failed to load data: {e}")
        sys.exit(1)
    
    # Run tests if requested
    if args.test:
        print("\nRunning API tests...")
        try:
            import subprocess
            result = subprocess.run([sys.executable, "test_api.py"], 
                                  capture_output=True, text=True, timeout=60)
            if result.returncode == 0:
                print("✅ All tests passed")
            else:
                print(f"❌ Tests failed: {result.stdout}")
                print(f"Error output: {result.stderr}")
                sys.exit(1)
        except subprocess.TimeoutExpired:
            print("❌ Tests timed out")
            sys.exit(1)
        except Exception as e:
            print(f"❌ Test execution failed: {e}")
            sys.exit(1)
    
    # Start the server
    print(f"\n🌐 Starting server on port {args.port}")
    print(f"   Debug mode: {'ON' if args.debug else 'OFF'}")
    print(f"   Health check: http://localhost:{args.port}/api/health")
    print(f"   API docs: http://localhost:{args.port}/api/")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 60)
    
    try:
        app.run(
            host="0.0.0.0",
            port=args.port,
            debug=args.debug,
            use_reloader=args.debug
        )
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
