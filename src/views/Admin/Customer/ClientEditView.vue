<template>
    <div style="background-color: #FFF2E0; min-height: 100vh;">
        <NavBarAdminComponent />
        <div class="form-container">
            <h1 class="form-title">Editar Cliente</h1>
            <form @submit.prevent="saveClient" class="client-form">
                <div class="form-group">
                    <label for="cli_id">ID:</label>
                    <input type="text" id="cli_id" v-model="client.CLI_ID" disabled class="form-control disabled">
                </div>
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
                <div class="form-actions">
                    <button type="submit" class="save-button">
                        <i class="fas fa-save"></i> Guardar Cambios
                    </button>
                    <button type="button" @click="goBack" class="cancel-button">
                        <i class="fas fa-times-circle"></i> Cancelar
                    </button>
                </div>
            </form>
            <p v-if="loading" class="loading-message">Cargando datos del cliente...</p>
            <p v-if="error" class="error-message">Error: {{ error }}</p>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavBarAdminComponent from '../../../components/admin/NavBarAdminComponent.vue'; // Ajusta la ruta si es necesario

const route = useRoute(); // Para obtener los parámetros de la URL (ID del cliente)
const router = useRouter(); // Para la navegación
const API_BASE_URL = import.meta.env.VITE_CONNECTION_STRING;

// Estado del componente
const client = ref({
    CLI_ID: null,
    CLI_NOMBRE: '',
    CLI_APELLIDO: '',
    CLI_CEDULA: '',
    CLI_CORREO: '',
    CLI_TELEFONO: '',
    CLI_DIRECCION: '',
    CLI_SECTOR: '',
    CLI_SEXO: '',
    CLI_FECHANACIMIENTO: '',
    CLI_CLAVE: '' // Podrías necesitar enviar la clave aunque no la edites
});
const loading = ref(true);
const error = ref(null);

// Función para obtener los datos del cliente por su ID
const fetchClient = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/Cliente/${id}`);
        // Asigna directamente el objeto recibido
        client.value = response.data;

        // Formatear la fecha de nacimiento para el input type="date" (YYYY-MM-DD)
        if (client.value.CLI_FECHANACIMIENTO) {
            const date = new Date(client.value.CLI_FECHANACIMIENTO);
            client.value.CLI_FECHANACIMIENTO = date.toISOString().split('T')[0];
        }
    } catch (err) {
        console.error('Error fetching client:', err);
        error.value = 'No se pudo cargar la información del cliente.';
    } finally {
        loading.value = false;
    }
};

// Función para guardar los cambios del cliente
const saveClient = async () => {
    try {
        // Enviar el objeto 'client.value' completo, incluyendo el CLI_ID,
        // ya que la API espera el ID en el cuerpo.
        // La URL del PUT no debe incluir el ID.
        await axios.put(`${API_BASE_URL}/api/Cliente`, client.value); // ¡Aquí el cambio clave!
        alert('Cliente actualizado correctamente.');
        router.push('/admin/clientes'); // Redirigir de vuelta a la lista de clientes
    } catch (err) {
        console.error('Error saving client:', err);

        let errorMessage = 'No se pudieron guardar los cambios.';
        // Mejorar el mensaje de error para incluir detalles si es un objeto JSON de error
        if (err.response && err.response.data) {
            if (typeof err.response.data === 'string') {
                errorMessage += ' ' + err.response.data;
            } else if (err.response.data.Message) { // Asumiendo que el error de tu API usa "Message"
                errorMessage += ' ' + err.response.data.Message;
            } else if (typeof err.response.data === 'object') {
                errorMessage += ' Detalles: ' + JSON.stringify(err.response.data);
            }
        } else if (err.message) {
            errorMessage += ' ' + err.message;
        }
        
        error.value = errorMessage;
        alert(errorMessage + '\nVerifique los datos e intente de nuevo.');
    }
};

// Función para regresar a la vista anterior
const goBack = () => {
    router.push('/admin/clientes');
};

// Se ejecuta al montar el componente
onMounted(() => {
    // Obtener el ID del cliente de los parámetros de la URL
    const clientId = route.params.id;
    if (clientId) {
        fetchClient(clientId);
    } else {
        error.value = 'ID de cliente no proporcionado.';
        loading.value = false;
    }
});
</script>

<style scoped>
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
    background-color: #A65300;
    color: white;
}

.save-button:hover {
    background-color: #8C4500;
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