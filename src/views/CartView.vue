<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { removeGameFromCart } from '@/utils/gameCartEdit'

const authStore = useAuthStore()

onMounted(() => {
  authStore.fetchUserCart()
})

const handleRemoveFromCart = async (itemId: number) => {
  try {
    const result = await removeGameFromCart(itemId)
    if (result.success) {
      console.log('Game removed from cart:', itemId)
      await authStore.fetchUserCart()
    } else {
      console.error('Failed to remove game from cart:', result.message)
    }
  } catch (error) {
    console.error('Error removing game from cart:', error)
  }
}
</script>

<template>
  <div v-if="authStore.userCart">
    <h1 class="text-3xl font-bold mb-6">Shopping Cart</h1>

    <div v-if="authStore.userCart.cart_items.length === 0" class="text-center py-8">
      <p class="text-lg text-gray-500">Your cart is empty</p>
    </div>

    <div v-else>
      <div class="space-y-4">
        <div
          v-for="item in authStore.userCart.cart_items"
          :key="item.id"
          class="card bg-base-100 shadow-xl"
        >
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <img
                  :src="item.game.image"
                  :alt="item.game.title"
                  class="w-20 h-20 object-cover rounded"
                />
                <div>
                  <RouterLink :to="`/games/${item.game.id}`">
                    <h3 class="card-title">{{ item.game.title }}</h3>
                  </RouterLink>
                  <p class="text-sm text-gray-600">{{ item.game.description.substring(0, 100) }}...</p>
                  <p class="text-sm text-gray-500">Added: {{ new Date(item.added_date).toLocaleDateString() }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <p class="text-lg font-bold">${{ item.game.price }}</p>
                  <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                </div>

                <button
                  @click="handleRemoveFromCart(item.game.id)"
                  class="btn btn-error btn-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 p-4 bg-base-200 rounded-lg">
        <div class="flex justify-between items-center">
          <span class="text-xl font-semibold">Subtotal:</span>
          <span class="text-xl font-bold">${{ authStore.userCart.cart_subtotal }}</span>
        </div>
        <button class="btn btn-primary btn-block mt-4">
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>

  <div v-else-if="authStore.isLoading" class="text-center py-8">
    <span class="loading loading-spinner loading-xl"></span>
  </div>

  <div v-else class="text-center py-8">
    <p class="text-lg text-gray-500">Please log in to view your cart</p>
  </div>
</template>
