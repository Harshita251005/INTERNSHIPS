# 🎨 Visual Design Reference Guide

## Design System Overview

This guide provides a complete visual reference for the redesigned Jewelry Website.

---

## 🎭 Color Palette

### Primary Colors
```
Gold (Primary Accent)
Color: #d4af37
Usage: Buttons, links, highlights, accents
RGB: rgb(212, 175, 55)
HSL: hsl(45, 78%, 52%)
   └─ Lighter: #e5c158
   └─ Darker: #c19b24

Dark Navy (Background)
Color: #1a1a2e
Usage: Main background, dark containers
RGB: rgb(26, 26, 46)
HSL: hsl(240, 28%, 14%)

Dark Gray (Secondary Background)
Color: #2d2d44
Usage: Header, dark sections
RGB: rgb(45, 45, 68)
HSL: hsl(240, 20%, 22%)

White (Light Background)
Color: #ffffff
Usage: Cards, main content
RGB: rgb(255, 255, 255)
HSL: hsl(0, 0%, 100%)

Light Gray (Borders)
Color: #ecf0f1
Usage: Borders, subtle dividers
RGB: rgb(236, 240, 241)
HSL: hsl(204, 10%, 93%)
```

### Text Colors
```
Dark Text
Color: #2c3e50
Usage: Primary text, headings
RGB: rgb(44, 62, 80)

Light Text
Color: #7f8c8d
Usage: Secondary text, descriptions
RGB: rgb(127, 140, 141)

Very Light Text
Color: #d0d0d0
Usage: Text on dark backgrounds
RGB: rgb(208, 208, 208)
```

---

## 🔤 Typography System

### Font Family
```
Primary: Poppins (Google Fonts)
Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif
```

### Font Weights
```
Light       → 300  (Subtle text)
Regular     → 400  (Body text)
Medium      → 500  (Emphasis)
Semibold    → 600  (Subheadings)
Bold        → 700  (Headings)
Extra Bold  → 800  (Major headings)
Black       → 900  (Hero text)
```

### Font Sizes
```
Hero Title          → 4rem (64px)
Page Title          → 3rem (48px)
Section Title       → 2.5rem (40px)
Heading 1 (h1)      → 2rem (32px)
Heading 2 (h2)      → 1.5rem (24px)
Heading 3 (h3)      → 1.3rem (20px)
Heading 4 (h4)      → 1.2rem (19px)
Heading 5 (h5)      → 1rem (16px)
Body Text           → 1rem (16px)
Small Text          → 0.95rem (15px)
Smaller Text        → 0.9rem (14px)
Tiny Text           → 0.85rem (13px)
```

### Line Heights
```
Headings    → 1.3
Body Text   → 1.6
Tight       → 1.2
```

### Letter Spacing
```
Headings    → 0.5px
Subtitles   → 1px
Buttons     → 1px
Branding    → 2px
```

---

## 🎬 Animation Reference

### Duration & Timing
```
Fast        → 0.2s (instant feedback)
Normal      → 0.3s (default interactions)
Slow        → 0.5s (page transitions)
Very Slow   → 0.6s (hero animations)
```

### Easing Functions
```
ease-in-out         → smooth transitions
cubic-bezier(0.175, 0.885, 0.32, 1.275)  → bouncy effect
linear              → consistent rotation
```

### Common Animations
```
Hover Lift
  Transform: translateY(-8px) to translateY(-12px)
  Duration: 0.3s ease

Scale Effect
  Transform: scale(1) to scale(1.05) or scale(1.1)
  Duration: 0.3s ease

Color Transition
  Duration: 0.3s ease
  Properties: color, background-color, border-color

Shadow Depth
  Box-shadow: 0 5px 15px → 0 20px 40px
  Duration: 0.3s ease

Spin Animation
  Transform: rotate(0deg) → rotate(360deg)
  Duration: 1s linear infinite

Float Effect
  TranslateY: 0px → 20px → 0px
  Duration: 6s ease-in-out infinite
```

---

## 🎨 Component Color Reference

### Buttons

**Primary Button (Gold)**
```css
Background: linear-gradient(135deg, #d4af37, #c19b24)
Color: white
Border: none
Hover Background: linear-gradient(135deg, #c19b24, #d4af37)
Hover Shadow: 0 10px 20px rgba(212, 175, 55, 0.3)
```

**Secondary Button (Outline Gold)**
```css
Background: transparent
Color: #d4af37
Border: 2px solid #d4af37
Hover Background: #d4af37
Hover Color: #1a1a2e
```

**Dark Button**
```css
Background: #1a1a2e
Color: #d4af37
Border: 2px solid #d4af37
Hover Background: #d4af37
Hover Color: #1a1a2e
```

### Cards

**Standard Card**
```css
Background: white
Border-radius: 12px
Box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08)
Hover Shadow: 0 20px 40px rgba(212, 175, 55, 0.25)
Transform on Hover: translateY(-12px)
```

**Feature Card**
```css
Background: white
Padding: 2rem
Border-radius: 12px
Border-top: 4px solid transparent
Hover Border-top: #d4af37
```

**Category Card**
```css
Background: white
Padding: 2.5rem 1.5rem
Border-radius: 15px
Border-top: 4px solid transparent
Hover Transform: translateY(-12px)
```

### Form Elements

**Input Field**
```css
Border: 2px solid #ecf0f1
Border-radius: 8px
Padding: 12px 15px
Background: #fafafa
Focus Border: #d4af37
Focus Background: white
Focus Shadow: 0 0 0 0.2rem rgba(212, 175, 55, 0.25)
```

### Navigation

**Nav Link**
```css
Color: white
Position: relative
Hover Color: #d4af37
Hover Underline: width 0 → 100%
Underline: height 2px, #d4af37
```

---

## 📐 Spacing System

### Padding Values
```
2px    → Minimal
5px    → Tiny
8px    → Extra small
12px   → Small (form inputs)
15px   → Medium-small (form inputs)
1rem   → 16px Regular
1.5rem → 24px Medium
2rem   → 32px Large
2.5rem → 40px Extra large
3rem   → 48px Hero
4rem   → 64px Massive
```

### Margin Values
Same as padding, used for spacing between elements.

### Gap (Flexbox)
```
0.5rem  → Tight spacing
1rem    → Regular spacing
1.5rem  → Medium spacing
2rem    → Large spacing
2.5rem  → Extra large spacing
```

---

## 🎭 Gradient Collections

### Hero Section Gradient
```css
linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)
```

### Gold Gradient
```css
linear-gradient(135deg, #d4af37, #c19b24)
```

### Text Gradient
```css
linear-gradient(135deg, #d4af37, #f0e68c)
/* With -webkit-background-clip: text */
```

### Radial Gradient (Floating Elements)
```css
radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)
```

### Light Background Gradient
```css
linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)
```

---

## 📏 Responsive Breakpoints

### Mobile First
```css
/* Base styles for 320px and up */
.container { width: 100%; }

/* Small devices (576px and up) */
@media (min-width: 576px) { ... }

/* Medium devices (768px and up) */
@media (min-width: 768px) {
  .col-md-4 { width: 33.333%; }
  h1 { font-size: 2rem; }
}

/* Large devices (992px and up) */
@media (min-width: 992px) {
  .col-lg-4 { width: 33.333%; }
  h1 { font-size: 2.5rem; }
}

/* Extra large devices (1200px and up) */
@media (min-width: 1200px) {
  .container { max-width: 1200px; }
}
```

---

## 🎯 Component Specifications

### Hero Section
```
Padding: 80-120px top/bottom
Background: Dark gradient with floating elements
Min Height: Varies
Clip Path: polygon(0 0, 100% 0, 100% 85%, 0 100%)
Text Alignment: Center
Animation: Floating elements in background
```

### Navbar
```
Height: Auto (responsive)
Padding: 1rem 2rem
Position: Sticky
Background: Dark gradient with blur
Box Shadow: 0 4px 20px rgba(0, 0, 0, 0.2)
Z-index: 1000
```

### Product Grid
```
Columns: 1 (mobile) → 2 (tablet) → 3 (desktop)
Gap: 1.5rem - 2rem
Card Height: Auto / 100%
Image Height: 250px (mobile: 200px)
```

### Form Container
```
Max Width: 450px
Padding: 3rem 2.5rem
Background: White
Border Radius: 15px
Box Shadow: 0 15px 40px rgba(0, 0, 0, 0.15)
Margin: Auto (centered)
```

---

## 🌈 Shadow System

### Subtle Shadow
```css
box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
```

### Medium Shadow
```css
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
```

### Deep Shadow
```css
box-shadow: 0 15px 30px rgba(212, 175, 55, 0.2);
```

### Hover Shadow (Gold)
```css
box-shadow: 0 20px 40px rgba(212, 175, 55, 0.25);
```

### Button Shadow
```css
box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);
```

---

## 🔲 Border System

### Border Radius
```css
Small:    5px    (inputs, buttons)
Medium:   8px    (form controls)
Large:    12px   (cards)
Extra:    15px   (containers)
Round:    50px   (pill buttons)
Full:     50%    (circles)
```

### Border Styles
```css
Subtle: 1px solid #ecf0f1
Medium: 2px solid #d4af37
Thick:  4px solid (top borders)
```

---

## 📊 Visual Hierarchy

### Size Scale
```
H1: 4rem     (Hero)
H2: 3rem     (Section Title)
H3: 1.5rem   (Subsection)
Body: 1rem   (Normal)
Small: 0.9rem (Captions)
```

### Weight Scale
```
Regular (400)    → Body text
Medium (500)     → Emphasis
Semibold (600)   → Labels, small headings
Bold (700)       → Headings
Black (900)      → Hero text
```

### Color Scale
```
Primary:   #2c3e50  (Dark text)
Secondary: #7f8c8d  (Light text)
Accent:    #d4af37  (Gold highlights)
```

---

## ✨ Special Effects

### Glass-morphism (Navbar)
```css
backdrop-filter: blur(10px);
background: linear-gradient(135deg, #1a1a2e, #2d2d44);
opacity: High (visible but blurred behind)
```

### Text Gradient
```css
background: linear-gradient(135deg, #d4af37, #f0e68c);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

### Image Zoom
```css
Transform: scale(1) → scale(1.1)
Duration: 0.5s ease
```

### Overlay Effect
```css
position: absolute;
top: 0; left: 0; right: 0; bottom: 0;
background: rgba(0, 0, 0, 0.6);
opacity: 0 → 1 on hover
```

---

## 📱 Mobile Optimization

### Touch Targets
```
Minimum: 48px × 48px (buttons, links)
Preferred: 56px × 56px
Spacing: 8px between targets
```

### Responsive Typography
```
Mobile: Base size (16px)
Tablet: 1.1x base size
Desktop: 1.2x base size or larger
```

### Responsive Spacing
```
Mobile: 1rem - 2rem
Tablet: 1.5rem - 3rem
Desktop: 2rem - 4rem
```

---

## 🎬 Animation Examples

### Bounce Animation
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
animation: bounce 2s infinite;
```

### Float Animation
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(20px); }
}
animation: float 6s ease-in-out infinite;
```

### Spin Animation
```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
animation: spin 1s linear infinite;
```

### Slide Up Animation
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
animation: slideUp 0.5s ease;
```

---

## 🎨 Usage Examples

### Creating a New Button
```html
<button class="btn btn-primary">Click Me</button>
```

### Creating a Card
```html
<div class="card">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Title</h5>
    <p class="card-text">Description</p>
  </div>
</div>
```

### Creating a Form Group
```html
<div class="form-group">
  <label htmlFor="email">Email</label>
  <input type="email" id="email" class="form-control">
</div>
```

---

## 📝 Design Consistency Checklist

When adding new components, ensure:
- [ ] Uses color palette colors
- [ ] Uses Poppins font family
- [ ] Consistent padding/margin
- [ ] Proper border-radius
- [ ] Smooth transitions (0.3s ease)
- [ ] Responsive design
- [ ] Hover/active states
- [ ] Proper shadows
- [ ] Mobile optimization

---

## 🎯 Quick Reference

| Property | Value | Usage |
|----------|-------|-------|
| Primary Color | #d4af37 | Buttons, accents |
| Dark BG | #1a1a2e | Sections, text |
| Card BG | #ffffff | Content areas |
| Font Family | Poppins | All text |
| Border Radius | 12px | Cards |
| Default Shadow | 0 5px 15px rgba(0,0,0,0.08) | Cards |
| Hover Duration | 0.3s | Transitions |
| Max Width | 1200px | Container |

---

**This is your visual design reference guide. Use it to maintain consistency throughout your project! 🎨✨**
