# 💰 Expense Management Web Application

A full-stack expense management system built with React.js frontend and Node.js backend, featuring modern UI design, role-based authentication, and comprehensive expense tracking capabilities.

## 🌟 Features

### ✨ **Core Functionality**
- **Multi-Role Authentication**: Admin, Manager, and Employee roles with JWT-based security
- **Expense Management**: Create, edit, view, and track expenses with receipt uploads
- **Approval Workflows**: Manager and admin approval system for expense submissions
- **Real-time Notifications**: WebSocket-powered live updates for expense status changes
- **Indian Currency Support**: All amounts displayed in Indian Rupees (₹)

### 🎨 **Modern UI/UX**
- **Gradient Designs**: Beautiful gradient backgrounds and modern card layouts
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Interactive Animations**: Smooth transitions and hover effects
- **Role-specific Dashboards**: Customized interfaces for different user roles

### 📱 **Advanced Features**
- **Receipt Management**: Upload and view expense receipts
- **Search & Filter**: Advanced filtering by date, category, status, and amount
- **Audit Trail**: Complete tracking of all expense-related activities
- **Company Management**: Multi-company support with role-based access control

## 🛠️ **Technology Stack**

### **Frontend**
- **React.js 18.2.0** - Modern React with hooks and context
- **Tailwind CSS 3.3.3** - Utility-first CSS framework
- **React Router 6.15.0** - Client-side routing
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Beautiful notifications

### **Backend**
- **Node.js & Express.js** - Server-side JavaScript runtime and framework
- **SQLite with Sequelize ORM** - Database management
- **JWT Authentication** - Secure token-based authentication
- **bcryptjs** - Password hashing
- **Socket.IO** - Real-time bidirectional communication
- **Helmet & CORS** - Security middleware

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v14 or higher)
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Viraj0711/OdooHack.git
   cd OdooHack
   ```

2. **Setup Backend**
   ```bash
   cd expense-management-app/backend
   npm install
   cp .env.example .env
   # Configure your environment variables in .env
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd expense-management-app/frontend
   npm install
   cp .env.example .env
   # Configure your environment variables in .env
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 **Project Structure**

```
expense-management-app/
├── backend/
│   ├── config/          # Database and logger configuration
│   ├── controllers/     # API route handlers
│   ├── middleware/      # Authentication and error handling
│   ├── models/          # Database models (User, Expense, Approval, etc.)
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic services
│   └── utils/           # Utility functions
│
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # Reusable React components
│       ├── context/     # React context providers
│       ├── hooks/       # Custom React hooks
│       ├── pages/       # Page components
│       ├── services/    # API service layer
│       └── utils/       # Utility functions
```

## 👥 **User Roles & Permissions**

### **Employee**
- Create and submit expense reports
- View own expense history
- Upload receipts and documentation
- Track approval status

### **Manager**
- All employee permissions
- Approve/reject team expenses
- View team expense reports
- Access expense analytics

### **Admin**
- All manager permissions
- User management and role assignment
- Company settings configuration
- System-wide analytics and reporting

## 🎯 **Key Pages & Features**

### **🏠 Dashboard**
- Role-specific overview cards
- Recent expense summaries
- Quick action buttons
- Real-time notifications

### **💰 Expenses Management**
- Comprehensive expense listing with search/filter
- Create new expense with category selection
- Receipt upload and management
- Status tracking (Draft, Pending, Approved, Rejected)

### **📄 Office Supplies Expense**
- Dedicated page for office supplies purchases
- Detailed itemization breakdown
- Vendor information management
- Business justification tracking

### **🔐 Authentication**
- Secure login/registration system
- Role-based access control
- JWT token management
- Password security with bcrypt

## 💡 **Special Features**

### **Enhanced UI Design**
- Modern gradient backgrounds
- Smooth animations and transitions
- Professional card layouts
- Consistent color theming

### **Indian Business Focus**
- Currency formatted in Indian Rupees (₹)
- Indian business context and examples
- Localized date and number formatting

### **Real-time Updates**
- Live expense status notifications
- Instant approval updates
- WebSocket-powered communication

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### **Expenses**
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/:id` - Get expense details
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### **Approvals**
- `GET /api/approvals` - List pending approvals
- `POST /api/approvals/:id/approve` - Approve expense
- `POST /api/approvals/:id/reject` - Reject expense

## 🛡️ **Security Features**

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Helmet security headers
- Input validation and sanitization

## 📱 **Mobile Responsiveness**

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🚀 **Deployment**

### **Backend Deployment**
1. Set up your production database
2. Configure environment variables
3. Build and deploy to your preferred platform (Heroku, AWS, etc.)

### **Frontend Deployment**
1. Run `npm run build` to create production build
2. Deploy the `build` folder to your hosting platform
3. Configure API endpoint in environment variables

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- Built for the Odoo Hackathon
- Inspired by modern expense management solutions
- Thanks to the React and Node.js communities

## 📞 **Contact**

For questions, suggestions, or support, please reach out through:
- GitHub Issues: [Create an issue](https://github.com/Viraj0711/OdooHack/issues)
- Email: [Your Email]

---

**⭐ Star this repository if you found it helpful!**