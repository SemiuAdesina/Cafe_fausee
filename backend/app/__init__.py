from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    
    # Custom CORS handler to ensure credentials are properly handled
    @app.after_request
    def after_request(response):
        origin = request.headers.get('Origin')
        print(f"Request origin: {origin}")  # Debug print
        
        # Allow origins for both development and production
        allowed_origins = [
            'http://localhost:5173', 
            'http://127.0.0.1:5173',
            'https://cafe-fausse-z85a.onrender.com',  # Your Render frontend URL
            'https://cafe-fausse-frontend.onrender.com',
            'https://cafe-fausse.onrender.com'
        ]
        
        if origin in allowed_origins:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            print(f"Set CORS headers: {dict(response.headers)}")  # Debug print
        return response
    
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)

    # Import models to register them with SQLAlchemy
    from . import models

    # Register blueprints (routes)
    from .auth import admin_auth_bp
    from .routes.reservations import reservations_bp
    from .routes.menu import menu_bp
    from .routes.gallery import gallery_bp
    from .routes.about import about_bp
    
    print("Loading newsletter blueprint...")
    try:
        from .routes.newsletter import newsletter_bp
        print("✅ Newsletter blueprint loaded successfully")
    except Exception as e:
        print(f"❌ Failed to load newsletter blueprint: {e}")
        import traceback
        traceback.print_exc()
    
    from .routes.email import email_bp

    app.register_blueprint(admin_auth_bp)
    app.register_blueprint(reservations_bp, url_prefix='/api/reservations')
    app.register_blueprint(menu_bp, url_prefix='/api/menu')
    app.register_blueprint(gallery_bp, url_prefix='/api/gallery')
    app.register_blueprint(about_bp, url_prefix='/api/about')
    
    try:
        app.register_blueprint(newsletter_bp, url_prefix='/api/newsletter')
        print("✅ Newsletter blueprint registered successfully")
    except Exception as e:
        print(f"❌ Failed to register newsletter blueprint: {e}")
    
    app.register_blueprint(email_bp)

    @app.route('/api/health')
    def health():
        return {'status': 'ok'}, 200

    return app
