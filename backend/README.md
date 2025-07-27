# Café Fausse Backend

This is the backend for the Café Fausse web application, built with Flask, SQLAlchemy, Flask-Mail, Cloudinary, and PostgreSQL.

## Features
- User and admin authentication
- Menu management (CRUD, admin-only)
- Gallery management (images, awards, reviews; CRUD, admin-only, Cloudinary image upload)
- About info management (CRUD, admin-only)
- Reservation system (create, admin update/cancel, customer self-service)
- Newsletter signup and admin management
- Email notifications for reservations
- CSV export for newsletter and reservations
- **Cloudinary integration for image uploads**

## Requirements
- Python 3.8+
- PostgreSQL
- pip (Python package manager)
- **cloudinary** (install with `pip install cloudinary`)

## Setup Instructions

### 1. Clone the Repository
```
git clone <your-repo-url>
cd Cafe_fausee/backend
```

### 2. Create and Activate a Virtual Environment
```
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```
pip install -r requirements.txt
pip install cloudinary  # For image uploads
```

### 4. Set Up the Database
- Ensure PostgreSQL is running.
- Create the database (if not already):
  ```
  createdb cafe_fausse
  ```
- Create tables:
  ```
  python3 -m app.create_tables
  ```

### 5. Configure Environment Variables
- Create a `.env` file in the project root (next to `backend/`). Example:
  ```
  NOTIFY_EMAIL_USER=your_gmail@gmail.com
  NOTIFY_EMAIL_PASS=your_gmail_app_password
  MAIL_SERVER=smtp.gmail.com
  MAIL_PORT=587
  MAIL_USE_TLS=True
  MAIL_USE_SSL=False
  SQLALCHEMY_DATABASE_URI=postgresql://macbok@localhost:5432/cafe_fausse
  SECRET_KEY=dev
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_cloudinary_api_key
  CLOUDINARY_API_SECRET=your_cloudinary_api_secret
  ```
- For Gmail, use an [App Password](https://myaccount.google.com/apppasswords) if you have 2FA enabled.
- For Cloudinary, get your credentials from your Cloudinary dashboard.

### 6. Create an Admin User
```
python3 -m app.create_admin
```
Follow the prompts to set up your admin account.

### 7. Run the Development Server
```
flask run
```
Or, if you have an `app.py` or `wsgi.py`, you can use:
```
python3 -m flask run
```

## API Endpoints Overview

### Authentication
- `POST /api/admin/login` — Admin login
- `POST /api/admin/logout` — Admin logout

### Menu
- `GET /api/menu/items` — List menu items (public)
- `POST /api/menu/items` — Create menu item (admin)
- `PUT /api/menu/items/<id>` — Update menu item (admin)
- `DELETE /api/menu/items/<id>` — Delete menu item (admin)

### Gallery
- `GET /api/gallery/images` — List images (public)
- `POST /api/gallery/images` — Add image (admin)
- `PUT /api/gallery/images/<id>` — Update image (admin)
- `DELETE /api/gallery/images/<id>` — Delete image (admin)
- `POST /api/gallery/upload` — **Upload image to Cloudinary (admin, multipart/form-data)**
- `GET /api/gallery/awards` — List awards (public)
- `POST /api/gallery/awards` — Add award (admin)
- `PUT /api/gallery/awards/<id>` — Update award (admin)
- `DELETE /api/gallery/awards/<id>` — Delete award (admin)
- `GET /api/gallery/reviews` — List reviews (public)
- `POST /api/gallery/reviews` — Add review (admin)
- `PUT /api/gallery/reviews/<id>` — Update review (admin)
- `DELETE /api/gallery/reviews/<id>` — Delete review (admin)

### About
- `GET /api/about/info` — Get about info (public)
- `POST /api/about/info` — Create about info (admin)
- `PUT /api/about/info` — Update about info (admin)

### Reservations
- `POST /api/reservations/` — Create reservation (public)
- `GET /api/reservations/all` — List all reservations (admin)
- `PUT /api/reservations/<id>` — Update reservation (admin)
- `DELETE /api/reservations/<id>` — Delete reservation (admin)
- `GET /api/reservations/export` — Export reservations as CSV (admin)
- `GET /api/reservations/lookup?email=...&reservation_id=...` — Customer view reservation
- `DELETE /api/reservations/lookup` — Customer cancel reservation

### Newsletter
- `POST /api/newsletter/` — Signup (public)
- `GET /api/newsletter/all` — List all signups (admin)
- `GET /api/newsletter/export` — Export signups as CSV (admin)

## Email Notifications
- Reservation confirmation emails are sent to customers using Gmail SMTP (see `.env` setup above).

## Cloudinary Image Uploads
- To upload an image as an admin, use:
  - `POST /api/gallery/upload` with `multipart/form-data`:
    - `image`: the image file
    - `caption`: (optional) image caption
- The image will be uploaded to Cloudinary and the URL stored in the database.

## Development Notes
- For local email testing, use Gmail SMTP with an App Password.
- All admin endpoints require login via `/api/admin/login`.
- Use tools like Postman or curl to test endpoints.
- For Cloudinary, see [Cloudinary Python docs](https://cloudinary.com/documentation/django_image_and_video_upload#installation) for more info.

## License
MIT
