const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = new Database("foodigo.db");

db.prepare(`
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT,
  phone TEXT,
  address TEXT,
  items TEXT,
  total INTEGER,
  delivery_fee INTEGER,
  distance INTEGER,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

// Menu Items
const menuItems = [
    { id: 1, name: 'Egg Rice', price: 50, category: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300' },
    { id: 2, name: 'Chicken Fried Rice Half', price: 80, category: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300' },
    { id: 3, name: 'Chicken Fried Rice Full', price: 120, category: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300' },
    { id: 4, name: 'Chicken Biryani', price: 120, category: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300' },
    { id: 5, name: 'Schezwan Chicken Rice', price: 130, category: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300' },
    { id: 6, name: 'Omelet', price: 40, category: 'Egg Specials', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300' },
    { id: 7, name: 'Bread Omelet', price: 40, category: 'Egg Specials', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300' },
    { id: 8, name: 'Chicken Seekh Kebab', price: 120, category: 'Chicken & Kebabs', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300' },
    { id: 9, name: 'Chicken Tandoori Kebab', price: 140, category: 'Chicken & Kebabs', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300' },
    { id: 10, name: 'Chicken Malai Kebab', price: 150, category: 'Chicken & Kebabs', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300' },
    { id: 11, name: 'Chicken Popcorn', price: 100, category: 'Chicken & Kebabs', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300' },
    { id: 12, name: 'Fried Chicken', price: 120, category: 'Chicken & Kebabs', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300' },
    { id: 13, name: 'Sprite', price: 20, category: 'Drinks', image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=300' },
    { id: 14, name: 'Coke', price: 20, category: 'Drinks', image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=300' },
    { id: 15, name: 'Fresh Coconut', price: 30, category: 'Drinks', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=300' },
    { id: 16, name: 'Badam Shake', price: 40, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300' }
];

// Combo Offers
const comboOffers = [
    { id: 1, name: 'Student Combo', description: 'Egg Rice + Omelet + Coke', price: 80 },
    { id: 2, name: 'Chicken Combo', description: 'Chicken Fried Rice + Sprite', price: 120 },
    { id: 3, name: 'Party Combo', description: 'Chicken Biryani + Kebab + Drink', price: 180 }
];

// API Routes

// Get menu items
app.get("/api/menu", (req, res) => {
    res.json(menuItems);
});

// Get combo offers
app.get("/api/combos", (req, res) => {
    res.json(comboOffers);
});

// Place order
app.post("/api/order", (req, res) => {
    const { customer_name, phone, address, items, subtotal, delivery_fee, discount, total, distance, payment_method, reward } = req.body;

    const stmt = db.prepare(`
        INSERT INTO orders 
        (customer_name, phone, address, items, total, delivery_fee, distance, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
        customer_name,
        phone,
        address,
        JSON.stringify(items),
        total,
        delivery_fee,
        distance,
        "Received"
    );

    res.json({ success: true });
});

// Get all orders (admin)
app.get("/api/orders", (req, res) => {
    const orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
    res.json(orders);
});

// Admin login
app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === 'vinayak' && password === 'foodigo123') {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

// Update order status
app.put("/api/order-status", (req, res) => {
    const { id, status } = req.body;
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
    res.json({ success: true });
});

// Serve frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`FOODIGO server running on port ${PORT}`);
});

