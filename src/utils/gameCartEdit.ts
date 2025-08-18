import type { BasicCartItem } from '@/types/User'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toast'

export async function addGameToCart(
  gameId: number,
): Promise<{ success: boolean; message?: string; data?: BasicCartItem[] }> {
  const authStore = useAuthStore()
  const toastStore = useToastStore()
  const token = authStore.token

  if (!token) {
    toastStore.showError('You must be logged in to add a game to the cart')
    return { success: false, message: 'User not authenticated' }
  }

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
      toastStore.showError(errorData.message || 'Failed to add game to cart')
      return { success: false, message: errorData.message || 'Failed to add game to cart' }
    }

    const data = await response.json()
    toastStore.showSuccess('Added game to cart', 1000)
    return { success: true, data: data.data as BasicCartItem[] }
  } catch (error) {
    console.error('Error adding game to cart:', error)
    toastStore.showError('An unexpected error occurred while adding the game to the cart')
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
  const toastStore = useToastStore()
  const token = authStore.token

  if (!token) {
    toastStore.showError('You must be logged in to remove a game from the cart')
    return { success: false, message: 'User not authenticated' }
  }

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
      toastStore.showError(errorData.message || 'Failed to remove game from cart')
      return { success: false, message: errorData.message || 'Failed to remove game from cart' }
    }

    const data = await response.json()
    toastStore.showSuccess('Removed game from cart', 1000)
    return { success: true, data: data.data as BasicCartItem[] }
  } catch (error) {
    console.error('Error removing game from cart:', error)
    toastStore.showError('An unexpected error occurred while removing the game from the cart')
    return {
      success: false,
      message: 'An unexpected error occurred while removing the game from the cart',
    }
  }
}
