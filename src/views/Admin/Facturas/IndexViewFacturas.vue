<script setup>
import axios from 'axios';
import NavBarAdminComponent from '../../../components/admin/NavBarAdminComponent.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Reactive variable to store the invoices fetched from the API
const invoices = ref([]);
const API_BASE_URL = import.meta.env.VITE_CONNECTION_STRING;

const router = useRouter();

// Function to fetch invoices from the API
const fetchInvoices = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/DTOFactura/facturas`);
        invoices.value = response.data;
        console.log('Invoices fetched:', invoices.value);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        // Optionally, set an error message or state here
    }
};

// Function to format date for display
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    // Format to "DD/MM/YYYY" as it's a list view, consistent with typical table display
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Function to navigate to the invoice detail view
const viewInvoiceDetail = (invoiceId) => {
    console.log(`View detail for invoice with ID: ${invoiceId}`);
    router.push(`/admin/facturas/detalle/${invoiceId}`); // Navigate to the new detail view
};

// Call fetchInvoices when the component is mounted
onMounted(() => {
    fetchInvoices();
});
</script>

<template>
    <div style="background-color: #FFF2E0; min-height: 100vh;">
        <NavBarAdminComponent />
        <div class="table-container">
            <div class="header-section">
                <h1 class="table-title">Gestión de Facturas</h1>
                <!-- Eliminar el botón de "Crear Nueva Factura" si no es necesario desde esta vista -->
                <!-- <router-link to="/admin/facturas/crear" class="create-customer-button">
                    <i class="fas fa-plus-circle"></i> Crear Nueva Factura
                </router-link> -->
            </div>

            <table class="tableadmin">
                <thead>
                    <tr>
                        <th>ID Factura</th>
                        <th>Cédula Cliente</th>
                        <th>Nombre Cliente</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Fecha y Hora</th>
                        <th>IVA</th>
                        <th>Subtotal</th>
                        <th>Detalle</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="invoices.length > 0" v-for="invoice in invoices" :key="invoice.idFactura">
                        <td>{{ invoice.idFactura }}</td>
                        <td>{{ invoice.cliCedula }}</td>
                        <td>{{ invoice.cliNombre }}</td>
                        <td>{{ invoice.facDescripcion }}</td>
                        <td>{{ invoice.facEstado }}</td>
                        <td>{{ formatDate(invoice.facFechaHora) }}</td>
                        <td>${{ invoice.facIva.toFixed(2) }}</td>
                        <td>${{ invoice.facSubtotal.toFixed(2) }}</td>
                        <td class="actions-cell">
                            <button @click="viewInvoiceDetail(invoice.idFactura)" class="detail-button" title="Ver Detalle de Factura">
                                Ver detalle
                            </button>
                        </td>
                    </tr>
                    <tr v-else>
                        <td colspan="9" class="loading-message">No se encontraron facturas o aún están cargando...</td>
                    </tr>
                </tbody>
            </table>
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

/* El botón de crear cliente/factura se ha comentado en el template, pero mantengo los estilos por si se reutiliza */
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

/* Estilo para el nuevo botón de detalle */
.detail-icon {
    color: #007bff; /* Un color azul para indicar "ver" */
}

.detail-icon:hover {
    color: #0056b3;
    transform: scale(1.1);
}

/* Eliminar estilos para iconos de editar y eliminar si no se usan en ningún otro lugar */
/* .edit-icon { ... } */
/* .delete-icon { ... } */

.loading-message {
    color: #664400;
    margin-top: 1em;
    font-style: italic;
    text-align: center;
}

/* New button style for "Ver detalle" */
.detail-button {
    background-color: #FFD700; /* Yellow color from the image */
    color: #333; /* Dark text for contrast */
    border: none;
    padding: 8px 15px;
    border-radius: 8px; /* Rounded corners */
    cursor: pointer;
    font-size: 0.9em;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
}

.detail-button:hover {
    background-color: #e6c200; /* Slightly darker yellow on hover */
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Responsive design for smaller screens */
@media (max-width: 992px) {
    .header-section {
        flex-direction: column;
        align-items: center;
    }
    .table-title {
        text-align: center;
        margin-bottom: 1em;
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

    .action-icon {
        font-size: 1.1em;
        margin: 0 5px;
    }

    .detail-button { /* Adjusted for smaller screens */
        font-size: 0.8em;
        padding: 6px 12px;
    }
}

@media (max-width: 576px) {
    .tableadmin th,
    .tableadmin td {
        padding: 5px;
        font-size: 0.8em;
    }
    .create-customer-button {
        font-size: 1em;
        padding: 8px 15px;
    }
}
</style>
