# 💰 Petty Cash Management System

A production-ready full-stack web application for managing petty cash transactions with multi-level approval workflows, real-time notifications, and comprehensive reporting.

## ✨ Features

### Core Functionality

- 🔐 **Secure Authentication** - JWT-based auth with OTP verification
- 💼 **Transaction Management** - Create, approve, reject, and track expenses
- 📊 **Real-time Dashboard** - Live statistics and analytics with charts
- 👥 **User Management** - Role-based access control (Employee, Manager, Admin)
- 📸 **Receipt Upload** - Camera capture or file upload for receipts
- 📧 **Email Notifications** - Automated OTP and transaction status emails
- 📈 **Advanced Reports** - Detailed reports with Excel/PDF export
- 💸 **Fund Transfers** - Track petty cash fund transfers between accounts
- 🔍 **Search & Filter** - Advanced filtering by date, status, category, user
- 🎨 **Modern UI** - Responsive design with Tailwind CSS and toast notifications

### User Roles

- **Employee** - Submit expense requests with receipts
- **Manager** - Review and approve/reject requests
- **Admin** - System configuration, user management, full access

## 🚀 Tech Stack

### Frontend

- ⚛️ React 18 with Hooks
- ⚡ Vite (Fast build tool)
- 🎨 Tailwind CSS
- 🔔 React Toastify
- 📊 Recharts
- 🛣️ React Router v6
- 📡 Axios

### Backend

- 🟢 Node.js & Express
- 🍃 MongoDB & Mongoose
- 🔒 JWT Authentication
- 📧 Nodemailer
- 📁 Multer (File uploads)
- 📄 PDFKit & ExcelJS

## 📦 Quick Start

### Prerequisites

- Node.js v16+
- MongoDB (local or MongoDB Atlas)
- Gmail account (for email notifications)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and email credentials
npm run seed      # Seed initial data
npm run dev       # Start development server
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev       # Start development server (http://localhost:3001)
```

### Default Login Credentials (after seeding)

- **Admin**: admin@company.com / Admin@123
- **Manager**: manager@company.com / Manager@123
- **Employee**: employee@company.com / Employee@123

## 🌐 Deployment

### Deploy to Vercel (Recommended)

#### Frontend

```bash
cd frontend
npm run build
vercel --prod
```

#### Backend

```bash
cd backend
vercel --prod
```

Update `frontend/.env.production` with your backend URL.

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy backend
cd backend
railway login
railway init
railway up
```

### Deploy to Heroku

```bash
# Install Heroku CLI
cd backend
heroku create petty-cash-api
git push heroku main
```

### Environment Variables

**Backend (.env)**

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/petty_cash_db
JWT_SECRET=your_super_secret_key_change_in_production
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CEO_EMAIL=ceo@company.com
FRONTEND_URL=https://your-frontend-url.com
```

**Frontend (.env.production)**

```env
VITE_API_URL=https://your-backend-api.com/api
```

## 📁 Project Structure

```
petty-cash-app/
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth, upload, audit middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── services/         # Email, OTP, report services
│   ├── utils/            # JWT, file utilities
│   ├── uploads/          # Receipt storage
│   ├── server.js         # Express server
│   ├── seedData.js       # Database seeding
│   ├── vercel.json       # Vercel config
│   └── Procfile          # Heroku config
├── frontend/
│   ├── src/
│   │   ├── components/   # CameraCapture, Layout
│   │   ├── pages/        # Dashboard, Transactions, Reports, etc.
│   │   ├── utils/        # Axios config
│   │   ├── App.jsx       # Main router
│   │   └── main.jsx      # Entry point
│   ├── vercel.json       # SPA routing config
│   └── vite.config.js    # Build configuration
└── README.md
```

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/refresh-token` - Refresh JWT
- `GET /api/auth/me` - Get current user

### Transactions

- `GET /api/transactions` - List all transactions (with filters)
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get transaction details
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `POST /api/transactions/:id/approve` - Approve transaction
- `POST /api/transactions/:id/reject` - Reject transaction

### Users

- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/resend-invitation` - Resend invitation

### Reports

- `GET /api/reports/summary` - Get summary statistics
- `GET /api/reports/export` - Export to Excel
- `POST /api/reports/ceo` - Send CEO report email

### Categories

- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Fund Transfers

- `GET /api/fund-transfers` - List transfers
- `POST /api/fund-transfers` - Create transfer
- `DELETE /api/fund-transfers/:id` - Delete transfer

## 🔒 Security Features

- JWT token authentication with 7-day expiry
- Password hashing with bcrypt
- OTP verification via email
- Role-based access control
- Secure file upload validation
- CORS protection
- MongoDB injection prevention
- Audit logging for all actions

## 📊 Key Features Detail

### Transaction Workflow

1. Employee submits expense with receipt
2. Manager receives notification & reviews
3. Manager approves/rejects with comments
4. System updates balance & sends notifications
5. Transaction logged in audit trail

### Dashboard Analytics

- Total expenses by period
- Pending approvals count
- Category-wise breakdown (pie chart)
- Monthly trends (line chart)
- Recent transactions
- Budget utilization

### Reporting

- Date range filtering
- User-wise reports
- Category-wise reports
- Status-based filtering
- Excel export with formatting
- Email reports to CEO

## 🛠️ Development

### Run Tests

```bash
cd backend
npm test
```

### Build for Production

```bash
# Frontend
cd frontend
npm run build    # Output: dist/

# Backend
cd backend
npm start        # Production mode
```

### Database Seeding

```bash
cd backend
npm run seed       # Seed all data
npm run seed:otp   # Seed OTP only
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Verify MongoDB URI in `.env`
- Check network connectivity
- Whitelist IP in MongoDB Atlas

### Email Not Sending

- Enable 2FA in Gmail
- Generate app-specific password
- Update `EMAIL_PASSWORD` in `.env`

### Build Errors

- Clear `node_modules` and reinstall
- Check Node version (v16+)
- Verify all environment variables

## 📝 License

ISC

## 👥 Support

For issues and questions, please create an issue in the repository.

---

**Status:** ✅ Production Ready | **Version:** 1.0.0
