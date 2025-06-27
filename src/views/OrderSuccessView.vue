<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { fetchOrderDetails } from '@/utils/OrderAPIs'
import type { OrderResponse } from '../types/Game'
import { PhCheckCircle } from '@phosphor-icons/vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const orderId = route.params.orderId as string
const orderDetails = ref<{ success: boolean; messages?: string; data?: OrderResponse }>({
  success: false,
})

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Home' })
    return
  }

  try {
    const response = await fetchOrderDetails(orderId)
    orderDetails.value = response
    console.log('Order Details:', orderDetails)
  } catch (error) {
    console.error('Error fetching order details:', error)
  }
})
</script>

<template>
  <div v-if="orderDetails.success">
    <div v-if="orderDetails.data">
      <div class="card bg-base-200 p-6 shadow-md">
        <div class="flex items-center mb-4">
          <PhCheckCircle class="text-green-500 w-8 h-8 mr-2" />
          <h2 class="text-2xl font-bold">Thank you for your order!</h2>
        </div>
        <div class="flex flex-col gap-0.5">
          <p class="text-gray-700">Order ID: {{ orderDetails.data.id }}</p>
          <p class="text-gray-700">Total Amount: ${{ orderDetails.data.total_amount }}</p>
          <p class="text-gray-700">
            Order Date: {{ new Date(orderDetails.data.order_date).toLocaleDateString() }}
          </p>
        </div>
      </div>

      <div class="mt-4">
        <h2 class="text-xl font-semibold mb-2">Games Purchased:</h2>
        <div
          v-for="item in orderDetails.data.order_items"
          :key="item.id"
          class="card bg-base-100 shadow-xl mb-4 p-4 flex flex-row items-center gap-4"
        >
          <img
            :src="item.game.image"
            :alt="item.game.title"
            class="w-24 h-24 object-cover rounded-xl flex-shrink-0"
          />
          <div class="flex-1">
            <RouterLink :to="`/games/${item.game.id}`">
              <h3 class="card-title text-lg font-bold mb-1">{{ item.game.title }}</h3>
            </RouterLink>
            <p class="text-sm text-gray-600 mb-1">
              {{ item.game.description.substring(0, 100) }}...
            </p>
            <p class="text-sm text-gray-500">Purchased for: ${{ item.purchase_price }}</p>
          </div>
        </div>
      </div>

      <RouterLink to="/library" class="btn btn-primary w-full mt-4"> Go to Library </RouterLink>
    </div>
  </div>

  <div v-else>
    <h1>Order: {{ orderId }} could not be placed</h1>
  </div>
</template>
