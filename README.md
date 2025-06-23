# EstateX 🏠

A modern, full-stack real estate platform built with the MERN stack (MongoDB, Express.js, React, Node.js). EstateX allows users to create, browse, and manage property listings with a beautiful, responsive interface supporting both light and dark themes.

## 🌟 Features

### Core Functionality

- **Property Listings**: Create, view, edit, and delete real estate listings
- **Dual Property Types**: Support for both rental and sale properties
- **Advanced Search**: Filter properties by location, type, price range, and specifications
- **User Authentication**: Secure signup, login, and user management
- **Image Upload**: Multiple image support with Cloudinary integration
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### UI/UX Features

- **Dark/Light Theme**: Toggle between modern dark and light themes
- **Toast Notifications**: Beautiful animated feedback messages
- **Loading States**: Smooth loading animations and progress indicators
- **Form Validation**: Real-time validation with helpful error messages
- **Random Data Generator**: Development helper for quick form population

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Lucide React** for icons

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Cloudinary** for image storage
- **JWT** for authentication
- **bcrypt** for password hashing
- **Multer** for file uploads

## 📁 Project Structure

```
EstateX/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── redux/         # Redux store and slices
│   │   ├── services/      # API service functions
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   └── data/          # Static data and schemas
│   └── public/            # Static assets
└── server/                # Node.js backend
    ├── controllers/       # Route controllers
    ├── models/           # MongoDB models
    ├── routes/           # Express routes
    ├── middleware/       # Custom middleware
    └── utils/            # Backend utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mskchaithanyaraj/estatex.git
   cd estatex
   ```

2. **Install backend dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Environment Setup

#### Backend (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. **Start the backend server**

   ```bash
   cd server
   npm start
   ```

2. **Start the frontend development server**

   ```bash
   cd client
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📱 Key Features Showcase

### Property Management

- Create detailed property listings with multiple images
- Support for apartments, houses, land, and other property types
- Flexible pricing for both rental and sale properties
- Comprehensive property specifications (bedrooms, bathrooms, area)

### User Experience

- Intuitive form interfaces with real-time validation
- Advanced search and filtering capabilities
- Responsive design that works on all devices
- Dark/light theme toggle for user preference

### Developer Experience

- TypeScript for type safety
- ESLint configuration for code quality
- Modular component architecture
- Environment-based configuration

## 🎨 Theming

EstateX features a sophisticated theming system with:

- **Light Theme**: Clean, professional appearance with blue accents
- **Dark Theme**: Modern dark interface with purple/pink gradients
- **CSS Custom Properties**: Easy theme customization
- **Smooth Transitions**: Animated theme switching

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Listings

- `GET /api/listings` - Get all listings
- `POST /api/listings` - Create new listing
- `GET /api/listings/:id` - Get listing by ID
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🚢 Deployment

The project is configured for easy deployment:

- **Frontend**: Optimized Vite build with `npm run build`
- **Backend**: Production-ready Express server
- **Database**: MongoDB Atlas for cloud hosting
- **Images**: Cloudinary for reliable image storage
- **Hosting**: Ready for platforms like Netlify, Vercel, or Heroku

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created with ❤️ by Sri Krishna Chaithanya Raj Masimukku

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Cloudinary for image management solutions
- MongoDB for the flexible database solution

---

**EstateX** - Making real estate management simple and beautiful.
