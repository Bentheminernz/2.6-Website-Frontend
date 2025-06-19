<script lang="ts" setup>
import { defineProps } from 'vue'
import type { BasicGame } from '../types/Game'
import CartButton from '@/components/CartButton.vue'

const props = withDefaults(
  defineProps<{
    game: BasicGame
    showAddToCart?: boolean
  }>(),
  {
    showAddToCart: true,
  },
)
</script>

<template>
  <div class="card bg-base-100 shadow-xl hover:scale-102 active:scale-98 transition-transform duration-300">
    <RouterLink :to="`/games/${game.id}`">
      <figure>
        <img
          :src="game.image"
          alt="Game Image"
          class="w-full max-h-100 object-cover rounded-t-2xl"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">{{ game.title }}</h2>
        <p>{{ game.description.substring(0, 100) }}...</p>
        <p class="text-lg font-bold">${{ game.price }}</p>
      </div>
    </RouterLink>
    <div class="card-body pt-0">
      <div class="card-actions justify-end">
        <CartButton v-if="showAddToCart" :game-id="game.id" />

        <button v-else class="btn btn-primary">Download</button>
      </div>
    </div>
  </div>
</template>
