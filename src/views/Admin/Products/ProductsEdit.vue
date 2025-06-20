<script setup>
import axios from 'axios';
import NavBarAdminComponent from '../../../components/admin/NavBarAdminComponent.vue';
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const API_BASE_URL = import.meta.env.VITE_CONNECTION_STRING;
const router = useRouter();
const route = useRoute();

const productId = ref(null);
const isEditMode = ref(false);

const product = ref({
  PROD_ID: null, // This must be populated from the fetched product
  PROD_NOMBRE: '',
  PROD_PRECIO: 0,
  PROD_DESC: '',
  PROD_STOCK: 0,
  PROD_CATEGORIA: '',
  PROD_BRAND: '',
  PROD_DESCCORTA: '',
  PROD_IMG: '',
  // Include any other fields that are part of your API's expected product object
  // even if they are optional or not directly in the form
  MENU_ID: null,
  PROD_CAR: null,
  PRO_FAC: null
});

const formMessage = ref({
  type: '',
  text: ''
});

const isSubmitting = ref(false);
const isLoadingProduct = ref(false);

const fetchProductDetails = async (id) => {
  isLoadingProduct.value = true;
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Producto/${id}`);
    const data = response.data;
    // Map the fetched data to your product ref, ensuring PROD_ID is set
    product.value = {
      PROD_ID: data.PROD_ID || null,
      PROD_NOMBRE: data.PROD_NOMBRE || '',
      PROD_PRECIO: data.PROD_PRECIO || 0,
      PROD_DESC: data.PROD_DESC || '',
      PROD_STOCK: data.PROD_STOCK || 0,
      PROD_CATEGORIA: data.PROD_CATEGORIA || '',
      PROD_BRAND: data.PROD_BRAND || '',
      PROD_DESCCORTA: data.PROD_DESCCORTA || '',
      PROD_IMG: data.PROD_IMG || '',
      MENU_ID: data.MENU_ID || null,
      PROD_CAR: data.PROD_CAR || null,
      PRO_FAC: data.PRO_FAC || null
    };
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    formMessage.value = { type: 'error', text: 'Failed to load product details.' };
    router.push('/admin/productos');
  } finally {
    isLoadingProduct.value = false;
  }
};

const submitForm = async () => {
  isSubmitting.value = true;
  formMessage.value = { type: '', text: '' };

  // Basic validation
  if (
    !product.value.PROD_NOMBRE ||
    product.value.PROD_PRECIO <= 0 ||
    product.value.PROD_STOCK < 0 ||
    !product.value.PROD_DESC ||
    !product.value.PROD_CATEGORIA ||
    !product.value.PROD_BRAND ||
    !product.value.PROD_DESCCORTA ||
    !product.value.PROD_IMG
  ) {
    formMessage.value = { type: 'error', text: 'Please fill in all required fields correctly.' };
    isSubmitting.value = false;
    return;
  }

  // Crucial: PROD_ID must be present in the object to be sent
  if (product.value.PROD_ID === null) {
      formMessage.value = { type: 'error', text: 'Product ID is missing for update. Cannot save changes.' };
      isSubmitting.value = false;
      return;
  }

  try {
    // THIS IS THE CORRECT CALL IF THE API EXPECTS JSON BODY WITH ID AND NO ID IN URL
    // axios automatically sets 'Content-Type': 'application/json' for objects
    const response = await axios.put(`${API_BASE_URL}/api/Producto`, product.value);

    if (response.status === 200 || response.status === 204) {
      formMessage.value = { type: 'success', text: 'Product updated successfully!' };
      setTimeout(() => {
        router.push('/admin/productos');
      }, 500);
    }
  } catch (error) {
    console.error(`Error updating product:`, error);
    let errorMessage = 'Failed to update product. Please try again.';
    if (error.response && error.response.data) {
      // Improved error message parsing for JSON responses
      if (typeof error.response.data === 'string') {
        errorMessage += ` ${error.response.data}`;
      } else if (error.response.data.Message) { // Common for some .NET APIs
        errorMessage += ` ${error.response.data.Message}`;
      } else if (error.response.data.errors) { // Common for validation errors
        const validationErrors = Object.values(error.response.data.errors).flat().join(' ');
        errorMessage += ` Details: ${validationErrors}`;
      } else {
        errorMessage += ` ${JSON.stringify(error.response.data)}`;
      }
    } else if (error.message) {
      errorMessage += ` ${error.message}`;
    }
    formMessage.value = { type: 'error', text: errorMessage };
  } finally {
    isSubmitting.value = false;
  }
};

const cancelOperation = () => {
  router.push('/admin/productos');
};

onMounted(() => {
  if (route.params.id) {
    productId.value = route.params.id;
    isEditMode.value = true;
    fetchProductDetails(productId.value);
  } else {
    // If no ID is provided in the route, it's not an edit, so redirect
    router.push('/admin/productos');
  }
});

// Watch for route ID changes (e.g., if navigating directly from one product edit to another)
watch(() => route.params.id, (newId) => {
  if (newId) {
    productId.value = newId;
    isEditMode.value = true;
    fetchProductDetails(productId.value);
  } else {
    productId.value = null;
    isEditMode.value = false;
    router.push('/admin/productos');
  }
}, { immediate: true }); // immediate: true fetches data on initial component mount
</script>

<template>
  <div style="background-color: #FFF2E0; min-height: 100vh;">
    <NavBarAdminComponent />
    <div class="form-container">
      <h1 class="form-title">Editar Producto</h1>

      <div v-if="isLoadingProduct" class="loader-wrapper">
        <p class="loading-message">Cargando detalles del producto...</p>
      </div>

      <form v-else @submit.prevent="submitForm" class="product-form">
        <div class="form-group">
          <label for="prod_id">ID del Producto</label>
          <input type="text" id="prod_id" v-model="product.PROD_ID" disabled class="form-control disabled" />
        </div>


        <div class="form-group">
          <label for="name">Nombre</label>
          <input type="text" id="name" v-model="product.PROD_NOMBRE" required />
        </div>

        <div class="form-group">
          <label for="price">Precio</label>
          <input type="number" id="price" v-model.number="product.PROD_PRECIO" required min="0.01" step="0.01" />
        </div>

        <div class="form-group">
          <label for="stock">Stock</label>
          <input type="number" id="stock" v-model.number="product.PROD_STOCK" required min="0" />
        </div>

        <div class="form-group">
          <label for="category">Categoria</label>
          <input type="text" id="category" v-model="product.PROD_CATEGORIA" required />
        </div>

        <div class="form-group">
          <label for="brand">Marca</label>
          <input type="text" id="brand" v-model="product.PROD_BRAND" required />
        </div>

        <div class="form-group">
          <label for="fullDescription">Descripcion completa</label>
          <textarea id="fullDescription" v-model="product.PROD_DESC" rows="5" required></textarea>
        </div>

        <div class="form-group">
          <label for="shortDescription">Descripcion corta</label>
          <textarea id="shortDescription" v-model="product.PROD_DESCCORTA" rows="3" required></textarea>
        </div>

        <div class="form-group">
          <label for="image">URL de la imagen</label>
          <input type="url" id="image" v-model="product.PROD_IMG" required placeholder="http://example.com/image.jpg" />
          <img v-if="product.PROD_IMG" :src="product.PROD_IMG" alt="Product Preview" class="image-preview" />
        </div>

        <div v-if="formMessage.text" :class="['form-message', formMessage.type]">
          {{ formMessage.text }}
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-button" :disabled="isSubmitting">
            <i class="fas fa-save"></i> {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
          <button type="button" class="cancel-button" @click="cancelOperation" :disabled="isSubmitting">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Your existing styles */
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
}

.form-title {
  color: #A63700;
  margin-bottom: 1.5em;
  font-size: 2.8em;
  font-weight: bold;
  text-align: center;
}

.product-form {
  background-color: #FFFFFF;
  padding: 2.5em;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.form-group {
  margin-bottom: 1.5em;
}

.form-group label {
  display: block;
  margin-bottom: 0.7em;
  color: #5C4033;
  font-weight: bold;
  font-size: 1.05em;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="url"],
.form-group textarea {
  width: calc(100% - 24px);
  padding: 12px;
  border: 1px solid #FAD0C4;
  border-radius: 6px;
  font-size: 1em;
  color: #5C4033;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #A65300;
  box-shadow: 0 0 0 3px rgba(166, 83, 0, 0.2);
  outline: none;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.image-preview {
  max-width: 150px;
  max-height: 150px;
  margin-top: 1em;
  border-radius: 8px;
  border: 1px solid #A65300;
  object-fit: cover;
  display: block;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1em;
  margin-top: 2em;
}

.submit-button,
.cancel-button {
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease, opacity 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  border: none;
}

.submit-button {
  background-color: #A65300;
  color: white;
}

.submit-button:hover:not(:disabled) {
  background-color: #8C4500;
  transform: translateY(-2px);
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.cancel-button {
  background-color: #E0E0E0;
  color: #5C4033;
}

.cancel-button:hover:not(:disabled) {
  background-color: #D3D3D3;
  transform: translateY(-2px);
}

.cancel-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.form-message {
  padding: 1em;
  margin-top: 1.5em;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
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

.loader-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  width: 100%;
}

@media (max-width: 768px) {
  .form-title {
    font-size: 2.2em;
  }

  .product-form {
    padding: 1.8em;
  }

  .form-group label {
    font-size: 1em;
  }

  .form-group input,
  .form-group textarea {
    padding: 10px;
  }

  .submit-button,
  .cancel-button {
    padding: 10px 20px;
    font-size: 1em;
  }

  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .submit-button, .cancel-button {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
}
</style>