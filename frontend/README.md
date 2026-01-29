# ⚛️ Petty Cash Frontend

Modern React application built with Vite, Tailwind CSS, and real-time toast notifications.

## 🚀 Quick Start

### Prerequisites

- Node.js v16+

### Installation

```bash
npm install
npm run dev       # Start dev server at http://localhost:3001
```

Open browser at http://localhost:3001

### Environment Variables

Create `.env.production` for production:

```env
VITE_API_URL=https://your-backend-api.com/api
```

Development uses `http://localhost:5000/api` by default.

## 📦 Available Scripts

```bash
npm run dev        # Development server with HMR
npm run build      # Production build to dist/
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout with sidebar
│   │   └── CameraCapture.jsx   # Camera for receipt capture
│   ├── pages/
│   │   ├── Login.jsx           # Login with OTP
│   │   ├── Dashboard.jsx       # Analytics & charts
│   │   ├── Transactions.jsx    # Transaction list & approval
│   │   ├── NewTransaction.jsx  # Create expense
│   │   ├── SubmitExpense.jsx   # Quick submit
│   │   ├── Reports.jsx         # Generate & export reports
│   │   ├── UserManagement.jsx  # User CRUD (Admin)
│   │   └── FundTransfer.jsx    # Fund transfers
│   ├── utils/
│   │   └── axios.js            # Axios config with auth
│   ├── assets/                 # Images & icons
│   ├── App.jsx                 # Router & auth context
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind & global styles
├── public/                     # Static assets
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind customization
├── postcss.config.js           # PostCSS setup
├── vercel.json                 # Vercel SPA routing
├── .env.production             # Production API URL
└── .nvmrc                      # Node v16
```

## 🎨 Tech Stack

- **React 18** - UI library with hooks
- **Vite 5** - Fast build tool with HMR
- **Tailwind CSS 3** - Utility-first styling
- **React Router 6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **React Toastify** - Toast notifications
- **Recharts** - Charts for dashboard
- **React Icons** - Icon library

## 🎯 Key Features

### Pages & Features

**Dashboard**

- Total expenses summary
- Pending approvals count
- Category-wise pie chart
- Monthly trend line chart
- Recent transactions list

**Transactions**

- Filterable transaction list
- Approve/reject with modals
- Rejection comments
- Receipt viewing
- Status badges

**New Transaction**

- Category selection
- Amount input
- Description
- Receipt upload (drag & drop)
- Camera capture option

**Reports**

- Date range picker
- User filter
- Category filter
- Status filter
- Export to Excel
- Email to CEO

**User Management (Admin)**

- Create users
- Assign roles
- Deactivate/delete
- Resend invitations
- Activity logs

**Fund Transfer**

- Record fund transfers
- Transfer history
- Clear history

### UI Components

**Toast Notifications**

- Success, error, warning, info
- Auto-dismiss
- Positioned top-right

**Custom Modals**

- Confirmation modals
- Rejection modal with textarea
- Action buttons

**Camera Capture**

- Access device camera
- Capture receipt photo
- Preview before submit

**Responsive Design**

- Mobile-friendly sidebar
- Responsive tables
- Touch-friendly buttons

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm run build
npm install -g vercel
vercel --prod
```

Set environment variable in Vercel dashboard:

- `VITE_API_URL` = Your backend API URL

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

Add `_redirects` file:

```
/*  /index.html  200
```

### Build Output

Production build creates optimized `dist/` folder:

- Minified JS with Terser
- Console logs removed
- CSS purged & minified
- Assets hashed for caching

## 🔐 Authentication Flow

1. User enters email on login page
2. Backend sends OTP to email
3. User enters 6-digit OTP
4. Backend verifies & returns JWT
5. Token stored in localStorage
6. Axios adds token to all requests
7. Auto-redirect to login on 401

## 🧪 Testing

### Test Credentials (after backend seeding)

```
Admin:
  Email: admin@company.com
  Password: Admin@123

Manager:
  Email: manager@company.com
  Password: Manager@123

Employee:
  Email: employee@company.com
  Password: Employee@123
```

### Manual Testing Checklist

- [ ] Login with all roles
- [ ] Submit transaction with receipt
- [ ] Approve/reject as manager
- [ ] View dashboard charts
- [ ] Generate & export reports
- [ ] Create/edit/delete users (admin)
- [ ] Record fund transfer
- [ ] Test camera capture
- [ ] Test responsive design

## 🎨 Styling

### Tailwind Configuration

Custom colors in `tailwind.config.js`:

- Primary: Blue tones
- Success: Green
- Danger: Red
- Warning: Yellow

### Global Styles

- Custom scrollbar styling
- Toast container positioning
- Responsive font sizes
- Print styles for reports

## 🐛 Troubleshooting

**API Connection Failed**

- Check backend is running
- Verify API URL in axios.js
- Check CORS settings in backend

**Build Fails**

- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be v16+)
- Clear Vite cache: `rm -rf node_modules/.vite`

**Toast Not Appearing**

- Check React Toastify CSS imported in main.jsx
- Verify ToastContainer in App.jsx

**Camera Not Working**

- Requires HTTPS in production
- Check browser camera permissions
- Test on different device/browser

## 📝 Development Notes

### Code Style

- Use functional components with hooks
- PropTypes for type checking
- Async/await for API calls
- Try/catch for error handling
- Toast for user feedback

### State Management

- Local state with useState
- Context for auth (user, token)
- No Redux needed for this scale

### Performance

- Lazy loading routes
- Image optimization
- Code splitting
- Memoization where needed

## 📄 License

ISC
