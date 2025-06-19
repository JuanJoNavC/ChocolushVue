<template>
    <div style="background-color: #FFF2E0; min-height: 100vh;">
        <NavBarAdminComponent />
        <div class="form-container">
            <h1 class="form-title">Crear Nuevo Cliente</h1>
            <form @submit.prevent="createClient" class="client-form">
                <div class="form-group">
                    <label for="cli_nombre">Nombre:</label>
                    <input type="text" id="cli_nombre" v-model="client.CLI_NOMBRE" required class="form-control">
                </div>
                <div class="form-group">
                    <label for="cli_apellido">Apellido:</label>
                    <input type="text" id="cli_apellido" v-model="client.CLI_APELLIDO" required class="form-control">
                </div>
                <div class="form-group">
                    <label for="cli_cedula">Cédula:</label>
                    <input type="text" id="cli_cedula" v-model="client.CLI_CEDULA" required class="form-control">
                </div>
                <div class="form-group">
                    <label for="cli_correo">Correo:</label>
                    <input type="email" id="cli_correo" v-model="client.CLI_CORREO" required class="form-control">
                </div>
                <div class="form-group">
                    <label for="cli_telefono">Teléfono:</label>
                    <input type="tel" id="cli_telefono" v-model="client.CLI_TELEFONO" class="form-control">
                </div>
                <div class="form-group">
                    <label for="cli_direccion">Dirección:</label>
                    <input type="text" id="cli_direccion" v-model="client.CLI_DIRECCION" class="form-control">
                </div>
                <div class="form-group">
                    <label for="cli_sector">Sector:</label>
                    <input type="text" id="cli_sector" v-model="client.CLI_SECTOR" class="form-control">
                </div>
                <div class="form-group">
                    <label for="cli_sexo">Sexo:</label>
                    <select id="cli_sexo" v-model="client.CLI_SEXO" class="form-control">
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="O">Otro</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="cli_fechanacimiento">Fecha de Nacimiento:</label>
                    <input type="date" id="cli_fechanacimiento" v-model="client.CLI_FECHANACIMIENTO" class="form-control">
                </div>
                <div class="form-group">
                    <label for="cli_clave">Clave (Contraseña):</label>
                    <input type="password" id="cli_clave" v-model="client.CLI_CLAVE" required class="form-control">
                </div>

                <div class="form-actions">
                    <button type="submit" class="save-button">
                        <i class="fas fa-plus-circle"></i> Crear Cliente
                    </button>
                    <button type="button" @click="goBack" class="cancel-button">
                        <i class="fas fa-times-circle"></i> Cancelar
                    </button>
                </div>
            </form>
            <p v-if="loading" class="loading-message">Enviando datos...</p>
            <p v-if="error" class="error-message">Error: {{ error }}</p>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue'; // No necesitamos onMounted para crear
import { useRouter } from 'vue-router';
import NavBarAdminComponent from '../../../components/admin/NavBarAdminComponent.vue'; // Ajusta la ruta si es necesario

const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_CONNECTION_STRING;

// Estado del componente - Objeto de cliente inicial vacío/predeterminado
const client = ref({
    // CLI_ID no se incluye aquí, ya que la API lo genera
    CLI_NOMBRE: '',
    CLI_APELLIDO: '',
    CLI_CEDULA: '',
    CLI_CORREO: '',
    CLI_TELEFONO: '',
    CLI_DIRECCION: '',
    CLI_SECTOR: '',
    CLI_SEXO: 'O', // Valor predeterminado
    CLI_FECHANACIMIENTO: '', // Vacío o un valor predeterminado si lo deseas
    CLI_CLAVE: '', // Clave es requerida al crear
    CARRITO: [], // Generalmente estos campos se envían vacíos o no se envían al crear
    FACTURA: []
});
const loading = ref(false); // No está cargando al inicio
const error = ref(null);

// Función para crear un nuevo cliente
const createClient = async () => {
    loading.value = true;
    error.value = null; // Reiniciar errores

    try {
        // Asegúrate de que la fecha tenga el formato correcto que espera tu API (ISO 8601 con hora y minutos)
        // Aunque el input type="date" da YYYY-MM-DD, algunas APIs esperan la hora también.
        // Si tu API lo requiere, podrías enviar algo como `${client.value.CLI_FECHANACIMIENTO}T00:00:00`
        // o si tienes un campo de hora, combinarlo. Por ahora, asumimos que YYYY-MM-DD es suficiente.
        // Si tu API es estricta con el formato de fecha y hora completa, adapta esta parte.

        // Clonar el objeto para no modificar el v-model directamente antes de la petición
        const clientDataToCreate = { ...client.value };

        // Convertir la fecha a un formato compatible con tu API si es necesario
        // Ejemplo: Si la API espera un DateTime completo y el input date solo da "YYYY-MM-DD"
        if (clientDataToCreate.CLI_FECHANACIMIENTO) {
            clientDataToCreate.CLI_FECHANACIMIENTO = `${clientDataToCreate.CLI_FECHANACIMIENTO}T00:00:00`;
        } else {
            // Si la fecha es opcional y no se proporciona, podrías enviarla como null o no enviarla.
            // O poner una fecha predeterminada.
            delete clientDataToCreate.CLI_FECHANACIMIENTO; // Si no se proporciona y es opcional
        }

        // Si CARRITO y FACTURA deben ser null o no enviarse si están vacíos, ajusta aquí
        if (clientDataToCreate.CARRITO && clientDataToCreate.CARRITO.length === 0) {
            clientDataToCreate.CARRITO = null;
        }
        if (clientDataToCreate.FACTURA && clientDataToCreate.FACTURA.length === 0) {
            clientDataToCreate.FACTURA = null;
        }

        // Realizar la solicitud POST a la API
        const response = await axios.post(`${API_BASE_URL}/api/Cliente`, clientDataToCreate);
        
        alert('Cliente creado correctamente.'); // Asumiendo que la API devuelve el nuevo cliente con ID
        router.push('/admin/clientes'); // Redirigir de vuelta a la lista de clientes
    } catch (err) {
        console.error('Error creating client:', err);
        let errorMessage = 'No se pudo crear el cliente.';
        if (err.response && err.response.data) {
            if (typeof err.response.data === 'string') {
                errorMessage += ' ' + err.response.data;
            } else if (err.response.data.Message) {
                errorMessage += ' ' + err.response.data.Message;
            } else if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
                errorMessage += ' Errores: ' + err.response.data.errors.map(e => e.msg || e.message || e).join(', ');
            } else if (typeof err.response.data === 'object') {
                errorMessage += ' Detalles: ' + JSON.stringify(err.response.data);
            }
        } else if (err.message) {
            errorMessage += ' ' + err.message;
        }
        error.value = errorMessage;
        alert(errorMessage + '\nVerifique los datos e intente de nuevo.');
    } finally {
        loading.value = false;
    }
};

// Función para regresar a la vista anterior
const goBack = () => {
    router.push('/admin/clientes');
};
</script>

<style scoped>
/* Reutiliza los mismos estilos que ClientEditView.vue */
.form-container {
    padding: 2em;
    max-width: 800px;
    margin: 2em auto;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.form-title {
    color: #A63700;
    text-align: center;
    margin-bottom: 1.5em;
    font-size: 2.8em;
    font-weight: bold;
    border-bottom: 3px solid #FFECB3;
    padding-bottom: 0.5em;
}

.client-form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5em;
}

@media (min-width: 768px) {
    .client-form {
        grid-template-columns: 1fr 1fr; /* Two columns on larger screens */
    }
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-weight: bold;
    margin-bottom: 0.6em;
    color: #5C4033;
    font-size: 1.1em;
}

.form-control {
    padding: 0.8em 1em;
    border: 1px solid #FFDDC1;
    border-radius: 8px;
    font-size: 1em;
    color: #333;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    background-color: #FFF8DC;
}

.form-control:focus {
    border-color: #A65300;
    box-shadow: 0 0 0 3px rgba(166, 83, 0, 0.2);
    outline: none;
    background-color: #ffffff;
}

.form-control.disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
    color: #6c757d;
}

.form-actions {
    grid-column: 1 / -1; /* Make buttons span full width */
    display: flex;
    justify-content: center;
    gap: 1.5em;
    margin-top: 2em;
}

.save-button, .cancel-button {
    padding: 12px 25px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.save-button {
    background-color: #4CAF50; /* Un color diferente para crear */
    color: white;
}

.save-button:hover {
    background-color: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.cancel-button {
    background-color: #DC3545;
    color: white;
}

.cancel-button:hover {
    background-color: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.loading-message, .error-message {
    grid-column: 1 / -1;
    text-align: center;
    margin-top: 1em;
    font-style: italic;
    font-size: 1.1em;
}

.loading-message {
    color: #664400;
}

.error-message {
    color: #DC3545;
    font-weight: bold;
}
</style>