# Email System Setup & Testing Guide

## 📧 Overview

The Café Fausse application includes a comprehensive email notification system that automatically sends emails for various events:

- **Reservation Confirmations** - Sent to customers when reservations are created
- **Reservation Cancellations** - Sent to customers when reservations are cancelled
- **Reservation Updates** - Sent to customers when reservations are modified
- **Newsletter Welcome** - Sent to new newsletter subscribers
- **Admin Notifications** - Sent to admin when new reservations are created
- **Email Service Test** - For testing email functionality

## 🔧 Setup Instructions

### 1. Environment Variables

Ensure your `.env` file contains the following email configuration:

```env
# Email Configuration
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USE_SSL=False
NOTIFY_EMAIL_USER=your-email@gmail.com
NOTIFY_EMAIL_PASS=your-app-password
MAIL_DEFAULT_SENDER=your-email@gmail.com

# Admin Email (optional)
ADMIN_EMAIL=admin@cafefausse.com
```

### 2. Gmail Setup

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

#### Step 2: Generate App Password
1. Go to Google Account settings
2. Navigate to Security
3. Under "2-Step Verification", click "App passwords"
4. Generate a new app password for "Mail"
5. Use this password in your `.env` file

#### Step 3: Allow Less Secure Apps (Alternative)
If you prefer not to use 2FA, you can enable "Less secure app access":
1. Go to Google Account settings
2. Navigate to Security
3. Enable "Less secure app access"

### 3. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## 🚀 Testing Email Endpoints

### Method 1: Using the Test Script

1. **Update the test email** in `test_email_endpoints.py`:
   ```python
   TEST_EMAIL = "your-email@gmail.com"  # Change this to your email
   ```

2. **Run the test script**:
   ```bash
   cd backend
   python test_email_endpoints.py
   ```

### Method 2: Using curl

#### Test Reservation Confirmation
```bash
curl -X POST http://localhost:5001/api/email/reservation-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "id": 123,
    "customer_name": "John Doe",
    "email": "your-email@gmail.com",
    "phone": "(555) 123-4567",
    "time_slot": "2024-12-25T19:00:00",
    "table_number": 15,
    "number_of_guests": 4
  }'
```

#### Test Newsletter Welcome
```bash
curl -X POST http://localhost:5001/api/email/newsletter-welcome \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@gmail.com"}'
```

#### Test Email Service
```bash
curl -X POST http://localhost:5001/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@gmail.com", "test": true}'
```

### Method 3: Using the Frontend

1. **Start the backend server**:
   ```bash
   cd backend
   flask run --port=5001
   ```

2. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test through the admin interface**:
   - Go to `/admin`
   - Login with admin credentials
   - Navigate to Reservations Manager
   - Click the email icon next to any reservation

## 📋 Email Endpoints Reference

### 1. Reservation Confirmation
- **Endpoint**: `POST /api/email/reservation-confirmation`
- **Purpose**: Send confirmation email to customer
- **Data Required**:
  ```json
  {
    "id": 123,
    "customer_name": "John Doe",
    "email": "customer@example.com",
    "phone": "(555) 123-4567",
    "time_slot": "2024-12-25T19:00:00",
    "table_number": 15,
    "number_of_guests": 4
  }
  ```

### 2. Reservation Cancellation
- **Endpoint**: `POST /api/email/reservation-cancellation`
- **Purpose**: Send cancellation email to customer
- **Data Required**: Same as confirmation

### 3. Reservation Update
- **Endpoint**: `POST /api/email/reservation-update`
- **Purpose**: Send update notification to customer
- **Data Required**: Same as confirmation

### 4. Newsletter Welcome
- **Endpoint**: `POST /api/email/newsletter-welcome`
- **Purpose**: Send welcome email to new subscribers
- **Data Required**:
  ```json
  {
    "email": "subscriber@example.com"
  }
  ```

### 5. Admin Notification
- **Endpoint**: `POST /api/email/admin-notification`
- **Purpose**: Send notification to admin about new reservation
- **Data Required**: Same as confirmation

### 6. Email Service Test
- **Endpoint**: `POST /api/email/test`
- **Purpose**: Test email service functionality
- **Data Required**:
  ```json
  {
    "email": "test@example.com",
    "test": true
  }
  ```

## 🎨 Email Templates

All emails include:
- **Professional HTML formatting**
- **Responsive design**
- **Café Fausse branding**
- **Clear call-to-action**
- **Contact information**

### Template Features:
- **Gradient headers** with brand colors
- **Structured content** with clear sections
- **Professional styling** with consistent fonts
- **Mobile-responsive** design
- **Fallback plain text** versions

## 🔍 Troubleshooting

### Common Issues:

#### 1. "Authentication failed" error
- **Solution**: Check your Gmail app password
- **Alternative**: Enable "Less secure app access"

#### 2. "Connection timeout" error
- **Solution**: Check firewall settings
- **Alternative**: Try different SMTP port (465 with SSL)

#### 3. "Email not received"
- **Check**: Spam/junk folder
- **Verify**: Email address is correct
- **Test**: Use the test endpoint first

#### 4. "Module not found" error
- **Solution**: Install missing dependencies
- **Command**: `pip install -r requirements.txt`

### Debug Mode

Enable debug mode in your `.env` file:
```env
MAIL_DEBUG=True
MAIL_SUPPRESS_SEND=False
```

### Logging

Check the Flask application logs for detailed error messages:
```bash
flask run --port=5001 --debug
```

## 🔄 Automatic Email Triggers

The following actions automatically trigger emails:

1. **New Reservation Created** → Confirmation email + Admin notification
2. **Reservation Cancelled** → Cancellation email
3. **Newsletter Signup** → Welcome email
4. **Admin Actions** → Manual email sending through admin interface

## 📊 Email Analytics

To track email performance, consider adding:
- Email open tracking
- Click tracking
- Bounce handling
- Unsubscribe functionality

## 🔒 Security Considerations

1. **App Passwords**: Use Gmail app passwords instead of regular passwords
2. **Environment Variables**: Never commit email credentials to version control
3. **Rate Limiting**: Consider implementing rate limiting for email endpoints
4. **Validation**: All email addresses are validated before sending

## 🚀 Production Deployment

For production deployment:

1. **Use a professional email service** (SendGrid, Mailgun, etc.)
2. **Set up proper DNS records** (SPF, DKIM, DMARC)
3. **Implement email queuing** for high-volume scenarios
4. **Add monitoring and alerting** for email failures
5. **Set up email templates** in the email service provider

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your Gmail settings
3. Test with the provided test script
4. Check Flask application logs
5. Ensure all dependencies are installed

---

**Happy emailing! 📧✨** 