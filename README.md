# Smart Event Booking System

A complete full-stack event booking application built with React, Node.js, Express, MySQL, Socket.IO, Tailwind CSS, and Framer Motion. The system allows users to browse events, book tickets, and manage reservations, while admins can create/manage events and track bookings.

## 🎯 Features

### User Features
- **Landing Page**: Beautiful parallax hero section with featured events
- **Event Listing**: Browse events with search, filters, and real-time seat availability
- **Event Details**: View detailed event information with parallax effects
- **Booking System**: Book tickets with dynamic price calculation
- **Booking Success**: QR code generation and downloadable ticket
- **Booking History**: View and manage all past bookings
- **Real-time Updates**: Socket.IO for real-time seat availability

### Admin Features
- **Secure Login**: JWT-based authentication
- **Event Management**: Create, edit, and delete events
- **Booking Tracking**: View all bookings for each event
- **Dashboard**: Comprehensive admin panel with statistics

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Socket.IO Client** for real-time updates
- **React Router** for navigation
- **React Hook Form** for form management
- **QRCode.react** for QR code generation
- **Axios** for API calls

### Backend
- **Node.js** runtime
- **Express** web framework
- **MySQL2** for database
- **Socket.IO** for real-time features
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Database
- **MySQL** with pre-designed schema
- Events, Bookings, and Admins tables

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MySQL** (v5.7 or higher)
- **Git**

## 🚀 Installation

### 1. Clone the Repository
```bash
cd smart-event-booking
```

### 2. Setup Database

#### Using MySQL CLI:
```bash
mysql -u root -p < schema.sql
```

Or manually:
1. Open MySQL Workbench or your MySQL client
2. Create database: `CREATE DATABASE event_booking;`
3. Import the schema.sql file
4. Verify the admin user is created (username: admin, password: admin123)

### 3. Setup Backend

```bash
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your database credentials
# Example:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=event_booking
# PORT=5001
# CLIENT_URL=http://localhost:5173

# Start the server
npm start
# For development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5001`

### 4. Setup Frontend

```bash
cd ../client

# Install dependencies
npm install

# Create .env.local file (copy from .env.example)
cp .env.example .env.local

# The default configuration should work:
# VITE_BACKEND_URL=http://localhost:5001
# VITE_SOCKET_URL=http://localhost:5001

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📖 Usage

### For Users

1. **Browse Events**
   - Visit `http://localhost:5173`
   - Click "Explore Events" or navigate to `/events`
   - Use search and filters to find events

2. **Book Tickets**
   - Click "Book Now" on any event
   - Select number of tickets
   - Fill in your details
   - Complete the booking
   - Download your QR code ticket

3. **View Bookings**
   - Go to `/bookings?email=your@email.com`
   - View all your bookings
   - Cancel bookings if needed

### For Admins

1. **Login**
   - Navigate to `/admin/login`
   - Default credentials:
     - Username: `admin`
     - Password: `admin123`

2. **Manage Events**
   - Create new events
   - Edit existing events
   - Delete events
   - View event bookings

3. **Track Bookings**
   - View all bookings for each event
   - See attendee details
   - Monitor seat availability

## 🔑 Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials in production!

To change admin password:
1. Hash new password using bcrypt
2. Update the database directly or through admin panel (if implemented)

## 📁 Project Structure

```
smart-event-booking/
├── server/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── routes/
│   │   ├── admin.js              # Admin routes
│   │   ├── events.js             # Event routes
│   │   └── bookings.js           # Booking routes
│   ├── .env.example              # Environment variables template
│   ├── server.js                 # Express server setup
│   └── package.json              # Backend dependencies
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   └── Footer.jsx        # Footer
│   │   ├── pages/
│   │   │   ├── Landing.jsx       # Home page
│   │   │   ├── EventListing.jsx  # Events browse page
│   │   │   ├── EventDetails.jsx  # Event details page
│   │   │   ├── BookingFlow.jsx   # Booking form
│   │   │   ├── UserBookings.jsx  # Booking history
│   │   │   ├── AdminLogin.jsx    # Admin login
│   │   │   └── AdminDashboard.jsx # Admin panel
│   │   ├── utils/
│   │   │   └── api.js            # API client
│   │   ├── App.jsx               # Main app component
│   │   ├── index.css             # Global styles
│   │   └── main.jsx              # React entry point
│   ├── index.html                # HTML template
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── .env.example              # Environment variables template
│   └── package.json              # Frontend dependencies
│
├── schema.sql                    # MySQL database schema
└── README.md                     # This file
```

## 🔗 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login

### Events
- `GET /api/events` - List all events (supports search, filters, sorting)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings?email=user@email.com` - Get user's bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/event/:event_id` - Get event bookings (admin)

## 🔌 Real-time Features

The application uses **Socket.IO** for real-time updates:

- **seatUpdate**: Broadcasts seat availability changes to all connected clients
- Automatically triggered after booking or cancellation
- Updates seat counters across the application in real-time

## 🎨 UI/UX Features

- **Parallax Effects**: Landing page and event details
- **Smooth Animations**: Page transitions, card hover effects, form animations
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and semantic HTML

## 🔒 Security Features

- **JWT Authentication**: Secure admin access
- **Password Hashing**: bcryptjs for secure password storage
- **CORS Protection**: Cross-origin request validation
- **Input Validation**: Form validation on client and server
- **Error Handling**: Secure error messages

## 📱 Responsive Design

The application is fully responsive:
- **Mobile**: Optimized for small screens
- **Tablet**: Adapted layouts for tablets
- **Desktop**: Full-featured desktop experience

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure MySQL is running: `mysql -u root -p`
- Check database credentials in `.env`
- Verify backend is running: `http://localhost:5001/api/health`

### Frontend Connection Issues
- Clear browser cache: Ctrl+Shift+Delete
- Check backend URL in `.env.local`
- Ensure both servers are running

### Database Issues
- Reset database: Drop and recreate using `schema.sql`
- Check MySQL user permissions
- Verify schema import: `SELECT * FROM events;`

### Socket.IO Connection Issues
- Check browser console for errors
- Ensure backend Socket.IO server is running
- Verify CORS settings in `server.js`

## 📦 Building for Production

### Backend
```bash
cd server
npm install --production
```

### Frontend
```bash
cd client
npm run build
# Output will be in dist/ folder
```

## 🚀 Deployment

### Backend Deployment (Heroku, AWS, DigitalOcean)
1. Set environment variables
2. Ensure MySQL is accessible
3. Deploy using platform-specific instructions

### Frontend Deployment (Vercel, Netlify, GitHub Pages)
1. Run `npm run build`
2. Deploy the `dist` folder
3. Update API URLs in environment variables

## 📝 Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_booking
PORT=5001
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-this
```

### Frontend (.env.local)
```
VITE_BACKEND_URL=http://localhost:5001
VITE_SOCKET_URL=http://localhost:5001
```

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements.

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs
3. Check browser console
4. Open an issue on GitHub

## 🎯 Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Email notifications
- SMS alerts
- Advanced analytics
- Multi-language support
- Dark mode
- Calendar view for events
- Wishlist/Favorites feature
- Social sharing
- Ratings and reviews

## 📞 Contact

For questions or support, please open an issue in the repository.

---

**Happy Booking! 🎉**
