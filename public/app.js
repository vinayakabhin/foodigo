// FOODIGO - JavaScript Application

// Global Variables
let cart = [];
let menuItems = [];
let comboOffers = [];
let currentReward = null;

// Rewards for scratch card
const rewards = [
    'Free Sprite on next order',
    '₹10 off on next order',
    '₹20 off on next order',
    'Free Omelet',
    'Free Delivery'
];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    loadCombos();
});

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
        <div class="menu-card" style="animation-delay: ${index * 0.05}s">
            <div class="menu-card-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300'">
            </div>
            <div class="menu-card-content">
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
    comboGrid.innerHTML = comboOffers.map((combo, index) => `
        <div class="combo-card">
            <span class="combo-badge">HOT DEAL</span>
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
    const deliveryFee = calculateDeliveryFee(distance);
    
    // Calculate discount
    const isStudent = document.getElementById('studentDiscount')?.checked || false;
    const discount = isStudent ? subtotal * 0.10 : 0;
    
    const total = subtotal + deliveryFee - discount;
    
    // Update cart display
    document.getElementById('cartSubtotal').textContent = `₹${subtotal}`;
    document.getElementById('cartDelivery').textContent = `₹${deliveryFee}`;
    document.getElementById('cartDiscount').textContent = `-₹${discount}`;
    document.getElementById('cartTotal').textContent = `₹${total}`;
    
    // Show/hide discount row
    const discountRow = document.getElementById('discountRow');
    if (discount > 0) {
        discountRow.style.display = 'flex';
    } else {
        discountRow.style.display = 'none';
    }
    
    return { subtotal, deliveryFee, discount, total };
}

// Calculate Delivery Fee
function calculateDeliveryFee(distance) {
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

// Scroll to Menu
function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

// Show Checkout Modal
function showCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    toggleCart();
    
    const { subtotal, deliveryFee, discount, total } = calculateTotals();
    
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
    document.getElementById('summaryDelivery').textContent = `₹${deliveryFee}`;
    
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
    const deliveryFee = calculateDeliveryFee(distance);
    document.getElementById('deliveryChargeDisplay').textContent = `₹${deliveryFee}`;
    calculateTotals();
    
    // Update summary
    const { subtotal, deliveryFee: df, discount, total } = calculateTotals();
    document.getElementById('summaryDelivery').textContent = `₹${df}`;
    document.getElementById('summaryTotal').textContent = `₹${total}`;
}

// Toggle Payment Method
function togglePayment() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const upiSection = document.getElementById('upiSection');
    
    if (paymentMethod === 'upi') {
        upiSection.style.display = 'block';
    } else {
        upiSection.style.display = 'none';
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
    
    const { subtotal, deliveryFee, discount, total } = calculateTotals();
    
    const orderData = {
        customer_name: customerName,
        phone: phone,
        address: address,
        items: cart,
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        discount: discount,
        total: total,
        distance: distance,
        payment_method: paymentMethod,
        reward: currentReward
    };
    
    try {
        const response = await fetch('/api/order', {
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
    try {
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
    } catch (e) {
        console.log('Audio not supported');
    }
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
    const closeBtn = document.getElementById('closeScratchBtn');
    
    cover.style.display = 'flex';
    cover.classList.remove('scratched');
    reward.style.display = 'none';
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
    const closeBtn = document.getElementById('closeScratchBtn');
    
    cover.style.display = 'none';
    cover.classList.add('scratched');
    reward.style.display = 'flex';
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

