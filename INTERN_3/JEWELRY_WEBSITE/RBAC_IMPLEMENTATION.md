# Role-Based Access Control (RBAC) Implementation

## Overview
Role-based access control has been implemented to restrict jewelry product management to shopkeepers and admins only. This ensures that:
- **Customers** can only view products
- **Shopkeepers** can add, edit, and delete their own products
- **Admins** have full access to all products

## Changes Made

### 1. User Model Update (`User.js`)
- Added `role` field with enum values: `['customer', 'shopkeeper', 'admin']`
- Default role: `'customer'`
- Added `createdAt` timestamp field
- Kept `isAdmin` boolean for backward compatibility

```javascript
role: { 
  type: String, 
  enum: ['customer', 'shopkeeper', 'admin'], 
  default: 'customer' 
}
```

### 2. Authorization Middleware (`authMiddleware.js`)
Created two new authorization functions:

#### `authorize(...roles)`
- Generic role-based authorization middleware
- Accepts variable number of role parameters
- Returns 403 Forbidden if user doesn't have required role

```javascript
// Usage: protect, authorize('shopkeeper', 'admin'), createProduct
```

#### `isShopkeeperOrAdmin`
- Convenience middleware that checks for shopkeeper or admin role
- Returns 403 if user is not shopkeeper/admin

```javascript
// Usage: protect, isShopkeeperOrAdmin, createProduct
```

### 3. Product Routes Protection (`productRoutes.js`)
Protected all write operations with authentication and authorization:

```javascript
// Public endpoints
GET  /api/products          - Get all products (public)
GET  /api/products/:id      - Get product by ID (public)

// Protected endpoints (Shopkeeper/Admin only)
POST /api/products          - Create product (require shopkeeper/admin)
PUT  /api/products/:id      - Update product (require shopkeeper/admin)
DELETE /api/products/:id    - Delete product (require shopkeeper/admin)
```

### 4. Product Controller Updates (`productController.js`)

#### Create Product
- Requires valid JWT token
- Requires shopkeeper or admin role
- Automatically tracks who added the product (`addedBy`, `addedByRole`)

#### Update Product
- Requires valid JWT token
- Requires shopkeeper or admin role
- Shopkeepers can only edit products they created
- Admins can edit any product

#### Delete Product
- Requires valid JWT token
- Requires shopkeeper or admin role
- Shopkeepers can only delete products they created
- Admins can delete any product

### 5. User Controller Updates (`userController.js`)

#### Registration
- Now accepts optional `role` parameter in request body
- Defaults to `'customer'` if not provided
- Validates role against allowed values
- Stores role in user document

#### Login
- Returns `role` in user object along with existing fields
- Enables frontend to determine user capabilities

```javascript
// Register Request
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "shopkeeper"  // Optional, defaults to "customer"
}

// Login Request
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

// Response includes role
{
  "token": "eyJhbGciOi...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "shopkeeper"
  }
}
```

## API Usage Examples

### As a Customer (View Only)
```bash
# Get all products ✓
curl GET http://localhost:5000/api/products

# Try to add product ✗ (403 Forbidden)
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Ring", "price": 500}'
```

### As a Shopkeeper (Add/Manage Own Products)
```bash
# Register as shopkeeper
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shop Owner",
    "email": "shop@example.com",
    "password": "pass123",
    "role": "shopkeeper"
  }'

# Add product ✓
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Gold Ring", "price": 5000}'

# Edit own product ✓
curl -X PUT http://localhost:5000/api/products/{productId} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"price": 5500}'

# Cannot edit another shopkeeper's product ✗ (403 Forbidden)
```

### As an Admin (Full Access)
```bash
# Register as admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'

# Can add, edit, and delete any product ✓
```

## Error Responses

### 401 Unauthorized (No Token)
```json
{
  "message": "Not authorized, no token"
}
```

### 401 Unauthorized (Invalid Token)
```json
{
  "message": "Not authorized, token failed"
}
```

### 403 Forbidden (Insufficient Role)
```json
{
  "message": "Only shopkeepers and admins can perform this action"
}
```

### 403 Forbidden (Cannot Edit Others' Products)
```json
{
  "message": "You can only edit products you have added"
}
```

## Frontend Integration Needed

### 1. Store User Role in Frontend State
```javascript
// After login/register, store user role
const { user, token } = response.data;
localStorage.setItem('userRole', user.role);
```

### 2. Conditional UI Rendering
```javascript
// Show "Add Product" button only to shopkeepers/admins
{(userRole === 'shopkeeper' || userRole === 'admin') && (
  <button onClick={handleAddProduct}>Add New Jewelry</button>
)}
```

### 3. Handle 403 Errors in API Calls
```javascript
catch (error) {
  if (error.response.status === 403) {
    alert('You do not have permission to perform this action');
  }
}
```

## Summary
✅ Role-based access control implemented
✅ Product creation restricted to shopkeepers/admins
✅ Shopkeepers can only manage their own products
✅ Admins have full access
✅ Authentication required for all write operations
✅ Error handling for authorization failures
⏳ Frontend UI adjustments pending (conditional rendering for roles)
