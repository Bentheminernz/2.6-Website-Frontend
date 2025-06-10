<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Game } from '../types/Game'
import { fetchAllGames } from '@/utils/fetchGame'
import { addGameToCart, removeGameFromCart } from '@/utils/gameCartEdit'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const gamesReponse = ref<{ success: boolean; games?: Game[]; message?: string }>({ success: false })
const hoveredGameId = ref<number | null>(null)

onMounted(async () => {
  try {
    const response = await fetchAllGames()
    gamesReponse.value = response
  } catch (error) {
    console.error('Error fetching games:', error)
    gamesReponse.value = { success: false, message: 'Failed to fetch games' }
  }
})

const handleAddToCart = async (gameId: number) => {
  try {
    const result = await addGameToCart(gameId)
    if (result.success) {
      console.log('Game added to cart:', gameId)
      await authStore.fetchUser()
    } else {
      console.error('Failed to add game to cart:', result.message)
    }
  } catch (error) {
    console.error('Error adding game to cart:', error)
  }
}

const handleRemoveFromCart = async (gameId: number) => {
  try {
    const result = await removeGameFromCart(gameId)
    if (result.success) {
      console.log('Game removed from cart:', gameId)
      await authStore.fetchUser()
    } else {
      console.error('Failed to remove game from cart:', result.message)
    }
  } catch (error) {
    console.error('Error removing game from cart:', error)
  }
}

const handleCartAction = async (gameId: number) => {
  if (isGameInCart(gameId)) {
    await handleRemoveFromCart(gameId)
  } else {
    await handleAddToCart(gameId)
  }
}

const isGameInCart = (gameId: number): boolean => {
  if (!authStore.user?.cart_items) return false
  return authStore.user.cart_items.some((item) => item.game.id === gameId)
}

const getButtonText = (gameId: number): string => {
  const inCart = isGameInCart(gameId)
  const isHovered = hoveredGameId.value === gameId

  if (inCart && isHovered) {
    return 'Remove from Cart'
  } else if (inCart) {
    return 'Added'
  } else {
    return 'Add to Cart'
  }
}

const getButtonClass = (gameId: number): string => {
  const inCart = isGameInCart(gameId)
  const isHovered = hoveredGameId.value === gameId

  if (inCart && isHovered) {
    return 'btn-error'
  } else if (inCart) {
    return 'btn-success'
  } else {
    return 'btn-primary'
  }
}
</script>

<template>
  <h1>Games View</h1>
  <div v-if="gamesReponse.success">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="game in gamesReponse.games" :key="game.id" class="card bg-base-100 shadow-xl">
        <figure>
          <img :src="game.image" alt="Game Image" class="w-full max-h-100 object-cover" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ game.title }}</h2>
          <p>{{ game.description }}</p>
          <p class="text-lg font-bold">${{ game.price }}</p>
          <div class="card-actions justify-end">
            <button
              class="btn transition-all duration-300 ease-in-out"
              :class="getButtonClass(game.id)"
              @click="handleCartAction(game.id)"
              @mouseenter="hoveredGameId = game.id"
              @mouseleave="hoveredGameId = null"
            >
              <span class="text-white transition-all duration-300 ease-in-out">{{
                getButtonText(game.id)
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="gamesReponse.message">
    <p>{{ gamesReponse.message }}</p>
  </div>
  <div v-else>
    <span class="loading loading-spinner loading-xl"></span>
  </div>
</template>
