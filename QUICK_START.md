# Quick Start - 30 Seconds

## Run Everything

**Option 1: Automatic (Windows)**
```bash
double-click: start-dev.bat
```

**Option 2: Manual (Any OS)**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend (after backend starts)
cd frontend
npm install
npm run dev
```

## Access Points
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## First Time Setup

1. **Register a new user**:
   - Go to http://localhost:5173
   - Click "Signup"
   - Verify email (check inbox + spam folder)

2. **Login** (2-step process):
   - Enter email + password
   - Check email for OTP code
   - Enter 6-digit code to complete login

3. **Place an order**:
   - Add products to cart
   - Fill address in checkout form
   - Click "Place Order"

## Environment Files

✅ Already configured:
- `backend/.env` - Port 5000, MongoDB, Brevo email, JWT secrets
- `frontend/.env` - VITE_API_URL=http://localhost:5000/api

## Key Files Modified

1. `frontend/src/context/AuthContext.jsx` - Fixed API URL
2. `frontend/src/pages/Auth/Login.jsx` - 2-step OTP login
3. `frontend/src/App.jsx` - Order API integration + address field
4. `frontend/src/App.jsx` - Fixed login button

## Database

MongoDB Atlas connection already in `backend/.env`
- Collections: users, orders, products, services, payments, etc.
- Orders automatically saved with customer contact info

## Email Service

Brevo API configured for:
- Email verification (registration)
- OTP login codes
- Order confirmations

## Support

See `RUNNING_GUIDE.md` for:
- Detailed setup instructions
- Complete testing flow
- API endpoint reference
- Troubleshooting guide
- Database schema reference
