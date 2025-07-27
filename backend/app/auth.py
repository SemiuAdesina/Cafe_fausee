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

@admin_auth_bp.route('/api/admin/create', methods=['POST'])
def create_admin():
    """Create admin user via HTTP request (for production setup)"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required.'}), 400
            
        # Check if admin already exists
        existing_admin = Admin.query.filter_by(username=username).first()
        if existing_admin:
            return jsonify({'error': f'Admin user "{username}" already exists.'}), 409
        
        # Create new admin
        admin = Admin(username=username)
        admin.set_password(password)
        db.session.add(admin)
        db.session.commit()
        
        return jsonify({
            'message': f'Admin user "{username}" created successfully.',
            'username': username
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Failed to create admin: {str(e)}'}), 500

@admin_auth_bp.route('/api/admin/debug-session', methods=['GET'])
def debug_session():
    """Debug session information"""
    try:
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
    except Exception as e:
        return jsonify({'error': f'Session debug failed: {str(e)}'}), 500

@admin_auth_bp.route('/api/admin/test-session', methods=['GET'])
def test_session():
    """Test if session is working properly"""
    try:
        # Check if admin is logged in
        admin_id = session.get('admin_id')
        if admin_id:
            admin = Admin.query.get(admin_id)
            if admin:
                return jsonify({
                    'logged_in': True,
                    'username': admin.username,
                    'session_id': admin_id
                }), 200
            else:
                # Admin not found in database
                session.pop('admin_id', None)
                return jsonify({
                    'logged_in': False,
                    'error': 'Admin not found in database'
                }), 200
        else:
            return jsonify({
                'logged_in': False,
                'error': 'No admin_id in session'
            }), 200
    except Exception as e:
        return jsonify({'error': f'Session test failed: {str(e)}'}), 500

@admin_auth_bp.route('/api/admin/session-test', methods=['GET'])
def session_test():
    """Simple test to check if session cookies are being sent"""
    try:
        return jsonify({
            'message': 'Session test endpoint',
            'has_session_cookie': 'session' in request.cookies,
            'session_cookie_value': request.cookies.get('session', 'None'),
            'all_cookies': dict(request.cookies),
            'origin': request.headers.get('Origin'),
            'user_agent': request.headers.get('User-Agent')
        }), 200
    except Exception as e:
        return jsonify({'error': f'Session test failed: {str(e)}'}), 500
