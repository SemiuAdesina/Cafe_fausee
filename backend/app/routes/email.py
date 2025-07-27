from flask import Blueprint, request, jsonify
from flask_mail import Message
from app import mail
import os
from datetime import datetime

email_bp = Blueprint('email', __name__)

def send_email(subject, recipients, body, html_body=None):
    """Helper function to send emails"""
    try:
        msg = Message(
            subject=subject,
            recipients=recipients,
            body=body,
            html=html_body
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False

@email_bp.route('/api/email/test', methods=['POST'])
def test_email_service():
    """Test email service functionality"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'error': 'Email is required for test'}), 400
            
        test_email = data.get('email')
        
        subject = "Email Service Test - Café Fausse"
        body = "This is a test email from the Café Fausse email service."
        
        msg = Message(subject=subject, recipients=[test_email], body=body)
        mail.send(msg)
        
        return jsonify({
            'message': 'Test email sent successfully',
            'test_email': test_email,
            'status': 'operational'
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Test email failed: {str(e)}'}), 500

@email_bp.route('/api/email/reservation-confirmation', methods=['POST'])
def send_reservation_confirmation():
    """Send reservation confirmation email to customer"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'error': 'Email is required'}), 400
        
        # Parse datetime
        time_slot = data.get('time_slot')
        if time_slot:
            try:
                dt = datetime.fromisoformat(time_slot.replace('Z', '+00:00'))
                formatted_time = dt.strftime('%B %d, %Y at %I:%M %p')
            except:
                formatted_time = time_slot
        else:
            formatted_time = "TBD"
        
        subject = f"Reservation Confirmed - Café Fausse"
        
        # Plain text version
        body = f"""
Dear {data.get('customer_name', 'Valued Customer')},

Your reservation has been confirmed!

Reservation Details:
- Date & Time: {formatted_time}
- Number of Guests: {data.get('number_of_guests')}
- Table Number: {data.get('table_number')}
- Reservation ID: {data.get('id')}

We look forward to serving you at Café Fausse!

Best regards,
The Café Fausse Team
        """
        
        # HTML version
        html_body = f"""
        <html>
        <body>
            <h2>Reservation Confirmed - Café Fausse</h2>
            <p>Dear {data.get('customer_name', 'Valued Customer')},</p>
            <p>Your reservation has been confirmed!</p>
            <h3>Reservation Details:</h3>
            <ul>
                <li><strong>Date & Time:</strong> {formatted_time}</li>
                <li><strong>Number of Guests:</strong> {data.get('number_of_guests')}</li>
                <li><strong>Table Number:</strong> {data.get('table_number')}</li>
                <li><strong>Reservation ID:</strong> {data.get('id')}</li>
            </ul>
            <p>We look forward to serving you at Café Fausse!</p>
            <p>Best regards,<br>The Café Fausse Team</p>
        </body>
        </html>
        """
        
        success = send_email(subject, [data['email']], body, html_body)
        
        if success:
            return jsonify({'message': 'Reservation confirmation email sent successfully'}), 200
        else:
            return jsonify({'error': 'Failed to send email'}), 500
        
    except Exception as e:
        return jsonify({'error': f'Email sending failed: {str(e)}'}), 500

@email_bp.route('/api/email/reservation-cancellation', methods=['POST'])
def send_reservation_cancellation():
    """Send reservation cancellation email to customer"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'error': 'Email is required'}), 400
        
        # Parse datetime
        time_slot = data.get('time_slot')
        if time_slot:
            try:
                dt = datetime.fromisoformat(time_slot.replace('Z', '+00:00'))
                formatted_time = dt.strftime('%B %d, %Y at %I:%M %p')
            except:
                formatted_time = time_slot
        else:
            formatted_time = "TBD"
        
        subject = f"Reservation Cancelled - Café Fausse"
        
        body = f"""
Dear {data.get('customer_name', 'Valued Customer')},

Your reservation has been cancelled.

Cancelled Reservation Details:
- Date & Time: {formatted_time}
- Number of Guests: {data.get('number_of_guests')}
- Table Number: {data.get('table_number')}
- Reservation ID: {data.get('id')}

If you have any questions, please contact us at (202) 555-4567.

We hope to see you again soon!

Best regards,
The Café Fausse Team
        """
        
        html_body = f"""
        <html>
        <body>
            <h2>Reservation Cancelled - Café Fausse</h2>
            <p>Dear {data.get('customer_name', 'Valued Customer')},</p>
            <p>Your reservation has been cancelled.</p>
            <h3>Cancelled Reservation Details:</h3>
            <ul>
                <li><strong>Date & Time:</strong> {formatted_time}</li>
                <li><strong>Number of Guests:</strong> {data.get('number_of_guests')}</li>
                <li><strong>Table Number:</strong> {data.get('table_number')}</li>
                <li><strong>Reservation ID:</strong> {data.get('id')}</li>
            </ul>
            <p>If you have any questions, please contact us at (202) 555-4567.</p>
            <p>We hope to see you again soon!</p>
            <p>Best regards,<br>The Café Fausse Team</p>
        </body>
        </html>
        """
        
        success = send_email(subject, [data['email']], body, html_body)
        
        if success:
            return jsonify({'message': 'Reservation cancellation email sent successfully'}), 200
        else:
            return jsonify({'error': 'Failed to send email'}), 500
        
    except Exception as e:
        return jsonify({'error': f'Email sending failed: {str(e)}'}), 500

@email_bp.route('/api/email/reservation-update', methods=['POST'])
def send_reservation_update():
    """Send reservation update email to customer"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'error': 'Email is required'}), 400
        
        # Parse datetime
        time_slot = data.get('time_slot')
        if time_slot:
            try:
                dt = datetime.fromisoformat(time_slot.replace('Z', '+00:00'))
                formatted_time = dt.strftime('%B %d, %Y at %I:%M %p')
            except:
                formatted_time = time_slot
        else:
            formatted_time = "TBD"
        
        subject = f"Reservation Updated - Café Fausse"
        
        body = f"""
Dear {data.get('customer_name', 'Valued Customer')},

Your reservation has been updated.

Updated Reservation Details:
- Date & Time: {formatted_time}
- Number of Guests: {data.get('number_of_guests')}
- Table Number: {data.get('table_number')}
- Reservation ID: {data.get('id')}

If you have any questions, please contact us at (202) 555-4567.

We look forward to serving you at Café Fausse!

Best regards,
The Café Fausse Team
        """
        
        html_body = f"""
        <html>
        <body>
            <h2>Reservation Updated - Café Fausse</h2>
            <p>Dear {data.get('customer_name', 'Valued Customer')},</p>
            <p>Your reservation has been updated.</p>
            <h3>Updated Reservation Details:</h3>
            <ul>
                <li><strong>Date & Time:</strong> {formatted_time}</li>
                <li><strong>Number of Guests:</strong> {data.get('number_of_guests')}</li>
                <li><strong>Table Number:</strong> {data.get('table_number')}</li>
                <li><strong>Reservation ID:</strong> {data.get('id')}</li>
            </ul>
            <p>If you have any questions, please contact us at (202) 555-4567.</p>
            <p>We look forward to serving you at Café Fausse!</p>
            <p>Best regards,<br>The Café Fausse Team</p>
        </body>
        </html>
        """
        
        success = send_email(subject, [data['email']], body, html_body)
        
        if success:
            return jsonify({'message': 'Reservation update email sent successfully'}), 200
        else:
            return jsonify({'error': 'Failed to send email'}), 500
        
    except Exception as e:
        return jsonify({'error': f'Email sending failed: {str(e)}'}), 500

@email_bp.route('/api/email/newsletter-welcome', methods=['POST'])
def send_newsletter_welcome():
    """Send welcome email to new newsletter subscribers"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'error': 'Email is required'}), 400
        
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
        
        success = send_email(subject, [data['email']], body, html_body)
        
        if success:
            return jsonify({'message': 'Newsletter welcome email sent successfully'}), 200
        else:
            return jsonify({'error': 'Failed to send email'}), 500
        
    except Exception as e:
        return jsonify({'error': f'Email sending failed: {str(e)}'}), 500

@email_bp.route('/api/email/admin-notification', methods=['POST'])
def send_admin_notification():
    """Send notification email to admin about new reservation"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Reservation data is required'}), 400
        
        admin_email = os.getenv('ADMIN_EMAIL')
        if not admin_email:
            return jsonify({'error': 'ADMIN_EMAIL environment variable not configured'}), 500
        
        # Parse datetime
        time_slot = data.get('time_slot')
        if time_slot:
            try:
                dt = datetime.fromisoformat(time_slot.replace('Z', '+00:00'))
                formatted_time = dt.strftime('%B %d, %Y at %I:%M %p')
            except:
                formatted_time = time_slot
        else:
            formatted_time = "TBD"
        
        subject = f"New Reservation - {data.get('customer_name', 'Customer')}"
        
        body = f"""
New reservation received:

Customer: {data.get('customer_name')}
Email: {data.get('email')}
Phone: {data.get('phone')}
Date & Time: {formatted_time}
Number of Guests: {data.get('number_of_guests')}
Table Number: {data.get('table_number')}
Reservation ID: {data.get('id')}

Please review and confirm.
        """
        
        html_body = f"""
        <html>
        <body>
            <h2>New Reservation Received</h2>
            <table>
                <tr><td><strong>Customer:</strong></td><td>{data.get('customer_name')}</td></tr>
                <tr><td><strong>Email:</strong></td><td>{data.get('email')}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>{data.get('phone')}</td></tr>
                <tr><td><strong>Date & Time:</strong></td><td>{formatted_time}</td></tr>
                <tr><td><strong>Number of Guests:</strong></td><td>{data.get('number_of_guests')}</td></tr>
                <tr><td><strong>Table Number:</strong></td><td>{data.get('table_number')}</td></tr>
                <tr><td><strong>Reservation ID:</strong></td><td>{data.get('id')}</td></tr>
            </table>
            <p>Please review and confirm.</p>
        </body>
        </html>
        """
        
        success = send_email(subject, [admin_email], body, html_body)
        
        if success:
            return jsonify({'message': 'Admin notification email sent successfully'}), 200
        else:
            return jsonify({'error': 'Failed to send email'}), 500
        
    except Exception as e:
        return jsonify({'error': f'Email sending failed: {str(e)}'}), 500 