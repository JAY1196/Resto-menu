# 🍽️ TableTap — QR Dine-In Ordering

A premium, mobile-first React app that lets restaurant customers **scan a QR code → browse the menu → place an order via WhatsApp** in seconds.

------

## Tech Stack

| Tool | Version |
|------|---------|
| React | 18 |
| Vite | 5 |
| Tailwind CSS | 3 |
| framer-motion | 11 |
| lucide-react | 0.435 |

---

## Getting Started

```bash
cd restaurant-qr-app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## QR Code Setup (Per Table)

Each table's QR code should encode a URL like:

```
https://yourdomain.com/?table=3
```

The app reads the `?table=` query param automatically. Generate QR codes at [qr-code-generator.com](https://www.qr-code-generator.com/).

---

## WhatsApp Integration

1. Open `src/components/CartDrawer.jsx`
2. Replace `919999999999` with your WhatsApp Business number (with country code, no `+`):

```js
const WHATSAPP_NUMBER = '919876543210'  // ← Your number here
```

---

## Restaurant Customisation

| File | What to change |
|------|---------------|
| `src/App.jsx` | Restaurant name (`restaurantName` prop) |
| `src/data/menuData.js` | Menu items, prices, images, categories |
| `src/components/CartDrawer.jsx` | WhatsApp number |
| `tailwind.config.js` | Brand colors (currently orange) |

---

## Deploy on Vercel

```bash
npm run build
# Push to GitHub, then import repo on vercel.com
# Build command: npm run build
# Output dir: dist
```

`vercel.json` is already configured for SPA routing.

---

## Project Structure

```
src/
├── components/
│   ├── Header.jsx       # Sticky header with restaurant name + table badge
│   ├── Menu.jsx         # Category tabs + food grid + floating cart FAB
│   ├── ItemCard.jsx     # Individual food card with qty controls
│   ├── CartDrawer.jsx   # Bottom-sheet cart + WhatsApp order
│   └── Toast.jsx        # Success notification
├── context/
│   └── CartContext.jsx  # Global cart state (useReducer)
├── data/
│   └── menuData.js      # All menu items + categories
├── App.jsx
├── main.jsx
└── index.css
```

---

*Powered by TableTap — Order placed via QR system*
