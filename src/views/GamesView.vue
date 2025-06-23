<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { GamesResponse } from '../utils/fetchGame'
import { GameGenre, GamePlatform } from '../types/Game'
import { fetchAllGames } from '@/utils/fetchGame'
import GameCard from '@/components/GameCard.vue'
import GameCardSkeleton from '@/components/GameCardSkeleton.vue'

const gamesReponse = ref<GamesResponse>({ success: false })

const selectedGenre = ref<keyof typeof GameGenre | ''>('')
const selectedPlatform = ref<keyof typeof GamePlatform | ''>('')
const searchQuery = ref('')
const isOnSale = ref(false)
const sortBy = ref<'price_asc' | 'price_desc' | 'release_date' | 'title'>('title')
const paginationOptions = ref<1 |12 | 24 | 48 | 96>(24)
const currentPage = ref(1)

onMounted(async () => {
  await handleFetchGames()
})

const handleFetchGames = async () => {
  try {
    const response = await fetchAllGames(
      selectedPlatform.value,
      selectedGenre.value,
      isOnSale.value,
      sortBy.value,
      searchQuery.value,
      currentPage.value,
      paginationOptions.value
    )
    gamesReponse.value = response
  } catch (error) {
    console.error('Error fetching games:', error)
    gamesReponse.value = { success: false, message: 'Failed to fetch games' }
  }
}

const goToPage = async (page: number) => {
  currentPage.value = page
  await handleFetchGames()
}

const goToNextPage = async () => {
  if (gamesReponse.value.data?.pagination?.has_next) {
    currentPage.value++
    await handleFetchGames()
  }
}

const goToPreviousPage = async () => {
  if (gamesReponse.value.data?.pagination?.has_previous) {
    currentPage.value--
    await handleFetchGames()
  }
}

const resetFiltersAndFetch = async () => {
  currentPage.value = 1
  await handleFetchGames()
}
</script>

<template>
  <div class="flex h-screen">
    <div class="w-64 bg-base-200 p-6 overflow-y-auto sticky top-0 max-h-10/12 rounded-2xl shadow-lg">
      <h2 class="text-xl font-bold mb-6">Filters</h2>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search games..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="searchQuery && resetFiltersAndFetch()"
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
        <label class="block text-sm font-medium text-gray-700 mb-2">Items per page</label>
        <select
          v-model="paginationOptions"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1">1 per page</option>
          <option value="12">12 per page</option>
          <option value="24">24 per page</option>
          <option value="48">48 per page</option>
          <option value="96">96 per page</option>
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
        @click="resetFiltersAndFetch"
        class="btn btn-primary"
        >Apply Filters</button
      >

      <div class="text-sm text-gray-600 mt-4">
        <span v-if="gamesReponse.success && gamesReponse.data?.pagination">
          Showing {{ gamesReponse.data?.games?.length || 0 }} of {{ gamesReponse.data?.pagination.total_games }} games
          <br/>
          Page {{ gamesReponse.data?.pagination.current_page }} of {{ gamesReponse.data?.pagination.total_pages }}
        </span>
        <span v-else-if="gamesReponse.success">
          {{ gamesReponse.data?.games?.length || 0 }} games found
        </span>
      </div>
    </div>

    <div class="flex-1 p-6 overflow-y-auto">
      <h1 class="text-3xl font-bold mb-6">Games</h1>

      <div v-if="gamesReponse.success">
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <GameCard
            v-for="game in gamesReponse.data?.games"
            :key="game.id"
            :game="game"
          />
        </div>

        <div v-if="gamesReponse.data?.games.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">No games match your current filters.</p>
        </div>

        <div v-if="gamesReponse.data?.pagination && gamesReponse.data?.pagination.total_pages > 1" class="flex justify-center items-center mt-8 space-x-2">
          <button
            @click="goToPreviousPage"
            :disabled="!gamesReponse.data?.pagination.has_previous"
            class="btn btn-outline"
            :class="{ 'btn-disabled': !gamesReponse.data?.pagination.has_previous }"
          >
            Previous
          </button>

          <!-- Page Numbers -->
          <div class="flex space-x-1">
            <template v-for="page in Math.min(gamesReponse.data?.pagination.total_pages, 10)" :key="page">
              <button
                @click="goToPage(page)"
                class="btn btn-sm"
                :class="{ 'btn-primary': page === gamesReponse.data?.pagination.current_page, 'btn-outline': page !== gamesReponse.data?.pagination.current_page }"
              >
                {{ page }}
              </button>
            </template>

            <!-- Show dots if there are more than 10 pages -->
            <span v-if="gamesReponse.data?.pagination.total_pages > 10" class="px-2 py-1">...</span>
          </div>

          <!-- Next Button -->
          <button
            @click="goToNextPage"
            :disabled="!gamesReponse.data?.pagination.has_next"
            class="btn btn-outline"
            :class="{ 'btn-disabled': !gamesReponse.data?.pagination.has_next }"
          >
            Next
          </button>
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
