import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

// Admin Views
const AdminLogin = () => import('@/views/admin/LoginView.vue')
const AdminDashboard = () => import('@/views/admin/DashboardView.vue')
const AdminLayout = () => import('@/components/admin/AdminLayout.vue')

// Customer Views
const CustomerApp = () => import('@/views/customer/MenuView.vue')
const OrderView = () => import('@/views/customer/OrderView.vue')
const CheckoutView = () => import('@/views/customer/CheckoutView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/admin'
    },
    // Admin Routes
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: AdminDashboard
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('@/views/admin/OrdersView.vue')
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('@/views/admin/ProductsView.vue')
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('@/views/admin/CategoriesView.vue')
        }
      ]
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLogin,
      meta: { requiresGuest: true }
    },
    // Customer Routes
    {
      path: '/menu/:qr',
      name: 'customer-menu',
      component: CustomerApp,
      props: true
    },
    {
      path: '/checkout',
      name: 'customer-checkout',
      component: CheckoutView
    },
    {
      path: '/order/:orderNumber',
      name: 'order-status',
      component: OrderView,
      props: true
    },
    // Catch all route
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth store if needed
  if (authStore.token && !authStore.user) {
    await authStore.checkAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/admin/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/admin')
  } else {
    next()
  }
})

export default router
