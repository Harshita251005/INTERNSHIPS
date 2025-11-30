# Jewelry E-Commerce Platform with RBAC

A complete full-stack jewelry e-commerce website with Role-Based Access Control (RBAC) built with the MERN stack (MongoDB, Express, React, Node.js) and TailwindCSS.

## 🎯 Features

### Three User Roles with Distinct Permissions

#### 👑 **Admin** (Full Access)
- View platform-wide analytics (total users, products, orders, revenue)
- Approve/reject shopkeeper accounts
- Suspend/activate shopkeepers
- View and manage all products across platform
- View and manage all orders
- Manage categories and subcategories
- Delete users (except admins)

#### 🏪 **Shopkeeper** (Restricted Access)
- Add/edit/delete only their own products
- Manage stock levels for their products
- View only orders containing their products
- Update order status (pending → packed → shipped → delivered)
- View personal analytics (sales, revenue, stock levels)
- Cannot access other shopkeepers' data
- Cannot modify customers or admins

#### 🛍️ **Customer** (Basic Access)
- Browse jewelry products by category
- View product details
- Add items to cart and wishlist
- Place orders with shipping details
- Track order status
- View order history
- Edit profile information
- Cannot access admin or shopkeeper sections

## 🔐 Security Features

- **JWT Authentication** with access and refresh tokens
- **Password Hashing** using bcrypt
- **Role-Based Middleware** protecting routes
- **Token Auto-Refresh** for seamless UX
- **Shopkeeper Auto-Approval** for immediate access
- **Protected Routes** with redirect to login
- **Login Redirect** returns users to intended page

## 🛠 Tech Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT for authentication
- bcrypt for password hashing
- Express Validator for input validation

### Frontend
- React 18 with Vite
- React Router v6 for navigation
- TailwindCSS for styling
- Axios for API calls
- React Toastify for notifications
- JWT Decode for token management

## 📁 Project Structure

```
jewelry-ecommerce/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── controllers/      # Business logic
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & role middleware
│   ├── seed.js           # Database seeding
│   └── server.js         # Entry point
│
└── frontend/
    ├── src/
    │   ├── pages/        # Page components
    │   │   ├── admin/    # Admin dashboard
    │   │   ├── shopkeeper/   # Shopkeeper dashboard
    │   │   └── customer/     # Customer dashboard
    │   ├── components/   # Reusable components
    │   ├── context/      # Auth context
    │   ├── utils/        # API utilities
    │   └── App.jsx       # Main app component
    └── index.html
```

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Products (Public & Protected)
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get product details (public)
- `POST /api/products` - Create product (shopkeeper/admin)
- `PUT /api/products/:id` - Update product (shopkeeper own/admin all)
- `DELETE /api/products/:id` - Delete product (shopkeeper own/admin all)
- `GET /api/products/shopkeeper/mine` - Get shopkeeper's products (shopkeeper)

### Orders
- `POST /api/orders` - Create order (customer)
- `GET /api/orders` - Get orders (role-based filtering)
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (shopkeeper/admin)

### Admin
- `GET /api/admin/analytics` - Platform analytics
- `GET /api/admin/shopkeepers` - All shopkeepers
- `PUT /api/admin/shopkeepers/:id/approve` - Approve shopkeeper
- `PUT /api/admin/shopkeepers/:id/suspend` - Suspend/activate shopkeeper
- `DELETE /api/admin/users/:id` - Delete user

### Shopkeeper
- `GET /api/shopkeeper/analytics` - Shopkeeper analytics

### Categories
- `GET /api/categories` - Get all categories (public)
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

## 🎨 UI/UX Highlights

- **Responsive Design** - Works on mobile, tablet, and desktop
- **Gradient Backgrounds** - Purple/pink jewelry theme
- **Glassmorphism Effects** - Modern card designs
- **Smooth Animations** - Fade-in, slide-up, hover effects
- **Status Badges** - Color-coded order status indicators
- **Loading States** - Shimmer effects during data fetching
- **Toast Notifications** - Real-time user feedback

## 🔒 RBAC Implementation

*(Details omitted for brevity – see source code for middleware logic)*

## 📊 Database Models

### User
- name, email, password (hashed)
- role (admin/shopkeeper/customer)
- shopkeeperApproved, suspended flags
- JWT methods for token generation

### Product
- title, description, price, stock
- images[], category, shopkeeperId
- weight, material, purity (jewelry-specific)
- averageRating, reviewCount

### Order
- customerId, products[] with quantities
- totalAmount, status
- shippingAddress, paymentMethod
- Multi-shopkeeper support

### Category
- name, description
- subcategories[]

### Review
- productId, customerId
- rating (1-5), comment

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jewelry-ecommerce
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
NODE_ENV=development
```

## 🎯 Key Features Implemented

✅ Complete RBAC system with 3 distinct roles  
✅ JWT authentication with auto-refresh  
✅ **Shopkeeper auto-approval system**  
✅ Product CRUD with ownership validation  
✅ Order management with status tracking  
✅ **Complete admin analytics dashboard**  
✅ Shopkeeper analytics dashboard  
✅ **Category-specific product pages**  
✅ **All Categories browsing page**  
✅ Responsive UI with TailwindCSS  
✅ Protected routes with login redirect  
✅ Role-based API middleware  
✅ Beautiful landing page with animations  
✅ Stock management  
✅ Category management with icons  
✅ **Flexible product material types**  
✅ Customer management for admins  
✅ **Login redirect to intended page**  

- Payment gateway integration (Stripe)
- Review and rating system
- Real-time order tracking

## 👨‍💻 Author

Built with ❤️ using MERN stack + TailwindCSS

**Happy Coding! 💎✨**
