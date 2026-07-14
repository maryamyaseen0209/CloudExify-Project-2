# AURORA Drop - E-Commerce Product Page (Project 2)

This is a pure static site implementing a limited drop storefront. It is built strictly with HTML, CSS, and Vanilla JS, using Bootstrap 5 via CDN for styling and layout.

## Features

This project implements all mandatory mechanics for the CloudExify Internship Project 2:
1. **Countdown Timer:** Located in the cinematic hero section, ticking down every second to the drop deadline.
2. **Live Stock Indicator:** As you add items to the cart, the remaining stock automatically decreases on the product cards. Buttons turn to "SOLD OUT" when stock reaches zero.
3. **Persistent Cart:** The shopping cart relies on `localStorage`. A full page refresh will retain cart contents and reconcile the live stock correctly.
4. **Search + Filters:** Users can combined a text search, category dropdown, price slider, and sorting dropdown to find exactly what they want.

## Bonus Features
- Custom luxurious cinematic Dark Mode with neon accents and glassmorphism.
- Sort dropdown (Price Low/High, Rating).
- Bootstrap Toast notifications on successful "Add to Cart" and checkout events.
- Form validation on checkout simulation.

## Project Structure
- `index.html`: Main boilerplate and DOM layout.
- `css/style.css`: Custom cinematic styling.
- `js/data.js`: Mock data mimicking a database.
- `js/script.js`: State management, rendering, and core mechanics logic.

## Deployment
Since this uses standard static files (HTML/CSS/JS) and CDNs with zero build tools or `npm`, it is ready to be deployed instantly on Vercel. 
1. Create a new project in Vercel.
2. Import this repository / folder.
3. Vercel will auto-detect a static site and deploy it instantly.
