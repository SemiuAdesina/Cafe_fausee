from flask import Blueprint, request, jsonify, session
from werkzeug.security import check_password_hash, generate_password_hash
from app.models import Admin
from app import db
import os

admin_auth_bp = Blueprint('admin_auth', __name__)

# Simple in-memory token storage (in production, use Redis or database)
admin_tokens = {}

def require_admin(f):
    """Decorator to require admin authentication"""
    def decorated_function(*args, **kwargs):
        # Check session first
        if session.get('admin_id'):
            return f(*args, **kwargs)
        
        # Check for token in headers
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            if token in admin_tokens:
                return f(*args, **kwargs)
        
        return jsonify({'error': 'Admin login required.'}), 401
    decorated_function.__name__ = f.__name__
    return decorated_function

@admin_auth_bp.route('/api/admin/login', methods=['POST'])
def admin_login():
    """Admin login endpoint"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required.'}), 400
        
        # Find admin user
        admin = Admin.query.filter_by(username=username).first()
        
        if admin and check_password_hash(admin.password, password):
            # Set session
            session['admin_id'] = admin.id
            
            # Generate token for API access
            import secrets
            token = secrets.token_urlsafe(32)
            admin_tokens[token] = admin.id
            
            return jsonify({
                'message': 'Login successful.',
                'token': token,
                'admin_id': admin.id
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials.'}), 401
            
    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500

@admin_auth_bp.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    """Admin logout endpoint"""
    try:
        # Clear session
        session.pop('admin_id', None)
        
        # Clear token if provided
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            admin_tokens.pop(token, None)
        
        return jsonify({'message': 'Logout successful.'}), 200
    except Exception as e:
        return jsonify({'error': f'Logout failed: {str(e)}'}), 500

@admin_auth_bp.route('/api/admin/status', methods=['GET'])
def admin_status():
    """Check admin login status"""
    try:
        # Check session
        if session.get('admin_id'):
            return jsonify({'logged_in': True, 'admin_id': session['admin_id']}), 200
        
        # Check token
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            if token in admin_tokens:
                return jsonify({'logged_in': True, 'admin_id': admin_tokens[token]}), 200
        
        return jsonify({'logged_in': False}), 200
    except Exception as e:
        return jsonify({'error': f'Status check failed: {str(e)}'}), 500

@admin_auth_bp.route('/api/admin/create', methods=['POST'])
def create_admin():
    """Create admin user endpoint"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required.'}), 400
        
        # Check if admin already exists
        existing_admin = Admin.query.filter_by(username=username).first()
        if existing_admin:
            return jsonify({'error': 'Admin user already exists.'}), 400
        
        # Create new admin
        hashed_password = generate_password_hash(password)
        new_admin = Admin(username=username, password=hashed_password)
        db.session.add(new_admin)
        db.session.commit()
        
        return jsonify({
            'message': f'Admin user "{username}" created successfully.',
            'username': username
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create admin: {str(e)}'}), 500

@admin_auth_bp.route('/api/admin/debug-session', methods=['GET'])
def debug_session():
    """Debug session information"""
    session_data = {
        'session_id': session.get('admin_id'),
        'session_keys': list(session.keys()),
        'cookies': dict(request.cookies),
        'headers': dict(request.headers),
        'admin_id_in_session': session.get('admin_id'),
        'session_modified': session.modified,
        'origin': request.headers.get('Origin'),
        'referer': request.headers.get('Referer'),
        'user_agent': request.headers.get('User-Agent')
    }
    return jsonify(session_data), 200

@admin_auth_bp.route('/api/admin/test-session', methods=['GET'])
def test_session():
    """Test if admin is logged in via session"""
    admin_id = session.get('admin_id')
    if admin_id:
        return jsonify({'logged_in': True, 'admin_id': admin_id}), 200
    else:
        return jsonify({'logged_in': False}), 200

@admin_auth_bp.route('/api/admin/session-test', methods=['GET'])
def session_test():
    """Test if session cookies are being sent"""
    return jsonify({
        'message': 'Session test endpoint',
        'has_session_cookie': 'session' in request.cookies,
        'session_cookie_value': request.cookies.get('session', 'None'),
        'all_cookies': dict(request.cookies),
        'origin': request.headers.get('Origin'),
        'user_agent': request.headers.get('User-Agent')
    }), 200
