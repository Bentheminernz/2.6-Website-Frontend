<script lang="ts" setup>
import { defineProps } from 'vue'
import type { Game } from '../types/Game'
import CartButton from '@/components/CartButton.vue'

const props = withDefaults(
  defineProps<{
    game: Game
    showAddToCart?: boolean
  }>(),
  {
    showAddToCart: true,
  },
)
</script>

<template>
  <div class="card bg-base-100 shadow-xl hover:scale-102 active:scale-98 transition-transform duration-300">
    <RouterLink :to="`/games/${props.game.id}`">
      <figure>
        <img
          :src="game.image"
          alt="Game Image"
          class="w-full max-h-100 object-cover rounded-t-2xl"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">{{ props.game.title }}</h2>
        <p>{{ game.description.substring(0, 100) }}...</p>
        <div v-if="!game.is_sale && showAddToCart">
          <p class="text-lg font-bold">${{ props.game.price }}</p>
        </div>

        <div v-else-if="showAddToCart">
          <p class="text-md font-bold line-through mr-2 text-gray-400/80">${{ props.game.price }}</p>
          <p class="text-xl font-bold text-red-500">${{ props.game.sale_price }}</p>
          <p class="text-sm text-gray-500" v-if="props.game.sale_end_date">Sale ends on {{ new Date(props.game.sale_end_date).toLocaleDateString() }}</p>
        </div>
      </div>
    </RouterLink>
    <div class="card-body pt-0">
      <div class="card-actions justify-end">
        <CartButton v-if="showAddToCart" :game-id="props.game.id" />

        <button v-else class="btn btn-primary">Download</button>
      </div>
    </div>
  </div>
</template>
