import cloudinary
import cloudinary.uploader
import os
from flask import Blueprint, jsonify, request, session
from app.models import db, GalleryImage, Award, Review

gallery_bp = Blueprint('gallery', __name__)

@gallery_bp.route('/', methods=['GET'])
def test_gallery():
    return {"message": "Gallery endpoint is working!"}, 200

# --- Gallery Images ---
@gallery_bp.route('/images', methods=['GET'])
def get_gallery_images():
    images = GalleryImage.query.all()
    return jsonify([{'id': img.id, 'url': img.url, 'caption': img.caption} for img in images]), 200

@gallery_bp.route('/images', methods=['POST'])
def create_gallery_image():
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    data = request.get_json()
    url = data.get('url')
    caption = data.get('caption')
    if not url:
        return jsonify({'error': 'Image URL is required.'}), 400
    img = GalleryImage(url=url, caption=caption)
    db.session.add(img)
    db.session.commit()
    return jsonify({'message': 'Image added.', 'id': img.id}), 201

@gallery_bp.route('/images/<int:image_id>', methods=['PUT'])
def update_gallery_image(image_id):
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    img = GalleryImage.query.get(image_id)
    if not img:
        return jsonify({'error': 'Image not found.'}), 404
    data = request.get_json()
    img.url = data.get('url', img.url)
    img.caption = data.get('caption', img.caption)
    db.session.commit()
    return jsonify({'message': 'Image updated.'}), 200

@gallery_bp.route('/images/<int:image_id>', methods=['DELETE'])
def delete_gallery_image(image_id):
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    img = GalleryImage.query.get(image_id)
    if not img:
        return jsonify({'error': 'Image not found.'}), 404
    db.session.delete(img)
    db.session.commit()
    return jsonify({'message': 'Image deleted.'}), 200

# --- Awards ---
@gallery_bp.route('/awards', methods=['GET'])
def get_awards():
    awards = Award.query.all()
    return jsonify([{'id': a.id, 'title': a.title, 'year': a.year} for a in awards]), 200

@gallery_bp.route('/awards', methods=['POST'])
def create_award():
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    data = request.get_json()
    title = data.get('title')
    year = data.get('year')
    if not title:
        return jsonify({'error': 'Award title is required.'}), 400
    award = Award(title=title, year=year)
    db.session.add(award)
    db.session.commit()
    return jsonify({'message': 'Award added.', 'id': award.id}), 201

@gallery_bp.route('/awards/<int:award_id>', methods=['PUT'])
def update_award(award_id):
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    award = Award.query.get(award_id)
    if not award:
        return jsonify({'error': 'Award not found.'}), 404
    data = request.get_json()
    award.title = data.get('title', award.title)
    award.year = data.get('year', award.year)
    db.session.commit()
    return jsonify({'message': 'Award updated.'}), 200

@gallery_bp.route('/awards/<int:award_id>', methods=['DELETE'])
def delete_award(award_id):
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    award = Award.query.get(award_id)
    if not award:
        return jsonify({'error': 'Award not found.'}), 404
    db.session.delete(award)
    db.session.commit()
    return jsonify({'message': 'Award deleted.'}), 200

# --- Reviews ---
@gallery_bp.route('/reviews', methods=['GET'])
def get_reviews():
    reviews = Review.query.all()
    return jsonify([{'id': r.id, 'review': r.review, 'source': r.source} for r in reviews]), 200

@gallery_bp.route('/reviews', methods=['POST'])
def create_review():
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    data = request.get_json()
    review = data.get('review')
    source = data.get('source')
    if not review:
        return jsonify({'error': 'Review text is required.'}), 400
    r = Review(review=review, source=source)
    db.session.add(r)
    db.session.commit()
    return jsonify({'message': 'Review added.', 'id': r.id}), 201

@gallery_bp.route('/reviews/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    r = Review.query.get(review_id)
    if not r:
        return jsonify({'error': 'Review not found.'}), 404
    data = request.get_json()
    r.review = data.get('review', r.review)
    r.source = data.get('source', r.source)
    db.session.commit()
    return jsonify({'message': 'Review updated.'}), 200

@gallery_bp.route('/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    r = Review.query.get(review_id)
    if not r:
        return jsonify({'error': 'Review not found.'}), 404
    db.session.delete(r)
    db.session.commit()
    return jsonify({'message': 'Review deleted.'}), 200

@gallery_bp.route('/upload', methods=['POST'])
def upload_gallery_image():
    if not session.get('admin_id'):
        return jsonify({'error': 'Admin login required.'}), 401
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided.'}), 400
    image_file = request.files['image']
    caption = request.form.get('caption')
    # Configure Cloudinary
    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET')
    )
    try:
        upload_result = cloudinary.uploader.upload(image_file)
        url = upload_result['secure_url']
        img = GalleryImage(url=url, caption=caption)
        db.session.add(img)
        db.session.commit()
        return jsonify({'message': 'Image uploaded.', 'id': img.id, 'url': url}), 201
    except Exception as e:
        return jsonify({'error': f'Cloudinary upload failed: {e}'}), 500
