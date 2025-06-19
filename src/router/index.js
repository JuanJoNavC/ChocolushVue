import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import IndexViewProducts from '../views/Admin/Products/IndexViewProducts.vue'
import ProductsCreate from '../views/Admin/Products/ProductsCreate.vue'
import IndexViewCustomer from '../views/Admin/Customer/IndexViewCustomer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndexView,
    },
    {
      path: '/admin/productos',
      name: 'productos',
      component: IndexViewProducts,
    },
    {
      path: '/admin/productos/crear',
      name: 'crear productos',
      component: ProductsCreate,
    },
    {
      path: '/admin/clientes',
      name: 'clientes',
      component: IndexViewCustomer,
    },
  ],
})

export default router
