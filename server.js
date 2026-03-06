const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'foodigo.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize Database Tables
function initializeDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT,
        phone TEXT,
        address TEXT,
        items TEXT,
        subtotal REAL,
        delivery_fee REAL,
        discount REAL,
        total REAL,
        distance REAL,
        payment_method TEXT,
        status TEXT DEFAULT 'Received',
        reward TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
}

// Menu Items (served from server)
const menuItems = [
    // Rice & Biryani
    { id: 1, name: 'Egg Rice', price: 50, category: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300' },
    { id: 2, name: 'Chicken Fried Rice Half', price: 80, category: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300' },
    { id: 3, name: 'Chicken Fried Rice Full', price: 120, category: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300' },
    { id: 4, name: 'Chicken Biryani', price: 120, category: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300' },
    { id: 5, name: 'Schezwan Chicken Rice', price: 130, category: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300' },
    
    // Egg Specials
    { id: 6, name: 'Omelet', price: 40, category: 'Egg Specials', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300' },
    { id: 7, name: 'Bread Omelet', price: 40, category: 'Egg Specials', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300' },
    
    // Chicken & Kebabs
    { id: 8, name: 'Chicken Seekh Kebab', price: 120, category: 'Chicken & Kebabs', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300' },
    { id: 9, name: 'Chicken Tandoori Kebab', price: 140, category: 'Chicken & Kebabs', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300' },
    { id: 10, name: 'Chicken Malai Kebab', price: 150, category: 'Chicken & Kebabs', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300' },
    { id: 11, name: 'Chicken Popcorn', price: 100, category: 'Chicken & Kebabs', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300' },
    { id: 12, name: 'Fried Chicken', price: 120, category: 'Chicken & Kebabs', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300' },
    
    // Drinks
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

// Rewards
const rewards = [
    'Free Sprite on next order',
    '₹10 off on next order',
    '₹20 off on next order',
    'Free Omelet',
    'Free Delivery'
];

// API Routes

// Get menu items
app.get('/api/menu', (req, res) => {
    res.json(menuItems);
});

// Get combo offers
app.get('/api/combos', (req, res) => {
    res.json(comboOffers);
});

// Place order
app.post('/api/order', (req, res) => {
    const { customer_name, phone, address, items, subtotal, delivery_fee, discount, total, distance, payment_method, reward } = req.body;
    
    const stmt = db.prepare(`
        INSERT INTO orders (customer_name, phone, address, items, subtotal, delivery_fee, discount, total, distance, payment_method, reward)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
        customer_name,
        phone,
        address,
        JSON.stringify(items),
        subtotal,
        delivery_fee,
        discount || 0,
        total,
        distance,
        payment_method,
        reward || null
    );
    
    stmt.finalize();
    
    // Get the last inserted ID
    db.get("SELECT last_insert_rowid() as id", (err, row) => {
        res.json({ success: true, orderId: row.id, message: 'Order placed successfully!' });
    });
});

// Admin login check (simple authentication)
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'vinayak' && password === 'foodigo123') {
        res.json({ success: true, token: 'admin-authenticated' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Get all orders (admin only)
app.get('/api/orders', (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader !== 'admin-authenticated') {
        res.status(403).json({ error: 'Access denied' });
        return;
    }
    
    db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        rows = rows.map(row => ({
            ...row,
            items: JSON.parse(row.items)
        }));
        res.json(rows);
    });
});

// Update order status
app.put('/api/order-status', (req, res) => {
    const { id, status } = req.body;
    const authHeader = req.headers.authorization;
    
    if (authHeader !== 'admin-authenticated') {
        res.status(403).json({ error: 'Access denied' });
        return;
    }
    
    db.run("UPDATE orders SET status = ? WHERE id = ?", [status, id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true });
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`FOODIGO server running on port ${PORT}`);
});

