from . import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)  # Optional
    newsletter_signup = db.Column(db.Boolean, default=False)
    reservations = db.relationship('Reservation', backref='customer', lazy=True)

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    time_slot = db.Column(db.DateTime, nullable=False)
    table_number = db.Column(db.Integer, nullable=False)
    number_of_guests = db.Column(db.Integer, nullable=False)  # Optional field for guests

class Newsletter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    signup_date = db.Column(db.DateTime, nullable=True)  # Optional, for marketing tracking

class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)  # e.g., starter, main_course, dessert, beverage

class GalleryImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.String(255))

class Award(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    year = db.Column(db.String(10))

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    review = db.Column(db.Text, nullable=False)
    source = db.Column(db.String(255))

class AboutInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    history = db.Column(db.Text)
    mission = db.Column(db.Text)
