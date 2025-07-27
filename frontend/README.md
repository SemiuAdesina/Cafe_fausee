# Café Fausse Frontend

A modern, responsive React application for Café Fausse restaurant featuring a sophisticated dining experience with admin management capabilities.

## 🚀 Features

### **Public Features**
- **Home Page**: Hero section with restaurant branding and newsletter signup
- **Menu**: Interactive menu with food images and pricing
- **Reservations**: Customer reservation booking system
- **About**: Restaurant story with team images and history
- **Gallery**: Photo gallery with lightbox functionality
- **Customer Service**: Reservation lookup and management
- **Newsletter Signup**: Email subscription with validation
- **Dark/Light Theme**: Toggle between themes
- **Responsive Design**: Mobile-first approach

### **Admin Features**
- **Dashboard**: Overview with quick actions
- **Reservation Management**: View, edit, cancel reservations
- **Menu Management**: CRUD operations for menu items
- **Gallery Management**: Upload and manage images
- **Newsletter Management**: View subscribers and export data
- **About Management**: Edit restaurant information
- **Image Upload**: Cloudinary integration

## 🛠️ Tech Stack

- **Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.4
- **Routing**: React Router DOM 7.7.1
- **Styling**: CSS3 + Styled Components 6.1.19
- **Icons**: React Icons 5.5.0
- **HTTP Client**: Axios 1.11.0
- **Image Lightbox**: React Image Lightbox 5.1.4
- **Linting**: ESLint 9.30.1

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/                 # Images and static files
│   ├── components/             # Reusable UI components
│   │   ├── admin/             # Admin-specific components
│   │   └── ...                # General components
│   ├── pages/                 # Page components
│   │   ├── admin/             # Admin pages
│   │   └── ...                # Public pages
│   ├── services/              # API services and utilities
│   ├── styles/                # CSS stylesheets
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # App entry point
│   └── index.css              # Global styles
├── public/                    # Public assets
├── package.json               # Dependencies and scripts
└── vite.config.js            # Vite configuration
```

## 🎨 Components Overview

### **Core Components**

#### **Layout Components**
- `Navbar.jsx` - Navigation with theme toggle and mobile menu
- `Footer.jsx` - Footer with newsletter signup link
- `Card.jsx` - Reusable card component with dark/light themes

#### **Form Components**
- `ReservationForm.jsx` - Customer reservation booking
- `NewsletterForm.jsx` - Email subscription with validation
- `ImageUpload.jsx` - File upload with drag & drop

#### **UI Components**
- `ThemeToggle.jsx` - Dark/light theme switcher
- `ToastContainer.jsx` - Notification system
- `SearchFilter.jsx` - Search and filtering functionality
- `Pagination.jsx` - Pagination controls

### **Admin Components**

#### **Management Components**
- `AdminDashboard.jsx` - Main admin interface
- `AdminLogin.jsx` - Admin authentication
- `AdminNavbar.jsx` - Admin navigation
- `ReservationsManager.jsx` - Reservation management
- `MenuManager.jsx` - Menu item management
- `GalleryManager.jsx` - Image and content management
- `NewsletterManager.jsx` - Newsletter subscriber management
- `AboutManager.jsx` - Restaurant information management

## 📄 Pages

### **Public Pages**
- `Home.jsx` - Landing page with hero and newsletter
- `Menu.jsx` - Restaurant menu with food images
- `Reservations.jsx` - Reservation booking page
- `About.jsx` - Restaurant story and team
- `Gallery.jsx` - Photo gallery with lightbox

### **Admin Pages**
- `AdminDashboard.jsx` - Admin control panel

## 🔧 Services

### **API Services**
- `apiConfig.js` - Base API configuration
- `adminService.js` - Admin authentication
- `reservationService.js` - Reservation operations
- `menuService.js` - Menu management
- `galleryService.js` - Gallery and image operations
- `newsletterService.js` - Newsletter operations
- `aboutService.js` - About page management
- `emailService.js` - Email notifications

### **Utilities**
- `utils.js` - Helper functions (validation, formatting, etc.)
- `index.js` - Service exports

## 🎨 Styling

### **CSS Architecture**
- **Component-specific CSS**: Each component has its own stylesheet
- **Responsive Design**: Mobile-first approach with breakpoints
- **Theme Support**: Dark and light theme implementations
- **CSS Variables**: Consistent color scheme and spacing

### **Key Style Files**
- `index.css` - Global styles and theme variables
- `Navbar.css` - Navigation styling with mobile menu
- `Home.css` - Home page and newsletter animations
- `Menu.css` - Menu layout and food image styling
- `About.css` - About page with team image layouts
- `Gallery.css` - Gallery grid and lightbox styling
- `Admin.css` - Admin interface styling
- `Toast.css` - Notification system styling

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Cafe_fausee/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### **Available Scripts**

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔧 Configuration

### **Environment Variables**
Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### **Vite Configuration**
The project uses Vite with React plugin for fast development and optimized builds.

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### **Mobile Features**
- Collapsible navigation menu
- Touch-friendly interfaces
- Optimized image loading
- Responsive typography

## 🎯 Key Features

### **Theme System**
- Dark/Light theme toggle
- Persistent theme preference
- Smooth theme transitions
- Brand-consistent colors

### **Image Management**
- High-quality food photography
- Optimized image loading
- Lightbox gallery functionality
- Cloudinary integration for admin uploads

### **Form Validation**
- Real-time validation
- Error messaging
- Success notifications
- Input sanitization

### **Animation System**
- Smooth scrolling
- Hover effects
- Loading animations
- Newsletter blink effect

## 🔒 Security Features

- **Input Validation**: Client-side validation for all forms
- **XSS Prevention**: Sanitized inputs and outputs
- **CSRF Protection**: Token-based authentication
- **Secure Headers**: Proper HTTP headers

## 📊 Performance

### **Optimizations**
- **Code Splitting**: Lazy-loaded components
- **Image Optimization**: WebP format and responsive images
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Browser caching strategies

### **Loading Performance**
- **Lazy Loading**: Images and components
- **Preloading**: Critical resources
- **Compression**: Gzip compression
- **CDN Ready**: Static asset optimization

## 🧪 Testing

### **Code Quality**
- ESLint configuration
- React Hooks linting
- Consistent code formatting
- Type checking

### **Browser Compatibility**
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- Progressive enhancement

## 🚀 Deployment

### **Build Process**
```bash
npm run build
```

### **Production Files**
- Optimized JavaScript bundles
- Minified CSS
- Compressed images
- Static assets

### **Deployment Options**
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **AWS S3**: Static hosting
- **Traditional hosting**: FTP upload

## 🤝 Contributing

### **Code Style**
- Follow existing code patterns
- Use meaningful component names
- Add comments for complex logic
- Maintain responsive design

### **Component Guidelines**
- Keep components focused and reusable
- Use proper prop validation
- Implement error boundaries
- Follow React best practices

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with details
- Contact the development team

---

**Café Fausse Frontend** - A modern dining experience powered by React ✨
