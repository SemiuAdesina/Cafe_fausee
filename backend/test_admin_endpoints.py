#!/usr/bin/env python3
"""
Test admin endpoints with proper session management
"""

import requests
import json
from datetime import datetime, timedelta

def test_admin_endpoints():
    """Test admin endpoints with session management"""
    print("🔐 Testing Admin Endpoints with Session Management")
    print("=" * 60)
    
    # Create a session to maintain cookies and disable proxy
    session = requests.Session()
    session.proxies = {
        'http': None,
        'https': None
    }
    
    base_url = "http://localhost:5001"
    
    # Test 1: Admin Login
    print("\n1️⃣ Testing Admin Login...")
    login_data = {
        "username": "Damoz1059",
        "password": "Face$mask01"
    }
    
    try:
        response = session.post(
            f"{base_url}/api/admin/login",
            json=login_data,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Login Successful")
            print(f"Response: {response.json()}")
        else:
            print("❌ Login Failed")
            print(f"Error: {response.text}")
            return
            
    except Exception as e:
        print(f"❌ Login Request Failed: {e}")
        return
    
    # Test 2: Get All Reservations (Admin Only)
    print("\n2️⃣ Testing Get All Reservations (Admin Only)...")
    try:
        response = session.get(
            f"{base_url}/api/reservations/all",
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Get All Reservations Successful")
            data = response.json()
            print(f"Found {len(data)} reservations")
            if data:
                print("Sample reservation:", json.dumps(data[0], indent=2))
        else:
            print("❌ Get All Reservations Failed")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Get Reservations Request Failed: {e}")
    
    # Test 3: Get All Newsletter Signups (Admin Only)
    print("\n3️⃣ Testing Get All Newsletter Signups (Admin Only)...")
    try:
        response = session.get(
            f"{base_url}/api/newsletter/all",
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Get All Newsletter Signups Successful")
            data = response.json()
            print(f"Found {len(data)} newsletter signups")
            if data:
                print("Sample signup:", json.dumps(data[0], indent=2))
        else:
            print("❌ Get All Newsletter Signups Failed")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Get Newsletter Request Failed: {e}")
    
    # Test 4: Export Reservations CSV (Admin Only)
    print("\n4️⃣ Testing Export Reservations CSV (Admin Only)...")
    try:
        response = session.get(
            f"{base_url}/api/reservations/export",
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Export Reservations CSV Successful")
            print(f"CSV Content Length: {len(response.text)} characters")
            print("First 200 characters of CSV:")
            print(response.text[:200])
        else:
            print("❌ Export Reservations CSV Failed")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Export CSV Request Failed: {e}")
    
    # Test 5: Export Newsletter CSV (Admin Only)
    print("\n5️⃣ Testing Export Newsletter CSV (Admin Only)...")
    try:
        response = session.get(
            f"{base_url}/api/newsletter/export",
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Export Newsletter CSV Successful")
            print(f"CSV Content Length: {len(response.text)} characters")
            print("First 200 characters of CSV:")
            print(response.text[:200])
        else:
            print("❌ Export Newsletter CSV Failed")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Export Newsletter CSV Request Failed: {e}")
    
    # Test 6: Admin Logout
    print("\n6️⃣ Testing Admin Logout...")
    try:
        response = session.post(
            f"{base_url}/api/admin/logout",
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Logout Successful")
            print(f"Response: {response.json()}")
        else:
            print("❌ Logout Failed")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Logout Request Failed: {e}")
    
    print("\n🎉 Admin Endpoint Testing Complete!")
    print("\n💡 Note: These tests use session cookies to maintain admin login state.")

if __name__ == "__main__":
    test_admin_endpoints() 