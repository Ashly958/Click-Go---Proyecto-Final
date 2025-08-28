import { ProductCard } from "./productCard.js";
import { Cart } from "./cart.js";

// Variables globales
let products = [];
let filteredProducts = [];
let selectedCategory = "";

// Variables para paginación
let currentPage = 1;
const itemsPerPage = 6;

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
const paginationContainer = document.getElementById("pagination"); // ⬅️ Nuevo

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

// Renderizar productos con paginación
function renderProducts() {
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: white; padding: 40px;"><h2>No se encontraron productos</h2><p>Intenta con otros filtros de búsqueda</p></div>';
        paginationContainer.innerHTML = ""; // limpiar paginación
        return;
    }

    productsContainer.innerHTML = '';

    // 🔹 Calcular inicio y fin de la página
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    // Renderizar solo productos de la página actual
    paginatedProducts.forEach(product => {
        const card = ProductCard(product, cart);
        productsContainer.appendChild(card);
    });

    renderPagination();
}

// Renderizar botones de paginación
function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    paginationContainer.innerHTML = "";

    if (totalPages <= 1) return; // Si solo hay 1 página no mostramos nada

    // Botón anterior
    if (currentPage > 1) {
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "⟨ Anterior";
        prevBtn.addEventListener("click", () => {
            currentPage--;
            renderProducts();
        });
        paginationContainer.appendChild(prevBtn);
    }

    // Botones de número
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        if (i === currentPage) {
            pageBtn.classList.add("active"); // puedes darle estilo en CSS
        }
        pageBtn.addEventListener("click", () => {
            currentPage = i;
            renderProducts();
        });
        paginationContainer.appendChild(pageBtn);
    }

    // Botón siguiente
    if (currentPage < totalPages) {
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Siguiente ⟩";
        nextBtn.addEventListener("click", () => {
            currentPage++;
            renderProducts();
        });
        paginationContainer.appendChild(nextBtn);
    }
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
    currentPage = 1; // resetear a página 1
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
        currentPage = 1;
        renderProducts();
    });

    // Botones de categorías
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
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

// Inicializar
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
