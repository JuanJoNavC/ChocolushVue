<script setup>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// Asegúrate que esta ruta sea correcta para NavBarAdminComponent
import NavBarAdminComponent from '../../../components/admin/NavBarAdminComponent.vue';

const route = useRoute();
const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_CONNECTION_STRING;

// Estado del componente
const product = ref({
  PROD_ID: null, // Este debe ser poblado desde el producto obtenido
  MENU_ID: null,
  PROD_NOMBRE: '',
  PROD_PRECIO: 0,
  PROD_DESC: '',
  PROD_STOCK: 0,
  PROD_IMG: '',
  PROD_DESCCORTA: '',
  PROD_CATEGORIA: '',
  PROD_BRAND: '',
  PROD_CAR: null,
  PRO_FAC: null
});

const formMessage = ref({
  type: '',
  text: ''
});
const isLoading = ref(true);
const isSubmitting = ref(false);

// Función para obtener los datos del producto por su ID
const fetchProduct = async (id) => {
  isLoading.value = true;
  formMessage.value = { type: '', text: '' };
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Producto/${id}`);
    product.value = {
      PROD_ID: response.data.PROD_ID || null, // Mantenemos el ID aquí para el v-model disabled
      MENU_ID: response.data.MENU_ID || null,
      PROD_NOMBRE: response.data.PROD_NOMBRE || '',
      PROD_PRECIO: response.data.PROD_PRECIO || 0,
      PROD_DESC: response.data.PROD_DESC || '',
      PROD_STOCK: response.data.PROD_STOCK || 0,
      PROD_IMG: response.data.PROD_IMG || '',
      PROD_DESCCORTA: response.data.PROD_DESCCORTA || '',
      PROD_CATEGORIA: response.data.PROD_CATEGORIA || '',
      PROD_BRAND: response.data.PROD_BRAND || '',
      PROD_CAR: response.data.PROD_CAR || null,
      PRO_FAC: response.data.PRO_FAC || null
    };
  } catch (err) {
    console.error('Error al obtener producto:', err);
    formMessage.value = { type: 'error', text: 'No se pudo cargar la información del producto.' };
    router.push('/admin/productos');
  } finally {
    isLoading.value = false;
  }
};

// Función para guardar los cambios del producto (PUT)
const saveProduct = async () => {
  isSubmitting.value = true;
  formMessage.value = { type: '', text: '' };

  // Validaciones básicas del lado del cliente
  if (
    !product.value.PROD_NOMBRE ||
    product.value.PROD_PRECIO <= 0 ||
    product.value.PROD_STOCK < 0 ||
    !product.value.PROD_DESC ||
    !product.value.PROD_CATEGORIA ||
    !product.value.PROD_BRAND ||
    !product.value.PROD_DESCCORTA ||
    !product.value.PROD_IMG ||
    product.value.PROD_ID === null // Asegúrate que el ID del producto a editar esté disponible
  ) {
    formMessage.value = { type: 'error', text: 'Por favor, completa todos los campos requeridos y asegúrate que el ID del producto sea válido.' };
    isSubmitting.value = false;
    return;
  }

  try {
    // 1. Obtener el ID del producto (ya está en product.value.PROD_ID)
    const productId = product.value.PROD_ID; 

    // 2. Realizar la petición PUT con el ID en la URL y el objeto completo en el cuerpo
    // NO NECESITAMOS ELIMINAR PROD_ID del cuerpo si la API lo espera también.
    const response = await axios.put(`${API_BASE_URL}/api/Producto/${productId}`, product.value);

    if (response.status === 200 || response.status === 204) {
      formMessage.value = { type: 'success', text: 'Producto actualizado correctamente.' };
      setTimeout(() => {
        router.push('/admin/productos');
      }, 500);
    }
  } catch (err) {
    console.error('Error al guardar producto:', err);

    let errorMessage = 'No se pudieron guardar los cambios.';
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

const goBack = () => {
  router.push('/admin/productos');
};

onMounted(() => {
  const productId = route.params.id;
  if (productId) {
    fetchProduct(productId);
  } else {
    formMessage.value = { type: 'error', text: 'ID de producto no proporcionado para edición.' };
    isLoading.value = false;
    router.push('/admin/productos');
  }
});

watch(() => route.params.id, (newId) => {
  if (newId && newId !== product.value.PROD_ID) {
    fetchProduct(newId);
  } else if (!newId) {
    formMessage.value = { type: 'error', text: 'ID de producto no proporcionado para edición.' };
    isLoading.value = false;
    router.push('/admin/productos');
  }
});
</script>

<template>
  <div style="background-color: #FFF2E0; min-height: 100vh;">
    <NavBarAdminComponent />
    <div class="form-container">
      <h1 class="form-title">Editar Producto</h1>

      <div v-if="isLoading" class="loader-wrapper">
        <p class="loading-message">Cargando datos del producto...</p>
      </div>

      <form v-else @submit.prevent="saveProduct" class="product-form">
        <div class="form-group">
          <label for="prod_id">ID:</label>
          <input type="text" id="prod_id" v-model="product.PROD_ID" disabled class="form-control disabled">
        </div>
        
        <div class="form-group">
          <label for="prod_nombre">Nombre:</label>
          <input type="text" id="prod_nombre" v-model="product.PROD_NOMBRE" required class="form-control">
        </div>
        <div class="form-group">
          <label for="prod_precio">Precio:</label>
          <input type="number" id="prod_precio" v-model.number="product.PROD_PRECIO" required min="0.01" step="0.01" class="form-control">
        </div>
        <div class="form-group">
          <label for="prod_stock">Stock:</label>
          <input type="number" id="prod_stock" v-model.number="product.PROD_STOCK" required min="0" class="form-control">
        </div>
        <div class="form-group">
          <label for="prod_categoria">Categoría:</label>
          <input type="text" id="prod_categoria" v-model="product.PROD_CATEGORIA" required class="form-control">
        </div>
        <div class="form-group">
          <label for="prod_brand">Marca:</label>
          <input type="text" id="prod_brand" v-model="product.PROD_BRAND" required class="form-control">
        </div>
        <div class="form-group">
          <label for="prod_desccorta">Descripción Corta:</label>
          <textarea id="prod_desccorta" v-model="product.PROD_DESCCORTA" rows="3" required class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label for="prod_desc">Descripción Completa:</label>
          <textarea id="prod_desc" v-model="product.PROD_DESC" rows="5" required class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label for="prod_img">URL de Imagen:</label>
          <input type="url" id="prod_img" v-model="product.PROD_IMG" required placeholder="https://ejemplo.com/imagen.jpg" class="form-control">
          <img v-if="product.PROD_IMG" :src="product.PROD_IMG" alt="Previsualización del Producto" class="image-preview">
        </div>
        
        <div v-if="formMessage.text" :class="['form-message', formMessage.type]">
          {{ formMessage.text }}
        </div>

        <div class="form-actions">
          <button type="submit" class="save-button" :disabled="isSubmitting">
            <i class="fas fa-save"></i> {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
          <button type="button" @click="goBack" class="cancel-button" :disabled="isSubmitting">
            <i class="fas fa-times-circle"></i> Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Estilos se mantienen idénticos */
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

.product-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5em;
}

@media (min-width: 768px) {
  .product-form {
    grid-template-columns: 1fr 1fr;
  }
  .form-group:nth-of-type(6),
  .form-group:nth-of-type(7),
  .form-group:nth-of-type(8) {
      grid-column: 1 / -1;
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
  grid-column: 1 / -1;
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

.save-button:hover:not(:disabled) {
  background-color: #8C4500;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.save-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.cancel-button {
  background-color: #DC3545;
  color: white;
}

.cancel-button:hover:not(:disabled) {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.cancel-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.form-message {
  grid-column: 1 / -1;
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

.loading-message {
  color: #664400;
  margin-top: 1em;
  font-style: italic;
}
</style>