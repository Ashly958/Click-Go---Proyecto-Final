export class Cart {
    constructor() {
        this.items = [];
        this.observers = []; // Para el patrón Observer
        this.modal = document.getElementById('cartModal');
        this.itemsContainer = document.getElementById('cartItems');
        this.totalContainer = document.getElementById('cartTotal');
        this.countElement = document.getElementById('cartCount');
    }

    subscribe(callback) {
        this.observers.push(callback);
    }

    notify() {
        this.observers.forEach(callback => callback());
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.saveToStorage();
        this.updateDisplay();
        this.notify();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateDisplay();
        this.notify();
        this.showNotification('Producto eliminado del carrito');
    }

    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            this.removeItem(productId);
            return;
        }

        this.saveToStorage();
        this.updateDisplay();
    }

    isInCart(productId) {
        return this.items.some(item => item.id === productId);
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    updateDisplay() {
        this.updateCount();
        this.renderItems();
        this.renderTotal();
    }

    updateCount() {
        const count = this.getTotalItems();
        this.countElement.textContent = count;

        if (count > 0) {
            this.countElement.style.display = 'flex';
        } else {
            this.countElement.style.display = 'none';
        }
    }

    renderItems() {
        if (this.items.length === 0) {
            this.itemsContainer.innerHTML = `
        <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h3>Tu carrito está vacío</h3>
        <p>Agrega algunos productos para comenzar</p>
        </div>
    `;
            return;
        }

        this.itemsContainer.innerHTML = '';
        this.items.forEach(item => {
            const cartItem = this.createCartItem(item);
            this.itemsContainer.appendChild(cartItem);
        });
    }

    createCartItem(item) {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';

        cartItemElement.innerHTML = `
    <img src="${item.image}" alt="${item.title}" class="cart-item-image">
    <div class="cart-item-info">
        <h4>${item.title}</h4>
        <p>$${item.price} c/u</p>
    </div>
    <div class="quantity-controls">
        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
    </div>
    <button class="remove-item" data-id="${item.id}">Eliminar</button>
    `;

        const decreaseBtn = cartItemElement.querySelector('[data-action="decrease"]');
        const increaseBtn = cartItemElement.querySelector('[data-action="increase"]');
        const removeBtn = cartItemElement.querySelector('.remove-item');

        decreaseBtn.addEventListener('click', () => this.updateQuantity(item.id, -1));
        increaseBtn.addEventListener('click', () => this.updateQuantity(item.id, 1));
        removeBtn.addEventListener('click', () => this.removeItem(item.id));

        return cartItemElement;
    }

    renderTotal() {
        if (this.items.length === 0) {
            this.totalContainer.innerHTML = '';
            return;
        }

        const total = this.getTotal();
        const itemCount = this.getTotalItems();

        this.totalContainer.innerHTML = `
    <div class="total-amount">Total: $${total.toFixed(2)}</div>
    <p>${itemCount} producto${itemCount !== 1 ? 's' : ''} en tu carrito</p>
    <button class="checkout-btn" id="checkoutBtn">
        Proceder al Pago
    </button>
    `;

        const checkoutBtn = this.totalContainer.querySelector('#checkoutBtn');
        checkoutBtn.addEventListener('click', () => this.checkout());
    }

    checkout() {
        if (this.items.length === 0) return;

        const total = this.getTotal();
        alert(`¡Gracias por tu compra!\nTotal: $${total.toFixed(2)}\n\nEsta es una demo, no se procesará ningún pago real.`);

        this.items = [];
        this.saveToStorage();
        this.updateDisplay();
        this.toggleModal();
        this.notify();
    }

    toggleModal() {
        this.modal.classList.toggle('active');
    }

    // Guardar carrito en localStorage por usuario
    saveToStorage() {
        try {
            const currentUser = localStorage.getItem("sessionUser");
            if (!currentUser) return;
            localStorage.setItem(`fakestore_cart_${currentUser}`, JSON.stringify(this.items));
        } catch (error) {
            console.warn('localStorage no disponible, usando memoria temporal');
        }
    }

    // Cargar carrito desde localStorage por usuario
    loadFromStorage() {
        try {
            const currentUser = localStorage.getItem("sessionUser");
            if (!currentUser) return;
            const savedCart = localStorage.getItem(`fakestore_cart_${currentUser}`);
            if (savedCart) {
                this.items = JSON.parse(savedCart);
                this.updateDisplay();
            }
        } catch (error) {
            console.warn('Error al cargar del localStorage:', error);
            this.items = [];
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #ff4757, #ff3838);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    z-index: 10000;
    font-weight: 600;
    box-shadow: 0 8px 25px rgba(255, 71, 87, 0.3);
    animation: slideIn 0.3s ease;
    `;
        notification.textContent = message;

        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
        @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
        }
    `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}