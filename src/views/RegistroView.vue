<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Importa solo el componente de navegación
import NavBarComponent from '../components/NavBarComponent.vue';

const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_CONNECTION_STRING;

const client = ref({
  CLI_NOMBRE: '',
  CLI_APELLIDO: '',
  CLI_FECHANACIMIENTO: '', // Formato YYYY-MM-DD
  CLI_CORREO: '',
  CLI_SEXO: '', // 'M', 'F', 'O'
  CLI_DIRECCION: '',
  CLI_CLAVE: '',
  CLI_CEDULA: '',
  CLI_TELEFONO: '',
  CLI_SECTOR: ''
});

const confirmPassword = ref(''); // Campo para confirmar la contraseña
const formMessage = ref({
  type: '', // 'success' o 'error'
  text: ''
});
const isSubmitting = ref(false);

// La validación de cédula se mantiene en JS porque es compleja
const validateCedula = (cedula) => {
  if (!/^\d{10}$/.test(cedula)) {
    return 'La cédula debe tener 10 dígitos.';
  }
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let digito = parseInt(cedula[i]) * coeficientes[i];
    if (digito >= 10) {
      digito -= 9;
    }
    suma += digito;
  }
  const ultimoDigito = parseInt(cedula[9]);
  const digitoVerificador = (suma % 10 === 0) ? 0 : 10 - (suma % 10);
  if (digitoVerificador !== ultimoDigito) {
    return 'Cédula inválida.';
  }
  return '';
};

// La validación de edad se mantiene en JS ya que HTML5 no tiene un atributo directo para "mayor de X años"
const validateAge = (dob) => {
  if (!dob) return 'La fecha de nacimiento es requerida.';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age < 18) {
    return 'Debes ser mayor de 18 años para registrarte.';
  }
  return '';
};

const registerClient = async () => {
  isSubmitting.value = true;
  formMessage.value = { type: '', text: '' };

  let validationErrors = [];

  const cedulaError = validateCedula(client.value.CLI_CEDULA);
  if (cedulaError) validationErrors.push(cedulaError);

  const ageError = validateAge(client.value.CLI_FECHANACIMIENTO);
  if (ageError) validationErrors.push(ageError);

  if (client.value.CLI_CLAVE !== confirmPassword.value) {
    validationErrors.push('Las contraseñas no coinciden.');
  }

  if (validationErrors.length > 0) {
    formMessage.value = { type: 'error', text: validationErrors.join('<br>') };
    isSubmitting.value = false;
    return;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/Cliente`, client.value);

    if (response.status === 200 || response.status === 201) {
      formMessage.value = { type: 'success', text: '¡Registro exitoso! Ahora puedes iniciar sesión.' };
      setTimeout(() => {
        router.push('/iniciarSesion');
      }, 2000);
    }
  } catch (err) {
    console.error('Error al registrar cliente:', err);

    let errorMessage = 'No se pudo completar el registro.';
    if (err.response && err.response.data) {
      if (typeof err.response.data === 'string') {
        errorMessage += ' ' + err.response.data;
      } else if (err.response.data.Message) {
        errorMessage += ' ' + err.response.data.Message;
      } else if (typeof err.response.data === 'object') {
        errorMessage += ' Detalles: ' + JSON.stringify(err.response.data);
      }
    } else if (err.message) {
      errorMessage += ' ' + err.message;
    }
    
    formMessage.value = { type: 'error', text: errorMessage };
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="registration-page-wrapper">
    <NavBarComponent class="navbar"/>
    <div class="navbar-spacer"></div> <div class="registration-content-area">

      <div class="registration-form-section">
        <div class="registration-container">
          <h2 class="registration-title">Registro de Cliente</h2>
          <form @submit.prevent="registerClient" class="registration-form-grid">
            <div class="form-group">
              <label for="nombre" class="form-label">Nombre:</label>
              <input
                type="text"
                id="nombre"
                v-model="client.CLI_NOMBRE"
                required
                maxlength="30"
                class="form-control"
                title="Ingresa tu nombre (máx. 30 caracteres)"
              >
            </div>
            <div class="form-group">
              <label for="apellido" class="form-label">Apellido:</label>
              <input
                type="text"
                id="apellido"
                v-model="client.CLI_APELLIDO"
                required
                maxlength="30"
                class="form-control"
                title="Ingresa tu apellido (máx. 30 caracteres)"
              >
            </div>
            <div class="form-group">
              <label for="cedula" class="form-label">Cédula:</label>
              <input
                type="text"
                id="cedula"
                v-model="client.CLI_CEDULA"
                required
                pattern="^\d{10}$"
                title="La cédula debe tener 10 dígitos numéricos"
                maxlength="10"
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="correo" class="form-label">Correo:</label>
              <input
                type="email"
                id="correo"
                v-model="client.CLI_CORREO"
                required
                maxlength="50"
                class="form-control"
                title="Ingresa un correo electrónico válido (máx. 50 caracteres)"
              >
            </div>
            <div class="form-group">
              <label for="telefono" class="form-label">Teléfono:</label>
              <input
                type="tel"
                id="telefono"
                v-model="client.CLI_TELEFONO"
                required
                maxlength="15"
                pattern="^\d{7,15}$"
                title="Ingresa tu número de teléfono (7-15 dígitos)"
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="direccion" class="form-label">Dirección:</label>
              <input
                type="text"
                id="direccion"
                v-model="client.CLI_DIRECCION"
                required
                maxlength="80"
                class="form-control"
                title="Ingresa tu dirección (máx. 80 caracteres)"
              >
            </div>
            <div class="form-group">
              <label for="sector" class="form-label">Sector:</label>
              <input
                type="text"
                id="sector"
                v-model="client.CLI_SECTOR"
                required
                maxlength="50"
                class="form-control"
                title="Ingresa tu sector (máx. 50 caracteres)"
              >
            </div>
            <div class="form-group">
              <label for="fechanacimiento" class="form-label">Fecha de Nacimiento:</label>
              <input
                type="date"
                id="fechanacimiento"
                v-model="client.CLI_FECHANACIMIENTO"
                required
                class="form-control"
                title="Selecciona tu fecha de nacimiento"
                :max="new Date().toISOString().split('T')[0]"
              >
            </div>
            <div class="form-group">
              <label for="sexo" class="form-label">Sexo:</label>
              <select id="sexo" v-model="client.CLI_SEXO" required class="form-control" title="Selecciona tu sexo">
                <option value="" disabled>Selecciona tu sexo</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label for="clave" class="form-label">Contraseña:</label>
              <input
                type="password"
                id="clave"
                v-model="client.CLI_CLAVE"
                required
                minlength="6"
                maxlength="30"
                class="form-control"
                title="La contraseña debe tener entre 6 y 30 caracteres"
              >
            </div>
            <div class="form-group full-width">
              <label for="confirm_clave" class="form-label">Confirmar Contraseña:</label>
              <input
                type="password"
                id="confirm_clave"
                v-model="confirmPassword"
                required
                minlength="6"
                maxlength="30"
                class="form-control"
                title="Confirma tu contraseña"
              >
            </div>

            <div v-if="formMessage.text" :class="['form-message', formMessage.type]" v-html="formMessage.text">
            </div>

            <div class="form-actions full-width">
              <button type="submit" class="register-button" :disabled="isSubmitting">
                <i class="fas fa-user-plus"></i> {{ isSubmitting ? 'Registrando...' : 'Registrarse' }}
              </button>
              <button type="button" @click="router.push('/iniciarSesion')" class="cancel-button" :disabled="isSubmitting">
                <i class="fas fa-sign-in-alt"></i> Ir a Login
              </button>
            </div>
          </form>
          <p class="login-text">¿Ya tienes cuenta? <router-link to="/iniciarSesion" class="login-link">Inicia Sesión</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos del NavBar fijo - Copiado de tu login */
.navbar{
  background-color: white;
  position: fixed; 
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1); /* Opcional: sombra para que se vea flotante */
}

/* GENERAL LAYOUT - Adaptado para registro */
.registration-page-wrapper {
  display: flex;
  flex-direction: column; 
  min-height: 100vh; /* Permite que el contenido empuje el footer si hubiera más abajo */
  background-color: #FFF2E0; /* Fondo general */
  padding-top: 6em; /* Espacio para el navbar fijo (ajusta si tu navbar es más alto/bajo) */
  box-sizing: border-box; /* Incluye padding en el tamaño total */
}

.navbar-spacer {
  /* Este spacer puede ser innecesario si 'padding-top' en .registration-page-wrapper es suficiente. */
  /* Si aún tienes problemas de contenido debajo del navbar, puedes ajustarlo aquí. */
  display: none; /* Por defecto, no se usa si el padding del wrapper es suficiente */
}

/* Main container for the two columns */
.registration-content-area {
  flex-grow: 1; /* Permite que esta área ocupe el espacio restante */
  display: flex; 
  justify-content: center; 
  align-items: stretch; /* Estira las secciones para ocupar la altura disponible */
  min-height: calc(100vh - 6em); /* Altura mínima restando el navbar */
}

/* MEDIA SECTION (LEFT) - Adaptado del login */
.registration-media-section {
  flex: 1; 
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #664400; /* Color de fondo similar a tu login */
  height: auto; /* Altura automática basada en el contenido, pero flex-grow manejará la altura */
  max-width: 50%; /* Ocupa la mitad del ancho en escritorio */
  padding: 0;
  overflow: hidden; /* Asegura que la imagen no se desborde */
}

.media-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cubre el área manteniendo la proporción */
  display: block;
}

/* FORM SECTION (RIGHT) - Adaptado del login */
.registration-form-section {
  flex: 1; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  height: auto; /* Altura automática */
  width: 50%; /* Ocupa la mitad del ancho en escritorio */
  border-radius: 0 10px 10px 0; /* Bordes redondeados en la parte derecha */
}

/* Inner form container for padding and shadow */
.registration-container {
  width: 100%;
  max-width: 550px; /* Un poco más ancho para acomodar más campos cómodamente */
  padding: 30px 40px; /* Aumenta el padding para un mejor espacio */
  font-family: Arial, sans-serif;
  height: auto; /* Ajusta la altura al contenido */
  align-content: center; /* Centra el contenido si hay espacio vertical */
}

.registration-title {
  text-align: center;
  color: #A63700; /* Color de título similar al login */
  margin-bottom: 2em; /* Más espacio debajo del título */
  font-size: 2.5em; /* Tamaño de fuente ligeramente ajustado */
  font-weight: bold;
}

/* Form Grid for multiple columns */
.registration-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Dos columnas por defecto */
    gap: 1.5em; /* Espacio entre campos */
}

.form-group.full-width {
    grid-column: 1 / -1; /* Hace que el campo ocupe todo el ancho */
}

.form-group {
    margin-bottom: 0; /* Resetear el margin-bottom si se usa gap */
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #664400; /* Color de label similar al login */
  font-weight: bold;
  font-size: 1.05em;
}

.form-control {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1em;
  box-sizing: border-box;
  background-color: #f8f8f8;
}

.form-control:focus {
  border-color: #A65300;
  outline: none;
  box-shadow: 0 0 0 0.15rem rgba(166, 83, 0, 0.2);
}

.form-actions {
  grid-column: 1 / -1; /* Ocupa todo el ancho en la cuadrícula */
  display: flex;
  justify-content: center;
  gap: 1.5em;
  margin-top: 25px;
}

.register-button, .cancel-button {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.05em;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.register-button {
  background-color: #A65300;
  color: white;
}

.register-button:hover:not(:disabled) {
  background-color: #8C4500;
  transform: translateY(-2px);
}

.register-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.cancel-button {
  background-color: #DC3545; /* Usado para "Ir a Login" */
  color: white;
}

.cancel-button:hover:not(:disabled) {
  background-color: #c82333;
  transform: translateY(-2px);
}

.cancel-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.form-message {
  grid-column: 1 / -1; /* Ocupa todo el ancho en la cuadrícula */
  padding: 1em;
  margin-top: 15px; /* Ajuste el margen superior */
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  font-size: 0.95em;
}

.form-message.success {
  background-color: #D4EDDA;
  color: #155724;
  border: 1px solid #C3E6CB;
}

.form-message.error {
  background-color: #F8D7DA;
  color: #721C24;
  border: 1px solid #F5C6CB;
}

.login-text { /* Reemplaza signup-text */
  text-align: center;
  margin-top: 25px;
  color: #664400;
  font-size: 0.95em;
}

.login-link { /* Reemplaza signup-link */
  color: #A63700;
  text-decoration: none;
  font-weight: bold;
}

.login-link:hover {
  text-decoration: underline;
}

/* RESPONSIVE DESIGN - Adaptado para registro */
@media (max-width: 900px) {
  .registration-content-area {
    flex-direction: column;
    padding: 0;
    align-items: stretch;
    height: auto;
    min-height: auto; /* Resetear min-height en móviles */
  }

  .registration-media-section,
  .registration-form-section {
    max-width: 100%;
    width: 100%;
    border-radius: 0;
    height: auto; /* Altura automática en móviles */
    flex: none;
  }

  .registration-media-section {
    min-height: 250px; /* Altura mínima para la imagen en móviles */
    height: 30vh; /* Ajuste de altura responsivo */
  }

  .registration-form-section {
    padding: 1.5em;
    min-height: 50vh; /* Altura mínima para el formulario en móviles */
    display: flex;
    justify-content: center;
    align-items: center; /* Centrar verticalmente el contenido */
  }

  .registration-container {
    max-width: 100%;
    padding: 20px;
    height: auto;
    margin-top: 0; /* No hay margen superior extra en móviles */
  }

  .registration-form-grid {
    grid-template-columns: 1fr; /* Una columna en móviles */
    gap: 1.2em;
  }
}

@media (max-width: 600px) {
  .registration-title {
    font-size: 2em;
  }
  .form-actions {
    flex-direction: column;
    gap: 1em;
  }
}
</style>