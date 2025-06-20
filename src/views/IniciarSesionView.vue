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
.navbar{
    background-color: white;
}

/* Tu CSS se mantiene EXACTAMENTE igual que en tu último envío. */
/* GENERAL LAYOUT */
.login-page-wrapper {
  display: flex;
  flex-direction: column; /* Apila el navbar y el contenido */
  min-height: 100vh; /* Asegura que la página ocupe al menos toda la altura de la ventana */
  background-color: #FFF2E0; /* El color de fondo que tenías */
}

/* Espaciador para el Navbar fijo */
.navbar-spacer {
  height: 6em; /* Altura del navbar (ajusta si es diferente) */
  width: 100%;
}

/* Contenedor principal de las dos columnas */
.login-content-area {
  flex-grow: 1; /* Permite que el contenido crezca y ocupe el espacio restante */
  display: flex; /* Habilita Flexbox para las columnas */
  justify-content: center; /* Centra el contenido horizontalmente */
  align-items: center; /* Centra el contenido verticalmente */
  padding: 2em; /* Espaciado alrededor del área de contenido */
  /* Asegura que el contenedor tenga una altura para que los hijos con height: 100% funcionen */
  min-height: calc(100vh - 6em - 4em); /* 100vh - altura_navbar - (padding_superior + padding_inferior) */
}

/* SECCIÓN MEDIA (IZQUIERDA) */
.login-media-section {
  flex: 1; /* Ocupa 1 parte del espacio */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1a1a1a; /* Fondo oscuro como en la imagen de referencia */
  /* min-height: 500px; */ /* Eliminado para permitir que la altura sea dinámica o del 100% */
  height: 100%; /* Asegura que ocupe el 100% de la altura de su contenedor padre flex */
  max-width: 50%; /* Limita el ancho en desktop */
  padding: 0; /* <--- CAMBIO: Eliminar padding para que la imagen ocupe TODO el espacio*/
  border-radius: 10px 0 0 10px; /* Bordes redondeados solo a la izquierda */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden; /* <--- CAMBIO: Oculta cualquier parte de la imagen que se desborde*/
}

.media-image {
  /* CAMBIOS CLAVE: Estas propiedades hacen que la imagen cubra completamente el área*/
  width: 100%; /* Ocupa el 100% del ancho del contenedor*/
  height: 100%; /* Ocupa el 100% del alto del contenedor*/
  object-fit: cover; /* <--- Hace que la imagen cubra el área, recortando si es necesario para evitar espacios vacíos*/
  display: block; /* Elimina espacio extra debajo de la imagen */
}

/* SECCIÓN DEL FORMULARIO (DERECHA) */
.login-form-section {
  flex: 1; /* Ocupa 1 parte del espacio */
  display: flex;
  flex-direction: column; /* Cambiado a column para centrar contenido verticalmente */
  justify-content: center; /* Centra el contenido verticalmente */
  align-items: center; /* Centra el contenido horizontalmente */
  background-color: #ffffff; /* Fondo blanco para el formulario */
  /* min-height: 500px; */ /* Eliminado para permitir que la altura sea dinámica o del 100% */
  height: 100%; /* Ocupa el 100% de la altura del .login-content-area */
  max-width: 50%; /* Limita el ancho en desktop */
  padding: 2em;
  border-radius: 0 10px 10px 0; /* Bordes redondeados solo a la derecha */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Contenedor interno del formulario para padding y sombra */
.login-container {
  width: 100%; /* El contenedor interno ocupa todo el espacio de su sección */
  max-width: 380px; /* Limita el ancho del formulario para no ser demasiado grande */
  padding: 30px;
  font-family: Arial, sans-serif;
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
    min-height: auto;
  }

  .login-media-section,
  .login-form-section {
    max-width: 100%;
    border-radius: 10px;
    height: auto;
    min-height: auto;
  }

  .login-media-section {
    min-height: 250px;
    margin-bottom: 2em;
    padding: 0; /* <--- CAMBIO: Asegurar que no hay padding aquí en móvil tampoco*/
  }

  .login-form-section {
    padding: 1.5em;
  }

  .login-container {
    padding: 20px;
  }
}
</style>
