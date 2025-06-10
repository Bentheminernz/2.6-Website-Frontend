<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { ref, onMounted } from 'vue'
import type { Game } from '../types/Game'
import { fetchAllGames } from '@/utils/fetchGame'

const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const gamesReponse = ref<{ success: boolean; games?: Game[]; message?: string }>({ success: false })

const handleFetchAllGames = async () => {
  try {
    const response = await fetchAllGames()
    gamesReponse.value = response
  } catch (error) {
    console.error('Error fetching games:', error)
    gamesReponse.value = { success: false, message: 'Failed to fetch games' }
  }
}
</script>

<template>
  <h1>Home View</h1>
  <fieldset class="fieldset">
    <label for="username">Username:</label>
    <input class="input" type="text" id="username" v-model="username" />

    <label for="password">Password:</label>
    <input class="input" type="password" id="password" v-model="password" />

    <button class="btn btn-primary" @click="authStore.login(username, password)">Login</button>
  </fieldset>

  <div v-if="authStore.isAuthenticated">
    <h2>Welcome, {{ authStore.user?.username }}!</h2>

    <button class="btn btn-secondary" @click="handleFetchAllGames">Fetch All Games</button>
    <div v-if="gamesReponse.success">
      <div v-for="game in gamesReponse.games" :key="game.id">
        <h3>{{ game.title }}</h3>
        <p>{{ game.description }}</p>
        <img :src="game.image" alt="Game Image" />
      </div>
    </div>
  </div>
</template>
