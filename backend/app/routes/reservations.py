from flask import Blueprint, request, jsonify, session, Response
from app.models import db, Customer, Reservation
from datetime import datetime
import random
import re
from flask_mail import Message
from app import mail
from app.auth import require_admin
import os

reservations_bp = Blueprint('reservations', __name__)

def send_reservation_confirmation_email(reservation_data):
    """Send reservation confirmation email to customer"""
    try:
        subject = f"Reservation Confirmed - Café Fausse"
        
        # Parse datetime
        time_slot = reservation_data.get('time_slot')
        if time_slot:
            try:
                dt = datetime.fromisoformat(time_slot.replace('Z', '+00:00'))
                formatted_time = dt.strftime('%B %d, %Y at %I:%M %p')
            except:
                formatted_time = time_slot
        else:
            formatted_time = "TBD"
        
        # Plain text version
        body = f"""
Dear {reservation_data.get('customer_name', 'Valued Customer')},

Your reservation has been confirmed!

Reservation Details:
- Date & Time: {formatted_time}
- Number of Guests: {reservation_data.get('number_of_guests')}
- Table Number: {reservation_data.get('table_number')}
- Reservation ID: {reservation_data.get('id')}

We look forward to serving you at Café Fausse!

Best regards,
The Café Fausse Team
        """
        
        # HTML version
        html_body = f"""
        <html>
        <body>
            <h2>Reservation Confirmed - Café Fausse</h2>
            <p>Dear {reservation_data.get('customer_name', 'Valued Customer')},</p>
            <p>Your reservation has been confirmed!</p>
            <h3>Reservation Details:</h3>
            <ul>
                <li><strong>Date & Time:</strong> {formatted_time}</li>
                <li><strong>Number of Guests:</strong> {reservation_data.get('number_of_guests')}</li>
                <li><strong>Table Number:</strong> {reservation_data.get('table_number')}</li>
                <li><strong>Reservation ID:</strong> {reservation_data.get('id')}</li>
            </ul>
            <p>We look forward to serving you at Café Fausse!</p>
            <p>Best regards,<br>The Café Fausse Team</p>
        </body>
        </html>
        """
        
        msg = Message(
            subject=subject,
            recipients=[reservation_data['email']],
            body=body,
            html=html_body
        )
        mail.send(msg)
        print(f"✅ Reservation confirmation email sent to: {reservation_data['email']}")
        return True
    except Exception as e:
        print(f"❌ Failed to send reservation confirmation email: {e}")
        return False

def send_admin_notification_email(reservation_data):
    """Send notification email to admin about new reservation"""
    try:
        admin_email = os.getenv('ADMIN_EMAIL')
        if not admin_email:
            print("❌ ADMIN_EMAIL environment variable not configured")
            return False
        
        # Parse datetime
        time_slot = reservation_data.get('time_slot')
        if time_slot:
            try:
                dt = datetime.fromisoformat(time_slot.replace('Z', '+00:00'))
                formatted_time = dt.strftime('%B %d, %Y at %I:%M %p')
            except:
                formatted_time = time_slot
        else:
            formatted_time = "TBD"
        
        subject = f"New Reservation - {reservation_data.get('customer_name', 'Customer')}"
        
        body = f"""
New reservation received:

Customer: {reservation_data.get('customer_name')}
Email: {reservation_data.get('email')}
Phone: {reservation_data.get('phone')}
Date & Time: {formatted_time}
Number of Guests: {reservation_data.get('number_of_guests')}
Table Number: {reservation_data.get('table_number')}
Reservation ID: {reservation_data.get('id')}

Please review and confirm.
        """
        
        html_body = f"""
        <html>
        <body>
            <h2>New Reservation Received</h2>
            <table>
                <tr><td><strong>Customer:</strong></td><td>{reservation_data.get('customer_name')}</td></tr>
                <tr><td><strong>Email:</strong></td><td>{reservation_data.get('email')}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>{reservation_data.get('phone')}</td></tr>
                <tr><td><strong>Date & Time:</strong></td><td>{formatted_time}</td></tr>
                <tr><td><strong>Number of Guests:</strong></td><td>{reservation_data.get('number_of_guests')}</td></tr>
                <tr><td><strong>Table Number:</strong></td><td>{reservation_data.get('table_number')}</td></tr>
                <tr><td><strong>Reservation ID:</strong></td><td>{reservation_data.get('id')}</td></tr>
            </table>
            <p>Please review and confirm.</p>
        </body>
        </html>
        """
        
        msg = Message(
            subject=subject,
            recipients=[admin_email],
            body=body,
            html=html_body
        )
        mail.send(msg)
        print(f"✅ Admin notification email sent to: {admin_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send admin notification email: {e}")
        return False

def send_reservation_cancellation_email(reservation_data):
    """Send reservation cancellation email to customer"""
    try:
        subject = f"Reservation Cancelled - Café Fausse"
        
        # Parse datetime
        time_slot = reservation_data.get('time_slot')
        if time_slot:
            try:
                dt = datetime.fromisoformat(time_slot.replace('Z', '+00:00'))
                formatted_time = dt.strftime('%B %d, %Y at %I:%M %p')
            except:
                formatted_time = time_slot
        else:
            formatted_time = "TBD"
        
        body = f"""
Dear {reservation_data.get('customer_name', 'Valued Customer')},

Your reservation has been cancelled.

Cancelled Reservation Details:
- Date & Time: {formatted_time}
- Number of Guests: {reservation_data.get('number_of_guests')}
- Table Number: {reservation_data.get('table_number')}
- Reservation ID: {reservation_data.get('id')}

If you have any questions, please contact us at (202) 555-4567.

We hope to see you again soon!

Best regards,
The Café Fausse Team
        """
        
        html_body = f"""
        <html>
        <body>
            <h2>Reservation Cancelled - Café Fausse</h2>
            <p>Dear {reservation_data.get('customer_name', 'Valued Customer')},</p>
            <p>Your reservation has been cancelled.</p>
            <h3>Cancelled Reservation Details:</h3>
            <ul>
                <li><strong>Date & Time:</strong> {formatted_time}</li>
                <li><strong>Number of Guests:</strong> {reservation_data.get('number_of_guests')}</li>
                <li><strong>Table Number:</strong> {reservation_data.get('table_number')}</li>
                <li><strong>Reservation ID:</strong> {reservation_data.get('id')}</li>
            </ul>
            <p>If you have any questions, please contact us at (202) 555-4567.</p>
            <p>We hope to see you again soon!</p>
            <p>Best regards,<br>The Café Fausse Team</p>
        </body>
        </html>
        """
        
        msg = Message(
            subject=subject,
            recipients=[reservation_data['email']],
            body=body,
            html=html_body
        )
        mail.send(msg)
        print(f"✅ Reservation cancellation email sent to: {reservation_data['email']}")
        return True
    except Exception as e:
        print(f"❌ Failed to send cancellation email: {e}")
        return False

@reservations_bp.route('/', methods=['GET'])
def test_reservations():
    return {"message": "Reservations endpoint is working!"}, 200

@reservations_bp.route('/all', methods=['GET'])
@require_admin
def get_all_reservations():
    reservations = Reservation.query.all()
    result = []
    for r in reservations:
        customer = Customer.query.get(r.customer_id)
        result.append({
            'id': r.id,
            'customer_name': customer.name if customer else None,
            'email': customer.email if customer else None,
            'phone': customer.phone if customer else None,
            'time_slot': r.time_slot.isoformat(),
            'table_number': r.table_number,
            'number_of_guests': r.number_of_guests
        })
    return jsonify({'reservations': result}), 200

@reservations_bp.route('/', methods=['POST'])
def create_reservation():
    try:
        data = request.get_json()
        time_slot = data.get('time_slot')
        number_of_guests = data.get('number_of_guests')
        customer_name = data.get('customer_name')
        email = data.get('email')
        phone = data.get('phone')

        # Input validation
        if not all([time_slot, number_of_guests, customer_name, email]):
            return jsonify({'error': 'Missing required fields.'}), 400
        if not isinstance(number_of_guests, int) or number_of_guests < 1 or number_of_guests > 20:
            return jsonify({'error': 'Number of guests must be between 1 and 20.'}), 400
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_regex, email):
            return jsonify({'error': 'Invalid email format.'}), 400
        try:
            time_slot_dt = datetime.fromisoformat(time_slot)
            if time_slot_dt < datetime.now():
                return jsonify({'error': 'Time slot must be in the future.'}), 400
        except Exception:
            return jsonify({'error': 'Invalid time_slot format. Use ISO format.'}), 400

        # Find or create customer
        customer = Customer.query.filter_by(email=email).first()
        if not customer:
            customer = Customer(name=customer_name, email=email, phone=phone)
            db.session.add(customer)
            db.session.commit()

        # Check how many reservations exist for this time slot
        reservations = Reservation.query.filter_by(time_slot=time_slot_dt).all()
        taken_tables = {r.table_number for r in reservations}
        if len(taken_tables) >= 30:
            return jsonify({'error': 'Time slot is fully booked.'}), 409

        # Assign a random available table
        available_tables = set(range(1, 31)) - taken_tables
        table_number = random.choice(list(available_tables))

        reservation = Reservation(
            customer_id=customer.id,
            time_slot=time_slot_dt,
            table_number=table_number,
            number_of_guests=number_of_guests
        )
        db.session.add(reservation)
        db.session.commit()

        # Prepare email data
        email_data = {
            'id': reservation.id,
            'customer_name': customer.name,
            'email': customer.email,
            'phone': customer.phone,
            'time_slot': reservation.time_slot.isoformat(),
            'table_number': reservation.table_number,
            'number_of_guests': reservation.number_of_guests
        }
        
        # Send confirmation email to customer
        print(f"Attempting to send confirmation email to: {customer.email}")
        send_reservation_confirmation_email(email_data)
        
        # Send notification to admin
        print(f"Attempting to send admin notification")
        send_admin_notification_email(email_data)

        return jsonify({
            'message': 'Reservation successful.',
            'reservation': {
                'id': reservation.id,
                'customer_name': customer.name,
                'email': customer.email,
                'time_slot': reservation.time_slot.isoformat(),
                'table_number': reservation.table_number,
                'number_of_guests': reservation.number_of_guests
            }
        }), 201
    except Exception as e:
        print(f"❌ Reservation creation error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@reservations_bp.route('/<int:reservation_id>', methods=['PUT'])
@require_admin
def update_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'error': 'Reservation not found.'}), 404
    
    data = request.get_json()
    if 'time_slot' in data:
        try:
            reservation.time_slot = datetime.fromisoformat(data['time_slot'])
        except:
            return jsonify({'error': 'Invalid time_slot format.'}), 400
    if 'table_number' in data:
        reservation.table_number = data['table_number']
    if 'number_of_guests' in data:
        reservation.number_of_guests = data['number_of_guests']
    
    db.session.commit()
    return jsonify({'message': 'Reservation updated successfully.'}), 200

@reservations_bp.route('/<int:reservation_id>', methods=['DELETE'])
@require_admin
def delete_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'error': 'Reservation not found.'}), 404
    
    db.session.delete(reservation)
    db.session.commit()
    return jsonify({'message': 'Reservation deleted successfully.'}), 200

@reservations_bp.route('/export', methods=['GET'])
@require_admin
def export_reservations_csv():
    reservations = Reservation.query.all()
    csv_data = 'id,customer_name,email,phone,time_slot,table_number,number_of_guests\n'
    for r in reservations:
        customer = Customer.query.get(r.customer_id)
        csv_data += f'{r.id},{customer.name if customer else ""},{customer.email if customer else ""},{customer.phone if customer else ""},{r.time_slot.isoformat()},{r.table_number},{r.number_of_guests}\n'
    return Response(
        csv_data,
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment;filename=reservations.csv'}
    )

@reservations_bp.route('/lookup', methods=['GET'])
def customer_lookup_reservation():
    email = request.args.get('email')
    reservation_id = request.args.get('reservation_id')
    if not email or not reservation_id:
        return jsonify({'error': 'Email and reservation_id required.'}), 400
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'error': 'Reservation not found.'}), 404
    customer = Customer.query.get(reservation.customer_id)
    if not customer or customer.email != email:
        return jsonify({'error': 'Reservation not found for this email.'}), 404
    return jsonify({
        'id': reservation.id,
        'customer_name': customer.name,
        'email': customer.email,
        'phone': customer.phone,
        'time_slot': reservation.time_slot.isoformat(),
        'table_number': reservation.table_number,
        'number_of_guests': reservation.number_of_guests
    }), 200

@reservations_bp.route('/lookup', methods=['DELETE'])
def customer_cancel_reservation():
    try:
        data = request.get_json()
        email = data.get('email')
        reservation_id = data.get('reservation_id')
        if not email or not reservation_id:
            return jsonify({'error': 'Email and reservation_id required.'}), 400
        reservation = Reservation.query.get(reservation_id)
        if not reservation:
            return jsonify({'error': 'Reservation not found.'}), 404
        customer = Customer.query.get(reservation.customer_id)
        if not customer or customer.email != email:
            return jsonify({'error': 'Reservation not found for this email.'}), 404
        
        # Store reservation data before deletion for email
        reservation_data = {
            'id': reservation.id,
            'customer_name': customer.name,
            'email': customer.email,
            'phone': customer.phone,
            'time_slot': reservation.time_slot.isoformat(),
            'table_number': reservation.table_number,
            'number_of_guests': reservation.number_of_guests
        }
        
        db.session.delete(reservation)
        db.session.commit()
        
        # Send cancellation email
        print(f"Attempting to send cancellation email to: {customer.email}")
        send_reservation_cancellation_email(reservation_data)
        
        return jsonify({'message': 'Reservation cancelled.'}), 200
    except Exception as e:
        print(f"❌ Reservation cancellation error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
