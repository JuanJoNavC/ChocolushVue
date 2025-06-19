<script setup>
import axios from 'axios';
import NavBarAdminComponent from '../../../components/admin/NavBarAdminComponent.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Keep this import

// Reactive variable to store the clients fetched from the API
const clients = ref([]); // Changed from 'customers' to 'clients'
const API_BASE_URL = import.meta.env.VITE_CONNECTION_STRING;

const router = useRouter(); // Uncommented for navigation

// Function to fetch clients from the API
const fetchClients = async () => { // Renamed function for clarity
    try {
        const response = await axios.get(`${API_BASE_URL}/api/Cliente`); // Ensure this is the correct endpoint
        clients.value = response.data; // Assign the fetched data to the reactive 'clients' variable
        console.log('Clientes fetched:', clients.value);
    } catch (error) {
        console.error('Error fetching clients:', error);
        // Optionally, set an error message or state here
    }
};

// Function to format date for display
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats the date to a readable string based on locale
};

// Functions for edit and delete actions
const editClient = (clientId) => { // Renamed from editCustomer
    console.log(`Edit client with ID: ${clientId}`);
    // In a real application, you would navigate to an edit form or open a modal
    router.push(`/admin/clientes/editar/${clientId}`); // Example: navigate to an edit form
};

const deleteClient = async (clientId) => { // Renamed from deleteCustomer
    if (confirm(`Are you sure you want to delete client with ID: ${clientId}?`)) {
        try {
            await axios.delete(`${API_BASE_URL}/api/Cliente/${clientId}`); // Corrected API endpoint for deleting a client
            // If deletion is successful, remove the client from the local array
            clients.value = clients.value.filter(c => c.CLI_ID !== clientId); // Filter by CLI_ID
            console.log(`Client ${clientId} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting client ${clientId}:`, error);
            alert('Failed to delete client. Please try again.');
        }
    }
};

// Call fetchClients when the component is mounted
onMounted(() => {
    fetchClients();
});
</script>

<template>
    <div style="background-color: #FFF2E0; min-height: 100vh;">
        <NavBarAdminComponent />
        <div class="table-container">
            <div class="header-section">
                <h1 class="table-title">Gestión de Clientes</h1>
                <router-link to="/admin/clientes/crear" class="create-customer-button">
                    <i class="fas fa-plus-circle"></i> Crear Nuevo Cliente
                </router-link>
            </div>

            <table class="tableadmin">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Cédula</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Sector</th>
                        <th>Sexo</th>
                        <th>Fecha Nacimiento</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="client in clients" :key="client.CLI_ID">
                        <td>{{ client.CLI_ID }}</td>
                        <td>{{ client.CLI_NOMBRE }}</td>
                        <td>{{ client.CLI_APELLIDO }}</td>
                        <td>{{ client.CLI_CEDULA }}</td>
                        <td>{{ client.CLI_CORREO }}</td>
                        <td>{{ client.CLI_TELEFONO }}</td>
                        <td>{{ client.CLI_DIRECCION }}</td>
                        <td>{{ client.CLI_SECTOR }}</td>
                        <td>{{ client.CLI_SEXO }}</td>
                        <td>{{ formatDate(client.CLI_FECHANACIMIENTO) }}</td> <td class="actions-cell">
                            <i @click="editClient(client.CLI_ID)" class="fas fa-edit action-icon edit-icon" title="Editar Cliente"></i>
                            <i @click="deleteClient(client.CLI_ID)" class="fas fa-trash-alt action-icon delete-icon" title="Eliminar Cliente"></i>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-if="clients.length === 0" class="loading-message">No se encontraron clientes o aún están cargando...</p>
        </div>
    </div>
</template>

<style scoped>
/* Your existing styles remain valid */
.table-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2em;
    overflow-x: auto;
}

.header-section {
    width: 90%;
    max-width: 1400px;
    display: flex;
    justify-content: space-between; /* Space out title and button */
    align-items: center; /* Vertically align them */
    margin-bottom: 1.5em; /* Space between header and table */
    flex-wrap: wrap; /* Allow wrapping on smaller screens */
    gap: 1em; /* Space between items when wrapped */
}

.table-title {
    color: #A63700;
    text-align: left; /* Align title left within its container */
    margin: 0; /* Remove default margin to control spacing with flexbox */
    font-size: 2.5em;
    font-weight: bold;
}

.create-customer-button {
    background-color: #A65300; /* Your primary button color */
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px; /* Slightly more rounded */
    cursor: pointer;
    font-size: 1.1em;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
    display: flex; /* Allow icon and text to sit together */
    align-items: center; /* Vertically center icon and text */
    gap: 8px; /* Space between icon and text */
    text-decoration: none;
}

.create-customer-button:hover {
    background-color: #8C4500; /* Darker shade on hover */
    transform: translateY(-2px);
}

/* Existing table and icon styles below */

.tableadmin {
    width: 90%;
    max-width: 1400px;
    border-collapse: collapse;
    margin: 1em 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: #FFFFFF;
    border-radius: 8px;
    overflow: hidden;
}

.tableadmin th,
.tableadmin td {
    border: 1px solid #FAD0C4;
    padding: 12px;
    text-align: left;
    vertical-align: middle;
    color: #5C4033;
    font-size: 0.95em;
}

.tableadmin th {
    background-color: #FFECB3;
    color: #A63700;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.tableadmin tr:nth-child(even) {
    background-color: #FFF8DC;
}

.tableadmin tr:hover {
    background-color: #FAD0C4;
}

.customer-image { /* This class is no longer used for clients, can be removed if not used elsewhere */
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #A65300;
}

.price-cell { /* This class is no longer used for clients, can be removed if not used elsewhere */
    font-weight: bold;
    color: #A60000;
}

.actions-cell {
    white-space: nowrap;
    text-align: center;
}

.action-icon {
    font-size: 1.3em;
    margin: 0 8px;
    cursor: pointer;
    transition: color 0.3s ease, transform 0.2s ease;
}

.edit-icon {
    color: #A65300;
}

.edit-icon:hover {
    color: #8C4500;
    transform: scale(1.1);
}

.delete-icon {
    color: #A60000;
}

.delete-icon:hover {
    color: #7A0000;
    transform: scale(1.1);
}

.loading-message {
    color: #664400;
    margin-top: 1em;
    font-style: italic;
}

/* Responsive design for smaller screens */
@media (max-width: 992px) {
    .header-section {
        flex-direction: column; /* Stack title and button on smaller screens */
        align-items: center;
    }
    .table-title {
        text-align: center; /* Center title when stacked */
        margin-bottom: 1em; /* Add space below title */
        font-size: 2em;
    }

    .tableadmin {
        width: 100%;
        font-size: 0.85em;
    }

    .tableadmin th,
    .tableadmin td {
        padding: 8px;
    }

    .customer-image { /* This class is no longer used for clients, can be removed if not used elsewhere */
        width: 45px;
        height: 45px;
    }

    .action-icon {
        font-size: 1.1em;
        margin: 0 5px;
    }
}

@media (max-width: 576px) {
    .tableadmin th,
    .tableadmin td {
        padding: 5px;
    }
    .customer-image { /* This class is no longer used for clients, can be removed if not used elsewhere */
        width: 35px;
        height: 35px;
    }
    .action-icon {
        font-size: 1em;
        margin: 0 3px;
    }
    .create-customer-button {
        font-size: 1em;
        padding: 8px 15px;
    }
}
</style>