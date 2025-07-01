<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import NavBarComponent from '../components/NavBarComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import LoaderComponent from '../components/LoaderComponent.vue';

// Reactive state variables
const productos = ref([]); // This will hold ALL fetched products initially
const carrito = ref([]); // Stores items in the cart
const isMobile = ref(false); // Tracks if the user is on a mobile device
const showCarritoVentana = ref(false); // Controls visibility of the mobile cart window
const showMobileBubble = ref(false); // Controls the mobile cart bubble visibility

const route = useRoute(); // Vue Router's current route object
const router = useRouter(); // Vue Router's router instance
const loading = ref(false); // Indicates if products are currently being loaded

// Search query for client-side filtering
const searchQuery = ref('');

// Base URL for API calls
const API_BASE_URL = import.meta.env.VITE_CONNECTION_STRING;

// Function to fetch products from the API initially (all or by brand)
const fetchAllOrBrandProductos = async () => {
  loading.value = true; // Set loading state to true
  const brand = route.query.brand; // Get 'brand' from URL query parameters

  // Construct API URL based on whether a brand filter is present
  const apiUrl = brand
    ? `${API_BASE_URL}/api/Producto/brand?brand=${encodeURIComponent(brand)}`
    : `${API_BASE_URL}/api/Producto`;

  try {
    const response = await axios.get(apiUrl);
    productos.value = response.data; // Store the fetched products
  
  } catch (error) {
    console.error("Error al cargar productos:", error);
    productos.value = []; // Clear products on error
  } finally {
    loading.value = false; // Set loading state to false
  }
};

// Computed property to filter products based on the search query
// This is reactive: it re-runs whenever searchQuery or productos changes
const filteredProductos = computed(() => {
  if (!searchQuery.value) {
    return productos.value; // If no search query, return all products
  }
  const query = searchQuery.value.toLowerCase(); // Convert query to lowercase for case-insensitive search
  return productos.value.filter(prod =>
    prod.PROD_NOMBRE.toLowerCase().includes(query) // Filter by product name
  );
});

// Helper function to escape quotes (not directly used in this flow for filtering, but kept from original)
const escapeQuotes = (text) => {
  if (!text) return "";
  return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
};

// Function to add a product to the shopping cart
const agregarAlCarrito = (id, nombre, precio, imagen, cantidad = 1) => {
  const precioNumerico = parseFloat(precio.replace('$', '')); // Convert price string to number
  const productoExistente = carrito.value.find((item) => item.nombre === nombre);

  if (productoExistente) {
    productoExistente.cantidad += cantidad; // Increment quantity if product already in cart
  } else {
    carrito.value.push({
      id: id,
      nombre: nombre,
      precio: precioNumerico,
      cantidad: cantidad,
      imagen: imagen,
    });
  }
  guardarCarrito();
  // Only auto-open the cart window if on mobile
  if (isMobile.value) {
    showCarritoVentana.value = true;
  }
};

// Function to change the quantity of an item in the cart
const cambiarCantidad = (index, cambio) => {
  if (carrito.value[index]) {
    carrito.value[index].cantidad += cambio;
    if (carrito.value[index].cantidad <= 0) {
      carrito.value.splice(index, 1); // Remove item if quantity is zero or less
    }
    guardarCarrito(); // Save updated cart
  }
};

// Function to remove an item from the cart
const eliminarProducto = (index) => {
  if (carrito.value[index]) {
    carrito.value.splice(index, 1); // Remove item by index
    guardarCarrito(); // Save updated cart
  }
};

// Computed property for cart subtotal
const subtotal = computed(() => {
  return carrito.value.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
});

// Computed property for IVA (15% tax)
const iva = computed(() => {
  return subtotal.value * 0.15;
});

// Computed property for total cart value
const total = computed(() => {
  return subtotal.value + iva.value;
});

// Function to save cart to session storage
const guardarCarrito = () => {
  sessionStorage.setItem('carrito', JSON.stringify(carrito.value));
};

// Function to load cart from session storage
const cargarCarrito = () => {
  const carritoGuardado = sessionStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito.value = JSON.parse(carritoGuardado);
  }
};

// Function to proceed to checkout, including stock validation
const continuarCompra = async () => {
  if (carrito.value.length === 0) {
    alert('El carrito está vacío. Por favor, agrega productos antes de continuar.');
    return;
  }

  console.log('--- Iniciando validación de stock ---');
  console.log('Carrito actual:', JSON.parse(JSON.stringify(carrito.value)));

  try {
    // Fetch all products from API again to get the most current stock data for validation
    const response = await axios.get(`${API_BASE_URL}/api/Producto`);
    const productosAPI = response.data;
    console.log('Productos obtenidos de la API (para validación de stock):', productosAPI);

    let errores = [];
    // Iterate through items in the cart and validate against current stock from API
    for (const itemCarrito of carrito.value) {
      console.log(`Validando producto en carrito: ${itemCarrito.nombre}, Cantidad: ${itemCarrito.cantidad}`);

      const productoAPI = productosAPI.find(p => p.PROD_NOMBRE === itemCarrito.nombre);

      if (!productoAPI) {
        console.warn(`Producto no encontrado en la API: ${itemCarrito.nombre}`);
        errores.push({
          producto: itemCarrito.nombre,
          mensaje: 'Producto no encontrado en el inventario de la tienda.'
        });
      } else {
        console.log(`Producto API encontrado: ${productoAPI.PROD_NOMBRE}, Stock en API: ${productoAPI.PROD_STOCK}`);
        const stockDisponible = parseInt(productoAPI.PROD_STOCK);

        if (isNaN(stockDisponible) || stockDisponible < 0) {
          console.error(`Stock inválido para ${itemCarrito.nombre}: ${productoAPI.PROD_STOCK}`);
          errores.push({
            producto: itemCarrito.nombre,
            mensaje: `El stock disponible del producto no es válido. Stock: ${productoAPI.PROD_STOCK}.`
          });
        } else if (itemCarrito.cantidad > stockDisponible) {
          console.warn(`Stock insuficiente para ${itemCarrito.nombre}. Solicitado: ${itemCarrito.cantidad}, Disponible: ${stockDisponible}`);
          errores.push({
            producto: itemCarrito.nombre,
            mensaje: `Stock insuficiente. Disponible: ${stockDisponible}, solicitado: ${itemCarrito.cantidad}.`
          });
        } else {
          console.log(`Stock OK para ${itemCarrito.nombre}.`);
        }
      }
    }

    // If there are any stock validation errors, alert the user
    if (errores.length > 0) {
      let mensajeError = 'Errores detectados en tu carrito:\n';
      errores.forEach(error => {
        mensajeError += `- ${error.producto}: ${error.mensaje}\n`;
      });
      alert(mensajeError);
      console.log('--- Validación de stock terminada con errores ---');
      return;
    }

    console.log('--- Validación de stock exitosa ---');
    const usuarioLogueado = sessionStorage.getItem('isAuthenticated') === 'true';

    // Redirect based on user login status
    if (usuarioLogueado) {
      console.log('Usuario logueado. Redirigiendo a /pagos');
      router.push('/pagos');
    } else {
      alert('Debes iniciar sesión para continuar.');
      console.log('Usuario no logueado. Redirigiendo a /iniciarSesion');
      router.push('/iniciarSesion');
    }

  } catch (error) {
    console.error('Error general en continuarCompra:', error);
    if (error.response) {
      console.error('Datos de error del servidor:', error.response.data);
      alert(`Error del servidor al validar stock: ${error.response.status} - ${error.response.data.Message || 'Mensaje desconocido'}`);
    } else if (error.request) {
      alert('No se pudo conectar con el servidor para validar el stock. Por favor, revisa tu conexión a internet.');
    } else {
      alert('Error inesperado al preparar la validación de stock. Por favor, intenta nuevamente.');
    }
  }
};

// Computed property for the total quantity of items in the cart (for bubble)
const cantidadTotalCarrito = computed(() => {
  return carrito.value.reduce((total, producto) => total + producto.cantidad, 0);
});

// Watcher to control mobile cart bubble visibility
watch([isMobile, cantidadTotalCarrito], () => {
  showMobileBubble.value = isMobile.value && cantidadTotalCarrito.value > 0;
}, { immediate: true }); // Run immediately on component mount

// Function to toggle the mobile cart window visibility
const toggleCarritoVentana = () => {
  showCarritoVentana.value = !showCarritoVentana.value;
};

// Function to check and update mobile status based on window width
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
  if (!isMobile.value) {
    showCarritoVentana.value = false; // Hide mobile cart if not on mobile
  }
};

// Watcher to hide mobile cart window if cart becomes empty
watch(carrito, () => {
  if (carrito.value.length === 0) {
    showCarritoVentana.value = false;
  }
}, { deep: true }); // Deep watch for changes within the carrito array

// Lifecycle hook: runs after component is mounted to the DOM
onMounted(() => {
  cargarCarrito(); // Load cart from session storage
  fetchAllOrBrandProductos(); // Fetch products initially
  checkMobile(); // Initial check for mobile status
  window.addEventListener('resize', checkMobile); // Add resize listener for responsiveness
});
</script>

<template>
  <div class="productos-page-wrapper">
    <NavBarComponent class="navbar-products" />
    <div class="navbar-spacer"></div>

    <div class="main-container">
      <div class="search-bar-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar productos por nombre..."
          class="product-search-input"
        />
      </div>

      <section class="productos-grid">
        <div v-if="filteredProductos.length === 0 && !loading" class="no-products-message">
          No se encontraron productos que coincidan con "{{ searchQuery }}".
        </div>
        <div v-for="(prod, index) in filteredProductos" :key="prod.PROD_ID" class="producto-card">
          <div class="product-content">
            <div class="product-info">
              <h3>{{ prod.PROD_NOMBRE }}</h3>
              <p class="description">{{ prod.PROD_DESCCORTA || prod.PROD_DESC }}</p>
              <p class="price">${{ parseFloat(prod.PROD_PRECIO).toFixed(2) }}</p>
            </div>
            <div class="product-image-container">
              <img :src="prod.PROD_IMG" :alt="prod.PROD_NOMBRE" class="product-image" />
            </div>
          </div>
          <div class="add-to-cart-button"
            @click="agregarAlCarrito(prod.PROD_ID, prod.PROD_NOMBRE, parseFloat(prod.PROD_PRECIO).toFixed(2), prod.PROD_IMG)">
            <i class="fas fa-plus"></i>
          </div>
        </div>
      </section>

      <aside class="carrito-sidebar">
        <div class="carrito-header">
          <h2>Carrito</h2>
        </div>
        <div class="productosCarrito">
          <p v-if="carrito.length === 0" class="carrito-vacio-text">El carrito está vacío...</p>
          <div v-else>
            <div v-for="(producto, index) in carrito" :key="producto.id" class="producto-en-carrito">
              <div class="foto-producto">
                <img :src="producto.imagen" :alt="producto.nombre">
              </div>
              <div class="detalles-producto">
                <p><strong>{{ producto.nombre }}</strong></p>
                <p>${{ (producto.precio * producto.cantidad).toFixed(2) }}</p>
                <div class="item-actions">
                  <button class="delete-item" @click="eliminarProducto(index)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                  <div class="quantity-controls">
                    <button class="decrease-quantity" @click="cambiarCantidad(index, -1)">-</button>
                    <span>{{ producto.cantidad }}</span>
                    <button class="increase-quantity" @click="cambiarCantidad(index, 1)">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="resumen">
          <div class="subtotal">
            <span>Subtotal</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="iva">
            <span>IVA</span>
            <span>${{ iva.toFixed(2) }}</span>
          </div>
          <div class="total">
            <span>Total</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>
          <button class="btn-continuar" :disabled="carrito.length === 0" @click="continuarCompra">Continuar</button>
        </div>
      </aside>

      <div id="carrito-burbuja" class="carrito-burbuja" v-show="showMobileBubble"
        @click="toggleCarritoVentana">
        <i class="fas fa-shopping-cart"></i>
        <span id="carrito-cantidad">{{ cantidadTotalCarrito }}</span>
      </div>

      <div v-if="loading" class="loader-overlay">
        <LoaderComponent />
        <p class="loading-message">Cargando productos...</p>
      </div>

      <div id="carrito-ventana" :class="['carrito-ventana', { 'oculto': !showCarritoVentana }]" class="mobile-only">
        <div class="carrito-ventana-contenido">
          <div class="carrito-ventana-header">
            <h2>Tu Carrito</h2>
            <button class="close-btn" @click="toggleCarritoVentana"><i class="fas fa-times"></i></button>
          </div>
          <div class="productosCarrito-popup">
            <p v-if="carrito.length === 0" class="carrito-vacio-text">El carrito está vacío...</p>
            <div v-else>
              <div v-for="(producto, index) in carrito" :key="producto.id" class="producto-en-carrito">
                <div class="foto-producto">
                  <img :src="producto.imagen" :alt="producto.nombre">
                </div>
                <div class="detalles-producto">
                  <p><strong>{{ producto.nombre }}</strong></p>
                  <p>${{ (producto.precio * producto.cantidad).toFixed(2) }}</p>
                  <div class="item-actions">
                    <button class="delete-item" @click="eliminarProducto(index)">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                    <div class="quantity-controls">
                      <button class="decrease-quantity" @click="cambiarCantidad(index, -1)">-</button>
                      <span>{{ producto.cantidad }}</span>
                      <button class="increase-quantity" @click="cambiarCantidad(index, 1)">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="resumen">
            <div class="subtotal">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="iva">
              <span>IVA</span>
              <span>${{ iva.toFixed(2) }}</span>
            </div>
            <div class="total">
              <span>Total</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>
            <button class="btn-continuar" :disabled="carrito.length === 0" @click="continuarCompra">Continuar</button>
          </div>
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
/* Styles for the search input */
.search-bar-container {
  grid-column: 1 / -1; /* Make it span across all columns in the grid layout */
  margin-bottom: 20px; /* Add some space below the search bar */
  width: 100%;
}

.product-search-input {
  width: 100%;
  padding: 12px 15px;
  font-size: 1.1em;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
}

.product-search-input:focus {
  outline: none;
  border-color: #A63700;
  box-shadow: 0 0 0 3px rgba(166, 55, 0, 0.2);
}

/* Base layout styles */
.navbar-products {
 background-color: #ffffff;
 position: fixed;
 top: 0;
 left: 0;
 width: 100%;
 z-index: 1000;
 box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.navbar-spacer {
  height: 6em;
}

.productos-page-wrapper {
 display: flex;
 flex-direction: column;
 min-height: 100vh;
 background-color: #FFF2E0;
}

.main-container {
  display: flex;
  flex-grow: 1;
  padding: 2em;
  gap: 2em;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.productos-grid {
  flex: 3;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2em;
  padding: 1em 0;
}

.no-products-message {
  grid-column: 1 / -1;
  font-size: 1.5em;
  color: #664400;
  padding: 2em;
}

/* Product Card Styling */
.producto-card {
 background-color: #ffffff;
 border-radius: 12px;
 box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
 overflow: hidden;
 display: flex;
 flex-direction: column;
 justify-content: space-between;
 transition: transform 0.2s ease, box-shadow 0.2s ease;
 min-height: 300px;
 position: relative;
 border: 1px solid #e0e0e0;
}

.producto-card:hover {
 transform: translateY(-5px);
 box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.product-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 50px;
}

.product-info {
 padding: 1.5em;
 flex-grow: 1;
}

.product-info h3 {
 font-family: 'DynaPuff', cursive;
 font-size: 1.5em;
 color: #A63700;
 margin-top: 0;
 margin-bottom: 0.5em;
}

.product-info .description {
 font-size: 0.95em;
 color: #333333;
 line-height: 1.4;
 margin-bottom: 1em;
 flex-grow: 1;
}

.product-info .price {
 font-size: 1.4em;
 font-weight: bold;
 color: #664400;
 margin-top: 1em;
}

.product-image-container {
 width: 100%;
 height: 180px;
 display: flex;
 justify-content: center;
 align-items: center;
 overflow: hidden;
 background-color: #ffffff;
}

.product-image {
 max-width: 100%;
 max-height: 100%;
 object-fit: contain;
}

.add-to-cart-button {
 position: absolute;
 bottom: 15px;
 right: 15px;
 background-color: #A63700;
 color: #ffffff;
 border-radius: 50%;
 width: 45px;
 height: 45px;
 display: flex;
 justify-content: center;
 align-items: center;
 font-size: 1.5em;
 cursor: pointer;
 transition: background-color 0.2s ease, transform 0.2s ease;
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.add-to-cart-button:hover {
 background-color: #8C4500;
 transform: scale(1.1);
}

/* Cart Sidebar Styling (Desktop) */
.carrito-sidebar {
  flex: 1;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 1.5em;
  height: fit-content;
  position: sticky;
  top: calc(6em + 2em);
  border: 1px solid #e0e0e0;
  display: none; /* Hidden by default for mobile-first */
}

.carrito-header h2 {
 font-family: 'DynaPuff', cursive;
 color: #A63700;
 text-align: center;
 margin-top: 0;
 margin-bottom: 1.5em;
 font-size: 1.8em;
}

.productosCarrito,
.productosCarrito-popup {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1.5em;
}

.carrito-vacio-text {
 text-align: center;
 font-size: 1.1em;
 color: gray;
 padding: 1em 0;
}

.producto-en-carrito {
 display: flex;
 align-items: center;
 gap: 1em;
 margin-bottom: 1em;
 padding-bottom: 1em;
 border-bottom: 1px dashed #e0e0e0;
}

.producto-en-carrito:last-child {
 border-bottom: none;
 padding-bottom: 0;
}

.foto-producto img {
 width: 60px;
 height: 60px;
 object-fit: contain;
 border-radius: 8px;
 border: 1px solid #e0e0e0;
 padding: 5px;
 background-color: #f9f9f9;
}

.detalles-producto {
 flex-grow: 1;
}

.detalles-producto p {
 margin: 0;
 font-size: 0.95em;
 color: #333333;
}

.detalles-producto strong {
 font-size: 1em;
 color: #664400;
}

.item-actions {
 display: flex;
 align-items: center;
 gap: 0.8em;
 margin-top: 0.5em;
}

.delete-item {
 background: none;
 border: none;
 color: #A60000;
 cursor: pointer;
 font-size: 1.1em;
 padding: 0.2em;
 transition: color 0.2s ease;
}

.delete-item:hover {
 color: #cc0000;
}

.quantity-controls {
 display: flex;
 align-items: center;
 gap: 0.5em;
 background-color: #f0f0f0;
 border-radius: 5px;
 padding: 0.2em 0.5em;
}

.quantity-controls button {
 background-color: #A63700;
 color: #ffffff;
 border: none;
 border-radius: 4px;
 width: 25px;
 height: 25px;
 display: flex;
 justify-content: center;
 align-items: center;
 font-size: 1em;
 cursor: pointer;
 transition: background-color 0.2s ease;
}

.quantity-controls button:hover {
 background-color: #8C4500;
}

.quantity-controls span {
 font-weight: bold;
 font-size: 1.1em;
 color: #333333;
 min-width: 20px;
 text-align: center;
}

.resumen {
 border-top: 1px solid #e0e0e0;
 padding-top: 1.5em;
}

.resumen div {
 display: flex;
 justify-content: space-between;
 margin-bottom: 0.8em;
 font-size: 1.1em;
}

.resumen .total {
 font-weight: bold;
 font-size: 1.3em;
 color: #664400;
}

.btn-continuar {
 width: 100%;
 padding: 12px 20px;
 background-color: #1a7d3a;
 color: #ffffff;
 border: none;
 border-radius: 8px;
 font-size: 1.1em;
 font-weight: bold;
 cursor: pointer;
 transition: background-color 0.2s ease;
 margin-top: 1em;
}

.btn-continuar:hover:not(:disabled) {
 background-color: #166a31;
}

.btn-continuar:disabled {
 background-color: #cccccc;
 cursor: not-allowed;
 opacity: 0.7;
}

/* Cart Bubble - Now controlled by v-show, default to none */
.carrito-burbuja {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #A63700;
  color: #ffffff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex; /* Changed from 'none' to 'flex' here for v-show to toggle */
  justify-content: center;
  align-items: center;
  font-size: 1.8em;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 900;
  transition: transform 0.2s ease;
}

.carrito-burbuja:hover {
 transform: scale(1.05);
}

.carrito-burbuja span {
 position: absolute;
 top: -5px;
 right: -5px;
 background-color: #A60000;
 color: #ffffff;
 border-radius: 50%;
 padding: 0.2em 0.5em;
 font-size: 0.6em;
 font-weight: bold;
 min-width: 20px;
 text-align: center;
}

/* Mobile Cart Offcanvas Window */
.carrito-ventana {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; 
  justify-content: flex-end;
  align-items: flex-start;
  z-index: 1000;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  transform: translateX(0);
  opacity: 1;
}

.carrito-ventana.oculto {
  transform: translateX(100%);
  opacity: 0;
  pointer-events: none;
}

.mobile-only {
  display: none !important; /* Hidden by default (desktop-first approach here for offcanvas) */
}


.carrito-ventana-contenido {
 background-color: #ffffff;
 width: 85%;
 max-width: 400px;
 height: 100%;
 box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
 padding: 1.5em;
 display: flex;
 flex-direction: column;
}

.carrito-ventana-header {
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: 1.5em;
 border-bottom: 1px solid #e0e0e0;
 padding-bottom: 1em;
}

.carrito-ventana-header h2 {
 font-family: 'DynaPuff', cursive;
 color: #A63700;
 margin: 0;
 font-size: 1.8em;
}

.close-btn {
 background: none;
 border: none;
 font-size: 1.8em;
 color: #664400;
 cursor: pointer;
 padding: 0;
}

.close-btn:hover {
 color: #332200;
}

.productosCarrito-popup {
 flex-grow: 1;
 overflow-y: auto;
 padding-right: 10px;
}

/* Loader Styling */
.loader-overlay {
 position: fixed;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background-color: rgba(255, 255, 255, 0.8);
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
 z-index: 1001;
}

.loading-message {
 font-size: 1.2em;
 color: #664400;
 margin-top: 1em;
}


/* --- Media Queries for Responsive Display --- */

/* Desktop Styles (min-width: 769px) */
@media (min-width: 769px) {
  .carrito-sidebar {
    display: block; /* Show sidebar on desktop */
  }
  .carrito-burbuja {
    display: none !important; /* Force hide bubble on desktop */
  }
  .mobile-only {
    display: none !important; /* Ensure offcanvas is hidden on desktop */
  }
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    padding: 1em;
    gap: 1.5em;
  }

  .productos-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1em;
  }

 .producto-card {
  min-height: 250px;
 }

 .carrito-sidebar {
  display: none; /* Hide sidebar on mobile */
 }

  .carrito-burbuja {
    /* v-show handles its display, but we need to ensure its default is 'flex' when rendered */
    /* No need for display: flex; here, as v-show will apply it directly */
  }

  .mobile-only {
    display: flex !important; /* show offcanvas window itself, then v-show handles its visibility */
  }
}

/* Smaller Mobile Screens (max-width: 480px) */
@media (max-width: 480px) {
 .main-container {
  padding: 0.5em;
 }

  .productos-grid {
    grid-template-columns: 1fr;
    gap: 1em;
  }

 .producto-card {
  min-height: 220px;
 }

  .carrito-ventana-contenido {
    width: 95%;
  }
}
</style>