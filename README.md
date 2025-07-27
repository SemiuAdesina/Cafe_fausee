# Café Fausse - Restaurant Management System

A modern restaurant management system with a React frontend and Flask backend, featuring menu management, reservations, gallery, and admin dashboard.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **pip** (Python package manager)

### Project Structure

```
Cafe_fausee/
├── frontend/          # React application
├── backend/           # Flask API server
├── README.md         # This file
└── ...
```

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Cafe_fausee
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Create Virtual Environment (if not exists)
```bash
python -m venv venv
```

#### Activate Virtual Environment

**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Set Up Environment Variables
Create a `.env` file in the backend directory:
```bash
cp .env.example .env
# Edit .env with your configuration
```

#### Initialize Database (if needed)
```bash
flask db upgrade
```

#### Run the Backend Server
```bash
python run.py
```

The backend will start on `http://localhost:5001`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd frontend
```

#### Install Node.js Dependencies
```bash
npm install
```

#### Start the Development Server
```bash
npm start
```

The frontend will start on `http://localhost:5173`

## 🌐 Accessing the Application

### Frontend URLs
- **Home Page**: http://localhost:5173/
- **Menu**: http://localhost:5173/menu
- **Reservations**: http://localhost:5173/reservations
- **About Us**: http://localhost:5173/about
- **Gallery**: http://localhost:5173/gallery
- **Admin Dashboard**: http://localhost:5173/admin

### Backend API
- **API Base URL**: http://localhost:5001/api
- **API Documentation**: Available at http://localhost:5001/api/docs (if configured)

## 🔧 Development

### Running Both Servers

You'll need to run both the frontend and backend servers simultaneously:

#### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # On macOS/Linux
python run.py
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

### Available Scripts

#### Frontend Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

#### Backend Scripts
```bash
python run.py              # Start development server
flask db upgrade          # Run database migrations
flask db migrate          # Create new migration
flask shell              # Open Flask shell
```

## 📁 Project Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── styles/          # CSS files
│   ├── assets/          # Images and static files
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Public assets
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

### Backend Structure
```
backend/
├── app/
│   ├── __init__.py      # Flask app factory
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── utils/           # Utility functions
├── migrations/          # Database migrations
├── tests/              # Test files
├── requirements.txt    # Python dependencies
└── run.py             # Application entry point
```

## 🗄️ Database

The application uses SQLAlchemy with PostgreSQL. Make sure you have:

1. **PostgreSQL** installed and running
2. **Database** created
3. **Environment variables** configured in `.env`

### Database Setup
```bash
# Create database
createdb cafe_fausse

# Run migrations
flask db upgrade
```

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@localhost/cafe_fausse
SECRET_KEY=your-secret-key
FLASK_ENV=development
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
python -m pytest
```

## 🚀 Production Deployment

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Production
```bash
cd backend
export FLASK_ENV=production
python run.py
```

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
- Check if virtual environment is activated
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Check if port 5001 is available
- Verify database connection

#### Frontend Won't Start
- Check if Node.js version is compatible
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

#### API Calls Failing
- Ensure backend is running on port 5001
- Check CORS configuration
- Verify API endpoints in browser network tab

#### Database Issues
- Check PostgreSQL is running
- Verify database exists
- Run migrations: `flask db upgrade`

### Port Conflicts

If ports are already in use:

#### Change Backend Port
Edit `backend/run.py`:
```python
app.run(debug=True, port=5002)  # Change to different port
```

#### Change Frontend Port
Edit `frontend/vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000  // Change to different port
  }
})
```

## 📝 Features

### Frontend Features
- ✅ Responsive design
- ✅ Dark/Light theme toggle
- ✅ Menu with search and filtering
- ✅ Reservation system
- ✅ Gallery with lightbox
- ✅ Admin dashboard
- ✅ Newsletter signup
- ✅ Mobile-friendly navigation

### Backend Features
- ✅ RESTful API
- ✅ Database management
- ✅ Email notifications
- ✅ Admin authentication
- ✅ File uploads
- ✅ CORS support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the console logs for errors
3. Check the network tab in browser dev tools
4. Verify all dependencies are installed correctly

For additional help, please open an issue in the repository. 