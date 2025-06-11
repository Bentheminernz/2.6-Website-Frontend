<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { BasicGame } from '../types/Game'
import { fetchAllGames } from '@/utils/fetchGame'
import CartButton from '@/components/CartButton.vue'

const gamesReponse = ref<{ success: boolean; games?: BasicGame[]; message?: string }>({ success: false })

onMounted(async () => {
  try {
    const response = await fetchAllGames()
    gamesReponse.value = response
  } catch (error) {
    console.error('Error fetching games:', error)
    gamesReponse.value = { success: false, message: 'Failed to fetch games' }
  }
})
</script>

<template>
  <h1>Games View</h1>
  <div v-if="gamesReponse.success">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="game in gamesReponse.games" :key="game.id" class="card bg-base-100 shadow-xl">
        <RouterLink :to="`/games/${game.id}`">
          <figure>
            <img :src="game.image" alt="Game Image" class="w-full max-h-100 object-cover" />
          </figure>
          <div class="card-body">
            <h2 class="card-title">{{ game.title }}</h2>
            <p>{{ game.description.substring(0, 100) }}...</p>
            <p class="text-lg font-bold">${{ game.price }}</p>
          </div>
        </RouterLink>
        <div class="card-body pt-0">
          <div class="card-actions justify-end">
            <CartButton
              :game-id="game.id"
            />
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
