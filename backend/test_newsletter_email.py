#!/usr/bin/env python3
"""
Test script for newsletter email functionality
"""
import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_newsletter_email():
    """Test the newsletter welcome email endpoint"""
    
    # Get email from environment variables
    test_email = os.getenv('MAIL_USERNAME')
    
    if not test_email:
        print("❌ Error: MAIL_USERNAME not found in environment variables")
        print("Please make sure your .env file contains MAIL_USERNAME=your-email@example.com")
        return
    
    # Test data - use email from env file
    test_data = {
        "email": test_email
    }
    
    # Test the newsletter welcome endpoint
    url = "http://localhost:5001/api/email/newsletter-welcome"
    
    try:
        print("Testing newsletter welcome email...")
        print(f"URL: {url}")
        print(f"Email from env: {test_email}")
        print(f"Data: {json.dumps(test_data, indent=2)}")
        
        response = requests.post(
            url,
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Newsletter email test successful!")
            print(f"Check {test_email} inbox and spam folder for the welcome email.")
        else:
            print("❌ Newsletter email test failed!")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    test_newsletter_email() 