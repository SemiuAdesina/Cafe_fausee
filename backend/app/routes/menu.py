from flask import Blueprint, jsonify, request, session
from app.models import db, MenuItem

menu_bp = Blueprint('menu', __name__)

@menu_bp.route('/', methods=['GET'])
def test_menu():
    return {"message": "Menu endpoint is working!"}, 200

@menu_bp.route('/items', methods=['GET'])
def get_menu_items():
    items = MenuItem.query.all()
    menu = {}
    for item in items:
        cat = item.category
        if cat not in menu:
            menu[cat] = []
        menu[cat].append({
            'id': item.id,
            'name': item.name,
            'description': item.description,
            'price': item.price
        })
    return jsonify(menu), 200

@menu_bp.route('/items/<int:item_id>', methods=['GET'])
def get_menu_item(item_id):
    item = MenuItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Menu item not found.'}), 404
    return jsonify({
        'id': item.id,
        'name': item.name,
        'description': item.description,
        'price': item.price,
        'category': item.category
    }), 200

@menu_bp.route('/items', methods=['POST'])
def create_menu_item():
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    category = data.get('category')
    if not all([name, description, price, category]):
        return jsonify({'error': 'Missing required fields.'}), 400
    item = MenuItem(name=name, description=description, price=price, category=category)
    db.session.add(item)
    db.session.commit()
    return jsonify({'message': 'Menu item created.', 'id': item.id}), 201

@menu_bp.route('/items/<int:item_id>', methods=['PUT'])
def update_menu_item(item_id):
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    item = MenuItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Menu item not found.'}), 404
    data = request.get_json()
    item.name = data.get('name', item.name)
    item.description = data.get('description', item.description)
    item.price = data.get('price', item.price)
    item.category = data.get('category', item.category)
    db.session.commit()
    return jsonify({'message': 'Menu item updated.'}), 200

@menu_bp.route('/items/<int:item_id>', methods=['DELETE'])
def delete_menu_item(item_id):
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    item = MenuItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Menu item not found.'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Menu item deleted.'}), 200
