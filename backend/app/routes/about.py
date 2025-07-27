from flask import Blueprint, jsonify, request, session
from app.models import db, AboutInfo

about_bp = Blueprint('about', __name__)

@about_bp.route('/', methods=['GET'])
def test_about():
    return {"message": "About endpoint is working!"}, 200

@about_bp.route('/info', methods=['GET'])
def get_about_info():
    about = AboutInfo.query.first()
    if not about:
        return jsonify({'history': '', 'mission': '', 'founders': []}), 200
    # Founders are static for now, as in SRS
    founders = [
        {"name": "Chef Antonio Rossi", "bio": "Award-winning chef with a passion for Italian cuisine and modern techniques."},
        {"name": "Maria Lopez", "bio": "Restaurateur dedicated to excellent food, unforgettable dining, and locally sourced ingredients."}
    ]
    return jsonify({
        'history': about.history,
        'mission': about.mission,
        'founders': founders
    }), 200

@about_bp.route('/info', methods=['POST'])
def create_about_info():
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    if AboutInfo.query.first():
        return jsonify({'error': 'About info already exists. Use PUT to update.'}), 400
    data = request.get_json()
    history = data.get('history')
    mission = data.get('mission')
    about = AboutInfo(history=history, mission=mission)
    db.session.add(about)
    db.session.commit()
    return jsonify({'message': 'About info created.'}), 201

@about_bp.route('/info', methods=['PUT'])
def update_about_info():
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    about = AboutInfo.query.first()
    if not about:
        return jsonify({'error': 'About info not found.'}), 404
    data = request.get_json()
    about.history = data.get('history', about.history)
    about.mission = data.get('mission', about.mission)
    db.session.commit()
    return jsonify({'message': 'About info updated.'}), 200
