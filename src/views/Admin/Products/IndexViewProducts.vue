<script setup>
import axios from 'axios';
import NavBarAdminComponent from '../../../components/admin/NavBarAdminComponent.vue';
import { ref, onMounted } from 'vue'; // Import ref and onMounted for reactive data and lifecycle hook
import LoaderComponent from '../../../components/LoaderComponent.vue';

// Reactive variable to store the products fetched from the API
const products = ref([]);
const API_BASE_URL = import.meta.env.VITE_CONNECTION_STRING;
const loading  = ref(false);


// Function to fetch products from the API
const fetchProducts = async () => {
  loading.value = true; 
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Producto`);
    products.value = response.data;
    console.log('Products fetched:', products.value);
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loading.value = false; 
  }
};


const deleteProduct = async (productId) => {
    if (confirm(`Are you sure you want to delete product with ID: ${productId}?`)) {
        try {
            await axios.delete(`${API_BASE_URL}/api/Producto/${productId}`);
            // If deletion is successful, remove the product from the local array
            products.value = products.value.filter(p => p.PROD_ID !== productId);
            console.log(`Product ${productId} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting product ${productId}:`, error);
            alert('Failed to delete product. Please try again.');
        }
    }
};

// Call fetchProducts when the component is mounted
onMounted(() => {
    fetchProducts();
});
</script>

<template>
    <div style="background-color: #FFF2E0; min-height: 100vh;">
        <NavBarAdminComponent />
        <div class="table-container">
            <div class="header-section">
                <h1 class="table-title">Gestion de productos</h1>
                <router-link to="/admin/productos/crear" class="create-product-button">
                    <i class="fas fa-plus-circle"></i> Crear Nuevo Producto
                </router-link>
            </div>
            <table class="tableadmin">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Categoria</th>
                        <th>Marcas</th>
                        <th>Description</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in products" :key="product.PROD_ID">
                        <td>{{ product.PROD_ID }}</td>
                        <td>
                            <img :src="product.PROD_IMG" :alt="product.PROD_NOMBRE" class="product-image" />
                        </td>
                        <td>{{ product.PROD_NOMBRE }}</td>
                        <td class="price-cell">${{ product.PROD_PRECIO.toFixed(2) }}</td>
                        <td>{{ product.PROD_STOCK }}</td>
                        <td>{{ product.PROD_CATEGORIA }}</td>
                        <td>{{ product.PROD_BRAND }}</td>
                        <td>{{ product.PROD_DESCCORTA }}</td>
                        <td class="actions-cell">
                            <router-link :to="`/admin/productos/editar/${product.PROD_ID}`" class="action-link edit-link">
                                <i class="fas fa-edit action-icon edit-icon" title="Edit Product"></i>
                            </router-link>
                            <i @click="deleteProduct(product.PROD_ID)" class="fas fa-trash-alt action-icon delete-icon" title="Delete Product"></i>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="loading" class="loader-wrapper">
                <LoaderComponent />
                <p class="loading-message">Cargando productos...</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
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

.create-product-button {
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

.create-product-button:hover {
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
    background-color: #fbebe7;
}

.product-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #A65300;
}

.price-cell {
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

    .product-image {
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
    .product-image {
        width: 35px;
        height: 35px;
    }
    .action-icon {
        font-size: 1em;
        margin: 0 3px;
    }
    .create-product-button {
        font-size: 1em;
        padding: 8px 15px;
    }
}
</style>