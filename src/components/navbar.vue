<script lang="ts" setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { PhUser } from '@phosphor-icons/vue'

const authStore = useAuthStore()

const itemsInCart = computed(() => {
  return authStore.user?.cart_items?.length || 0
})
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <RouterLink to="/cart">Cart ({{ itemsInCart }} items)</RouterLink>
          </li>
        </ul>
      </div>
      <RouterLink to="/" class="btn btn-ghost text-xl">Super Games</RouterLink>
    </div>
    <div class="navbar-end">
      <div class="dropdown dropdown-end lg:block hidden" v-if="authStore.isAuthenticated">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle mr-1">
          <div class="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span class="badge badge-sm badge-primary indicator-item">{{ itemsInCart }}</span>
          </div>
        </div>
        <div
          tabindex="0"
          class="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow"
        >
          <div class="card-body">
            <span class="text-lg font-bold">{{ itemsInCart }} items</span>
            <span class="text-info">Subtotal: ${{ authStore.user?.cart_subtotal }}</span>
            <div class="card-actions">
              <button class="btn btn-secondary btn-block" :disabled="itemsInCart === 0">
                <RouterLink to="/cart">View Cart</RouterLink>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="dropdown dropdown-end" v-if="authStore.isAuthenticated">
        <div tabindex="0" role="button" class="btn btn-ghost avatar">
          <PhUser :size="32" />
          <p class="text-lg font-semibold">{{ authStore.user?.username }}</p>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li><RouterLink to="/orders">Orders</RouterLink></li>
          <li><RouterLink to="/library">Library</RouterLink></li>
          <li><button @click="authStore.logout">Logout</button></li>
        </ul>
      </div>

      <div class="dropdown dropdown-end" v-else>
        <RouterLink to="/login" class="btn btn-secondary btn-outline">Login</RouterLink>
        <RouterLink to="/register" class="btn btn-primary ml-2">Sign Up</RouterLink>
      </div>
    </div>
  </div>
</template>
