<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Game } from '../types/Game'
import { GamePlatform } from '../types/Game'
import { fetchSpecificGame } from '@/utils/fetchGame'
import { useRoute } from 'vue-router'
import CartButton from '@/components/CartButton.vue'

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

        <p class="text-lg font-semibold mt-2">Price: ${{ gameResponse.data?.price }}</p>

        <CartButton :game-id="gameResponse.data?.id ?? 0" class="mt-4" />
      </div>
    </div>

    <p class="mt-4 p-4 bg-base-200 rounded-lg shadow-lg">
      <strong>Description:</strong>
      {{ gameResponse.data?.description || 'No description available' }}
    </p>
  </div>
</template>
