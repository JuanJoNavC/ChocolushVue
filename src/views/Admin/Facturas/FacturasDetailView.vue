<template>
    <div style="background-color: #FFF2E0; min-height: 100vh;">
        <NavBarAdminComponent />
        <div class="detail-container">
            <h1 class="section-title">Información de la factura</h1>

            <div v-if="loadingInvoice" class="loading-message">Cargando información de la factura...</div>
            <div v-else-if="invoiceError" class="error-message">Error al cargar la factura: {{ invoiceError }}</div>
            <div v-else class="invoice-details-card">
                <div class="detail-group">
                    <span class="detail-label">ID:</span>
                    <span class="detail-value">{{ invoice.idFactura }}</span>
                </div>
                <div class="detail-group">
                    <span class="detail-label">Cliente:</span>
                    <span class="detail-value">{{ invoice.cliNombre }}</span>
                </div>
                <div class="detail-group">
                    <span class="detail-label">Cédula:</span>
                    <span class="detail-value">{{ invoice.cliCedula }}</span>
                </div>
                <div class="detail-group">
                    <span class="detail-label">Descripción:</span>
                    <span class="detail-value">{{ invoice.facDescripcion }}</span>
                </div>
                <div class="detail-group">
                    <span class="detail-label">Fecha y Hora:</span>
                    <span class="detail-value">{{ formatDate(invoice.facFechaHora) }}</span>
                </div>
                <div class="detail-group">
                    <span class="detail-label">Subtotal:</span>
                    <span class="detail-value">${{ invoice.facSubtotal ? invoice.facSubtotal.toFixed(2) : '0.00' }}</span>
                </div>
                <div class="detail-group">
                    <span class="detail-label">IVA:</span>
                    <span class="detail-value">${{ invoice.facIva ? invoice.facIva.toFixed(2) : '0.00' }}</span>
                </div>
                <div class="detail-group">
                    <span class="detail-label">Estado:</span>
                    <span class="detail-value">{{ invoice.facEstado }}</span>
                </div>
            </div>

            <h2 class="section-title product-list-title">Productos en la factura</h2>

            <div v-if="loadingProFac" class="loading-message">Cargando productos de la factura...</div>
            <div v-else-if="proFacError" class="error-message">Error al cargar productos: {{ proFacError }}</div>
            <table v-else class="tableadmin product-table">
                <thead>
                    <tr>
                        <th>ID Producto</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Total</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="proFacItems.length > 0" v-for="item in proFacItems" :key="item.idProducto">
                        <td>{{ item.idProducto }}</td>
                        <td>{{ item.prodNombre }}</td>
                        <td>{{ item.prodCantidad }}</td>
                        <td>${{ item.prodPrecioTotal ? item.prodPrecioTotal.toFixed(2) : '0.00' }}</td>
                        <td>{{ item.pfEstado }}</td>
                    </tr>
                    <tr v-else>
                        <td colspan="5" class="loading-message">No se encontraron productos para esta factura.</td>
                    </tr>
                </tbody>
            </table>

            <div class="form-actions">
                <button type="button" @click="goBack" class="cancel-button">
                    <i class="fas fa-arrow-circle-left"></i> Volver a Facturas
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavBarAdminComponent from '../../../components/admin/NavBarAdminComponent.vue';

const route = useRoute();
const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_CONNECTION_STRING;

const invoice = ref({});
const proFacItems = ref([]); // To store items from api/DTOProFac/{id}

const loadingInvoice = ref(true);
const invoiceError = ref(null);
const loadingProFac = ref(true);
const proFacError = ref(null);

// Function to fetch main invoice details
const fetchInvoiceDetails = async (id) => {
    try {
        // Still fetch from DTOFactura for detailed invoice info like cliNombre, cliCedula
        const response = await axios.get(`${API_BASE_URL}/api/DTOFactura/facturas/${id}`);
        invoice.value = response.data;
        
        // Format date for display if needed (though formatDate handles it)
        if (invoice.value.facFechaHora) {
            const date = new Date(invoice.value.facFechaHora);
            if (!isNaN(date.getTime())) {
                // Keep it as a Date object or string as it is, formatDate will handle display
            }
        }
    } catch (err) {
        console.error('Error fetching invoice details:', err);
        invoiceError.value = 'No se pudo cargar la información de la factura.';
    } finally {
        loadingInvoice.value = false;
    }
};

// Function to fetch products associated with the invoice
const fetchProFacItems = async (invoiceId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/DTOProFac/${invoiceId}`);
        // The API now returns an ArrayOfDTOProFac directly
        proFacItems.value = response.data;
        // Filter out any potential null or undefined entries if the array is not strictly controlled
        proFacItems.value = proFacItems.value.filter(item => item !== null && item !== undefined);

    } catch (err) {
        console.error('Error fetching DTOProFac items:', err);
        proFacError.value = 'No se pudieron cargar los productos de la factura.';
    } finally {
        loadingProFac.value = false;
    }
};

// Function to format date for display (similar to previous components)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    // Format to "DD/MM/YYYY, HH:MM:SS a.m./p.m." as shown in the image
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true // For a.m./p.m.
    });
};

// Function to go back to the previous view (invoice list)
const goBack = () => {
    router.push('/admin/facturas');
};

// On component mount, fetch data
onMounted(async () => {
    const invoiceId = route.params.id;
    if (invoiceId) {
        await fetchInvoiceDetails(invoiceId);
        await fetchProFacItems(invoiceId);
    } else {
        invoiceError.value = 'ID de factura no proporcionado.';
        loadingInvoice.value = false;
        loadingProFac.value = false;
    }
});
</script>

<style scoped>
.detail-container {
    padding: 2em;
    max-width: 900px;
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

.section-title {
    color: #A63700;
    text-align: left;
    margin-bottom: 1.5em;
    font-size: 2.2em;
    font-weight: bold;
    border-bottom: 3px solid #FFECB3;
    padding-bottom: 0.5em;
}

.invoice-details-card {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1em 2em; /* Row gap, Column gap */
    margin-bottom: 2em;
}

@media (min-width: 600px) {
    .invoice-details-card {
        grid-template-columns: repeat(2, 1fr); /* Two columns on larger screens */
    }
}

.detail-group {
    display: flex;
    flex-direction: column;
    padding: 0.5em 0;
    border-bottom: 1px dashed #FAD0C4; /* Subtle separator */
}

.detail-group:last-child {
    border-bottom: none;
}

.detail-label {
    font-weight: bold;
    color: #5C4033;
    font-size: 1em;
    margin-bottom: 0.3em;
}

.detail-value {
    color: #333;
    font-size: 1.1em;
}

.product-list-title {
    margin-top: 3em;
}

.tableadmin {
    width: 100%;
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

.form-actions {
    display: flex;
    justify-content: center;
    gap: 1.5em;
    margin-top: 2em;
}

.cancel-button {
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
    background-color: #6c757d; /* A neutral color for 'go back' */
    color: white;
}

.cancel-button:hover {
    background-color: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.loading-message, .error-message {
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

/* Responsive adjustments for tables */
@media (max-width: 768px) {
    .tableadmin th,
    .tableadmin td {
        padding: 8px;
        font-size: 0.85em;
    }
}

@media (max-width: 576px) {
    .tableadmin th,
    .tableadmin td {
        padding: 5px;
        font-size: 0.8em;
    }
    .cancel-button {
        font-size: 1em;
        padding: 8px 15px;
    }
}
</style>
