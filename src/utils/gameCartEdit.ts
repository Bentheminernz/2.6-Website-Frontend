import type { BasicCartItem } from '@/types/User'
import { useAuthStore } from '@/stores/authStore'

export async function addGameToCart(
  gameId: number,
): Promise<{ success: boolean; message?: string; data?: BasicCartItem[] }> {
  const authStore = useAuthStore()
  const token = authStore.token

  try {
    const response = await fetch('/api/cart/edit/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ game_id: gameId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, message: errorData.message || 'Failed to add game to cart' }
    }

    const data = await response.json()
    return { success: true, data: data.data as BasicCartItem[] }
  } catch (error) {
    console.error('Error adding game to cart:', error)
    return {
      success: false,
      message: 'An unexpected error occurred while adding the game to the cart',
    }
  }
}

export async function removeGameFromCart(
  gameId: number,
): Promise<{ success: boolean; message?: string; data?: BasicCartItem[] }> {
  const authStore = useAuthStore()
  const token = authStore.token

  try {
    const response = await fetch(`/api/cart/edit/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ game_id: gameId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, message: errorData.message || 'Failed to remove game from cart' }
    }

    const data = await response.json()
    return { success: true, data: data.data as BasicCartItem[] }
  } catch (error) {
    console.error('Error removing game from cart:', error)
    return {
      success: false,
      message: 'An unexpected error occurred while removing the game from the cart',
    }
  }
}
