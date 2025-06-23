<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import GameCard from '@/components/GameCard.vue'
import GameCardSkeleton from '@/components/GameCardSkeleton.vue'

const authStore = useAuthStore()

onMounted(() => {
  if (!authStore.userCart) {
    authStore.fetchOwnedGames()
  }
})
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">My Game Library</h1>
    <div v-if="authStore.ownedGames.length > 0">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <GameCard
          v-for="game in authStore.ownedGames"
          :key="game.id"
          :game="game.game"
          :show-add-to-cart="false"
        />
      </div>
    </div>

    <div v-else>
      <p class="text-gray-500">You have no games in your library.</p>
    </div>

    <div v-if="authStore.isLoading">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <GameCardSkeleton v-for="n in 8" :key="n" />
      </div>
    </div>

    <div v-else-if="authStore.error">
      <p class="text-red-500">{{ authStore.error }}</p>
    </div>
  </div>
</template>
