# Frontend API Services

This directory contains all the API integration services for the Café Fausse frontend application.

## 📁 File Structure

```
services/
├── apiConfig.js          # Base API configuration and utilities
├── reservationService.js # Reservation management
├── newsletterService.js  # Newsletter signup and management
├── menuService.js        # Menu items management
├── galleryService.js     # Gallery, awards, reviews, and image uploads
├── aboutService.js       # About us information
├── adminService.js       # Admin authentication and session management
├── utils.js             # Utility functions and validation
├── index.js             # Service exports
└── README.md            # This file
```

## 🚀 Quick Start

### Import Services
```javascript
// Import all services
import { 
  reservationService, 
  newsletterService, 
  menuService, 
  galleryService, 
  aboutService, 
  adminService 
} from '../services/index.js';

// Or import individual services
import reservationService from '../services/reservationService.js';
```

### Basic Usage
```javascript
// Create a reservation
try {
  const reservation = await reservationService.createReservation({
    time_slot: '2025-07-26T19:00:00',
    number_of_guests: 2,
    customer_name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890'
  });
  console.log('Reservation created:', reservation);
} catch (error) {
  console.error('Error:', error.message);
}
```

## 📋 Service Details

### 1. API Configuration (`apiConfig.js`)
- **Base URL**: `http://localhost:5001/api`
- **Common headers**: Content-Type: application/json
- **Error handling**: Centralized error processing
- **Request wrapper**: `apiRequest()` function

### 2. Reservation Service (`reservationService.js`)
**Public Endpoints:**
- `createReservation(data)` - Create new reservation
- `lookupReservation(email, reservationId)` - Customer lookup
- `cancelReservation(email, reservationId)` - Customer cancellation

**Admin Endpoints:**
- `getAllReservations()` - View all reservations
- `updateReservation(id, data)` - Update reservation
- `deleteReservation(id)` - Delete reservation
- `exportReservationsCSV()` - Export to CSV

### 3. Newsletter Service (`newsletterService.js`)
**Public Endpoints:**
- `signupNewsletter(email)` - Subscribe to newsletter

**Admin Endpoints:**
- `getAllSignups()` - View all signups
- `exportNewsletterCSV()` - Export to CSV

### 4. Menu Service (`menuService.js`)
**Public Endpoints:**
- `getMenuItems()` - Get all menu items
- `getMenuItem(id)` - Get specific item

**Admin Endpoints:**
- `createMenuItem(data)` - Add new item
- `updateMenuItem(id, data)` - Update item
- `deleteMenuItem(id)` - Delete item

### 5. Gallery Service (`galleryService.js`)
**Public Endpoints:**
- `getGalleryImages()` - Get all images
- `getAwards()` - Get all awards
- `getReviews()` - Get all reviews

**Admin Endpoints:**
- `uploadGalleryImage(file, caption)` - Upload image (Cloudinary)
- `createAward(data)` - Add award
- `createReview(data)` - Add review
- CRUD operations for all gallery items

### 6. About Service (`aboutService.js`)
**Public Endpoints:**
- `getAboutInfo()` - Get about information

**Admin Endpoints:**
- `createAboutInfo(data)` - Create about info
- `updateAboutInfo(data)` - Update about info

### 7. Admin Service (`adminService.js`)
- `login(username, password)` - Admin login
- `logout()` - Admin logout
- `isLoggedIn()` - Check login status
- `healthCheck()` - API health check

## 🛠️ Utility Functions (`utils.js`)

### Validation
- `validateEmail(email)` - Email format validation
- `validatePhone(phone)` - Phone number validation
- `validateReservationData(data)` - Complete reservation validation

### Formatting
- `formatDate(dateString)` - Date formatting
- `formatTime(dateString)` - Time formatting
- `formatDateTime(dateString)` - DateTime formatting
- `formatPrice(price)` - Currency formatting
- `getDefaultReservationDate()` - Default reservation date

### Storage
- `storage.set(key, value)` - Save to localStorage
- `storage.get(key, defaultValue)` - Get from localStorage
- `storage.remove(key)` - Remove from localStorage

### UI Helpers
- `showSuccess(message)` - Success notification
- `showError(message)` - Error notification
- `showLoading(isLoading)` - Loading indicator
- `debounce(func, wait)` - Debounce function

## 🔐 Authentication

### Admin Authentication
```javascript
// Login
await adminService.login('username', 'password');

// Check if logged in
const isLoggedIn = await adminService.isLoggedIn();

// Logout
await adminService.logout();
```

### Session Management
- Uses cookies for session management
- Admin endpoints require authentication
- Automatic session validation

## 📊 Data Validation

### Reservation Data
```javascript
const reservationData = {
  time_slot: '2025-07-26T19:00:00', // ISO format, future date
  number_of_guests: 2,              // 1-20 guests
  customer_name: 'John Doe',        // Min 2 characters
  email: 'john@example.com',        // Valid email format
  phone: '123-456-7890'             // Optional
};

const validation = validateReservationData(reservationData);
if (validation.isValid) {
  // Proceed with reservation
} else {
  console.log('Validation errors:', validation.errors);
}
```

## 🖼️ Image Upload (Cloudinary)

### Upload Gallery Image
```javascript
const fileInput = document.getElementById('image-input');
const file = fileInput.files[0];

try {
  const result = await galleryService.uploadGalleryImage(file, 'Optional caption');
  console.log('Image uploaded:', result.url);
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

## 📁 CSV Export

### Export Reservations
```javascript
try {
  await reservationService.exportReservationsCSV();
  // File will be automatically downloaded
} catch (error) {
  console.error('Export failed:', error.message);
}
```

## 🧪 Testing

### API Test Component
Visit `/api-test` route to test all services:
- Health check
- Admin login
- All service endpoints
- Real-time test results

### Manual Testing
```javascript
// Test individual service
try {
  const result = await reservationService.testEndpoint();
  console.log('Service working:', result);
} catch (error) {
  console.error('Service failed:', error);
}
```

## 🔧 Configuration

### Environment Variables
The API base URL is configured in `apiConfig.js`:
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

### CORS
Backend is configured with CORS to allow frontend requests from `http://localhost:5173`.

## 📝 Error Handling

All services use centralized error handling:
```javascript
try {
  const result = await someService.someMethod();
  // Handle success
} catch (error) {
  // Error is automatically logged and formatted
  showError(error.message);
}
```

## 🚀 Next Steps

1. **Test Services**: Visit `/api-test` to verify all services work
2. **Integrate Components**: Use services in React components
3. **Add Error Boundaries**: Implement React error boundaries
4. **Add Loading States**: Implement loading indicators
5. **Add Notifications**: Replace alert() with proper notifications
6. **Add Form Validation**: Use utility functions for form validation

## 📚 Examples

### Complete Reservation Flow
```javascript
import { reservationService, validateReservationData, showSuccess, showError } from '../services/index.js';

const handleReservation = async (formData) => {
  // Validate data
  const validation = validateReservationData(formData);
  if (!validation.isValid) {
    showError('Please fix validation errors');
    return;
  }

  try {
    // Create reservation
    const result = await reservationService.createReservation(formData);
    showSuccess('Reservation created successfully!');
    console.log('Reservation:', result);
  } catch (error) {
    showError(error.message);
  }
};
```

### Admin Dashboard
```javascript
import { adminService, reservationService, newsletterService } from '../services/index.js';

const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [signups, setSignups] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resData, signupData] = await Promise.all([
          reservationService.getAllReservations(),
          newsletterService.getAllSignups()
        ]);
        setReservations(resData.reservations);
        setSignups(signupData.signups);
      } catch (error) {
        showError('Failed to load admin data');
      }
    };
    loadData();
  }, []);

  // Component JSX...
};
``` 