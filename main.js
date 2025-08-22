import { ProductCard } from "./productCard.js";
import { Cart } from "./cart.js";

// Variables globales para el estado de la aplicación
let products = [];
let filteredProducts = [];
let selectedCategory = "";

// Instancia del carrito
const cart = new Cart();

// Elementos del DOM
const productsContainer = document.getElementById("products");
const loading = document.getElementById("loading");
const searchInput = document.querySelector('.search-input');
const sortSelect = document.querySelector('.sort-select');
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');

// Función principal para cargar productos
async function fetchProducts() {
    try {
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) throw new Error('Error al obtener los productos');

        products = await res.json();
        filteredProducts = [...products];

        renderProducts();
        hideLoading();

    } catch (error) {
        console.error("Error al cargar productos", error);
        showError('Error al cargar los productos. Por favor, recarga la página.');
    }
}

// Renderizar productos
function renderProducts() {
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: white; padding: 40px;"><h2>No se encontraron productos</h2><p>Intenta con otros filtros de búsqueda</p></div>';
        return;
    }

    productsContainer.innerHTML = '';
    filteredProducts.forEach(product => {
        const card = ProductCard(product, cart);
        productsContainer.appendChild(card);
    });
}

// Filtrar productos
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();

    filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    sortProducts();
    renderProducts();
}

// Ordenar productos
function sortProducts() {
    const sortValue = sortSelect.value;

    switch (sortValue) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'title-asc':
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'rating-desc':
            filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
            break;
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Buscar
    searchInput.addEventListener('input', filterProducts);

    // Ordenar
    sortSelect.addEventListener('change', () => {
        sortProducts();
        renderProducts();
    });

    // Botones de categorías
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Quitar activo de todos
            categoryButtons.forEach(b => b.classList.remove('active'));
            // Activar el clicado
            btn.classList.add('active');

            selectedCategory = btn.getAttribute("data-category");
            filterProducts();
        });
    });

    // Carrito
    cartButton.addEventListener('click', () => cart.toggleModal());
    closeCart.addEventListener('click', () => cart.toggleModal());

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cart.toggleModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartModal.classList.contains('active')) {
            cart.toggleModal();
        }
    });

    cart.subscribe(() => {
        renderProducts();
    });
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    productsContainer.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; color: white; padding: 40px;">
    <h2>❌ Error</h2>
    <p>${message}</p>
    </div>
`;
    hideLoading();
}

// Inicializar la aplicación
async function initApp() {
    try {
        cart.loadFromStorage(); 
        setupEventListeners();
        await fetchProducts();
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        showError('Error al cargar la aplicación. Por favor, recarga la página.');
    }
}

document.addEventListener('DOMContentLoaded', initApp);