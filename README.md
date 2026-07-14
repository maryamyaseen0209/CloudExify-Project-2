# AURORA — The Void Collection

A luxury limited-drop e-commerce storefront with cinematic 3D effects, built as a single-page application.

---

## Features

- **Product Catalog** — 8 limited-edition items across Sneakers, Apparel, and Accessories
- **Search & Filters** — Real-time search by name/description, category filter, price range slider, and sort (price low/high, top rated)
- **Shopping Cart** — Add/remove items with live quantity controls, persisted in localStorage
- **Wishlist** — Save favourites with heart toggle, persisted across sessions
- **Promo Code System** — Apply `VOID20` for 20% off
- **Mock Checkout** — Form validation with modal confirmation
- **Countdown Timer** — 3-day drop timer, displays "DROP IS LIVE" when expired
- **Quick View Modal** — Click any product image for a detailed overlay

## Cinematic 3D Effects

| Effect | Implementation |
|---|---|
| **3D Particle Background** | Three.js — 200 glowing particles (cyan/magenta/white) floating in 3D space, reactive to mouse movement |
| **Scroll-Triggered Animations** | GSAP + ScrollTrigger — hero text reveals on load, product cards stagger in, countdown boxes bounce, filter bar slides up |
| **3D Card Tilt** | Custom mouse tracking — product cards rotate with `perspective(1000px) rotateX/Y` and dynamic radial glare overlay |
| **Custom Cursor** | Glow ring + dot with smooth lag interpolation, expands on hover over interactive elements |
| **Scroll Parallax** | Hero content fades and slides upward as the user scrolls down |
| **Mouse Parallax** | Hero title and subtitle shift subtly on mousemove |
| **Glassmorphism** | Deep blur backdrops on navbar, filter bar, countdown boxes, offcanvas, and modals |
| **Liquid Button Effects** | Diagonal shine sweep and horizontal fill on hover with lift + glow shadow |

## Tech Stack

- **HTML5** — Semantic structure with Bootstrap 5.3
- **CSS3** — Custom properties, glassmorphism (`backdrop-filter`), 3D transforms, keyframe animations
- **JavaScript (Vanilla)** — State management, DOM manipulation, localStorage persistence
- **Three.js r128** — 3D particle system
- **GSAP 3.12** — Scroll-triggered reveal animations
- **Bootstrap 5.3** — Responsive layout, offcanvas, modals, form validation

## Screenshots

> *(Add your screenshots here — save them in this repository and link them below)*

![Hero Section](screenshots/hero.png)
![Product Grid](screenshots/products.png)
![Cart Offcanvas](screenshots/cart.png)
![Quick View Modal](screenshots/quickview.png)

## How to Run

1. Clone the repository
2. Open `index.html` in any modern browser
3. No build step or server required — it's a static SPA

```
git clone https://github.com/maryamyaseen0209/CloudExify-Project-2.git
cd CloudExify-Project-2
start index.html
```

## Credits

- Product images sourced from [Unsplash](https://unsplash.com)
- Icons by [FontAwesome](https://fontawesome.com)
- Fonts: Outfit, Space Grotesk, Playfair Display via [Google Fonts](https://fonts.google.com)

---

*AURORA — Limited Drop. Once they're gone, they're gone.*
