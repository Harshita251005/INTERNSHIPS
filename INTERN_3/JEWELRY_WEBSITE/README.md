💎 Jewelry E-Commerce Platform (MERN • Multi-Vendor • RBAC)

A fully featured multi-vendor jewelry e-commerce platform built using the MERN stack, designed with real-world functionality such as role-based access control (RBAC), secure payments (Stripe & UPI), product management, reviews, cart system, and order tracking.

This platform supports three distinct roles—Admin, Shopkeeper, and Customer—each with their own controlled permissions and dashboards.

✨ Key Features

🔐 Role-Based Access Control (RBAC)
Each user role has dedicated permissions and interfaces:

👑 Admin

Manage all users (approve/ban shopkeepers)
Manage all products across the platform
View platform-wide analytics / settings

🛍️ Shopkeeper

Manage own products (CRUD operations)
Upload multiple product images using Multer
View customer orders and update statuses
Generate & use UPI QR code for payments

🧑‍💼 Customer

Browse products with search & filter features
Add to cart, wishlist, and checkout securely
Track orders in real-time
Add verified purchase reviews & ratings

💳 Secure Payments

Stripe Integration
Credit/Debit card payments
Payment Intent API
UPI Payments
Dynamic UPI QR code for each shopkeeper
Supports manual payment verification flow

📦 Product & Order System

Full product CRUD
Categories, search, filters
Image uploads using Multer
Order creation, tracking, and notifications
Individual shopkeeper inventory management

⭐ Additional Features

JWT-based secure authentication (access + refresh tokens)
Persistent cart & user sessions
Admin dashboard for platform moderation
Reviews & ratings from verified customers
Responsive UI using Tailwind CSS

🛠️ Tech Stack

Frontend

React.js (Vite)
Tailwind CSS
Redux / Context API
Axios

Backend

Node.js + Express.js
MongoDB + Mongoose
Multer (file uploads)
Stripe API
JWT Authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Stripe Account (for payment testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JEWELRY_WEBSITE
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   PLATFORM_UPI_QR=url_to_platform_qr_code_image
   PLATFORM_UPI_ID=platform_upi_id@bank
   NODE_ENV=development
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend**
   ```bash
   cd backend
   npm start
   # OR for development with nodemon
   npm run dev
   ```

2. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## 📂 Project Structure

```
JEWELRY_WEBSITE/
├── backend/                 # Express server & API routes
│   ├── controllers/         # Request handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth & error handling
│   └── uploads/            # Static file uploads
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   └── context/        # Global state
│   └── public/             # Static assets
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

