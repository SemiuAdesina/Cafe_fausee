#!/usr/bin/env python3
"""
Test script for email endpoints
"""

import requests
import json
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
BASE_URL = "http://localhost:5001"

# Get test email from environment
TEST_EMAIL = os.getenv('MAIL_USERNAME', 'test@example.com')

# Disable proxy for requests
proxies = {
    'http': None,
    'https': None
}

def test_email_endpoint(endpoint, data, description):
    """Test a specific email endpoint"""
    print(f"\n🧪 Testing: {description}")
    print(f"Endpoint: {endpoint}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(f"{BASE_URL}{endpoint}", json=data, timeout=10, proxies=proxies)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ SUCCESS")
            print(f"Response: {response.json()}")
        else:
            print("❌ FAILED")
            print(f"Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ REQUEST FAILED: {e}")
    
    print("-" * 50)

def main():
    print("🚀 Testing Email Endpoints")
    print("=" * 50)
    
    # Test data for reservation
    future_time = (datetime.now() + timedelta(days=1)).isoformat()
    reservation_data = {
        "id": 999,
        "customer_name": "John Doe",
        "email": TEST_EMAIL,
        "phone": "(555) 123-4567",
        "time_slot": future_time,
        "table_number": 15,
        "number_of_guests": 4
    }
    
    # Test 1: Reservation Confirmation
    test_email_endpoint(
        "/api/email/reservation-confirmation",
        reservation_data,
        "Reservation Confirmation Email"
    )
    
    # Test 2: Reservation Cancellation
    test_email_endpoint(
        "/api/email/reservation-cancellation",
        reservation_data,
        "Reservation Cancellation Email"
    )
    
    # Test 3: Reservation Update
    test_email_endpoint(
        "/api/email/reservation-update",
        reservation_data,
        "Reservation Update Email"
    )
    
    # Test 4: Newsletter Welcome
    test_email_endpoint(
        "/api/email/newsletter-welcome",
        {"email": TEST_EMAIL},
        "Newsletter Welcome Email"
    )
    
    # Test 5: Admin Notification
    test_email_endpoint(
        "/api/email/admin-notification",
        reservation_data,
        "Admin Notification Email"
    )
    
    # Test 6: Email Service Test
    test_email_endpoint(
        "/api/email/test",
        {"email": TEST_EMAIL, "test": True},
        "Email Service Test"
    )
    
    print("\n🎉 Email Endpoint Testing Complete!")
    print("\n📧 Check your email inbox for test messages.")
    print("💡 If you don't receive emails, check:")
    print("   1. Gmail credentials in .env file")
    print("   2. Gmail app password is correct")
    print("   3. Less secure app access is enabled")
    print("   4. Firewall/network restrictions")

if __name__ == "__main__":
    main() 