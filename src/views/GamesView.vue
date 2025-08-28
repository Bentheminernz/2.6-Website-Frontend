<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { GamesResponse } from '../utils/fetchGame'
import { GameGenre, GamePlatform } from '../types/Game'
import { fetchAllGames } from '@/utils/fetchGame'
import GameCard from '@/components/GameCard.vue'
import GameCardSkeleton from '@/components/GameCardSkeleton.vue'
import { fetchSearchSuggestions } from '@/utils/searchSuggestions'
import type { SearchSuggestion } from '@/utils/searchSuggestions'
import { PhWarningCircle, PhFunnel, PhX, PhMagnifyingGlass } from '@phosphor-icons/vue'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const gamesReponse = ref<GamesResponse>({ success: false })
const isMobileFiltersOpen = ref(false)

const selectedGenre = ref<keyof typeof GameGenre | ''>(
  (route.query.genre as keyof typeof GameGenre) || '',
)
const selectedPlatform = ref<keyof typeof GamePlatform | ''>(
  (route.query.platform as keyof typeof GamePlatform) || '',
)
const searchQuery = ref((route.query.search as string) || '')
const isOnSale = ref(route.query.onSale === 'true')
const sortBy = ref<'price_asc' | 'price_desc' | 'release_date' | 'title'>(
  (route.query.sortBy as 'price_asc' | 'price_desc' | 'release_date' | 'title') || 'title',
)
const paginationOptions = ref<12 | 24 | 48 | 96>(
  (() => {
    const perPage = parseInt(route.query.perPage as string)
    return [12, 24, 48, 96].includes(perPage) ? (perPage as 12 | 24 | 48 | 96) : 12
  })(),
)
const hideOwnedGames = ref(route.query.hideOwned === 'true')
const currentPage = ref(parseInt(route.query.page as string) || 1)

onMounted(async () => {
  await handleFetchGames()
})

const suggestions = ref<SearchSuggestion[]>([])
const isLoadingSuggestions = ref(false)

const fetchSuggestions = async (query: string) => {
  if (!query) {
    suggestions.value = []
    return
  }

  isLoadingSuggestions.value = true
  try {
    const response = await fetchSearchSuggestions(query)
    if (response.success) {
      suggestions.value = response.data || []
    } else {
      suggestions.value = []
    }
  } catch {
    suggestions.value = []
  } finally {
    isLoadingSuggestions.value = false
  }
}

watch(searchQuery, (newQuery) => {
  fetchSuggestions(newQuery)
})

const onSearchEnter = () => {
  currentPage.value = 1
  updateURL()
}

const updateURL = () => {
  const query: Record<string, string> = {}

  if (selectedGenre.value) query.genre = selectedGenre.value
  if (selectedPlatform.value) query.platform = selectedPlatform.value
  if (searchQuery.value) query.search = searchQuery.value
  if (isOnSale.value) query.onSale = 'true'
  if (hideOwnedGames.value) query.hideOwned = 'true'
  if (sortBy.value !== 'title') query.sortBy = sortBy.value
  if (paginationOptions.value !== 24) query.perPage = paginationOptions.value.toString()
  if (currentPage.value !== 1) query.page = currentPage.value.toString()

  router.push({
    name: 'games',
    query: Object.keys(query).length > 0 ? query : undefined,
  })
}

watch(
  [selectedGenre, selectedPlatform, isOnSale, sortBy, paginationOptions, hideOwnedGames],
  () => {
    currentPage.value = 1
    updateURL()
  },
)

watch(currentPage, () => {
  updateURL()
  handleFetchGames()
})

watch(
  () => route.query,
  (newQuery) => {
    selectedGenre.value = (newQuery.genre as keyof typeof GameGenre) || ''
    selectedPlatform.value = (newQuery.platform as keyof typeof GamePlatform) || ''
    searchQuery.value = (newQuery.search as string) || ''
    isOnSale.value = newQuery.onSale === 'true'
    sortBy.value =
      (newQuery.sortBy as 'price_asc' | 'price_desc' | 'release_date' | 'title') || 'title'

    const perPage = parseInt(newQuery.perPage as string)
    paginationOptions.value = [12, 24, 48, 96].includes(perPage)
      ? (perPage as 12 | 24 | 48 | 96)
      : 24

    hideOwnedGames.value = newQuery.hideOwned === 'true'
    currentPage.value = parseInt(newQuery.page as string) || 1

    handleFetchGames()
  },
  { deep: true },
)

const handleFetchGames = async () => {
  try {
    const response = await fetchAllGames(
      selectedPlatform.value,
      selectedGenre.value,
      isOnSale.value,
      hideOwnedGames.value,
      sortBy.value,
      searchQuery.value,
      currentPage.value,
      paginationOptions.value,
    )
    gamesReponse.value = response
  } catch (error) {
    console.error('Error fetching games:', error)
    gamesReponse.value = { success: false, message: 'Failed to fetch games' }
  }
}

const goToPage = async (page: number) => {
  currentPage.value = page
}

const goToNextPage = async () => {
  if (gamesReponse.value.data?.pagination?.has_next) {
    currentPage.value++
  }
}

const goToPreviousPage = async () => {
  if (gamesReponse.value.data?.pagination?.has_previous) {
    currentPage.value--
  }
}

const resetFiltersAndFetch = async () => {
  selectedGenre.value = ''
  selectedPlatform.value = ''
  searchQuery.value = ''
  isOnSale.value = false
  sortBy.value = 'title'
  paginationOptions.value = 12
  hideOwnedGames.value = false
  currentPage.value = 1

  router.push({ name: 'games' })
  await handleFetchGames()
}
</script>

<template>
  <div class="flex h-screen relative">
    <div
      v-if="isMobileFiltersOpen"
      @click="isMobileFiltersOpen = false"
      class="lg:hidden fixed inset-0 bg-black/60 z-40 transition-all duration-300"
    ></div>

    <div
      class="bg-base-200 p-6 overflow-y-auto lg:rounded-2xl rounded-tr-3xl rounded-br-3xl shadow-lg z-50 transition-transform duration-300 ease-in-out"
      :class="{
        'lg:w-72 lg:static lg:translate-x-0': true,
        'fixed top-0 left-0 h-full w-80 max-w-[85vw]': true,
        'transform -translate-x-full': !isMobileFiltersOpen,
        'transform translate-x-0': isMobileFiltersOpen,
      }"
    >
      <button
        @click="isMobileFiltersOpen = false"
        class="lg:hidden absolute top-4 right-4 btn btn-ghost btn-sm z-10"
      >
        <PhX class="w-4 h-4" />
      </button>

      <h2 class="text-xl font-bold mb-6">Filters</h2>

      <div class="mb-6 relative">
        <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search games..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            @keyup.enter="onSearchEnter"
          />
          <button
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none hover:cursor-pointer hover:scale-105 transition-all duration-300"
            @click="onSearchEnter"
            aria-label="Search"
          >
            <PhMagnifyingGlass class="w-5 h-5" />
          </button>
        </div>

        <ul
          v-if="suggestions.length > 0"
          class="mt-2 bg-base-200 border border-gray-300/50 rounded-md shadow-lg"
        >
          <li
            v-for="suggestion in suggestions"
            :key="suggestion.id"
            class="px-3 py-2 hover:bg-base-300 rounded-md cursor-pointer"
            @click="router.push(`/games/${suggestion.id}`)"
          >
            {{ suggestion.title }}
          </li>
          <li
            v-if="suggestions.length === 0 && !isLoadingSuggestions"
            class="px-3 py-2 text-gray-500"
          >
            No suggestions found
          </li>
        </ul>
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
          <option value="12">12 per page</option>
          <option value="24">24 per page</option>
          <option value="48">48 per page</option>
          <option value="96">96 per page</option>
        </select>
      </div>

      <div class="mb-6 space-y-3">
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="isOnSale" type="checkbox" class="checkbox checkbox-primary" />
          <span class="label-text">Show Only On Sale</span>
        </label>

        <div v-if="authStore.isAuthenticated">
          <label class="label cursor-pointer justify-start gap-3">
            <input v-model="hideOwnedGames" type="checkbox" class="checkbox checkbox-primary" />
            <span class="label-text">Don't Show Owned Games</span>
          </label>
        </div>
      </div>

      <button @click="resetFiltersAndFetch" class="btn btn-secondary w-full">Reset Filters</button>

      <div class="text-sm text-gray-600 mt-4">
        <span v-if="gamesReponse.success && gamesReponse.data?.pagination">
          Showing {{ gamesReponse.data?.games?.length || 0 }} of
          {{ gamesReponse.data?.pagination.total_games }} games
          <br />
          Page {{ gamesReponse.data?.pagination.current_page }} of
          {{ gamesReponse.data?.pagination.total_pages }}
        </span>
        <span v-else-if="gamesReponse.success">
          {{ gamesReponse.data?.games?.length || 0 }} games found
        </span>
      </div>
    </div>

    <div class="flex-1 p-6 lg:overflow-y-auto lg:ml-0">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">
          Games <span v-if="route.query.search">- "{{ route.query.search }}"</span>
        </h1>

        <button
          @click="isMobileFiltersOpen = !isMobileFiltersOpen"
          class="lg:hidden btn btn-primary transition-all duration-300"
          :class="{ 'btn-secondary': isMobileFiltersOpen }"
        >
          <PhFunnel class="w-5 h-5" />
          <span class="ml-2">Filters</span>
        </button>
      </div>

      <div v-if="gamesReponse.success">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <GameCard v-for="game in gamesReponse.data?.games" :key="game.id" :game="game" />
        </div>

        <div v-if="gamesReponse.data?.games.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">No games match your current filters.</p>
        </div>

        <div
          v-if="gamesReponse.data?.pagination && gamesReponse.data?.pagination.total_pages > 1"
          class="flex justify-center items-center mt-8 space-x-2"
        >
          <button
            @click="goToPreviousPage"
            :disabled="!gamesReponse.data?.pagination.has_previous"
            class="btn btn-outline"
            :class="{ 'btn-disabled': !gamesReponse.data?.pagination.has_previous }"
          >
            Previous
          </button>

          <div class="flex space-x-1">
            <template
              v-for="page in Math.min(gamesReponse.data?.pagination.total_pages, 10)"
              :key="page"
            >
              <button
                @click="goToPage(page)"
                class="btn btn-sm"
                :class="{
                  'btn-primary': page === gamesReponse.data?.pagination.current_page,
                  'btn-outline': page !== gamesReponse.data?.pagination.current_page,
                }"
              >
                {{ page }}
              </button>
            </template>

            <span v-if="gamesReponse.data?.pagination.total_pages > 10" class="px-2 py-1">...</span>
          </div>

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
        <div class="flex items-center justify-center h-64 bg-base-200 rounded-lg shadow-lg">
          <div class="text-center">
            <PhWarningCircle :size="128" class="text-error mb-2 mx-auto" />
            <p class="text-lg text-gray-700">{{ gamesReponse.message }}</p>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <GameCardSkeleton v-for="n in 8" :key="n" />
        </div>
      </div>
    </div>
  </div>
</template>
