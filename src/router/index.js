import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import IndexViewProducts from '../views/Admin/Products/IndexViewProducts.vue'
import ProductsCreate from '../views/Admin/Products/ProductsCreate.vue'
import IndexViewCustomer from '../views/Admin/Customer/IndexViewCustomer.vue'
import ClientEditView from '../views/Admin/Customer/ClientEditView.vue'
import ClientCreateView from '../views/Admin/Customer/ClientCreateView.vue'
import IndexViewFacturas from '../views/Admin/Facturas/IndexViewFacturas.vue'
import FacturasDetailView from '../views/Admin/Facturas/FacturasDetailView.vue'
import IniciarSesionView from '../views/IniciarSesionView.vue'
import ProductsEdit from '../views/Admin/Products/ProductsEdit.vue'

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
      path: '/admin/productos/editar/:id',
      name: 'editar productos',
      component: ProductsEdit,
    },
    {
      path: '/admin/clientes',
      name: 'clientes',
      component: IndexViewCustomer,
    },
    {
      path: '/admin/clientes/editar/:id',
      name: 'ClientEdit',
      component: ClientEditView,
    },
    {
      path: '/admin/clientes/crear', // <--- ¡NUEVA RUTA!
      name: 'ClientCreate',
      component: ClientCreateView,
    },
    {
      path: '/admin/facturas',
      name: 'facturas',
      component: IndexViewFacturas,
    },
    {
      path: '/admin/facturas/detalle/:id',
      name: 'facturasDetalle',
      component: FacturasDetailView,
    },
    {
      path: '/iniciarSesion',
      name: 'iniciarSesion',
      component: IniciarSesionView,
    },
  ],
})

export default router
