<template>
  <div class="login-page-wrapper">
    <NavBarComponent :heroElementRef="heroSectionRef" class="navbar"/>
    <div class="navbar-spacer"></div>

    <div class="login-content-area">
      <div class="login-media-section">
        <img src="/src/assets/images/bannerimg2.png" alt="Personaje Caminando" class="media-image">
      </div>

      <div class="login-form-section">
        <div class="login-container">
          <h2 class="login-title">Iniciar Sesión</h2>
          <form @submit.prevent="login" class="login-form">
            <div class="form-group">
              <label for="email" class="form-label">Correo electrónico:</label>
              <input type="email" id="email" v-model="email" required class="form-input" placeholder="tu.correo@ejemplo.com">
            </div>
            <div class="form-group">
              <label for="password" class="form-label">Contraseña:</label>
              <input type="password" id="password" v-model="password" required class="form-input" placeholder="••••••••">
            </div>
            <button type="submit" class="login-button">Iniciar Sesión</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
          </form>

          <p class="signup-text">¿No tienes cuenta? <router-link to="/registro" class="signup-link">Regístrate</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavBarComponent from '../components/NavBarComponent.vue';
import axios from 'axios';

const router = useRouter();

const API_BASE_URL = import.meta.env.VITE_CONNECTION_STRING;

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const heroSectionRef = ref(null);

onMounted(() => {
  // *** MANTENEMOS COMENTADO O ELIMINADO EL CÓDIGO DE REDIRECCIÓN AQUÍ ***
  // De esta forma, el usuario SIEMPRE podrá ver el formulario de login.
  // const userEmail = sessionStorage.getItem('userEmail');
  // if (userEmail) {
  //   console.log(`Usuario ya logueado (${userEmail}). No se redirige, se permite re-login.`);
  // }

  // Opcional: Podrías cargar el email actual si hay una sesión activa, para conveniencia
  // if (sessionStorage.getItem('isAuthenticated') === 'true') {
  //   email.value = sessionStorage.getItem('userEmail');
  //   // Puedes incluso mostrar un mensaje indicando que ya hay una sesión iniciada
  //   // errorMessage.value = `Ya has iniciado sesión como ${email.value}. Puedes iniciar sesión con otra cuenta.`;
  // }
});

const login = async () => {
  errorMessage.value = '';
  try {
    console.log('Datos de usuario ingresados:', { email: email.value, password: password.value });

    // Realiza la solicitud GET a tu API para obtener la contraseña
    const response = await axios.get(`${API_BASE_URL}/api/cliente/correo?correo=${email.value}`);
    console.log('Respuesta completa de la API:', response);
    
    // Asume que response.data contiene directamente la contraseña como un string (ej. "admin")
    const storedPasswordFromApi = response.data; 
    console.log('Contraseña esperada de la API (para depuración):', storedPasswordFromApi);

    // Validación de credenciales
    if (password.value === storedPasswordFromApi) {
      alert('¡Inicio de sesión exitoso!');
      
      // **** Importante: Si un usuario inicia sesión con nuevas credenciales,
      // **** simplemente sobrescribimos la información en sessionStorage.
      // No necesitamos limpiar explícitamente los ítems antes de establecerlos de nuevo,
      // porque setItem() ya sobrescribe el valor si la clave existe.
      sessionStorage.setItem('userEmail', email.value); // Guarda el correo del usuario
      sessionStorage.setItem('isAuthenticated', 'true'); // Opcional: un flag booleano

      // Lógica de Redirección Condicional
      if (email.value === 'admin@gmail.com' && password.value === 'admin') {
        sessionStorage.setItem('userRole', 'admin'); // Guarda el rol si es admin
        router.push('/admin/clientes'); // Redirige a la ruta de administración
      } else {
        sessionStorage.setItem('userRole', 'client'); // Guarda el rol si es cliente normal
        router.push('/'); // Redirige a la página principal por defecto
      }
      
    } else {
      errorMessage.value = 'Correo electrónico o contraseña incorrectos.';
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    if (error.response) {
      console.error('Datos del error de respuesta de la API:', error.response.data);
      console.error('Estado del error de respuesta de la API:', error.response.status);
      if (error.response.status === 404) {
        errorMessage.value = 'El correo electrónico no está registrado.';
      } else {
        errorMessage.value = 'Hubo un problema al intentar iniciar sesión. Inténtalo de nuevo.';
      }
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request);
      errorMessage.value = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else {
      console.error('Error al configurar la solicitud:', error.message);
      errorMessage.value = 'Error desconocido al intentar iniciar sesión.';
    }
  }
};
</script>

<style scoped>
/* Ensure HTML and body take full height */
html, body {
    height: 100%;
    margin: 0;
    padding: 0;
}

.navbar{
    background-color: white;
    /* If your navbar is fixed, you'll need its height here */
    position: fixed; /* Assuming your NavBarComponent is fixed */
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
}

/* GENERAL LAYOUT */
.login-page-wrapper {
    display: flex;
    flex-direction: column; /* Stacks the navbar and content */
    height: 100vh; /* Ensures the page occupies at least the entire viewport height */
    background-color: #FFF2E0; /* Your background color */
    /* If navbar is fixed, pad-top the wrapper by navbar height */
    padding-top: 6em; /* Adjust this to match your NavBarComponent's height */
    box-sizing: border-box; /* Include padding in the element's total width and height */
}

/* This spacer is no longer needed if .login-page-wrapper has padding-top */
.navbar-spacer {
    display: none; /* Hide the spacer as padding-top handles the space */
}

/* Main container for the two columns */
.login-content-area {
    flex-grow: 1; /* Allows content to grow and occupy remaining space */
    display: flex; /* Enables Flexbox for columns */
    justify-content: center; /* Centers content horizontally */
    align-items: stretch; /* <--- KEY CHANGE: Makes children stretch to fill height */
    /* Remove min-height here; it's handled by flex-grow */
}

/* MEDIA SECTION (LEFT) */
.login-media-section {
    flex: 1; /* Occupies 1 part of the space */
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1a1a1a; /* Dark background as in the reference image */
    height: 100%; /* Ensures it occupies 100% of its flex parent's height */
    max-width: 50%; /* Limits width on desktop */
    padding: 0;
    border-radius: 10px 0 0 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

.media-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* FORM SECTION (RIGHT) */
.login-form-section {
    flex: 1; /* Occupies 1 part of the space */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    height: 100%; /* Occupies 100% of the .login-content-area's height */
    width: 50%;
    border-radius: 0 10px 10px 0;
}

/* Inner form container for padding and shadow */
.login-container {
    width: 100%;
    max-width: 380px;
    padding: 20px;
    font-family: Arial, sans-serif;
    height: 100%;
}

.login-title {
    text-align: center;
    color: #333;
    margin-bottom: 25px;
    font-size: 2em;
    font-weight: bold;
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: bold;
}

.form-input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    box-sizing: border-box;
    background-color: #f8f8f8;
}

.form-input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 0.15rem rgba(0, 123, 255, 0.2);
}

.login-button {
    width: 100%;
    padding: 12px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-weight: bold;
    margin-top: 15px;
}

.login-button:hover {
    background-color: #45a049;
}

.error-message {
    color: #dc3545;
    text-align: center;
    margin-top: 15px;
    font-size: 14px;
}

.forgot-password {
    display: block;
    text-align: right;
    margin-top: 10px;
    color: #007bff;
    text-decoration: none;
    font-size: 0.9em;
    transition: color 0.3s ease;
}

.forgot-password:hover {
    color: #0056b3;
    text-decoration: underline;
}

.signup-text {
    text-align: center;
    margin-top: 25px;
    color: #666;
    font-size: 0.95em;
}

.signup-link {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
}

.signup-link:hover {
    text-decoration: underline;
}

/* RESPONSIVE DESIGN */
@media (max-width: 900px) {
    .login-content-area {
        flex-direction: column;
        padding: 1em;
        /* min-height: auto; This is okay, but handled by children height adjustments */
        align-items: center; /* Center items when stacked */
    }

    .login-media-section,
    .login-form-section {
        max-width: 100%;
        border-radius: 10px; /* Full radius on mobile */
        height: auto; /* Allow height to be determined by content on mobile */
        /* min-height: auto; This is redundant */
    }

    .login-media-section {
        min-height: 250px; /* Still give it a minimum height to be visible */
        margin-bottom: 2em;
    }

    .login-form-section {
        padding: 1.5em;
    }

    .login-container {
        padding: 20px;
    }
}
</style>