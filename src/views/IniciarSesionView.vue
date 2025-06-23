<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavBarComponent from '../components/NavBarComponent.vue';
import axios from 'axios';
import FooterComponent from '../components/FooterComponent.vue';

const router = useRouter();

const API_BASE_URL = import.meta.env.VITE_CONNECTION_STRING;

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const heroSectionRef = ref(null);

onMounted(() => {
});

const login = async () => {
  errorMessage.value = '';
  try {
    console.log('Datos de usuario ingresados:', { email: email.value, password: password.value });

    const response = await axios.get(`${API_BASE_URL}/api/cliente/correo?correo=${email.value}`);
    console.log('Respuesta completa de la API:', response);
    
    const storedPasswordFromApi = response.data; 
    console.log('Contraseña esperada de la API (para depuración):', storedPasswordFromApi);

    if (password.value === storedPasswordFromApi) {
      alert('¡Inicio de sesión exitoso!');
      
      sessionStorage.setItem('userEmail', email.value); 
      sessionStorage.setItem('isAuthenticated', 'true'); 

      if (email.value === 'admin@gmail.com' && password.value === 'admin') {
        sessionStorage.setItem('userRole', 'admin'); 
        router.push('/admin/clientes'); 
      } else {
        sessionStorage.setItem('userRole', 'client'); 
        router.push('/'); 
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

<template>
  <div class="login-page-wrapper">
    <NavBarComponent class="navbar"/>
    <div class="navbar-spacer"></div>

    <div class="login-content-area">
      <div class="login-media-section">
        <img src="/src/assets/images/LogInImg2.webp" alt="Personaje Caminando" class="media-image">
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
          </form>

          <p class="signup-text">¿No tienes cuenta? <router-link to="/registro" class="signup-link">Regístrate</router-link></p>
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
  

  
</template>



<style scoped>

.navbar{
    background-color: white;
    position: fixed; 
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
}

/* GENERAL LAYOUT */
.login-page-wrapper {
    display: flex;
    flex-direction: column; 
    height: 100vh; 
    background-color: #FFF2E0; /* Using background color from index */
    padding-top: 6em; 
    box-sizing: border-box; 
}

.navbar-spacer {
    display: none; 
}

/* Main container for the two columns */
.login-content-area {
    flex-grow: 1; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
}

/* MEDIA SECTION (LEFT) */
.login-media-section {
    flex: 1; 
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #664400; /* Darker brown from index for media section background */
    height: 100%; 
    max-width: 50%; 
    padding: 0;
    overflow: hidden;
}



.media-image {
    height: 800px;
    width: 100%;
    object-fit: cover;
    display: block;
}

/* FORM SECTION (RIGHT) */
.login-form-section {
    flex: 1; 
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    height: 100%; 
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
    align-content: center;
}

.login-title {
    text-align: center;
    color: var(--main-color); /* Dark orange/brown for title */
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
    color: #664400; /* Medium brown for labels */
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
    border-color: #A65300; /* Darker orange/brown for focus */
    outline: none;
    box-shadow: 0 0 0 0.15rem rgba(166, 83, 0, 0.2); /* Soft shadow with theme color */
}

.login-button {
    width: 100%;
    padding: 12px;
    background-color: #A65300; /* Darker orange/brown for button */
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
    background-color: #8C4500; /* Darker hover color */
}

.error-message {
    color: #A60000; /* Darker red for error messages */
    text-align: center;
    margin-top: 15px;
    font-size: 14px;
}

.forgot-password {
    display: block;
    text-align: right;
    margin-top: 10px;
    color: #A63700; /* Dark orange/brown for links */
    text-decoration: none;
    font-size: 0.9em;
    transition: color 0.3s ease;
}

.forgot-password:hover {
    color: #8C4500; /* Darker hover color for links */
    text-decoration: underline;
}

.signup-text {
    text-align: center;
    margin-top: 25px;
    color: #664400; /* Medium brown for text */
    font-size: 0.95em;
}

.signup-link {
    color: #A63700; /* Dark orange/brown for signup link */
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
    padding: 0;
    align-items: stretch; 
    height: auto; 
  }

  .login-media-section,
  .login-form-section {
    max-width: 100%;
    width: 100%;
    border-radius: 0; 
    height: 50vh; 
    flex: none;
  }

  .login-media-section {
    min-height: 250px;
    height: 50vh;
    margin-bottom: 0;
  }

  .login-form-section {
    padding: 1.5em;
    height: 50vh;
    display: flex;
    justify-content: center;
  }

  .login-container {
    max-width: 100%;
    padding: 20px;
    height: auto;
    margin-top: 5em;
  }
}
</style>