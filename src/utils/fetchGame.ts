import type { Game } from '@/types/Game'

export interface GamesPagination {
  current_page: number
  page_size: number
  total_games: number
  total_pages: number
  has_next: boolean
  has_previous: boolean
}
export interface GamesResponse {
  success: boolean
  data?: {
    games: Game[]
    pagination?: GamesPagination
  }
  message?: string
}

export async function fetchAllGames(
  platform: string | null = null,
  genre: string | null = null,
  is_sale: boolean | null = null,
  sort_by: string | null = null,
  search: string | null = null,
  page: number = 1,
  page_size: number = 50,
): Promise<GamesResponse> {
  try {
    const params = new URLSearchParams()
    if (platform) params.append('platform', platform)
    if (genre) params.append('genre', genre)
    if (is_sale !== null) params.append('is_sale', is_sale.toString())
    if (sort_by) params.append('sort_by', sort_by)
    if (search) params.append('search', search)
    params.append('page', page.toString())
    params.append('page_size', page_size.toString())

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
    return {
      success: true,
      data: {
        games: data.data.games as Game[],
        pagination: data.data.pagination as GamesPagination,
      },
    }
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
