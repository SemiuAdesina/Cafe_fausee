from flask import Blueprint, request, jsonify, session, Response
from app.models import db, Newsletter
from datetime import datetime
import re
from flask_mail import Message
from app import mail

newsletter_bp = Blueprint('newsletter', __name__)

def send_welcome_email(email):
    """Send welcome email to new newsletter subscribers"""
    try:
        subject = "Welcome to Café Fausse Newsletter!"
        
        body = f"""
Welcome to the Café Fausse family!

Thank you for subscribing to our newsletter. You'll be the first to know about:

• Special events and promotions
• New menu items and seasonal dishes
• Exclusive dining experiences
• Behind-the-scenes stories from our kitchen

We're excited to share our passion for exceptional dining with you!

Best regards,
The Café Fausse Team
        """
        
        html_body = f"""
        <html>
        <body>
            <h2>Welcome to the Café Fausse Family!</h2>
            <p>Thank you for subscribing to our newsletter. You'll be the first to know about:</p>
            <ul>
                <li>Special events and promotions</li>
                <li>New menu items and seasonal dishes</li>
                <li>Exclusive dining experiences</li>
                <li>Behind-the-scenes stories from our kitchen</li>
            </ul>
            <p>We're excited to share our passion for exceptional dining with you!</p>
            <p>Best regards,<br>The Café Fausse Team</p>
        </body>
        </html>
        """
        
        msg = Message(
            subject=subject,
            recipients=[email],
            body=body,
            html=html_body
        )
        mail.send(msg)
        print(f"✅ Welcome email sent successfully to: {email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send welcome email: {e}")
        return False

@newsletter_bp.route('/test-email', methods=['GET'])
def test_email_config():
    """Test email configuration"""
    try:
        from app import mail
        from flask_mail import Message
        import os
        
        # Check environment variables
        mail_server = os.getenv('MAIL_SERVER')
        mail_username = os.getenv('MAIL_USERNAME')
        mail_password = os.getenv('MAIL_PASSWORD')
        
        config_status = {
            'mail_server': mail_server,
            'mail_username': mail_username is not None,
            'mail_password': mail_password is not None,
            'mail_app': mail is not None
        }
        
        return jsonify({
            'message': 'Email configuration test',
            'config': config_status
        }), 200
    except Exception as e:
        return jsonify({
            'error': f'Email configuration test failed: {str(e)}'
        }), 500

@newsletter_bp.route('/', methods=['GET'])
def test_newsletter():
    return {"message": "Newsletter endpoint is working!"}, 200

@newsletter_bp.route('/', methods=['POST'])
def signup_newsletter():
    try:
        data = request.get_json()
        email = data.get('email')
        if not email:
            return jsonify({'error': 'Email is required.'}), 400
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_regex, email):
            return jsonify({'error': 'Invalid email format.'}), 400
        if Newsletter.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already signed up.'}), 409
        
        # Create newsletter signup
        newsletter = Newsletter(email=email, signup_date=datetime.now())
        db.session.add(newsletter)
        db.session.commit()
        
        # Try to send welcome email (but don't fail if it doesn't work)
        try:
            print(f"Attempting to send welcome email to: {email}")
            send_welcome_email(email)
        except Exception as email_error:
            print(f"❌ Email sending failed but signup succeeded: {email_error}")
            # Continue with success response even if email fails
        
        return jsonify({'message': 'Signed up for newsletter successfully.'}), 201
    except Exception as e:
        print(f"❌ Newsletter signup error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

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
