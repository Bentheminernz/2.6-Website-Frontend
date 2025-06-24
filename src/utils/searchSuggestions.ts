export interface SearchSuggestion {
  id: number
  title: string
}

export async function fetchSearchSuggestions(
  query: string,
): Promise<{ success: boolean; message?: string; data?: SearchSuggestion[] }> {
  try {
    const response = await fetch(`/api/search/suggestion?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, message: errorData.message || 'Failed to fetch search suggestions' }
    }

    const data = await response.json()
    return {
      success: true,
      data: data.data as SearchSuggestion[],
    }
  } catch (error) {
    return { success: false, message: 'An error occurred while fetching search suggestions' }
  }
}
