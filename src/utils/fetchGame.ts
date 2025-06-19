import { useAuthStore } from '@/stores/authStore'
import type { BasicGame, Game, GamePlatform, GameGenre } from '@/types/Game'

export async function fetchAllGames(
  platform: string | null = null,
  genre: string | null = null,
  is_sale: boolean | null = null,
  sort_by: string | null = null,
  search: string | null = null,
): Promise<{
  success: boolean
  games?: BasicGame[]
  message?: string
}> {
  const authStore = useAuthStore()
  const token = authStore.token

  try {
    const params = new URLSearchParams()
    if (platform) params.append('platform', platform)
    if (genre) params.append('genre', genre)
    if (is_sale !== null) params.append('is_sale', is_sale.toString())
    if (sort_by) params.append('sort_by', sort_by)
    if (search) params.append('search', search)

    const response = await fetch(`/api/games/all/?${params.toString()}`, {
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
    return { success: true, games: data.data as BasicGame[] }
  } catch (error) {
    console.error('Error fetching games:', error)
    return { success: false, message: 'An unexpected error occurred while fetching games' }
  }
}

export async function fetchSpecificGame(gameId: number): Promise<{
  success: boolean
  data?: Game
  message?: string
}> {
  try {
    const response = await fetch(`/api/games/specific/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ game_id: gameId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, message: errorData.message || 'Failed to fetch game' }
    }

    const data = await response.json()
    return { success: true, data: data.data as Game }
  } catch (error) {
    console.error('Error fetching game:', error)
    return { success: false, message: 'An unexpected error occurred while fetching the game' }
  }
}
