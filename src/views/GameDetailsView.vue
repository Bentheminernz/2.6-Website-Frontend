<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import type { Game } from '../types/Game'
import { GamePlatform } from '../types/Game'
import { fetchSpecificGame } from '@/utils/fetchGame'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import CartButton from '@/components/CartButton.vue'

const authStore = useAuthStore()
const route = useRoute()
const gameId = Number(route.params.id as string)

const gameResponse = ref<{ success: boolean; data?: Game; message?: string }>({ success: false })

onMounted(async () => {
  try {
    const response = await fetchSpecificGame(gameId)
    gameResponse.value = response
  } catch (error) {
    console.error('Error fetching game:', error)
    gameResponse.value = { success: false, message: 'Failed to fetch game' }
  }
})

const getPlatformDisplayName = (platform: string): string => {
  if (Object.values(GamePlatform).includes(platform as GamePlatform)) {
    return platform
  }

  return GamePlatform[platform as keyof typeof GamePlatform] || platform
}

const isOwned = computed(() => {
  return authStore.ownedGames.some((game) => game.game.id === gameId)
})
</script>

<template>
  <div v-if="gameResponse.success">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div class="flex justify-center">
        <img
          v-if="gameResponse.data?.image"
          :src="gameResponse.data.image"
          alt="Game Cover"
          class="w-64 max-h-fit object-cover rounded-lg shadow-md"
        />
        <p v-else class="text-gray-500">No image available</p>
      </div>

      <div class="flex flex-col">
        <h1 class="text-2xl font-bold">{{ gameResponse.data?.title }}</h1>
        <p class="text-gray-600 mt-2">
          Developer: {{ gameResponse.data?.developer || 'Unknown' }} | Publisher:
          {{ gameResponse.data?.publisher || 'Unknown' }}
        </p>

        <p>
          <span
            v-for="genre in gameResponse.data?.genres || []"
            :key="genre.id"
            class="badge badge-secondary mr-1"
            >{{ genre.name }}</span
          >
        </p>

        <p class="mt-2">Supported Platforms</p>
        <ul class="list-disc pl-5">
          <li v-for="platform in gameResponse.data?.platforms || []" :key="platform.id">
            {{ getPlatformDisplayName(platform.name) }}
          </li>
        </ul>
        <div v-if="gameResponse.data?.is_sale" class="mt-2">
          <p class="text-md font-bold line-through mr-2 text-gray-400/80">
            Original Price: ${{ gameResponse.data?.price }}
          </p>
          <p class="text-xl font-bold text-red-500">
            Sale Price: ${{ gameResponse.data?.sale_price }}
          </p>
          <p class="text-sm text-gray-500" v-if="gameResponse.data?.sale_end_date">
            Sale ends on {{ new Date(gameResponse.data.sale_end_date).toLocaleDateString() }}
          </p>
        </div>

        <p class="text-lg font-semibold mt-2" v-else>Price: ${{ gameResponse.data?.price }}</p>

        <div v-if="isOwned" class="mt-4">
          <button class="btn btn-primary mt-2" @click="$router.push(`/library`)">
            Download Game
          </button>
        </div>

        <CartButton :game-id="gameResponse.data?.id ?? 0" v-else class="mt-4" />
      </div>
    </div>

    <p class="mt-4 p-4 bg-base-200 rounded-lg shadow-lg">
      <strong>Description:</strong>
      {{ gameResponse.data?.description || 'No description available' }}
    </p>
  </div>
</template>
