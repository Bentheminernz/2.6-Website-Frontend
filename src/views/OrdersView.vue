<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { OrderResponse } from '@/types/Game'
import { fetchUserOrders } from '@/utils/OrderAPIs'

const ordersResponse = ref<{ success: boolean; message?: string; data?: OrderResponse[] }>({
  success: false,
})

onMounted(() => {
  handleFetchOrders()
})

const handleFetchOrders = async () => {
  try {
    const response = await fetchUserOrders()
    ordersResponse.value = response
  } catch (error) {
    console.error('Error fetching orders:', error)
    ordersResponse.value = { success: false, message: 'Failed to fetch orders' }
  }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Your Orders</h1>
    <div v-if="ordersResponse.success && ordersResponse.data && ordersResponse.data.length > 0">
      <div
        v-for="order in ordersResponse.data"
        class="bg-base-200 p-4 mb-4 rounded-lg shadow-md"
        :key="order.id"
      >
        <RouterLink :to="`/order/${order.id}`">
          <h2 class="text-xl font-semibold">Order #{{ order.id }}</h2>
          <p>
            Order Date:
            {{
              new Date(order.order_date).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            }}
          </p>
          <p>Total: ${{ order.total_amount }}</p>
        </RouterLink>
        <ul class="space-y-2 my-2">
          <li v-for="item in order.order_items" :key="item.id">
            <div class="bg-base-100 p-2 rounded-md shadow-sm flex flex-row items-center">
              <img
                :src="item.game.image"
                alt="Game Image"
                class="w-16 h-16 mr-4 rounded-md object-cover"
              />
              <div>
                <RouterLink :to="`/games/${item.game.id}`">
                  <p class="font-medium">{{ item.game.title }} (x{{ item.quantity }})</p>
                </RouterLink>
                <p>Price: ${{ item.purchase_price }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <p v-if="ordersResponse.message">{{ ordersResponse.message }}</p>
      <p v-else>No orders found.</p>
    </div>
  </div>
</template>
