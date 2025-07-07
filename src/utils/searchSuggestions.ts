import { useToastStore } from "@/stores/toast";

export interface SearchSuggestion {
  id: number
  title: string
}

export async function fetchSearchSuggestions(
  query: string,
): Promise<{ success: boolean; message?: string; data?: SearchSuggestion[] }> {
  const toastStore = useToastStore()

  try {
    const response = await fetch(`/api/search/suggestion?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      toastStore.showError(errorData.message || 'Failed to fetch search suggestions')
      return { success: false, message: errorData.message || 'Failed to fetch search suggestions' }
    }

    const data = await response.json()
    return {
      success: true,
      data: data.data as SearchSuggestion[],
    }
  } catch (error) {
    toastStore.showError('An error occurred while fetching search suggestions')
    return { success: false, message: 'An error occurred while fetching search suggestions' }
  }
}
