from flask import Blueprint, request, jsonify, session, Response
from app.models import db, Newsletter
from datetime import datetime
import re
import requests

newsletter_bp = Blueprint('newsletter', __name__)

@newsletter_bp.route('/', methods=['GET'])
def test_newsletter():
    return {"message": "Newsletter endpoint is working!"}, 200

@newsletter_bp.route('/', methods=['POST'])
def signup_newsletter():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required.'}), 400
    email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    if not re.match(email_regex, email):
        return jsonify({'error': 'Invalid email format.'}), 400
    if Newsletter.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already signed up.'}), 409
    newsletter = Newsletter(email=email, signup_date=datetime.now())
    db.session.add(newsletter)
    db.session.commit()
    
    # Send welcome email
    try:
        print(f"Attempting to send welcome email to: {email}")
        email_data = {'email': email}
        
        # Disable proxy for internal requests
        proxies = {
            'http': None,
            'https': None
        }
        
        response = requests.post(
            'http://localhost:5001/api/email/newsletter-welcome', 
            json=email_data, 
            timeout=10,
            headers={'Content-Type': 'application/json'},
            proxies=proxies
        )
        
        if response.status_code == 200:
            print(f"✅ Welcome email sent successfully to: {email}")
        else:
            print(f"❌ Failed to send welcome email. Status: {response.status_code}, Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request error sending welcome email: {e}")
    except Exception as e:
        print(f"❌ Unexpected error sending welcome email: {e}")
    
    return jsonify({'message': 'Signed up for newsletter successfully.'}), 201

@newsletter_bp.route('/all', methods=['GET'])
def get_all_newsletter_signups():
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    signups = Newsletter.query.all()
    return jsonify([
        {'id': n.id, 'email': n.email, 'signup_date': n.signup_date.isoformat() if n.signup_date else None}
        for n in signups
    ]), 200

@newsletter_bp.route('/export', methods=['GET'])
def export_newsletter_csv():
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    signups = Newsletter.query.all()
    csv_data = 'id,email,signup_date\n'
    for n in signups:
        csv_data += f'{n.id},{n.email},{n.signup_date.isoformat() if n.signup_date else ""}\n'
    return Response(
        csv_data,
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment;filename=newsletter_signups.csv'}
    )
