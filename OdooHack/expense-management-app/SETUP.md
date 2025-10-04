# 🚀 Expense Management Application - Setup & Running Guide

## 📋 Prerequisites

Before running the application, make sure you have:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
3. **Git** (optional) - [Download here](https://git-scm.com/)

## 🛠 Setup Instructions

### 1. PostgreSQL Database Setup

First, you need to set up your PostgreSQL database:

#### Option A: Using PostgreSQL Command Line
```bash
# Create database
createdb expense_management

# Or using psql
psql -U postgres
CREATE DATABASE expense_management;
\q
```

#### Option B: Using pgAdmin
1. Open pgAdmin
2. Create a new database named `expense_management`

### 2. Environment Configuration

#### Backend Environment
Navigate to the backend directory and configure your environment:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your database credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_management
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Other settings can remain as default for development
```

#### Frontend Environment
```bash
cd ../frontend
cp .env.example .env
```

The frontend `.env` file should work with defaults for development.

### 3. Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Method 1: Run Both Servers Separately (Recommended for Development)

#### Terminal 1 - Backend Server (Port 5000)
```bash
cd backend
npm run dev
```
You should see:
```
Server is running on port 5000 in development mode
Database connection has been established successfully.
Database models synchronized successfully.
```

#### Terminal 2 - Frontend Server (Port 3000)
```bash
cd frontend
npm start
```
You should see:
```
Local:            http://localhost:3000
```

### Method 2: Production Build

#### Build Frontend for Production
```bash
cd frontend
npm run build
```

#### Start Backend Server
```bash
cd backend
NODE_ENV=production npm start
```

## 🎯 Application Access

Once both servers are running:

1. **Frontend Application**: http://localhost:3000
2. **Backend API**: http://localhost:5000
3. **API Health Check**: http://localhost:5000/health

## 👤 First User Registration

When you first access the application:

1. Go to http://localhost:3000
2. Click "Create a new account"
3. Fill in the registration form:
   - **First Name**: Your first name
   - **Last Name**: Your last name
   - **Email**: Your email address
   - **Company Name**: Your company name
   - **Country**: Your country (e.g., "United States", "Canada", etc.)
   - **Password**: Strong password (min 8 chars, uppercase, lowercase, number, special char)

The first registered user automatically becomes an **Admin** and can:
- Manage users and roles
- Configure approval workflows
- View analytics and reports
- Access all system features

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Error
**Error**: `SequelizeConnectionRefusedError`
**Solution**: 
- Ensure PostgreSQL is running
- Check database credentials in `.env` file
- Verify database exists

#### 2. Port Already in Use
**Error**: `EADDRINUSE: address already in use :::5000`
**Solution**:
- Kill the process using the port: `npx kill-port 5000`
- Or change the port in `.env` file

#### 3. Frontend Build Issues
**Error**: Tailwind CSS not working
**Solution**:
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

#### 4. CORS Issues
**Error**: Cross-origin requests blocked
**Solution**: 
- Ensure `FRONTEND_URL=http://localhost:3000` in backend `.env`
- Restart backend server

### Database Reset (If Needed)

If you need to reset the database:
```sql
DROP DATABASE expense_management;
CREATE DATABASE expense_management;
```

Then restart the backend server - it will recreate all tables automatically.

## 🎨 Application Features

### 🔐 Authentication
- JWT-based secure authentication
- Multi-role support (Admin, Manager, Employee)
- Automatic company profile creation
- Country-based currency detection

### 💰 Expense Management
- Create, edit, and submit expenses
- Receipt upload support
- Multi-currency support with live exchange rates
- Category-based organization

### ✅ Approval Workflows
- Multi-level approval system
- Percentage-based rules (e.g., 60% approval needed)
- Override rules (mandatory approver)
- Hybrid rules (percentage OR specific approver)

### 📊 Analytics & Reporting
- Expense analytics by period, category, user
- Approval workflow efficiency metrics
- Real-time dashboard with key metrics
- Export capabilities

### 🔔 Real-time Features
- WebSocket-based notifications
- Live expense status updates
- Approval reminders
- System notifications

### 📱 Modern UI/UX
- Responsive design works on all devices
- Progressive Web App (PWA) support
- Offline capabilities
- Beautiful Tailwind CSS interface

## 🛡 Security Features

- Password encryption with bcrypt
- JWT token expiration
- Rate limiting
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Comprehensive audit trail

## 📈 Scalability Features

- Modular architecture
- Database indexing for performance
- Caching for exchange rates
- Background job support
- Horizontal scaling ready

## 🎯 Next Steps

Once the application is running:

1. **Register your first admin account**
2. **Configure company settings** (currency, workflows)
3. **Add team members** as managers and employees
4. **Set up approval workflows** based on your business rules
5. **Start submitting and approving expenses**

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Ensure all prerequisites are installed correctly
3. Verify environment configuration
4. Check server logs for detailed error messages

The application is now ready to use! 🎉