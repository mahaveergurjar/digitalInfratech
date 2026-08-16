# Digital InfraTech - Complete Setup & Running Guide

## ✅ Issues Fixed

The following issues have been identified and fixed in your code:

### 1. **API URL Mismatch** ✅ FIXED
- **Problem**: AuthContext was using `http://localhost:8000/api` while api.js used `http://localhost:5000/api`
- **Fix**: Unified all API URLs to use `http://localhost:5000/api`
- **Files Updated**: `frontend/src/context/AuthContext.jsx`

### 2. **2-Step Login Not Implemented** ✅ FIXED
- **Problem**: Frontend tried simple password login, but backend requires password + OTP verification
- **Fix**: Completely rewrote Login.jsx with proper 2-step OTP flow:
  - **Step 1**: Email + Password verification → sends OTP to registered email
  - **Step 2**: Enter 6-digit OTP code → issues JWT token for session
- **Files Updated**: `frontend/src/pages/Auth/Login.jsx`

### 3. **Cart Orders Not Posting to Backend** ✅ FIXED
- **Problem**: Orders were using `mailto:` instead of POST requests to backend API
- **Fix**: Implemented proper async POST request to `/api/orders` endpoint with authentication
- **Files Updated**: `frontend/src/App.jsx` (handleSubmitOrder function)

### 4. **Missing Address Field** ✅ FIXED
- **Problem**: Checkout form didn't have address field required by backend
- **Fix**: Added address field to checkout form and form state
- **Files Updated**: `frontend/src/App.jsx`

### 5. **Login Button Not Connected** ✅ FIXED
- **Problem**: "Login via Email" button opened email client instead of login form
- **Fix**: Updated to navigate to proper login page with 2-step OTP flow
- **Files Updated**: `frontend/src/App.jsx`

---

## 🚀 How to Run This Project

### Prerequisites
- **Node.js** v16+ and npm
- **MongoDB** (Atlas connection or local)
- **Email Service** (Brevo API key configured)

### Step 1: Setup Backend

```bash
cd backend
npm install
```

**Backend Environment (.env)** - Already configured at `backend/.env`:
- ✅ PORT=5000
- ✅ MONGO_URI=mongodb://... (Connected to MongoDB Atlas)
- ✅ JWT secrets configured
- ✅ Brevo API key configured for email
- ✅ CORS origins enabled for frontend

**Start Backend:**
```bash
npm run dev
```

Expected output:
```
Backend running on http://localhost:5000
API: http://localhost:5000/api
```

### Step 2: Setup Frontend

```bash
cd frontend
npm install
```

**Frontend Environment (.env)** - Already configured at `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

**Start Frontend:**
```bash
npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

---

## 🔧 Testing the Full Flow

### Test 1: Register a New User (First Time Only)
1. Go to http://localhost:5173
2. Click "Signup" link at bottom of login
3. Enter name, email, password (min 8 chars, 1 uppercase, 1 number)
4. Submit registration
5. **Important**: Check your email for verification link
6. Click verification link to activate account
7. Now you can login

### Test 2: Login (2-Step OTP Process)
1. Go to http://localhost:5173
2. Click "Login" button
3. **Step 1 - Password Verification**:
   - Enter your email
   - Enter your password
   - Click "Next"
4. **Step 2 - OTP Verification**:
   - Check your email for 6-digit code
   - Enter the code in the form
   - Click "Verify & Login"
5. Should authenticate and redirect to home
6. Token stored in localStorage: `digitalinfratech-token`

### Test 3: Add Products to Cart
1. Browse products on homepage (scroll down)
2. Click "Add to cart" or "Buy now"
3. Cart icon should update with item count
4. Click cart icon to open cart drawer

### Test 4: Place an Order (Complete Checkout)
1. Open cart (click Cart button or icon)
2. Review items and click "Place order"
3. Fill in checkout form:
   - Full name ✓
   - Email ✓
   - Phone ✓
   - **Delivery Address** ✓ (NEW!)
   - City ✓
   - Special notes (optional)
4. Click "Place Order"
5. Should see success message: "Order placed successfully! Check your email for confirmation"
6. Cart clears automatically
7. Order created in MongoDB with status `pending`

### Test 5: Verify Order in Database
Orders are stored in MongoDB. To verify:
- Backend API: GET `/api/orders/mine` (requires auth token header)
- Database: Check `orders` collection in MongoDB
- Email: Confirmation sent via Brevo API

---

## 📝 API Endpoints Reference

### Authentication (2-Step OTP Login)
- `POST /api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com",
    "password": "SecurePass123",
    "role": "customer"
  }
  ```
  
- `GET /api/auth/verify-email` - Email verification page
  
- `POST /api/auth/login` - **Step 1: Verify password** (sends OTP to email)
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123"
  }
  ```
  Response:
  ```json
  {
    "challengeId": "mongo-object-id",
    "message": "Password verified. Enter the code sent to your email..."
  }
  ```

- `POST /api/auth/login/verify-code` - **Step 2: Verify OTP** (issues JWT token)
  ```json
  {
    "challengeId": "mongo-object-id",
    "code": "123456"
  }
  ```
  Response:
  ```json
  {
    "token": "jwt-token-here",
    "user": { "id": "...", "name": "...", "email": "..." }
  }
  ```

- `POST /api/auth/login/resend-code` - Resend OTP code
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout (revoke session)
- `POST /api/auth/change-password` - Change password (requires auth)

### Orders (Cart Checkout)
- `POST /api/orders` - **Create new order** (requires auth token)
  ```json
  {
    "itemType": "product|service",
    "productId": "mongo-id",  // for products
    "serviceId": "mongo-id",  // for services
    "quantity": 1,
    "contactName": "Customer Name",
    "contactEmail": "customer@email.com",
    "address": "123 Main Street",
    "city": "Lucknow"
  }
  ```

- `GET /api/orders/mine` - Get my orders (requires auth)
- `GET /api/orders/:id` - Get specific order (requires auth)

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details

### Services
- `GET /api/services` - List all services
- `GET /api/services/:id` - Get service details

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Login not working - OTP not received"
**Cause**: Email service (Brevo) not sending OTP or email address not verified
**Solution**:
- Check email spam folder
- Verify backend BREVO_API_KEY in `backend/.env`
- Check backend logs: `Brevo API request failed...`
- Make sure user was registered with verified email
- Check email in backend `.env`: `EMAIL_FROM=auth@digitalinfratech.in`

### Issue 2: "Invalid verification code"
**Cause**: Entered wrong OTP or OTP expired (10 minutes)
**Solution**:
- Click "Resend Code" to get new OTP
- Check you're copying the correct 6 digits
- Maximum 5 attempts per OTP attempt

### Issue 3: "Cart products not shown after checkout"
**Cause**: Frontend successfully clears cart after order submission (expected)
**Solution**:
- This is normal behavior
- Check your orders: Login → Orders page (when implemented)
- Verify in database: Query `orders` collection

### Issue 4: "Order not saving to database"
**Cause**: Missing or invalid authentication token
**Solution**:
- Check browser DevTools > Application > LocalStorage
- Look for `digitalinfratech-token` key
- Must login first before placing order
- If token missing, login again

### Issue 5: "Email not being sent for order confirmation"
**Cause**: Brevo API key invalid, email service misconfigured
**Solution**:
- Check Brevo API key in `backend/.env`
- Check EMAIL_FROM is set to valid sender
- Check backend logs for mail service errors
- Test Brevo credentials in account settings

### Issue 6: "Backend port already in use"
**Cause**: Another process using port 5000
**Solution**:
```bash
# Find process using port 5000 (Windows)
netstat -ano | findstr :5000

# Kill it (replace PID)
taskkill /PID <PID> /F

# Or use different port
PORT=5001 npm run dev
```

### Issue 7: "Frontend can't connect to backend"
**Cause**: Wrong API URL or CORS configuration
**Solution**:
- Check `frontend/.env`: `VITE_API_URL=http://localhost:5000/api`
- Check `backend/.env`: `APP_CORS_ORIGINS=*`
- Verify backend is running: `http://localhost:5000/health`
- Check browser console for CORS errors

---

## 🛠️ Development Tools & Scripts

### Backend Scripts
```bash
npm run dev          # Start with nodemon (hot reload)
npm start            # Start production mode
npm test             # Run tests
npm run admin:seed   # Create admin user
npm run seed:login-users  # Create test users
```

### Frontend Scripts
```bash
npm run dev          # Start dev server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 📊 Database Schema Quick Reference

### Orders Collection
```javascript
{
  _id: ObjectId,
  customer: ObjectId,        // Reference to User
  itemType: "product|service",
  product: ObjectId,         // for product orders
  service: ObjectId,         // for service orders
  quantity: Number,
  amount: Number,
  contactName: String,
  contactEmail: String,
  address: String,
  status: "pending|confirmed|assigned|...",
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection (for testing)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: "customer|partner|admin",
  verified: Boolean,
  createdAt: Date
}
```

---

## ✨ What's Working Now

✅ Frontend API URL unified  
✅ Login button connects to proper login form  
✅ Cart displays correctly  
✅ Checkout form submits to backend API  
✅ Address field added to checkout  
✅ Order creation saves to database  
✅ Email service configured  
✅ Authentication token managed in localStorage  
✅ CORS enabled for frontend

---

## 🔐 Environment Variables Checklist

**Backend (.env)**
- [x] PORT=5000
- [x] MONGO_URI (MongoDB connection)
- [x] JWT_SECRET
- [x] JWT_REFRESH_SECRET
- [x] MAIL_PROVIDER=brevo
- [x] BREVO_API_KEY
- [x] EMAIL_FROM
- [x] APP_CORS_ORIGINS

**Frontend (.env)**
- [x] VITE_API_URL=http://localhost:5000/api

---

## 📞 Need Help?

Check these files for configuration:
- Backend config: `backend/src/config/env.js`
- Backend routes: `backend/src/routes/`
- Frontend services: `frontend/src/services/api.js`
- Frontend context: `frontend/src/context/AuthContext.jsx`
- Frontend App: `frontend/src/App.jsx`

