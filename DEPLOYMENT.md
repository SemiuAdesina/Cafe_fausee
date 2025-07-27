# 🚀 Deployment Guide - Render

This guide will help you deploy both the frontend and backend of Café Fausse on Render.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: Prepare your environment variables

## 🗄️ Database Setup

### 1. Create PostgreSQL Database on Render

1. Go to your Render dashboard
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `cafe-fausse-db`
   - **Database**: `cafe_fausse`
   - **User**: `cafe_fausse_user`
   - **Plan**: Free
4. Click "Create Database"
5. Copy the **Internal Database URL** (you'll need this later)

## 🔧 Backend Deployment

### 1. Connect Repository

1. Go to your Render dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository containing your code

### 2. Configure Backend Service

**Basic Settings:**
- **Name**: `cafe-fausse-backend`
- **Environment**: `Python 3`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend` (if your backend is in a subdirectory)

**Build & Deploy:**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn run:app`

### 3. Environment Variables

Add these environment variables in Render:

| Key | Value | Description |
|-----|-------|-------------|
| `FLASK_ENV` | `production` | Production environment |
| `DATABASE_URL` | `[Your PostgreSQL URL]` | From your database service |
| `SECRET_KEY` | `[Generate a secure key]` | Flask secret key |
| `MAIL_SERVER` | `smtp.gmail.com` | Email server |
| `MAIL_PORT` | `587` | Email port |
| `MAIL_USE_TLS` | `true` | Use TLS for email |
| `MAIL_USERNAME` | `[Your email]` | Your email address |
| `MAIL_PASSWORD` | `[Your app password]` | Email app password |

### 4. Deploy Backend

1. Click "Create Web Service"
2. Wait for the build to complete
3. Copy the **Service URL** (e.g., `https://cafe-fausse-backend.onrender.com`)

## 🎨 Frontend Deployment

### 1. Connect Repository (Same Repository)

1. Go to your Render dashboard
2. Click "New +" → "Static Site"
3. Connect the same GitHub repository

### 2. Configure Frontend Service

**Basic Settings:**
- **Name**: `cafe-fausse-frontend`
- **Environment**: `Static Site`
- **Region**: Same as backend
- **Branch**: `main`
- **Root Directory**: `frontend`

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 3. Environment Variables

Add this environment variable:

| Key | Value | Description |
|-----|-------|-------------|
| `VITE_API_URL` | `https://cafe-fausse-backend.onrender.com/api` | Your backend API URL |

### 4. Deploy Frontend

1. Click "Create Static Site"
2. Wait for the build to complete
3. Copy the **Site URL** (e.g., `https://cafe-fausse-frontend.onrender.com`)

## 🔄 Using Blueprint (Alternative Method)

### 1. Create Blueprint

Create a `render.yaml` file in your repository root:

```yaml
services:
  - type: web
    name: cafe-fausse-backend
    runtime: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn run:app
    envVars:
      - key: FLASK_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: cafe-fausse-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true

  - type: web
    name: cafe-fausse-frontend
    runtime: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm run preview
    envVars:
      - key: VITE_API_URL
        value: https://cafe-fausse-backend.onrender.com/api

databases:
  - name: cafe-fausse-db
    databaseName: cafe_fausse
    user: cafe_fausse_user
    plan: free
```

### 2. Deploy with Blueprint

1. Go to Render dashboard
2. Click "New +" → "Blueprint"
3. Connect your repository
4. Click "Apply"

## 🔐 Environment Variables Setup

### Backend Environment Variables

In your Render backend service, add these environment variables:

```bash
# Required
FLASK_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-super-secret-key-here

# Email Configuration (Optional)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# CORS Origins (Optional)
CORS_ORIGINS=https://cafe-fausse-frontend.onrender.com
```

### Frontend Environment Variables

In your Render frontend service, add:

```bash
VITE_API_URL=https://cafe-fausse-backend.onrender.com/api
```

## 🗄️ Database Migration

After deployment, you need to run database migrations:

### Option 1: Using Render Shell

1. Go to your backend service in Render
2. Click "Shell"
3. Run:
```bash
flask db upgrade
```

### Option 2: Using Local Connection

1. Get your database connection string from Render
2. Set it locally:
```bash
export DATABASE_URL="your-render-database-url"
flask db upgrade
```

## 🔍 Post-Deployment Checklist

### Backend Verification

- [ ] Service is running (green status in Render)
- [ ] API endpoints are accessible
- [ ] Database connection works
- [ ] CORS is configured correctly
- [ ] Environment variables are set

### Frontend Verification

- [ ] Site is accessible
- [ ] API calls work (check browser console)
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Static assets load

### Integration Testing

- [ ] Frontend can communicate with backend
- [ ] Menu loads from API
- [ ] Reservations work
- [ ] Admin dashboard functions
- [ ] Email notifications work (if configured)

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check logs in Render dashboard
# Common issues:
# - Missing environment variables
# - Database connection issues
# - Import errors
```

#### Frontend Build Fails
```bash
# Check build logs
# Common issues:
# - Missing dependencies
# - Environment variable issues
# - Build script errors
```

#### API Calls Failing
```bash
# Check browser console
# Common issues:
# - CORS configuration
# - Wrong API URL
# - Backend not running
```

#### Database Connection Issues
```bash
# Verify DATABASE_URL format
# Check if database is created
# Ensure migrations are run
```

### Debug Commands

#### Check Backend Logs
```bash
# In Render dashboard → Backend service → Logs
```

#### Check Frontend Logs
```bash
# In Render dashboard → Frontend service → Logs
```

#### Test API Endpoints
```bash
curl https://cafe-fausse-backend.onrender.com/api/health
```

## 🔄 Continuous Deployment

### Automatic Deployments

Render automatically deploys when you push to your main branch. To configure:

1. Go to your service in Render
2. Click "Settings"
3. Configure "Auto-Deploy" settings

### Manual Deployments

To manually deploy:
1. Go to your service in Render
2. Click "Manual Deploy"
3. Select branch and commit

## 📊 Monitoring

### Health Checks

Add health check endpoints to your backend:

```python
@app.route('/health')
def health_check():
    return {'status': 'healthy'}, 200
```

### Logs

Monitor logs in Render dashboard:
- Backend logs: Service → Logs
- Frontend logs: Static Site → Logs

## 🔒 Security

### Environment Variables

- Never commit sensitive data to Git
- Use Render's environment variable system
- Rotate secrets regularly

### CORS Configuration

Ensure CORS is properly configured for production:

```python
CORS_ORIGINS = [
    'https://cafe-fausse-frontend.onrender.com',
    'https://your-custom-domain.com'
]
```

## 📈 Scaling

### Free Tier Limitations

- **Backend**: 750 hours/month
- **Database**: 90 days retention
- **Static Site**: Unlimited

### Upgrading

To upgrade from free tier:
1. Go to service settings
2. Click "Change Plan"
3. Select paid plan

## 🆘 Support

If you encounter issues:

1. Check Render documentation: [docs.render.com](https://docs.render.com)
2. Review service logs in Render dashboard
3. Check environment variables
4. Verify database connection
5. Test API endpoints manually

## 🎉 Success!

Once deployed, your application will be available at:
- **Frontend**: `https://cafe-fausse-frontend.onrender.com`
- **Backend API**: `https://cafe-fausse-backend.onrender.com/api`
- **Database**: Managed by Render PostgreSQL 