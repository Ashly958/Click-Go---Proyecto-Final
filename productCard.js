export function ProductCard(product, cart) {
    const card = document.createElement("div");
    card.className = "card";

    // Verificar si el producto está en el carrito
    const isInCart = cart.isInCart(product.id);
    const stars = generateStars(product.rating.rate);

    card.innerHTML = `
    <span class="product-category">${product.category}</span>
    <img src="${product.image}" alt="${product.title}">
    <h2>${product.title}</h2>
    <p>${product.description.substring(0, 100)}...</p>
    <div class="rating">
    <span class="stars">${stars}</span>
    <span>(${product.rating.rate}) • ${product.rating.count} reseñas</span>
    </div>
    <div class="price">$${product.price}</div>
    <button class="add-to-cart-btn" ${isInCart ? 'disabled' : ''}>
    ${isInCart ? '✓ En el carrito' : '🛒 Agregar al carrito'}
    </button>
    `;

    // Agregar event listener al botón
    const button = card.querySelector('button');
    button.addEventListener('click', () => {
        if (!isInCart) {
            cart.addItem(product);
            showNotification(`${product.title} agregado al carrito`);
        }
    });

    return card;
}

// Función para generar estrellas de calificación
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }

    if (hasHalfStar) {
        stars += '☆';
    }

    while (stars.length < 5) {
        stars += '☆';
    }

    return stars;
}

// Función para mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #26de81, #20bf6b);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    z-index: 10000;
    font-weight: 600;
    box-shadow: 0 8px 25px rgba(38, 222, 129, 0.3);
    animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    // Agregar estilos de animación
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