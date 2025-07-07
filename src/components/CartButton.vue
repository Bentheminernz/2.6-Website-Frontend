x<script lang="ts" setup>
import { ref, computed, defineProps } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { addGameToCart, removeGameFromCart } from '@/utils/gameCartEdit'
import { useRouter } from 'vue-router';
import { PhX, PhPlus, PhCheck } from '@phosphor-icons/vue';

const props = defineProps<{
  gameId: number
  isGamePreorder: boolean
}>()
const authStore = useAuthStore()
const router = useRouter()

const hoveredGameId = ref<number | null>(null)

const handleAddToCart = async () => {
  if (!authStore.isAuthenticated) {
    await router.push({ name: 'login', query: { redirect: '/games' } })
    return
  }

  try {
    const result = await addGameToCart(props.gameId)
    if (result.success) {
      console.log('Game added to cart:', props.gameId)
      await authStore.fetchUser()
    } else {
      console.error('Failed to add game to cart:', result.message)
    }
  } catch (error) {
    console.error('Error adding game to cart:', error)
  }
}

const handleRemoveFromCart = async () => {
  if (!authStore.isAuthenticated) {
    await router.push({ name: 'login', query: { redirect: '/games' } })
    return
  }

  try {
    const result = await removeGameFromCart(props.gameId)
    if (result.success) {
      console.log('Game removed from cart:', props.gameId)
      await authStore.fetchUser()
    } else {
      console.error('Failed to remove game from cart:', result.message)
    }
  } catch (error) {
    console.error('Error removing game from cart:', error)
  }
}

const isGameInCart = computed(() => {
  return authStore.user?.cart_items.some((item) => item.game_id === props.gameId) || false
})

const handleCartAction = async () => {
  if (isGameInCart.value) {
    await handleRemoveFromCart()
  } else {
    await handleAddToCart()
  }
}

const getButtonText = (gameId: number): string => {
  const isHovered = hoveredGameId.value === gameId

  if (authStore.ownedGames.some((game) => game.game.id === gameId)) {
    return 'Owned'
  } else if (isGameInCart.value && isHovered) {
    return 'Remove from Cart'
  } else if (isGameInCart.value) {
    return 'Added'
  } else if (props.isGamePreorder) {
    return 'Pre-order'
  } else {
    return 'Add to Cart'
  }
}

const getButtonClass = (gameId: number): string => {
  const isHovered = hoveredGameId.value === gameId

  if (authStore.ownedGames.some((game) => game.game.id === gameId)) {
    return 'btn-disabled'
  } else if (isGameInCart.value && isHovered) {
    return 'btn-error'
  } else if (isGameInCart.value) {
    return 'btn-success'
  } else {
    return 'btn-primary'
  }
}
</script>

<template>
  <button
    class="btn transition-all duration-300 ease-in-out"
    :class="getButtonClass(props.gameId)"
    @click="handleCartAction()"
    @mouseenter="hoveredGameId = props.gameId"
    @mouseleave="hoveredGameId = null"
  >
    <span class="text-white transition-all duration-300 ease-in-out items-center flex">
      <PhPlus
        v-if="getButtonText(props.gameId) === 'Add to Cart' || getButtonText(props.gameId) === 'Pre-order'"
        class="inline-block mr-1"
      />

      <PhX
        v-if="getButtonText(props.gameId) === 'Remove from Cart'"
        class="inline-block mr-1 font-bold"
      />

      <PhCheck
        v-if="getButtonText(props.gameId) === 'Added' || getButtonText(props.gameId) === 'Owned'"
        class="inline-block mr-1"
      />

      {{getButtonText(props.gameId)}}
    </span>
  </button>
</template>
