# Role-Based Access Control (RBAC) - Complete Implementation Guide

## 📋 Overview

This jewelry website now features a complete role-based access control system with two distinct user roles:

### **🧑‍💼 Shopkeeper Role**
- Add new jewelry products to the catalog
- Edit their own products
- Delete their own products
- View their product dashboard
- Manage inventory through dashboard

### **🛍️ Customer Role**
- Browse all jewelry products
- View product details
- Add products to shopping cart
- Manage cart (add, remove, update quantity)
- Checkout and purchase jewelry

---

## 🔐 Backend Architecture

### 1. **User Model** (`User.js`)
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: String // 'customer' or 'shopkeeper' (default: 'customer')
  createdAt: Date
}
```

### 2. **Authorization Middleware** (`authMiddleware.js`)

#### `protect` - Authentication Middleware
Verifies JWT token and attaches user to request
```javascript
app.use(protect) // Verify user is logged in
```

#### `isShopkeeperOrAdmin` - Role-Based Authorization
Checks if user is shopkeeper or admin
```javascript
router.post('/products', protect, isShopkeeperOrAdmin, createProduct)
```

### 3. **Protected Routes** (`productRoutes.js`)
```
GET    /api/products       ✅ Public (anyone can view)
GET    /api/products/:id   ✅ Public (anyone can view)
POST   /api/products       🔒 Protected (shopkeeper/admin only)
PUT    /api/products/:id   🔒 Protected (shopkeeper/admin only)
DELETE /api/products/:id   🔒 Protected (shopkeeper/admin only)
```

---

## 🎨 Frontend Features

### 1. **Auth Context** (`AuthContext.js`)
Global state management for user authentication
```javascript
const { user, token, isShopkeeper, isCustomer, login, logout } = useAuth();
```

### 2. **Role-Based Navigation** (Navbar.js)
- **Shopkeeper**: Dashboard button visible
- **Customer**: Cart button visible
- **Both**: Logout and user menu

### 3. **Shopkeeper Dashboard** (`ShopkeeperDashboard.js`)
Complete product management interface:
- ➕ Add new products
- ✏️ Edit existing products
- 🗑️ Delete products
- 📊 View all your products in table format

**Form Fields:**
- Product Name (required)
- Price in ₹ (required)
- Category
- Description
- Image URL

**Features:**
- Form validation
- Success/error messages
- Product table with actions
- Edit product inline
- Responsive design

### 4. **Shopping Cart** (`Cart.js`)
Complete e-commerce cart experience:
- 🛒 View all items in cart
- ➕➖ Adjust quantities
- 🗑️ Remove items
- 📊 Order summary with tax calculation
- 💳 Checkout functionality
- 📦 Continue shopping option
- 🔒 Security indicators

**Cart Features:**
- LocalStorage persistence
- Quantity management
- Automatic total calculation
- Tax calculation (18% GST)
- Free shipping
- Order summary

### 5. **Product Card** (`ProductCard.js`)
Enhanced with role-based features:
- **Customers**: Add to Cart button visible
- **Non-logged-in**: Prompt to login before adding to cart
- Product details display

---

## 🚀 Usage Workflows

### **SHOPKEEPER WORKFLOW**

#### 1. Sign Up as Shopkeeper
```
1. Go to /register
2. Fill form with:
   - Name: Your Shop Name
   - Email: shop@example.com
   - Password: secure_password
   - Role: "Shopkeeper (Sell Jewelry)"
3. Click Register
4. Login with credentials
```

#### 2. Add Products
```
1. Click "📊 Dashboard" in navbar
2. Click "➕ Add Product" button
3. Fill product form:
   - Name: "Gold Ring"
   - Price: 5000
   - Category: "Rings"
   - Description: "Beautiful gold ring..."
   - Image URL: "https://example.com/ring.jpg"
4. Click "Add Product"
5. Product appears in your table
```

#### 3. Edit Products
```
1. Go to Dashboard
2. Find product in table
3. Click ✏️ Edit button
4. Update details
5. Click "Update Product"
```

#### 4. Delete Products
```
1. Go to Dashboard
2. Find product in table
3. Click 🗑️ Delete button
4. Confirm deletion
```

---

### **CUSTOMER WORKFLOW**

#### 1. Sign Up as Customer
```
1. Go to /register
2. Fill form with:
   - Name: Your Name
   - Email: customer@example.com
   - Password: secure_password
   - Role: "Customer (Buy Jewelry)" [default]
3. Click Register
4. Login with credentials
```

#### 2. Browse Products
```
1. Click "Products" in navbar
2. View all available jewelry
3. See prices and descriptions
4. Click "Add to Cart" on any product
```

#### 3. Manage Cart
```
1. Click "🛒 Cart" in navbar
2. View all items in cart
3. Adjust quantities:
   - Click ➕ to increase
   - Click ➖ to decrease
   - Or edit number directly
4. Remove items with "Remove" button
5. See updated totals
```

#### 4. Checkout
```
1. Review order summary
   - Subtotal
   - 18% GST tax
   - Free shipping
   - Total amount
2. Click "💳 Checkout"
3. Confirmation message
4. Cart cleared
5. Back to products page
```

#### 5. Continue Shopping
```
1. Click "Continue Shopping" button
2. Browse and add more items
3. Return to cart anytime
```

---

## 📊 API Endpoints

### **Authentication**
```
POST /api/users/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer" or "shopkeeper"
}
Response: { token, user: { _id, name, email, role } }

POST /api/users/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
Response: { token, user: { _id, name, email, role } }
```

### **Products (with Authorization)**
```
GET /api/products
Response: [{ _id, name, price, category, description, addedBy, addedByRole, ... }]

GET /api/products/:id
Response: { _id, name, price, category, description, ... }

POST /api/products (🔒 Shopkeeper/Admin only)
Header: Authorization: Bearer {token}
Body: {
  "name": "Gold Ring",
  "price": 5000,
  "category": "Rings",
  "description": "...",
  "imageUrl": "..."
}
Response: { message: "Product added successfully", product: {...} }

PUT /api/products/:id (🔒 Shopkeeper/Admin only)
Header: Authorization: Bearer {token}
Body: { fields to update }
Response: { message: "Product updated successfully", product: {...} }

DELETE /api/products/:id (🔒 Shopkeeper/Admin only)
Header: Authorization: Bearer {token}
Response: { message: "Product deleted successfully" }
```

---

## 🔒 Error Handling

### **401 Unauthorized - No Token**
```json
{ "message": "Not authorized, no token" }
```

### **401 Unauthorized - Invalid Token**
```json
{ "message": "Not authorized, token failed" }
```

### **403 Forbidden - Insufficient Role**
```json
{ "message": "Only shopkeepers and admins can perform this action" }
```

### **403 Forbidden - Cannot Edit Others' Products**
```json
{ "message": "You can only edit products you have added" }
```

---

## 🛠️ Technical Stack

### **Frontend**
- React 18
- React Router v6
- Context API for state management
- LocalStorage for cart persistence
- CSS3 with animations

### **Backend**
- Node.js / Express.js
- MongoDB / Mongoose
- JWT for authentication
- bcryptjs for password hashing

---

## 📁 File Structure

```
Frontend:
src/
├── context/
│   └── AuthContext.js          # Global auth state
├── pages/
│   ├── Register.js              # Registration with role selection
│   ├── Login.js                 # Login page
│   ├── Products.js              # Product listing
│   ├── ShopkeeperDashboard.js   # Product management
│   └── Cart.js                  # Shopping cart
├── components/
│   ├── Navbar.js                # Updated with role-based menu
│   └── ProductCard.js           # Updated with cart functionality
└── styles/
    ├── Dashboard.css            # Shopkeeper dashboard styles
    ├── Cart.css                 # Cart page styles
    └── Navbar.css               # Updated navbar styles

Backend:
├── models/
│   └── User.js                  # Updated with role field
├── middleware/
│   └── authMiddleware.js        # Auth + authorization
├── controllers/
│   └── productController.js     # Updated with role checks
└── routes/
    └── productRoutes.js         # Protected routes
```

---

## ✅ Testing Checklist

### **Shopkeeper Functions**
- [ ] Register as shopkeeper
- [ ] Login with shopkeeper account
- [ ] See "Dashboard" in navbar
- [ ] Access dashboard page
- [ ] Add new product
- [ ] Edit own product
- [ ] Delete own product
- [ ] See all your products in table
- [ ] Cannot access customer cart

### **Customer Functions**
- [ ] Register as customer
- [ ] Login with customer account
- [ ] Cannot see "Dashboard" in navbar
- [ ] Can see "Cart" in navbar
- [ ] Browse all products
- [ ] Add product to cart
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] View order summary
- [ ] Checkout successfully
- [ ] Cart clears after checkout

### **Access Control**
- [ ] Non-logged-in users cannot add to cart
- [ ] Non-logged-in users cannot access dashboard
- [ ] Shopkeeper cannot access customer cart
- [ ] Customer cannot access shopkeeper dashboard
- [ ] Shopkeeper can only edit own products
- [ ] API returns 403 for unauthorized requests

---

## 🎯 Features Summary

✅ **Authentication System**
- User registration with role selection
- Secure login with JWT tokens
- Password hashing with bcryptjs
- Token storage in localStorage

✅ **Shopkeeper Features**
- Product management dashboard
- Add, edit, delete products
- Product table view
- Form validation
- Success/error notifications

✅ **Customer Features**
- Browse all products
- Add to cart
- Manage cart quantities
- Remove from cart
- Order summary with calculations
- Checkout functionality

✅ **UI/UX**
- Role-based navigation
- Responsive design
- Smooth animations
- Modern styling with gold accents
- Dark mode theme
- User dropdown menu

✅ **Security**
- JWT authentication
- Role-based authorization
- Protected routes (frontend)
- Protected endpoints (backend)
- Secure password storage
- Authorization checks on all write operations

---

## 🚨 Important Notes

1. **Cart Storage**: Cart is stored in localStorage. Each user has their own cart.
2. **Product Ownership**: Shopkeepers can only edit/delete products they created.
3. **Role Assignment**: Default role is 'customer'. Select 'shopkeeper' during registration.
4. **Token Management**: Token is stored in localStorage and sent with API requests.
5. **Tax Calculation**: 18% GST is automatically added at checkout.
6. **Shipping**: Free shipping for all orders.

---

## 📞 Support & Troubleshooting

**Issue**: Cart not showing items
- **Solution**: Check browser console for localStorage errors. Clear cache and retry.

**Issue**: Cannot add products as shopkeeper
- **Solution**: Verify token is valid. Check Authorization header in API request.

**Issue**: Dashboard not accessible
- **Solution**: Verify you're logged in as shopkeeper role. Check user role in localStorage.

**Issue**: Products showing 403 error when deleting
- **Solution**: Only shopkeeper who created the product can delete it. Admins can delete any.

---

Generated: November 15, 2025
Last Updated: With Role-Based Access Control Implementation
