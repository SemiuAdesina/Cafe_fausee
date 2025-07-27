from flask import Blueprint, request, session, jsonify
from app.models import Admin
from app import db

admin_auth_bp = Blueprint('admin_auth', __name__)

@admin_auth_bp.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required.'}), 400
    admin = Admin.query.filter_by(username=username).first()
    if admin and admin.check_password(password):
        session['admin_id'] = admin.id
        return jsonify({'message': 'Login successful.'}), 200
    return jsonify({'error': 'Invalid credentials.'}), 401

@admin_auth_bp.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    session.pop('admin_id', None)
    return jsonify({'message': 'Logged out successfully.'}), 200

@admin_auth_bp.route('/api/admin/status', methods=['GET'])
def admin_status():
    """Check if admin is logged in"""
    if 'admin_id' in session:
        admin = Admin.query.get(session['admin_id'])
        if admin:
            return jsonify({
                'logged_in': True,
                'username': admin.username
            }), 200
    return jsonify({'logged_in': False}), 200
