<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import NavBarComponent from '../components/NavBarComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

// Referencias reactivas
const productos = ref([]);
const carrito = ref([]);
const isMobile = ref(false);
const showCarritoVentana = ref(false); // Para controlar la visibilidad de la ventana emergente del carrito
const route = useRoute(); // Para acceder a los parámetros de la URL
const router = useRouter();

// URL base de la API (ajusta según tu .env)
const API_BASE_URL = import.meta.env.VITE_CONNECTION_STRING;

// --- Lógica de Productos ---
const fetchProductos = async () => {
  const brand = route.query.brand;
  const apiUrl = brand 
    ? `${API_BASE_URL}/api/Producto/brand?brand=${encodeURIComponent(brand)}` 
    : `${API_BASE_URL}/api/Producto`;

  try {
    const response = await axios.get(apiUrl);
    productos.value = response.data;
  } catch (error) {
    console.error("Error al cargar productos:", error);
    productos.value = []; // Vaciar productos en caso de error
    // Podrías mostrar un mensaje de error en la UI
  }
};

// --- Lógica del Carrito ---

// Función para escapar comillas (necesario si se insertan directamente en HTML atributos, aunque Vue lo maneja mejor)
const escapeQuotes = (text) => {
  if (!text) return "";
  return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
};

const agregarAlCarrito = (id, nombre, precio, imagen, cantidad = 1) => {
  const precioNumerico = parseFloat(precio.replace('$', ''));
  const productoExistente = carrito.value.find((item) => item.nombre === nombre);

  if (productoExistente) {
    productoExistente.cantidad += cantidad;
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
};

const cambiarCantidad = (index, cambio) => {
  if (carrito.value[index]) {
    carrito.value[index].cantidad += cambio;
    if (carrito.value[index].cantidad <= 0) {
      carrito.value.splice(index, 1);
    }
    guardarCarrito();
  }
};

const eliminarProducto = (index) => {
  if (carrito.value[index]) {
    carrito.value.splice(index, 1);
    guardarCarrito();
  }
};

// Computadas para el resumen del carrito
const subtotal = computed(() => {
  return carrito.value.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
});

const iva = computed(() => {
  return subtotal.value * 0.15;
});

const total = computed(() => {
  return subtotal.value + iva.value;
});

// Guardar y cargar carrito en sessionStorage
const guardarCarrito = () => {
  sessionStorage.setItem('carrito', JSON.stringify(carrito.value));
};

const cargarCarrito = () => {
  const carritoGuardado = sessionStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito.value = JSON.parse(carritoGuardado);
  }
};

// Validar stock antes de continuar
const continuarCompra = async () => {
  if (carrito.value.length === 0) {
    alert('El carrito está vacío. Por favor, agrega productos antes de continuar.');
    return;
  }

  console.log('--- Iniciando validación de stock ---');
  console.log('Carrito actual:', JSON.parse(JSON.stringify(carrito.value))); // Clona para ver el estado actual

  try {
    const response = await axios.get(`${API_BASE_URL}/api/Producto`);
    const productosAPI = response.data;
    console.log('Productos obtenidos de la API:', productosAPI);

    let errores = [];
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

    if (usuarioLogueado) {
      console.log('Usuario logueado. Redirigiendo a /pagos');
      router.push('/pagos');
    } else {
      alert('Debes iniciar sesión para continuar.');
      console.log('Usuario no logueado. Redirigiendo a /login');
      router.push('/login');
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

// --- Lógica de la burbuja y ventana emergente del carrito ---
const cantidadTotalCarrito = computed(() => {
  return carrito.value.reduce((total, producto) => total + producto.cantidad, 0);
});

const toggleCarritoVentana = () => {
  if (cantidadTotalCarrito.value > 0) {
    showCarritoVentana.value = !showCarritoVentana.value;
  } else {
    console.log('El carrito está vacío. No se mostrará la ventana del carrito.');
  }
};

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768; // Ajusta el breakpoint si es necesario
};

// Observar cambios en el carrito para actualizar la burbuja y ventana
watch(carrito, () => {
  // Cuando el carrito cambia, si está vacío, oculta la ventana
  if (carrito.value.length === 0) {
    showCarritoVentana.value = false;
  }
}, { deep: true });

// Lifecycle Hook
onMounted(() => {
  cargarCarrito(); // Cargar carrito al montar el componente
  fetchProductos(); // Cargar productos al montar el componente
  checkMobile(); // Verificar estado móvil al montar
  window.addEventListener('resize', checkMobile); // Escuchar cambios de tamaño de pantalla
});
</script>

<template>
  <div class="productos-page-wrapper">
    <NavBarComponent class="navbar-products"/>
    <div class="navbar-spacer"></div>

    <div class="main-container">
      <section class="productos-grid">
        <div v-if="productos.length === 0" class="no-products-message">
          <p>No se encontraron productos disponibles.</p>
        </div>
        <div v-for="(prod, index) in productos" :key="prod.PROD_ID" class="producto-card">
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

      <aside class="carrito-sidebar" v-if="!isMobile">
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

      <div id="carrito-burbuja" class="carrito-burbuja" v-if="isMobile && cantidadTotalCarrito > 0" @click="toggleCarritoVentana">
        <i class="fas fa-shopping-cart"></i>
        <span id="carrito-cantidad">{{ cantidadTotalCarrito }}</span>
      </div>

      <div id="carrito-ventana" :class="['carrito-ventana', { 'oculto': !showCarritoVentana }]" v-if="isMobile">
        <div class="carrito-ventana-header">
          <h2>Tu Carrito</h2>
          <button class="close-btn" @click="showCarritoVentana = false"><i class="fas fa-times"></i></button>
        </div>
        <div class="carrito-ventana-contenido">
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
/* Colores y Fuentes base */
:root {
  --main-bg-color: #FFF2E0; /* Light Peach */
  --primary-color: #A63700; /* Dark Orange/Brown */
  --secondary-color: #664400; /* Medium Brown */
  --dark-accent: #332200; /* Darker Brown */
  --light-text: #ffffff;
  --dark-text: #333333;
  --card-bg: #ffffff;
  --border-color: #e0e0e0;
  --button-hover: #8C4500;
  --error-color: #A60000;
  --success-color: #1a7d3a;

  /* Fonts */
  --font-primary: 'DynaPuff', cursive;
  --font-secondary: 'Oswald', sans-serif;
}

body {
  font-family: var(--font-secondary);
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: var(--main-bg-color);
  color: var(--dark-text);
}

/* Navbar */
.navbar-products {
  background-color: var(--card-bg);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.navbar-spacer {
  height: 6em; /* Ajusta según la altura real de tu navbar */
}

/* Contenedor principal de la página de productos */
.productos-page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--main-bg-color);
}

.main-container {
  display: flex;
  flex-grow: 1; /* Permite que el contenido principal ocupe el espacio restante */
  padding: 2em;
  gap: 2em;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* Sección de productos (Grid) */
.productos-grid {
  flex: 3; /* Ocupa más espacio que la barra lateral */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Columnas responsivas */
  gap: 2em;
  padding: 1em 0;
}

.no-products-message {
  grid-column: 1 / -1; /* Ocupa todo el ancho del grid */
  text-align: center;
  font-size: 1.5em;
  color: var(--secondary-color);
  padding: 2em;
}

.producto-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 300px; /* Altura mínima para las tarjetas */
  position: relative; /* Para posicionar el botón de añadir */
  border: 1px solid var(--border-color);
}

.producto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.product-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 50px; /* Espacio para el botón flotante */
}

.product-info {
  padding: 1.5em;
  flex-grow: 1;
}

.product-info h3 {
  font-family: var(--font-primary);
  font-size: 1.5em;
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 0.5em;
}

.product-info .description {
  font-size: 0.95em;
  color: var(--dark-text);
  line-height: 1.4;
  margin-bottom: 1em;
  flex-grow: 1;
}

.product-info .price {
  font-size: 1.4em;
  font-weight: bold;
  color: var(--secondary-color);
  margin-top: 1em;
}

.product-image-container {
  width: 100%;
  height: 180px; /* Altura fija para la imagen */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #f0f0f0; /* Fondo si la imagen no cubre */
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* Asegura que la imagen se ajuste sin recortarse */
}

.add-to-cart-button {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background-color: var(--primary-color);
  color: var(--light-text);
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
  background-color: var(--button-hover);
  transform: scale(1.1);
}

/* Barra lateral del carrito */
.carrito-sidebar {
  flex: 1; /* Ocupa menos espacio */
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 1.5em;
  height: fit-content; /* Se ajusta a su contenido */
  position: sticky; /* Se mantiene en la parte superior al hacer scroll */
  top: calc(6em + 2em); /* Navbar height + padding */
  border: 1px solid var(--border-color);
}

.carrito-header h2 {
  font-family: var(--font-primary);
  color: var(--primary-color);
  text-align: center;
  margin-top: 0;
  margin-bottom: 1.5em;
  font-size: 1.8em;
}

.productosCarrito, .productosCarrito-popup {
  max-height: 400px; /* Altura máxima para scroll en el carrito */
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
  border-bottom: 1px dashed var(--border-color);
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
  border: 1px solid var(--border-color);
  padding: 5px;
  background-color: #f9f9f9;
}

.detalles-producto {
  flex-grow: 1;
}

.detalles-producto p {
  margin: 0;
  font-size: 0.95em;
  color: var(--dark-text);
}

.detalles-producto strong {
  font-size: 1em;
  color: var(--secondary-color);
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
  color: var(--error-color);
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
  background-color: var(--primary-color);
  color: var(--light-text);
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
  background-color: var(--button-hover);
}

.quantity-controls span {
  font-weight: bold;
  font-size: 1.1em;
  color: var(--dark-text);
  min-width: 20px;
  text-align: center;
}

.resumen {
  border-top: 1px solid var(--border-color);
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
  color: var(--secondary-color);
}

.btn-continuar {
  width: 100%;
  padding: 12px 20px;
  background-color: var(--success-color);
  color: var(--light-text);
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

/* Carrito Burbuja (Mobile) */
.carrito-burbuja {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--primary-color);
  color: var(--light-text);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
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
  background-color: var(--error-color);
  color: var(--light-text);
  border-radius: 50%;
  padding: 0.2em 0.5em;
  font-size: 0.6em;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

/* Carrito Ventana (Mobile Pop-up) */
.carrito-ventana {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Overlay oscuro */
  display: flex;
  justify-content: flex-end; /* Abre desde la derecha */
  align-items: flex-start;
  z-index: 1000;
  transition: transform 0.3s ease-out;
  transform: translateX(0);
}

.carrito-ventana.oculto {
  transform: translateX(100%); /* Desliza fuera de la vista */
}

.carrito-ventana-contenido {
  background-color: var(--card-bg);
  width: 85%; /* Ancho del pop-up en móvil */
  max-width: 400px; /* Ancho máximo para el pop-up */
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
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1em;
}

.carrito-ventana-header h2 {
  font-family: var(--font-primary);
  color: var(--primary-color);
  margin: 0;
  font-size: 1.8em;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8em;
  color: var(--secondary-color);
  cursor: pointer;
  padding: 0;
}

.close-btn:hover {
  color: var(--dark-accent);
}

.productosCarrito-popup {
  flex-grow: 1; /* Permite que el contenido del carrito se desplace si es largo */
  overflow-y: auto;
  padding-right: 10px; /* Para el scrollbar */
}

/* Media Queries para responsividad */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    padding: 1em;
    gap: 1.5em;
  }

  .productos-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); /* Más pequeñas en móvil */
    gap: 1em;
  }

  .producto-card {
    min-height: 250px;
  }

  .carrito-sidebar {
    display: none; /* Oculta la barra lateral en móvil */
  }

  .carrito-burbuja {
    display: flex; /* Muestra la burbuja en móvil */
  }
}

@media (max-width: 480px) {
  .main-container {
    padding: 0.5em;
  }
  .productos-grid {
    grid-template-columns: 1fr; /* Una columna en pantallas muy pequeñas */
    gap: 1em;
  }
  .producto-card {
    min-height: 220px;
  }
  .carrito-ventana-contenido {
    width: 95%; /* Más ancho en móviles muy pequeños */
  }
}
</style>