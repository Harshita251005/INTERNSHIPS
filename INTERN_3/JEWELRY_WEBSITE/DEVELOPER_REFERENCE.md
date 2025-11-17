# 🚀 Developer Quick Reference Card

## Essential Commands & Info

### Setup & Running
```bash
cd jewelry-frontend
npm install
npm start              # Runs at http://localhost:3000
npm run build         # Production build
npm test              # Run tests
```

---

## 🎨 Color Quick Reference

```css
Primary Gold:       #d4af37
Dark Navy:          #1a1a2e
Dark Gray:          #2d2d44
White:              #ffffff
Light Gray:         #ecf0f1
Dark Text:          #2c3e50
Light Text:         #7f8c8d
```

---

## 📏 Spacing Values

```css
0.5rem  (8px)    - Tight
1rem    (16px)   - Normal
1.5rem  (24px)   - Medium
2rem    (32px)   - Large
2.5rem  (40px)   - Extra Large
3rem    (48px)   - Huge
4rem    (64px)   - Massive
```

---

## 🎬 Common Classes

### Buttons
```html
<button class="btn btn-primary">Click</button>
<button class="btn btn-secondary">Click</button>
<button class="btn btn-dark">Click</button>
```

### Cards
```html
<div class="card">
  <img class="card-img-top" src="...">
  <div class="card-body">
    <h5 class="card-title">Title</h5>
    <p class="card-text">Description</p>
  </div>
</div>
```

### Forms
```html
<div class="form-group">
  <label>Email</label>
  <input class="form-control" type="email">
</div>
```

### Spacing
```html
<div class="mt-4">Margin Top</div>
<div class="mb-3">Margin Bottom</div>
<div class="p-3">Padding</div>
```

---

## 📁 File Structure

```
src/
├── components/
│   ├── Navbar.js
│   └── ProductCard.js
├── pages/
│   ├── Home.js
│   ├── Products.js
│   ├── Categories.js
│   ├── Login.js
│   └── Register.js
├── styles/
│   ├── Navbar.css
│   ├── ProductCard.css
│   ├── Home.css
│   ├── Products.css
│   ├── Categories.css
│   └── Auth.css
├── utils/
│   └── api.js
├── App.js
├── App.css
└── index.css
```

---

## 🔧 Common Modifications

### Change Brand Color
```css
/* Find all instances of #d4af37 */
/* Replace with your color */
```

### Add New Button Style
```css
.btn-custom {
  background: linear-gradient(135deg, #d4af37, #c19b24);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-custom:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);
}
```

### Add New Animation
```css
@keyframes custom {
  0% { /* start state */ }
  50% { /* middle state */ }
  100% { /* end state */ }
}

.element {
  animation: custom 1s ease infinite;
}
```

---

## 🎯 API Endpoints Expected

```javascript
// Products
GET /products              // Fetch all products
POST /products/add        // Add product (admin)

// Categories
GET /categories           // Fetch all categories
POST /categories/add      // Add category (admin)

// Users
POST /users/register      // Register user
POST /users/login         // Login user
GET /users/profile        // Get user profile

// Example Product Response:
{
  _id: "123",
  name: "Gold Ring",
  imageUrl: "https://...",
  price: 5000,
  description: "Beautiful gold ring"
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
.container { width: 100%; }

/* Tablet (576px+) */
@media (min-width: 576px) { }

/* Tablet (768px+) */
@media (min-width: 768px) { 
  .col-md-4 { width: 33.333%; }
}

/* Desktop (992px+) */
@media (min-width: 992px) {
  .col-lg-4 { width: 33.333%; }
}

/* Large Desktop (1200px+) */
@media (min-width: 1200px) {
  .container { max-width: 1200px; }
}
```

---

## 🎨 CSS Variables (If Using Custom Properties)

```css
:root {
  --primary-gold: #d4af37;
  --dark-bg: #1a1a2e;
  --card-bg: #ffffff;
  --text-dark: #2c3e50;
  --text-light: #7f8c8d;
  --border-color: #ecf0f1;
  --transition: all 0.3s ease;
}

/* Usage */
.element {
  color: var(--text-dark);
  background: var(--card-bg);
  transition: var(--transition);
}
```

---

## 🔗 External Resources

### Google Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

### Bootstrap
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
```

---

## 💻 JavaScript Snippets

### Set Local Storage
```javascript
// Save token after login
localStorage.setItem("token", response.data.token);

// Get token when needed
const token = localStorage.getItem("token");

// Remove token on logout
localStorage.removeItem("token");
```

### API Calls
```javascript
// GET request
api.get("/products")
  .then(res => setProducts(res.data))
  .catch(err => console.error(err));

// POST request
api.post("/users/login", { email, password })
  .then(res => console.log("Success"))
  .catch(err => console.error("Error"));
```

### Component Import
```javascript
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
```

---

## 🎭 Common CSS Patterns

### Gradient
```css
background: linear-gradient(135deg, #d4af37, #c19b24);
```

### Text Gradient
```css
background: linear-gradient(135deg, #d4af37, #f0e68c);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

### Box Shadow
```css
/* Subtle */
box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);

/* Medium */
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

/* Deep with Gold */
box-shadow: 0 20px 40px rgba(212, 175, 55, 0.25);
```

### Border Radius
```css
border-radius: 5px;    /* Small buttons */
border-radius: 8px;    /* Inputs */
border-radius: 12px;   /* Cards */
border-radius: 15px;   /* Large containers */
border-radius: 50px;   /* Pill buttons */
```

### Flexbox
```css
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
gap: 1rem;
```

### Grid
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 2rem;
```

---

## 🐛 Debugging Tips

### Check Styles
```javascript
// In browser console
const element = document.querySelector('.class-name');
console.log(window.getComputedStyle(element));
```

### Common Issues
```
Form not validating?
  → Check form onSubmit handler
  → Verify input names match

Styles not applying?
  → Check CSS file is imported
  → Clear browser cache
  → Check specificity

Images not showing?
  → Verify imageUrl in data
  → Check CORS settings
  → Use placeholder fallback

Mobile menu not working?
  → Check Bootstrap JS is loaded
  → Verify hamburger button class
  → Check z-index conflicts
```

---

## 📚 Documentation Files

Quick Links:
- `README.md` - Main overview
- `QUICK_START.md` - Get started fast
- `UI_UX_IMPROVEMENTS.md` - Detailed features
- `DESIGN_REFERENCE.md` - Design system
- `BEFORE_AFTER.md` - Visual comparison
- `IMPLEMENTATION_CHECKLIST.md` - What was done

---

## 🎯 Performance Tips

### Optimize Images
```html
<img src="..." alt="description" loading="lazy">
```

### Minimize CSS
```bash
npm install cssnano --save-dev
```

### Bundle Analysis
```bash
npm install --save-dev webpack-bundle-analyzer
```

### Production Build
```bash
npm run build
# Creates optimized build in /build folder
```

---

## 🔐 Security Reminders

```javascript
// Always use HTTPS for API calls
// Store tokens securely
// Validate all inputs
// Sanitize user data
// Use environment variables for secrets
// Don't commit sensitive data
```

---

## 📊 Testing Checklist

- [ ] All pages load correctly
- [ ] Forms validate properly
- [ ] Navigation works smoothly
- [ ] Mobile view is responsive
- [ ] Animations are smooth
- [ ] Images load correctly
- [ ] No console errors
- [ ] No broken links
- [ ] Loading states work
- [ ] Error handling works

---

## 🚀 Deployment Checklist

- [ ] Run `npm run build`
- [ ] Test production build locally
- [ ] Update API endpoints for production
- [ ] Set environment variables
- [ ] Optimize images
- [ ] Enable GZIP compression
- [ ] Set up CDN (optional)
- [ ] Configure domain
- [ ] Test thoroughly
- [ ] Monitor performance

---

## 📞 Support Resources

### Need Help?
1. Check documentation files
2. Review code comments
3. Check browser console for errors
4. Verify API endpoints
5. Test in different browsers

### Common Solutions
- Clear cache: Ctrl+Shift+Delete
- Hard refresh: Ctrl+Shift+R
- Check network: F12 → Network tab
- View styles: F12 → Elements tab

---

## 🎓 Learning Resources

- React Docs: https://react.dev
- CSS Tricks: https://css-tricks.com
- Bootstrap: https://getbootstrap.com
- Google Fonts: https://fonts.google.com
- MDN Web Docs: https://developer.mozilla.org

---

## 💡 Quick Tips

1. **Mobile First**: Design mobile, then add desktop
2. **Consistent Naming**: Use clear class names
3. **DRY Principle**: Don't repeat code
4. **Test Often**: Test after each change
5. **Comment Code**: Help future developers
6. **Use Git**: Commit frequently
7. **Read Docs**: Check docs when stuck
8. **Ask for Help**: Use community resources

---

## ✅ Before Committing Code

```bash
# Check for errors
npm run build

# Test all features
npm test

# View in production mode
npm run build
serve -s build

# Clean up console logs
# Remove unused imports
# Format code consistently
# Update documentation
```

---

**Keep this card handy for quick reference! 🚀**

*Last Updated: November 15, 2025*
*Version: 1.0*
