# Stock Management Feature

## Overview
Stock management has been implemented to track inventory levels for jewelry products. This system allows shopkeepers to manage stock quantities and prevents customers from purchasing more items than available.

## Changes Made

### 1. Product Model Update (`Product.js`)
Added a new `stock` field to track available inventory:

```javascript
stock: { 
  type: Number, 
  required: true, 
  default: 0,
  min: 0
}
```

**Features:**
- Required field (must be specified when creating/updating products)
- Cannot be negative (validation built-in)
- Default value: 0
- Tracks exact quantity available

### 2. Backend Updates

#### Product Controller (`productController.js`)

**Create Product:**
- Now requires `stock` field when adding a new product
- Validates that stock is not negative
- Returns error if stock is missing or invalid

**Update Product:**
- Validates stock updates to prevent negative values
- Allows shopkeepers to adjust inventory levels

**New updateStock Endpoint:**
- `PATCH /api/products/:id/stock`
- Reduces stock after a purchase
- Checks if sufficient stock is available before updating
- Returns remaining stock after the transaction
- Request body format:
  ```json
  {
    "quantity": 1
  }
  ```
- Response:
  ```json
  {
    "message": "Stock updated successfully. Remaining stock: 9",
    "product": { /* product details */ }
  }
  ```

#### Routes (`productRoutes.js`)
Added new route for stock updates:
```javascript
router.patch('/:id/stock', protect, updateStock);
```

**Route Details:**
- Requires authentication (JWT token)
- Does NOT require shopkeeper/admin role (allows customers to purchase)
- Automatically validates stock availability

### 3. Frontend Updates

#### Shopkeeper Dashboard (`ShopkeeperDashboard.js`)

**Features:**
- Stock field added to product form (required)
- Stock quantity displayed in products table
- Stock status indicator:
  - **In Stock**: Green badge (stock > 5)
  - **Low Stock**: Yellow badge with pulse animation (0 < stock < 5)
  - **Out of Stock**: Red badge (stock = 0)

**Form Fields:**
```javascript
{
  name: "Product Name",
  price: 5000,
  stock: 10,  // NEW
  category: "Rings",
  description: "...",
  imageUrl: "..."
}
```

**Validation:**
- Stock must be a non-negative number
- Stock field is required
- Error message shows if validation fails

#### Product Card Component (`ProductCard.js`)

**Visual Indicators:**
- Stock badge displayed on product card image
- Badge colors:
  - Green: "In Stock"
  - Yellow with animation: "Only X left!"
  - Red: "Out of Stock"

**Purchase Logic:**
- "Add to Cart" button disabled if stock = 0
- Shows "Out of Stock" message on hover for unavailable items
- Prevents adding more items to cart than available stock
- Alerts user if trying to exceed available inventory

**Stock Validation:**
- Checks stock before adding to cart
- Prevents purchase of out-of-stock items
- Displays quantity alert if limit exceeded

#### Styles

**ProductCard.css:**
- Added `.stock-badge` class with color variants
- Added pulse animation for low stock warning
- Added `.out-of-stock-message` for unavailable items

**Dashboard.css:**
- Added `.stock-qty` for displaying stock quantity
- Added `.stock-status` class with variants
- Added visual indicators for inventory levels

## API Endpoints

### Create Product
```bash
POST /api/products
Headers: Authorization: Bearer {token}
Body: {
  "name": "Gold Ring",
  "price": 5000,
  "stock": 15,
  "category": "Rings",
  "description": "...",
  "imageUrl": "..."
}
```

### Update Product
```bash
PUT /api/products/:id
Headers: Authorization: Bearer {token}
Body: {
  "price": 5500,
  "stock": 12,
  "description": "Updated description"
}
```

### Update Stock (Purchase)
```bash
PATCH /api/products/:id/stock
Headers: Authorization: Bearer {token}
Body: {
  "quantity": 1
}
```

**Error Response (Insufficient Stock):**
```json
{
  "message": "Insufficient stock. Available: 5, Requested: 10"
}
```

### Get All Products
```bash
GET /api/products
```
Response includes stock field for each product.

## Stock Status Indicators

### In Stock
- Stock > 5 items
- Color: Green (#28a745)
- Badge: "In Stock"
- Button: "Add to Cart" enabled

### Low Stock
- Stock > 0 and Stock ≤ 5
- Color: Yellow (#ffc107)
- Badge: "Only X left!"
- Animation: Pulse effect to draw attention
- Button: "Add to Cart" enabled with warning

### Out of Stock
- Stock = 0
- Color: Red (#dc3545)
- Badge: "Out of Stock"
- Button: "Add to Cart" disabled
- Overlay message: "Out of Stock"

## Usage Examples

### Shopkeeper Adding Product with Stock
```javascript
const productData = {
  name: "Diamond Necklace",
  price: 25000,
  stock: 5,          // NEW
  category: "Necklaces",
  description: "Elegant diamond necklace",
  imageUrl: "..."
};

// Send to POST /api/products
```

### Updating Stock After Purchase
```bash
# Customer purchases 1 item
curl -X PATCH http://localhost:5000/api/products/6456a1b2c3d4e5f6g7h8i9j/stock \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 1}'
```

### Frontend: Checking Stock Before Adding to Cart
```javascript
if (!product.stock || product.stock === 0) {
  alert("This item is out of stock");
  return;
}

if (existingItem.quantity >= product.stock) {
  alert(`Only ${product.stock} items available in stock`);
  return;
}
```

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| stock | Required | "Stock quantity is required" |
| stock | Non-negative | "Stock cannot be negative" |
| quantity | Must be > 0 | "Quantity must be greater than 0" |
| quantity | ≤ available stock | "Insufficient stock. Available: X, Requested: Y" |

## Database Schema

```javascript
stock: {
  type: Number,
  required: true,
  default: 0,
  min: 0
}
```

## Frontend State Management

### Shopkeeper Dashboard
```javascript
const [formData, setFormData] = useState({
  name: "",
  price: "",
  stock: "",       // NEW
  category: "",
  description: "",
  imageUrl: ""
});
```

### Product Card
```javascript
// Display stock status
const getStockBadge = () => {
  if (!product.stock || product.stock === 0) {
    return <span className="stock-badge out-of-stock">Out of Stock</span>;
  }
  if (product.stock < 5) {
    return <span className="stock-badge low-stock">Only {product.stock} left!</span>;
  }
  return <span className="stock-badge in-stock">In Stock</span>;
};
```

## Future Enhancements

1. **Stock History**: Track stock changes over time
2. **Low Stock Alerts**: Notify shopkeepers when stock is low
3. **Automatic Reorder**: Set minimum stock level and auto-order
4. **Stock Reports**: Generate inventory reports for analysis
5. **Bulk Stock Update**: Update multiple products' stock at once
6. **Stock Reservations**: Reserve stock during checkout process
7. **Expiry Tracking**: Track expiry dates for perishable items (if applicable)
8. **Stock Forecasting**: Predict stock needs based on sales patterns

## Testing Stock Management

### Test Case 1: Adding Product with Stock
1. Login as shopkeeper
2. Add product with stock = 10
3. Verify stock shows in table
4. Verify badge shows "In Stock"

### Test Case 2: Low Stock Warning
1. Update product stock to 3
2. Check product card
3. Verify badge shows "Only 3 left!" with animation

### Test Case 3: Out of Stock
1. Update product stock to 0
2. Check product card
3. Verify "Out of Stock" badge
4. Verify "Add to Cart" button is hidden
5. Verify overlay shows "Out of Stock"

### Test Case 4: Purchase Stock Update
1. As customer, add product to cart
2. Verify quantity doesn't exceed available stock
3. System prevents exceeding stock limit
4. Shows appropriate alert message

## Troubleshooting

### Issue: Stock field not showing in form
- Ensure ShopkeeperDashboard.js is updated
- Clear browser cache
- Refresh page

### Issue: Stock badge not displaying
- Check ProductCard.css is linked
- Verify CSS classes are applied
- Check browser console for errors

### Issue: Purchase exceeds stock
- Verify updateStock endpoint is called
- Check stock validation logic
- Review error messages in console

## Summary

✅ Stock field added to Product model
✅ Stock validation in create/update operations
✅ Stock update endpoint for purchases
✅ Stock status indicators (In Stock, Low Stock, Out of Stock)
✅ Frontend prevents over-purchasing
✅ Shopkeeper can manage inventory levels
✅ Visual feedback for inventory status
⏳ Stock history tracking (future enhancement)
