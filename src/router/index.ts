import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('../views/GamesView.vue'),
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
    }
  ],
})

export default router
