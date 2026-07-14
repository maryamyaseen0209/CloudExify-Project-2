# Aurora Drop Store — CloudExify Web Dev Month 1, Project 2

A luxury limited-drop e-commerce storefront with cinematic 3D effects, built as a single-page application.

## Submission Details

| Field | Value |
|---|---|
| **Name** | Maryam Yaseen |
| **Registration number** | CX-2026-0530 |
| **Build track** | Dark luxury — glassmorphism, neon accents, 3D particle background, cinematic animations |

## Signature Features Implemented

1. **3D particle background** — Three.js particle system with 200 glowing particles reacting to mouse movement
2. **GSAP scroll-triggered animations** — Hero text, product cards, countdown boxes reveal with staggered entrance
3. **3D card tilt + glare** — Product cards rotate on hover with dynamic radial glare overlay
4. **Custom cursor** — Glow ring + dot with smooth lag, expands on interactive elements
5. **Scroll & mouse parallax** — Hero content parallax on both scroll and mousemove

## Features

- **Product Catalog** — 8 limited-edition items across Sneakers, Apparel, and Accessories
- **Search & Filters** — Real-time search, category filter, price range slider, sort options
- **Shopping Cart** — Add/remove with live quantity controls, persisted in localStorage
- **Wishlist** — Save favourites with heart toggle
- **Promo Code System** — Apply `VOID20` for 20% off
- **Mock Checkout** — Form validation with modal confirmation
- **Countdown Timer** — 3-day drop timer
- **Quick View Modal** — Click any product for a detailed overlay

## Project Structure

```
drop-store/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   ├── script.js
│   └── effects.js
├── assets/
│   ├── screenshot-desktop.png
│   └── screenshot-mobile.png
└── README.md
```

## Tech Stack

- **HTML5** — Bootstrap 5.3
- **CSS3** — Custom properties, glassmorphism, 3D transforms
- **JavaScript (Vanilla)** — State management, localStorage
- **Three.js r128** — 3D particle system
- **GSAP 3.12** — Scroll-triggered animations

## How to Run

```
git clone https://github.com/maryamyaseen0209/CloudExify-Project-2.git
cd CloudExify-Project-2/drop-store
start index.html
```
