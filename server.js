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
    db.run(`CREATE TABLE IF NOT EXISTS menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        image TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT,
        phone TEXT,
        address TEXT,
        items TEXT,
        subtotal REAL,
        delivery_charge REAL,
        discount REAL,
        total REAL,
        distance REAL,
        payment_method TEXT,
        status TEXT DEFAULT 'Pending',
        reward TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS combo_offers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL
    )`);

    // Insert menu items if empty
    db.get("SELECT COUNT(*) as count FROM menu_items", function(err, row) {
        if (err) {
            console.log('Error checking menu_items:', err);
        } else if (row && row.count === 0) {
            insertMenuItems();
        }
    });

    // Insert combo offers if empty
    db.get("SELECT COUNT(*) as count FROM combo_offers", function(err, row) {
        if (err) {
            console.log('Error checking combo_offers:', err);
        } else if (row && row.count === 0) {
            insertComboOffers();
        }
    });
}

function insertMenuItems() {
    const menuItems = [
        // Rice & Biryani
        { name: 'Egg Rice', price: 50, category: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300' },
        { name: 'Chicken Fried Rice Half', price: 80, category: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300' },
        { name: 'Chicken Fried Rice Full', price: 120, category: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300' },
        { name: 'Chicken Biryani', price: 120, category: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300' },
        { name: 'Schezwan Chicken Rice', price: 130, category: 'Rice & Biryani', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300' },
        
        // Egg Specials
        { name: 'Omelet', price: 40, category: 'Egg Specials', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300' },
        { name: 'Bread Omelet', price: 40, category: 'Egg Specials', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300' },
        
        // Chicken & Kebabs
        { name: 'Chicken Seekh Kebab', price: 120, category: 'Chicken & Kebabs', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300' },
        { name: 'Chicken Tandoori Kebab', price: 140, category: 'Chicken & Kebabs', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300' },
        { name: 'Chicken Malai Kebab', price: 150, category: 'Chicken & Kebabs', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300' },
        { name: 'Chicken Popcorn', price: 100, category: 'Chicken & Kebabs', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300' },
        { name: 'Chicken Lollipop', price: 140, category: 'Chicken & Kebabs', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300' },
        { name: 'Chilli Chicken Dry', price: 120, category: 'Chicken & Kebabs', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300' },
        
        // Snacks
        { name: 'Veg Momos', price: 40, category: 'Snacks', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300' },
        { name: 'Chicken Momos', price: 60, category: 'Snacks', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300' },
        { name: 'French Fries', price: 50, category: 'Snacks', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300' },
        
        // Drinks
        { name: 'Cold Drinks', price: 30, category: 'Drinks', image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=300' },
        { name: 'Cold Coffee', price: 40, category: 'Drinks', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300' },
        { name: 'Badam Shake', price: 60, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300' },
        { name: 'Fresh Coconut', price: 40, category: 'Drinks', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=300' }
    ];

    const stmt = db.prepare("INSERT INTO menu_items (name, price, category, image) VALUES (?, ?, ?, ?)");
    menuItems.forEach(item => {
        stmt.run(item.name, item.price, item.category, item.image);
    });
    stmt.finalize();
    console.log('Menu items inserted');
}

function insertComboOffers() {
    const combos = [
        { name: 'Student Combo', description: 'Veg Momos + Cold Coffee', price: 70 },
        { name: 'Rice Combo', description: 'Egg Rice + Omelet', price: 80 },
        { name: 'Chicken Combo', description: 'Chicken Fried Rice + Chicken Momos', price: 160 }
    ];

    const stmt = db.prepare("INSERT INTO combo_offers (name, description, price) VALUES (?, ?, ?)");
    combos.forEach(combo => {
        stmt.run(combo.name, combo.description, combo.price);
    });
    stmt.finalize();
    console.log('Combo offers inserted');
}

// API Routes

// Get all menu items
app.get('/api/menu', (req, res) => {
    db.all("SELECT * FROM menu_items", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get menu items by category
app.get('/api/menu/:category', (req, res) => {
    db.all("SELECT * FROM menu_items WHERE category = ?", [req.params.category], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get all combo offers
app.get('/api/combos', (req, res) => {
    db.all("SELECT * FROM combo_offers", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Place order
app.post('/api/orders', (req, res) => {
    const { customer_name, phone, address, items, subtotal, delivery_charge, discount, total, distance, payment_method, reward } = req.body;
    
    const stmt = db.prepare(`
        INSERT INTO orders (customer_name, phone, address, items, subtotal, delivery_charge, discount, total, distance, payment_method, reward)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
        customer_name,
        phone,
        address,
        JSON.stringify(items),
        subtotal,
        delivery_charge,
        discount || 0,
        total,
        distance,
        payment_method,
        reward || null
    );
    
    stmt.finalize();
    
    res.json({ success: true, message: 'Order placed successfully!' });
});

// Get all orders (for admin)
app.get('/api/orders', (req, res) => {
    db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Parse items JSON for each order
        rows = rows.map(row => ({
            ...row,
            items: JSON.parse(row.items)
        }));
        res.json(rows);
    });
});

// Get single order
app.get('/api/orders/:id', (req, res) => {
    db.get("SELECT * FROM orders WHERE id = ?", [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            row.items = JSON.parse(row.items);
        }
        res.json(row);
    });
});

// Update order status
app.put('/api/orders/:id', (req, res) => {
    const { status } = req.body;
    db.run("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], (err) => {
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

app.listen(PORT, () => {
    console.log(`FOODIGO server running on port ${PORT}`);
});

