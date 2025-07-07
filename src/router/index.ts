import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'games',
      component: () => import('../views/GamesView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/SignUpView.vue'),
    },
    {
      path: '/games/:id',
      name: 'gameDetails',
      component: () => import('../views/GameDetailsView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/order/:orderId',
      name: 'orderSuccess',
      component: () => import('../views/OrderSuccessView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/GameLibrary.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'games' })
  } else if (to.name === 'register' && authStore.isAuthenticated) {
    next({ name: 'games' })
  } else {
    next()
  }
});

export default router
