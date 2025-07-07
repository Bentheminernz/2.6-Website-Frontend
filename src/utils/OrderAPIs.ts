import { useAuthStore } from '@/stores/authStore'
import type { CheckoutFormData } from '@/types/User'
import type { OrderResponse } from '@/types/Game'
import { useToastStore } from '@/stores/toast'

export async function createOrder(
  formData: CheckoutFormData,
): Promise<{ success: boolean; message?: string; data?: OrderResponse }> {
  const authStore = useAuthStore()
  const toastStore = useToastStore()

  if (!authStore.token) {
    toastStore.showError('You must be logged in to create an order')
    return { success: false, message: 'User not authenticated' }
  }

  try {
    const response = await fetch('/api/order/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${authStore.token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        form_data: formData,
        game_ids: authStore.userCart?.cart_items.map((item) => item.game.id) || [],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      toastStore.showError(errorData.message || 'Failed to create order')
      return { success: false, message: errorData.message || 'Failed to create order' }
    }

    const rawResponse = await response.json()
    toastStore.showSuccess('Order created successfully')
    return { success: true, data: rawResponse.data as OrderResponse }
  } catch (error) {
    console.error('Error creating order:', error)
    return { success: false, message: 'An error occurred while creating the order' }
  }
}

export async function fetchOrderDetails(
  orderId: string,
): Promise<{ success: boolean; message?: string; data?: OrderResponse }> {
  const authStore = useAuthStore()
  const toastStore = useToastStore()

  if (!authStore.token) {
    toastStore.showError('You must be logged in to fetch order details')
    return { success: false, message: 'User not authenticated' }
  }

  try {
    const response = await fetch('/api/order/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${authStore.token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({ order_id: orderId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      toastStore.showError(errorData.message || 'Failed to fetch order details')
      return { success: false, message: errorData.message || 'Failed to fetch order details' }
    }
    const data = await response.json()
    authStore.fetchOwnedGames()

    return { success: true, data: data.data }
  } catch (error) {
    console.error('Error fetching order details:', error)
    toastStore.showError('An error occurred while fetching order details')
    return { success: false, message: 'An error occurred while fetching order details' }
  }
}

export async function fetchUserOrders(): Promise<{
  success: boolean
  message?: string
  data?: OrderResponse[]
}> {
  const authStore = useAuthStore()
  const toastStore = useToastStore()

  if (!authStore.token) {
    toastStore.showError('You must be logged in to fetch user orders')
    return { success: false, message: 'User not authenticated' }
  }

  try {
    const response = await fetch('/api/order/', {
      method: 'GET',
      headers: {
        Authorization: `Token ${authStore.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      toastStore.showError(errorData.message || 'Failed to fetch user orders')
      return { success: false, message: errorData.message || 'Failed to fetch user orders' }
    }

    const data = await response.json()
    return { success: true, data: data.data as OrderResponse[] }
  } catch (error) {
    console.error('Error fetching user orders:', error)
    toastStore.showError('An error occurred while fetching user orders')
    return { success: false, message: 'An error occurred while fetching user orders' }
  }
}
