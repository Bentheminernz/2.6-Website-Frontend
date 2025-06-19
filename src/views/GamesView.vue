<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import type { BasicGame } from '../types/Game'
import { GameGenre, GamePlatform } from '../types/Game'
import { fetchAllGames } from '@/utils/fetchGame'
import GameCard from '@/components/GameCard.vue'
import GameCardSkeleton from '@/components/GameCardSkeleton.vue'

const gamesReponse = ref<{ success: boolean; games?: BasicGame[]; message?: string }>({ success: false })

const selectedGenre = ref<keyof typeof GameGenre | ''>('')
const selectedPlatform = ref<keyof typeof GamePlatform | ''>('')
const searchQuery = ref('')
const isOnSale = ref(false)
const sortBy = ref<'price_asc' | 'price_desc' | 'release_date' | 'title'>('title')

onMounted(async () => {
  await handleFetchGames()
})

const handleFetchGames = async () => {
  try {
    // gamesReponse.value = { success: false }
    const response = await fetchAllGames(
      selectedPlatform.value,
      selectedGenre.value,
      isOnSale.value,
      sortBy.value,
      searchQuery.value
    )
    gamesReponse.value = response
  } catch (error) {
    console.error('Error fetching games:', error)
    gamesReponse.value = { success: false, message: 'Failed to fetch games' }
  }
}
</script>

<template>
  <div class="flex h-screen">
    <div class="w-64 bg-base-200 p-6 overflow-y-auto sticky top-0 max-h-3/4 rounded-2xl shadow-lg">
      <h2 class="text-xl font-bold mb-6">Filters</h2>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search games..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="searchQuery && handleFetchGames()"
        />
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
        <select
          v-model="sortBy"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="title">Title</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="release_date">Release Date</option>
        </select>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Genre</label>
        <select
          v-model="selectedGenre"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Genres</option>
          <option v-for="[key, value] in Object.entries(GameGenre)" :key="key" :value="key">
            {{ value }}
          </option>
        </select>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Platform</label>
        <select
          v-model="selectedPlatform"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Platforms</option>
          <option v-for="[key, value] in Object.entries(GamePlatform)" :key="key" :value="key">
            {{ value }}
          </option>
        </select>
      </div>

      <div class="mb-6">
        <label class="inline-flex items-center">
          <input
            v-model="isOnSale"
            type="checkbox"
            class="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="ml-2 text-sm text-gray-700">Show Only On Sale</span>
        </label>
      </div>

      <button
        @click="handleFetchGames"
        class="btn btn-primary"
        >Apply Filters</button
      >

      <div class="text-sm text-gray-600 mt-4">
        <span v-if="gamesReponse.success">
          {{ gamesReponse.games?.length || 0 }} games found
        </span>
      </div>
    </div>

    <div class="flex-1 p-6 overflow-y-auto">
      <h1 class="text-3xl font-bold mb-6">Games</h1>

      <div v-if="gamesReponse.success">
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <GameCard
            v-for="game in gamesReponse.games"
            :key="game.id"
            :game="game"
          />
        </div>

        <div v-if="gamesReponse.games?.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">No games match your current filters.</p>
        </div>
      </div>

      <div v-else-if="gamesReponse.message">
        <p class="text-red-500">{{ gamesReponse.message }}</p>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <GameCardSkeleton
            v-for="n in 8"
            :key="n"
          />
        </div>
      </div>
    </div>
  </div>
</template>
