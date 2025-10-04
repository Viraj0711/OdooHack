# Expense Management Web Application

A fully functional, scalable, and transparent expense management system built with modern web technologies.

## 🚀 Features

### Core Features
- **Multi-Role Authentication**: Admin, Manager, Employee roles with JWT-based authentication
- **Smart Dashboards**: Role-specific interfaces for different user types
- **Advanced Approval Workflows**: Percentage, Override, and Hybrid approval rules
- **OCR Receipt Scanning**: Automatic data extraction from receipts
- **Currency Conversion**: Real-time exchange rates
- **Geo-tagging**: Location tracking for expense submissions
- **Audit Trail**: Complete tracking of all system actions

### Advanced Capabilities
- **Progressive Web App (PWA)**: Offline support and mobile-first design
- **Real-time Notifications**: WebSocket-based instant updates
- **Analytics Dashboard**: Comprehensive charts and reporting
- **AI Fraud Detection**: Smart approval suggestions (optional)

## 🛠 Tech Stack

### Frontend
- **React.js** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization
- **Tesseract.js** - OCR functionality
- **PWA** - Progressive Web App support

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Multer** - File upload handling

### Database
- **PostgreSQL** - Primary database
- **Role-Based Access Control (RBAC)**

### External APIs
- **RestCountries API** - Country detection
- **ExchangeRate API** - Currency conversion

## 📁 Project Structure

```
expense-management-app/
├── frontend/                 # React.js application
│   ├── public/              # Public assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── context/        # React context providers
│   └── package.json
├── backend/                 # Node.js/Express API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Database Setup
```bash
# Create PostgreSQL database
createdb expense_management

# Run migrations (after backend setup)
npm run migrate
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_management
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
EXCHANGE_RATE_API_KEY=your_api_key
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📱 PWA Features

- Offline functionality
- Push notifications
- App-like experience on mobile devices
- Background sync when connection is restored

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

## 📊 Analytics & Reporting

- Expense trends and patterns
- User activity monitoring
- Approval workflow efficiency
- Currency conversion tracking
- Fraud detection alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.