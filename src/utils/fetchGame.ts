import { useAuthStore } from '@/stores/authStore'
import type { Game } from '@/types/Game'

export async function fetchAllGames(): Promise<{
  success: boolean
  games?: Game[]
  message?: string
}> {
  const authStore = useAuthStore()
  const token = authStore.token

  try {
    const response = await fetch('/api/all-games/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, message: errorData.message || 'Failed to fetch games' }
    }

    const data = await response.json()
    return { success: true, games: data.data as Game[] }
  } catch (error) {
    console.error('Error fetching games:', error)
    return { success: false, message: 'An unexpected error occurred while fetching games' }
  }
}
