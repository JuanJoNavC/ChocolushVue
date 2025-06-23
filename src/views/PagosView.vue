<template>
  <div class="pagos-page-wrapper">
    <NavBarComponent class="navbar-products" /> <div class="navbar-spacer"></div> <div class="pagos-container">
      <main class="mainPago">
        <section class="datosPago1">
          <h2>Resumen del Carrito</h2>
          <div class="productosCarrito">
            <div v-if="carrito.length === 0" class="carrito-vacio-mensaje">
              Tu carrito está vacío. Agrega productos para continuar.
            </div>
            <div v-for="item in carrito" :key="item.id" class="producto-item">
              <img :src="item.imagen" :alt="item.nombre" class="producto-imagen" />
              <div class="producto-info">
                <span class="producto-nombre">{{ item.nombre }}</span>
                <span class="producto-cantidad">Cantidad: {{ item.cantidad }}</span>
                <span class="producto-precio-unitario">P. Unitario: ${{ item.precio.toFixed(2) }}</span>
                <span class="producto-precio-total">Total: ${{ (item.precio * item.cantidad).toFixed(2) }}</span>
              </div>
            </div>
          </div>
          <div class="resumen">
            <div class="subtotal">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="iva">
              <span>IVA ({{ (IVA_RATE * 100).toFixed(0) }}%)</span>
              <span>${{ iva.toFixed(2) }}</span>
            </div>
            <div class="total">
              <span>Total</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>
          </div>
        </section>

        <section class="datosPago">
          <h2 class="tituloDatosPago">Datos de Pago</h2>
          <form @submit.prevent="procesarPago">
            <div class="textoPago">
              <label for="numero-cuenta">Número de Cuenta</label>
              <input
                class="campoTextoPago"
                type="text"
                id="numero-cuenta"
                v-model="numeroCuenta"
                inputmode="numeric"
                placeholder="Ingrese la cuenta con la que desea pagar"
                required
              />
            </div>
            <div class="textoPago">
              <label for="direccion-entrega-checkbox">
                <input
                  type="checkbox"
                  id="direccion-entrega-checkbox"
                  v-model="usarDireccionRegistrada"
                />
                Usar dirección de entrega registrada
              </label>
            </div>
            <div v-if="!usarDireccionRegistrada" id="direccion-otros" class="textoPago">
              <label for="direccion">Dirección de entrega:</label>
              <input
                class="campoTextoPago"
                type="text"
                id="direccion"
                v-model="direccionEspecifica"
                placeholder="Ingresa tu dirección de entrega"
                :required="!usarDireccionRegistrada"
              />
            </div>

            <div class="centered-button-container">
              <button class="btnContinuar" type="submit" :disabled="isLoading">
                {{ isLoading ? 'Procesando...' : 'Pagar' }}
              </button>
            </div>
          </form>
        </section>
      </main>

      <div id="loader" class="wrapper" v-if="isLoading">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="shadow"></div>
        <div class="shadow"></div>
        <div class="shadow"></div>
      </div>
    </div>
    <FooterComponent /> </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import NavBarComponent from '../components/NavBarComponent.vue'; // Asegúrate de que la ruta sea correcta
import FooterComponent from '../components/FooterComponent.vue'; // Asegúrate de que la ruta sea correcta

// Constantes de API (pueden ir en un archivo de configuración o variables de entorno)
const API_BASE_URL = import.meta.env.VITE_CONNECTION_STRING;
// Removido APIBanco, ya que la validación se hará en la API interna.

const APIClienteDTO = `${API_BASE_URL}/api/DTOCliente/correo`;
const APICompra = `${API_BASE_URL}/api/integracion/compra`;
const APICompraInterna = `${API_BASE_URL}/api/integracion/confirmarCompraInterna`;
const APIUltimaFactura = `${API_BASE_URL}/api/Factura/ultimaFactura`;

const IVA_RATE = 0.12; // 12% de IVA

const router = useRouter();

// Estados reactivos
const carrito = ref([]);
const numeroCuenta = ref('');
const usarDireccionRegistrada = ref(false);
const direccionEspecifica = ref('');
const clienteInfo = ref(null);
const isLoading = ref(false);

// Propiedades computadas para el resumen del carrito
const subtotal = computed(() => {
  return carrito.value.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
});

const iva = computed(() => {
  return subtotal.value * IVA_RATE;
});

const total = computed(() => {
  return subtotal.value + iva.value;
});

// Cargar el carrito y la información del cliente al montar el componente
onMounted(async () => {
  try {
    const storedCarrito = sessionStorage.getItem('carrito');
    if (storedCarrito) {
      carrito.value = JSON.parse(storedCarrito);
    } else {
      alert('Tu carrito está vacío. Redirigiendo a la página de productos.');
      router.push('/products'); // Redirigir si el carrito está vacío
      return;
    }

    let userEmailForAPI = null;

    // Intento 1: Obtener el email directamente de 'userEmail'
    const storedUserEmail = sessionStorage.getItem('userEmail');
    if (storedUserEmail) {
      userEmailForAPI = storedUserEmail;
      console.log('Email obtenido de "userEmail":', userEmailForAPI);
    } else {
      console.log('"userEmail" no encontrado en sessionStorage. Intentando con "cliente".');
      // Intento 2: Obtener el email del objeto 'cliente'
      const storedCliente = sessionStorage.getItem('cliente');
      if (storedCliente) {
        try {
          const clienteData = JSON.parse(storedCliente);
          if (clienteData.email) {
            userEmailForAPI = clienteData.email;
            console.log('Email obtenido de "cliente":', userEmailForAPI);
          } else {
            console.warn("La clave 'cliente' en sessionStorage no contiene una propiedad 'email'.");
          }
        } catch (e) {
          console.error("Error al parsear 'cliente' desde sessionStorage:", e);
        }
      } else {
        console.warn("La clave 'cliente' no se encontró en sessionStorage.");
      }
    }

    if (userEmailForAPI) {
      isLoading.value = true;
      try {
        const response = await axios.get(`${APIClienteDTO}?correo=${userEmailForAPI}`);
        clienteInfo.value = response.data;
        console.log('Cliente obtenido de la API:', clienteInfo.value);
        if (!clienteInfo.value || !clienteInfo.value.cliCedula) {
            // Si la API devuelve un cliente vacío o incompleto
            alert('No se pudo cargar la información completa del cliente. Por favor, verifica tu perfil o inicia sesión nuevamente.');
            sessionStorage.clear(); // Limpiar por si acaso
            router.push('/login');
            return;
        }
      } catch (apiError) {
        console.error('Error al obtener DTOCliente de la API:', apiError);
        alert('Hubo un error al obtener tu información de cliente. Por favor, intenta de nuevo o inicia sesión.');
        sessionStorage.clear(); // Limpiar por si acaso
        router.push('/login');
        return;
      }
    } else {
      alert('No se encontró información de usuario. Por favor, inicia sesión.');
      router.push('/login'); // Redirigir a login si no se pudo obtener ningún email
      return;
    }
  } catch (error) {
    console.error('Error general al cargar datos en PagosView:', error);
    alert('Hubo un error al cargar los datos del carrito o del cliente.');
    router.push('/ordenar'); // Redirigir a productos en caso de error
  } finally {
    isLoading.value = false;
  }
});

// La función validarCuentaBancaria ya no es necesaria aquí.
/*
async function validarCuentaBancaria(cuenta) {
  try {
    const response = await axios.get(`${APIBanco}/${cuenta}`);
    return response.data; // true si es válida, false si no
  } catch (error) {
    console.error('Error al validar la cuenta bancaria:', error);
    alert('Error al conectar con el banco. Por favor, intenta nuevamente.');
    return false;
  }
}
*/

// Función principal para procesar el pago
async function procesarPago() {
  if (carrito.value.length === 0) {
    alert('El carrito está vacío. Por favor, agrega productos antes de continuar.');
    router.push('/ordenar');
    return;
  }

  if (!clienteInfo.value) {
    alert('No se pudo cargar la información del cliente. Por favor, recarga la página o inicia sesión.');
    return;
  }

  // SOLO VALIDAR QUE EL CAMPO NO ESTÉ VACÍO
  if (!numeroCuenta.value.trim()) {
    alert('Por favor, ingresa el número de cuenta.');
    return;
  }

  if (!usarDireccionRegistrada.value && !direccionEspecifica.value.trim()) {
    alert('Por favor, ingresa una dirección de entrega si no deseas usar la registrada.');
    return;
  }

  isLoading.value = true;
  try {
    // 1. La validación de la cuenta bancaria ahora se asume que se realizará en la APICompraInterna.
    //    No se hace una llamada directa a APIBanco desde el frontend.

    // 2. Preparar los datos para la compra principal
    const direccionFinal = usarDireccionRegistrada.value
      ? "Entrega en dirección registrada" // Asume que el backend inferirá la dirección del cliente logueado
      : direccionEspecifica.value.trim();

    const compraPayload = {
      carrito: {
        productos: carrito.value.map(item => ({
          idProducto: item.id,
          cantidad: item.cantidad
        })),
      },
      direccion: direccionFinal,
      metodoPago: "Transferencia Bancaria", // O puedes ofrecer más opciones
      cliente: {
        cliCedula: clienteInfo.value.cliCedula,
        cliNombre: clienteInfo.value.cliNombre,
        cliApellido: clienteInfo.value.cliApellido,
        cliTelefono: clienteInfo.value.cliTelefono,
        // Asegúrate que tu backend pueda identificar al cliente con estos datos,
        // o si necesita el email, incluirlo aquí si lo tienes disponible en clienteInfo.value
      }
    };

    console.log("Payload de compra:", compraPayload);

    // 3. Enviar la compra a tu backend
    const compraResponse = await axios.post(APICompra, compraPayload);
    console.log('Respuesta de compra:', compraResponse.data);
    alert('¡Estamos procesando su pago, la factura ya fue generada!');

    // Limpiar el carrito después de una compra exitosa (importante)
    sessionStorage.removeItem('carrito');
    carrito.value = []; // Vaciar el carrito reactivo

    // 4. Obtener la última factura
    let ultimaFacturaId;
    try {
      const ultimaFacturaResponse = await axios.get(APIUltimaFactura);
      ultimaFacturaId = ultimaFacturaResponse.data;
      console.log('Última factura obtenida:', ultimaFacturaId);
    } catch (error) {
      console.error('Error al obtener la última factura:', error);
      alert('Compra generada pero hubo un error al obtener el ID de la factura. Contacta a soporte.');
      return;
    }

    // 5. Confirmar la compra interna (pago final)
    const infoCompraInterna = {
      idFactura: ultimaFacturaId,
      cuenta: numeroCuenta.value.trim(), // Se envía la cuenta como está.
    };

    console.log('Información de compra interna:', infoCompraInterna);

    const confirmacionResponse = await axios.post(APICompraInterna, infoCompraInterna);
    console.log('Compra interna procesada exitosamente:', confirmacionResponse.data);
    alert('Compra interna pagada exitosamente. ¡Gracias por tu dinero!');

    // Redirigir al usuario a una página de confirmación o al inicio
    router.push('/products'); // O a la home: router.push('/')

  } catch (error) {
    console.error('Error en el proceso de pago:', error);
    let errorMessage = 'Hubo un error al procesar el pago. Por favor, intenta nuevamente.';
    if (error.response && error.response.data && error.response.data.Message) {
      errorMessage = 'Error: ' + error.response.data.Message;
    } else if (error.message) {
      errorMessage = 'Error: ' + error.message;
    }
    alert(errorMessage);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Colores y Fuentes base (Asegúrate de que estas variables estén definidas globalmente en tu app.css o similar) */
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

  /* Agregadas para consistencia con tu CSS */
  --background-color: var(--main-bg-color);
  --text-color: var(--dark-text);
  --text-color-light: #666;
  --card-background-color: var(--card-bg);
  --border-color-light: #f0f0f0;
  --input-background-color: #f8f8f8;
  --primary-dark-color: var(--button-hover);
  --disabled-button-color: #cccccc;
  --navbar-height: 6em; /* Ajusta esto si tu navbar tiene una altura diferente, ¡importante! */


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

/* Espaciador para el navbar fijo */
.navbar-spacer {
  height: var(--navbar-height); /* Ajusta según la altura real de tu navbar */
  width: 100%;
}

/* Contenedor principal de la página de pagos, envuelve todo el contenido después del navbar */
.pagos-page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--main-bg-color);
}

/* Estilos generales del contenedor de pago */
.pagos-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Permite que el contenido ocupe el espacio restante */
}

.mainPago {
  display: flex;
  flex-wrap: wrap; /* Permite que las secciones se envuelvan en pantallas pequeñas */
  justify-content: center;
  gap: 2rem; /* Espacio entre las secciones */
  padding: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
  width: 100%;
}

/* Sección de resumen del carrito */
.datosPago1,
.datosPago {
  background-color: var(--card-background-color); /* Usar variable CSS global */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  flex: 1; /* Permite que las secciones ocupen espacio equitativamente */
  min-width: 300px; /* Ancho mínimo para evitar que se pongan demasiado pequeños */
  box-sizing: border-box; /* Incluir padding en el ancho */
}

.datosPago1 h2,
.datosPago h2 {
  text-align: center;
  color: var(--primary-color); /* Usar variable CSS global */
  margin-bottom: 1.5rem;
  font-family: 'DynaPuff', cursive;
}

.productosCarrito {
  border-top: 1px solid var(--border-color); /* Usar variable CSS global */
  padding-top: 1rem;
  margin-top: 1rem;
  max-height: 400px; /* Altura máxima para el scroll si hay muchos productos */
  overflow-y: auto;
}

.carrito-vacio-mensaje {
  text-align: center;
  padding: 1rem;
  color: var(--text-color-light); /* Usar variable CSS global */
  font-style: italic;
}

.producto-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--border-color-light); /* Usar variable CSS global */
}

.producto-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.producto-imagen {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 1rem;
  border: 1px solid var(--border-color); /* Usar variable CSS global */
}

.producto-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.producto-nombre {
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 0.2rem;
}

.producto-cantidad,
.producto-precio-unitario,
.producto-precio-total {
  font-size: 0.9em;
  color: var(--text-color-light);
}

.producto-precio-total {
  font-weight: bold;
  color: var(--text-color);
  margin-top: 0.5rem;
}

.resumen {
  border-top: 2px solid var(--primary-color);
  padding-top: 1.5rem;
  margin-top: 1.5rem;
}

.resumen > div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.7rem;
}

.resumen .total {
  font-weight: bold;
  font-size: 1.2em;
  color: var(--primary-color);
}

/* Formulario de pago */
.datosPago form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.textoPago {
  display: flex;
  flex-direction: column;
}

.textoPago label {
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--text-color);
}

.campoTextoPago {
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  font-size: 1em;
  background-color: var(--input-background-color); /* Usar variable CSS global */
  color: var(--text-color);
}

.campoTextoPago::placeholder {
  color: var(--text-color-light);
}

/* Estilo para el checkbox y su label */
input[type="checkbox"] {
  margin-right: 0.5rem;
  accent-color: var(--primary-color); /* Color del checkbox en algunos navegadores */
}

/* Botón continuar */
.centered-button-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.btnContinuar {
  background-color: var(--primary-color);
  color: black;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.05em;
}

.btnContinuar:hover {
  background-color: var(--primary-dark-color); /* Usar variable CSS global */
}

.btnContinuar:disabled {
  background-color: var(--disabled-button-color); /* Usar variable CSS global */
  cursor: not-allowed;
}

/* Estilos del Loader */
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.circle {
  width: 20px;
  height: 20px;
  position: absolute;
  border-radius: 50%;
  background-color: #fff;
  left: 15%;
  transform-origin: 50%;
  animation: circle-loader 0.5s alternate infinite ease;
}

@keyframes circle-loader {
  0% {
    top: 60px;
    height: 10px;
    border-radius: 50px 50px 50px 50px;
    transform: scaleX(1.7);
  }
  40% {
    height: 20px;
    border-radius: 50%;
    transform: scaleX(1);
  }
  100% {
    top: 0%;
  }
}

.circle:nth-child(2) {
  left: 45%;
  animation-delay: 0.2s;
}

.circle:nth-child(3) {
  left: auto;
  right: 15%;
  animation-delay: 0.3s;
}

.shadow {
  width: 20px;
  height: 4px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 60px;
  transform-origin: 50%;
  z-index: -1;
  animation: shadow-loader 0.5s alternate infinite ease;
}

@keyframes shadow-loader {
  0% {
    transform: scaleX(1.5);
  }
  40% {
    transform: scaleX(1);
    opacity: 0.7;
  }
  100% {
    transform: scaleX(0.2);
    opacity: 0.4;
  }
}

.shadow:nth-child(4) {
  left: 15%;
  animation-delay: 0.2s;
}

.shadow:nth-child(5) {
  left: 45%;
  animation-delay: 0.3s;
}

.shadow:nth-child(6) {
  left: auto;
  right: 15%;
  animation-delay: 0.4s;
}

/* Media Queries para responsividad */
@media (max-width: 768px) {
  .mainPago {
    flex-direction: column;
    padding: 1rem;
    margin: 1rem auto;
  }

  .datosPago1,
  .datosPago {
    width: 100%;
    margin-bottom: 1rem;
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .producto-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .producto-imagen {
    margin-bottom: 0.5rem;
    margin-right: 0;
  }

  .producto-info {
    width: 100%;
  }

  .resumen span {
    font-size: 0.9em;
  }

  .btnContinuar {
    padding: 0.6rem 1.5rem;
    font-size: 1em;
  }
}

/* Estilos para modo oscuro (se asumiría que se controlan por una clase en <body> o <html>) */
body.dark-mode .pagos-container {
  background-color: var(--dark-background-color);
  color: var(--dark-text-color);
}

body.dark-mode .datosPago1,
body.dark-mode .datosPago {
  background-color: var(--dark-card-background-color);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

body.dark-mode .datosPago1 h2,
body.dark-mode .datosPago h2 {
  color: var(--dark-primary-color);
}

body.dark-mode .producto-imagen {
  border-color: var(--dark-border-color);
}

body.dark-mode .producto-item {
  border-bottom-color: var(--dark-border-color-light);
}

body.dark-mode .campoTextoPago {
  background-color: var(--dark-input-background-color);
  border-color: var(--dark-border-color);
  color: var(--dark-text-color);
}

body.dark-mode .campoTextoPago::placeholder {
  color: var(--dark-text-color-light);
}

body.dark-mode .btnContinuar {
  background-color: var(--dark-primary-color);
}

body.dark-mode .btnContinuar:hover {
  background-color: var(--dark-primary-dark-color);
}

body.dark-mode .btnContinuar:disabled {
  background-color: var(--dark-disabled-button-color);
}
</style>