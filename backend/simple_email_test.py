#!/usr/bin/env python3
"""
Simple email endpoint testing script
"""
import requests
import json
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

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
        response = requests.post(
            f"http://localhost:5001{endpoint}", 
            json=data, 
            timeout=10,
            proxies=proxies
        )
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
    print("🚀 Testing Email Endpoints (No Proxy)")
    print("=" * 50)
    
    # Get test email from environment
    test_email = os.getenv('MAIL_USERNAME')
    if not test_email:
        print("❌ Error: MAIL_USERNAME not found in environment variables")
        print("Please make sure your .env file contains MAIL_USERNAME=your-email@example.com")
        return
    
    print(f"📧 Using test email: {test_email}")
    
    # Test data
    future_time = (datetime.now() + timedelta(days=1)).isoformat()
    reservation_data = {
        "id": 999,
        "customer_name": "John Doe",
        "email": test_email,
        "phone": "(555) 123-4567",
        "time_slot": future_time,
        "table_number": 15,
        "number_of_guests": 4
    }
    
    # Test 1: Email Service Test
    test_email_endpoint(
        "/api/email/test",
        {"email": test_email, "test": True},
        "Email Service Test"
    )
    
    # Test 2: Reservation Confirmation
    test_email_endpoint(
        "/api/email/reservation-confirmation",
        reservation_data,
        "Reservation Confirmation Email"
    )
    
    # Test 3: Reservation Cancellation
    test_email_endpoint(
        "/api/email/reservation-cancellation",
        reservation_data,
        "Reservation Cancellation Email"
    )
    
    # Test 4: Reservation Update
    test_email_endpoint(
        "/api/email/reservation-update",
        reservation_data,
        "Reservation Update Email"
    )
    
    # Test 5: Newsletter Welcome
    test_email_endpoint(
        "/api/email/newsletter-welcome",
        {"email": test_email},
        "Newsletter Welcome Email"
    )
    
    # Test 6: Admin Notification
    test_email_endpoint(
        "/api/email/admin-notification",
        reservation_data,
        "Admin Notification Email"
    )
    
    print("\n🎉 Email Endpoint Testing Complete!")
    print(f"\n📧 Check {test_email} inbox for test messages.")
    print("💡 If you don't receive emails, check:")
    print("   1. Gmail credentials in .env file")
    print("   2. Gmail app password is correct")
    print("   3. Less secure app access is enabled")

if __name__ == "__main__":
    main() 