# FOODIGO - Fast Food Ordering Website

A modern, professional food ordering website built with HTML, CSS, JavaScript, Node.js, Express, and SQLite.

## Features

- 🍔 **Modern UI** - Beautiful, responsive design similar to Swiggy
- 🖼️ **Food Banner** - Attractive hero section with food images
- 📋 **Menu Section** - Food items displayed as cards with categories
- 🍱 **Combo Offers** - Special combo deals for customers
- 🎓 **Student Discount** - 10% discount for students with valid ID
- 🛒 **Cart System** - Add multiple items with quantity management
- 🚚 **Delivery Charges** - Automatic calculation based on distance
- 💳 **Payment Options** - Cash on Delivery and PhonePe QR code
- ✅ **Order Confirmation** - Success animation with sound
- 🎁 **Lucky Scratch Card** - Win exciting rewards on every order
- 👨‍💼 **Admin Panel** - View all orders with details

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **Database**: SQLite

## Project Structure

```
foodigo/
├── package.json          # Project dependencies
├── server.js             # Express server and database
├── README.md             # Project documentation
├── public/
│   ├── index.html        # Main HTML file
│   ├── style.css         # Styling
│   └── script.js         # Frontend JavaScript
└── foodigo.db            # SQLite database (created automatically)
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd foodigo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   Visit `http://localhost:3000`

### Running in Visual Studio Code

1. Open the project folder in VS Code
2. Open terminal (`Ctrl + ``)
3. Run `npm install`
4. Run `npm start`
5. Click the link in terminal or open `http://localhost:3000`

## Menu Categories

### Rice & Biryani
- Egg Rice – ₹50
- Chicken Fried Rice Half – ₹80
- Chicken Fried Rice Full – ₹120
- Chicken Biryani – ₹120
- Schezwan Chicken Rice – ₹130

### Egg Specials
- Omelet – ₹40
- Bread Omelet – ₹40

### Chicken & Kebabs
- Chicken Seekh Kebab – ₹120
- Chicken Tandoori Kebab – ₹140
- Chicken Malai Kebab – ₹150
- Chicken Popcorn – ₹100
- Chicken Lollipop – ₹140
- Chilli Chicken Dry – ₹120

### Snacks
- Veg Momos – ₹40
- Chicken Momos – ₹60
- French Fries – ₹50

### Drinks
- Cold Drinks – ₹30
- Cold Coffee – ₹40
- Badam Shake – ₹60
- Fresh Coconut – ₹40

## Delivery Charges

| Distance | Charge |
|----------|--------|
| 0 – 3 km | ₹20 |
| 3 – 7 km | ₹40 |
| 7 – 10 km | ₹60 |

## Scratch Card Rewards

Win exciting rewards on every order:
- Free Sprite on next order
- ₹10 off on next order
- ₹20 off on next order
- Free French Fries
- Free Cold Drink
- Free Momos
- ₹30 discount coupon

## API Endpoints

- `GET /api/menu` - Get all menu items
- `GET /api/menu/:category` - Get menu by category
- `GET /api/combos` - Get all combo offers
- `POST /api/orders` - Place new order
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id` - Update order status

## Future Expansion

The code structure allows easy addition of:
- Online payment gateway integration
- User authentication and accounts
- Loyalty points system
- More scratch card rewards
- Promotional banners
- Order tracking
- Push notifications

## License

MIT License

---

**Tagline:** Eat • Chill • Repeat

© 2024 FOODIGO. All rights reserved.

