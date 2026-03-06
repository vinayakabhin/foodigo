// FOODIGO - JavaScript Application

// Global Variables
let cart = [];
let menuItems = [];
let comboOffers = [];
let currentSlideIndex = 0;
let isStudent = false;
let deliveryCharge = 0;
let currentReward = null;

// Rewards for scratch card
const rewards = [
    'Free Sprite on next order',
    '₹10 off on next order',
    '₹20 off on next order',
    'Free French Fries',
    'Free Cold Drink',
    'Free Momos',
    '₹30 discount coupon'
];

// Sound effects (using Web Audio API for success sound)
const successSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleRYGQqLQ3L5WEwg5iLzXzXYzAx1DjtLStV4XCCuJv9nLejEEH0KJ1d+2ZhYKKoS31te4YBUIK4Cw2d+0XRYKLH+w3+GiXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+SjXRYJLHip3+S');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    loadCombos();
    initBannerSlider();
});

// Banner Slider
function initBannerSlider() {
    setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % 4;
        updateBanner();
    }, 4000);
}

function currentSlide(index) {
    currentSlideIndex = index;
    updateBanner();
}

function updateBanner() {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dot');
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlideIndex);
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlideIndex);
    });
}

// Load Menu Items from API
async function loadMenu() {
    try {
        const response = await fetch('/api/menu');
        menuItems = await response.json();
        renderMenu(menuItems);
        setupCategoryFilters();
    } catch (error) {
        console.error('Error loading menu:', error);
    }
}

// Load Combo Offers
async function loadCombos() {
    try {
        const response = await fetch('/api/combos');
        comboOffers = await response.json();
        renderCombos();
    } catch (error) {
        console.error('Error loading combos:', error);
    }
}

// Render Menu Items
function renderMenu(items) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = items.map((item, index) => `
        <div class="menu-card" style="animation-delay: ${index * 0.1}s">
            <div class="menu-card-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300'">
                <span class="menu-card-badge">${item.category}</span>
            </div>
            <div class="menu-card-content">
                <div class="menu-card-category">${item.category}</div>
                <h3 class="menu-card-name">${item.name}</h3>
                <div class="menu-card-price">₹${item.price}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${item.id}, '${item.name}', ${item.price}, '${item.image}')">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Setup Category Filter Buttons
function setupCategoryFilters() {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.dataset.category;
            if (category === 'all') {
                renderMenu(menuItems);
            } else {
                const filtered = menuItems.filter(item => item.category === category);
                renderMenu(filtered);
            }
        });
    });
}

// Render Combo Offers
function renderCombos() {
    const comboGrid = document.getElementById('comboGrid');
    comboImages = [
        ['https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300'],
        ['https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300'],
        ['https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300']
    ];
    
    comboGrid.innerHTML = comboOffers.map((combo, index) => `
        <div class="combo-card">
            <span class="combo-badge">HOT DEAL</span>
            <div class="combo-image">
                <img src="${comboImages[index][0]}" alt="Item 1" onerror="this.src='https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300'">
                <img src="${comboImages[index][1]}" alt="Item 2" onerror="this.src='https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300'">
            </div>
            <div class="combo-info">
                <h3 class="combo-name">${combo.name}</h3>
                <p class="combo-description">${combo.description}</p>
                <div class="combo-price">₹${combo.price}</div>
                <button class="combo-btn" onclick="addComboToCart('${combo.name}', ${combo.price}, '${combo.description}')">
                    <i class="fas fa-cart-plus"></i> Add Combo
                </button>
            </div>
        </div>
    `).join('');
}

// Add Item to Cart
function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id && !item.isCombo);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id,
            name,
            price,
            image,
            quantity: 1,
            isCombo: false
        });
    }
    
    updateCartUI();
    showToast(`${name} added to cart!`, 'success');
}

// Add Combo to Cart
function addComboToCart(name, price, description) {
    const comboId = 'combo_' + Date.now();
    
    cart.push({
        id: comboId,
        name,
        price,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300',
        quantity: 1,
        isCombo: true,
        description
    });
    
    updateCartUI();
    showToast(`${name} combo added!`, 'success');
}

// Update Cart UI
function updateCartUI() {
    // Update cart count
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
    
    // Update cart items
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
                <p>Add some delicious food!</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                    ${item.description ? `<small style="color:#747d8c">${item.description}</small>` : ''}
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
        `).join('');
    }
    
    calculateTotals();
}

// Update Item Quantity
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    
    updateCartUI();
}

// Calculate Totals
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const distance = parseFloat(document.getElementById('distance')?.value) || 0;
    
    // Calculate delivery charge based on distance
    deliveryCharge = calculateDeliveryCharge(distance);
    
    // Calculate discount
    isStudent = document.getElementById('studentDiscount')?.checked || false;
    const discount = isStudent ? subtotal * 0.10 : 0;
    
    const total = subtotal + deliveryCharge - discount;
    
    // Update cart display
    document.getElementById('cartSubtotal').textContent = `₹${subtotal}`;
    document.getElementById('cartDelivery').textContent = `₹${deliveryCharge}`;
    document.getElementById('cartDiscount').textContent = `-₹${discount}`;
    document.getElementById('cartTotal').textContent = `₹${total}`;
    
    // Show/hide discount row
    const discountRow = document.getElementById('discountRow');
    if (discount > 0) {
        discountRow.style.display = 'flex';
    } else {
        discountRow.style.display = 'none';
    }
    
    return { subtotal, deliveryCharge, discount, total };
}

// Calculate Delivery Charge
function calculateDeliveryCharge(distance) {
    if (distance <= 3) return 20;
    if (distance <= 7) return 40;
    if (distance <= 10) return 60;
    return 60; // Maximum charge for >10km
}

// Apply Student Discount
function applyStudentDiscount() {
    calculateTotals();
}

// Toggle Cart Sidebar
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Show Checkout Modal
function showCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    toggleCart();
    
    const { subtotal, deliveryCharge, discount, total } = calculateTotals();
    
    // Update summary items
    const summaryItems = document.getElementById('summaryItems');
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.quantity}x ${item.name}</span>
            <span>₹${item.price * item.quantity}</span>
        </div>
    `).join('');
    
    // Update summary totals
    document.getElementById('summarySubtotal').textContent = `₹${subtotal}`;
    document.getElementById('summaryDelivery').textContent = `₹${deliveryCharge}`;
    
    if (discount > 0) {
        document.getElementById('summaryDiscountRow').style.display = 'flex';
        document.getElementById('summaryDiscount').textContent = `-₹${discount}`;
    } else {
        document.getElementById('summaryDiscountRow').style.display = 'none';
    }
    
    document.getElementById('summaryTotal').textContent = `₹${total}`;
    
    // Reset delivery charge display
    document.getElementById('deliveryChargeDisplay').textContent = '₹0';
    document.getElementById('distance').value = '';
    
    document.getElementById('checkoutModal').classList.add('active');
}

// Close Checkout Modal
function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
}

// Calculate Delivery on Distance Change
function calculateDelivery() {
    const distance = parseFloat(document.getElementById('distance').value) || 0;
    deliveryCharge = calculateDeliveryCharge(distance);
    document.getElementById('deliveryChargeDisplay').textContent = `₹${deliveryCharge}`;
    calculateTotals();
    
    // Update summary
    const { subtotal, deliveryCharge: dc, discount, total } = calculateTotals();
    document.getElementById('summaryDelivery').textContent = `₹${dc}`;
    document.getElementById('summaryTotal').textContent = `₹${total}`;
}

// Toggle Payment Method
function togglePayment() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const qrSection = document.getElementById('qrCodeSection');
    
    if (paymentMethod === 'phonepe') {
        qrSection.style.display = 'block';
    } else {
        qrSection.style.display = 'none';
    }
}

// Place Order
async function placeOrder(event) {
    event.preventDefault();
    
    const customerName = document.getElementById('customerName').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const distance = parseFloat(document.getElementById('distance').value) || 0;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    const { subtotal, deliveryCharge, discount, total } = calculateTotals();
    
    const orderData = {
        customer_name: customerName,
        phone: phone,
        address: address,
        items: cart,
        subtotal: subtotal,
        delivery_charge: deliveryCharge,
        discount: discount,
        total: total,
        distance: distance,
        payment_method: paymentMethod,
        reward: currentReward
    };
    
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeCheckout();
            showOrderSuccess();
        }
    } catch (error) {
        console.error('Error placing order:', error);
        showToast('Error placing order. Please try again.', 'error');
    }
}

// Show Order Success
function showOrderSuccess() {
    // Play success sound
    playSuccessSound();
    
    document.getElementById('successModal').classList.add('active');
}

// Play Success Sound
function playSuccessSound() {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Play second tone
    setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        
        osc2.frequency.value = 1000;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.5);
    }, 200);
}

// Close Success and Show Reward
function closeSuccessAndShowReward() {
    document.getElementById('successModal').classList.remove('active');
    showScratchCard();
}

// Show Scratch Card
function showScratchCard() {
    // Reset scratch card
    const cover = document.getElementById('scratchCover');
    const reward = document.getElementById('scratchReward');
    const btn = document.getElementById('scratchBtn');
    const closeBtn = document.getElementById('closeScratchBtn');
    
    cover.classList.remove('scratched');
    cover.style.display = 'flex';
    reward.style.display = 'none';
    btn.classList.remove('hidden');
    closeBtn.style.display = 'none';
    
    // Select random reward
    currentReward = rewards[Math.floor(Math.random() * rewards.length)];
    reward.textContent = currentReward;
    
    document.getElementById('scratchModal').classList.add('active');
}

// Scratch Card Functionality
function scratchCard() {
    const cover = document.getElementById('scratchCover');
    const reward = document.getElementById('scratchReward');
    const btn = document.getElementById('scratchBtn');
    const closeBtn = document.getElementById('closeScratchBtn');
    
    cover.style.display = 'none';
    cover.classList.add('scratched');
    reward.style.display = 'flex';
    
    btn.classList.add('hidden');
    closeBtn.style.display = 'inline-block';
    
    showToast(`🎉 Congratulations! You unlocked: ${currentReward}`, 'success');
}

// Close Scratch Modal
function closeScratchModal() {
    document.getElementById('scratchModal').classList.remove('active');
    cart = [];
    updateCartUI();
    currentReward = null;
}

// Show Admin Panel
async function showAdminPanel() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        
        const tbody = document.getElementById('ordersTableBody');
        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customer_name}</td>
                <td>${order.phone}</td>
                <td>${order.address}</td>
                <td class="order-items-list">${order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</td>
                <td>${order.distance} km</td>
                <td>₹${order.delivery_charge}</td>
                <td>₹${order.total}</td>
                <td>${order.payment_method.toUpperCase()}</td>
                <td><span class="status-badge">${order.status}</span></td>
                <td>${order.reward || '-'}</td>
            </tr>
        `).join('');
        
        document.getElementById('adminModal').classList.add('active');
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Close Admin Panel
function closeAdminPanel() {
    document.getElementById('adminModal').classList.remove('active');
}

// Show Toast Notification
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Close modals on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

