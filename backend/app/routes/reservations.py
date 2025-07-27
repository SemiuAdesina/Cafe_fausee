from flask import Blueprint, request, jsonify, session, Response
from app.models import db, Customer, Reservation
from datetime import datetime
import random
import re
from flask_mail import Message
from app import mail

reservations_bp = Blueprint('reservations', __name__)

@reservations_bp.route('/', methods=['GET'])
def test_reservations():
    return {"message": "Reservations endpoint is working!"}, 200

@reservations_bp.route('/all', methods=['GET'])
def get_all_reservations():
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
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

    # Send confirmation email using our email service
    import requests
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
    try:
        # Disable proxy for internal requests
        proxies = {
            'http': None,
            'https': None
        }
        requests.post('http://localhost:5001/api/email/reservation-confirmation', 
                     json=email_data, timeout=5, proxies=proxies)
        
        # Send notification to admin
        requests.post('http://localhost:5001/api/email/admin-notification', 
                     json=email_data, timeout=5, proxies=proxies)
    except Exception as e:
        print(f"Failed to send confirmation email: {e}")

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

@reservations_bp.route('/<int:reservation_id>', methods=['PUT'])
def update_reservation(reservation_id):
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'error': 'Reservation not found.'}), 404
    data = request.get_json()
    # Only allow updating time_slot, number_of_guests, table_number
    if 'time_slot' in data:
        try:
            time_slot_dt = datetime.fromisoformat(data['time_slot'])
            reservation.time_slot = time_slot_dt
        except Exception:
            return jsonify({'error': 'Invalid time_slot format. Use ISO format.'}), 400
    if 'number_of_guests' in data:
        reservation.number_of_guests = data['number_of_guests']
    if 'table_number' in data:
        reservation.table_number = data['table_number']
    db.session.commit()
    return jsonify({'message': 'Reservation updated.'}), 200

@reservations_bp.route('/<int:reservation_id>', methods=['DELETE'])
def delete_reservation(reservation_id):
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'error': 'Reservation not found.'}), 404
    db.session.delete(reservation)
    db.session.commit()
    return jsonify({'message': 'Reservation deleted.'}), 200

@reservations_bp.route('/export', methods=['GET'])
def export_reservations_csv():
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
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
    try:
        import requests
        # Disable proxy for internal requests
        proxies = {
            'http': None,
            'https': None
        }
        requests.post('http://localhost:5001/api/email/reservation-cancellation', 
                     json=reservation_data, timeout=5, proxies=proxies)
    except Exception as e:
        print(f"Failed to send cancellation email: {e}")
    
    return jsonify({'message': 'Reservation cancelled.'}), 200
