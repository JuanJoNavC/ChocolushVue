
<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import NavBarComponent from '../components/NavBarComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';

const API_BASE_URL = import.meta.env.VITE_CONNECTION_STRING;

const APIClienteDTO = `${API_BASE_URL}/api/DTOCliente/correo`;
const APICompra = `${API_BASE_URL}/api/integracion/compra`;
const APICompraInterna = `${API_BASE_URL}/api/integracion/confirmarCompraInterna`;
const APIUltimaFactura = `${API_BASE_URL}/api/Factura/ultimaFactura`;

const IVA_RATE = 0.12;

const router = useRouter();

const carrito = ref([]);
const numeroCuenta = ref('');
const usarDireccionRegistrada = ref(false);
const direccionEspecifica = ref('');
const clienteInfo = ref(null);

const subtotal = computed(() => {
  return carrito.value.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
});

const iva = computed(() => {
  return subtotal.value * IVA_RATE;
});

const total = computed(() => {
  return subtotal.value + iva.value;
});

onMounted(async () => {
  try {
    const storedCarrito = sessionStorage.getItem('carrito');
    if (storedCarrito) {
      carrito.value = JSON.parse(storedCarrito);
    } else {
      alert('Tu carrito está vacío. Redirigiendo a la página de productos.');
      router.push('/products');
      return;
    }

    let userEmailForAPI = null;

    const storedUserEmail = sessionStorage.getItem('userEmail');
    if (storedUserEmail) {
      userEmailForAPI = storedUserEmail;
      console.log('Email obtenido de "userEmail":', userEmailForAPI);
    } else {
      console.log('"userEmail" no encontrado en sessionStorage. Intentando con "cliente".');
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
      try {
        const response = await axios.get(`${APIClienteDTO}?correo=${userEmailForAPI}`);
        clienteInfo.value = response.data;
        console.log('Cliente obtenido de la API:', clienteInfo.value);
        if (!clienteInfo.value || !clienteInfo.value.cliCedula) {
            alert('No se pudo cargar la información completa del cliente. Por favor, verifica tu perfil o inicia sesión nuevamente.');
            sessionStorage.clear();
            router.push('/login');
            return;
        }
      } catch (apiError) {
        console.error('Error al obtener DTOCliente de la API:', apiError);
        alert('Hubo un error al obtener tu información de cliente. Por favor, intenta de nuevo o inicia sesión.');
        sessionStorage.clear();
        router.push('/login');
        return;
      }
    } else {
      alert('No se encontró información de usuario. Por favor, inicia sesión.');
      router.push('/login');
      return;
    }
  } catch (error) {
    console.error('Error general al cargar datos en PagosView:', error);
    alert('Hubo un error al cargar los datos del carrito o del cliente.');
    router.push('/ordenar');
  }
});

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

  if (!numeroCuenta.value.trim()) {
    alert('Por favor, ingresa el número de cuenta.');
    return;
  }

  if (!usarDireccionRegistrada.value && !direccionEspecifica.value.trim()) {
    alert('Por favor, ingresa una dirección de entrega si no deseas usar la registrada.');
    return;
  }

  try {
    const direccionFinal = usarDireccionRegistrada.value
      ? "Entrega en dirección registrada"
      : direccionEspecifica.value.trim();

    const compraPayload = {
      carrito: {
        productos: carrito.value.map(item => ({
          idProducto: item.id,
          cantidad: item.cantidad
        })),
      },
      direccion: direccionFinal,
      metodoPago: "Transferencia Bancaria",
      cliente: {
        cliCedula: clienteInfo.value.cliCedula,
        cliNombre: clienteInfo.value.cliNombre,
        cliApellido: clienteInfo.value.cliApellido,
        cliTelefono: clienteInfo.value.cliTelefono,
      }
    };

    console.log("Payload de compra:", compraPayload);

    const compraResponse = await axios.post(APICompra, compraPayload);
    console.log('Respuesta de compra:', compraResponse.data);
    alert('¡Estamos procesando su pago, la factura ya fue generada!');

    sessionStorage.removeItem('carrito');
    carrito.value = [];

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

    const infoCompraInterna = {
      idFactura: ultimaFacturaId,
      cuenta: numeroCuenta.value.trim(),
    };

    console.log('Información de compra interna:', infoCompraInterna);

    const confirmacionResponse = await axios.post(APICompraInterna, infoCompraInterna);
    console.log('Compra interna procesada exitosamente:', confirmacionResponse.data);
    alert('Compra interna pagada exitosamente. ¡Gracias por tu dinero!');

    router.push('/products');

  } catch (error) {
    console.error('Error en el proceso de pago:', error);
    let errorMessage = 'Hubo un error al procesar el pago. Por favor, intenta nuevamente.';
    if (error.response && error.response.data && error.response.data.Message) {
      errorMessage = 'Error: ' + error.response.data.Message;
    } else if (error.message) {
      errorMessage = 'Error: ' + error.message;
    }
    alert(errorMessage);
  }
}
</script>

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
              <button class="btnContinuar" type="submit">
                Pagar
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
    <FooterComponent />
  </div>
    
</template>


<style scoped>
/* Navbar */
.navbar-products {
  background-color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Espaciador para el navbar fijo */
.navbar-spacer {
  height: 6em; /* Adjust based on your navbar's actual height */
  width: 100%;
}

/* Contenedor principal de la página de pagos, envuelve todo el contenido después del navbar */
.pagos-page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #FFF2E0; /* Light Peach */
}

/* Estilos generales del contenedor de pago */
.pagos-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.mainPago {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
  width: 100%;
}

/* Sección de resumen del carrito */
.datosPago1,
.datosPago {
  background-color: #ffffff; /* White */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  flex: 1;
  min-width: 300px;
  box-sizing: border-box;
}

.datosPago1 h2,
.datosPago h2 {
  text-align: center;
  color: #A63700; /* Dark Orange/Brown */
  margin-bottom: 1.5rem;
}

.productosCarrito {
  border-top: 1px solid #e0e0e0; /* Light Gray */
  padding-top: 1rem;
  margin-top: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.carrito-vacio-mensaje {
  text-align: center;
  padding: 1rem;
  color: #666; /* Medium Gray */
  font-style: italic;
}

.producto-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed #f0f0f0; /* Very Light Gray */
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
  border: 1px solid #e0e0e0; /* Light Gray */
}

.producto-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.producto-nombre {
  font-weight: bold;
  color: #333333; /* Dark Text */
  margin-bottom: 0.2rem;
}

.producto-cantidad,
.producto-precio-unitario,
.producto-precio-total {
  font-size: 0.9em;
  color: #666; /* Medium Gray */
}

.producto-precio-total {
  font-weight: bold;
  color: #333333; /* Dark Text */
  margin-top: 0.5rem;
}

.resumen {
  border-top: 2px solid #A63700; /* Dark Orange/Brown */
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
  color: #A63700; /* Dark Orange/Brown */
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
  color: #333333; /* Dark Text */
}

.campoTextoPago {
  padding: 0.8rem;
  border: 1px solid #e0e0e0; /* Light Gray */
  border-radius: 5px;
  font-size: 1em;
  background-color: #f8f8f8; /* Very Light Gray */
  color: #333333; /* Dark Text */
}

.campoTextoPago::placeholder {
  color: #666; /* Medium Gray */
}

/* Estilo para el checkbox y su label */
input[type="checkbox"] {
  margin-right: 0.5rem;
  accent-color: #A63700; /* Dark Orange/Brown */
}

/* Botón continuar */
.centered-button-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.btnContinuar {
  background-color: #A63700; /* Dark Orange/Brown */
  color: black; /* Changed to black as original was 'var(--light-text)' which was white, but the example has black text on a dark button */
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
  letter-spacing: 0.05em;
}

.btnContinuar:hover {
  background-color: #8C4500; /* Darker Orange/Brown */
}

.btnContinuar:disabled {
  background-color: #cccccc; /* Light Gray */
  cursor: not-allowed;
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
/* These dark mode styles still rely on custom properties. If you want to remove ALL custom properties,
   you'd need to define explicit dark mode colors here too. For now, I'm assuming 'dark-mode' variables
   might be coming from a different global stylesheet. */
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