<script setup>
import axios from 'axios';
import NavBarAdminComponent from '../../../components/admin/NavBarAdminComponent.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const API_BASE_URL = import.meta.env.VITE_CONNECTION_STRING;
const router = useRouter();

// Reactive form data - NOW INCLUDES PROD_DESC
const product = ref({
    PROD_NOMBRE: '',
    PROD_PRECIO: 0,
    PROD_DESC: '', // Added PROD_DESC
    PROD_STOCK: 0,
    PROD_CATEGORIA: '',
    PROD_BRAND: '',
    PROD_DESCCORTA: '',
    PROD_IMG: ''
});

const formMessage = ref({
    type: '',
    text: ''
});

const isSubmitting = ref(false);

const createProduct = async () => {
    isSubmitting.value = true;
    formMessage.value = { type: '', text: '' };

    try {
        // Basic validation - now includes PROD_DESC
        if (
            !product.value.PROD_NOMBRE ||
            product.value.PROD_PRECIO <= 0 ||
            product.value.PROD_STOCK < 0 ||
            !product.value.PROD_DESC || // Added validation for PROD_DESC
            !product.value.PROD_CATEGORIA ||
            !product.value.PROD_BRAND ||
            !product.value.PROD_DESCCORTA ||
            !product.value.PROD_IMG
        ) {
            formMessage.value = { type: 'error', text: 'Please fill in all fields correctly.' };
            isSubmitting.value = false;
            return;
        }

        const response = await axios.post(`${API_BASE_URL}/api/Producto`, product.value);

        if (response.status === 201 || response.status === 200) {
            formMessage.value = { type: 'success', text: 'Product created successfully!' };
            // Optionally, clear the form or redirect after a short delay
            setTimeout(() => {
                router.push('/admin/productos');
            }, 1500);
        }
    } catch (error) {
        console.error('Error creating product:', error);
        formMessage.value = { type: 'error', text: 'Failed to create product. Please try again.' };
        if (error.response && error.response.data) {
            formMessage.value.text += ` ${error.response.data.message || ''}`;
        }
    } finally {
        isSubmitting.value = false;
    }
};

const cancelCreation = () => {
    router.push('/admin/productos');
};
</script>

<template>
    <div style="background-color: #FFF2E0; min-height: 100vh;">
        <NavBarAdminComponent />
        <div class="form-container">
            <h1 class="form-title">Añadir un producto</h1>

            <form @submit.prevent="createProduct" class="product-form">
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
                        <i class="fas fa-plus-circle"></i> {{ isSubmitting ? 'Creating...' : 'Create Product' }}
                    </button>
                    <button type="button" class="cancel-button" @click="cancelCreation" :disabled="isSubmitting">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
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
    width: calc(100% - 24px); /* Adjust for padding */
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
    display: block; /* Ensures it takes up its own line */
}

.form-actions {
    display: flex;
    justify-content: flex-end; /* Align buttons to the right */
    gap: 1em; /* Space between buttons */
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
    border: none; /* Ensure no default button border */
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

/* Responsive adjustments */
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
        flex-direction: column; /* Stack buttons on small screens */
        align-items: stretch;
    }

    .submit-button, .cancel-button {
        width: 100%;
        text-align: center;
        justify-content: center; /* Center icon and text */
    }
}
</style>